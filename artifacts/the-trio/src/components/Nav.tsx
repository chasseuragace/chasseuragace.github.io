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
      className="fixed top-0 left-0 right-0 z-50 px-6 md:px-12 h-16 flex items-center justify-between transition-all duration-300"
      style={{
        background: scrolled ? "rgba(17,17,17,0.95)" : "transparent",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        borderBottom: scrolled ? "1px solid #222222" : "1px solid transparent",
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, delay: 0.1 }}
    >
      <span
        className="text-primary-text font-serif"
        style={{ fontFamily: "'DM Serif Display', serif", fontSize: "18px", color: "#F0EDE6" }}
      >
        {content.nav.wordmark}
      </span>

      <button
        onClick={onBookClick}
        className="nav-cta"
        style={{
          border: "1px solid #C8A96E",
          background: "transparent",
          color: "#C8A96E",
          fontFamily: "'DM Mono', monospace",
          fontSize: "12px",
          padding: "8px 20px",
          cursor: "pointer",
          transition: "all 200ms ease",
          letterSpacing: "0.04em",
        }}
        onMouseEnter={(e) => {
          const el = e.currentTarget;
          el.style.background = "#C8A96E";
          el.style.color = "#0A0A0A";
        }}
        onMouseLeave={(e) => {
          const el = e.currentTarget;
          el.style.background = "transparent";
          el.style.color = "#C8A96E";
        }}
      >
        {content.nav.cta}
      </button>
    </motion.nav>
  );
}
