import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import content from "../data/content.json";

interface NavProps {
  onBookClick: () => void;
}

const navLinks = [
  ...content.trio.members.map((m: any) => ({ href: m.path, label: m.navLabel })),
  { href: "/portfolio", label: "PORTFOLIO" },
  { href: "/queries", label: "QUERIES" },
];

export function Nav({ onBookClick }: NavProps) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [location] = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 80);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  return (
    <>
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
          background: scrolled || menuOpen ? "rgba(17,17,17,0.95)" : "transparent",
          backdropFilter: scrolled || menuOpen ? "blur(12px)" : "none",
          WebkitBackdropFilter: scrolled || menuOpen ? "blur(12px)" : "none",
          borderBottom: scrolled || menuOpen ? "1px solid #222222" : "1px solid transparent",
          transition: "background 300ms ease, border-color 300ms ease, backdrop-filter 300ms ease",
        }}
        className="nav-bar"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <a
          href="/"
          style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: "18px",
            color: "#F0EDE6",
            letterSpacing: "0.02em",
            textDecoration: "none",
            cursor: "pointer",
          }}
        >
          {content.nav.wordmark}
        </a>

        {/* Desktop links */}
        <div className="nav-links-desktop" style={{ display: "flex", gap: "32px", alignItems: "center" }}>
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: "12px",
                color: location.startsWith(link.href) ? "#C8A96E" : "#888880",
                textDecoration: "none",
                cursor: "pointer",
                transition: "color 200ms ease",
                letterSpacing: "0.06em",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "#C8A96E";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color =
                  location.startsWith(link.href) ? "#C8A96E" : "#888880";
              }}
            >
              {link.label}
            </a>
          ))}

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
        </div>

        {/* Mobile hamburger */}
        <button
          className="nav-hamburger"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          style={{
            display: "none",
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: "8px",
            flexDirection: "column",
            gap: "5px",
          }}
        >
          <span
            style={{
              display: "block",
              width: "20px",
              height: "1.5px",
              background: "#F0EDE6",
              transition: "transform 200ms ease, opacity 200ms ease",
              transform: menuOpen ? "rotate(45deg) translate(4px, 4px)" : "none",
            }}
          />
          <span
            style={{
              display: "block",
              width: "20px",
              height: "1.5px",
              background: "#F0EDE6",
              transition: "opacity 200ms ease",
              opacity: menuOpen ? 0 : 1,
            }}
          />
          <span
            style={{
              display: "block",
              width: "20px",
              height: "1.5px",
              background: "#F0EDE6",
              transition: "transform 200ms ease, opacity 200ms ease",
              transform: menuOpen ? "rotate(-45deg) translate(4px, -4px)" : "none",
            }}
          />
        </button>
      </motion.nav>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{
              position: "fixed",
              top: "64px",
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 49,
              background: "rgba(10,10,10,0.98)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
              display: "flex",
              flexDirection: "column",
              padding: "32px 48px",
              gap: "8px",
              overflowY: "auto",
            }}
          >
            {navLinks.map((link, i) => (
              <motion.a
                key={link.href}
                href={link.href}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: "14px",
                  color: location.startsWith(link.href) ? "#C8A96E" : "#888880",
                  textDecoration: "none",
                  padding: "16px 0",
                  borderBottom: "1px solid #222222",
                  letterSpacing: "0.06em",
                  transition: "color 200ms ease",
                }}
              >
                {link.label}
              </motion.a>
            ))}

            <motion.button
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: navLinks.length * 0.05 }}
              onClick={() => {
                setMenuOpen(false);
                onBookClick();
              }}
              style={{
                border: "1px solid #C8A96E",
                background: "transparent",
                color: "#C8A96E",
                fontFamily: "'DM Mono', monospace",
                fontSize: "14px",
                padding: "16px 24px",
                cursor: "pointer",
                letterSpacing: "0.06em",
                marginTop: "16px",
                textAlign: "center",
              }}
            >
              {content.nav.cta}
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
