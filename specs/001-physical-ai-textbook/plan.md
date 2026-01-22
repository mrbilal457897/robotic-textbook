# Implementation Plan: Physical AI & Humanoid Robotics Interactive Textbook

**Document Version:** 1.0.0
**Last Updated:** 2026-01-14
**Project:** Physical AI & Humanoid Robotics Interactive Textbook
**Feature Branch**: `001-physical-ai-textbook`
**References:** `constitution.md`, `spec.md`

---

## Executive Summary

This plan outlines the complete implementation strategy for building the Physical AI & Humanoid Robotics Interactive Textbook using Docusaurus 3.x with React 18.x and TypeScript 5.x. The project is divided into 6 sequential phases spanning 8-10 weeks, with clear architectural decisions, milestones, deliverables, and success criteria.

**Key Strategic Decisions**:
- Docusaurus 3.x as static site generator (GitHub Pages compatible)
- Local search plugin for zero external dependencies
- GitHub OAuth for authentication (localStorage session management)
- Device-specific localStorage for progress (no cross-device sync in MVP)
- 80% scroll threshold for page completion tracking
- 7-day session expiry with auto-renewal
- Incremental content generation (section-by-section, ~1,500 words per response)

---

## Constitution Check

### Alignment Verification

**Principle I: Educational Excellence**
- ✅ 6,000-7,000 word content pages per spec.md FR-003
- ✅ Minimum 3-5 code examples per topic (included in content generation)
- ✅ Mermaid diagrams for visual learning (FR-006)
- ✅ Reading time display for transparency (FR-004)
- ✅ Target: Technical undergraduate audience

**Principle II: Token-Friendly Architecture**
- ✅ Content generation section-by-section (~1,500 words max per response)
- ✅ Clarification resolved: Quiz time limit removed (no countdown timer UI)
- ✅ Static markdown content cached in repository
- ✅ Structured templates for consistent output

**Principle III: User-Centric Design**
- ✅ Reading time on every page (FR-004)
- ✅ Global search with keyboard shortcuts (FR-031-037, Clarification: local search plugin)
- ✅ Responsive design across all devices (FR-049)
- ✅ Breadcrumb navigation for context (FR-034)

**Principle IV: Security & Privacy**
- ✅ GitHub OAuth for authentication (FR-024, Clarification: 7-day expiry with auto-renewal)
- ✅ GDPR-compliant cookie consent (FR-038-042)
- ✅ Session management in localStorage (FR-026)
- ✅ No sensitive data transmission

**Principle V: Accessibility & Inclusion**
- ✅ 5-language support: English, Urdu, Arabic, Chinese, Spanish (FR-009)
- ✅ RTL layout for Arabic/Urdu (FR-011)
- ✅ WCAG AA compliance (FR-051-054, SC-009)
- ✅ 4.5:1 color contrast minimum

**Principle VI: Design Consistency**
- ✅ "Neural Circuitry Futurism" theme with defined color palette (FR-046)
- ✅ Orbitron, Rajdhani, Source Code Pro, JetBrains Mono typography (FR-047)
- ✅ Glassmorphism cards and visual effects (FR-048)
- ✅ Animated neural grid background and glow effects

**Constraint Verification**:
- ✅ Static site architecture (no backend database)
- ✅ GitHub Pages deployment
- ✅ Bundle size limits: 250KB (gzipped) total, 150KB JS, 50KB CSS
- ✅ localStorage 5-10MB limit with graceful degradation
- ✅ Browser support: Chrome, Firefox, Safari, Edge (latest 2 versions)

**Constitution Status**: ✅ **FULLY COMPLIANT** - All principles and constraints met

---

## Timeline Overview

### 6-Phase Roadmap

```
Week    1    2    3    4    5    6    7    8    9    10
        |    |    |    |    |    |    |    |    |    |
Phase 1 ████████                                        Foundation
Phase 2      ████████████                               Homepage
Phase 3           ████████████████                      Content
Phase 4                     ████████████                Features
Phase 5                               ████████          i18n & Polish
Phase 6                                    ████████     Test & Deploy
```

### Phase Milestones

| Milestone | Week | Deliverable | Status |
|-----------|------|-------------|--------|
| M1 | 2 | Docusaurus setup, design system | Foundation |
| M2 | 4 | Homepage with 6 sections | Scaffolding |
| M3 | 6 | All 4 modules, quiz system | Content |
| M4 | 7 | Auth, search, cookies | Features |
| M5 | 9 | Multi-language, polish | Localization |
| M6 | 10 | Deployed to GitHub Pages | Launch |

---

## Phase 1: Foundation Setup (Weeks 1-2)

**Goal**: Establish project infrastructure, design system, and development environment

### 1.1 Project Initialization

**Duration**: 2 days

```bash
# Create Docusaurus project with TypeScript
npx create-docusaurus@latest physical-ai-textbook classic --typescript

# Project structure
physical-ai-textbook/
├── .github/
│   └── workflows/
│       └── deploy.yml                 # GitHub Actions CI/CD
├── docs/
│   ├── module-1-ros2/
│   │   ├── index.md
│   │   ├── nodes-topics-services.md
│   │   ├── python-rclpy.md
│   │   └── urdf-humanoids.md
│   ├── module-2-digital-twin/        # Similar structure
│   ├── module-3-isaac/               # Similar structure
│   └── module-4-vla/                 # Similar structure
├── quizzes/
│   ├── module-1-quiz.json
│   ├── module-2-quiz.json
│   ├── module-3-quiz.json
│   └── module-4-quiz.json
├── src/
│   ├── components/
│   │   ├── Quiz/
│   │   ├── ModuleCard/
│   │   ├── Hero/
│   │   ├── Timeline/
│   │   └── ...
│   ├── hooks/
│   │   ├── useQuiz.ts
│   │   ├── useAuth.ts
│   │   └── useCookieConsent.ts
│   ├── css/
│   │   ├── variables.css              # Design tokens
│   │   ├── animations.css             # Keyframe definitions
│   │   └── global.css                 # Base styles
│   ├── theme/
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   └── DocItem.tsx
│   └── pages/
│       └── index.tsx                  # Homepage
├── i18n/                              # Multi-language structure
├── static/
│   ├── fonts/                         # Self-hosted fonts
│   └── images/
├── docusaurus.config.ts               # Main config
├── sidebars.ts                        # Navigation structure
└── package.json
```

### 1.2 Design System Implementation

**Duration**: 3 days

#### CSS Variables (variables.css)
```css
/* Color Palette - Neural Circuitry Futurism */
--primary: #00F0FF;                    /* Electric Cyan */
--secondary: #B8C4CE;                  /* Titanium Silver */
--accent: #FF6B35;                     /* Plasma Orange */
--bg-primary: #0A0E14;                 /* Deep Space Black */
--bg-card: #1A2230;                    /* Midnight Blue */
--text-primary: #E8EDF3;               /* Light Gray */
--text-secondary: #9AABB8;             /* Muted Silver */
--success: #00E676;                    /* Neon Green */
--warning: #FFB300;                    /* Amber */
--error: #FF5252;                      /* Coral Red */

/* Typography */
--font-display: 'Orbitron';            /* Titles */
--font-heading: 'Rajdhani';            /* Section heads */
--font-body: 'Source Code Pro';        /* Body text */
--font-mono: 'JetBrains Mono';         /* Code blocks */

/* Spacing Scale */
--space-xs: 0.25rem;                   /* 4px */
--space-sm: 0.5rem;                    /* 8px */
--space-md: 1rem;                      /* 16px */
--space-lg: 1.5rem;                    /* 24px */
--space-xl: 2rem;                      /* 32px */

/* Breakpoints */
--mobile: 375px;
--tablet: 768px;
--desktop: 1200px;
--wide: 1440px;
```

#### Animation System (animations.css)
```css
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes glowPulse {
  0%, 100% { box-shadow: 0 0 20px rgba(0, 240, 255, 0.3); }
  50% { box-shadow: 0 0 40px rgba(0, 240, 255, 0.6); }
}

@keyframes shimmer {
  0% { background-position: -1000px 0; }
  100% { background-position: 1000px 0; }
}

/* Respect prefers-reduced-motion */
@media (prefers-reduced-motion: reduce) {
  * { animation-duration: 0.01ms !important; }
}
```

### 1.3 Development Tools Configuration

**Duration**: 1 day

- ESLint + Prettier for code quality
- TypeScript strict mode
- Path aliases (`@components`, `@hooks`, `@css`)
- Husky pre-commit hooks
- GitHub Actions CI/CD pipeline

### 1.4 Deliverables

- ✅ GitHub repository initialized
- ✅ Docusaurus project scaffolded
- ✅ Design system tokens defined
- ✅ Folder structure created
- ✅ Development tools configured

### 1.5 Success Criteria

- [ ] `npm run start` launches dev server without errors
- [ ] `npm run build` completes successfully
- [ ] Design tokens accessible in browser DevTools
- [ ] Fonts loading correctly
- [ ] Dark theme applied globally
- [ ] All team members can clone and run locally

---

## Phase 2: Homepage Development (Weeks 2-4)

**Goal**: Build complete homepage with all 6 sections, header, and footer

### 2.1 Core Components

#### Header/Navbar (Task 2.1)
- Custom Navbar with sticky positioning
- Logo + navigation links (Home, Modules, Resources, About)
- Search bar placeholder
- Language selector placeholder (UI only, functional in Phase 5)
- GitHub login button (functional in Phase 4)
- Mobile hamburger menu
- Blur effect on scroll

#### Footer (Task 2.2)
- Logo and tagline
- Quick links section
- Social media links
- Copyright notice
- Cookie settings link (functional in Phase 4)

#### Homepage Sections (Tasks 2.3-2.8)

**2.3 Hero Section**
- Title with gradient effect
- Subtitle and CTA description
- "Start Reading" button (primary)
- "Login with GitHub" button (secondary)
- Animated neural grid background
- Floating particles effect
- Entrance animations on scroll

**2.4 Course Modules (4 cards)**
- ModuleCard component with glassmorphism
- Icon + module number + title + description
- "Explore Module" button
- Hover effects: lift, glow, shimmer
- Holographic rotating gradient
- 4-column grid → 2-column tablet → 1-column mobile
- Staggered entrance animation

**2.5 Why Physical AI Matters**
- 60/40 layout (text left, image right)
- Section header with label
- Gradient heading
- Key points with icons
- Humanoid robot illustration
- Neural network overlay (animated)
- Responsive stacking on mobile

**2.6 Weekly Breakdown (Timeline)**
- Vertical timeline with gradient line
- 13 accordion items (Weeks 1-13)
- Week label + title + description
- Single expand behavior
- Chevron rotation animation
- Node glow on active state
- Keyboard navigation

**2.7 Curricular Guidance (Tabs)**
- 3 tabs: Learning Outcomes, Assessments, Prerequisites
- Pill-style tab bar
- Content cards per tab
- Icons and visual hierarchy
- Tab switching animation
- Keyboard navigation

**2.8 Hardware Requirements (Tabs)**
- 4 tabs: Workstation, Edge Kit, Robot Lab, Cloud Option
- Data tables with specifications
- Price highlighting
- Price calculations
- Responsive table layout

### 2.2 Deliverables

| Item | Description | Criteria |
|------|-------------|----------|
| Header | Sticky navbar, all navigation | Responsive, blur effect |
| Footer | Links + copyright | All links work |
| Hero | Animated hero + CTAs | Smooth animations |
| Modules | 4 interactive cards | Hover effects |
| Why AI | Split layout + image | Responsive |
| Timeline | Expandable weekly breakdown | Accordion works |
| Curriculum | 3 tabbed sections | Tabs switch |
| Hardware | 4 tabbed specs | All data displayed |

### 2.3 Success Criteria

- [ ] Header responsive on all breakpoints
- [ ] Footer renders on all pages
- [ ] Hero animations smooth (60fps)
- [ ] Module cards responsive
- [ ] All sections scroll smoothly
- [ ] Lighthouse score > 80 (before optimization)
- [ ] No layout shifts

---

## Phase 3: Content System (Weeks 3-6)

**Goal**: Create all content pages with reading time, and set up content generation workflow

### 3.1 Content Architecture

#### Sidebar Navigation (Task 3.1)
```typescript
// sidebars.ts
const sidebars = {
  docs: [
    {
      type: 'category',
      label: 'Module 1: The Robotic Nervous System',
      collapsed: false,
      items: [
        'module-1-ros2/index',
        'module-1-ros2/nodes-topics-services',
        'module-1-ros2/python-rclpy',
        'module-1-ros2/urdf-humanoids',
      ]
    },
    // Modules 2-4 follow same structure
  ]
};
```

#### Reading Time Component (Task 3.2)
```typescript
// Formula from spec.md
const calculateReadingTime = (content: string): number => {
  const wordCount = content.split(/\s+/).length;
  const codeBlocks = (content.match(/```/g) || []).length / 2;
  const diagrams = (content.match(/mermaid/g) || []).length;

  return Math.ceil(wordCount / 200) + (codeBlocks * 1) + (diagrams * 0.5);
};
```

#### Custom Doc Page Layout (Task 3.3)
- Reading time display below title
- Previous/Next navigation buttons
- Table of contents sidebar
- Progress bar (scroll percentage, FR-043)
- Progress tracking (80% scroll threshold, Clarification resolved)
- "Edit on GitHub" link

### 3.2 Content Generation Strategy

**Approach**: Section-by-section generation following token-friendly architecture (Principle II)

Each 6,000-7,000 word topic is generated in ~3-4 sections (~1,500 words each):

**Example: Module 1 - Nodes, Topics, and Services (6,500 words)**

1. **Section 1: Introduction & ROS 2 Architecture (~1,500 words)**
   - What is ROS 2?
   - Middleware overview
   - Why ROS 2 for humanoids
   - Architecture diagram (Mermaid)

2. **Section 2: Nodes Deep Dive (~1,500 words)**
   - Node concepts
   - Lifecycle states
   - 2 code examples
   - Best practices

3. **Section 3: Topics and Pub/Sub (~1,500 words)**
   - Topic concept
   - Publishers and subscribers
   - Quality of Service (QoS)
   - 2 code examples

4. **Section 4: Services & Summary (~1,500 words)**
   - Service/client pattern
   - Service request/response
   - Practical tutorial project
   - Summary and next steps

**Generation Command Template**:
```
Generate section {N}/{total} of topic "{topic_title}" for {module_name}.
Constraints:
- ~1,500 words maximum
- Include 1-2 code examples
- Use markdown formatting
- Include diagrams as mermaid if appropriate
- Target: technical undergraduate audience
- Maintain consistency with previous sections
```

### 3.3 Module Content Structure

All 4 modules follow identical pattern:
- **1 Overview page** (~500 words): Introduction, learning objectives, prerequisites
- **3-4 Topic pages** (6,000-7,000 words each): Core content with examples and tutorials

**Module 1: The Robotic Nervous System (ROS 2)**
1. Overview
2. Nodes, Topics, and Services
3. Python with rclpy
4. URDF for Humanoids

**Module 2: Digital Twin**
1. Overview
2. Gazebo Physics Simulation
3. Unity Rendering & Visualization
4. Sensor Simulation

**Module 3: NVIDIA Isaac**
1. Overview
2. Isaac Sim Platform
3. Isaac ROS VSLAM
4. Nav2 Path Planning

**Module 4: Vision and Language Models (VLA)**
1. Overview
2. Voice-to-Action Systems
3. LLM Cognitive Planning
4. Capstone Project

### 3.4 Deliverables

| Item | Description | Criteria |
|------|-------------|----------|
| Sidebar Config | Module navigation | All modules navigable |
| Reading Time | Calculation component | Accurate metrics |
| 16+ Pages | All content pages | 6,000-7,000 words |
| Code Examples | Syntax highlighted | Python, TypeScript, YAML |
| Diagrams | Mermaid renderings | Architecture + flow |

### 3.5 Success Criteria

- [ ] All 16+ pages created and deployed
- [ ] Reading time displays on all pages
- [ ] Code examples render correctly
- [ ] Diagrams render correctly
- [ ] All links functional
- [ ] Content technically accurate
- [ ] No broken images or references

---

## Phase 4: Interactive Features (Weeks 5-7)

**Goal**: Implement quiz system, authentication, search, and cookie management

### 4.1 Quiz System

#### Quiz Data Structure (Task 4.1)

```json
{
  "quizId": "module-1-quiz",
  "moduleId": 1,
  "title": "Module 1 Assessment",
  "description": "Test your understanding of ROS 2 basics",
  "questions": [
    {
      "id": "q1",
      "type": "multiple-choice",
      "text": "What does ROS stand for?",
      "options": ["Robot Operating System", "Robotic Operations Software", "..."],
      "correctAnswer": 0,
      "explanation": "ROS stands for Robot Operating System...",
      "difficulty": "easy",
      "points": 10
    },
    // 9 more questions (7 MC, 3 T/F)
  ],
  "passingScore": 70,
  "totalPoints": 100
}
```

#### Quiz Components (Tasks 4.2-4.4)

**QuizContainer**
- Manages quiz state and flow
- Handles answer selection
- Calculates scoring
- Displays results

**QuizQuestion**
- Renders current question
- Question counter (3/10)
- Progress bar
- Option rendering (radio buttons for MC, toggle for T/F)
- Navigation buttons (Previous/Next)

**QuizResults**
- Score percentage (large display)
- Pass/Fail indicator with styling
- Breakdown: Correct/Incorrect/Skipped
- Per-question review with explanations
- "Retake Quiz" button
- "Back to Module" button

**Scoring Logic** (from FR-018)
- Passing score: 70% (7/10 correct)
- No time limits (Clarification resolved)
- Unlimited retakes
- Results saved for authenticated users only

#### Progress Tracking Integration (Task 4.10)

```typescript
// Quiz attempt record (stored in localStorage for authenticated users)
interface QuizAttempt {
  userId: string;                    // GitHub ID
  quizId: string;
  dateStarted: ISO8601;
  dateCompleted: ISO8601;
  answers: Record<string, number>;   // question ID → selected option index
  score: number;                     // 0-100
  passed: boolean;                   // score >= 70
  timeSpent: number;                 // seconds
}

// Progress tracking
interface ReadingProgress {
  userId: string;
  moduleId: number;
  pagesRead: string[];               // array of page IDs marked complete (80% scroll)
  completionPercentage: number;      // calculated from pagesRead.length / totalPages
  lastAccessedTimestamp: ISO8601;
}
```

### 4.2 Authentication System

#### GitHub OAuth Flow (Tasks 4.5-4.7)

**Setup Steps**:
1. Create GitHub OAuth App (github.com/settings/developers)
2. Generate Client ID and Client Secret
3. Set Authorization callback URL: `https://physical-ai-textbook.github.io/oauth-callback`

**Flow**:
```
User clicks "Login with GitHub"
    ↓
Redirect to: https://github.com/login/oauth/authorize?client_id={ID}&redirect_uri={URI}
    ↓
User authorizes → GitHub redirects back
    ↓
Exchange code for access token
    ↓
Fetch user profile (username, avatar, email)
    ↓
Store in localStorage + update UI
```

**Session Management** (Clarification: 7-day expiry with auto-renewal)

```typescript
interface SessionData {
  userId: string;                    // GitHub user ID
  username: string;
  avatarUrl: string;
  accessToken: string;               // GitHub OAuth token
  sessionExpiry: ISO8601;            // 7 days from login
  lastActivity: ISO8601;             // for auto-renewal
}

// Auto-renewal logic
if (Date.now() > sessionExpiry && Date.now() < sessionExpiry + 7days) {
  sessionExpiry = Date.now() + 7days; // Extend by another 7 days
}
```

#### Auth UI Components (Tasks 4.5-4.6)

**LoginButton**
- "Login with GitHub" text + logo
- Triggers OAuth flow on click
- Disabled during redirect

**UserProfile**
- GitHub avatar (circular)
- Username on hover
- Dropdown menu with:
  - Profile link (to GitHub if available)
  - Logout button
- Visible only when authenticated

**useAuth Hook** (Task 4.7)

```typescript
const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check auth status on mount
  useEffect(() => {
    const sessionData = localStorage.getItem('session');
    if (sessionData) {
      const session = JSON.parse(sessionData);
      if (Date.now() < session.sessionExpiry) {
        setUser(session);
      } else {
        localStorage.removeItem('session');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (code: string) => {
    // Exchange code for token, fetch user, store session
  };

  const logout = () => {
    localStorage.removeItem('session');
    setUser(null);
  };

  return { user, isLoading, login, logout };
};
```

### 4.3 Search System

**Clarification Resolved**: Using local search plugin (Docusaurus built-in) for zero external dependencies

#### Implementation (Task 4.8)

```bash
npm install @easyops-cn/docusaurus-search-local
```

**Configuration in docusaurus.config.ts**:
```typescript
plugins: [
  [
    '@easyops-cn/docusaurus-search-local',
    {
      hashed: true,
      indexBlog: false,
      docsRouteBasePath: '/docs',
      language: ['en'],
    },
  ],
]
```

**Features**:
- Full-text search across markdown content
- Keyboard shortcut: Cmd/Ctrl + K (FR-032)
- Results grouped by module/section
- Highlighted matches in snippets
- Click to navigate to page
- Search history for authenticated users (localStorage)

**Performance**:
- Search index built at build time
- Client-side search (no API calls)
- 300ms debounce on input (FR-035)
- Sub-100ms response time for typical queries

### 4.4 Cookie Consent System

#### Implementation (Task 4.9)

**Three Cookie Categories** (FR-039):
1. **Essential** (always enabled)
   - Session management
   - Language preference
   - Theme preference
   - Login state

2. **Analytics** (optional)
   - Google Analytics (future)
   - User behavior tracking
   - Page view metrics

3. **Preferences** (optional)
   - User personalization
   - Content recommendations

#### CookieConsent Component

```typescript
interface CookiePreference {
  essential: true;               // always true
  analytics: boolean;
  preferences: boolean;
  consentDate: ISO8601;
  consentVersion: number;        // for future updates
}
```

**Banner Features**:
- Appears only on first visit (check localStorage)
- Sticky at bottom of page
- Three buttons: "Accept All", "Reject Non-Essential", "Customize"
- Custom preferences modal
- "Cookie Settings" link in footer
- Persists preferences across sessions

**useCookieConsent Hook**:
```typescript
const useCookieConsent = () => {
  const [preferences, setPreferences] = useState<CookiePreference | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('cookie_consent');
    if (saved) {
      setPreferences(JSON.parse(saved));
    }
  }, []);

  const savePreferences = (prefs: CookiePreference) => {
    localStorage.setItem('cookie_consent', JSON.stringify(prefs));
    setPreferences(prefs);
    // Apply analytics settings, etc.
  };

  return { preferences, savePreferences };
};
```

### 4.5 Deliverables

| Item | Description | Criteria |
|------|-------------|----------|
| Quiz Data | 4 JSON files | 10 questions each |
| Quiz Components | Full UI + logic | Scoring accurate |
| Quiz Results | Results display | Pass/fail indicator |
| GitHub Auth | OAuth integration | Login/logout works |
| Auth UI | User profile + buttons | Responsive |
| Search | Working search | Results accurate |
| Cookies | GDPR banner + prefs | Persists correctly |
| Progress | Tracking system | Scroll detection works |

### 4.6 Success Criteria

- [ ] All quizzes functional
- [ ] Grading accurate (70% passing)
- [ ] GitHub login works
- [ ] User profile displays
- [ ] Search returns relevant results
- [ ] Cookie banner shows on first visit
- [ ] Cookie preferences persist
- [ ] Progress tracking works at 80% scroll

---

## Phase 5: Multi-Language & Polish (Weeks 7-9)

**Goal**: Implement multi-language support and polish UI/UX to production quality

### 5.1 Internationalization (i18n) Setup

#### Docusaurus i18n Configuration (Task 5.1)

```typescript
// docusaurus.config.ts
module.exports = {
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'ur', 'ar', 'zh', 'es'],
    localeConfigs: {
      en: {
        label: 'English',
        direction: 'ltr',
        htmlLang: 'en-US',
      },
      ur: {
        label: 'اردو',
        direction: 'rtl',
        htmlLang: 'ur',
      },
      ar: {
        label: 'العربية',
        direction: 'rtl',
        htmlLang: 'ar',
      },
      zh: {
        label: '中文',
        direction: 'ltr',
        htmlLang: 'zh-CN',
      },
      es: {
        label: 'Español',
        direction: 'ltr',
        htmlLang: 'es',
      },
    },
  },
};
```

**URL Structure** (FR-014):
- English: `/en/docs/module-1/...` (default: `/docs/module-1/...`)
- Urdu: `/ur/docs/module-1/...`
- Arabic: `/ar/docs/module-1/...`
- Chinese: `/zh/docs/module-1/...`
- Spanish: `/es/docs/module-1/...`

#### Language Selector Component (Task 5.2)

```typescript
// LanguageSelector.tsx
import { useLocation } from '@docusaurus/router';

export const LanguageSelector = () => {
  const currentLang = useCurrentLanguage(); // Inferred from URL

  const languages = [
    { code: 'en', label: 'English', flag: '🇬🇧' },
    { code: 'ur', label: 'اردو', flag: '🇵🇰' },
    { code: 'ar', label: 'العربية', flag: '🇸🇦' },
    { code: 'zh', label: '中文', flag: '🇨🇳' },
    { code: 'es', label: 'Español', flag: '🇪🇸' },
  ];

  return (
    <select value={currentLang} onChange={switchLanguage}>
      {languages.map(lang => (
        <option key={lang.code} value={lang.code}>
          {lang.flag} {lang.label}
        </option>
      ))}
    </select>
  );
};
```

**Preference Storage** (FR-013):
```typescript
// Store in localStorage
localStorage.setItem('preferredLanguage', languageCode);
```

### 5.2 Right-to-Left (RTL) Support

#### RTL CSS Overrides (Task 5.3)

```css
/* For Arabic and Urdu */
[dir="rtl"] {
  /* Flip flexbox layouts */
  .flex-row { flex-direction: row-reverse; }

  /* Mirror margins and padding */
  margin-left: 0;
  margin-right: var(--space-md);
  padding-left: 0;
  padding-right: var(--space-md);

  /* Flip text alignment */
  text-align: right;

  /* Flip sidebar position */
  .sidebar { order: 2; }
  .content { order: 1; }

  /* Flip icons and arrows */
  .chevron-right { transform: scaleX(-1); }

  /* Keep code blocks LTR (FR-012) */
  .code-block { direction: ltr; }
}
```

**CSS Logical Properties** (Better approach for RTL):
```css
/* Instead of margin-left, use margin-inline-start */
margin-inline-start: var(--space-md);
padding-inline-end: var(--space-md);
text-align: start;
```

### 5.3 Content Translation

#### UI String Translation (Task 5.4)

Create translation files for all UI strings:

```json
// i18n/en/common.json
{
  "nav.home": "Home",
  "nav.modules": "Modules",
  "nav.search": "Search",
  "btn.startReading": "Start Reading",
  "btn.logout": "Logout",
  "quiz.startQuiz": "Start Quiz",
  "quiz.submit": "Submit",
  "quiz.retake": "Retake Quiz",
  "cookie.accept": "Accept All",
  "cookie.reject": "Reject Non-Essential",
  "cookie.customize": "Customize"
}
```

Same keys for each language (ur, ar, zh, es).

#### Documentation Translation (Task 5.5)

Content translation strategy:
- **Phase 5**: Translate module overviews + key sections
- **Post-launch**: Incrementally translate remaining content
- **Community**: Allow crowdsourced translations

### 5.4 UI Polish

#### Animations Refinement (Task 5.6)
- Review all animations for smoothness
- Ensure 60fps on target devices
- Profile with Chrome DevTools Performance tab
- Optimize using CSS animations over JS
- Implement reduced-motion properly

#### Responsive Design Polish (Task 5.7)

**Breakpoints**:
- Mobile: 375px (iPhone SE)
- Tablet: 768px (iPad)
- Desktop: 1200px
- Wide: 1440px (4K)

**Testing Checklist**:
- [ ] Homepage responsive on all breakpoints
- [ ] Content readable on mobile
- [ ] Touch targets ≥48px
- [ ] Hamburger menu functional
- [ ] Tables responsive
- [ ] Images scaled properly
- [ ] No horizontal scroll on mobile

#### Accessibility Polish (Task 5.8)

**WCAG AA Compliance** (FR-051-054):
- Color contrast: 4.5:1 for normal text, 3:1 for large
- All interactive elements have focus indicators
- ARIA labels on all buttons/inputs
- Semantic HTML heading hierarchy
- Alt text on all images
- Keyboard navigation functional

**Testing Tools**:
- axe DevTools browser extension
- Wave accessibility checker
- Screen reader testing (NVDA, JAWS, VoiceOver)
- Lighthouse accessibility audit

### 5.5 Performance Optimization

#### Bundle Optimization (Task 5.9)

**Targets** (from FR-055, FR-056):
- LCP (Largest Contentful Paint): < 2.5s
- FID (First Input Delay): < 100ms
- CLS (Cumulative Layout Shift): < 0.1
- Total bundle (gzipped): < 250KB
- Main JS: < 150KB
- Main CSS: < 50KB

**Optimization Strategies**:
- Code splitting by route
- Lazy loading images below fold
- Tree-shaking unused code
- CSS minification
- Font subsetting
- Inline critical CSS
- Defer non-critical scripts

### 5.6 Deliverables

| Item | Description | Criteria |
|------|-------------|----------|
| i18n Config | 5 locales configured | All accessible |
| Language Selector | Working switcher | Persists choice |
| RTL Support | Arabic/Urdu layout | All components mirrored |
| Translations | UI strings + docs | All 5 languages |
| Animations | Refined effects | Smooth, 60fps |
| Responsive | All breakpoints | Fully functional |
| Accessibility | WCAG AA compliant | Zero critical issues |
| Performance | Optimized bundles | Lighthouse > 90 |

### 5.7 Success Criteria

- [ ] All 5 languages accessible via URL
- [ ] Language selector works
- [ ] RTL layout correct for Arabic/Urdu
- [ ] No text overlap in RTL
- [ ] Code blocks stay LTR in RTL
- [ ] UI strings translated to 5 languages
- [ ] Module overviews translated
- [ ] Animations smooth on all devices
- [ ] Mobile layout fully functional
- [ ] Accessibility audit passed
- [ ] Lighthouse score > 90
- [ ] No console errors or warnings

---

## Phase 6: Testing & Deployment (Weeks 8-10)

**Goal**: Comprehensive testing, final bug fixes, and production deployment to GitHub Pages

### 6.1 Testing Strategy

#### Unit Testing (Task 6.1)

**Frameworks**: Jest + React Testing Library

**Coverage Targets**: 80% overall

**Test Areas**:
- Utility functions (reading time calculation, scoring logic)
- Custom hooks (useQuiz, useAuth, useCookieConsent)
- Component state management
- Form validation

#### Integration Testing (Task 6.2)

**Framework**: Cypress

**Test Scenarios**:
1. Homepage loads and all sections render
2. Navigation between modules works
3. Complete quiz flow: start → answer → submit → view results
4. Quiz retake functionality
5. GitHub login flow (with mock OAuth)
6. Logout clears session
7. Search returns relevant results
8. Language switching preserves content
9. RTL layout switches correctly
10. Cookie preferences persist

#### Cross-Browser Testing (Task 6.3)

**Target Browsers** (from spec.md):
- Chrome (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Edge (latest 2 versions)
- iOS Safari 15+
- Android Chrome 10+

**Testing Matrix**:
- Layout integrity
- Font rendering
- Animation smoothness
- Touch interactions
- Form input focus states

### 6.2 Continuous Integration/Deployment

#### GitHub Actions Workflow (Task 6.5)

```yaml
# .github/workflows/deploy.yml
name: Build and Deploy

on:
  push:
    branches: [main, 001-physical-ai-textbook]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run linter
        run: npm run lint

      - name: Build
        run: npm run build
        env:
          GITHUB_OAUTH_CLIENT_ID: ${{ secrets.GITHUB_OAUTH_CLIENT_ID }}

      - name: Run tests
        run: npm run test

      - name: Upload coverage
        uses: codecov/codecov-action@v3

      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        if: github.ref == 'refs/heads/main'
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./build
          cname: physical-ai-textbook.github.io
```

### 6.3 Pre-Launch Verification

#### Content Checklist (Task 6.6)

- [ ] All 4 modules complete
- [ ] All 16+ pages have content
- [ ] All quizzes created and reviewed
- [ ] All code examples verified
- [ ] All diagrams render
- [ ] All images optimized
- [ ] All links functional
- [ ] Spell check complete

#### Functionality Checklist

- [ ] Homepage loads without errors
- [ ] Navigation works on all pages
- [ ] Search returns results
- [ ] Quizzes grade correctly
- [ ] Auth flow works
- [ ] Cookie banner displays
- [ ] Language switching works
- [ ] RTL layout correct
- [ ] Progress tracking works

#### Technical Checklist

- [ ] Build completes without errors
- [ ] All tests passing
- [ ] No console errors/warnings
- [ ] Lighthouse score > 90
- [ ] Mobile layout functional
- [ ] Accessibility audit passed
- [ ] Performance targets met

### 6.4 Deployment

#### Steps (Task 6.7)

1. Final code review on `001-physical-ai-textbook` branch
2. Merge to `main` branch
3. GitHub Actions workflow automatically:
   - Runs linter
   - Builds project
   - Runs test suite
   - Deploys to GitHub Pages
4. Monitor deployment for errors

#### Post-Deployment (Task 6.8)

- [ ] Verify site loads at live URL
- [ ] Test all navigation
- [ ] Test quizzes
- [ ] Test auth (if applicable)
- [ ] Verify search works
- [ ] Check all languages accessible
- [ ] Monitor error logs

### 6.5 Documentation (Task 6.9)

- [ ] Update README.md with project overview
- [ ] Document local development setup
- [ ] Document deployment process
- [ ] Create content editing guide
- [ ] Create contribution guidelines
- [ ] Archive all project documentation

### 6.6 Deliverables

| Item | Description | Criteria |
|------|-------------|----------|
| Unit Tests | Jest test suite | 80% coverage |
| Integration Tests | Cypress test suite | All scenarios pass |
| Browser Compat | Cross-browser report | All targets supported |
| CI/CD | GitHub Actions workflow | Auto-deploys on push |
| Live Site | Deployed to GitHub Pages | All features working |
| Documentation | Complete docs | Guides + README |

### 6.7 Success Criteria

- [ ] All unit tests passing (80% coverage)
- [ ] All integration tests passing
- [ ] Works on all target browsers
- [ ] GitHub Actions workflow operational
- [ ] Site successfully deployed
- [ ] All pages load at live URL
- [ ] All features functional
- [ ] Lighthouse > 90
- [ ] No critical bugs

---

## Task Summary by Priority

### Critical Tasks (17 total)

| ID | Task | Phase | Duration | Dependency |
|----|------|-------|----------|------------|
| 1.1 | Project initialization | 1 | 1d | None |
| 1.3 | Design system CSS variables | 1 | 1d | 1.1 |
| 2.1 | Header component | 2 | 1.5d | 1.3 |
| 2.3 | Hero section | 2 | 2d | 1.3 |
| 2.4 | Course modules cards | 2 | 2d | 1.3 |
| 2.9 | Homepage integration | 2 | 1d | 2.1, 2.3, 2.4 |
| 3.1 | Sidebar configuration | 3 | 0.5d | 1.1 |
| 3.4-3.7 | All module content | 3 | 12d | 3.1 |
| 4.1 | Quiz data creation | 4 | 1.5d | 3.4-3.7 |
| 4.2 | Quiz UI components | 4 | 2d | 4.1 |
| 4.3 | Quiz logic | 4 | 1.5d | 4.2 |
| 5.1 | i18n configuration | 5 | 1d | 1.1 |
| 5.2 | Language selector | 5 | 1d | 5.1 |
| 6.5 | GitHub Actions setup | 6 | 0.5d | None |
| 6.7 | Production deployment | 6 | 0.5d | All prior phases |

### High-Priority Tasks (28 total)

Detailed in phase sections (Tasks 1.2-1.7, 2.2, 2.5-2.8, 3.2-3.3, 3.8, 4.4-4.10, 5.3-5.9, 6.1-6.4, 6.8)

### Parallel Opportunities

**Phase 1**:
- Tasks 1.2 + 1.3 + 1.4 can run in parallel
- Task 1.5 + 1.6 after 1.3 completes

**Phase 2**:
- Tasks 2.3-2.8 can be split across team members (no dependencies)
- Task 2.9 depends on all section tasks

**Phase 3**:
- Module content (3.4-3.7) can be generated in parallel
- Reading time component (3.2) independent

**Phase 4**:
- Quiz (4.1-4.4) independent from auth (4.5-4.7)
- Search (4.8) and cookies (4.9) independent
- Progress tracking (4.10) can run in parallel

**Phase 5**:
- i18n setup (5.1) independent from RTL (5.3)
- Animations (5.6), responsive (5.7), accessibility (5.8) can run in parallel

---

## Risk Management

### Identified Risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Content generation longer than estimated | High | High | Use section templates, generate in parallel, prioritize key modules |
| GitHub OAuth implementation complexity | Medium | Medium | Use established libraries (e.g., @octokit), test with GitHub CLI |
| RTL layout edge cases | Medium | Medium | Test extensively, use CSS logical properties, document issues |
| Performance issues with 4 modules | Medium | Low | Profile early, lazy load modules, optimize images |
| Cross-browser CSS issues | Low | Medium | Test early and often, use Autoprefixer, fallbacks |
| i18n translation quality | Medium | Medium | Use professional translators, community review, version control |
| Scope creep from stakeholders | High | High | Strict adherence to spec, phase gates, document out-of-scope items |
| Time zone translation errors | Low | Medium | Use consistent locale configurations, test with native speakers |

### Contingency Plans

**If content generation slips**:
- Launch with Module 1 + 2 complete
- Add Modules 3 + 4 post-launch
- Use section outlines as placeholder

**If OAuth fails**:
- Implement guest-only mode (no auth)
- Quiz results stored locally only
- Add GitHub auth in v1.1

**If timeline slips**:
- Defer Phase 5 i18n (keep English only)
- Launch with essential features only
- Polish and i18n in subsequent releases

**If performance targets unmet**:
- Reduce animation complexity
- Lazy load below-fold modules
- Defer non-critical features

---

## Resource Requirements

### Team Composition (Ideal)

| Role | Responsibilities | Time | Notes |
|------|------------------|------|-------|
| Lead Developer | Architecture, complex features, code review | 100% | Phase 1-6 |
| Frontend Developer | Components, styling, animations | 100% | Phase 2-5 |
| Content Writer | Technical documentation, tutorials | 80% | Phase 3 |
| QA Engineer | Testing, bug reporting, verification | 50% | Phase 4-6 |
| Designer | UI polish, asset creation | 30% | Phase 1-5 |

### Solo Developer Approach

**Recommended Execution Order**:
1. **Weeks 1-2**: Phase 1 (Foundation) + Phase 2 start (Homepage)
2. **Weeks 2-4**: Complete Phase 2 (Homepage)
3. **Weeks 4-6**: Phase 3 (Content generation)
4. **Weeks 6-7**: Phase 4 (Quiz, Auth, Search)
5. **Weeks 8-9**: Phase 5 (i18n + Polish) - defer if time short
6. **Weeks 9-10**: Phase 6 (Testing + Deployment)

**Parallel Single-Developer Work**:
- Generate content sections while building components
- Test while developing features
- Polish after all features complete

### Technology Stack

| Tool | Purpose | License | Notes |
|------|---------|---------|-------|
| Docusaurus 3.x | Site generator | MIT | Zero downtime updates |
| React 18.x | UI framework | MIT | Built into Docusaurus |
| TypeScript 5.x | Type safety | Apache 2.0 | Strict mode required |
| GitHub Pages | Hosting | Free | 1GB repo, 100GB bandwidth |
| GitHub Actions | CI/CD | Free | Auto-deploy on push |
| Jest | Unit testing | MIT | React Testing Library |
| Cypress | Integration testing | MIT | E2E test scenarios |
| Node.js 18+ | Runtime | MIT | npm package manager |
| VS Code | IDE | MIT | Recommended |
| Claude Code | AI assistance | Subscription | Content generation |

---

## Success Metrics

### Phase Completion Metrics

| Phase | Completion Criteria | Success Definition |
|-------|-------------------|-------------------|
| 1 | Build succeeds, design tokens loaded | Lighthouse > 50 |
| 2 | Homepage renders, all sections responsive | Lighthouse > 80 |
| 3 | 16+ pages, reading time displays | All links functional |
| 4 | Quizzes work, auth flows, search returns results | All features testable |
| 5 | 5 languages accessible, WCAG AA passed | Lighthouse > 90 |
| 6 | Deployed live, all tests passing | Production ready |

### Feature Success Criteria

| Feature | Success Metric |
|---------|---|
| Content pages | 6,000-7,000 words, syntax highlighted code, working diagrams |
| Quiz system | Accurate grading, unlimited retakes, results persist for auth users |
| Search | Relevant results within 300ms, keyboard shortcut works |
| Authentication | OAuth flow completes, 7-day session with auto-renewal |
| Multi-language | All 5 languages accessible, RTL layout correct |
| Performance | Lighthouse > 90, LCP < 2.5s, bundle < 250KB |
| Accessibility | WCAG AA compliant, zero critical violations |

---

## Next Steps

**Immediately After Plan Approval**:

1. **Phase 1 Kickoff**
   - Create GitHub repository
   - Initialize Docusaurus project
   - Set up design tokens
   - Begin Phase 2 (Header/Footer)

2. **Phase 2 Parallel**
   - Generate Module 1 content outline
   - Prepare quiz questions
   - Begin OAuth app registration

3. **Ongoing**
   - Daily standup on progress
   - Weekly phase review
   - Continuous testing and optimization

**Expected Timeline**:
- Phase 1: 2 days
- Phase 2: 2 weeks
- Phase 3: 2.5 weeks
- Phase 4: 2 weeks
- Phase 5: 1.5 weeks
- Phase 6: 1.5 weeks
- **Total: 10 weeks** (with parallel work)

---

## Appendices

### A. Daily Standup Template

```markdown
## Daily Standup - [YYYY-MM-DD]

### Completed Yesterday
- [Task ID] [Task description]
- [Task ID] [Task description]

### Planned Today
- [Task ID] [Task description]
- [Task ID] [Task description]

### Blockers
- [Blocker description and impact]

### Notes
- [Metrics, concerns, celebrations]
```

### B. Phase Completion Checklist

```markdown
## Phase [X] Completion Report

### Completed Tasks
- [x] Task 1
- [x] Task 2
- [ ] Blocked task

### Deliverables Status
| Deliverable | Status | Notes |
|---|---|---|
| Item 1 | ✅ Complete | |
| Item 2 | ⚠️ In Progress | 80% done |

### Issues & Resolutions
- **Issue 1**: Description → Resolution implemented
- **Issue 2**: Description → Workaround applied

### Phase Metrics
- Tasks Completed: X/Y (Z%)
- On Schedule: Yes/No
- Quality Assessment: Meets standard / Needs polish

### Readiness for Next Phase
- [ ] All critical blockers resolved
- [ ] Team understands next phase
- [ ] Resources allocated
- [ ] Dependencies clear
```

### C. Launch Readiness Checklist

```markdown
## Pre-Launch Verification

### Content ✅
- [ ] All 4 modules complete
- [ ] All 16+ pages deployed
- [ ] All quizzes functional
- [ ] All images optimized
- [ ] All links verified

### Functionality ✅
- [ ] Homepage fully functional
- [ ] All navigation works
- [ ] Quizzes grade correctly
- [ ] Search returns results
- [ ] Auth flow complete
- [ ] Language switching works
- [ ] Cookie consent works
- [ ] Progress tracking works

### Technical ✅
- [ ] Build passes without errors
- [ ] All tests passing
- [ ] No console errors
- [ ] Lighthouse > 90
- [ ] Mobile responsive
- [ ] Accessibility audit passed
- [ ] Performance targets met

### Deployment ✅
- [ ] GitHub Actions configured
- [ ] Secrets stored safely
- [ ] Domain configured
- [ ] SSL active
- [ ] Error monitoring setup

### Post-Launch ✅
- [ ] Monitoring active
- [ ] Error logs checked
- [ ] Analytics initialized
- [ ] Feedback collection ready
```

---

**Plan Status**: ✅ **READY FOR IMPLEMENTATION**

This comprehensive implementation plan provides a clear roadmap for building the Physical AI & Humanoid Robotics Interactive Textbook. All phases are detailed with specific deliverables, success criteria, and risk mitigation strategies. The plan is fully aligned with the specification and constitution, and incorporates all clarifications from the `/sp.clarify` session.

