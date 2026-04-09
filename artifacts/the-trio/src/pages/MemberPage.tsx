import { useState } from "react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "wouter";
import { PageLayout } from "@/layouts/PageLayout";
import { ScrollReveal } from "@/components/ScrollReveal";
import { S, PAD } from "@/lib/styles";
import content from "@/data/content.json";

interface BlogEntry {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
}

type Member = (typeof content.trio.members)[number];
type Page = NonNullable<Member["page"]>;

function HeroSection({ member, page }: { member: Member; page: Page }) {
  return (
    <section
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        background: S.bgPrimary,
        padding: `120px ${PAD} 80px`,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse 50% 60% at 20% 40%, rgba(200,169,110,0.06) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <div style={{ maxWidth: "900px", position: "relative" }}>
        <motion.p
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          style={{
            fontFamily: S.mono,
            fontSize: "11px",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: S.accent,
            marginBottom: "24px",
          }}
        >
          {member.role}
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          style={{
            fontFamily: S.serif,
            fontSize: "clamp(48px, 7vw, 88px)",
            lineHeight: 1.05,
            color: S.textPrimary,
            marginBottom: "32px",
          }}
        >
          {member.title}
        </motion.h1>

        <motion.div
          initial={{ width: 0 }}
          animate={{ width: "80px" }}
          transition={{ duration: 0.6, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          style={{ height: "2px", background: S.accent, marginBottom: "40px" }}
        />

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          style={{
            fontFamily: S.mono,
            fontSize: "18px",
            lineHeight: 1.75,
            color: S.textSecondary,
            maxWidth: "600px",
          }}
        >
          {page.heroSubtitle}
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          style={{ display: "flex", gap: "10px", marginTop: "36px", flexWrap: "wrap" }}
        >
          {member.tags.map((tag) => (
            <span
              key={tag}
              style={{
                padding: "6px 14px",
                border: `1px solid ${S.bgBorder}`,
                fontFamily: S.mono,
                fontSize: "11px",
                color: S.textMid,
                letterSpacing: "0.06em",
              }}
            >
              {tag}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function PhilosophySection({ member, page }: { member: Member; page: Page }) {
  const phil = page.philosophy;

  return (
    <section
      style={{
        background: S.bgSurface,
        padding: `120px ${PAD}`,
        borderTop: `1px solid ${S.bgBorder}`,
      }}
    >
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <ScrollReveal>
          <p
            style={{
              fontFamily: S.mono,
              fontSize: "11px",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: S.textSecondary,
              marginBottom: "16px",
            }}
          >
            {phil.label}
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
            {phil.heading.map((line, i) => (
              <span key={i} style={{ display: "block" }}>{line}</span>
            ))}
          </h2>
        </ScrollReveal>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "64px",
          }}
          className="philosophy-grid"
        >
          <div>
            {member.body.split("\n\n").map((para, i) => (
              <ScrollReveal key={i} delay={i * 0.1}>
                <p
                  style={{
                    fontFamily: S.mono,
                    fontSize: "15px",
                    lineHeight: 1.75,
                    color: S.textSecondary,
                    marginBottom: "24px",
                  }}
                >
                  {para}
                </p>
              </ScrollReveal>
            ))}
          </div>

          <ScrollReveal delay={0.2}>
            <div
              style={{
                background: S.bgCard,
                border: `1px solid ${S.bgBorder}`,
                borderLeft: `2px solid ${S.accent}`,
                padding: "40px 36px",
              }}
            >
              <p
                style={{
                  fontFamily: S.serif,
                  fontStyle: "italic",
                  fontSize: "22px",
                  color: S.accent,
                  lineHeight: 1.4,
                  marginBottom: "20px",
                }}
              >
                &ldquo;{phil.quote}&rdquo;
              </p>
              <p
                style={{
                  fontFamily: S.mono,
                  fontSize: "13px",
                  color: S.textMid,
                  lineHeight: 1.6,
                }}
              >
                {phil.quoteBody}
              </p>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}

function PrinciplesSection({ page }: { page: Page }) {
  const princ = page.principles;

  return (
    <section
      style={{
        background: S.bgPrimary,
        padding: `120px ${PAD}`,
        borderTop: `1px solid ${S.bgBorder}`,
      }}
    >
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <ScrollReveal>
          <p
            style={{
              fontFamily: S.mono,
              fontSize: "11px",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: S.textSecondary,
              marginBottom: "16px",
            }}
          >
            {princ.label}
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
            {princ.heading.map((line, i) => (
              <span key={i} style={{ display: "block" }}>{line}</span>
            ))}
          </h2>
        </ScrollReveal>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: "24px",
          }}
          className="principles-grid"
        >
          {princ.items.map((p, i) => (
            <ScrollReveal key={p.number} delay={i * 0.08}>
              <PrincipleCard principle={p} />
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function PrincipleCard({ principle }: { principle: { number: string; title: string; body: string } }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: S.bgCard,
        border: `1px solid ${hovered ? S.accent : S.bgBorder}`,
        padding: "36px 32px",
        transition: "border-color 200ms ease, transform 200ms ease",
        transform: hovered ? "translateY(-4px)" : "translateY(0)",
        cursor: "default",
      }}
    >
      <p
        style={{
          fontFamily: S.mono,
          fontSize: "11px",
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: S.textMid,
          marginBottom: "14px",
        }}
      >
        {principle.number}
      </p>
      <h3
        style={{
          fontFamily: S.serif,
          fontSize: "22px",
          color: S.textPrimary,
          marginBottom: "14px",
          lineHeight: 1.2,
        }}
      >
        {principle.title}
      </h3>
      <p
        style={{
          fontFamily: S.mono,
          fontSize: "14px",
          lineHeight: 1.7,
          color: S.textSecondary,
        }}
      >
        {principle.body}
      </p>
    </div>
  );
}

function RoleInTrioSection({ page }: { page: Page }) {
  const lineRef = useRef<HTMLDivElement>(null);
  const lineInView = useInView(lineRef, { once: true, margin: "-10% 0px" });
  const role = page.roleInTrio;

  return (
    <section
      style={{
        background: S.bgSurface,
        padding: `120px ${PAD}`,
        borderTop: `1px solid ${S.bgBorder}`,
      }}
    >
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <ScrollReveal>
          <p
            style={{
              fontFamily: S.mono,
              fontSize: "11px",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: S.textSecondary,
              marginBottom: "16px",
            }}
          >
            {role.label}
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
            {role.heading.map((line, i) => (
              <span key={i} style={{ display: "block" }}>{line}</span>
            ))}
          </h2>
        </ScrollReveal>

        <div style={{ position: "relative" }}>
          <div
            ref={lineRef}
            style={{
              position: "absolute",
              top: "24px",
              left: "0",
              height: "1px",
              width: lineInView ? "100%" : "0%",
              background: S.bgBorder,
              transition: "width 800ms cubic-bezier(0.16,1,0.3,1) 200ms",
            }}
          />

          <div
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(${role.stages.length}, 1fr)`,
              gap: "24px",
              position: "relative",
              zIndex: 1,
            }}
            className="role-grid"
          >
            {role.stages.map((stage, i) => (
              <ScrollReveal key={stage.label} delay={i * 0.1}>
                <div
                  style={{
                    background: S.bgCard,
                    border: `1px solid ${S.bgBorder}`,
                    padding: "32px 28px",
                  }}
                >
                  <span
                    style={{
                      display: "block",
                      width: "8px",
                      height: "8px",
                      borderRadius: "50%",
                      background: lineInView ? S.accent : "transparent",
                      transition: `background 200ms ease ${i * 160}ms`,
                      marginBottom: "20px",
                    }}
                  />
                  <h3
                    style={{
                      fontFamily: S.serif,
                      fontSize: "18px",
                      color: S.textPrimary,
                      marginBottom: "14px",
                      lineHeight: 1.2,
                    }}
                  >
                    {stage.label}
                  </h3>
                  <p
                    style={{
                      fontFamily: S.mono,
                      fontSize: "13px",
                      lineHeight: 1.7,
                      color: S.textSecondary,
                    }}
                  >
                    {stage.body}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function BlogSection({ member, page }: { member: Member; page: Page }) {
  const blog = page.blog;

  const { data: posts = [], isLoading } = useQuery<BlogEntry[]>({
    queryKey: ["blog-index", member.id],
    queryFn: async () => {
      const res = await fetch(`/md/${member.id}/_index.json`);
      if (!res.ok) return [];
      return res.json();
    },
  });

  if (!isLoading && posts.length === 0) return null;

  return (
    <section
      style={{
        background: S.bgPrimary,
        padding: `120px ${PAD}`,
        borderTop: `1px solid ${S.bgBorder}`,
      }}
    >
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <ScrollReveal>
          <p
            style={{
              fontFamily: S.mono,
              fontSize: "11px",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: S.textSecondary,
              marginBottom: "16px",
            }}
          >
            {blog.label}
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
            {blog.heading.map((line, i) => (
              <span key={i} style={{ display: "block" }}>{line}</span>
            ))}
          </h2>
        </ScrollReveal>

        {isLoading && (
          <p style={{ fontFamily: S.mono, fontSize: "14px", color: S.textSecondary }}>
            Loading posts...
          </p>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {posts.map((post, i) => (
            <ScrollReveal key={post.slug} delay={i * 0.08}>
              <BlogCard member={member} post={post} />
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function BlogCard({ member, post }: { member: Member; post: BlogEntry }) {
  const [hovered, setHovered] = useState(false);

  return (
    <a
      href={`${member.path}/blog/${post.slug}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "block",
        textDecoration: "none",
        background: S.bgCard,
        border: `1px solid ${hovered ? S.accent : S.bgBorder}`,
        padding: "36px 32px",
        transition: "border-color 200ms ease, transform 200ms ease",
        transform: hovered ? "translateY(-2px)" : "translateY(0)",
        cursor: "pointer",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: "24px",
          flexWrap: "wrap",
        }}
      >
        <div style={{ flex: 1, minWidth: "280px" }}>
          <h3
            style={{
              fontFamily: S.serif,
              fontSize: "22px",
              color: hovered ? S.accent : S.textPrimary,
              lineHeight: 1.2,
              marginBottom: "12px",
              transition: "color 200ms ease",
            }}
          >
            {post.title}
          </h3>
          <p
            style={{
              fontFamily: S.mono,
              fontSize: "14px",
              lineHeight: 1.7,
              color: S.textSecondary,
            }}
          >
            {post.excerpt}
          </p>
        </div>
        <span
          style={{
            fontFamily: S.mono,
            fontSize: "12px",
            color: S.textMid,
            letterSpacing: "0.04em",
            whiteSpace: "nowrap",
            flexShrink: 0,
            paddingTop: "4px",
          }}
        >
          {new Date(post.date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </span>
      </div>
    </a>
  );
}

function ClosingSection({ page }: { page: Page }) {
  const closing = page.closing;

  return (
    <section
      style={{
        background: S.bgSurface,
        padding: `100px ${PAD}`,
        borderTop: `1px solid ${S.bgBorder}`,
        textAlign: "center",
      }}
    >
      <ScrollReveal>
        <p
          style={{
            fontFamily: S.serif,
            fontStyle: "italic",
            fontSize: "clamp(20px, 3vw, 28px)",
            color: S.accent,
            lineHeight: 1.4,
            maxWidth: "700px",
            margin: "0 auto 24px",
          }}
        >
          &ldquo;{closing.quote}&rdquo;
        </p>
        <p
          style={{
            fontFamily: S.mono,
            fontSize: "13px",
            color: S.textMid,
          }}
        >
          {closing.attribution}
        </p>
      </ScrollReveal>
    </section>
  );
}

export default function MemberPage() {
  const { memberId } = useParams<{ memberId: string }>();
  const member = content.trio.members.find((m) => m.id === memberId);

  if (!member || !member.page) {
    return (
      <PageLayout>
        <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <p style={{ fontFamily: S.mono, fontSize: "14px", color: S.textSecondary }}>Member not found.</p>
        </div>
      </PageLayout>
    );
  }

  const page = member.page;

  return (
    <PageLayout>
      <main>
        <HeroSection member={member} page={page} />
        <PhilosophySection member={member} page={page} />
        <PrinciplesSection page={page} />
        <RoleInTrioSection page={page} />
        <BlogSection member={member} page={page} />
        <ClosingSection page={page} />
      </main>
    </PageLayout>
  );
}
