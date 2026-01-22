---
name: visual-assets
description: Create and optimize diagrams, figures, and images for the Physical AI & Humanoid Robotics Interactive Textbook. Design educational visualizations for complex robotics systems, optimize images in modern formats (WebP, AVIF), and ensure accessibility compliance with captions and alt text following Docusaurus static asset conventions.
---

# Visual Assets Skill

## Overview

This skill enables the creation and optimization of high-quality visual assets—diagrams, figures, photographs, and illustrations—that explain complex robotics and AI concepts. It provides guidance on selecting appropriate diagram types, optimizing images for web delivery, ensuring accessibility compliance, and following Docusaurus conventions for static asset management.

## When to Use This Skill

- When explaining complex robotics systems or architectures
- When creating block diagrams for system interactions
- When adding flowcharts for algorithms or processes
- When including screenshots from simulations
- When optimizing images for performance
- When adding visual hierarchy to textbook chapters
- When creating infographics for concepts
- When documenting hardware setups or experimental configurations

## Core Principles

### Educational Clarity
- Diagrams should illuminate, not obscure concepts
- Visual hierarchy should guide reader understanding
- Color and contrast support learning objectives
- Annotations explain relationships and processes
- Complexity increases gradually with detail level

### Accessibility & Inclusivity
- Descriptive alt text for all images (not just decorative)
- Long descriptions for complex diagrams
- Sufficient color contrast (WCAG AA minimum)
- Don't rely solely on color to convey information
- Captions for all figures with explanatory context

### Web Optimization
- Modern image formats (WebP, AVIF) with fallbacks
- Responsive images for different screen sizes
- Lazy loading for below-the-fold images
- Compressed file sizes without quality loss
- Fast page load times (Lighthouse ≥ 90)

### Docusaurus Compliance
- Store images in `static/` directory with logical structure
- Reference images using relative paths or URL aliases
- Use responsive image syntax in MDX
- Follow naming conventions for easy discovery
- Organize by feature/topic/type

## Step-by-Step Visual Asset Workflow

### Phase 1: Planning & Concept Design

**1.1 Define Visual Purpose**
- Identify what concept needs visualization
- Determine audience (students, practitioners)
- Write a one-sentence purpose statement
- List learning objectives the visual supports
- Sketch rough wireframe or concept

**1.2 Select Diagram Type**
- **System Architecture**: Component relationships and data flow
- **Flowchart**: Process steps and decision points
- **Block Diagram**: System interactions and I/O
- **Sequence Diagram**: Message passing and timing
- **State Machine**: System states and transitions
- **Class Diagram**: Object relationships (OOP concepts)
- **Data Flow**: Information movement through system
- **Timeline**: Chronological or temporal relationships
- **Comparison Table**: Side-by-side feature analysis
- **Infographic**: Summarized concept with visual elements

**1.3 Choose Visual Representation**
- **Vector diagram**: Clean, scalable, good for abstract concepts
- **Raster screenshot**: Real software/simulation output
- **Photograph**: Physical hardware or real-world context
- **Illustration**: Custom visual interpretation
- **Diagram**: Information architecture and relationships
- **Graph/Chart**: Data visualization and trends

**1.4 Plan Accessibility**
- Determine if alt text will be descriptive or concise
- Plan caption text (learning objective connection)
- Identify color-dependent information (plan alternatives)
- Plan for text scaling and zoom support
- Consider audio description for complex diagrams

**1.5 Establish Docusaurus Integration**
- Determine static asset directory structure
- Plan responsive image breakpoints
- Decide on image format strategy (WebP + fallback)
- Plan caption placement (below, overlay, or beside)
- Identify related images or dependencies

### Phase 2: Diagram Creation

**2.1 Create Vector Diagrams (Preferred for Technical Content)**
Tools: Excalidraw, Lucidchart, Draw.io, Figma

```
Best Practices:
- Use consistent line weights (1–2px for strokes)
- Maintain consistent shape sizes for related components
- Use grid alignment for professional appearance
- Color code by function or category
- Leave generous whitespace around elements
- Use standard icons (UML, robotics symbols)
- Font size: 12–14px minimum for readability
- Export at 2x resolution for Retina displays
```

**2.2 Create Flowcharts & Processes**
```
Structure:
1. Start with clear entry point
2. Use standard shapes: rectangles (process), diamonds (decision), ovals (start/end)
3. Label all decision paths
4. Ensure single flow entry/exit per shape
5. Avoid crossing connector lines when possible
6. Use consistent arrow styles (solid, dashed, bidirectional)
7. Color-code based on function or criticality
8. Add brief labels to all connectors
```

**2.3 Create System Architecture Diagrams**
```
Structure:
1. Identify major system components
2. Show hierarchical relationships (parent-child)
3. Include data flow paths (labeled)
4. Highlight external systems and interfaces
5. Use consistent component representation
6. Add legend if using color or symbol coding
7. Show hardware and software separation clearly
8. Indicate real-time vs. non-real-time paths
```

**2.4 Prepare Screenshots & Simulations**
```
Best Practices:
- Use high-resolution captures (2560×1600+ before compression)
- Remove unnecessary UI chrome or clutter
- Highlight relevant areas (boxes, arrows, annotations)
- Use consistent terminal/IDE themes
- Avoid personal information or credentials
- Include only simulation windows (not desktop)
- Add overlays or annotations for clarity
- Test readability at actual display size
```

**2.5 Add Annotations & Labels**
```
Guidelines:
- Use sans-serif fonts for clarity (Arial, Helvetica, Ubuntu)
- Font size: 12–14px minimum
- High contrast text (dark on light, light on dark)
- Avoid italic or overly decorative fonts
- Number components or steps for reference
- Use callouts or leaders for distant labels
- Ensure annotations don't obscure key details
- Use consistent line styles for callouts
```

### Phase 3: Image Preparation

**3.1 Export Diagram for Web**
```
Steps:
1. Verify all text is finalized and spell-checked
2. Check color contrast (WCAG AA: 4.5:1 minimum)
3. Ensure dark mode compatibility (adjust colors if needed)
4. Export at appropriate resolution:
   - Vector diagrams: SVG (preferred) or PDF for print
   - Raster: 2x resolution (e.g., 2400×1600 for 1200×800 display)
5. Use appropriate file format:
   - Diagrams: SVG (vector) or PNG (raster)
   - Screenshots: PNG or WebP
   - Photos: JPEG, WebP, or AVIF
6. Verify file size is reasonable (< 500KB for diagrams)
7. Save original file (don't discard working copy)
```

**3.2 Verify Color Accessibility**
```
Checklist:
- [ ] Check color contrast with WCAG Contrast Checker
- [ ] Verify meaning isn't conveyed by color alone
- [ ] Add patterns or icons to color-coded elements
- [ ] Test in grayscale (simulate color blindness)
- [ ] Use color-blind friendly palette (Okabe-Ito)
- [ ] Ensure sufficient saturation for visibility
- [ ] Test on multiple monitor types
- [ ] Verify dark mode variant if applicable
```

**3.3 Create Dark Mode Variant (if needed)**
```
Process:
1. Duplicate the original diagram
2. Invert background (light → dark)
3. Adjust text colors for contrast (light text on dark)
4. Review colors for visibility
5. Update colors to match dark theme palette
6. Export with "-dark" suffix in filename
7. Test in actual dark mode environment
```

**3.4 Prepare Responsive Image Variants**
```
Breakpoints:
- Mobile (small): 400–600px width
- Mobile (medium): 600–768px width
- Tablet: 768–1024px width
- Desktop: 1024–1440px width
- Ultra-wide: 1440px+ width

Strategy:
1. Determine primary display size (usually 800–1000px)
2. Export variants at standard widths
3. Use `srcset` for responsive delivery
4. Provide 1x and 2x variants (1x and 2x resolution)
5. Test on actual devices at each breakpoint
```

### Phase 4: Image Optimization

**4.1 Optimize Vector Images (SVG)**
```
Best Practices:
1. Clean up unnecessary metadata
2. Remove unused styles and definitions
3. Simplify SVG code (minify)
4. Use appropriate precision for coordinates (2–3 decimals)
5. Convert text to paths if needed (embedding fonts)
6. Compress with SVGOMG or similar tool
7. Verify appearance after compression
8. Use gzip compression for delivery (server-side)

Target Size:
- Simple diagrams: < 50KB
- Complex diagrams: < 200KB
```

**4.2 Optimize Raster Images**
```
Workflow:
1. Reduce to necessary resolution (2x maximum)
2. Crop unnecessary margins
3. Reduce color depth if possible (PNG-8 for simple graphics)
4. Apply lossless compression
   - PNG: Use PNGQuant or similar
   - JPEG: Use MozJPEG with quality 75–85
5. Convert to modern formats:
   - Create WebP version (smaller, good quality)
   - Create AVIF version (even smaller, if supporting)
6. Provide JPEG fallback for old browsers
7. Lazy load large images

Format Selection:
- Screenshots with text: PNG (lossless)
- Photos/complex images: WebP or AVIF
- Simple graphics: PNG or WebP
- Fallback: JPEG for broad compatibility

Target Sizes:
- Small diagram: < 100KB
- Large screenshot: < 500KB
- High-quality photo: < 300KB
```

**4.3 Create Modern Format Variants**
```
Tools:
- cwebp (WebP compression)
- avifenc (AVIF compression)
- ImageMagick (batch conversion)
- Squoosh (web-based optimization)

Steps:
1. Convert original to WebP
   Command: `cwebp -q 80 original.png -o optimized.webp`
2. Convert to AVIF (if targeting modern browsers)
   Command: `avifenc original.png optimized.avif`
3. Keep original format as fallback
4. Use picture element for fallback support

Expected Compression:
- WebP: 20–30% smaller than PNG
- AVIF: 50–70% smaller than PNG
- JPEG with quality 80: 30–50% smaller than PNG
```

**4.4 Validate Optimization**
```
Checks:
- [ ] File size acceptable (< limits above)
- [ ] Visual quality maintained (inspect at actual size)
- [ ] Color accuracy preserved
- [ ] Text remains readable
- [ ] No compression artifacts
- [ ] Responsive images load correctly
- [ ] Lazy loading works
- [ ] Fallback formats load in old browsers
```

### Phase 5: Accessibility & Documentation

**5.1 Write Descriptive Alt Text**
```
Guidelines:
1. Describe what the image shows (not "image of" or "diagram")
2. Include relevant context (e.g., "ROS 2 system architecture")
3. Be concise but complete (typically 50–125 words)
4. Mention numbers or key details
5. Describe relationships and flow
6. For diagrams: explain the purpose and key takeaway
7. Don't include "image of" or "diagram of" at start
8. Test with screen reader for clarity

Examples:

GOOD:
"ROS 2 Publisher-Subscriber architecture showing a publisher node
sending sensor data messages to a topic, with multiple subscriber
nodes receiving and processing the data asynchronously."

POOR:
"Image showing a diagram"

GOOD:
"Humanoid robot joint coordinate system with 17 degrees of freedom:
3 in neck, 3 in each shoulder, 2 in each elbow, 5 in each hand,
3 in torso, and 6 each in hips and knees."

POOR:
"Robot diagram"
```

**5.2 Create Figure Captions**
```
Structure:
1. Figure label: "Figure 3.1: "
2. Descriptive title: Summarize what the diagram shows
3. Context: Explain how it relates to surrounding text
4. Key takeaway: What should reader learn from this?

Examples:

GOOD:
"Figure 4.2: ROS 2 Communication Pattern
A publisher-subscriber pattern in ROS 2 enables decoupled
communication between nodes. Multiple subscribers can receive
data from a single topic, allowing flexible system architectures
where senders and receivers don't directly know each other."

POOR:
"A diagram of ROS communication"

GOOD:
"Figure 7.1: Humanoid Joint Configuration
This coordinate system defines 17 degrees of freedom for a
humanoid robot. Motion planning algorithms use these joint
angles to calculate valid trajectories while respecting joint
limits and physical constraints."

POOR:
"Joint diagram"
```

**5.3 Add Long Descriptions for Complex Diagrams**
```
For Screen Readers:
Use <details> or data-* attributes to provide extended descriptions

Example (HTML/MDX):
<details>
  <summary>Extended description for system architecture diagram</summary>

  The diagram shows a three-layer system architecture:

  1. Application Layer (top): User interfaces, visualization tools,
     and high-level control software

  2. Middleware Layer (center): ROS 2 framework handling communication,
     service calls, and parameter management between components

  3. Hardware Layer (bottom): Physical sensors (IMU, cameras, force
     sensors) and actuators (motors, grippers) connected via
     real-time communication buses

  Data flows bidirectionally: sensors send measurements up,
  commands flow down, and middleware ensures reliable delivery.
</details>
```

**5.4 Verify Accessibility Compliance**
```
Checklist:
- [ ] Alt text present and descriptive
- [ ] Caption includes figure label and description
- [ ] Color not sole means of conveying information
- [ ] Text in image is readable (min 12px)
- [ ] Sufficient color contrast (4.5:1 for text)
- [ ] Image doesn't rely on motion or interaction
- [ ] Text alternatives provided for complex diagrams
- [ ] Decorative images have empty alt attribute (alt="")
- [ ] Related images are grouped with alt text
- [ ] Caption text is meaningful and context-aware
```

### Phase 6: Docusaurus Integration

**6.1 Organize Static Assets**
```
Directory Structure:
/static/
├── images/
│   ├── modules/
│   │   ├── ros2-fundamentals/
│   │   │   ├── architecture.svg
│   │   │   ├── architecture.png
│   │   │   └── pubsub-pattern.svg
│   │   └── gazebo-simulation/
│   │       └── world-setup.png
│   ├── diagrams/
│   │   ├── robotics/
│   │   │   ├── robot-kinematics.svg
│   │   │   └── forward-dynamics.svg
│   │   └── ai/
│   │       └── neural-network.png
│   └── screenshots/
│       ├── gazebo/
│       │   └── humanoid-walking.webp
│       └── simulation/
│           └── sensor-output.png

Naming Convention:
- kebab-case: robot-arm-controller.svg
- Descriptive: system-architecture-layer1.svg
- Version control: concept-v1.svg, concept-v2.svg
- Dark variants: diagram-dark.svg
```

**6.2 Use Responsive Images in MDX**
```jsx
// Basic image with responsive sizing
<img
  src="/images/modules/ros2/pubsub-pattern.svg"
  alt="ROS 2 Publisher-Subscriber pattern showing one publisher
       sending messages to multiple subscribers through a shared topic"
  style={{ maxWidth: '100%', height: 'auto' }}
/>

// Image with picture element for format fallback
<picture>
  <source srcSet="/images/diagrams/architecture.avif" type="image/avif" />
  <source srcSet="/images/diagrams/architecture.webp" type="image/webp" />
  <img
    src="/images/diagrams/architecture.png"
    alt="Complete system architecture showing three layers:
         application, middleware, and hardware interfaces"
    style={{ maxWidth: '100%', height: 'auto' }}
  />
</picture>

// Responsive image with srcset
<img
  src="/images/diagrams/architecture-800.webp"
  srcSet="
    /images/diagrams/architecture-400.webp 400w,
    /images/diagrams/architecture-800.webp 800w,
    /images/diagrams/architecture-1200.webp 1200w
  "
  sizes="(max-width: 600px) 100vw, (max-width: 1200px) 80vw, 70vw"
  alt="System architecture with three layers"
  style={{ maxWidth: '100%', height: 'auto' }}
/>

// Using Docusaurus image component (if available)
import { Image } from '@docusaurus/components';

<Image
  src={require('/static/images/diagrams/robot-kinematics.svg').default}
  alt="Robot kinematics showing joint angles and coordinate frames"
/>
```

**6.3 Add Figure Captions**
```jsx
// Basic caption below image
<figure>
  <img
    src="/images/ros2/pubsub.svg"
    alt="ROS 2 Publisher-Subscriber communication pattern"
  />
  <figcaption>
    Figure 3.1: Publisher-Subscriber Pattern in ROS 2
    Messages flow from a single publisher through a topic to multiple
    subscribers, enabling decoupled asynchronous communication.
  </figcaption>
</figure>

// Caption with extended description
<figure>
  <picture>
    <source srcSet="/images/diagrams/architecture.avif" type="image/avif" />
    <source srcSet="/images/diagrams/architecture.webp" type="image/webp" />
    <img
      src="/images/diagrams/architecture.png"
      alt="Three-layer system architecture diagram"
    />
  </picture>
  <figcaption>
    <strong>Figure 4.2: Complete System Architecture</strong>
    <p>
      The system is organized into three layers: (1) Application Layer
      containing user interfaces and visualization, (2) Middleware Layer
      with ROS 2 framework and communication infrastructure, and (3) Hardware
      Layer with sensors and actuators. Data flows bidirectionally between
      layers through well-defined interfaces.
    </p>
  </figcaption>
</figure>

// CSS for caption styling
figcaption {
    margin-top: 1rem;
    font-size: 0.95rem;
    color: #6b7280;
    text-align: center;
    font-style: italic;
    line-height: 1.6;
}
```

**6.4 Configure Docusaurus for Images**
```javascript
// docusaurus.config.js
module.exports = {
  // ... config
  staticDirectories: ['static'],

  // Configure image optimization
  imageCompression: {
    quality: 85,
    outputFormat: 'webp',
  },

  // Enable lazy loading
  scripts: [
    {
      src: 'https://cdn.jsdelivr.net/npm/lazysizes@5.3.2/lazysizes.min.js',
      async: true,
      defer: true,
    },
  ],
};
```

### Phase 7: Testing & Validation

**7.1 Visual Quality Testing**
```
Checklist:
- [ ] Image renders correctly at all breakpoints
- [ ] Text remains readable at display sizes
- [ ] Colors appear correct (check multiple monitors)
- [ ] Aspect ratio maintained without distortion
- [ ] No compression artifacts or degradation
- [ ] Diagrams are clear and easy to understand
- [ ] Captions are properly positioned
- [ ] Dark mode variant (if used) is accessible
```

**7.2 Performance Testing**
```
Metrics to Check:
- [ ] Largest Contentful Paint (LCP) < 2.5s
- [ ] Cumulative Layout Shift (CLS) < 0.1
- [ ] File sizes optimized (under limits)
- [ ] Images lazy-load correctly
- [ ] WebP/AVIF variants load in supported browsers
- [ ] Fallback images load in older browsers
- [ ] Lighthouse score ≥ 90

Tools:
- Lighthouse (Chrome DevTools)
- WebPageTest
- GTmetrix
```

**7.3 Accessibility Testing**
```
Checklist:
- [ ] Alt text passes screen reader test
- [ ] Color contrast ≥ 4.5:1 for text
- [ ] Image doesn't rely on color alone
- [ ] Caption text is meaningful
- [ ] Extended descriptions provided for complex diagrams
- [ ] Images pass axe accessibility audit
- [ ] WAVE tool reports no errors
- [ ] VoiceOver/NVDA reads descriptions correctly
```

**7.4 Cross-Browser Testing**
```
Test In:
- Chrome/Chromium (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile Safari (iOS)
- Chrome Mobile (Android)

Verify:
- Images load correctly
- Responsive images work
- WebP/AVIF supported or fallbacks work
- Alt text accessible
- Captions render properly
```

## Diagram Examples for Robotics

### Example 1: ROS 2 Architecture Diagram

**Concept**: Show how ROS 2 components communicate

```
Suggested Structure:
- Application Layer (top): Nodes, user interfaces
- Middleware Layer: ROS 2 DDS, topics, services, actions
- Hardware Layer: Sensors, actuators, drivers
- Data Flow: Bidirectional arrows showing communication

Diagram Elements:
[App Node 1] ---[Topic A]---> [Subscriber Node]
[Sensor Driver] --[Topic B]-> [Data Processing Node]
[Service Server] <--[Service Call]-- [Client Node]

Best Tools:
- Lucidchart (professional)
- Draw.io (free, simple)
- Excalidraw (fast, sketchy style)
```

### Example 2: Humanoid Robot Joint Configuration

**Concept**: Display degrees of freedom and coordinate systems

```
Suggested Structure:
- Full-body side view with all joints labeled
- Color-coded joint groups (head, arms, legs, torso)
- Degree of freedom notation (3-DOF neck, 2-DOF elbow, etc.)
- Coordinate frame indicators (X, Y, Z axes)

Diagram Elements:
- Joint circles with labels
- Rotational axis indicators
- Range of motion arcs
- Color legend

Best Tools:
- Figma (for detailed illustrations)
- Adobe Illustrator (professional)
- Blender (3D visualization, export to 2D)
```

### Example 3: Gazebo Simulation World Setup

**Concept**: Show environment configuration and object placement

```
Suggested Representation:
- Top-down view of simulated world
- Robot positioning
- Obstacle placement
- Sensor coverage areas (optional)
- Coordinate axes and measurements

Alternative: 3D Isometric view showing:
- Ground plane
- Robot with scale reference
- Obstacles and furniture
- Sensor mounting points
- Gravity direction

Best Sources:
- Screenshot from Gazebo (real simulation)
- Blender 3D render (custom visualization)
- SVG diagram (abstract representation)
```

### Example 4: Control Flow Diagram

**Concept**: Show algorithm or process steps

```
Structure:
Start → Sensor Read → Decision → Action → Loop/End

Elements:
- Rectangles: Processing steps
- Diamonds: Decision points
- Ovals: Start/End
- Arrows: Flow direction
- Labels: Step descriptions

Example for PD Controller:
Start → Read Current State → Calculate Error →
Multiply by Gains (P & D) → Sum Contributions →
Clamp Output → Apply to Motors → Repeat

Best Tools:
- Lucidchart
- Draw.io
- Miro (for collaborative design)
```

### Example 5: Data Flow Diagram

**Concept**: Show information movement through system

```
Notation:
- Circles/Nodes: Processes or components
- Arrows: Data flow (labeled with data type)
- Rectangles: Data stores
- External entities: Outside system boundary

Example for Sensor Fusion:
[IMU Sensor] --raw_accel--> [Fusion Algorithm]
[Camera] --image_data--> [Fusion Algorithm]
[Force Sensors] --contact_info--> [Fusion Algorithm]
[Fusion Algorithm] --state_estimate--> [Controller]

Best Tools:
- Lucidchart (detailed)
- Draw.io (simple, free)
- Figma (modern design)
```

## Tools & Software

### Diagram Creation Tools
- **Excalidraw** — Fast, sketchy, intuitive (free, web-based)
- **Lucidchart** — Professional, comprehensive (paid, cloud)
- **Draw.io** — Versatile, free, extensive templates (web + desktop)
- **Figma** — Modern design tool with collaboration (free tier available)
- **Miro** — Collaborative whiteboarding (free tier)
- **OmniGraffle** — macOS professional diagramming (paid)

### Screenshot & Image Tools
- **Snagit** — Screenshot and annotation tool (paid)
- **Screenshot tools** — OS built-in (Windows Snipping Tool, macOS Screenshot)
- **Greenshot** — Windows screenshot tool with annotation (free)
- **Gyroflow Toolbox** — Video frame extraction (free)

### Image Optimization Tools
- **ImageOptim** — macOS image compression (free)
- **PNGQuant** — PNG color reduction (free, command-line)
- **MozJPEG** — JPEG optimization (free, command-line)
- **cwebp** — WebP conversion (free, command-line)
- **avifenc** — AVIF conversion (free, command-line)
- **Squoosh** — Web-based image optimization (free)
- **ImageMagick** — Batch image processing (free, command-line)

### Format Conversion
- **FFmpeg** — Video and image processing (free, command-line)
- **ImageMagick** — Batch conversion (free)
- **GIMP** — Image editor with export options (free)
- **Photoshop** — Professional image editing (paid)

### Accessibility Testing
- **WAVE** — Web accessibility evaluation tool (browser extension)
- **axe DevTools** — Automated accessibility testing (browser extension)
- **Lighthouse** — Performance and accessibility audits (Chrome DevTools)
- **WCAG Contrast Checker** — Color contrast validation (web tool)
- **Color Blindness Simulator** — Test for color vision deficiency

### Performance Testing
- **Lighthouse** — Performance, accessibility, best practices (Chrome)
- **WebPageTest** — Detailed performance analysis (web)
- **GTmetrix** — Performance audit with waterfall charts (web)
- **PageSpeed Insights** — Google performance recommendations (web)

## Image Optimization Commands

### WebP Conversion
```bash
# Single file
cwebp -q 80 diagram.png -o diagram.webp

# Batch conversion (all PNGs)
for file in *.png; do
    cwebp -q 80 "$file" -o "${file%.png}.webp"
done
```

### AVIF Conversion
```bash
# Single file
avifenc --quality=75 diagram.png diagram.avif

# Batch conversion
for file in *.png; do
    avifenc --quality=75 "$file" "${file%.png}.avif"
done
```

### PNG Optimization
```bash
# Lossless PNG compression
pngquant --quality=75-90 diagram.png -o diagram-optimized.png

# Using ImageMagick
convert diagram.png -quality 90 diagram-optimized.png
```

### Responsive Image Generation
```bash
# Generate multiple sizes using ImageMagick
for size in 400 800 1200; do
    convert original.png -resize ${size}x diagram-${size}.png
    cwebp -q 80 diagram-${size}.png -o diagram-${size}.webp
done
```

## Acceptance Criteria

- [ ] Diagram clearly illustrates the intended concept
- [ ] Alt text is descriptive and accurate (50–125 words)
- [ ] Caption includes figure number and meaningful description
- [ ] Image optimized for web (appropriate file size and format)
- [ ] WebP format provided (with fallback)
- [ ] AVIF format provided (if supporting modern browsers)
- [ ] Responsive images work at all breakpoints
- [ ] Color contrast ≥ 4.5:1 for any text in image
- [ ] Doesn't rely solely on color to convey information
- [ ] Lazy loading implemented for performance
- [ ] Docusaurus static asset rules followed
- [ ] Image renders correctly in light and dark modes
- [ ] Long description provided for complex diagrams
- [ ] No personal information or credentials visible
- [ ] Lighthouse performance score ≥ 90

## Quality Checklist

**Conceptual Design:**
- [ ] Diagram purpose is clear and stated
- [ ] Visual matches textbook's learning objectives
- [ ] Appropriate diagram type selected for concept
- [ ] All necessary components included
- [ ] Complexity balanced with clarity
- [ ] Professional appearance and style

**Visual Quality:**
- [ ] Text is legible at actual display size
- [ ] Colors are vibrant and appealing
- [ ] Contrast between elements is sufficient
- [ ] Layout is balanced and well-organized
- [ ] No unnecessary visual clutter
- [ ] Consistent style across related diagrams

**Accessibility:**
- [ ] Alt text complete and descriptive
- [ ] Caption provides context and learning connection
- [ ] Color accessibility verified (non-color-blind friendly)
- [ ] Text scaling works in browser
- [ ] Image accessible to screen readers
- [ ] Extended descriptions for complex diagrams

**Technical Optimization:**
- [ ] File sizes meet targets
- [ ] Modern formats (WebP, AVIF) provided
- [ ] Fallbacks for older browsers work
- [ ] Responsive at all breakpoints
- [ ] Lazy loading functional
- [ ] Performance impact minimal

**Documentation:**
- [ ] File naming is descriptive and consistent
- [ ] Stored in appropriate Docusaurus directory
- [ ] Version control maintained (original file preserved)
- [ ] Metadata/EXIF data cleaned (if applicable)
- [ ] Source file documented (for future edits)
- [ ] Attribution included (if using third-party content)

---

Save it as `.claude/skills/visual-assets/skill.md`
