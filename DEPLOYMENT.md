# Deployment Guide

This document explains how to deploy the Physical AI & Humanoid Robotics Interactive Textbook to GitHub Pages.

## Prerequisites

- GitHub account with a forked repository
- Local development environment set up (see README.md)
- Write access to your repository

## Deployment Architecture

The project uses GitHub Pages for hosting with GitHub Actions for automated CI/CD:

```
Git Push → GitHub Actions Workflow → Build → Tests → Deploy to gh-pages branch
         ↓
    Live Site: https://your-username.github.io/physical-ai-textbook/
```

## Manual Deployment

### Step 1: Local Testing

Before deploying, ensure everything works locally:

```bash
# Install dependencies
npm install

# Run linter
npm run lint

# Run tests
npm run test

# Build the project
npm run build

# Serve the build
npm run serve
```

### Step 2: Configure GitHub Pages

1. Go to repository Settings → Pages
2. Set Source to "GitHub Actions"
3. Verify Custom Domain is empty (or set your custom domain)

### Step 3: Push to Main Branch

```bash
# Make sure you're on the main branch
git checkout main

# Ensure branch is up to date
git pull origin main

# Verify your changes are committed
git status

# Push to GitHub
git push origin main
```

### Step 4: Monitor Deployment

1. Go to repository → Actions tab
2. Find the latest workflow run
3. Check logs if deployment fails
4. Once complete, site will be live at: `https://your-username.github.io/physical-ai-textbook/`

## GitHub Actions Workflow

The project includes a `.github/workflows/deploy.yml` file that:

1. **Triggers** on push to `main` branch
2. **Sets up** Node.js 18
3. **Installs** dependencies with `npm ci`
4. **Runs** linter: `npm run lint`
5. **Builds** the project: `npm run build`
6. **Runs** tests: `npm run test`
7. **Uploads** coverage to Codecov (if configured)
8. **Deploys** to GitHub Pages using `peaceiris/actions-gh-pages`

### Workflow File Location

`.github/workflows/deploy.yml`

### Required Secrets

Configure these in repository Settings → Secrets → Actions:

- **GITHUB_OAUTH_CLIENT_ID**: GitHub OAuth app client ID (optional, for auth feature)
- **GITHUB_OAUTH_CLIENT_SECRET**: GitHub OAuth app secret (if needed for server-side auth)

### Viewing Workflow Logs

1. Go to Actions tab
2. Click the workflow run
3. Click "Build" or "Deploy" step to see logs
4. Common issues:
   - Build failures (TypeScript errors)
   - Lint errors (ESLint violations)
   - Test failures (failed test cases)

## Environment Variables

Create a `.env` file in the repository root (DO NOT commit):

```env
# GitHub OAuth Configuration (for OAuth callback)
REACT_APP_GITHUB_OAUTH_CLIENT_ID=your_client_id_here
REACT_APP_GITHUB_OAUTH_REDIRECT_URI=https://your-username.github.io/physical-ai-textbook/oauth-callback
```

## GitHub OAuth Setup (Optional)

If using GitHub authentication:

1. Go to GitHub Settings → Developer settings → OAuth Apps
2. Click "New OAuth App"
3. Fill in:
   - **Application name**: Physical AI Textbook
   - **Homepage URL**: `https://your-username.github.io/physical-ai-textbook/`
   - **Authorization callback URL**: `https://your-username.github.io/physical-ai-textbook/oauth-callback`
4. Copy Client ID and add to repository secrets

## Domain Configuration (Optional)

To use a custom domain:

1. Create a `CNAME` file in `static/` directory:
   ```
   yourdomain.com
   ```

2. Configure DNS records:
   - Add A records pointing to GitHub Pages IPs:
     - 185.199.108.153
     - 185.199.109.153
     - 185.199.110.153
     - 185.199.111.153

3. Or use CNAME record pointing to `your-username.github.io`

4. Enable HTTPS in repository Settings → Pages

## Rollback Procedure

### Revert to Previous Deployment

If something breaks after deployment:

1. **Identify the problematic commit**
   ```bash
   git log --oneline -10
   ```

2. **Revert the commit**
   ```bash
   git revert <commit-hash>
   git push origin main
   ```

3. **GitHub Actions will redeploy** with the previous version

### Revert via Git History

```bash
# Reset to specific commit
git reset --hard <commit-hash>
git push origin main --force

# Note: Use --force carefully, only if absolutely necessary
```

## Deployment Verification

After successful deployment, verify:

1. **Site accessibility**
   ```bash
   curl https://your-username.github.io/physical-ai-textbook/
   ```

2. **Check homepage**
   - Navigate to live URL
   - Verify all sections load
   - Check for console errors (F12)

3. **Test key features**
   - Navigation between modules
   - Quiz functionality
   - Language switching
   - Search functionality
   - Auth flow (if enabled)

4. **Performance check**
   - Run Lighthouse audit in DevTools
   - Target score: > 90

5. **Mobile responsiveness**
   - Test on mobile devices
   - Check touch interactions
   - Verify layout at 375px width

## Monitoring & Health Checks

### View Deployment Status

```bash
# Check last 5 deployments
git log --oneline -5

# View GitHub Actions status
# https://github.com/your-username/physical-ai-textbook/actions
```

### Common Issues & Fixes

| Issue | Cause | Solution |
|-------|-------|----------|
| Build fails | TypeScript errors | Run `npm run lint` and `npm run build` locally |
| Tests fail | Test failures | Run `npm test` locally to debug |
| Site not updating | Cache issues | Clear browser cache or wait 5 minutes |
| Blank page | Asset path issues | Check baseUrl in `docusaurus.config.ts` |
| 404 errors | Broken links | Verify all internal links in content |

## Production Checklist

Before deploying to production:

- [ ] All tests pass locally
- [ ] No TypeScript errors: `npm run lint`
- [ ] Build succeeds: `npm run build`
- [ ] All interactive features tested
- [ ] Mobile responsive at 375px, 768px, 1440px
- [ ] Performance acceptable (Lighthouse > 90)
- [ ] Accessibility audit passed (WCAG AA)
- [ ] Content proofread for typos
- [ ] No console errors in DevTools
- [ ] OAuth configured (if applicable)
- [ ] Cache invalidation plan ready

## Continuous Deployment

The workflow runs automatically on every push to `main`. To prevent automatic deployment:

1. **Create a draft PR** for your changes
2. **Request review** before merging
3. **Merge only when** approved and ready

## Support & Troubleshooting

- **Check workflow logs**: Actions → Workflow run → Logs
- **Review error messages**: Most failures show clear error descriptions
- **Test locally first**: Run `npm run build` before pushing
- **Ask questions**: Open an issue with deployment errors

## Further Reading

- [GitHub Pages Documentation](https://pages.github.com)
- [GitHub Actions Documentation](https://docs.github.com/actions)
- [Docusaurus Deployment Guide](https://docusaurus.io/docs/deployment)

---

For questions or issues, open an issue on GitHub.
