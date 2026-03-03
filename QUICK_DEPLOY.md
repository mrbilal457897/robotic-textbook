# ⚡ Quick Deploy Checklist - 15 Minutes

Ultra-fast deployment checklist for experienced developers.

---

## 🚀 Railway (Backend)

### 1. Create Project (2 min)
```
1. railway.app → Login with GitHub
2. New Project → Deploy from GitHub → Select CBook repo
3. Settings → Root Directory → Set to "backend"
```

### 2. Add Services (3 min)
```
+ New → PostgreSQL
+ New → Redis
+ New → Qdrant (Docker: qdrant/qdrant) OR use Qdrant Cloud
```

### 3. Environment Variables (5 min)
```bash
# Required
CORS_ORIGINS=https://your-vercel-app.vercel.app
COHERE_API_KEY=<your-key>
GEMINI_API_KEY=<your-key>

# Auto-injected by Railway
DATABASE_URL=${{Postgres.DATABASE_URL}}
REDIS_URL=${{Redis.REDIS_URL}}

# Qdrant
QDRANT_URL=http://qdrant.railway.internal:6333
QDRANT_COLLECTION_NAME=textbook_chunks

# Security (generate random)
JWT_SECRET_KEY=<random-32-chars>
SESSION_SECRET_KEY=<random-32-chars>

# App
APP_HOST=0.0.0.0
APP_ENV=production
APP_DEBUG=false
```

### 4. Deploy & Get URL (2 min)
```
1. Deploy (auto-triggers)
2. Settings → Networking → Generate Domain
3. Copy URL: https://your-app.up.railway.app
4. Test: /health endpoint
```

---

## 🌐 Vercel (Frontend)

### Update Environment Variable (3 min)
```
1. vercel.com → Your project → Settings
2. Environment Variables → Add:
   REACT_APP_API_URL=https://your-app.up.railway.app
3. Deployments → Latest → Redeploy
```

---

## ✅ Verify (1 min)
```bash
# Backend
curl https://your-app.up.railway.app/health

# Frontend
Open https://your-vercel-app.vercel.app
Test chatbot → Check browser console for API calls
```

---

## 🐛 Common Fixes

| Error | Fix |
|-------|-----|
| CORS blocked | Add Vercel URL to CORS_ORIGINS, redeploy backend |
| Failed to fetch | Check Railway URL in Vercel env vars, redeploy frontend |
| 500 errors | Check Railway logs, verify API keys |
| Qdrant failed | Verify Qdrant service running or use Qdrant Cloud |

---

**Total Time:** ~15 minutes
**Cost:** Free (Railway $5 credit, Vercel free tier)
