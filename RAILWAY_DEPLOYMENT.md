# 🚂 Railway Deployment Guide - RAG Textbook Chatbot Backend

Complete step-by-step guide to deploy FastAPI backend on Railway and connect to Vercel frontend.

---

## 📋 Pre-Deployment Checklist

- [ ] GitHub account created
- [ ] Railway account created (https://railway.app - free tier available)
- [ ] Cohere API key ready (https://dashboard.cohere.com/api-keys)
- [ ] Google Gemini API key ready (https://makersuite.google.com/app/apikey)
- [ ] Vercel deployment URL ready (your frontend URL)
- [ ] GitHub OAuth app configured (optional, for authentication)

---

## 🎯 Step 1: Create Railway Account & New Project

### 1.1 Sign Up on Railway
1. Go to https://railway.app
2. Click "Login with GitHub"
3. Authorize Railway to access your GitHub account

### 1.2 Create New Project
1. Click "New Project" on Railway dashboard
2. Select "Deploy from GitHub repo"
3. Choose your repository: `CBook` or your repo name
4. Railway will list all branches - select your main branch

### 1.3 Configure Root Directory
**IMPORTANT:** Railway needs to know backend is in `backend/` folder:
1. In Railway dashboard, click on your service
2. Go to **Settings** tab
3. Scroll to "Root Directory"
4. Set: `backend`
5. Click "Update"

---

## 🗄️ Step 2: Add Required Services (Databases)

Your backend needs 3 database services. Add them one by one:

### 2.1 Add PostgreSQL
1. In Railway project dashboard, click **"+ New"**
2. Select **"Database"** → **"Add PostgreSQL"**
3. Railway will automatically provision PostgreSQL
4. **Note:** Connection details auto-inject as environment variables

### 2.2 Add Redis
1. Click **"+ New"** again
2. Select **"Database"** → **"Add Redis"**
3. Railway will provision Redis
4. Connection details auto-inject

### 2.3 Add Qdrant (Vector Database)

**Option A: Deploy on Railway (Simple but may need custom Docker)**
1. Click **"+ New"** → **"Empty Service"**
2. Name it "Qdrant"
3. Go to service **Settings**
4. Under "Deploy," set:
   - **Source:** Docker Image
   - **Image:** `qdrant/qdrant:latest`
5. Under "Networking," add port `6333`
6. Deploy

**Option B: Use Qdrant Cloud (Recommended - Free Tier Available)**
1. Go to https://cloud.qdrant.io
2. Create free cluster
3. Copy cluster URL and API key
4. Add to Railway environment variables (see Step 3)

---

## ⚙️ Step 3: Configure Environment Variables

### 3.1 Open Variables Tab
1. Click on your backend service in Railway dashboard
2. Go to **"Variables"** tab
3. Click **"+ New Variable"**

### 3.2 Add Required Variables (Copy from `.railway.env.example`)

**CRITICAL: Add these variables one by one:**

#### App Configuration
```bash
APP_HOST=0.0.0.0
APP_ENV=production
APP_DEBUG=false
LOG_LEVEL=INFO
```

#### CORS (⚠️ Replace with YOUR Vercel URL)
```bash
CORS_ORIGINS=https://your-vercel-app.vercel.app
```

#### AI API Keys (⚠️ Use YOUR real keys)
```bash
COHERE_API_KEY=your_actual_cohere_key
COHERE_EMBEDDING_MODEL=embed-english-v3.0
COHERE_EMBEDDING_INPUT_TYPE=search_document

GEMINI_API_KEY=your_actual_gemini_key
GEMINI_MODEL=gemini-1.5-flash
GEMINI_MAX_OUTPUT_TOKENS=4096
GEMINI_TEMPERATURE=0.7
```

#### Database URLs (Railway Auto-Injects - Use References)
```bash
# PostgreSQL - Use Railway's reference syntax
DATABASE_URL=${{Postgres.DATABASE_URL}}

# Redis - Use Railway's reference syntax
REDIS_URL=${{Redis.REDIS_URL}}

# Qdrant - If using Railway deployment
QDRANT_URL=http://qdrant.railway.internal:6333
QDRANT_COLLECTION_NAME=textbook_chunks
QDRANT_VECTOR_SIZE=1024

# OR if using Qdrant Cloud:
# QDRANT_URL=https://your-cluster.qdrant.cloud
# QDRANT_API_KEY=your_qdrant_cloud_key
```

#### Security & Sessions (⚠️ Generate Random Keys)
```bash
# Generate with: python -c "import secrets; print(secrets.token_urlsafe(32))"
JWT_SECRET_KEY=<generate_random_32_char_string>
SESSION_SECRET_KEY=<generate_another_random_32_char_string>
```

#### Rate Limiting
```bash
RATE_LIMIT_ANONYMOUS=50
RATE_LIMIT_AUTHENTICATED=200
```

#### GitHub OAuth (Optional - if using authentication)
```bash
GITHUB_OAUTH_CLIENT_ID=your_github_client_id
GITHUB_OAUTH_CLIENT_SECRET=your_github_client_secret
GITHUB_OAUTH_REDIRECT_URI=https://your-railway-app.up.railway.app/api/v1/auth/github/callback
```

### 3.3 Railway Auto-Variables
Railway automatically provides:
- `$PORT` - Don't set this manually
- Service references like `${{Postgres.DATABASE_URL}}`

---

## 🚀 Step 4: Deploy Backend

### 4.1 Trigger Deployment
1. Railway auto-deploys when you push to GitHub
2. Or click **"Deploy"** in Railway dashboard manually

### 4.2 Monitor Build Logs
1. Go to **"Deployments"** tab
2. Click on latest deployment
3. Watch build logs - should see:
   ```
   Installing dependencies from requirements.txt...
   Starting uvicorn server...
   ```

### 4.3 Check Deployment Status
- Green checkmark = Successful ✅
- Red X = Failed ❌ (check logs for errors)

### 4.4 Get Your Backend URL
1. Go to **"Settings"** tab
2. Scroll to **"Networking"** → **"Public Networking"**
3. Click **"Generate Domain"**
4. Copy the URL (looks like: `https://your-app.up.railway.app`)

### 4.5 Test Backend Health
Open in browser or use curl:
```bash
https://your-app.up.railway.app/health
```

Should return:
```json
{
  "status": "healthy",
  "service": "rag-textbook-chatbot-api",
  "version": "1.0.0"
}
```

---

## 🌐 Step 5: Connect Frontend (Vercel) to Backend (Railway)

### 5.1 Open Vercel Dashboard
1. Go to https://vercel.com/dashboard
2. Select your deployed project (Docusaurus frontend)
3. Click **"Settings"**

### 5.2 Add Environment Variable
1. Go to **"Environment Variables"** section
2. Click **"Add New"**
3. Enter:
   - **Name:** `REACT_APP_API_URL`
   - **Value:** `https://your-app.up.railway.app` (your Railway URL)
   - **Environment:** Check all (Production, Preview, Development)
4. Click **"Save"**

### 5.3 Redeploy Frontend
1. Go to **"Deployments"** tab
2. Click **"..."** on latest deployment
3. Select **"Redeploy"**
4. Wait for redeployment to complete

---

## ✅ Step 6: Final Testing

### 6.1 Test Backend API
```bash
# Health check
curl https://your-app.up.railway.app/health

# API docs (if debug is enabled)
https://your-app.up.railway.app/docs
```

### 6.2 Test Frontend Chatbot
1. Open your Vercel URL: `https://your-vercel-app.vercel.app`
2. Open chatbot interface
3. Send a test message
4. Check browser console (F12) for API calls - should show Railway URL

### 6.3 Check CORS
If you see CORS errors in browser console:
1. Go back to Railway → Variables
2. Update `CORS_ORIGINS` with exact Vercel URL (no trailing slash)
3. Redeploy backend

---

## 🔧 Troubleshooting

### ❌ Error: "Failed to fetch"
**Cause:** Backend not running or wrong URL
**Fix:**
- Check Railway deployment status
- Verify `REACT_APP_API_URL` in Vercel matches Railway URL exactly
- Redeploy frontend after changing env vars

### ❌ Error: "CORS policy blocked"
**Cause:** CORS_ORIGINS not configured
**Fix:**
- Add Vercel URL to `CORS_ORIGINS` in Railway variables
- Format: `https://your-app.vercel.app` (no trailing slash)
- Redeploy backend

### ❌ Error: "Connection to Qdrant failed"
**Cause:** Qdrant not running or wrong URL
**Fix:**
- If using Railway Qdrant, check service is running
- If using Qdrant Cloud, verify API key and URL
- Check `QDRANT_URL` variable

### ❌ Error: "Database connection failed"
**Cause:** PostgreSQL not provisioned or wrong credentials
**Fix:**
- Verify PostgreSQL service is running in Railway
- Check `DATABASE_URL` is using reference: `${{Postgres.DATABASE_URL}}`
- Restart backend service

### ❌ Error: "Redis connection failed"
**Cause:** Redis not provisioned
**Fix:**
- Add Redis service in Railway
- Verify `REDIS_URL` reference is correct
- Restart backend

### ❌ Error: "API key invalid"
**Cause:** Wrong Cohere/Gemini API keys
**Fix:**
- Verify keys in Railway variables
- Check keys are active in Cohere/Gemini dashboards
- Redeploy after updating

---

## 📊 Monitoring & Logs

### View Backend Logs
1. Railway dashboard → Your service
2. Click **"Logs"** tab (real-time logs)
3. Monitor API requests, errors, warnings

### Check Deployment History
1. Go to **"Deployments"** tab
2. See all past deployments
3. Rollback if needed by clicking "Redeploy" on old deployment

### Resource Usage
1. **"Metrics"** tab shows:
   - CPU usage
   - Memory usage
   - Network traffic
2. Railway free tier limits:
   - $5 free credit/month
   - 500 hours execution
   - 100 GB bandwidth

---

## 🔐 Security Best Practices

### ✅ Do's:
- ✅ Generate new random secrets for JWT/Session in production
- ✅ Regenerate GitHub OAuth secrets (old ones exposed in code)
- ✅ Use environment-specific API keys (dev vs prod)
- ✅ Enable HTTPS only (Railway provides by default)
- ✅ Regularly rotate API keys

### ❌ Don'ts:
- ❌ Never commit `.env` files with real secrets
- ❌ Don't use development API keys in production
- ❌ Don't set `APP_DEBUG=true` in production
- ❌ Don't expose Qdrant/Redis publicly without authentication

---

## 🎓 Summary

After completing all steps:
1. ✅ Backend deployed on Railway with all services
2. ✅ Frontend on Vercel connected to Railway backend
3. ✅ Chatbot working on production URL
4. ✅ All environment variables configured
5. ✅ CORS properly set up

**Your deployed architecture:**
```
User Browser
    ↓
Vercel (Frontend - Docusaurus)
    ↓ (API calls via REACT_APP_API_URL)
Railway (Backend - FastAPI)
    ↓
├── PostgreSQL (conversation history)
├── Redis (rate limiting)
├── Qdrant (vector search)
├── Cohere API (embeddings)
└── Gemini API (chat responses)
```

---

## 🆘 Need Help?

- **Railway Docs:** https://docs.railway.app
- **Railway Discord:** https://discord.gg/railway
- **Vercel Docs:** https://vercel.com/docs
- **Project Issues:** Check backend logs in Railway dashboard

---

## 📝 Next Steps (Optional)

1. **Custom Domain:** Add your domain in Railway/Vercel settings
2. **Auto-Deploy:** Enable GitHub auto-deploy in Railway
3. **Monitoring:** Add Sentry for error tracking
4. **Scaling:** Upgrade Railway plan if traffic increases
5. **CI/CD:** Add GitHub Actions for automated testing before deploy

---

**Deployment Date:** 2026-03-03
**Version:** 1.0.0
**Status:** ✅ Production Ready
