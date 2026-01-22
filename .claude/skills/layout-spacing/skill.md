---
name: layout-spacing
description: Improve page section layout and spacing for the Physical AI & Humanoid Robotics Interactive Textbook. Control vertical rhythm, use grids intelligently, and improve readability with responsive-first design using Tailwind CSS spacing scale.
---

# Layout & Spacing Design Skill

## Overview

This skill provides a system for designing clean, readable page layouts with proper spacing and visual hierarchy for the Physical AI & Humanoid Robotics Interactive Textbook. Good spacing is invisible—it doesn't draw attention but makes content digestible and professional. This skill ensures consistent vertical rhythm, intelligent grid usage, and responsive layouts that adapt seamlessly across mobile, tablet, and desktop viewports while maintaining the "Neural Circuitry Futurism" design aesthetic.

## When to Use This Skill

- When pages feel cluttered or dense
- Improving readability of long-form content
- Organizing multiple sections on a page
- Creating visual hierarchy through spacing
- Designing responsive layouts for different screen sizes
- Establishing consistent spacing across all pages
- When text blocks lack breathing room
- Improving navigation flow between sections
- Implementing card grids and layout systems
- When whitespace feels unbalanced
- Creating modular, reusable layout patterns
- Optimizing for mobile, tablet, and desktop readability

## Step-by-Step Instructions

### 1. Content Structure Analysis

Before designing layout, understand the page structure:

- **Content Type**: Long-form text, cards, mixed media, interactive elements?
- **Hierarchy**: What's primary, secondary, tertiary content?
- **Breakpoints**: How should layout change on mobile, tablet, desktop?
- **Visual Weight**: Which sections need more emphasis?
- **User Flow**: How should users navigate through content?
- **Purpose**: Educational (textbook), informational, interactive?

Create a visual outline showing:
- Section titles
- Content blocks
- CTAs and interactive elements
- Images and diagrams
- Whitespace zones

### 2. Vertical Rhythm Establishment

Create consistent vertical spacing using modular scale:

**Tailwind Spacing Scale** (base: 4px):
- `0` = 0px
- `1` = 4px (minimal gap)
- `2` = 8px (tight)
- `3` = 12px (small)
- `4` = 16px (default)
- `6` = 24px (comfortable)
- `8` = 32px (medium)
- `10` = 40px (large)
- `12` = 48px (extra large)
- `16` = 64px (section separator)
- `20` = 80px (major break)
- `24` = 96px (hero spacing)

**Vertical Rhythm Rules**:
- Use consistent multipliers (1x, 1.5x, 2x) for spacing
- Never use arbitrary pixel values; use Tailwind scale
- Maintain rhythm between sections (always use `my-12` or `my-16` between major sections)
- Line height for text: `leading-7` (body), `leading-snug` (headings)

### 3. Grid System Design

Establish intelligent grid usage:

**Container Width**:
- Mobile: Full width, `px-4` padding (16px gutters)
- Tablet: Full width, `px-6` padding (24px gutters)
- Desktop: `max-w-6xl` (64rem) centered
- Code blocks: Full width with `px-6` padding

**Column System**:
- Mobile: Single column (1-column grid)
- Tablet: 2-column grid (some flexibility)
- Desktop: 3-column grid (maximum)

**Grid Gap**:
- Tight: `gap-4` (16px)
- Default: `gap-6` (24px)
- Spacious: `gap-8` (32px)

### 4. Responsive Breakpoints

Define layout changes at each breakpoint:

- **Mobile** (<640px, `sm`): Single column, larger touch targets
- **Tablet** (640–1024px, `md`–`lg`): 2 columns, moderate spacing
- **Desktop** (>1024px, `xl`+): 3+ columns, generous spacing

Use Tailwind prefixes consistently:
```
base (mobile) → sm: → md: → lg: → xl: → 2xl:
```

Example:
```html
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
```

### 5. Section Spacing Standards

Define consistent spacing between major sections:

**Section Separators**:
- Between paragraphs: `mb-4` or `mb-6`
- Between subsections: `mt-8 mb-8`
- Between major sections: `my-12` or `my-16`
- After hero/header: `pb-12` or `pb-16`
- Before footer: `pt-12` or `pt-16`

**Visual Hierarchy**:
- H1 margins: `mb-6` (more space below)
- H2 margins: `mt-12 mb-6`
- H3 margins: `mt-8 mb-4`
- Paragraph margins: `mb-4`
- List margins: `mb-4`
- Image/diagram margins: `my-8`

### 6. Content Padding Standards

Establish consistent internal padding:

**Container Padding**:
- Small sections: `p-4` (16px)
- Default sections: `p-6` (24px)
- Large sections: `p-8` (32px)
- Hero sections: `p-12` or `px-6 py-16`

**Card Padding**:
- Compact cards: `p-4`
- Standard cards: `p-6`
- Large cards: `p-8`

**Sidebar Padding**:
- Content padding: `px-4` (mobile), `px-6` (desktop)
- Vertical padding: `py-4` for blocks

### 7. Readability Optimization

Ensure text is scannable and comfortable:

**Line Length**:
- Ideal: 50–70 characters (narrow paragraphs)
- Maximum: 80 characters (never exceed)
- Implement with `max-w-2xl` for body text

**Line Height**:
- Body text: `leading-7` (28px for 16px font) = 1.75
- Headings: `leading-tight` (24px for 20px font) = 1.25
- Small text: `leading-6` (24px for 16px font) = 1.5

**Typography Spacing**:
- Headings to text: `mb-4` or `mb-6`
- Paragraph margins: `mb-4`
- List spacing: `mb-3` between items
- Code block spacing: `my-6`

### 8. Multi-Column Layout Rules

When using columns, maintain balance:

**2-Column Layout**:
- Content + sidebar: 70% + 30% split
- Equal columns: 50% + 50%
- Always use `gap-6` minimum

**3-Column Layout**:
- Equal: 33% + 33% + 33%
- Sidebar: 25% + 50% + 25%
- Use `gap-6` or `gap-8`

**Flexible Layouts**:
- Use `flex-1` for equal width columns
- Use `flex-shrink-0` to prevent collapse
- Always set gap for breathing room

### 9. Responsive Content Adjustments

Adapt content for smaller screens:

**On Mobile**:
- Stack columns vertically (single column)
- Reduce padding: `px-4` instead of `px-8`
- Reduce margins: `mb-4` instead of `mb-8`
- Smaller hero sections: `py-8` instead of `py-16`
- Reduce font sizes slightly: Use `text-base` not `text-xl`

**On Tablet**:
- Allow 2 columns
- Moderate padding: `px-6`
- Moderate spacing: `mb-6` default
- Balanced hero sections: `py-12`

**On Desktop**:
- Allow 3+ columns
- Generous padding: `px-8`
- Spacious margins: `mb-8` or more
- Large hero sections: `py-16` or more

### 10. Testing & Validation

Complete layout testing before deployment:

- **Responsive Testing**: Mobile, tablet, desktop actual devices
- **Content Overflow**: Test with long text, headings, lists
- **Image Scaling**: Verify images scale correctly
- **Whitespace**: Check padding/margin consistency
- **Reading Comfort**: Test line length and line height
- **Touch Targets**: Ensure 44px+ on mobile
- **Accessibility**: Logical reading order, no overcrowding
- **Lighthouse**: CLS (Cumulative Layout Shift) < 0.1
- **Print Testing**: Ensure printable layouts work
- **Dark Mode**: Spacing consistent in both themes

## Layout & Spacing Design Rules

### Vertical Rhythm System

Establish one primary spacing unit and use multiples:

```
Base unit: 1rem (16px) = Tailwind spacing 4
Ratio: 1:1.5:2:3:4 (additive scale)

1x  = 4px   (1)
1.5x = 6px  (1.5 - use 6 for 1.5)
2x  = 8px   (2)
3x  = 12px  (3)
4x  = 16px  (4) ← Base unit
6x  = 24px  (6)
8x  = 32px  (8)
12x = 48px  (12)
16x = 64px  (16)
24x = 96px  (24)
```

**Use consistently**:
- Never jump from 4px to 32px without intermediate steps
- Maintain rhythm across entire page
- Use same spacing for related elements

### Whitespace Categories

**Active Whitespace** (deliberate, functional):
- Around headers and CTAs
- Between sections
- Inside cards (padding)
- Around images

**Passive Whitespace** (breathing room):
- Between paragraphs
- Within lists
- Between columns
- Page margins

**Negative Space** (intentional emptiness):
- Hero sections (spacious)
- Quote blocks (centered, breathing)
- Feature cards (generous padding)

### Mobile-First Spacing

Start with mobile constraints, add space on larger screens:

```html
<!-- Start tight on mobile, expand on desktop -->
<section class="py-6 md:py-10 lg:py-16 px-4 md:px-6 lg:px-8">
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
```

**Default (Mobile)**:
- Padding: `px-4 py-6`
- Gaps: `gap-4`
- Margins: `mb-4`

**Tablet (md)**:
- Padding: `px-6 py-8`
- Gaps: `gap-6`
- Margins: `mb-6`

**Desktop (lg)**:
- Padding: `px-8 py-12`
- Gaps: `gap-8`
- Margins: `mb-8`

### Semantic Section Hierarchy

Structure sections with visual emphasis through spacing:

```
Hero/Header    → Large spacing (py-16 or more)
    ↓ (my-12)
Primary Content → Default spacing (py-8, mb-6)
    ↓ (my-8)
Secondary Content → Compact spacing (py-4, mb-4)
    ↓ (my-12)
Call-to-Action  → Large spacing (py-12)
    ↓ (my-16)
Footer          → Large spacing (py-12)
```

### Grid Container Widths

**Fluid** (full width):
```html
<section class="w-full px-4 md:px-6 lg:px-8">
```

**Bounded** (centered, max width):
```html
<section class="max-w-6xl mx-auto px-4 md:px-6">
```

**Full Bleed** (section background, centered content):
```html
<section class="w-full bg-blue-50 py-12 px-4">
  <div class="max-w-6xl mx-auto">
```

### Content Block Widths

**Optimal Reading Width** (50–70 characters):
```html
<article class="max-w-2xl mx-auto px-4">
```

**Wide Content** (70–100 characters, for images):
```html
<div class="max-w-4xl mx-auto">
```

**Code Blocks** (allow horizontal scroll):
```html
<div class="max-w-full overflow-x-auto">
  <pre class="px-6 py-4">
```

## Code Examples

### Hero Section with Proper Spacing

```html
<!-- Full-width hero with centered content -->
<section class="
  w-full
  bg-gradient-to-r from-[#0A0E14] to-[#1A2230]
  py-16 md:py-20 lg:py-24
  px-4 md:px-6
">
  <div class="max-w-4xl mx-auto">
    <h1 class="
      text-4xl md:text-5xl lg:text-6xl
      font-bold font-rajdhani
      text-[#E8EDF3]
      mb-6
    ">
      Physical AI & Humanoid Robotics
    </h1>

    <p class="
      text-lg md:text-xl
      text-[#9AABB8]
      mb-8 max-w-2xl
      leading-8
    ">
      Learn cutting-edge robotics, simulation, and AI techniques with our comprehensive interactive textbook.
    </p>

    <div class="flex flex-col sm:flex-row gap-4">
      <button class="
        px-8 py-3
        bg-[#00F0FF] text-[#0A0E14]
        font-bold rounded-lg
      ">
        Start Learning
      </button>
      <button class="
        px-8 py-3
        border-2 border-[#00F0FF]
        text-[#00F0FF]
        font-bold rounded-lg
      ">
        Learn More
      </button>
    </div>
  </div>
</section>
```

### Content Page with Vertical Rhythm

```html
<article class="max-w-3xl mx-auto px-4 py-12">
  <!-- Page header -->
  <header class="mb-12">
    <h1 class="
      text-4xl font-bold font-rajdhani
      text-gray-900 dark:text-[#E8EDF3]
      mb-4
    ">
      ROS 2 Publishers and Subscribers
    </h1>

    <div class="flex items-center gap-4 text-sm text-gray-600 dark:text-[#9AABB8]">
      <span>📚 8 min read</span>
      <span>•</span>
      <span>Beginner</span>
    </div>
  </header>

  <!-- Introduction -->
  <section class="mb-12">
    <h2 class="
      text-2xl font-bold font-rajdhani
      text-gray-900 dark:text-[#E8EDF3]
      mt-8 mb-4
    ">
      Introduction
    </h2>

    <p class="
      text-base text-gray-700 dark:text-[#9AABB8]
      leading-7 mb-4
    ">
      Pub/Sub is the fundamental communication pattern in ROS 2. Publishers send messages to named topics, and Subscribers listen for those messages.
    </p>

    <p class="
      text-base text-gray-700 dark:text-[#9AABB8]
      leading-7 mb-6
    ">
      This decoupling allows nodes to communicate without knowing about each other, making systems modular and scalable.
    </p>
  </section>

  <!-- Core Concepts -->
  <section class="mb-12">
    <h2 class="
      text-2xl font-bold font-rajdhani
      text-gray-900 dark:text-[#E8EDF3]
      mt-8 mb-6
    ">
      Core Concepts
    </h2>

    <!-- Concept 1 -->
    <div class="mb-8">
      <h3 class="
        text-xl font-bold font-rajdhani
        text-gray-900 dark:text-[#E8EDF3]
        mb-3
      ">
        Topics
      </h3>
      <p class="
        text-base text-gray-700 dark:text-[#9AABB8]
        leading-7 mb-4
      ">
        Topics are named buses where nodes exchange messages. A topic has a type, ensuring all messages conform to the same structure.
      </p>
    </div>

    <!-- Concept 2 -->
    <div class="mb-8">
      <h3 class="
        text-xl font-bold font-rajdhani
        text-gray-900 dark:text-[#E8EDF3]
        mb-3
      ">
        Message Types
      </h3>
      <p class="
        text-base text-gray-700 dark:text-[#9AABB8]
        leading-7 mb-4
      ">
        Messages are structured data published to topics. ROS 2 supports standard types (Int32, String) and custom types.
      </p>
    </div>

    <!-- Concept 3 -->
    <div>
      <h3 class="
        text-xl font-bold font-rajdhani
        text-gray-900 dark:text-[#E8EDF3]
        mb-3
      ">
        Callbacks
      </h3>
      <p class="
        text-base text-gray-700 dark:text-[#9AABB8]
        leading-7
      ">
        Subscribers use callbacks to handle incoming messages. When a message arrives, the callback function is invoked.
      </p>
    </div>
  </section>

  <!-- Code Example -->
  <section class="mb-12">
    <h2 class="
      text-2xl font-bold font-rajdhani
      text-gray-900 dark:text-[#E8EDF3]
      mt-8 mb-6
    ">
      Code Example
    </h2>

    <div class="
      bg-[#0A0E14]
      border border-[#374151]
      rounded-lg
      overflow-hidden
      my-6
    ">
      <pre class="
        p-6
        text-sm font-jetbrains-mono
        text-[#E8EDF3]
        overflow-x-auto
      "><code>import rclpy
from std_msgs.msg import String

def callback(msg):
    print(f"Received: {msg.data}")

rclpy.init()
node = rclpy.create_node('listener')
sub = node.create_subscription(String, 'topic', callback, 10)
rclpy.spin(node)</code></pre>
    </div>

    <p class="
      text-sm text-gray-600 dark:text-[#9AABB8]
      italic mb-4
    ">
      Example ROS 2 subscriber listening to a topic.
    </p>
  </section>

  <!-- Summary -->
  <section class="
    bg-blue-50 dark:bg-blue-900/20
    border-l-4 border-blue-500
    rounded-lg p-6
    my-12
  ">
    <h3 class="
      font-bold font-rajdhani
      text-gray-900 dark:text-[#E8EDF3]
      mb-3
    ">
      Key Takeaways
    </h3>
    <ul class="
      list-disc list-inside
      space-y-2
      text-gray-700 dark:text-[#9AABB8]
    ">
      <li>Pub/Sub is ROS 2's core communication pattern</li>
      <li>Topics decouple publishers from subscribers</li>
      <li>Messages have defined types for safety</li>
      <li>Callbacks handle incoming messages asynchronously</li>
    </ul>
  </section>

  <!-- Navigation -->
  <nav class="
    flex justify-between items-center
    pt-12
    border-t border-gray-200 dark:border-[#374151]
    mt-16
  ">
    <a href="#" class="
      text-[#00F0FF] font-semibold
      hover:underline
    ">
      ← Previous
    </a>
    <a href="#" class="
      text-[#00F0FF] font-semibold
      hover:underline
    ">
      Next →
    </a>
  </nav>
</article>
```

### Module Card Grid

```html
<section class="
  max-w-6xl mx-auto
  px-4 md:px-6
  py-12 md:py-16
">
  <h2 class="
    text-3xl font-bold font-rajdhani
    text-gray-900 dark:text-[#E8EDF3]
    mb-12
    text-center
  ">
    Featured Modules
  </h2>

  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    <!-- Card 1 -->
    <div class="
      bg-white dark:bg-[#1A2230]
      rounded-xl
      shadow-md hover:shadow-lg
      transition-shadow duration-300
      overflow-hidden
    ">
      <img
        src="module-1.jpg"
        alt="ROS 2 module"
        class="w-full h-48 object-cover"
      />
      <div class="p-6">
        <h3 class="
          text-xl font-bold font-rajdhani
          text-gray-900 dark:text-[#E8EDF3]
          mb-3
        ">
          ROS 2 Fundamentals
        </h3>
        <p class="
          text-gray-600 dark:text-[#9AABB8]
          text-sm mb-4
          leading-6
        ">
          Master the basics of Robot Operating System 2, including nodes, topics, and services.
        </p>
        <div class="flex justify-between items-center">
          <span class="text-xs font-semibold text-[#00F0FF]">
            4 lessons
          </span>
          <a href="#" class="text-[#00F0FF] font-semibold">
            Start →
          </a>
        </div>
      </div>
    </div>

    <!-- Card 2 -->
    <div class="
      bg-white dark:bg-[#1A2230]
      rounded-xl
      shadow-md hover:shadow-lg
      transition-shadow duration-300
      overflow-hidden
    ">
      <img
        src="module-2.jpg"
        alt="Digital Twin module"
        class="w-full h-48 object-cover"
      />
      <div class="p-6">
        <h3 class="
          text-xl font-bold font-rajdhani
          text-gray-900 dark:text-[#E8EDF3]
          mb-3
        ">
          Digital Twins
        </h3>
        <p class="
          text-gray-600 dark:text-[#9AABB8]
          text-sm mb-4
          leading-6
        ">
          Learn to create virtual representations of physical systems for simulation and testing.
        </p>
        <div class="flex justify-between items-center">
          <span class="text-xs font-semibold text-[#00F0FF]">
            5 lessons
          </span>
          <a href="#" class="text-[#00F0FF] font-semibold">
            Start →
          </a>
        </div>
      </div>
    </div>

    <!-- Card 3 -->
    <div class="
      bg-white dark:bg-[#1A2230]
      rounded-xl
      shadow-md hover:shadow-lg
      transition-shadow duration-300
      overflow-hidden
    ">
      <img
        src="module-3.jpg"
        alt="NVIDIA Isaac module"
        class="w-full h-48 object-cover"
      />
      <div class="p-6">
        <h3 class="
          text-xl font-bold font-rajdhani
          text-gray-900 dark:text-[#E8EDF3]
          mb-3
        ">
          NVIDIA Isaac Sim
        </h3>
        <p class="
          text-gray-600 dark:text-[#9AABB8]
          text-sm mb-4
          leading-6
        ">
          Build realistic robot simulations using NVIDIA's powerful physics engine and AI tools.
        </p>
        <div class="flex justify-between items-center">
          <span class="text-xs font-semibold text-[#00F0FF]">
            6 lessons
          </span>
          <a href="#" class="text-[#00F0FF] font-semibold">
            Start →
          </a>
        </div>
      </div>
    </div>
  </div>
</section>
```

### Two-Column Layout (Content + Sidebar)

```html
<div class="max-w-7xl mx-auto px-4 md:px-6 py-12">
  <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
    <!-- Main content (2/3 width) -->
    <main class="lg:col-span-2">
      <article class="space-y-8">
        <!-- Article content -->
        <section>
          <h1 class="
            text-4xl font-bold font-rajdhani
            text-gray-900 dark:text-[#E8EDF3]
            mb-6
          ">
            Article Title
          </h1>

          <p class="
            text-base text-gray-700 dark:text-[#9AABB8]
            leading-7 mb-6
          ">
            Article introduction paragraph...
          </p>

          <p class="
            text-base text-gray-700 dark:text-[#9AABB8]
            leading-7 mb-6
          ">
            Additional content continues here...
          </p>
        </section>

        <section>
          <h2 class="
            text-2xl font-bold font-rajdhani
            text-gray-900 dark:text-[#E8EDF3]
            mb-4
          ">
            Section Heading
          </h2>

          <p class="
            text-base text-gray-700 dark:text-[#9AABB8]
            leading-7 mb-4
          ">
            More content...
          </p>
        </section>
      </article>
    </main>

    <!-- Sidebar (1/3 width) -->
    <aside class="lg:col-span-1">
      <!-- Quick Nav -->
      <div class="
        bg-white dark:bg-[#1A2230]
        rounded-lg p-6
        shadow-md
        sticky top-24
      ">
        <h3 class="
          font-bold font-rajdhani
          text-gray-900 dark:text-[#E8EDF3]
          mb-4
        ">
          On This Page
        </h3>

        <nav class="space-y-2">
          <a href="#" class="
            block text-sm text-[#00F0FF]
            hover:underline
          ">
            Section 1
          </a>
          <a href="#" class="
            block text-sm text-[#00F0FF]
            hover:underline
          ">
            Section 2
          </a>
          <a href="#" class="
            block text-sm text-[#00F0FF]
            hover:underline
          ">
            Section 3
          </a>
        </nav>
      </div>

      <!-- Related Resources -->
      <div class="
        bg-white dark:bg-[#1A2230]
        rounded-lg p-6
        shadow-md
        mt-6
      ">
        <h3 class="
          font-bold font-rajdhani
          text-gray-900 dark:text-[#E8EDF3]
          mb-4
        ">
          Related Resources
        </h3>

        <ul class="space-y-3 text-sm">
          <li>
            <a href="#" class="text-[#00F0FF] hover:underline">
              Resource 1
            </a>
          </li>
          <li>
            <a href="#" class="text-[#00F0FF] hover:underline">
              Resource 2
            </a>
          </li>
          <li>
            <a href="#" class="text-[#00F0FF] hover:underline">
              Resource 3
            </a>
          </li>
        </ul>
      </div>
    </aside>
  </div>
</div>
```

### Three-Column Section Layout

```html
<section class="
  max-w-6xl mx-auto
  px-4 md:px-6
  py-12 md:py-16
">
  <h2 class="
    text-3xl font-bold font-rajdhani
    text-gray-900 dark:text-[#E8EDF3]
    mb-12
    text-center
  ">
    Why Physical AI Matters
  </h2>

  <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
    <!-- Column 1 -->
    <div class="flex flex-col">
      <div class="
        text-5xl mb-4
        text-[#00F0FF]
      ">
        🚀
      </div>
      <h3 class="
        text-xl font-bold font-rajdhani
        text-gray-900 dark:text-[#E8EDF3]
        mb-3
      ">
        Innovation
      </h3>
      <p class="
        text-gray-600 dark:text-[#9AABB8]
        leading-7
        flex-1
      ">
        Physical AI combines cutting-edge machine learning with real-world robotics, opening unprecedented possibilities.
      </p>
    </div>

    <!-- Column 2 -->
    <div class="flex flex-col">
      <div class="
        text-5xl mb-4
        text-[#FF6B35]
      ">
        🎯
      </div>
      <h3 class="
        text-xl font-bold font-rajdhani
        text-gray-900 dark:text-[#E8EDF3]
        mb-3
      ">
        Practical Skills
      </h3>
      <p class="
        text-gray-600 dark:text-[#9AABB8]
        leading-7
        flex-1
      ">
        Learn hands-on techniques for building, simulating, and controlling humanoid robots with real-world applications.
      </p>
    </div>

    <!-- Column 3 -->
    <div class="flex flex-col">
      <div class="
        text-5xl mb-4
        text-[#B8C4CE]
      ">
        🌍
      </div>
      <h3 class="
        text-xl font-bold font-rajdhani
        text-gray-900 dark:text-[#E8EDF3]
        mb-3
      ">
        Global Impact
      </h3>
      <p class="
        text-gray-600 dark:text-[#9AABB8]
        leading-7
        flex-1
      ">
        Contribute to solving real-world challenges in healthcare, manufacturing, and exploration with AI-powered robotics.
      </p>
    </div>
  </div>
</section>
```

### Compact Feature List

```html
<section class="max-w-3xl mx-auto px-4 py-12">
  <h2 class="
    text-3xl font-bold font-rajdhani
    text-gray-900 dark:text-[#E8EDF3]
    mb-8
  ">
    Course Features
  </h2>

  <ul class="space-y-4">
    <li class="flex items-start gap-4">
      <span class="
        flex-shrink-0
        text-2xl
        text-[#00F0FF]
      ">
        ✓
      </span>
      <div>
        <h4 class="
          font-bold
          text-gray-900 dark:text-[#E8EDF3]
          mb-1
        ">
          Interactive Simulations
        </h4>
        <p class="
          text-gray-600 dark:text-[#9AABB8]
          text-sm
        ">
          Practice robotics concepts in realistic simulated environments.
        </p>
      </div>
    </li>

    <li class="flex items-start gap-4">
      <span class="
        flex-shrink-0
        text-2xl
        text-[#00F0FF]
      ">
        ✓
      </span>
      <div>
        <h4 class="
          font-bold
          text-gray-900 dark:text-[#E8EDF3]
          mb-1
        ">
          Real-World Code Examples
        </h4>
        <p class="
          text-gray-600 dark:text-[#9AABB8]
          text-sm
        ">
          Learn with production-ready Python and C++ examples.
        </p>
      </div>
    </li>

    <li class="flex items-start gap-4">
      <span class="
        flex-shrink-0
        text-2xl
        text-[#00F0FF]
      ">
        ✓
      </span>
      <div>
        <h4 class="
          font-bold
          text-gray-900 dark:text-[#E8EDF3]
          mb-1
        ">
          Hands-On Projects
        </h4>
        <p class="
          text-gray-600 dark:text-[#9AABB8]
          text-sm
        ">
          Build real projects and add them to your portfolio.
        </p>
      </div>
    </li>

    <li class="flex items-start gap-4">
      <span class="
        flex-shrink-0
        text-2xl
        text-[#00F0FF]
      ">
        ✓
      </span>
      <div>
        <h4 class="
          font-bold
          text-gray-900 dark:text-[#E8EDF3]
          mb-1
        ">
          Certification
        </h4>
        <p class="
          text-gray-600 dark:text-[#9AABB8]
          text-sm
        ">
          Earn a recognized certification upon completion.
        </p>
      </div>
    </li>
  </ul>
</section>
```

### Full-Bleed Section with Centered Content

```html
<!-- Section background spans full width -->
<section class="
  w-full
  bg-gradient-to-r from-[#0A0E14] via-[#1A2230] to-[#0A0E14]
  py-16 md:py-20 lg:py-24
  px-4 md:px-6
">
  <!-- Centered content container -->
  <div class="max-w-4xl mx-auto">
    <h2 class="
      text-4xl md:text-5xl font-bold font-rajdhani
      text-[#E8EDF3]
      mb-6
      text-center
    ">
      Ready to Start Learning?
    </h2>

    <p class="
      text-lg text-[#9AABB8]
      mb-12
      text-center
      max-w-2xl mx-auto
      leading-8
    ">
      Join thousands of students learning Physical AI and Humanoid Robotics with our comprehensive, hands-on curriculum.
    </p>

    <div class="flex flex-col sm:flex-row gap-4 justify-center">
      <button class="
        px-8 py-3
        bg-[#00F0FF] text-[#0A0E14]
        font-bold rounded-lg
      ">
        Enroll Free
      </button>
      <button class="
        px-8 py-3
        border-2 border-[#00F0FF]
        text-[#00F0FF]
        font-bold rounded-lg
      ">
        View Curriculum
      </button>
    </div>
  </div>
</section>
```

## Common Layout Patterns

### Reading-Friendly Article Layout
- Max width: 2xl (42rem)
- Padding: px-4 (mobile), px-6 (tablet+)
- Margins: my-12 between major sections
- Line height: leading-7
- Spacing: mb-6 between elements

### Card Grid System
- Grid: 1 column (mobile), 2 (tablet), 3+ (desktop)
- Gap: gap-6 default, gap-8 spacious
- Padding: p-6 inside cards
- Margin between grids: mb-12

### Content + Sidebar
- Ratio: 70% content, 30% sidebar
- Grid: 1 column (mobile), 3 columns (desktop, 2+1)
- Gap: gap-6 or gap-8
- Sticky sidebar: top-24

### Hero + Content
- Hero: Full width, py-16+
- Separator: my-12 or my-16
- Content: max-w-6xl mx-auto
- Padding: px-4 md:px-6

### Full-Bleed Section
- Background: w-full (full width)
- Content: max-w-6xl mx-auto inside
- Padding: px-4 outer, py-12 vertical
- Separator: my-16 between sections

## Tools & Technologies

- **Tailwind CSS 3.x** — Spacing scale utilities
- **CSS Grid** — `grid`, `grid-cols-N`, `gap-`
- **CSS Flexbox** — `flex`, `flex-col`, `gap-`
- **Responsive Prefixes** — `sm:`, `md:`, `lg:`, `xl:`
- **Max Width Utilities** — `max-w-2xl`, `max-w-4xl`, `max-w-6xl`
- **Spacing Utilities** — `p-`, `m-`, `space-y-`, etc.
- **Chrome DevTools** — Responsive testing, layout inspection
- **Lighthouse** — CLS (Cumulative Layout Shift) measurement
- **Accessibility Testing**:
  - Logical reading order validation
  - Color contrast in spacing contexts
  - Touch target sizing (44px minimum)

## Constraints & Requirements

✅ **Must Do:**
- Use Tailwind spacing scale (1, 2, 3, 4, 6, 8, 12, 16, 20, 24)
- Mobile-first responsive design
- Consistent vertical rhythm throughout
- Maximum line length 2xl (50–70 characters)
- Proper line height for readability (leading-7 body, leading-tight headings)
- Test on actual mobile, tablet, desktop devices
- Maintain CLS < 0.1 (no layout shifts)
- Use semantic HTML structure
- Provide adequate whitespace
- Support light and dark modes

❌ **Must NOT Do:**
- Use arbitrary pixel values (no `w-[500px]`, use `max-w-2xl`)
- Break responsive hierarchy (always mobile-first)
- Overcrowd pages (insufficient spacing)
- Use hardcoded spacing values
- Ignore line length for readability
- Create layout shifts on state changes
- Use floats for layout (use grid/flex)
- Skip responsive design testing
- Remove important spacing for "optimization"

## Acceptance Criteria

- [ ] Page layout feels clean and uncluttered
- [ ] Vertical rhythm consistent throughout (using Tailwind scale)
- [ ] All margins use Tailwind spacing (no custom pixels)
- [ ] Responsive layouts tested on 3+ breakpoints
- [ ] Mobile layout optimized (<640px single column)
- [ ] Tablet layout optimized (640–1024px 2 columns)
- [ ] Desktop layout optimized (>1024px 3+ columns)
- [ ] Line length max 70 characters (max-w-2xl/4xl used)
- [ ] Line height appropriate for text type (leading-7 body)
- [ ] Section spacing consistent (my-12/16 between major sections)
- [ ] Card padding consistent (p-6 default)
- [ ] Whitespace balanced and intentional
- [ ] No layout shifts (CLS < 0.1)
- [ ] Touch targets ≥ 44px on mobile
- [ ] Typography hierarchy clear through spacing
- [ ] Sidebar sticky and properly positioned
- [ ] Grid gaps consistent (gap-6 default)
- [ ] Full-bleed sections have centered content
- [ ] Lighthouse performance score ≥ 90
- [ ] Accessibility maintained (semantic HTML, focus order)
- [ ] Light and dark modes consistent spacing
- [ ] Print layout looks good (if applicable)

## Responsive Testing Checklist

- [ ] Tested on iPhone SE (375px width)
- [ ] Tested on iPhone 12/14 (390px width)
- [ ] Tested on iPad (768px width)
- [ ] Tested on iPad Pro (1024px width)
- [ ] Tested on MacBook (1440px+ width)
- [ ] Tested on desktop (2560px+ width)
- [ ] All breakpoints smooth transitions
- [ ] No horizontal scrolling at any breakpoint
- [ ] Touch targets ≥ 44×44px on mobile
- [ ] Typography readable at all sizes
- [ ] Images scale correctly
- [ ] Grid columns collapse properly
- [ ] Sidebar hide/show transitions smooth
- [ ] No content overlap at any breakpoint

## Whitespace & Readability Checklist

- [ ] Paragraphs have 1.75 line height (leading-7)
- [ ] Headings have snug line height (leading-tight)
- [ ] Max line length 70 characters (max-w-2xl)
- [ ] Whitespace between sections clear (my-12+)
- [ ] Padding inside cards generous (p-6+)
- [ ] Margins around elements consistent
- [ ] No text blocks wider than 60 characters
- [ ] Space between paragraphs adequate (mb-6)
- [ ] Space between sections adequate (my-12)
- [ ] Icon/text alignment consistent
- [ ] List item spacing (space-y-3+)
- [ ] Quote blocks properly spaced
- [ ] Code blocks properly spaced (my-6)
- [ ] Lists don't feel cramped
- [ ] Content breathing room sufficient

---

Save it as `.claude/skills/layout-spacing/skill.md`
