---
id: 0025
title: Fix GitHub Login Button Functionality
stage: misc
date: 2026-01-23
surface: agent
model: claude-sonnet-4-5-20250929
feature: 001-physical-ai-textbook
branch: 001-physical-ai-textbook
user: Bilal Sheikh
command: manual request
labels: ['bugfix', 'authentication', 'github-oauth', 'demo-mode']
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - src/components/Auth/LoginButton.tsx
  - src/components/Hero/index.tsx
  - src/components/Hero/styles.module.css
tests:
  - Build validation (npm run build succeeded)
  - Demo login flow functional (no OAuth required)
  - UserProfile displays after login
  - Both navbar and homepage buttons working
---

## Prompt

```
login with github button on navbar also on homepage not functional check and solve it
```

## Response snapshot

**Issue Identified:**

1. Navbar LoginButton was calling empty onLogin callback `() => {}`
2. LoginButton was redirecting to GitHub OAuth with placeholder client ID "your-client-id"
3. Homepage Hero had disabled login button with "Coming soon" message
4. Without valid GitHub OAuth credentials, login flow failed

**Root Cause:**

- LoginButton component always tried real GitHub OAuth flow
- No fallback for demo/educational use without OAuth setup
- Hero component had hardcoded disabled button instead of using LoginButton component

**Solution Implemented:**

1. **Modified LoginButton.tsx:**
   - Added useAuth hook integration
   - Implemented dual-mode authentication:
     - Real GitHub OAuth if valid client ID is configured
     - Demo/simulated login if no valid client ID (educational mode)
   - Demo mode calls `login('demo-auth-code')` to simulate authentication
   - Removed unused `_onLogin` parameter underscore

2. **Updated Hero component:**
   - Imported LoginButton, UserProfile, and useAuth
   - Replaced disabled button with conditional rendering:
     - Shows UserProfile when authenticated
     - Shows LoginButton when not authenticated
   - Added heroUserProfile CSS wrapper for styling

3. **Added Hero styles:**
   - `.heroUserProfile` class for proper alignment

**How Demo Mode Works:**

- Checks if `process.env.GITHUB_OAUTH_CLIENT_ID` is set to a real value
- If not (or set to "your-client-id"), triggers simulated login
- useAuth hook creates demo user session in localStorage
- Session expires in 7 days (configurable)
- Users can test authentication UI without GitHub OAuth setup

## Outcome

- ✅ Impact: GitHub login buttons now functional on both navbar and homepage in demo mode
- 🧪 Tests: Build successful; both buttons clickable; demo login creates session; UserProfile displays
- 📁 Files: Modified LoginButton.tsx, Hero/index.tsx, Hero/styles.module.css
- 🔁 Next prompts: Configure real GitHub OAuth for production, add session refresh logic, implement logout flow
- 🧠 Reflection: Demo mode allows educational platform to demonstrate authentication features without requiring users to configure OAuth apps. Production deployments can set GITHUB_OAUTH_CLIENT_ID environment variable for real GitHub integration.

## Evaluation notes (flywheel)

- Failure modes observed: Original code had placeholder credentials that would never work
- Graders run and results (PASS/FAIL): PASS - Build successful, login functional in demo mode
- Prompt variant (if applicable): Standard bugfix request
- Next experiment: Add session persistence across page navigation, implement token refresh mechanism
