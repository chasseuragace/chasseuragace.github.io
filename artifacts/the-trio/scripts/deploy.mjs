#!/usr/bin/env node

import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, "..");

const GITHUB_USER = "chasseuragace";
const GITHUB_PAGES_URL = `https://${GITHUB_USER}.github.io/`;

console.log("🚀 Starting GitHub Pages deployment...\n");

// Step 1: Check if git is initialized
if (!fs.existsSync(path.join(projectRoot, "..", "..", ".git"))) {
  console.error("❌ Git repository not found. Please initialize git first.");
  process.exit(1);
}

// Step 2: Build the project
console.log("📦 Building the project...");
try {
  execSync("pnpm run build", {
    cwd: projectRoot,
    stdio: "inherit",
    env: {
      ...process.env,
      BASE_PATH: "/",
      PORT: "5173",
      NODE_ENV: "production",
    },
  });
  console.log("✅ Build completed successfully\n");
} catch (error) {
  console.error("❌ Build failed:", error.message);
  process.exit(1);
}

// Step 3: Check if dist/public exists
const distPath = path.join(projectRoot, "dist", "public");
if (!fs.existsSync(distPath)) {
  console.error("❌ Build output not found at", distPath);
  process.exit(1);
}

// Step 4: Create a temporary gh-pages branch or use existing
console.log("📤 Preparing to push to GitHub Pages...");
const tempDir = path.join(projectRoot, ".gh-pages-temp");

try {
  // Clean up any existing temp directory
  if (fs.existsSync(tempDir)) {
    execSync(`rm -rf "${tempDir}"`);
  }

  // Create temp directory and copy dist contents
  fs.mkdirSync(tempDir, { recursive: true });
  execSync(`cp -r "${distPath}"/* "${tempDir}"/`);

  // Create .nojekyll file to prevent GitHub from processing as Jekyll
  fs.writeFileSync(path.join(tempDir, ".nojekyll"), "");

  // Initialize git in temp directory
  execSync("git init", { cwd: tempDir, stdio: "pipe" });
  execSync("git config user.email 'deploy@github.com'", {
    cwd: tempDir,
    stdio: "pipe",
  });
  execSync("git config user.name 'GitHub Pages Deploy'", {
    cwd: tempDir,
    stdio: "pipe",
  });

  // Add all files
  execSync("git add .", { cwd: tempDir, stdio: "pipe" });

  // Commit
  execSync('git commit -m "Deploy to GitHub Pages"', {
    cwd: tempDir,
    stdio: "pipe",
  });

  const remoteUrl = `https://github.com/${GITHUB_USER}/${GITHUB_USER}.github.io.git`;

  // Add remote and push to main branch
  execSync(`git remote add origin "${remoteUrl}"`, {
    cwd: tempDir,
    stdio: "pipe",
  });

  console.log(`📍 Pushing to main branch of ${remoteUrl}...`);
  try {
    execSync("git push -f origin HEAD:main", {
      cwd: tempDir,
      stdio: "inherit",
    });

    console.log("\n✅ Deployment successful!");
    console.log(`🌐 Your site is live at: ${GITHUB_PAGES_URL}`);
    console.log(
      "⏱️  It may take a few minutes for GitHub Pages to update.\n",
    );
  } catch (pushError) {
    console.error("\n❌ Push failed. This might be because:");
    console.error("   1. You don't have push access to the repository");
    console.error("   2. Authentication failed\n");
    console.error("📋 Make sure you have:");
    console.error(`   - SSH keys configured, or`);
    console.error(`   - A GitHub personal access token set up\n`);
    throw pushError;
  }
} catch (error) {
  console.error("❌ Deployment failed:", error.message);
  process.exit(1);
} finally {
  // Clean up temp directory
  if (fs.existsSync(tempDir)) {
    execSync(`rm -rf "${tempDir}"`);
  }
}
