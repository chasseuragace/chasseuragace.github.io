import { useState } from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { PageLayout } from "@/layouts/PageLayout";
import { ScrollReveal } from "@/components/ScrollReveal";
import { S, PAD } from "@/lib/styles";

import { fetchAssetsFromFirebase, Asset } from "../lib/firebase";

function AssetCard({ asset }: { asset: Asset }) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: S.bgSurface,
        border: `1px solid ${hovered ? S.accent : S.bgBorder}`,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        height: "100%",
        transition: "border-color 200ms ease",
      }}
    >
      <div
        style={{
          padding: "32px",
          display: "flex",
          flexDirection: "column",
          flexGrow: 1,
        }}
      >
        <h3
          style={{
            fontFamily: S.serif,
            fontSize: "20px",
            color: S.textPrimary,
            marginBottom: "20px",
            lineHeight: 1.2,
            flexShrink: 0,
          }}
        >
          {asset.title}
        </h3>

        <div
          style={{
            fontFamily: S.mono,
            fontSize: "13px",
            lineHeight: 1.7,
            color: S.textSecondary,
            marginBottom: "20px",
            whiteSpace: "pre-wrap",
            flexGrow: 1,
            padding: "20px",
            background: S.bgPrimary,
            border: `1px solid ${S.bgBorder}`,
            textAlign: "justify",
            overflowY: "auto",
            maxHeight: "300px",
          }}
        >
          {asset.description}
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontFamily: S.mono,
            fontSize: "11px",
            color: S.textMid,
            paddingTop: "16px",
            borderTop: `1px solid ${S.bgBorder}`,
            flexShrink: 0,
          }}
        >
          <span>ID: {asset.id!.substring(0, 8)}...</span>
          {asset.createdAt && (
            <span>{new Date(asset.createdAt as Date).toLocaleDateString()}</span>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function AssetsSection() {
  const { data: assets = [], isLoading, error } = useQuery({
    queryKey: ["assets"],
    queryFn: fetchAssetsFromFirebase,
    retry: 2,
  });

  return (
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
            System Database
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
            <span style={{ display: "block" }}>AI Transformed Assets.</span>
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
            Inbound queries processed and transcribed into detailed narratives by the Cloudflare Worker's internal AI flow.
          </p>
        </ScrollReveal>

        {isLoading && (
          <p style={{ fontFamily: S.mono, fontSize: "14px", color: S.textSecondary }}>
            Loading assets...
          </p>
        )}

        {error && (
          <div
            style={{
              background: "#1a0a0a",
              border: "1px solid #8B3A3A",
              padding: "24px",
              marginBottom: "32px",
            }}
          >
            <p style={{ fontFamily: S.mono, fontSize: "14px", color: "#8B3A3A" }}>
              {error instanceof Error ? error.message : "Failed to load assets"}
            </p>
          </div>
        )}

        {!isLoading && !error && assets.length === 0 && (
          <p style={{ fontFamily: S.mono, fontSize: "14px", color: S.textSecondary, textAlign: "center", paddingTop: "48px" }}>
            No assets found
          </p>
        )}

        {!isLoading && !error && assets.length > 0 && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "24px",
            }}
            className="assets-grid"
          >
            {assets.map((asset, i) => (
              <ScrollReveal key={asset.id} delay={i * 0.06}>
                <AssetCard asset={asset} />
              </ScrollReveal>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default function Assets() {
  return (
    <PageLayout>
      <AssetsSection />
    </PageLayout>
  );
}
