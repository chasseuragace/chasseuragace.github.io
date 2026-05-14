// src/lib/firebase.ts
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  query,
  where,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  Timestamp,
} from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAtAlEztbmOKbegvVPbEabRFrc2xIMm43o",
  authDomain: "eco-firebase-system.firebaseapp.com",
  projectId: "eco-firebase-system",
  storageBucket: "eco-firebase-system.firebasestorage.app",
  messagingSenderId: "628880423941",
  appId: "1:628880423941:web:65a2ef66a04b6fdc55706c",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// --- Test Utilities ---
export async function testFirebaseCRUD() {
  console.log("Starting Firebase CRUD test for assets...");

  const testAssetData = {
    title: "Test Asset for CRUD",
    description: "This is a temporary asset created for testing Firebase CRUD operations.",
    images: ["https://example.com/test-image.jpg"],
  };

  let addedAsset: Asset | null = null;

  try {
    // 1. Test Add Asset
    console.log("Adding test asset...");
    addedAsset = await addAssetToFirebase(testAssetData as Omit<Asset, 'id' | 'createdAt' | 'updatedAt'>);
    console.log("Asset added successfully:", addedAsset);

    if (!addedAsset || !addedAsset.id) {
      throw new Error("Failed to add asset or asset has no ID.");
    }

    // 2. Test Fetch Assets
    console.log("Fetching all assets...");
    const assets = await fetchAssetsFromFirebase();
    const fetchedAsset = assets.find(asset => asset.id === addedAsset!.id);

    if (!fetchedAsset) {
      throw new Error(`Asset with ID ${addedAsset.id} not found after fetching.`);
    }

    // 3. Verify Data (compare relevant fields, ignore timestamps for exact match if they differ slightly)
    console.log("Verifying fetched asset data...");
    if (fetchedAsset.title !== testAssetData.title ||
        fetchedAsset.description !== testAssetData.description ||
        fetchedAsset.images.join(',') !== testAssetData.images.join(',')) {
      throw new Error("Fetched asset data does not match added asset data.");
    }
    // Check if createdAt is a Date object (or Timestamp, depending on how it's read)
    if (!(fetchedAsset.createdAt instanceof Date || fetchedAsset.createdAt instanceof Timestamp)) {
        console.warn("Warning: createdAt is not a Date or Timestamp object. It is:", typeof fetchedAsset.createdAt);
    }

    console.log("Asset data verified successfully.");

    // 4. Test Delete Asset
    console.log("Deleting test asset...");
    await deleteAssetFromFirebase(addedAsset.id);
    console.log("Asset deleted successfully.");

    console.log("Firebase CRUD test completed successfully!");
    return true;

  } catch (error) {
    console.error("Firebase CRUD test failed:", error);
    // Attempt to clean up if asset was added but deletion failed
    if (addedAsset && addedAsset.id) {
      try {
        console.log("Attempting cleanup deletion...");
        await deleteAssetFromFirebase(addedAsset.id);
        console.log("Cleanup deletion successful.");
      } catch (cleanupError) {
        console.error("Cleanup deletion failed:", cleanupError);
      }
    }
    return false;
  }
}

// --- Data Models ---

// Using Pick to ensure compatibility with Firestore document data types
// Firestore Timestamps are used for dates
export interface Asset {
  id?: string; // Firestore document ID
  title: string;
  description: string;
  images: string[];
  createdAt?: Timestamp | Date; // Adjusted to allow Date for frontend display
  updatedAt?: Timestamp | Date; // Adjusted to allow Date for frontend display
}

export interface Booking {
  id?: string; // Firestore document ID
  name: string;
  email: string;
  company: string; // Mapped from stage
  message: string; // Constructed from context and stage
  createdAt?: Timestamp | Date; // Adjusted to allow Date for frontend display
}

// --- Asset Service ---

export const ASSET_COLLECTION_NAME = "assets";

export async function fetchAssetsFromFirebase(): Promise<Asset[]> {
  const assetsCollection = collection(db, ASSET_COLLECTION_NAME);
  // Basic query to get all assets. Add .orderBy() for sorting if needed.
  const q = query(assetsCollection);
  const querySnapshot = await getDocs(q);
  const assets: Asset[] = [];
  querySnapshot.forEach((doc) => {
    // Ensure date fields are converted from Firestore Timestamp to Date objects if they exist
    const data = doc.data();
    assets.push({
      id: doc.id,
      title: data.title,
      description: data.description,
      images: data.images,
      // Convert Timestamp to Date for frontend display if it's a Timestamp
      createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : data.createdAt,
      updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate() : data.updatedAt,
    });
  });
  return assets;
}

export async function addAssetToFirebase(assetData: Omit<Asset, 'id' | 'createdAt' | 'updatedAt'>): Promise<Asset> {
  const assetsCollection = collection(db, ASSET_COLLECTION_NAME);
  const newAsset = {
    ...assetData,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };
  const docRef = await addDoc(assetsCollection, newAsset);
  return { id: docRef.id, ...newAsset };
}

// Placeholder for update and delete operations if needed later
export async function updateAssetInFirebase(assetId: string, updatedData: Partial<Omit<Asset, 'id' | 'createdAt'>>): Promise<Asset> {
  const assetRef = doc(db, ASSET_COLLECTION_NAME, assetId);
  const finalData = { ...updatedData, updatedAt: Timestamp.now() };
  await updateDoc(assetRef, finalData);
  const docSnap = await getDoc(assetRef);
  const data = docSnap.data();
  return { id: docSnap.id, ...data } as Asset;
}

export async function deleteAssetFromFirebase(assetId: string): Promise<void> {
  await deleteDoc(doc(db, ASSET_COLLECTION_NAME, assetId));
}

// --- Booking Service ---

export const BOOKING_COLLECTION_NAME = "bookings";

// Booking data structure for sending to Firebase
// 'company' is mapped from 'stage', 'message' is constructed
export interface BookingPayload {
  name: string;
  email: string;
  company: string;
  message: string;
}

export async function submitBookingToFirebase(bookingPayload: BookingPayload): Promise<Booking> {
  const bookingsCollection = collection(db, BOOKING_COLLECTION_NAME);
  const newBooking = {
    ...bookingPayload,
    createdAt: Timestamp.now(),
  };
  const docRef = await addDoc(bookingsCollection, newBooking);
  return { id: docRef.id, ...newBooking };
}

export async function fetchBookingsFromFirebase(): Promise<Booking[]> {
  const bookingsCollection = collection(db, BOOKING_COLLECTION_NAME);
  // Basic query to get all bookings. Add .orderBy() for sorting if needed.
  const q = query(bookingsCollection);
  const querySnapshot = await getDocs(q);
  const bookings: Booking[] = [];
  querySnapshot.forEach((doc) => {
    const data = doc.data();
    bookings.push({
      id: doc.id,
      name: data.name,
      email: data.email,
      company: data.company,
      message: data.message,
      createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : data.createdAt,
    });
  });
  return bookings;
}

// Placeholder for update and delete operations if needed later
export async function updateBookingInFirebase(bookingId: string, updatedData: Partial<Omit<Booking, 'id' | 'createdAt'>>): Promise<Booking> {
  const bookingRef = doc(db, BOOKING_COLLECTION_NAME, bookingId);
  await updateDoc(bookingRef, updatedData);
  const docSnap = await getDoc(bookingRef);
  const data = docSnap.data();
  return { id: docSnap.id, ...data } as Booking;
}

export async function deleteBookingFromFirebase(bookingId: string): Promise<void> {
  await deleteDoc(doc(db, BOOKING_COLLECTION_NAME, bookingId));
}
