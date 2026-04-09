# Deployment Guide

## Quick Reference

### Frontend (Trio)
```bash
cd artifacts/the-trio
pnpm run deploy
```
- Builds with Vite
- Deploys to GitHub Pages: `https://chasseuragace.github.io/`
- Base path: `/`

### Cloudflare Worker
```bash
cd artifacts/cloudflare-worker
git push origin main
```
- Auto-deploys on push to GitHub
- Endpoint: `https://trio-worker.chasseuragace.workers.dev/`
- Requires: `KAHA_TOKEN`, `GROQ_TOKEN` (set in Cloudflare dashboard)

## Available Scripts

### Trio Frontend
- `pnpm run dev` - Local dev server (port 5173)
- `pnpm run build` - Build for production
- `pnpm run deploy` - Build + deploy to GitHub Pages
- `pnpm run typecheck` - Type checking

### Cloudflare Worker
- `pnpm run dev` - Local worker (port 8787)
- `pnpm run deploy` - Deploy to Cloudflare
- `pnpm run typecheck` - Type checking

## Environment Variables

### Cloudflare Worker (set in dashboard)
- `KAHA_TOKEN` - JWT token for Kaha API
- `GROQ_TOKEN` - API key for Groq LLM

## API Endpoints

### Booking
- `POST /api/bookings` - Submit booking form
- Creates asset in Kaha with LLM-generated narrative

### Kaha Proxy
- `GET /api/kaha/main/api/v3/asset/my-business` - List assets
- All requests include Bearer token automatically

### Health
- `GET /api/health` - Health check
- `GET /api/config/status` - Check if tokens are configured

## Deployment Flow

1. **Frontend**: `pnpm run deploy` → GitHub Pages
2. **Worker**: `git push` → Cloudflare auto-deploy
3. **Assets**: Bookings → Worker → Kaha API → Assets page
