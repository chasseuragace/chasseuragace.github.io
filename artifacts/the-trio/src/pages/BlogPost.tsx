import { useQuery } from "@tanstack/react-query";
import { useParams } from "wouter";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { PageLayout } from "@/layouts/PageLayout";
import { S, PAD } from "@/lib/styles";
import content from "@/data/content.json";

async function fetchPost(memberId: string, slug: string): Promise<string> {
  const res = await fetch(`/md/${memberId}/${slug}.md`);
  if (!res.ok) throw new Error("Post not found");
  const raw = await res.text();
  // Strip frontmatter before rendering
  if (raw.startsWith("---")) {
    const end = raw.indexOf("---", 3);
    if (end !== -1) return raw.slice(end + 3).trim();
  }
  return raw;
}

export default function BlogPost() {
  const { memberId, slug } = useParams<{ memberId: string; slug: string }>();

  const member = content.trio.members.find((m) => m.id === memberId);

  const { data: markdown, isLoading, error } = useQuery({
    queryKey: ["blog-post", memberId, slug],
    queryFn: () => fetchPost(memberId!, slug!),
    enabled: !!memberId && !!slug,
  });

  return (
    <PageLayout>
      <article
        style={{
          minHeight: "100vh",
          paddingTop: "120px",
          paddingBottom: "80px",
          paddingLeft: PAD,
          paddingRight: PAD,
          background: S.bgPrimary,
        }}
      >
        <div style={{ maxWidth: "720px", margin: "0 auto" }}>
          <a
            href={member?.path || "/"}
            style={{
              fontFamily: S.mono,
              fontSize: "12px",
              color: S.textSecondary,
              textDecoration: "none",
              letterSpacing: "0.06em",
              transition: "color 200ms ease",
              display: "inline-block",
              marginBottom: "48px",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.color = S.accent; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = S.textSecondary; }}
          >
            &larr; BACK TO {member?.navLabel || "HOME"}
          </a>

          {isLoading && (
            <p style={{ fontFamily: S.mono, fontSize: "14px", color: S.textSecondary }}>
              Loading...
            </p>
          )}

          {error && (
            <p style={{ fontFamily: S.mono, fontSize: "14px", color: "#8B3A3A" }}>
              Post not found.
            </p>
          )}

          {markdown && (
            <div className="blog-prose">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {markdown}
              </ReactMarkdown>
            </div>
          )}
        </div>
      </article>
    </PageLayout>
  );
}
