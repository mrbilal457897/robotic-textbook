<!--
Sync Impact Report:
Version: 0.0.0 → 1.0.0 (MAJOR - Initial constitution establishment)
Modified Principles: ALL (new)
Added Sections: ALL (new)
Templates Status:
  ✅ plan-template.md - Constitution Check section aligns with principles
  ✅ spec-template.md - Requirements alignment verified
  ✅ tasks-template.md - Task categorization compatible
  ⚠ commands/*.md - Directory does not exist yet; no command-specific updates needed
Follow-up TODOs: None
-->

# Physical AI & Humanoid Robotics Interactive Textbook Constitution

## Project Identity

**Project Name**: Physical AI & Humanoid Robotics Interactive Textbook
**Tagline**: "Bridging the gap between digital minds and physical bodies"
**Framework**: Docusaurus + React
**Deployment**: GitHub Pages
**Development Tools**: Claude Code + Spec-Kit Plus

## Core Principles

### I. Educational Excellence

Every content page MUST deliver comprehensive, accurate technical content that progressively builds from foundations to advanced topics.

**Non-Negotiable Rules**:
- Each topic page MUST contain 6,000–7,000 words of substantive content
- Content MUST include minimum 3-5 working code examples with explanatory comments
- Content MUST include Mermaid diagrams for architecture/flow visualization
- Content MUST include hands-on tutorials with step-by-step instructions
- Reading level MUST target technical undergraduate (CS/Robotics) audience
- Content MUST be structured: Introduction → Core Concepts → Examples → Tutorial → Best Practices → Summary

**Rationale**: LLM-generated educational content can match or exceed traditional textbook quality when structured systematically. The 6,000-7,000 word target ensures comprehensive coverage while remaining manageable in token-friendly chunks.

### II. Token-Friendly Architecture

Content generation MUST respect token economy and prevent context overflow through structured, incremental approaches.

**Non-Negotiable Rules**:
- Content MUST be generated section-by-section, not full pages in single responses
- Each generation response MUST be limited to ~1,500 words maximum
- Content MUST use structured templates for consistency and predictability
- Generated content MUST be cached as static markdown files immediately
- Long content MUST be chunked into logical, reusable sections
- Content generation MUST follow: Outline First → Section-by-Section Expansion → Template Fill → Cache

**Rationale**: Claude Code operates under token budgets. Generating 6,000-word pages in one shot is inefficient and risks truncation. Section-by-section generation with caching ensures consistent quality and completion.

### III. User-Centric Design

User experience MUST prioritize intuitive navigation, clear learning pathways, and accessibility.

**Non-Negotiable Rules**:
- Every content page MUST display estimated reading time at the top
- Reading time MUST be calculated using: `⌈wordCount / 200⌉ + (codeBlocks × 1) + (diagrams × 0.5)` minutes
- Global search MUST be accessible via keyboard shortcut (Cmd/Ctrl + K)
- Navigation MUST provide clear module structure with progress indicators
- Design MUST be fully responsive: Desktop (1200px+), Tablet (768-1199px), Mobile (<768px)
- All interactive elements MUST have hover states, focus indicators, and loading states

**Rationale**: Educational platforms succeed when learners can easily navigate, estimate time commitment, and track progress. Accessibility ensures inclusive learning.

### IV. Security & Privacy

User data and authentication MUST follow industry-standard security practices and comply with GDPR.

**Non-Negotiable Rules**:
- Authentication MUST use GitHub OAuth exclusively (no custom auth)
- Session data MUST store only: GitHub username, avatar URL, user ID
- Cookie consent banner MUST appear on first visit with options: Accept All, Reject Non-Essential, Customize
- Cookie categories MUST be: Essential, Analytics, Preferences
- User preferences and quiz progress MUST be stored with explicit consent
- Protected routes MUST enforce authentication before displaying user-specific data
- NO secrets, tokens, or credentials MAY be hardcoded in source code

**Rationale**: GitHub OAuth provides trusted authentication without managing credentials. GDPR compliance is legally required for EU users and builds user trust globally.

### V. Accessibility & Inclusion

Content MUST be accessible to diverse audiences including multilingual support and assistive technologies.

**Non-Negotiable Rules**:
- MUST support 5 languages: English (default), Urdu, Arabic, Chinese (Simplified), Spanish
- RTL (Right-To-Left) layout MUST auto-activate for Arabic and Urdu
- Language preference MUST persist in localStorage
- URL structure MUST be: `/[lang]/docs/...` (e.g., `/en/docs/`, `/ur/docs/`)
- Color contrast MUST meet WCAG AA minimum standards (4.5:1 for normal text, 3:1 for large text)
- All interactive elements MUST have proper ARIA labels
- All images MUST have descriptive alt text
- Site MUST respect `prefers-reduced-motion` media query for accessibility
- Heading hierarchy MUST follow semantic HTML (H1 → H6 in proper order)

**Rationale**: Multilingual support opens robotics education to non-English-speaking communities (especially in Pakistan, Middle East, China, Latin America). WCAG compliance ensures screen reader and keyboard navigation usability.

### VI. Design Consistency ("Neural Circuitry Futurism" Theme)

Visual design MUST follow the established "Neural Circuitry Futurism" design system for cohesive aesthetics.

**Non-Negotiable Rules**:
- Color palette MUST use defined tokens:
  - Primary: #00F0FF (Electric Cyan)
  - Secondary: #B8C4CE (Titanium Silver)
  - Accent: #FF6B35 (Plasma Orange)
  - Background Primary: #0A0E14 (Deep Space Black)
  - Background Card: #1A2230 (Midnight Blue)
  - Text Primary: #E8EDF3, Text Secondary: #9AABB8
  - Success: #00E676, Warning: #FFB300, Error: #FF5252
- Typography MUST follow hierarchy:
  - Display: Orbitron (700-900) for hero titles
  - Headings: Rajdhani (500-700) for section titles
  - Body: Source Code Pro (400-500) for paragraph text
  - Code: JetBrains Mono (400-600) for code blocks
- Visual effects MUST include: animated neural grid background, glassmorphism cards with frosted blur, glow expansion on buttons, scroll-triggered reveal animations
- All effects MUST have smooth transitions (0.2-0.3s ease-in-out)

**Rationale**: Consistent theming reinforces brand identity and creates an immersive, futuristic learning environment that reflects the cutting-edge nature of physical AI and humanoid robotics.

### VII. Content Structure & Module Organization

Content MUST be organized in a predictable, hierarchical module structure with clear dependencies.

**Non-Negotiable Rules**:
- Module structure MUST follow:
  ```
  /docs/
  ├── module-[N]-[name]/
  │   ├── index.md              (Overview, ~500 words)
  │   ├── [topic-1].md          (6,000-7,000 words)
  │   ├── [topic-2].md          (6,000-7,000 words)
  │   ├── [topic-3].md          (6,000-7,000 words)
  │   └── quiz.md               (10 graded questions)
  ```
- MUST have exactly 4 modules: ROS 2 Nervous System, Digital Twin, NVIDIA Isaac, VLA Models
- Each module MUST have 3-4 topic pages plus 1 quiz page
- Quiz MUST have exactly 10 questions: 7 multiple choice, 3 true/false
- Quiz MUST have passing score of 70%
- Quiz questions MUST include explanations for correct answers

**Rationale**: Predictable structure enables consistent navigation, progress tracking, and automated tooling. The 4-module structure maps to the 13-week curriculum plan.

### VIII. Performance & Build Optimization

Site MUST build and deploy efficiently to GitHub Pages without errors or performance degradation.

**Non-Negotiable Rules**:
- Build MUST complete without errors on Node.js 18+
- Docusaurus config MUST specify: `organizationName`, `projectName`, `baseUrl`, `deploymentBranch: gh-pages`
- Images and assets MUST be optimized (WebP for images, lazy loading enabled)
- JavaScript bundles MUST be code-split by route
- First Contentful Paint MUST be under 2 seconds on 3G connections
- Total page weight for content pages MUST be under 500KB (excluding fonts)

**Rationale**: GitHub Pages has resource limits. Optimized builds ensure fast page loads for students on slower connections globally.

## Site Architecture Requirements

### Homepage Structure

Homepage MUST contain exactly 6 sections in this order:

1. **HEADER**: Logo, Navigation (Home, Modules, Resources, About), Search Bar, Language Selector, GitHub Login
2. **HERO SECTION**: Title, subtitle, description (2-3 sentences), buttons ([Start Reading], [Login with GitHub]), animated neural circuit background
3. **COURSE MODULES**: 4 module cards in grid layout (ROS 2, Digital Twin, NVIDIA Isaac, VLA Models)
4. **WHY PHYSICAL AI MATTERS**: Heading, description, key points (left), humanoid robot illustration (right)
5. **WEEKLY BREAKDOWN**: Interactive timeline (13 weeks) with week ranges and topics
6. **HARDWARE REQUIREMENTS**: Tabbed interface ([Workstation], [Edge Kit], [Robot Lab], [Cloud]) with component tables
7. **FOOTER**: Logo, quick links, social links, copyright, cookie settings

### Textbook Page Structure

Textbook pages MUST follow this layout:

- **STICKY HEADER**: [← Back], Search, Progress Bar, User Avatar, Settings
- **SIDEBAR** (left): Module navigation tree, progress percentage indicator
- **MAIN CONTENT** (right):
  - Page title
  - Reading time estimate
  - Language selector
  - 6,000-7,000 words of content
  - Module quiz section (at bottom)
  - Navigation: [← Previous] [Next →]

## Feature Specifications

### Multi-Language Support

Language switching MUST be implemented with these specifications:

- Language selector (🌐) in header with dropdown showing flag + language name
- Supported languages: `en` (English 🇺🇸), `ur` (Urdu 🇵🇰 RTL), `ar` (Arabic 🇸🇦 RTL), `zh` (Chinese 🇨🇳), `es` (Spanish 🇪🇸)
- Docusaurus i18n config MUST specify all 5 locales with direction (ltr/rtl)
- RTL languages MUST trigger layout direction change automatically
- Language preference MUST persist in `localStorage` as `preferredLanguage`
- Smooth fade animation (0.3s) MUST occur on language change

### Search Functionality

Search MUST be implemented with these specifications:

- Global search bar in sticky header with placeholder "Search docs... (Ctrl+K)"
- Keyboard shortcut: Cmd/Ctrl + K to open search modal
- Full-text search across all markdown content files
- Highlighted matching text in search results
- Implementation: Docusaurus local search plugin OR Algolia DocSearch
- Search history for authenticated users (stored in backend or localStorage)

### Quiz System

Quiz system MUST be implemented with these specifications:

- 10 questions per module quiz
- Question types: Multiple choice (4 options) and True/False
- Question distribution: 7 multiple choice, 3 true/false
- Difficulty distribution: 3 easy, 4 medium, 3 hard
- Passing score: 70% (7 out of 10 correct)
- UI MUST show: question counter (e.g., "Question 3/10"), progress bar, current question, option buttons
- Instant grading on submission with score display
- Explanations MUST be shown for all questions after submission
- Results MUST be stored per user (localStorage for non-authenticated, backend for authenticated)
- Retakes MUST be allowed without limit

### Reading Progress Tracking

Progress tracking MUST be implemented with these specifications:

- Progress bar at top of content pages showing scroll percentage
- Sidebar indicator showing module completion percentage (e.g., "Progress: 60%")
- Visual progress bar (e.g., `████████░░░░░░`)
- Progress MUST be calculated: pages completed / total pages in module × 100
- Progress MUST persist for authenticated users (backend storage or localStorage)

## Development Workflow

### Content Generation Process

Content generation MUST follow this workflow:

1. **Outline Generation**: Generate topic outline with section headers (H2, H3 levels)
2. **Section-by-Section Expansion**: Expand one section (~1,500 words) per AI response
3. **Template Filling**: Use structured prompt templates for consistency
4. **Caching**: Immediately write generated section to markdown file
5. **Validation**: Verify word count, code examples, diagrams before moving to next section
6. **Assembly**: Concatenate sections into final page file

**Prompt Template for Topic Pages**:
```
Generate comprehensive content for [Topic Name] in Module [X].
Target: 6,000-7,000 words.
Include:
- Introduction (300 words)
- Core concepts with explanations
- 3-5 code examples with comments
- Mermaid diagram for architecture
- Hands-on tutorial section
- Best practices
- Summary

Tone: Technical but accessible.
Audience: Undergraduate CS/Robotics students.
```

**Prompt Template for Quiz Questions**:
```
Generate 10 quiz questions for Module [X]: [Module Name].
Mix: 7 multiple choice, 3 true/false.
Difficulty: 3 easy, 4 medium, 3 hard.
Include explanation for each correct answer.
Format: JSON with question, options, correct, explanation fields.
```

### Deployment Configuration

Deployment MUST be configured with these specifications:

**Docusaurus Config (`docusaurus.config.js`)**:
```javascript
module.exports = {
  title: 'Physical AI & Humanoid Robotics',
  tagline: 'Bridging the gap between digital minds and physical bodies',
  url: 'https://username.github.io',
  baseUrl: '/physical-ai-textbook/',
  organizationName: 'username',
  projectName: 'physical-ai-textbook',
  deploymentBranch: 'gh-pages',
  trailingSlash: false,

  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'ur', 'ar', 'zh', 'es'],
    localeConfigs: {
      en: { label: 'English', direction: 'ltr' },
      ur: { label: 'اردو', direction: 'rtl' },
      ar: { label: 'العربية', direction: 'rtl' },
      zh: { label: '中文', direction: 'ltr' },
      es: { label: 'Español', direction: 'ltr' },
    },
  },
};
```

**GitHub Actions Workflow**:
- Trigger: Push to `main` branch
- Build: `npm run build`
- Deploy: Push to `gh-pages` branch
- Node.js version: 18 or higher

## Success Criteria

### Functional Requirements (ALL MUST PASS)

- [ ] Homepage loads with all 6 sections functioning correctly
- [ ] All 4 modules are accessible with content pages
- [ ] Each topic page displays 6,000-7,000 words of content
- [ ] Reading time displays accurately on all pages
- [ ] Search returns relevant results across all content
- [ ] Keyboard shortcut (Cmd/Ctrl + K) opens search modal
- [ ] Quizzes grade correctly and show explanations
- [ ] Quiz results persist for authenticated users
- [ ] GitHub OAuth login/logout functions correctly
- [ ] User avatar displays when logged in
- [ ] Cookie consent banner appears on first visit
- [ ] Cookie preferences persist across sessions
- [ ] Language selector changes site language correctly
- [ ] RTL layout works correctly for Arabic and Urdu
- [ ] Language preference persists in localStorage

### Design Requirements (ALL MUST PASS)

- [ ] Theme matches "Neural Circuitry Futurism" aesthetic
- [ ] Color palette applied consistently across all pages
- [ ] Typography hierarchy is clear and readable
- [ ] Glassmorphism cards render correctly with blur and glow
- [ ] Hover effects work smoothly without lag
- [ ] Animations do not cause performance issues (60fps maintained)
- [ ] Scroll reveal animations trigger properly at viewport thresholds
- [ ] Mobile layout is fully functional (<768px)
- [ ] Tablet layout adjusts appropriately (768-1199px)

### Deployment Requirements (ALL MUST PASS)

- [ ] Docusaurus builds successfully without errors
- [ ] Site deploys to GitHub Pages without errors
- [ ] All routes accessible on deployed site
- [ ] Images and assets load correctly (no 404 errors)
- [ ] i18n routes work in production (all 5 languages)

## Constraints & Non-Goals

### In Scope
- Static site generation with Docusaurus
- LLM-generated educational content (6,000-7,000 words per page)
- GitHub OAuth for authentication
- Multi-language support (5 languages)
- Quiz system with local/backend storage
- Reading progress tracking

### Out of Scope (Explicitly Excluded)
- Real-time collaboration features
- Video hosting (may embed external videos only)
- Live chat or forums (not in v1.0.0)
- Custom backend API (GitHub Pages only)
- Mobile native apps (responsive web only)
- Payment or subscription systems
- User-generated content or comments
- Social media integration beyond basic share buttons

## Governance

This constitution is the single source of truth for the Physical AI & Humanoid Robotics Interactive Textbook project. All design decisions, development work, and pull requests MUST align with these specifications.

### Amendment Procedure

1. Proposed changes MUST be documented with rationale in a GitHub issue
2. Changes MUST be reviewed by project maintainer(s)
3. Approved changes trigger constitution version bump:
   - **MAJOR**: Backward-incompatible changes (principle removal, complete redesign)
   - **MINOR**: New principles added, features added, significant expansions
   - **PATCH**: Clarifications, wording improvements, typo fixes
4. Amendment MUST update `LAST_AMENDED_DATE` to current date
5. Amendment MUST create migration plan if existing work is affected
6. Amendment MUST propagate changes to dependent templates (plan, spec, tasks)

### Versioning Policy

- Version format: `MAJOR.MINOR.PATCH` (Semantic Versioning)
- Version MUST be updated in constitution header on every amendment
- Git tag MUST be created for each version: `constitution-vX.Y.Z`

### Compliance Review

- All pull requests MUST verify compliance with constitution principles
- Complexity and deviations MUST be explicitly justified in plan.md "Complexity Tracking" section
- Constitution Check section in plan-template.md MUST be completed before Phase 0 research

### Enforcement

- AI agents (Claude Code) MUST refuse requests that conflict with this constitution and MUST cite the relevant section
- Developers MUST consult this constitution before beginning new features
- Code reviews MUST verify alignment with constitution principles

## Appendix: AI Agent Execution Note

**IMPORTANT**: This appendix does NOT modify, replace, or extend this Constitution. The Constitution above remains the single source of truth. This appendix ONLY defines how AI agents must EXECUTE the Constitution.

### AI Agent Execution Rules

AI agents (including Claude Code) MUST:
- Follow this Constitution exactly as written
- NOT reinterpret, redesign, or optimize specifications without explicit user request
- Generate content section-by-section ONLY (~1,500 words per response)
- NEVER generate full 6,000–7,000 word pages in a single response
- NEVER invent APIs, tools, benchmarks, or research that do not exist
- Ask clarifying questions if user request is ambiguous or conflicts with Constitution
- Cite the specific Constitution section when refusing requests that conflict

### Conflict Resolution

If a user request conflicts with this Constitution:
1. AI agent MUST refuse the request
2. AI agent MUST reference the relevant Constitution section (e.g., "Principle II: Token-Friendly Architecture requires section-by-section generation")
3. AI agent MAY suggest a compliant alternative approach
4. If user insists on conflicting approach, AI agent MUST recommend amending the Constitution first

### Content Generation Workflow

When generating content pages, AI agents MUST:
1. Generate outline first (section headers only)
2. Get user approval on outline structure
3. Expand one section at a time (~1,500 words maximum per response)
4. Include code examples and diagrams in each relevant section
5. Cache generated section to markdown file immediately
6. Proceed to next section only after previous section is cached
7. Validate final page meets 6,000-7,000 word requirement after all sections complete

This appendix controls AI behavior ONLY, not product design.

---

**Version**: 1.0.0 | **Ratified**: 2026-01-14 | **Last Amended**: 2026-01-14
