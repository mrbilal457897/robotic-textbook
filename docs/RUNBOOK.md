# Development Runbook
**Physical AI & Humanoid Robotics Interactive Textbook**

This runbook provides comprehensive setup instructions, common tasks, troubleshooting guides, and operational procedures for developers working on this project.

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Initial Setup](#initial-setup)
3. [Development Workflow](#development-workflow)
4. [Common Tasks](#common-tasks)
6. [Testing](#testing)
7. [Deployment](#deployment)
8. [Troubleshooting](#troubleshooting)
9. [Code Quality](#code-quality)
10. [Project Structure](#project-structure)

---

## Prerequisites

### Required Software

| Software | Minimum Version | Recommended Version | Installation |
|----------|----------------|---------------------|--------------|
| Node.js | 18.0.0 | 18.x LTS | [nodejs.org](https://nodejs.org/) |
| npm | 9.0.0 | Latest | Comes with Node.js |
| Git | 2.30.0 | Latest | [git-scm.com](https://git-scm.com/) |

### Verify Installation

```bash
node --version   # Should output v18.x.x or higher
npm --version    # Should output 9.x.x or higher
git --version    # Should output 2.30.x or higher
```

---

## Initial Setup

### 1. Clone Repository

```bash
git clone <repository-url>
cd CBook
```

### 2. Install Dependencies

```bash
npm install
```

This installs all project dependencies including:
- Docusaurus 3.x
- React 18.x
- TypeScript 5.x
- ESLint, Prettier
- Testing tools (Jest, Cypress)

### 3. Set Up Environment Variables

```bash
cp .env.example .env.local
```

Edit `.env.local` and configure:
```env
# GitHub OAuth (for authentication)
GITHUB_CLIENT_ID=your_github_oauth_client_id
GITHUB_CLIENT_SECRET=your_github_oauth_client_secret

# Optional: Analytics
GOOGLE_ANALYTICS_ID=your_ga_id
```

**Important**: Never commit `.env.local` to version control.

### 4. Set Up Pre-commit Hooks

```bash
npm run prepare
```

This initializes Husky pre-commit hooks that run:
- ESLint on TypeScript/JavaScript files
- Prettier on all supported files

### 5. Verify Setup

```bash
npm run build
npm run start
```

Navigate to `http://localhost:3000` to verify the application loads correctly.

---

## Development Workflow

### Start Development Server

```bash
npm run start
```

This starts the Docusaurus development server with:
- Hot module replacement (HMR)
- Live reload on file changes
- Accessible at `http://localhost:3000`

### Development Mode Options

```bash
# Start with specific port
npm run start -- --port 3001

# Start with specific host (for Docker/network access)
npm run start -- --host 0.0.0.0

# Clear cache and start
npm run clear && npm run start
```

### File Watching

The development server watches:
- `src/**/*` - React components, hooks, utilities
- `docs/**/*` - Content pages (MDX, Markdown)
- `docusaurus.config.ts` - Configuration (requires restart)
- `sidebars.ts` - Sidebar configuration (requires restart)

---

## Common Tasks

### Create New Content Page

```bash
# Create module directory
mkdir -p docs/modules/module-name

# Create content page
touch docs/modules/module-name/topic-name.mdx
```

**Template for content page:**
```mdx
---
id: topic-name
title: Topic Title
sidebar_label: Topic
description: Brief description for SEO
---

# Topic Title

<!-- Content goes here -->
```

### Add New Component

```bash
# Create component directory
mkdir -p src/components/ComponentName

# Create component files
touch src/components/ComponentName/ComponentName.tsx
touch src/components/ComponentName/ComponentName.module.css
touch src/components/ComponentName/__tests__/ComponentName.test.tsx
```

### Update Design Tokens

Edit design tokens:
```bash
src/theme/design-tokens.ts
```

After updating, verify changes:
```bash
npm run typecheck
npm run lint
```

### Add New Route

For custom pages:
```bash
# Create page in src/pages/
touch src/pages/custom-page.tsx
```

Automatically accessible at `/custom-page`.

---

## Docker Development

### Build Development Container

```bash
docker-compose build dev
```

### Start Development Container

```bash
docker-compose up dev
```

Application accessible at `http://localhost:3000`.

### Stop Development Container

```bash
docker-compose down
```

### Production Build with Docker

```bash
# Build production image
docker-compose build prod

# Start production container
docker-compose up prod
```

Application accessible at `http://localhost:8080`.

### Docker Troubleshooting

**Clear Docker cache:**
```bash
docker-compose down -v
docker-compose build --no-cache dev
```

**View logs:**
```bash
docker-compose logs -f dev
```

---

## Testing

### Run All Tests

```bash
npm run test
```

### Run Tests with Coverage

```bash
npm run test:coverage
```

Target: 80%+ code coverage for all components.

### Run Tests in Watch Mode

```bash
npm run test:watch
```

### Run Integration Tests (Cypress)

```bash
# Start development server first
npm run start

# In another terminal
npx cypress open
```

Or run headless:
```bash
npx cypress run
```

### Write New Tests

**Unit Test Template:**
```typescript
// src/components/MyComponent/__tests__/MyComponent.test.tsx
import { render, screen } from '@testing-library/react';
import MyComponent from '../MyComponent';

describe('MyComponent', () => {
  it('renders correctly', () => {
    render(<MyComponent />);
    expect(screen.getByText('Expected Text')).toBeInTheDocument();
  });
});
```

**Integration Test Template:**
```typescript
// cypress/e2e/feature.spec.ts
describe('Feature Test', () => {
  it('completes user journey', () => {
    cy.visit('/');
    cy.get('[data-testid="button"]').click();
    cy.url().should('include', '/expected-route');
  });
});
```

---

## Deployment

### Build for Production

```bash
npm run build
```

Output: `build/` directory containing static HTML, CSS, JS.

### Test Production Build Locally

```bash
npm run serve
```

Accessible at `http://localhost:3000`.

### Deploy to GitHub Pages

```bash
npm run deploy
```

This builds the site and pushes to `gh-pages` branch.

**Prerequisites:**
- Repository must be public or have GitHub Pages enabled
- `docusaurus.config.ts` must have correct `organizationName` and `projectName`

### Continuous Deployment (CI/CD)

On push to `main` branch, GitHub Actions automatically:
1. Runs linting and type checking
2. Runs tests
3. Builds production bundle
4. Deploys to GitHub Pages

See `.github/workflows/deploy.yml` for configuration.

---

## Troubleshooting

### Development Server Won't Start

**Symptom:** `npm run start` fails with port conflict.

**Solution:**
```bash
# Check if port 3000 is in use
lsof -i :3000  # macOS/Linux
netstat -ano | findstr :3000  # Windows

# Kill the process or use different port
npm run start -- --port 3001
```

### Build Fails with TypeScript Errors

**Symptom:** `npm run build` fails with type errors.

**Solution:**
```bash
# Run type checking to see detailed errors
npm run typecheck

# Fix type errors or add type assertions
```

### Hot Reload Not Working

**Symptom:** Changes not reflecting in browser.

**Solution:**
```bash
# Clear Docusaurus cache
npm run clear

# Restart development server
npm run start
```

### Docker Container Not Building

**Symptom:** `docker-compose build` fails.

**Solution:**
```bash
# Clear Docker cache
docker system prune -a

# Rebuild without cache
docker-compose build --no-cache dev
```

### Pre-commit Hooks Failing

**Symptom:** Commit blocked by Husky hooks.

**Solution:**
```bash
# Run linting manually and fix issues
npm run lint:fix

# Run formatting
npm run format

# Try commit again
git commit -m "Your message"
```

### Missing Dependencies

**Symptom:** Import errors or module not found.

**Solution:**
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Or using Docker
docker-compose down -v
docker-compose build --no-cache dev
```

---

## Code Quality

### Linting

```bash
# Run ESLint
npm run lint

# Fix auto-fixable issues
npm run lint:fix
```

### Formatting

```bash
# Format all files
npm run format
```

Prettier formats:
- TypeScript/JavaScript (`.ts`, `.tsx`, `.js`, `.jsx`)
- Markdown/MDX (`.md`, `.mdx`)
- CSS (`.css`)
- JSON (`.json`)
- YAML (`.yml`, `.yaml`)

### Type Checking

```bash
npm run typecheck
```

Runs TypeScript compiler in strict mode.

### Pre-commit Checklist

Before committing:
- [ ] Code passes `npm run lint`
- [ ] Code passes `npm run typecheck`
- [ ] Code is formatted with `npm run format`
- [ ] Tests pass with `npm run test`
- [ ] Build succeeds with `npm run build`

---

## Project Structure

```
CBook/
├── .github/              # GitHub Actions workflows
├── .husky/               # Git hooks (pre-commit)
├── cypress/              # Integration tests
├── docs/                 # Content (MDX/Markdown)
│   ├── modules/          # Educational modules
│   ├── RUNBOOK.md        # This file
│   └── DEPLOYMENT.md     # Deployment guide
├── src/
│   ├── components/       # React components
│   ├── css/              # Global styles
│   ├── hooks/            # Custom React hooks
│   ├── pages/            # Custom pages
│   ├── theme/            # Design tokens, typography
│   ├── types/            # TypeScript type definitions
│   └── utils/            # Utility functions
├── static/               # Static assets (images, fonts)
├── .env.example          # Environment variables template
├── docusaurus.config.ts  # Docusaurus configuration
├── package.json          # Dependencies and scripts
├── sidebars.ts           # Sidebar configuration
├── tailwind.config.js    # Tailwind CSS configuration
├── tsconfig.json         # TypeScript configuration
├── Dockerfile            # Docker image definition
├── docker-compose.yml    # Docker services
└── nginx.conf            # Nginx configuration for production
```

---

## Support & Resources

- **Project Documentation**: [README.md](https://github.com/YOUR_GITHUB_USERNAME/physical-ai-textbook/blob/main/README.md)
- **Contributing Guidelines**: [CONTRIBUTING.md](https://github.com/YOUR_GITHUB_USERNAME/physical-ai-textbook/blob/main/CONTRIBUTING.md)
- **Docusaurus Docs**: [docusaurus.io](https://docusaurus.io/)
- **React Docs**: [react.dev](https://react.dev/)
- **TypeScript Handbook**: [typescriptlang.org](https://www.typescriptlang.org/docs/)

---

## Changelog

| Date | Version | Changes |
|------|---------|---------|
| 2026-01-16 | 1.0.0 | Initial runbook creation |

---

**Last Updated**: 2026-01-16
**Maintained by**: Development Team
