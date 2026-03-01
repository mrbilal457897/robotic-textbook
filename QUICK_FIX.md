# 🔧 Quick Fix: Chatbot Not Responding

## Most Likely Issue: Blocked Gemini API Key

Your Gemini API key was leaked and blocked by Google. Here's the fastest fix:

---

## ⚡ Quick Fix Steps (5 minutes)

### 1. Create New Gemini API Key

1. Go to: https://aistudio.google.com/app/apikey
2. **Delete old key**:  (it's blocked)
3. Click "**Create API Key**"
4. **Copy the new key**

### 2. Update .env File

Open `backend/.env` and replace line 28:

**OLD (BLOCKED):**
```env
GEMINI_API_KEY=YOUR_NEW_KEY_HER
```

**NEW:**
```env
GEMINI_API_KEY=YOUR_NEW_KEY_HERE
```

### 3. Restart Backend

```bash
# Stop backend (Ctrl+C in terminal)

# Start again
cd backend
python run_server.py
```

### 4. Test It

**Open new PowerShell:**
```bash
cd backend
python test_chat_endpoint.py
```

**Expected output:**
```
✓ Health check PASSED
✓ Chat request SUCCEEDED
```

---

## ✅ Verify Fix

1. **Backend running** → See logs when you send message
2. **Frontend chatbot** → Gets response in 5-30 seconds
3. **No timeout errors**

---

## 🔍 If Still Not Working

Run diagnostic:

```bash
cd backend

# Test Gemini API directly
python
```

```python
import os
from dotenv import load_dotenv
load_dotenv()

import google.generativeai as genai
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel("gemini-1.5-flash")
response = model.generate_content("Hello")
print(response.text)
```

**If this works** → Backend chatbot should work

**If this hangs** → API key is still invalid, create another new key

---

## 🛡️ Alternative: Use Cohere for Embeddings

If you're having issues with Gemini embeddings (not chat), switch to Cohere:

**Update `backend/.env`:**
```env
# Use Cohere for embeddings instead of Gemini
USE_COHERE_EMBEDDINGS=true




**Restart backend.**

---

## 📊 Check What's Working

**Backend logs should show when you send message:**
```
INFO: Chat request: user=..., mode=book-only
INFO: Routing: mode=book-only, intent=question
INFO: Generating response (mode: book-only, tone: academic, chunks: 5)
```

**If you see NO logs** → Different issue (check DEBUG_CHATBOT_LOADING.md)

**If you see logs but it hangs** → API key issue (follow steps above)

---

## 🎯 Summary

**Problem:** Gemini API key blocked → Backend hangs → Frontend keeps loading

**Solution:** New Gemini API key → Update .env → Restart backend

**Time:** 5 minutes

**Test:** Run `python test_chat_endpoint.py` to verify

---

Need more help? See **DEBUG_CHATBOT_LOADING.md** for detailed troubleshooting.
