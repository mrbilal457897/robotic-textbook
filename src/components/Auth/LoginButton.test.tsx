/**
 * Tests for LoginButton Component
 * Testing OAuth login flow and button states
 */

import { render, screen, fireEvent } from '@testing-library/react';
import { LoginButton } from './LoginButton';

describe('LoginButton', () => {
  const mockOnLogin = jest.fn();
  const originalLocation = window.location;

  beforeEach(() => {
    jest.clearAllMocks();
    delete (window as any).location;
    (window as any).location = { ...originalLocation, href: '' };
    process.env.GITHUB_OAUTH_CLIENT_ID = 'test-client-id';
  });

  afterEach(() => {
    (window as any).location = originalLocation;
  });

  describe('Rendering', () => {
    it('should render login button with text', () => {
      render(<LoginButton onLogin={mockOnLogin} />);

      const button = screen.getByRole('button', { name: /login with github/i });
      expect(button).toBeInTheDocument();
      expect(button).toHaveTextContent('Login with GitHub');
    });

    it('should render GitHub icon', () => {
      render(<LoginButton onLogin={mockOnLogin} />);

      const svg = screen.getByRole('button').querySelector('svg');
      expect(svg).toBeInTheDocument();
      expect(svg).toHaveAttribute('aria-hidden', 'true');
    });

    it('should have proper aria-label for accessibility', () => {
      render(<LoginButton onLogin={mockOnLogin} />);

      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-label', 'Login with GitHub');
    });
  });

  describe('OAuth Flow', () => {
    it('should redirect to GitHub OAuth when clicked', () => {
      render(<LoginButton onLogin={mockOnLogin} />);

      const button = screen.getByRole('button');
      fireEvent.click(button);

      expect(window.location.href).toContain('https://github.com/login/oauth/authorize');
      expect(window.location.href).toContain('client_id=test-client-id');
    });

    it('should include correct redirect URI', () => {
      Object.defineProperty(window, 'location', {
        value: { origin: 'http://localhost:3000', href: '' },
        writable: true,
      });

      render(<LoginButton onLogin={mockOnLogin} />);

      const button = screen.getByRole('button');
      fireEvent.click(button);

      expect(window.location.href).toContain(
        encodeURIComponent('http://localhost:3000/oauth-callback')
      );
    });

    it('should include correct OAuth scopes', () => {
      render(<LoginButton onLogin={mockOnLogin} />);

      const button = screen.getByRole('button');
      fireEvent.click(button);

      const expectedScope = encodeURIComponent('read:user user:email');
      expect(window.location.href).toContain(`scope=${expectedScope}`);
    });

    it('should use client ID from environment variable', () => {
      process.env.GITHUB_OAUTH_CLIENT_ID = 'custom-client-id';

      render(<LoginButton onLogin={mockOnLogin} />);

      const button = screen.getByRole('button');
      fireEvent.click(button);

      expect(window.location.href).toContain('client_id=custom-client-id');
    });

    it('should fallback to default client ID if env var not set', () => {
      delete process.env.GITHUB_OAUTH_CLIENT_ID;

      render(<LoginButton onLogin={mockOnLogin} />);

      const button = screen.getByRole('button');
      fireEvent.click(button);

      expect(window.location.href).toContain('client_id=your-client-id');
    });
  });

  describe('Disabled State', () => {
    it('should render as disabled when disabled prop is true', () => {
      render(<LoginButton onLogin={mockOnLogin} disabled={true} />);

      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
    });

    it('should not redirect when disabled and clicked', () => {
      render(<LoginButton onLogin={mockOnLogin} disabled={true} />);

      const button = screen.getByRole('button');
      fireEvent.click(button);

      expect(window.location.href).toBe('');
    });

    it('should render as enabled by default', () => {
      render(<LoginButton onLogin={mockOnLogin} />);

      const button = screen.getByRole('button');
      expect(button).not.toBeDisabled();
    });
  });

  describe('Button Styling', () => {
    it('should have loginButton CSS class', () => {
      const { container } = render(<LoginButton onLogin={mockOnLogin} />);

      const button = container.querySelector('button');
      expect(button?.className).toContain('loginButton');
    });
  });
});
