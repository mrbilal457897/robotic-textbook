# RAG Textbook Chatbot - Frontend

Next.js 14 frontend for the RAG-powered textbook chatbot.

## Project Structure

```
frontend/
├── src/
│   ├── app/                      # Next.js 14 App Router
│   │   ├── (textbook)/          # Textbook reading pages
│   │   ├── api/                 # API routes (OAuth callbacks)
│   │   ├── layout.tsx           # Root layout
│   │   └── page.tsx             # Homepage
│   ├── components/
│   │   ├── chat/                # Chat UI components
│   │   │   ├── ChatPanel.tsx   # Main chat panel
│   │   │   ├── MessageList.tsx # Message display
│   │   │   ├── MessageInput.tsx# Input field
│   │   │   ├── ModeSelector.tsx# Mode toggle
│   │   │   ├── ToneSelector.tsx# Tone dropdown
│   │   │   ├── CitationBadge.tsx# Citation display
│   │   │   └── SourcePreview.tsx# Citation modal
│   │   ├── highlight/           # Highlight-to-ask feature
│   │   │   ├── SelectionToolbar.tsx
│   │   │   └── useTextSelection.ts
│   │   └── ui/                  # shadcn/ui components
│   ├── services/
│   │   ├── api.ts               # API client
│   │   └── auth.ts              # Auth state
│   ├── hooks/
│   │   ├── useChat.ts           # Chat state management
│   │   └── useAuth.ts           # Auth hook
│   └── lib/
│       └── utils.ts             # Utility functions
├── tests/
│   ├── unit/                    # Component unit tests
│   └── e2e/                     # Playwright E2E tests
├── public/
│   └── glossary.json            # Textbook glossary
├── .env.local.example           # Environment template
├── package.json                 # Dependencies
├── tsconfig.json                # TypeScript config
├── tailwind.config.ts           # Tailwind config
├── next.config.js               # Next.js config
└── README.md                    # This file
```

## Setup

### Prerequisites

- Node.js 20+
- npm 9+
- Backend running at http://localhost:8000

### Installation

```bash
# Install dependencies
npm install

# Copy environment template
cp .env.local.example .env.local

# Edit .env.local with your configuration
# (See SETUP_INFRASTRUCTURE.md for details)
```

### Running

```bash
# Development server with hot reload
npm run dev

# Open browser at http://localhost:3000

# Build for production
npm run build

# Start production server
npm start
```

## Development

### Code Style

- **Linting**: ESLint (`npm run lint`)
- **Formatting**: Prettier (`npm run format`)
- **Type Checking**: TypeScript (`npm run type-check`)

### Testing

```bash
# Unit tests (Vitest)
npm test

# Unit tests with UI
npm run test:ui

# E2E tests (Playwright)
npm run test:e2e

# E2E tests with UI
npm run test:e2e:ui
```

### Environment Variables

See `.env.local.example` for all available configuration options.

**Required**:
- `NEXT_PUBLIC_API_URL` - Backend API URL (http://localhost:8000)

**Optional**:
- `NEXT_PUBLIC_GITHUB_CLIENT_ID` - GitHub OAuth
- `NEXT_PUBLIC_GOOGLE_CLIENT_ID` - Google OAuth
- `NEXT_PUBLIC_SENTRY_DSN` - Error tracking
- Feature flags (see `.env.local.example`)

## Components

### Chat Components

- **ChatPanel**: Main chat interface (collapsible, responsive)
- **MessageList**: Displays conversation history with citations
- **MessageInput**: Text input with submit button
- **ModeSelector**: Toggle between Book-Only, Selected-Text, General modes
- **ToneSelector**: Choose Academic, Beginner-friendly, or Concise tone
- **CitationBadge**: Inline citation display with hover preview
- **SourcePreview**: Modal showing full citation context

### Highlight-to-Ask

- **SelectionToolbar**: Floating "Ask AI" button on text selection
- **useTextSelection**: Hook for detecting text selection

## API Integration

The frontend communicates with the FastAPI backend via REST API:

```typescript
// Example: Send chat message
import { sendMessage } from '@/services/api';

const response = await sendMessage({
  message: "What is inverse kinematics?",
  mode: "book-only",
  tone: "academic",
  book_id: "physical-ai-robotics"
});
```

## Styling

- **Framework**: Tailwind CSS
- **Component Library**: shadcn/ui (Radix UI primitives)
- **Icons**: Lucide React
- **Responsive**: Mobile-first design
- **Dark Mode**: System-based (coming soon)

## State Management

- **Chat State**: Zustand store (`useChat` hook)
- **Auth State**: Zustand store (`useAuth` hook)
- **Local Storage**: Conversation persistence

## Routing

Next.js 14 App Router:

```
/                          # Homepage
/about                     # About page
/(textbook)/[book]/[chapter]  # Textbook reading page with chat
/auth/callback             # OAuth callback handler
```

## Performance

- **Static Generation**: Where possible
- **Server Components**: By default
- **Client Components**: Only when needed (interactivity)
- **Image Optimization**: Next.js Image component
- **Code Splitting**: Automatic route-based splitting

## Accessibility

- **WCAG AA Compliance**: Target
- **Keyboard Navigation**: Full support
- **Screen Readers**: ARIA labels and live regions
- **Focus Management**: Proper focus trapping in modals

## Browser Support

- Chrome/Edge: Last 2 versions
- Firefox: Last 2 versions
- Safari: Last 2 versions
- Mobile: iOS 14+, Android 10+

## Troubleshooting

### Port Already in Use

```bash
# Kill process on port 3000
# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Linux/Mac:
lsof -ti:3000 | xargs kill -9
```

### Module Not Found

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### TypeScript Errors

```bash
# Regenerate TypeScript types
npm run type-check
```

## Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Deploy to production
vercel --prod
```

### Environment Variables (Production)

Set these in Vercel dashboard:
- `NEXT_PUBLIC_API_URL` - Your backend URL
- `NEXT_PUBLIC_GITHUB_CLIENT_ID` - GitHub OAuth (if using)
- `NEXT_PUBLIC_GOOGLE_CLIENT_ID` - Google OAuth (if using)
- All other `NEXT_PUBLIC_*` variables from `.env.local.example`

## Contributing

1. Create a feature branch
2. Make your changes
3. Run tests: `npm test && npm run test:e2e`
4. Format code: `npm run format`
5. Type-check: `npm run type-check`
6. Lint: `npm run lint`
7. Commit with clear message
8. Create pull request

## License

See LICENSE file in repository root.
