# Trio

## Deployment

### Frontend (Trio)
```bash
cd artifacts/the-trio
pnpm run deploy
```
Deploys to GitHub Pages: `https://chasseuragace.github.io/`

### Cloudflare Worker
```bash
cd artifacts/cloudflare-worker
git push origin main
```
Auto-deploys on push. Endpoint: `https://trio-worker.chasseuragace.workers.dev/`

### Available Scripts

**Frontend:**
- `pnpm run dev` - Dev server
- `pnpm run build` - Build
- `pnpm run deploy` - Build + deploy to GitHub Pages

**Worker:**
- `pnpm run dev` - Local worker
- `pnpm run deploy` - Deploy to Cloudflare

### Environment Variables (Cloudflare Dashboard)
- `KAHA_TOKEN` - JWT token for Kaha API
- `GROQ_TOKEN` - API key for Groq LLM

See [DEPLOYMENT.md](./DEPLOYMENT.md) for full details.
