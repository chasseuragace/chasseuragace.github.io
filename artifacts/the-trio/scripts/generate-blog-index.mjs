import { readdir, readFile, writeFile } from "fs/promises";
import { join, basename } from "path";

const MD_ROOT = new URL("../public/md", import.meta.url).pathname;

async function parseFrontmatter(filePath) {
  const raw = await readFile(filePath, "utf-8");
  if (!raw.startsWith("---")) return null;

  const end = raw.indexOf("---", 3);
  if (end === -1) return null;

  const block = raw.slice(3, end).trim();
  const meta = {};
  for (const line of block.split("\n")) {
    const colon = line.indexOf(":");
    if (colon === -1) continue;
    const key = line.slice(0, colon).trim();
    const value = line.slice(colon + 1).trim();
    meta[key] = value;
  }
  meta.slug = basename(filePath, ".md");
  return meta;
}

async function generateIndex(memberDir) {
  const dirPath = join(MD_ROOT, memberDir);
  let files;
  try {
    files = await readdir(dirPath);
  } catch {
    return;
  }

  const mdFiles = files.filter((f) => f.endsWith(".md"));
  const entries = [];

  for (const file of mdFiles) {
    const meta = await parseFrontmatter(join(dirPath, file));
    if (meta && meta.title && meta.date) {
      entries.push({
        slug: meta.slug,
        title: meta.title,
        date: meta.date,
        excerpt: meta.excerpt || "",
      });
    }
  }

  entries.sort((a, b) => b.date.localeCompare(a.date));

  const outPath = join(dirPath, "_index.json");
  await writeFile(outPath, JSON.stringify(entries, null, 2) + "\n");
  console.log(`  ${memberDir}/ → ${entries.length} post(s)`);
}

async function main() {
  console.log("Generating blog indexes...");
  const dirs = await readdir(MD_ROOT, { withFileTypes: true });
  for (const d of dirs) {
    if (d.isDirectory()) {
      await generateIndex(d.name);
    }
  }
  console.log("Done.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
