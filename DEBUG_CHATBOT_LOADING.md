# Debug: Chatbot Stuck on Loading

## Issue
Frontend chatbot shows loading state but never responds. Backend server shows NO logs when message is sent.

---

## Quick Diagnosis

### Step 1: Check if backend is receiving requests

With backend server running, open a **NEW PowerShell window** and run:

```bash
cd backend
python test_chat_endpoint.py
```

**Expected results:**
- ✓ Health check PASSED
- ✓ Chat request SUCCEEDED (or specific error shown)

**If test succeeds:**
- Backend is working fine
- Problem is in frontend → browser connection
- Go to Step 2

**If test hangs/times out:**
- Backend is hanging on API call (likely Gemini or Qdrant)
- Check Step 3

---

### Step 2: Check frontend-to-backend connection

1. **Open browser DevTools** (F12)
2. **Go to Console tab**
3. **Send a test message** in chatbot
4. **Check for errors:**

**Common errors:**

```
CORS error: Access-Control-Allow-Origin
→ Backend CORS not allowing frontend URL

Failed to fetch / net::ERR_CONNECTION_REFUSED
→ Backend not running on expected port

TypeError: Cannot read property 'conversation_id'
→ Response format mismatch
```

**Check Network tab:**
- Click on the `/api/v1/chat` request
- See the actual request/response
- Check status code and response body

---

### Step 3: Check API keys and services

If backend test script **hangs**, one of these is blocked:

**Test each service separately:**

#### A. Test Gemini API

```bash
cd backend
python
```

```python
import os
from dotenv import load_dotenv
load_dotenv()

# Test Gemini
import google.generativeai as genai
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel("gemini-1.5-flash")
response = model.generate_content("Hello")
print(response.text)
# Should print a response in < 5 seconds
```

**If hangs/errors:**
- Gemini API key is BLOCKED or INVALID
- Create new key: https://aistudio.google.com/app/apikey
- Update `backend/.env` → `GEMINI_API_KEY=YOUR_NEW_KEY`

#### B. Test Qdrant Connection

```bash
cd backend
python
```

```python
import os
from dotenv import load_dotenv
load_dotenv()

from src.db.qdrant import get_qdrant
qdrant = get_qdrant()
info = qdrant.get_collection_info()
print(info)
# Should return collection info in < 2 seconds
```

**If hangs/errors:**
- Qdrant URL is wrong or cluster is down
- Login to https://cloud.qdrant.io
- Check if cluster is running
- Copy correct URL and API key
- Update `backend/.env`

#### C. Test Postgres Connection

```bash
cd backend
python
```

```python
import os
from dotenv import load_dotenv
load_dotenv()

from src.db.postgres import get_postgres
db = get_postgres()
with db.get_connection() as conn:
    print("✓ Postgres connected")
# Should print in < 2 seconds
```

**If hangs/errors:**
- Database URL is wrong
- Check Neon dashboard: https://console.neon.tech
- Update `backend/.env` → `NEON_DATABASE_URL`

---

## Common Fixes

### Fix 1: Blocked Gemini API Key

**Symptom:** Backend hangs when generating response, no logs appear

**Solution:**
1. Delete old leaked key: https://aistudio.google.com/app/apikey
2. Create new key
3. Update `backend/.env`:
   ```
   GEMINI_API_KEY=YOUR_NEW_KEY_HERE
   ```
4. Restart backend server

---

### Fix 2: Wrong Frontend Port

**Symptom:** Browser shows CORS error in console

**Check what port Docusaurus is running on:**
```bash
npm start
```

Look for: `Local: http://localhost:XXXX`

**If NOT port 3000:**

Update `backend/.env`:
```
CORS_ORIGINS=http://localhost:XXXX
```

Restart backend.

---

### Fix 3: Missing Environment Variables

**Check if ALL required env vars are set:**

```bash
cd backend
python -c "from src.config import Settings; s=Settings(); print('✓ Config loaded')"
```

**If errors:**
- Missing required field → Add to `backend/.env`
- Check `backend/.env.example` for all required vars

---

## Step-by-Step Debug Process

1. **Backend test** → Run `python test_chat_endpoint.py`
   - ✓ Works → Frontend issue (check browser console)
   - ✗ Hangs → API service issue (test each service)

2. **Browser console** → F12 → Console tab → Send message
   - Check for CORS / fetch errors
   - Check Network tab for actual request

3. **Test services** → Gemini, Qdrant, Postgres
   - Identify which one is hanging
   - Fix that specific service

4. **Restart everything:**
   ```bash
   # Stop backend (Ctrl+C)
   # Stop frontend (Ctrl+C)

   # Start backend
   cd backend
   python run_server.py

   # Start frontend (new terminal)
   npm start
   ```

---

## Expected Normal Behavior

**When sending message:**

**Backend logs should show:**
```
INFO: Chat request: user=..., mode=book-only, book=physical-ai-robotics
INFO: Routing: mode=book-only, intent=question
INFO: Generating response (mode: book-only, tone: academic, chunks: 5)
```

**Browser Network tab should show:**
```
POST /api/v1/chat
Status: 200 OK
Time: 3-30 seconds (depending on Gemini)
```

**If you see NO backend logs** → Request not reaching backend (CORS/URL issue)

**If you see backend logs but hangs** → One of the API services is blocking

---

## Get Help

If still stuck, share these details:

1. **Backend test result:**
   ```bash
   cd backend
   python test_chat_endpoint.py
   ```

2. **Browser console errors** (F12 → Console)

3. **Backend terminal logs** when sending message

4. **Network tab** details (F12 → Network → click on `/api/v1/chat`)

This will help identify the exact bottleneck.
