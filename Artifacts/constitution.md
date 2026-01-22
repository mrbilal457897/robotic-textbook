# Constitution.md — Physical AI & Humanoid Robotics Textbook

## Project Identity

**Project Name:** Physical AI & Humanoid Robotics Interactive Textbook  
**Tagline:** "Bridging the gap between digital minds and physical bodies"  
**Version:** 1.0.0  
**Framework:** Docusaurus + React  
**Deployment:** GitHub Pages  
**Tools:** Claude Code + Spec-Kit Plus

---

## Core Principles

### 1. Educational Excellence
- Deliver comprehensive, LLM-generated content (6,000–7,000 words per page)
- Ensure technical accuracy with real-world applicability
- Structure content progressively: foundations → intermediate → advanced
- Include hands-on tutorials, code examples, and visual diagrams

### 2. Token-Friendly Architecture
- Generate content section-by-section (not full pages at once)
- Use structured templates for consistent output
- Cache generated content as static markdown files
- Chunk long content into logical, reusable sections

### 3. User-Centric Design
- Intuitive navigation with clear learning pathways
- Estimated reading time displayed on every page
- Global search with keyboard shortcuts
- Responsive design across all devices

### 4. Security & Privacy
- GitHub OAuth for user authentication
- GDPR-compliant cookie consent system
- Secure session management
- Protected user progress and quiz data

### 5. Accessibility & Inclusion
- Multi-language support with RTL capability
- WCAG AA compliant color contrast
- Screen reader friendly structure
- Reduced motion support for accessibility

---



## Design System

### Theme: "Neural Circuitry Futurism"

A bold fusion of organic neural networks and precision robotics — glowing synaptic connections meeting industrial metal with holographic depth. Represents the union of biological intelligence with mechanical embodiment.

### Color Palette

| Token | Value | Usage |
|-------|-------|-------|
| `--primary` | #00F0FF | Electric Cyan — primary actions, links, neural glow |
| `--secondary` | #B8C4CE | Titanium Silver — secondary elements, borders |
| `--accent` | #FF6B35 | Plasma Orange — CTAs, highlights, energy indicators |
| `--bg-primary` | #0A0E14 | Deep Space Black — main background |
| `--bg-card` | #1A2230 | Midnight Blue — card backgrounds |
| `--text-primary` | #E8EDF3 | Light gray — main text |
| `--text-secondary` | #9AABB8 | Muted silver — secondary text |
| `--success` | #00E676 | Neon Green — success states |
| `--warning` | #FFB300 | Amber — warning states |
| `--error` | #FF5252 | Coral Red — error states |

### Typography

| Role | Font Family | Weight | Usage |
|------|-------------|--------|-------|
| Display | Orbitron | 700-900 | Hero titles, major headings |
| Headings | Rajdhani | 500-700 | Section titles, card titles |
| Body | Source Code Pro | 400-500 | Paragraph text, descriptions |
| Code | JetBrains Mono | 400-600 | Code blocks, inline code |

### Visual Effects

- Animated neural grid background with pulsing nodes
- Glassmorphism cards with frosted blur and glow borders
- Floating particle system on hero section
- Holographic shimmer effect on module cards
- Smooth scroll-triggered reveal animations
- Hover states with glow expansion and lift effects

### Responsive Breakpoints

| Device | Width | Layout Adjustments |
|--------|-------|-------------------|
| Desktop | 1200px+ | Full layout, side-by-side sections |
| Tablet | 768px–1199px | Condensed navigation, stacked cards |
| Mobile | <768px | Single column, hamburger menu |

---

## Site Architecture

### Homepage Structure

```
┌─────────────────────────────────────────────────────────────┐
│                         HEADER                              │
│  Logo | Nav (Home, Modules, Resources, About)               │
│  Search Bar | Language Selector 🌐 | GitHub Login           │
├─────────────────────────────────────────────────────────────┤
│                    SECTION 1: HERO                          │
│  Title: "Physical AI & Humanoid Robotics"                   │
│  Subtitle: "Bridging digital minds and physical bodies"     │
│  Description: 2-3 sentences about embodied intelligence     │
│  Buttons: [Start Reading] [Login with GitHub]               │
│  Background: Animated neural circuit pattern                │
├─────────────────────────────────────────────────────────────┤
│                 SECTION 2: COURSE MODULES                   │
│  4 Cards in Grid:                                           │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐           │
│  │Module 1 │ │Module 2 │ │Module 3 │ │Module 4 │           │
│  │ ROS 2   │ │ Digital │ │ NVIDIA  │ │  VLA    │           │
│  │Nervous  │ │  Twin   │ │ Isaac   │ │ Models  │           │
│  │ System  │ │         │ │         │ │         │           │
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘           │
├─────────────────────────────────────────────────────────────┤
│              SECTION 3: WHY PHYSICAL AI MATTERS             │
│  Left: Heading + Description + Key Points                   │
│  Right: Humanoid robot illustration with neural overlay     │
├─────────────────────────────────────────────────────────────┤
│              SECTION 4: WEEKLY BREAKDOWN                    │
│  Interactive Timeline (13 weeks):                           │
│  Week 1-2  → Introduction to Physical AI                    │
│  Week 3-5  → ROS 2 Fundamentals                             │
│  Week 6-7  → Robot Simulation with Gazebo                   │
│  Week 8-10 → NVIDIA Isaac Platform                          │
│  Week 11-12→ Humanoid Robot Development                     │
│  Week 13   → Conversational Robotics                        │
├─────────────────────────────────────────────────────────────┤
│           SECTION 5: CURRICULAR GUIDANCE                    │
│  Tabbed Interface / Skill Tree:                             │
│  - Learning outcomes with progress indicators               │
│  - Assessment types and prerequisites                       │
│  - Interactive skill progression visualization              │
├─────────────────────────────────────────────────────────────┤
│            SECTION 6: HARDWARE REQUIREMENTS                 │
│  Tabs: [Workstation] [Edge Kit] [Robot Lab] [Cloud]         │
│  Each tab: Component table with specs, prices, notes        │
├─────────────────────────────────────────────────────────────┤
│                         FOOTER                              │
│  Logo | Quick Links | Social | Copyright | Cookie Settings  │
└─────────────────────────────────────────────────────────────┘
```

### Textbook Page Structure

```
┌─────────────────────────────────────────────────────────────┐
│                    STICKY HEADER                            │
│  [← Back] | Search | Progress Bar | User Avatar | Settings  │
├─────────────────────────────────────────────────────────────┤
│ SIDEBAR            │            MAIN CONTENT                │
│ ┌────────────────┐ │ ┌─────────────────────────────────────┐│
│ │ Module Nav     │ │ │ Page Title                          ││
│ │ ────────────── │ │ │ ⏱ Estimated Reading Time: XX min   ││
│ │ ▸ Topic 1      │ │ │ Language: [EN ▼]                    ││
│ │ ▸ Topic 2      │ │ │ ─────────────────────────────────── ││
│ │   ▸ Sub 2.1    │ │ │                                     ││
│ │   ▸ Sub 2.2    │ │ │ [6,000-7,000 words of content]      ││
│ │ ▸ Topic 3      │ │ │ - Explanations                      ││
│ │ ────────────── │ │ │ - Code examples                     ││
│ │ Progress: 60%  │ │ │ - Mermaid diagrams                  ││
│ │ ████████░░░░░░ │ │ │ - Hands-on tutorials                ││
│ └────────────────┘ │ │                                     ││
│                    │ └─────────────────────────────────────┘│
│                    │ ┌─────────────────────────────────────┐│
│                    │ │ MODULE QUIZ                         ││
│                    │ │ 📝 10 Questions | Passing: 70%      ││
│                    │ │ [Start Quiz]                        ││
│                    │ └─────────────────────────────────────┘│
│                    │ ┌─────────────────────────────────────┐│
│                    │ │ [← Previous]        [Next →]        ││
│                    │ └─────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────┘
```

---

## Content Specifications

### Module Structure

```
/docs/
├── module-1-ros2/
│   ├── index.md                    (Overview, 500 words)
│   ├── nodes-topics-services.md    (6,000-7,000 words)
│   ├── python-rclpy.md             (6,000-7,000 words)
│   ├── urdf-humanoids.md           (6,000-7,000 words)
│   └── quiz.md                     (10 graded questions)
│
├── module-2-digital-twin/
│   ├── index.md
│   ├── gazebo-physics.md
│   ├── unity-rendering.md
│   ├── sensor-simulation.md
│   └── quiz.md
│
├── module-3-nvidia-isaac/
│   ├── index.md
│   ├── isaac-sim.md
│   ├── isaac-ros-vslam.md
│   ├── nav2-path-planning.md
│   └── quiz.md
│
└── module-4-vla/
    ├── index.md
    ├── voice-to-action.md
    ├── llm-cognitive-planning.md
    ├── capstone-project.md
    └── quiz.md
```

### Content Requirements

| Attribute | Specification |
|-----------|---------------|
| Word Count | 6,000–7,000 words per topic page |
| Code Examples | Minimum 3-5 per page with explanations |
| Diagrams | Mermaid.js for architecture/flow diagrams |
| Reading Level | Technical undergraduate level |
| Languages | English (default), Urdu, Arabic, Chinese, Spanish |

### Reading Time Formula

```
Reading Time (minutes) = ⌈wordCount / 200⌉ + (codeBlocks × 1) + (diagrams × 0.5)
```

---

## Feature Specifications

### 1. Multi-Language Support

**Supported Languages:**

| Code | Language | Direction | Flag |
|------|----------|-----------|------|
| en | English | LTR | 🇺🇸 |
| ur | Urdu (Roman + Native toggle) | RTL | 🇵🇰 |
| ar | Arabic | RTL | 🇸🇦 |
| zh | Chinese (Simplified) | LTR | 🇨🇳 |
| es | Spanish | LTR | 🇪🇸 |

**Implementation:**
- Global language selector (🌐) in header
- Dropdown with flag + language name
- Language preference stored in localStorage
- URL structure: `/en/docs/...`, `/ur/docs/...`, etc.
- RTL layout auto-switch for Arabic and Urdu
- Smooth fade animation on language change
- "View Original English" toggle option
- Inline glossary tooltips for technical terms

### 2. Search Functionality

**Features:**
- Global search bar in sticky header
- Keyboard shortcut: Cmd/Ctrl + K
- Full-text search across all pages
- Highlighted matches in results
- Filter by module or content type
- Search history for authenticated users

**Implementation:** Docusaurus local search plugin or Algolia DocSearch

### 3. Quiz System

**Structure:**
- 10 questions per module quiz
- Question types: Multiple choice + True/False
- Passing score: 70%
- Retakes allowed

**Features:**
- Question counter (1/10)
- Progress bar
- Timer (optional)
- Instant grading with score display
- Explanations shown after submission
- Results stored per user (localStorage or backend)

### 4. Authentication & Security

**GitHub OAuth:**
- Login button on homepage and header
- Store session: GitHub username, avatar, ID
- Display user avatar when logged in
- Logout functionality
- Protected routes for quiz results and progress

**Cookie Management:**
- GDPR-compliant consent banner on first visit
- Options: Accept All, Reject Non-Essential, Customize
- Categories: Essential, Analytics, Preferences
- Preferences stored in localStorage
- Cookie settings accessible from footer

### 5. Reading Progress

**Features:**
- Progress bar at top of content pages
- Percentage completion per module
- Visual progress indicator in sidebar
- Persist progress for authenticated users

---

## UI/UX Specifications

### Visual Effects

| Effect | Location | Description |
|--------|----------|-------------|
| Neural Grid | Background | Animated grid with pulsing node intersections |
| Gradient Orbs | Corners | Soft cyan/orange gradients for depth |
| Particles | Hero section | Floating dots representing data flow |
| Glassmorphism | Cards | Frosted glass with blur and glow borders |
| Holographic | Module cards | Rotating gradient shimmer on hover |
| Glow Expansion | Buttons | Border glow expands outward on hover |
| Reveal Animation | Sections | Fade-in + slide-up on scroll |

### Interactive States

| Element | Default | Hover | Active |
|---------|---------|-------|--------|
| Cards | Subtle border | Lift + glow + shimmer | Accent border |
| Buttons (Primary) | Gradient fill | Glow + scale up | Press down |
| Buttons (Secondary) | Outline | Fill animation | Inverted colors |
| Timeline Nodes | Hollow circle | Fill + pulse | Checkmark icon |
| Navigation Links | Normal text | Underline expand | Permanent underline |

### Micro-Interactions

- **Buttons:** Press scale-down, release bounce
- **Icons:** Subtle rotation or bounce on hover
- **Form Inputs:** Floating label, border glow on focus
- **Toggles:** Smooth slide with color transition
- **Loading:** Skeleton screens with pulse animation

### Accessibility

- Color contrast: WCAG AA minimum
- Focus indicators clearly visible
- Respect `prefers-reduced-motion` setting
- Proper heading hierarchy (H1 → H6)
- ARIA labels for interactive elements
- Alt text for all images

---

## Deployment Configuration

### GitHub Pages Setup

```javascript
// docusaurus.config.js
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

### GitHub Actions Workflow

- Trigger: Push to `main` branch
- Build: `npm run build`
- Deploy: Push to `gh-pages` branch
- Environment: Node.js 18+

---

## Token-Friendly Generation Strategy

### Content Generation Approach

1. **Outline First:** Generate topic outline before full content
2. **Section-by-Section:** Expand one section at a time
3. **Templates:** Use structured templates for consistency
4. **Caching:** Store generated content as static markdown
5. **Chunking:** Break 7,000-word pages into ~1,500-word chunks

### Prompt Templates

**For Topic Pages:**
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

**For Quiz Questions:**
```
Generate 10 quiz questions for Module [X]: [Module Name].
Mix: 7 multiple choice, 3 true/false.
Difficulty: 3 easy, 4 medium, 3 hard.
Include explanation for each correct answer.
Format: JSON with question, options, correct, explanation fields.
```

---

## Success Criteria

### Functional Requirements

- [ ] Homepage loads with all 6 sections functioning
- [ ] All 4 modules accessible with content pages
- [ ] Each page displays 6,000-7,000 words of content
- [ ] Reading time displays accurately on all pages
- [ ] Search returns relevant results across all content
- [ ] Keyboard shortcut (Cmd/Ctrl + K) opens search
- [ ] Quizzes grade correctly and show explanations
- [ ] Quiz results persist for authenticated users
- [ ] GitHub OAuth login/logout works correctly
- [ ] User avatar displays when logged in
- [ ] Cookie consent banner appears on first visit
- [ ] Cookie preferences persist across sessions
- [ ] Language selector changes site language
- [ ] RTL layout works for Arabic and Urdu
- [ ] Language preference persists in localStorage

### Design Requirements

- [ ] Theme matches "Neural Circuitry Futurism" aesthetic
- [ ] Color palette applied consistently
- [ ] Typography hierarchy is clear and readable
- [ ] Glassmorphism cards render correctly
- [ ] Hover effects work smoothly
- [ ] Animations don't cause performance issues
- [ ] Scroll reveal animations trigger properly
- [ ] Mobile layout is fully functional
- [ ] Tablet layout adjusts appropriately

### Deployment Requirements

- [ ] Builds successfully without errors
- [ ] Deploys to GitHub Pages
- [ ] All routes accessible on deployed site
- [ ] Images and assets load correctly
- [ ] i18n routes work in production

---

## Quick Reference

| Aspect | Specification |
|--------|---------------|
| Framework | Docusaurus + React |
| Deployment | GitHub Pages |
| Authentication | GitHub OAuth |
| Content Length | 6,000-7,000 words per page |
| Languages | English, Urdu, Arabic, Chinese, Spanish |
| Quizzes | 10 questions per module, 70% passing |
| Search | Global, Cmd/Ctrl + K shortcut |
| Cookies | GDPR compliant consent |
| Theme | Dark mode, cyan/orange futuristic |
| Reading Time | Auto-calculated and displayed |
| Accessibility | WCAG AA compliant |

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | Initial | Complete specification |

---

---

## Appendix: AI Agent Execution Note

This appendix does NOT modify, replace, or extend this Constitution.
This Constitution remains the single source of truth.

This note only defines how AI agents must EXECUTE the Constitution.

AI agents must:
- Follow this Constitution exactly as written
- Not reinterpret, redesign, or optimize specifications
- Generate content section-by-section only
- Limit output to ~1500 words per response
- Never generate full 6000–7000 word pages in a single response
- Never invent APIs, tools, benchmarks, or research

If a user request conflicts with this Constitution:
→ The agent must refuse and reference the relevant section.

This appendix controls AI behavior only, not product design.


*This constitution serves as the single source of truth for the Physical AI & Humanoid Robotics Interactive Textbook project. All development decisions should align with these specifications.*
