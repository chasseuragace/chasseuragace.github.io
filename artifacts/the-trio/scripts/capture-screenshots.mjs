import { chromium } from "playwright";
import { readFileSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = join(__dirname, "..");
const contentPath = join(projectRoot, "src/data/content.json");
const screenshotDir = join(projectRoot, "public/screenshots");

const content = JSON.parse(readFileSync(contentPath, "utf-8"));

// Collect all projects with URLs
const allProjects = [];

// Trio-level portfolio
for (const p of content.portfolio.projects) {
  if (p.url) allProjects.push(p);
}

// Member portfolios
for (const member of content.trio.members) {
  if (member.page?.portfolio) {
    for (const p of member.page.portfolio) {
      if (p.url) allProjects.push(p);
    }
  }
}

function slugify(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

async function main() {
  console.log(`Capturing ${allProjects.length} screenshots...\n`);

  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 },
  });

  for (const project of allProjects) {
    const slug = slugify(project.title);
    const filename = `${slug}.png`;
    const filepath = join(screenshotDir, filename);

    console.log(`  ${project.title}`);
    console.log(`    ${project.url}`);

    try {
      const page = await context.newPage();
      await page.goto(project.url, {
        waitUntil: "networkidle",
        timeout: 30000,
      });
      // Extra wait for JS-rendered content
      await page.waitForTimeout(2000);
      await page.screenshot({ path: filepath, type: "png" });
      await page.close();

      // Update imageUrl in the project object
      project.imageUrl = `/screenshots/${filename}`;
      console.log(`    -> ${filename}\n`);
    } catch (err) {
      console.log(`    !! FAILED: ${err.message}\n`);
    }
  }

  await browser.close();

  // Write updated content.json
  writeFileSync(contentPath, JSON.stringify(content, null, 2) + "\n");
  console.log("Updated content.json with screenshot paths.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
