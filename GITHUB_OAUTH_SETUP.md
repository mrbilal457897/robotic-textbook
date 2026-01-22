# GitHub OAuth Setup Guide

This guide explains how to register a GitHub OAuth application for authentication in the Physical AI & Humanoid Robotics Interactive Textbook.

## Prerequisites

- GitHub account (personal or organization)
- Administrator access to your GitHub account settings
- Repository created on GitHub

## Step 1: Create GitHub OAuth Application

### Navigate to Developer Settings

1. Go to GitHub Settings: https://github.com/settings/profile
2. Click "Developer settings" (left sidebar, bottom)
3. Click "OAuth Apps" or "OAuth applications"
4. Click "New OAuth App" button

### Fill in Application Details

Fill in the registration form with these details:

**Application Name**
```
Physical AI Textbook
```

**Homepage URL**
For GitHub Pages deployment:
```
https://your-username.github.io/physical-ai-textbook/
```

Or if using custom domain:
```
https://yourdomain.com/
```

**Application Description** (optional)
```
Interactive textbook for Physical AI and Humanoid Robotics with quiz system and multi-language support.
```

**Authorization Callback URL** (IMPORTANT)
For GitHub Pages:
```
https://your-username.github.io/physical-ai-textbook/oauth-callback
```

Or if using custom domain:
```
https://yourdomain.com/oauth-callback
```

### Important Notes on URLs

- **Callback URL must match exactly** what you have in code
- **Include the trailing path** (oauth-callback)
- **Use HTTPS** (GitHub requires secure connections)
- **No trailing slashes** on base URLs
- **Test URLs locally first** - use `http://localhost:3000/oauth-callback` for local testing

## Step 2: Get Your Credentials

After creating the app, GitHub will show:

1. **Client ID** - Public identifier (safe to share)
2. **Client Secret** - Keep this PRIVATE ⚠️

### Client ID

- Publicly visible
- Can be committed to repository
- Used in frontend code
- Safe to share in error reports

### Client Secret

- Keep PRIVATE
- Never commit to repository
- Store in GitHub Actions secrets only
- Add to `.env` file (not committed)
- Only needed if doing server-side auth

## Step 3: Store Credentials

### For Development (Local)

Create `.env.local` file in project root (NOT committed):

```env
REACT_APP_GITHUB_OAUTH_CLIENT_ID=your_client_id_here_1234567890abcdef
REACT_APP_GITHUB_OAUTH_REDIRECT_URI=http://localhost:3000/oauth-callback
```

### For Production (GitHub Pages)

Add secrets to GitHub repository:

1. Go to Repository → Settings → Secrets and variables → Actions
2. Click "New repository secret"
3. Add secret: `GITHUB_OAUTH_CLIENT_ID`
4. Paste your Client ID value
5. Click "Add secret"

### Optional: For Server-Side Auth

If implementing server-side token exchange:

1. Create secret: `GITHUB_OAUTH_CLIENT_SECRET`
2. Paste your Client Secret value
3. Configure in GitHub Actions workflow

## Step 4: Update Configuration

### Update docusaurus.config.ts

```typescript
module.exports = {
  // ... other config

  // OAuth Configuration
  clientConfig: {
    gitHub: {
      clientId: process.env.REACT_APP_GITHUB_OAUTH_CLIENT_ID || 'your_client_id',
      redirectUri: process.env.REACT_APP_GITHUB_OAUTH_REDIRECT_URI ||
        'https://your-username.github.io/physical-ai-textbook/oauth-callback',
    },
  },
};
```

### Update .env.example

Commit this (without secrets) so developers know what to configure:

```env
# GitHub OAuth Configuration
REACT_APP_GITHUB_OAUTH_CLIENT_ID=<your-github-oauth-client-id>
REACT_APP_GITHUB_OAUTH_REDIRECT_URI=http://localhost:3000/oauth-callback
```

## Step 5: Test OAuth Flow Locally

### Start Development Server

```bash
npm start
# Site runs at http://localhost:3000
```

### Test Login Flow

1. Navigate to homepage
2. Click "Login with GitHub" button
3. You should be redirected to GitHub's login page
4. GitHub asks for authorization
5. You're redirected back to `/oauth-callback`
6. If working: User profile appears in navbar
7. If error: Check browser console and network tab

### Common Local Testing Issues

| Issue | Solution |
|-------|----------|
| "Invalid redirect_uri" error | Ensure redirect URI matches in OAuth app AND code |
| Redirect not working | Check callback URL in docusaurus.config.ts |
| User not logging in | Check browser console for errors |
| Session not persisting | Check localStorage is working (not disabled) |

## Step 6: Deploy to Production

### Update OAuth Callback URL for Production

If deploying to GitHub Pages:

1. Go to GitHub OAuth app settings
2. Update "Authorization callback URL" to:
   ```
   https://your-username.github.io/physical-ai-textbook/oauth-callback
   ```
3. Save changes

### Add GitHub Actions Secret

1. Go to Repository → Settings → Secrets
2. Add `GITHUB_OAUTH_CLIENT_ID` with your Client ID
3. GitHub Actions will use this during deployment

### Deploy

```bash
git push origin main
# GitHub Actions automatically deploys
# Site updates at: https://your-username.github.io/physical-ai-textbook/
```

## Step 7: Verify Production OAuth

1. Visit live site
2. Click "Login with GitHub"
3. Verify redirect to GitHub login
4. Authorize application
5. Should be redirected back with profile

## Security Best Practices

### ✅ DO

- Keep Client Secret private
- Use HTTPS for all OAuth URLs
- Store secrets in GitHub Actions secrets, not code
- Validate tokens on backend (if server-side auth)
- Refresh tokens regularly
- Log security events

### ❌ DON'T

- Commit `.env` or secrets file
- Share Client Secret in error reports
- Use HTTP for OAuth callbacks
- Hardcode secrets in code
- Disable HTTPS
- Store tokens in localStorage without encryption (if sensitive data)

## Troubleshooting

### "Invalid redirect_uri" Error

**Cause**: Redirect URI doesn't match exactly

**Solution**:
1. Check OAuth app settings on GitHub
2. Check `docusaurus.config.ts` configuration
3. Check `useAuth.ts` hook
4. Ensure they all match exactly (including protocol, domain, path)
5. No trailing slashes except in path

### User Not Logging In

**Cause**: OAuth code not being exchanged properly

**Solution**:
1. Check browser console (F12) for errors
2. Check Network tab for API calls
3. Verify callback page exists (`src/pages/oauth-callback.tsx`)
4. Check error handling in useAuth hook
5. Verify Client ID is set correctly

### Session Not Persisting

**Cause**: localStorage not working or session expiry

**Solution**:
1. Check if localStorage is enabled
2. Check browser security settings
3. Verify session expiry time (should be 7 days)
4. Check if tokens are being saved to localStorage

### "Redirect Loop" Issue

**Cause**: Callback handler redirecting incorrectly

**Solution**:
1. Check `oauth-callback.tsx` logic
2. Ensure redirect goes to homepage, not callback URL again
3. Clear browser cache
4. Check useAuth hook for proper state management

## Advanced: Multiple Environments

If managing dev, staging, and production:

Create separate OAuth apps:

1. **Development**
   - Callback: `http://localhost:3000/oauth-callback`
   - Client ID: `dev_client_id_xxx`

2. **Staging**
   - Callback: `https://staging.domain.com/oauth-callback`
   - Client ID: `staging_client_id_xxx`

3. **Production**
   - Callback: `https://domain.com/oauth-callback`
   - Client ID: `prod_client_id_xxx`

Use environment-specific `.env` files:
- `.env.development`
- `.env.staging`
- `.env.production`

## Reference

- [GitHub OAuth Documentation](https://docs.github.com/en/developers/apps/building-oauth-apps)
- [Registering OAuth Apps](https://docs.github.com/en/developers/apps/building-oauth-apps/creating-an-oauth-app)
- [Authorization Callback URL](https://docs.github.com/en/developers/apps/building-oauth-apps/authorizing-oauth-apps)

## Questions?

If you encounter issues:

1. Check browser console (F12) for error messages
2. Check Network tab for failed requests
3. Review this guide's troubleshooting section
4. Check GitHub OAuth app settings match configuration
5. Verify `.env` file is not committed to Git

---

**Status**: T082 Complete ✅
Documentation created for GitHub OAuth setup and registration process.
