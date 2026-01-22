# Physical AI & Humanoid Robotics Interactive Textbook

**Bridging the gap between digital minds and physical bodies**

## 🚀 Overview

This is a comprehensive interactive textbook covering Physical AI and Humanoid Robotics, featuring:

- **4 Core Modules**: ROS 2, Digital Twin, NVIDIA Isaac, VLA Models
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

- Node.js 18.0.0 or higher
- npm or yarn

### Setup

```bash
# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build

# Serve production build
npm run serve
```

## 🏗️ Project Structure

```
physical-ai-textbook/
├── .github/          # GitHub Actions CI/CD
├── docs/             # Content pages (MDX)
│   └── modules/      # 4 module directories
├── src/              # React components & hooks
│   ├── components/   # Reusable UI components
│   ├── hooks/        # Custom React hooks
│   ├── utils/        # Utility functions
│   ├── types/        # TypeScript type definitions
│   └── css/          # Global styles
├── static/           # Static assets
├── quizzes/          # Quiz data (JSON)
├── docusaurus.config.ts
├── sidebars.ts
└── package.json
```

## 🧪 Testing

```bash
# Run unit tests
npm test

# Run tests with coverage
npm run test:coverage

# Run integration tests (Cypress)
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
