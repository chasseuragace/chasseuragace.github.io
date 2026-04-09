import { useState, type ReactNode } from "react";
import { Nav } from "@/components/Nav";
import { BookingModal } from "@/components/BookingModal";
import { S } from "@/lib/styles";

interface PageLayoutProps {
  children: ReactNode | ((openBooking: () => void) => ReactNode);
}

export function PageLayout({ children }: PageLayoutProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const openBooking = () => setModalOpen(true);

  return (
    <div style={{ background: S.bgPrimary, minHeight: "100vh" }}>
      <Nav onBookClick={openBooking} />
      {typeof children === "function" ? children(openBooking) : children}
      <BookingModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}
