import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import content from "../data/content.json";

interface NavProps {
  onBookClick: () => void;
}

export function Nav({ onBookClick }: NavProps) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 80);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        height: "64px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 48px",
        background: scrolled ? "rgba(17,17,17,0.95)" : "transparent",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(12px)" : "none",
        borderBottom: scrolled ? "1px solid #222222" : "1px solid transparent",
        transition: "background 300ms ease, border-color 300ms ease, backdrop-filter 300ms ease",
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, delay: 0.1 }}
    >
      <span
        style={{ fontFamily: "'DM Serif Display', serif", fontSize: "18px", color: "#F0EDE6", letterSpacing: "0.02em" }}
      >
        {content.nav.wordmark}
      </span>

      <button
        onClick={onBookClick}
        style={{
          border: "1px solid #C8A96E",
          background: "transparent",
          color: "#C8A96E",
          fontFamily: "'DM Mono', monospace",
          fontSize: "12px",
          padding: "8px 20px",
          cursor: "pointer",
          transition: "background 200ms ease, color 200ms ease",
          letterSpacing: "0.06em",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "#C8A96E";
          e.currentTarget.style.color = "#0A0A0A";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "transparent";
          e.currentTarget.style.color = "#C8A96E";
        }}
      >
        {content.nav.cta}
      </button>
    </motion.nav>
  );
}
