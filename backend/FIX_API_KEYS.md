# 🔧 Fix API Keys - Emergency Guide

## 🚨 URGENT: Your Gemini API Key is Leaked!

Google has blocked your API key because it was exposed publicly (likely in GitHub).

### ⚡ Quick Fix Steps:

---

## Step 1: Get NEW Gemini API Key

1. **Go to**: https://aistudio.google.com/app/apikey
2. **Delete old key**: 
3. **Create new key**: Click "Create API Key"
4. **Copy new key**: Save it somewhere safe

---

## Step 2: Update .env File

Open `backend/.env` and replace line 28:

**OLD (BLOCKED):**
```env
GEMINI_API_KEY=YOUR_NEW_KEY_HER
```

**NEW:**
```env
GEMINI_API_KEY=YOUR_NEW_KEY_HERE
```

---

## Step 3: Alternative - Use Cohere Instead

If you don't want to use Gemini, switch to Cohere embeddings:

### Update `.env`:
```env
# Use Cohere for embeddings (already configured)
USE_COHERE_EMBEDDINGS=true

# Your Cohere key (already set)
COHERE_API_KEY=YOUR_NEW_KEY_HER

# Use Gemini only for chat (not embeddings)
GEMINI_API_KEY=YOUR_NEW_KEY_HERE
```

### Update `config.py`:
Look for embedding configuration and set to use Cohere.

---

## Step 4: Fix Qdrant Connection

Your Qdrant URL might be incorrect or the service might be down.

**Test Connection:**
```bash
curl https://f889c4e3-e796-44cc-9f5c-90bc6f054adb.europe-west3-0.gcp.cloud.qdrant.io:6333/collections
```

**If fails:**
1. Login to https://cloud.qdrant.io
2. Check if cluster is running
3. Get correct URL and API key
4. Update `.env`

---

## Step 5: Restart Server

After fixing .env:
```bash
# Stop server (Ctrl+C)
# Start again
python run_server.py
```

---

## 🛡️ Prevent Future Leaks

### Add .env to .gitignore
```bash
echo ".env" >> .gitignore
git rm --cached backend/.env
git commit -m "Remove leaked .env file"
```

### Use .env.example instead
Create `.env.example` with dummy values:
```env
GEMINI_API_KEY=your_key_here
COHERE_API_KEY=your_key_here
QDRANT_URL=your_url_here
```

---

## ✅ Verify Fix

After restarting server, test:
```bash
# Test health endpoint
curl http://localhost:8000/health

# Test chat endpoint
curl -X POST http://localhost:8000/api/v1/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello", "mode": "general-knowledge"}'
```

---

## 📞 Still Not Working?

Check logs for specific error:
```bash
tail -f backend/logs/app.log
```

Common issues:
- ❌ API key still invalid → Create NEW key
- ❌ Qdrant connection error → Check cluster status
- ❌ Network error → Check firewall/proxy
