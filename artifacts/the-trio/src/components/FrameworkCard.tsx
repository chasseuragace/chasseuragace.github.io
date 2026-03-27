import { useState } from "react";

interface FrameworkTile {
  label: string;
  claim: string;
  body: string;
  source?: string;
  link?: string;
  linkLabel?: string;
}

interface FrameworkCardProps {
  tile: FrameworkTile;
  style?: React.CSSProperties;
}

const S = {
  bgCard: "#161616",
  bgBorder: "#222222",
  bgBack: "#111111",
  textPrimary: "#F0EDE6",
  textSecondary: "#888880",
  textMid: "#666660",
  accent: "#C8A96E",
  serif: "'DM Serif Display', serif",
  mono: "'DM Mono', monospace",
};

export function FrameworkCard({ tile, style }: FrameworkCardProps) {
  const [flipped, setFlipped] = useState(false);

  const hasLink = !!tile.link;

  return (
    <div
      style={{
        perspective: "1000px",
        height: "220px",
        cursor: hasLink ? "pointer" : "default",
        ...style,
      }}
      onMouseEnter={() => hasLink && setFlipped(true)}
      onMouseLeave={() => setFlipped(false)}
      role={hasLink ? "button" : undefined}
      aria-label={hasLink ? `View source for ${tile.label}` : undefined}
      tabIndex={hasLink ? 0 : undefined}
      onFocus={() => hasLink && setFlipped(true)}
      onBlur={() => setFlipped(false)}
      onKeyDown={(e) => {
        if (hasLink && (e.key === "Enter" || e.key === " ")) {
          window.open(tile.link, "_blank", "noopener noreferrer");
        }
      }}
    >
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          transformStyle: "preserve-3d",
          transition: "transform 480ms cubic-bezier(0.16, 1, 0.3, 1)",
          transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
      >
        {/* FRONT */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: S.bgCard,
            border: `1px solid ${S.bgBorder}`,
            padding: "28px",
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          <p style={{
            fontFamily: S.mono,
            fontSize: "10px",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: S.accent,
            marginBottom: "12px",
            flexShrink: 0,
          }}>
            {tile.label}
          </p>

          <h3 style={{
            fontFamily: S.serif,
            fontSize: "16px",
            color: S.textPrimary,
            marginBottom: "12px",
            lineHeight: 1.3,
            flexShrink: 0,
          }}>
            {tile.claim}
          </h3>

          <p style={{
            fontFamily: S.mono,
            fontSize: "13px",
            lineHeight: 1.65,
            color: S.textSecondary,
            flex: 1,
            overflow: "hidden",
          }}>
            {tile.body}
          </p>

          {hasLink && (
            <p style={{
              fontFamily: S.mono,
              fontSize: "10px",
              color: S.textMid,
              marginTop: "12px",
              letterSpacing: "0.06em",
              flexShrink: 0,
            }}>
              hover to view source
            </p>
          )}
        </div>

        {/* BACK */}
        {hasLink && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: S.bgBack,
              border: `1px solid ${S.accent}`,
              padding: "28px",
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <div>
              <p style={{
                fontFamily: S.mono,
                fontSize: "10px",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: S.accent,
                marginBottom: "16px",
              }}>
                Primary Source
              </p>

              <p style={{
                fontFamily: S.mono,
                fontSize: "14px",
                lineHeight: 1.65,
                color: S.textPrimary,
                marginBottom: "8px",
                fontWeight: 500,
              }}>
                {tile.label}
              </p>

              <p style={{
                fontFamily: S.mono,
                fontSize: "13px",
                lineHeight: 1.6,
                color: S.textSecondary,
              }}>
                {tile.source}
              </p>
            </div>

            <a
              href={tile.link}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              style={{
                display: "inline-block",
                fontFamily: S.mono,
                fontSize: "12px",
                color: S.accent,
                textDecoration: "none",
                borderBottom: `1px solid ${S.accent}`,
                paddingBottom: "2px",
                letterSpacing: "0.04em",
                transition: "color 150ms ease, border-color 150ms ease",
                alignSelf: "flex-start",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "#F0EDE6";
                e.currentTarget.style.borderBottomColor = "#F0EDE6";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "#C8A96E";
                e.currentTarget.style.borderBottomColor = "#C8A96E";
              }}
            >
              {tile.linkLabel}
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
