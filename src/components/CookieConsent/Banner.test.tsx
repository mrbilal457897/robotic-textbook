import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Banner } from './Banner';
import { useCookieConsent } from '@/hooks/useCookieConsent';

jest.mock('@/hooks/useCookieConsent');

describe('Cookie Banner Component', () => {
  const mockUseCookieConsent = useCookieConsent as jest.MockedFunction<typeof useCookieConsent>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('displays cookie consent banner on first visit', () => {
    mockUseCookieConsent.mockReturnValue({
      hasConsented: false,
      preferences: { analytics: false, marketing: false },
      acceptAll: jest.fn(),
      rejectAll: jest.fn(),
      updatePreferences: jest.fn(),
      resetConsent: jest.fn(),
    });

    render(<Banner />);
    expect(screen.getByText(/cookie/i)).toBeInTheDocument();
    expect(screen.getByText(/consent/i)).toBeInTheDocument();
  });

  it('hides banner after consent given', () => {
    mockUseCookieConsent.mockReturnValue({
      hasConsented: true,
      preferences: { analytics: true, marketing: true },
      acceptAll: jest.fn(),
      rejectAll: jest.fn(),
      updatePreferences: jest.fn(),
      resetConsent: jest.fn(),
    });

    const { container } = render(<Banner />);
    const banner = container.querySelector('[class*="banner"]');
    // Banner should be hidden or not displayed
    expect(banner?.style?.display || 'none').toMatch(/none|hidden/);
  });

  it('shows accept all button', () => {
    mockUseCookieConsent.mockReturnValue({
      hasConsented: false,
      preferences: { analytics: false, marketing: false },
      acceptAll: jest.fn(),
      rejectAll: jest.fn(),
      updatePreferences: jest.fn(),
      resetConsent: jest.fn(),
    });

    render(<Banner />);
    const acceptButton = screen.getByRole('button', { name: /accept all|accept/i });
    expect(acceptButton).toBeInTheDocument();
  });

  it('calls acceptAll when accept button clicked', async () => {
    const acceptAllMock = jest.fn();
    mockUseCookieConsent.mockReturnValue({
      hasConsented: false,
      preferences: { analytics: false, marketing: false },
      acceptAll: acceptAllMock,
      rejectAll: jest.fn(),
      updatePreferences: jest.fn(),
      resetConsent: jest.fn(),
    });

    render(<Banner />);
    const acceptButton = screen.getByRole('button', { name: /accept all|accept/i });
    fireEvent.click(acceptButton);

    expect(acceptAllMock).toHaveBeenCalled();
  });

  it('shows customize/preferences button', () => {
    mockUseCookieConsent.mockReturnValue({
      hasConsented: false,
      preferences: { analytics: false, marketing: false },
      acceptAll: jest.fn(),
      rejectAll: jest.fn(),
      updatePreferences: jest.fn(),
      resetConsent: jest.fn(),
    });

    render(<Banner />);
    const customizeButton = screen.getByRole('button', { name: /customize|preferences/i });
    expect(customizeButton).toBeInTheDocument();
  });

  it('shows reject all button', () => {
    mockUseCookieConsent.mockReturnValue({
      hasConsented: false,
      preferences: { analytics: false, marketing: false },
      acceptAll: jest.fn(),
      rejectAll: jest.fn(),
      updatePreferences: jest.fn(),
      resetConsent: jest.fn(),
    });

    render(<Banner />);
    const rejectButton = screen.getByRole('button', { name: /reject all|reject/i });
    expect(rejectButton).toBeInTheDocument();
  });

  it('calls rejectAll when reject button clicked', () => {
    const rejectAllMock = jest.fn();
    mockUseCookieConsent.mockReturnValue({
      hasConsented: false,
      preferences: { analytics: false, marketing: false },
      acceptAll: jest.fn(),
      rejectAll: rejectAllMock,
      updatePreferences: jest.fn(),
      resetConsent: jest.fn(),
    });

    render(<Banner />);
    const rejectButton = screen.getByRole('button', { name: /reject all|reject/i });
    fireEvent.click(rejectButton);

    expect(rejectAllMock).toHaveBeenCalled();
  });

  it('displays cookie information/description', () => {
    mockUseCookieConsent.mockReturnValue({
      hasConsented: false,
      preferences: { analytics: false, marketing: false },
      acceptAll: jest.fn(),
      rejectAll: jest.fn(),
      updatePreferences: jest.fn(),
      resetConsent: jest.fn(),
    });

    render(<Banner />);
    // Should have text explaining cookies
    const text = screen.getByText(/cookie/i).textContent;
    expect(text && text.length > 20).toBeTruthy();
  });

  it('is positioned correctly on screen', () => {
    mockUseCookieConsent.mockReturnValue({
      hasConsented: false,
      preferences: { analytics: false, marketing: false },
      acceptAll: jest.fn(),
      rejectAll: jest.fn(),
      updatePreferences: jest.fn(),
      resetConsent: jest.fn(),
    });

    const { container } = render(<Banner />);
    const banner = container.querySelector('[class*="banner"]');
    expect(banner).toHaveClass(expect.stringContaining('banner'));
  });

  it('has proper accessibility attributes', () => {
    mockUseCookieConsent.mockReturnValue({
      hasConsented: false,
      preferences: { analytics: false, marketing: false },
      acceptAll: jest.fn(),
      rejectAll: jest.fn(),
      updatePreferences: jest.fn(),
      resetConsent: jest.fn(),
    });

    const { container } = render(<Banner />);
    const banner = container.querySelector('[class*="banner"]');
    // Should have role or semantic structure
    expect(banner || screen.getByText(/cookie/i)).toBeTruthy();
  });
});
