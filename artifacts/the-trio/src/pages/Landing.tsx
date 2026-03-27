import { useRef, useState, useEffect } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { Nav } from "../components/Nav";
import { BookingModal } from "../components/BookingModal";
import { ScrollReveal } from "../components/ScrollReveal";
import content from "../data/content.json";

const S = {
  bgPrimary: "#0A0A0A",
  bgSurface: "#111111",
  bgCard: "#161616",
  bgBorder: "#222222",
  textPrimary: "#F0EDE6",
  textSecondary: "#888880",
  textGhost: "#333330",
  accent: "#C8A96E",
  accentDim: "#7A6340",
  serif: "'DM Serif Display', serif",
  mono: "'DM Mono', monospace",
};

function HeroSection({ onBookClick }: { onBookClick: () => void }) {
  const ruleRef = useRef<HTMLDivElement>(null);
  const ruleInView = useInView(ruleRef, { once: true });
  const [scrollProgress, setScrollProgress] = useState(1);

  useEffect(() => {
    const onScroll = () => {
      const progress = Math.max(0, 1 - window.scrollY / (window.innerHeight * 0.2));
      setScrollProgress(progress);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = (delay: number) => ({
    hidden: { opacity: 0, y: -12 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1], delay } },
  });

  return (
    <section
      id="hero"
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        background: S.bgPrimary,
        padding: "0 6vw",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(ellipse 60% 50% at 30% 50%, rgba(200,169,110,0.05) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <motion.div
        style={{ paddingTop: "80px", maxWidth: "860px" }}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.p
          variants={itemVariants(0)}
          style={{
            fontFamily: S.mono,
            fontSize: "11px",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: S.textSecondary,
            marginBottom: "28px",
          }}
        >
          {content.hero.label}
        </motion.p>

        <h1
          style={{
            fontFamily: S.serif,
            fontSize: "clamp(56px, 8vw, 96px)",
            lineHeight: 1.05,
            color: S.textPrimary,
            marginBottom: "32px",
          }}
        >
          {content.hero.headingLines.map((line, i) => (
            <motion.span key={i} variants={itemVariants(i * 0.1)} style={{ display: "block" }}>
              {line}
            </motion.span>
          ))}
        </h1>

        <motion.p
          variants={itemVariants(0.45)}
          style={{
            fontFamily: S.mono,
            fontSize: "16px",
            lineHeight: 1.75,
            color: S.textSecondary,
            maxWidth: "480px",
            marginBottom: "40px",
          }}
        >
          {content.hero.body}
        </motion.p>

        <motion.div
          variants={itemVariants(0.6)}
          style={{ display: "flex", gap: "20px", alignItems: "center", flexWrap: "wrap", marginBottom: "40px" }}
        >
          <button
            onClick={onBookClick}
            style={{
              background: "transparent",
              border: "1px solid #C8A96E",
              color: "#C8A96E",
              fontFamily: S.mono,
              fontSize: "14px",
              padding: "14px 32px",
              cursor: "pointer",
              transition: "all 200ms ease",
              letterSpacing: "0.04em",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "#C8A96E"; e.currentTarget.style.color = "#0A0A0A"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#C8A96E"; }}
          >
            {content.hero.cta1}
          </button>

          <a
            href="#process"
            style={{
              fontFamily: S.mono,
              fontSize: "14px",
              color: S.textSecondary,
              textDecoration: "none",
              letterSpacing: "0.04em",
              transition: "color 200ms ease",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.color = S.textPrimary; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = S.textSecondary; }}
          >
            {content.hero.cta2}
          </a>
        </motion.div>

        <motion.div
          ref={ruleRef}
          style={{
            height: "1px",
            width: ruleInView ? "80px" : "0px",
            background: S.accent,
            transition: "width 600ms cubic-bezier(0.16,1,0.3,1) 700ms",
          }}
        />
      </motion.div>

      <AnimatePresence>
        {scrollProgress > 0 && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: "absolute",
              bottom: "40px",
              left: "50%",
              transform: "translateX(-50%)",
              opacity: scrollProgress,
              fontFamily: S.mono,
              fontSize: "18px",
              color: S.textGhost,
              userSelect: "none",
            }}
          >
            ↓
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

function ProblemSection() {
  return (
    <section
      style={{
        background: S.bgPrimary,
        padding: "120px 6vw",
        borderTop: `1px solid ${S.bgBorder}`,
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <ScrollReveal>
          <h2
            style={{
              fontFamily: S.serif,
              fontSize: "clamp(32px, 4vw, 52px)",
              lineHeight: 1.15,
              color: S.textPrimary,
              marginBottom: "64px",
            }}
          >
            {content.problem.heading.map((line, i) => (
              <span key={i} style={{ display: "block" }}>{line}</span>
            ))}
          </h2>
        </ScrollReveal>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "80px",
          }}
          className="problem-grid"
        >
          <div>
            {content.problem.items.map((item, i) => (
              <ScrollReveal key={item.number} delay={i * 0.1}>
                <div style={{ position: "relative", marginBottom: "56px" }}>
                  <span
                    style={{
                      position: "absolute",
                      top: "-12px",
                      left: "-8px",
                      fontFamily: S.mono,
                      fontSize: "72px",
                      color: S.textGhost,
                      lineHeight: 1,
                      userSelect: "none",
                      zIndex: 0,
                    }}
                    aria-hidden="true"
                  >
                    {item.number}
                  </span>
                  <div style={{ position: "relative", zIndex: 1, paddingTop: "40px" }}>
                    <p
                      style={{
                        fontFamily: S.mono,
                        fontSize: "11px",
                        letterSpacing: "0.12em",
                        textTransform: "uppercase",
                        color: S.textSecondary,
                        marginBottom: "10px",
                      }}
                    >
                      {item.label}
                    </p>
                    <p style={{ fontFamily: S.mono, fontSize: "15px", lineHeight: 1.7, color: S.textPrimary }}>
                      {item.body}
                    </p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>

          <div>
            <ScrollReveal delay={0.2}>
              <p
                style={{
                  fontFamily: S.serif,
                  fontStyle: "italic",
                  fontSize: "24px",
                  color: S.accent,
                  marginBottom: "24px",
                  lineHeight: 1.3,
                }}
              >
                &ldquo;{content.problem.pullQuote}&rdquo;
              </p>

              <p style={{ fontFamily: S.mono, fontSize: "15px", lineHeight: 1.75, color: S.textSecondary, marginBottom: "32px" }}>
                {content.problem.pullQuoteBody}
              </p>

              <div style={{ height: "1px", background: S.bgBorder, marginBottom: "24px" }} />

              <p style={{ fontFamily: S.mono, fontSize: "11px", letterSpacing: "0.04em", color: S.textGhost, lineHeight: 1.6 }}>
                {content.problem.footnote}
              </p>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  );
}

function ProcessSection() {
  const lineRef = useRef<HTMLDivElement>(null);
  const lineInView = useInView(lineRef, { once: true, margin: "-10% 0px" });

  return (
    <section
      id="process"
      style={{
        background: S.bgSurface,
        padding: "120px 6vw",
        borderTop: `1px solid ${S.bgBorder}`,
      }}
    >
      <div style={{ maxWidth: "1300px", margin: "0 auto" }}>
        <ScrollReveal>
          <p style={{ fontFamily: S.mono, fontSize: "11px", letterSpacing: "0.12em", textTransform: "uppercase", color: S.textSecondary, marginBottom: "16px" }}>
            {content.process.label}
          </p>
          <h2
            style={{
              fontFamily: S.serif,
              fontSize: "clamp(32px, 4vw, 52px)",
              lineHeight: 1.15,
              color: S.textPrimary,
              marginBottom: "64px",
            }}
          >
            {content.process.heading.map((line, i) => (
              <span key={i} style={{ display: "block" }}>{line}</span>
            ))}
          </h2>
        </ScrollReveal>

        <div style={{ position: "relative" }}>
          <div
            ref={lineRef}
            style={{
              position: "absolute",
              top: "28px",
              left: "0",
              height: "1px",
              width: lineInView ? "100%" : "0%",
              background: S.bgBorder,
              transition: "width 800ms cubic-bezier(0.16,1,0.3,1) 200ms",
              zIndex: 0,
            }}
            className="process-connector"
          />

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(5, 1fr)",
              gap: "24px",
              position: "relative",
              zIndex: 1,
            }}
            className="stages-grid"
          >
            {content.process.stages.map((stage, i) => (
              <ScrollReveal key={stage.number} delay={i * 0.08}>
                <StageCard stage={stage} index={i} lineInView={lineInView} />
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function StageCard({ stage, index, lineInView }: { stage: typeof content.process.stages[0]; index: number; lineInView: boolean }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: S.bgCard,
        border: `1px solid ${hovered ? S.accent : S.bgBorder}`,
        padding: "28px 24px",
        transform: hovered ? "translateY(-4px)" : "translateY(0)",
        transition: "border-color 200ms ease, transform 200ms ease",
        position: "relative",
        cursor: "default",
      }}
    >
      <span
        style={{
          display: "block",
          width: "8px",
          height: "8px",
          borderRadius: "50%",
          background: lineInView ? S.accent : "transparent",
          transition: `background 200ms ease ${index * 160}ms`,
          marginBottom: "20px",
        }}
      />
      <p style={{ fontFamily: S.mono, fontSize: "11px", letterSpacing: "0.12em", textTransform: "uppercase", color: S.textGhost, marginBottom: "12px" }}>
        {stage.number}
      </p>
      <h3 style={{ fontFamily: S.serif, fontSize: "18px", color: S.textPrimary, marginBottom: "12px", lineHeight: 1.2 }}>
        {stage.title}
      </h3>
      <p style={{ fontFamily: S.mono, fontSize: "13px", lineHeight: 1.6, color: S.textSecondary }}>
        {stage.body}
      </p>
    </div>
  );
}

function SystemSection() {
  return (
    <section
      style={{
        background: S.bgPrimary,
        padding: "120px 6vw",
        borderTop: `1px solid ${S.bgBorder}`,
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <ScrollReveal>
          <p style={{ fontFamily: S.mono, fontSize: "11px", letterSpacing: "0.12em", textTransform: "uppercase", color: S.textSecondary, marginBottom: "16px" }}>
            {content.system.label}
          </p>
          <h2
            style={{
              fontFamily: S.serif,
              fontSize: "clamp(32px, 4vw, 52px)",
              lineHeight: 1.15,
              color: S.textPrimary,
              marginBottom: "64px",
            }}
          >
            {content.system.heading.map((line, i) => (
              <span key={i} style={{ display: "block" }}>{line}</span>
            ))}
          </h2>
        </ScrollReveal>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "48px", alignItems: "start" }} className="system-grid">
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            {content.system.cards.map((card, i) => (
              <ScrollReveal key={card.tag} delay={i * 0.1}>
                <div
                  style={{
                    background: S.bgCard,
                    border: `1px solid ${S.bgBorder}`,
                    padding: "32px",
                  }}
                >
                  <p style={{ fontFamily: S.mono, fontSize: "11px", letterSpacing: "0.12em", textTransform: "uppercase", color: S.accent, marginBottom: "16px" }}>
                    {card.tag}
                  </p>
                  <p style={{ fontFamily: S.mono, fontSize: "14px", lineHeight: 1.75, color: S.textSecondary, marginBottom: "20px" }}>
                    {card.body}
                  </p>
                  <p style={{ fontFamily: S.mono, fontSize: "11px", color: S.textGhost, letterSpacing: "0.04em" }}>
                    {card.footer}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>

          <ScrollReveal delay={0.2} className="system-pipeline">
            <div
              style={{
                background: S.bgCard,
                border: `1px solid ${S.bgBorder}`,
                padding: "32px",
                overflowX: "auto",
              }}
            >
              <pre
                style={{
                  fontFamily: S.mono,
                  fontSize: "12px",
                  lineHeight: 1.6,
                  color: S.textGhost,
                  margin: 0,
                  whiteSpace: "pre",
                }}
              >
                {content.system.pipeline.join("\n")}
              </pre>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}

function TrioSection({ onBookClick }: { onBookClick: () => void }) {
  return (
    <section
      style={{
        background: S.bgSurface,
        padding: "120px 6vw",
        borderTop: `1px solid ${S.bgBorder}`,
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <ScrollReveal>
          <p style={{ fontFamily: S.mono, fontSize: "11px", letterSpacing: "0.12em", textTransform: "uppercase", color: S.textSecondary, marginBottom: "16px" }}>
            {content.trio.label}
          </p>
          <h2
            style={{
              fontFamily: S.serif,
              fontSize: "clamp(32px, 4vw, 52px)",
              lineHeight: 1.15,
              color: S.textPrimary,
              marginBottom: "64px",
            }}
          >
            {content.trio.heading.map((line, i) => (
              <span key={i} style={{ display: "block" }}>{line}</span>
            ))}
          </h2>
        </ScrollReveal>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "24px", marginBottom: "56px" }} className="trio-grid">
          {content.trio.members.map((member, i) => (
            <ScrollReveal key={member.role} delay={i * 0.1}>
              <MemberCard member={member} />
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal delay={0.3}>
          <p
            style={{
              fontFamily: S.serif,
              fontStyle: "italic",
              fontSize: "18px",
              color: S.textSecondary,
              textAlign: "center",
              lineHeight: 1.5,
            }}
          >
            &ldquo;{content.trio.closingQuote}&rdquo;
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}

function MemberCard({ member }: { member: typeof content.trio.members[0] }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: S.bgSurface,
        border: `1px solid ${S.bgBorder}`,
        borderTop: `2px solid ${S.accent}`,
        padding: "40px 32px",
        position: "relative",
        boxShadow: hovered ? "0 0 40px rgba(200,169,110,0.06)" : "none",
        transition: "box-shadow 300ms ease",
      }}
    >
      <p style={{ fontFamily: S.mono, fontSize: "11px", letterSpacing: "0.12em", textTransform: "uppercase", color: S.textSecondary, marginBottom: "10px" }}>
        {member.role}
      </p>
      <h3 style={{ fontFamily: S.serif, fontSize: "26px", color: S.textPrimary, marginBottom: "20px", lineHeight: 1.1 }}>
        {member.title}
      </h3>

      <div style={{ height: "1px", background: S.bgBorder, marginBottom: "20px" }} />

      <div style={{ fontFamily: S.mono, fontSize: "14px", lineHeight: 1.7, color: S.textSecondary, marginBottom: "28px" }}>
        {member.body.split("\n\n").map((para, i) => (
          <p key={i} style={{ marginBottom: i < member.body.split("\n\n").length - 1 ? "16px" : "0" }}>{para}</p>
        ))}
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
        {member.tags.map((tag) => (
          <span
            key={tag}
            style={{
              display: "inline-block",
              padding: "4px 10px",
              border: `1px solid ${S.bgBorder}`,
              borderRadius: "2px",
              fontFamily: S.mono,
              fontSize: "11px",
              color: S.textGhost,
              letterSpacing: "0.06em",
            }}
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}

function FrameworksSection() {
  return (
    <section
      style={{
        background: S.bgPrimary,
        padding: "120px 6vw",
        borderTop: `1px solid ${S.bgBorder}`,
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <ScrollReveal>
          <p style={{ fontFamily: S.mono, fontSize: "11px", letterSpacing: "0.12em", textTransform: "uppercase", color: S.textSecondary, marginBottom: "16px" }}>
            {content.frameworks.label}
          </p>
          <h2
            style={{
              fontFamily: S.serif,
              fontSize: "clamp(32px, 4vw, 52px)",
              lineHeight: 1.15,
              color: S.textPrimary,
              marginBottom: "20px",
            }}
          >
            {content.frameworks.heading.map((line, i) => (
              <span key={i} style={{ display: "block" }}>{line}</span>
            ))}
          </h2>
          <p style={{ fontFamily: S.mono, fontSize: "16px", lineHeight: 1.6, color: S.textSecondary, maxWidth: "640px", marginBottom: "64px" }}>
            {content.frameworks.subheading}
          </p>
        </ScrollReveal>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }} className="frameworks-grid">
          {content.frameworks.tiles.map((tile, i) => {
            const row = Math.floor(i / 3);
            const col = i % 3;
            const delay = row * 0.1 + col * 0.06;
            return (
              <ScrollReveal key={tile.label} delay={delay}>
                <div
                  style={{
                    background: S.bgCard,
                    border: `1px solid ${S.bgBorder}`,
                    padding: "28px",
                  }}
                >
                  <p style={{ fontFamily: S.mono, fontSize: "10px", letterSpacing: "0.1em", textTransform: "uppercase", color: S.accent, marginBottom: "12px" }}>
                    {tile.label}
                  </p>
                  <h3 style={{ fontFamily: S.serif, fontSize: "16px", color: S.textPrimary, marginBottom: "12px", lineHeight: 1.3 }}>
                    {tile.claim}
                  </h3>
                  <p style={{ fontFamily: S.mono, fontSize: "13px", lineHeight: 1.65, color: S.textSecondary }}>
                    {tile.body}
                  </p>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function CTASection({ onBookClick }: { onBookClick: () => void }) {
  return (
    <section
      style={{
        background: S.bgSurface,
        padding: "140px 6vw",
        borderTop: `1px solid ${S.bgBorder}`,
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(ellipse 50% 70% at 50% 50%, rgba(200,169,110,0.08) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <div style={{ position: "relative", zIndex: 1 }}>
        <ScrollReveal>
          <p style={{ fontFamily: S.mono, fontSize: "11px", letterSpacing: "0.12em", textTransform: "uppercase", color: S.textGhost, marginBottom: "24px" }}>
            {content.cta.label}
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <h2
            style={{
              fontFamily: S.serif,
              fontSize: "clamp(32px, 4vw, 52px)",
              lineHeight: 1.15,
              color: S.textPrimary,
              marginBottom: "28px",
            }}
          >
            {content.cta.heading.map((line, i) => (
              <span key={i} style={{ display: "block" }}>{line}</span>
            ))}
          </h2>
        </ScrollReveal>

        <ScrollReveal delay={0.2}>
          <p
            style={{
              fontFamily: S.mono,
              fontSize: "16px",
              lineHeight: 1.75,
              color: S.textSecondary,
              maxWidth: "520px",
              margin: "0 auto 48px",
            }}
          >
            {content.cta.body}
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.3}>
          <button
            onClick={onBookClick}
            style={{
              background: S.accent,
              color: S.bgPrimary,
              border: "none",
              fontFamily: S.mono,
              fontSize: "14px",
              padding: "18px 48px",
              cursor: "pointer",
              borderRadius: "2px",
              letterSpacing: "0.04em",
              transition: "all 200ms cubic-bezier(0.34,1.56,0.64,1)",
              display: "inline-block",
              marginBottom: "28px",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = S.accentDim;
              e.currentTarget.style.color = S.textPrimary;
              e.currentTarget.style.transform = "scale(1.02)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = S.accent;
              e.currentTarget.style.color = S.bgPrimary;
              e.currentTarget.style.transform = "scale(1)";
            }}
          >
            {content.cta.button}
          </button>

          <p style={{ fontFamily: S.mono, fontSize: "12px", color: S.textGhost }}>
            {content.cta.footnote}
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}

function Footer({ onBookClick }: { onBookClick: () => void }) {
  return (
    <footer
      style={{
        background: S.bgPrimary,
        borderTop: `1px solid ${S.bgBorder}`,
        padding: "48px 6vw",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "24px",
          flexWrap: "wrap",
          gap: "20px",
        }}
        className="footer-row"
      >
        <span style={{ fontFamily: S.serif, fontSize: "18px", color: S.textPrimary }}>
          {content.footer.wordmark}
        </span>

        <p style={{ fontFamily: S.mono, fontSize: "12px", color: S.textGhost, textAlign: "center" }}>
          {content.footer.subtitle}
        </p>

        <button
          onClick={onBookClick}
          style={{
            border: `1px solid ${S.accent}`,
            background: "transparent",
            color: S.accent,
            fontFamily: S.mono,
            fontSize: "12px",
            padding: "8px 20px",
            cursor: "pointer",
            transition: "all 200ms ease",
            letterSpacing: "0.04em",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = S.accent; e.currentTarget.style.color = S.bgPrimary; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = S.accent; }}
        >
          {content.footer.cta}
        </button>
      </div>

      <div style={{ height: "1px", background: S.bgBorder, maxWidth: "1200px", margin: "0 auto 20px" }} />

      <p style={{ fontFamily: S.mono, fontSize: "11px", color: S.textGhost, textAlign: "center" }}>
        {content.footer.copyright}
      </p>
    </footer>
  );
}

export default function Landing() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div style={{ background: S.bgPrimary, minHeight: "100vh" }}>
      <Nav onBookClick={() => setModalOpen(true)} />
      <main>
        <HeroSection onBookClick={() => setModalOpen(true)} />
        <ProblemSection />
        <ProcessSection />
        <SystemSection />
        <TrioSection onBookClick={() => setModalOpen(true)} />
        <FrameworksSection />
        <CTASection onBookClick={() => setModalOpen(true)} />
      </main>
      <Footer onBookClick={() => setModalOpen(true)} />
      <BookingModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}
