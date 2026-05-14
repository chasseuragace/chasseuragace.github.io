import { fetchAssetsFromFirebase } from "./src/lib/firebase";

async function verify() {
  const assets = await fetchAssetsFromFirebase();
  const found = assets.find(a => a.title === "Arngeir Test");
  if (found) {
    console.log("Success! Found asset:", found);
  } else {
    console.log("Asset not found. Total assets:", assets.length);
  }
  process.exit(0);
}

verify();
