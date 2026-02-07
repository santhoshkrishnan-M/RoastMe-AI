# 🚀 Quick Start for Vercel Deployment

## Option 1: One-Click Deploy (Fastest)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/roastme)

## Option 2: Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy from project root
vercel

# Deploy to production
vercel --prod
```

## Option 3: GitHub Integration

1. Push your code to GitHub
2. Visit [vercel.com/new](https://vercel.com/new)
3. Import your repository
4. Set Root Directory to `frontend`
5. Click Deploy

## 📝 Configuration

- **Root Directory:** `frontend`
- **Build Command:** `npm run build` (auto-detected)
- **Output Directory:** `.next` (auto-detected)
- **Install Command:** `npm install` (auto-detected)

## 🔧 Environment Variables

Add in Vercel Dashboard (optional):
```
NEXT_PUBLIC_API_URL=/api
```

## 📚 Full Documentation

See [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md) for detailed instructions, troubleshooting, and advanced configuration.

---

**Note:** WebSocket features require a separate backend deployment. See deployment guide for details.
