# Physical AI & Humanoid Robotics Interactive Textbook

**Bridging the gap between digital minds and physical bodies**

[![Security Scan](https://github.com/yourusername/physical-ai-textbook/actions/workflows/security-scan.yml/badge.svg)](https://github.com/yourusername/physical-ai-textbook/actions/workflows/security-scan.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 🚀 Overview

This is a comprehensive interactive textbook covering Physical AI and Humanoid Robotics, featuring:

- **4 Core Modules**: ROS 2, Digital Twin, NVIDIA Isaac, VLA Models
- **RAG-Powered Chatbot**: Ask questions and get citation-backed answers from textbook content
- **Multi-language Support**: English, Urdu, Arabic, Chinese, Spanish
- **Interactive Assessments**: Module quizzes with instant feedback
- **Progress Tracking**: Save your learning journey
- **Modern Design**: "Neural Circuitry Futurism" theme

## 📚 Modules

1. **Module 1**: The Robotic Nervous System (ROS 2)
2. **Module 2**: Digital Twin
3. **Module 3**: NVIDIA Isaac
4. **Module 4**: Vision-Language-Action (VLA) Models

## 🛠️ Installation

### Prerequisites

**Frontend (Docusaurus)**:

- Node.js 20.0.0 or higher
- npm or yarn

**Backend (RAG Chatbot)**:

- Python 3.11 or higher
- PostgreSQL (Neon Serverless)
- Qdrant Cloud account
- Gemini API key

### Quick Start (Frontend Only)

```bash
# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build

# Serve production build locally
npm run serve
```

### Full Stack Setup (Frontend + RAG Backend)

#### 1. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure environment variables
cp .env.example .env
# Edit .env with your API keys and database URLs

# Run database migrations
python scripts/migrate-db.py

# Validate infrastructure connectivity
python scripts/validate-infra.py --all

# Start backend server (development)
uvicorn src.main:app --reload --host 0.0.0.0 --port 8000
```

#### 2. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env.local
# Edit .env.local with backend API URL

# Start development server
npm run dev
```

#### 3. Ingest Textbook Content (One-time)

```bash
cd backend

# Ingest textbook PDFs into vector database
python scripts/ingest-textbook.py --book-id intro-ai --pdf-path /path/to/textbook.pdf
```

### Environment Variables

**Backend (.env)**:

```bash
# Gemini AI
GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=gemini-2.0-flash-exp

# Qdrant Vector Database
QDRANT_URL=https://your-cluster.qdrant.io
QDRANT_API_KEY=your_qdrant_api_key

# Neon Postgres
NEON_DATABASE_URL=postgresql://user:pass@host/db

# Upstash Redis (Rate Limiting)
UPSTASH_REDIS_URL=https://your-redis.upstash.io
UPSTASH_REDIS_TOKEN=your_redis_token

# Sentry (Error Tracking)
SENTRY_DSN=https://your-sentry-dsn
SENTRY_ENVIRONMENT=development

# OAuth (Optional)
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Session Security
SESSION_SECRET_KEY=your_random_secret_key

# CORS
CORS_ORIGINS=http://localhost:3000,https://yourdomain.com

# Rate Limiting
RATE_LIMIT_ANONYMOUS=10
RATE_LIMIT_AUTHENTICATED=100

# Cron Job Security
CRON_SECRET=your_cron_secret
```

**Frontend (.env.local)**:

```bash
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_ENABLE_CHATBOT=true
```

## 🚢 Production Deployment

### Deploy to Vercel (Recommended)

**Prerequisites**:

- Vercel account with CLI installed: `npm i -g vercel`
- Environment variables configured in Vercel dashboard
- All external services provisioned (Qdrant, Neon, Upstash, Gemini)

**Deployment Steps**:

```bash
# 1. Link project to Vercel
vercel link

# 2. Set production environment variables
vercel env add GEMINI_API_KEY production
vercel env add QDRANT_URL production
vercel env add QDRANT_API_KEY production
vercel env add NEON_DATABASE_URL production
vercel env add UPSTASH_REDIS_URL production
vercel env add UPSTASH_REDIS_TOKEN production
vercel env add SENTRY_DSN production
vercel env add SESSION_SECRET_KEY production
vercel env add CRON_SECRET production
vercel env add CORS_ORIGINS production

# 3. Deploy to production
vercel --prod

# 4. Verify deployment
curl https://your-app.vercel.app/api/health
curl https://your-app.vercel.app/api/v1/metrics/summary
```

**Post-Deployment Verification**:

```bash
# Run infrastructure validation
python backend/scripts/validate-infra.py --all

# Test chat endpoint
curl -X POST https://your-app.vercel.app/api/v1/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"What is ROS 2?","mode":"book-only","book_id":"intro-ai"}'

# Check metrics
curl https://your-app.vercel.app/api/v1/metrics/summary

# Verify cron job (manually trigger)
curl -X POST https://your-app.vercel.app/api/v1/cleanup \
  -H "X-Cron-Secret: your_cron_secret"
```

### Alternative: Docker Deployment

```bash
# Build backend image
cd backend
docker build -t rag-chatbot-backend:latest .

# Build frontend image
cd ../frontend
docker build -t rag-chatbot-frontend:latest .

# Run with docker-compose
docker-compose up -d

# Verify services
docker ps
curl http://localhost:8000/health
curl http://localhost:3000
```

### Database Migrations (Production)

```bash
# Run migrations on production database
NEON_DATABASE_URL="your_production_url" python backend/scripts/migrate-db.py

# Verify schema
NEON_DATABASE_URL="your_production_url" python -c "
from backend.src.db.postgres import get_postgres
db = get_postgres()
print(db.execute('SELECT table_name FROM information_schema.tables WHERE table_schema = public'))
"
```

## 🔧 Troubleshooting

### Common Issues

**Issue**: `Cannot find package 'prettier-plugin-tailwindcss'`

```bash
# Solution: Install missing peer dependency
npm install -D prettier-plugin-tailwindcss
# Or skip pre-commit hooks
git commit --no-verify -m "your message"
```

**Issue**: `Qdrant connection timeout`

```bash
# Solution: Verify Qdrant cluster is running
python backend/scripts/validate-infra.py --test-qdrant

# Check firewall rules allow outbound HTTPS
curl -I https://your-cluster.qdrant.io
```

**Issue**: `Gemini API rate limit exceeded`

```bash
# Solution: Check your API quota at https://aistudio.google.com/
# Implement exponential backoff (already included in response.py)
# Upgrade to higher tier if needed
```

**Issue**: `Rate limiting not working`

```bash
# Solution: Verify Upstash Redis connectivity
python backend/scripts/validate-infra.py --test-upstash

# Check Redis TTL settings
python -c "from backend.src.db.upstash import get_upstash; print(get_upstash().get_ttl('test_key'))"
```

**Issue**: `Cron job not running`

```bash
# Solution: Verify cron secret is set in Vercel
vercel env ls

# Check Vercel cron logs in dashboard
# Manually trigger to test: POST /api/v1/cleanup with X-Cron-Secret header
```

**Issue**: `Frontend can't connect to backend`

```bash
# Solution: Check CORS configuration
# Verify NEXT_PUBLIC_API_URL matches backend URL
# Ensure CORS_ORIGINS includes frontend domain in backend .env
```

### Debug Mode

Enable verbose logging for troubleshooting:

```bash
# Backend
export LOG_LEVEL=DEBUG
uvicorn src.main:app --reload

# Check logs
tail -f logs/app.log

# View Sentry errors
# Visit: https://sentry.io/organizations/your-org/issues/
```

## 📚 Additional Documentation

- **API Documentation**: [Swagger UI](https://your-app.vercel.app/docs) (FastAPI auto-generated)
- **Runbook**: [docs/runbook.md](./docs/runbook.md) - Common operational procedures
- **User Guide**: [docs/user-guide/chatbot-usage.md](./docs/user-guide/chatbot-usage.md)
- **Architecture**: [docs/architecture.md](./docs/architecture.md) - System design diagrams
- **Security**: [docs/security/API_KEY_ROTATION.md](./docs/security/API_KEY_ROTATION.md) - Key rotation schedule

## 🏗️ Project Structure

```
physical-ai-textbook/
├── .github/              # GitHub Actions CI/CD
│   └── workflows/        # Security scanning, tests
├── backend/              # Python FastAPI RAG backend
│   ├── src/              # Backend source code
│   │   ├── agents/       # RAG agents (router, retrieval, response)
│   │   ├── api/          # FastAPI routes & middleware
│   │   │   ├── middleware.py  # Rate limiting, IP bans
│   │   │   └── v1/       # API v1 endpoints
│   │   ├── db/           # Database clients (Postgres, Qdrant, Upstash)
│   │   ├── models/       # Data models (ORM, Pydantic)
│   │   └── services/     # Business logic (cleanup, observability)
│   ├── scripts/          # Utility scripts (migration, validation, ingestion)
│   ├── tests/            # Backend tests (unit, integration, contract)
│   └── requirements.txt  # Python dependencies
├── frontend/             # Next.js frontend
│   ├── src/              # Frontend source code
│   │   ├── app/          # Next.js App Router pages
│   │   ├── components/   # React components (chat, highlight, textbook)
│   │   └── styles/       # Tailwind CSS
│   ├── tests/            # Frontend tests (E2E with Playwright)
│   └── package.json      # Node.js dependencies
├── docs/                 # Documentation & content pages (MDX)
│   ├── modules/          # 4 module directories
│   ├── security/         # Security documentation
│   ├── user-guide/       # User guides
│   ├── runbook.md        # Operational runbook
│   └── architecture.md   # Architecture diagrams
├── src/                  # Docusaurus React components & hooks
│   ├── components/       # Reusable UI components
│   ├── hooks/            # Custom React hooks
│   ├── utils/            # Utility functions
│   ├── types/            # TypeScript type definitions
│   └── css/              # Global styles
├── static/               # Static assets
├── quizzes/              # Quiz data (JSON)
├── specs/                # Feature specifications (SDD)
│   └── 002-rag-textbook-chatbot/
├── history/              # Prompt history records & ADRs
├── .specify/             # SpecKit templates & memory
├── docusaurus.config.ts  # Docusaurus configuration
├── sidebars.ts           # Sidebar navigation
├── vercel.json           # Vercel deployment config
└── package.json          # Root Node.js dependencies
```

## 🧪 Testing

### Frontend Tests

```bash
# Unit tests (Jest + React Testing Library)
cd frontend
npm test

# E2E tests (Playwright)
npm run test:e2e

# Specific test suites
npm run test:e2e -- tests/e2e/highlight-to-ask.spec.ts
npm run test:e2e -- tests/e2e/mode-switching.spec.ts
```

### Backend Tests

```bash
# Unit tests
cd backend
pytest tests/unit/ -v

# Integration tests
pytest tests/integration/ -v

# Contract tests (API spec validation)
pytest tests/contract/ -v

# All tests with coverage
pytest --cov=src --cov-report=html --cov-report=term

# View coverage report
open htmlcov/index.html
```

### Legacy Tests (Docusaurus)

```bash
# Legacy Cypress tests
npx cypress open
```

## 📝 Development Workflow

1. **Create a feature branch**: `git checkout -b feature/your-feature`
2. **Make changes**: Follow the coding standards
3. **Run tests**: Ensure all tests pass
4. **Commit**: Use conventional commit messages
5. **Push**: `git push origin feature/your-feature`
6. **Create PR**: Submit for review

## 🎨 Design System

This project uses the "Neural Circuitry Futurism" design system with:

- **Colors**: Electric Cyan (#00F0FF), Plasma Orange (#FF6B35), Deep Space Black (#0A0E14)
- **Typography**: Orbitron (display), Rajdhani (headings), Source Code Pro (body), JetBrains Mono (code)
- **Animations**: Smooth transitions with `prefers-reduced-motion` support

## 🌍 Multi-Language Support

The textbook supports 5 languages with proper RTL layout for Arabic and Urdu.

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for contribution guidelines.

## 📞 Contact

For questions or feedback, please open an issue on GitHub.

---

Built with [Docusaurus](https://docusaurus.io/) and ❤️
