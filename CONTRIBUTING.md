# Contributing to Physical AI & Humanoid Robotics Interactive Textbook

Thank you for your interest in contributing! This document provides guidelines for contributing to the project.

## 🎯 Code of Conduct

- Be respectful and inclusive
- Focus on constructive feedback
- Help create a positive learning environment

## 🚀 Getting Started

1. **Fork the repository**
2. **Clone your fork**: `git clone https://github.com/your-username/physical-ai-textbook.git`
3. **Install dependencies**: `npm install`
4. **Create a branch**: `git checkout -b feature/your-feature-name`

## 📝 Development Guidelines

### Code Style

- Follow the existing code style
- Use TypeScript for all new code
- Run `npm run lint` before committing
- Run `npm run format` to auto-format code

### Commit Messages

Use conventional commit format:

```
feat: add quiz component
fix: correct reading time calculation
docs: update README
style: format code with prettier
test: add unit tests for Quiz component
chore: update dependencies
```

### TypeScript

- Enable strict mode
- Provide explicit types for function parameters and return values
- Avoid using `any` type

### Component Structure

```tsx
import React from 'react';
import styles from './ComponentName.module.css';

interface ComponentNameProps {
  title: string;
  onAction?: () => void;
}

export const ComponentName: React.FC<ComponentNameProps> = ({ title, onAction }) => {
  return (
    <div className={styles.container}>
      <h2>{title}</h2>
    </div>
  );
};
```

### Testing

- Write unit tests for utilities and hooks
- Write integration tests for critical user flows
- Aim for 80%+ code coverage
- Run tests before submitting PR: `npm test`

## 📚 Content Guidelines

### Writing Content

- Target technical undergraduate audience
- Each module page: 6,000-7,000 words
- Include 3-5 code examples per page
- Include 2-3 Mermaid diagrams per page
- Provide clear explanations with examples

### Code Examples

- Use Python for ROS 2 examples
- Include comments explaining key concepts
- Test all code examples
- Provide realistic, simulation-based examples

### Diagrams

- Use Mermaid for architecture and flow diagrams
- Keep diagrams clear and readable
- Include captions

## 🌍 Internationalization

- All UI strings must be translatable
- Test RTL layout for Arabic and Urdu
- Ensure proper text direction for code blocks (always LTR)

## 🎨 Design System

Follow the "Neural Circuitry Futurism" design system:

- Use defined color tokens from `custom.css`
- Follow typography hierarchy
- Ensure animations respect `prefers-reduced-motion`
- Test responsive design on mobile, tablet, desktop

## 🧪 Testing Checklist

Before submitting your PR:

- [ ] All unit tests pass
- [ ] All integration tests pass
- [ ] Linter passes with no errors
- [ ] Code is formatted with Prettier
- [ ] TypeScript compiles without errors
- [ ] Tested on Chrome, Firefox, Safari
- [ ] Tested on mobile devices
- [ ] Accessibility audit passes (WCAG AA)

## 📥 Pull Request Process

1. **Update documentation** if needed
2. **Add tests** for new features
3. **Update CHANGELOG** (if applicable)
4. **Request review** from maintainers
5. **Address feedback** promptly
6. **Squash commits** before merge (if requested)

## 🐛 Reporting Bugs

When reporting bugs, please include:

- **Description**: Clear description of the issue
- **Steps to reproduce**: Detailed steps
- **Expected behavior**: What should happen
- **Actual behavior**: What actually happens
- **Environment**: Browser, OS, Node version
- **Screenshots**: If applicable

## 💡 Feature Requests

When requesting features:

- **Use case**: Why is this feature needed?
- **Proposed solution**: How should it work?
- **Alternatives**: Other approaches considered
- **Impact**: Who benefits from this feature?

## 📞 Questions?

- Open a GitHub issue
- Tag with `question` label

Thank you for contributing! 🎉
