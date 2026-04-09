import { useState } from "react";
import { PageLayout } from "@/layouts/PageLayout";
import { ScrollReveal } from "@/components/ScrollReveal";
import { S, PAD } from "@/lib/styles";
import content from "@/data/content.json";

const portfolio = content.portfolio;

interface Project {
  title: string;
  description: string;
  url: string;
  imageUrl: string;
}

const membersWithPortfolio = content.trio.members.filter(
  (m: any) => m.page?.portfolio && m.page.portfolio.length > 0
);

function ProjectCard({ project }: { project: Project }) {
  const [hovered, setHovered] = useState(false);
  const hasImage = !!project.imageUrl;
  const hasUrl = !!project.url;

  const Tag = hasUrl ? "a" : "div";
  const linkProps = hasUrl
    ? { href: project.url, target: "_blank", rel: "noopener noreferrer" }
    : {};

  return (
    <Tag
      {...linkProps}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "block",
        textDecoration: "none",
        background: S.bgSurface,
        border: `1px solid ${hovered ? S.accent : S.bgBorder}`,
        overflow: "hidden",
        transition: "border-color 200ms ease",
        cursor: hasUrl ? "pointer" : "default",
      }}
    >
      <div
        style={{
          width: "100%",
          aspectRatio: "16 / 10",
          background: S.bgPrimary,
          overflow: "hidden",
          position: "relative",
        }}
      >
        {hasImage ? (
          <img
            src={project.imageUrl}
            alt={project.title}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : hasUrl ? (
          <>
            <iframe
              src={project.url}
              title={project.title}
              style={{
                width: "100%",
                height: "100%",
                border: "none",
                pointerEvents: "none",
              }}
              loading="lazy"
              sandbox="allow-scripts allow-same-origin"
            />
            <div
              style={{
                position: "absolute",
                inset: 0,
              }}
            />
          </>
        ) : (
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: S.mono,
              fontSize: "13px",
              color: S.textGhost,
            }}
          >
            No preview available
          </div>
        )}
      </div>

      <div style={{ padding: "32px" }}>
        <h3
          style={{
            fontFamily: S.serif,
            fontSize: "22px",
            color: S.textPrimary,
            marginBottom: "14px",
            lineHeight: 1.2,
          }}
        >
          {project.title}
        </h3>
        <p
          style={{
            fontFamily: S.mono,
            fontSize: "14px",
            lineHeight: 1.7,
            color: S.textSecondary,
          }}
        >
          {project.description}
        </p>
      </div>
    </Tag>
  );
}

export default function Portfolio() {
  return (
    <PageLayout>
      {/* Trio-level portfolio */}
      <section
        style={{
          minHeight: "100vh",
          paddingTop: "140px",
          paddingBottom: "80px",
          paddingLeft: PAD,
          paddingRight: PAD,
          background: S.bgPrimary,
        }}
      >
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
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
              {portfolio.label}
            </p>
            <h2
              style={{
                fontFamily: S.serif,
                fontSize: "clamp(32px, 4vw, 52px)",
                lineHeight: 1.15,
                color: S.textPrimary,
                marginBottom: "16px",
              }}
            >
              {portfolio.heading.map((line, i) => (
                <span key={i} style={{ display: "block" }}>{line}</span>
              ))}
            </h2>
            <p
              style={{
                fontFamily: S.mono,
                fontSize: "15px",
                lineHeight: 1.7,
                color: S.textSecondary,
                maxWidth: "560px",
                marginBottom: "64px",
              }}
            >
              {portfolio.subheading}
            </p>
          </ScrollReveal>

          {portfolio.projects.length > 0 && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: "24px",
              }}
              className="portfolio-grid"
            >
              {portfolio.projects.map((project, i) => (
                <ScrollReveal key={project.title} delay={i * 0.08}>
                  <ProjectCard project={project} />
                </ScrollReveal>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Per-member portfolios */}
      {membersWithPortfolio.map((member: any) => (
        <section
          key={member.id}
          style={{
            paddingTop: "80px",
            paddingBottom: "80px",
            paddingLeft: PAD,
            paddingRight: PAD,
            background: S.bgSurface,
            borderTop: `1px solid ${S.bgBorder}`,
          }}
        >
          <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
            <ScrollReveal>
              <p
                style={{
                  fontFamily: S.mono,
                  fontSize: "11px",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: S.accent,
                  marginBottom: "12px",
                }}
              >
                {member.role}
              </p>
              <h3
                style={{
                  fontFamily: S.serif,
                  fontSize: "clamp(24px, 3vw, 36px)",
                  lineHeight: 1.15,
                  color: S.textPrimary,
                  marginBottom: "48px",
                }}
              >
                {member.title}'s builds.
              </h3>
            </ScrollReveal>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: "24px",
              }}
              className="portfolio-member-grid"
            >
              {member.page.portfolio.map((project: Project, i: number) => (
                <ScrollReveal key={project.title} delay={i * 0.06}>
                  <ProjectCard project={project} />
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      ))}
    </PageLayout>
  );
}
