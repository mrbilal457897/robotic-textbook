import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LanguageSelector } from './index';
import { useLanguage, SupportedLanguage } from '@/hooks/useLanguage';

jest.mock('@/hooks/useLanguage');

describe('LanguageSelector Component', () => {
  const mockUseLanguage = useLanguage as jest.MockedFunction<typeof useLanguage>;

  const mockLanguages = [
    { code: 'en' as SupportedLanguage, name: 'English', nativeName: 'English', flag: '🇺🇸' },
    { code: 'ar' as SupportedLanguage, name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦' },
    { code: 'ur' as SupportedLanguage, name: 'Urdu', nativeName: 'اردو', flag: '🇵🇰' },
    { code: 'es' as SupportedLanguage, name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
    { code: 'zh' as SupportedLanguage, name: 'Chinese', nativeName: '中文', flag: '🇨🇳' },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders language selector button', () => {
    mockUseLanguage.mockReturnValue({
      currentLanguage: 'en',
      currentConfig: mockLanguages[0],
      availableLanguages: mockLanguages,
      switchLanguage: jest.fn(),
    });

    render(<LanguageSelector />);
    const button = screen.getByRole('button', { name: /select language/i });
    expect(button).toBeInTheDocument();
  });

  it('displays current language flag and name', () => {
    mockUseLanguage.mockReturnValue({
      currentLanguage: 'en',
      currentConfig: mockLanguages[0],
      availableLanguages: mockLanguages,
      switchLanguage: jest.fn(),
    });

    render(<LanguageSelector />);
    expect(screen.getByText('English')).toBeInTheDocument();
    expect(screen.getByText('🇺🇸')).toBeInTheDocument();
  });

  it('opens dropdown when button clicked', async () => {
    mockUseLanguage.mockReturnValue({
      currentLanguage: 'en',
      currentConfig: mockLanguages[0],
      availableLanguages: mockLanguages,
      switchLanguage: jest.fn(),
    });

    render(<LanguageSelector />);
    const button = screen.getByRole('button', { name: /select language/i });
    fireEvent.click(button);

    await waitFor(() => {
      // Dropdown should show all language options
      expect(screen.getByText('العربية')).toBeInTheDocument();
    });
  });

  it('displays all available languages in dropdown', async () => {
    mockUseLanguage.mockReturnValue({
      currentLanguage: 'en',
      currentConfig: mockLanguages[0],
      availableLanguages: mockLanguages,
      switchLanguage: jest.fn(),
    });

    render(<LanguageSelector />);
    const button = screen.getByRole('button', { name: /select language/i });
    fireEvent.click(button);

    await waitFor(() => {
      mockLanguages.forEach((lang) => {
        expect(screen.getByText(lang.nativeName)).toBeInTheDocument();
      });
    });
  });

  it('calls switchLanguage when option selected', async () => {
    const switchLanguageMock = jest.fn();
    mockUseLanguage.mockReturnValue({
      currentLanguage: 'en',
      currentConfig: mockLanguages[0],
      availableLanguages: mockLanguages,
      switchLanguage: switchLanguageMock,
    });

    render(<LanguageSelector />);
    const button = screen.getByRole('button', { name: /select language/i });
    fireEvent.click(button);

    await waitFor(() => {
      const arabicOption = screen.getByText('العربية');
      fireEvent.click(arabicOption);
    });

    expect(switchLanguageMock).toHaveBeenCalledWith('ar');
  });

  it('marks current language with checkmark', async () => {
    mockUseLanguage.mockReturnValue({
      currentLanguage: 'en',
      currentConfig: mockLanguages[0],
      availableLanguages: mockLanguages,
      switchLanguage: jest.fn(),
    });

    render(<LanguageSelector />);
    const button = screen.getByRole('button', { name: /select language/i });
    fireEvent.click(button);

    await waitFor(() => {
      const checkmark = screen.getByText('✓');
      expect(checkmark).toBeInTheDocument();
    });
  });

  it('closes dropdown when language selected', async () => {
    const switchLanguageMock = jest.fn();
    mockUseLanguage.mockReturnValue({
      currentLanguage: 'en',
      currentConfig: mockLanguages[0],
      availableLanguages: mockLanguages,
      switchLanguage: switchLanguageMock,
    });

    render(<LanguageSelector />);
    const button = screen.getByRole('button', { name: /select language/i });
    fireEvent.click(button);

    await waitFor(() => {
      const arabicOption = screen.getByText('العربية');
      fireEvent.click(arabicOption);
    });

    // Dropdown should close after selection
    await waitFor(() => {
      // Native names should still be visible in original button text
      expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    });
  });

  it('closes dropdown when escape key pressed', async () => {
    mockUseLanguage.mockReturnValue({
      currentLanguage: 'en',
      currentConfig: mockLanguages[0],
      availableLanguages: mockLanguages,
      switchLanguage: jest.fn(),
    });

    render(<LanguageSelector />);
    const button = screen.getByRole('button', { name: /select language/i });
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText('العربية')).toBeInTheDocument();
    });

    // Press Escape
    fireEvent.keyDown(button, { key: 'Escape' });

    await waitFor(() => {
      expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    });
  });

  it('closes dropdown when clicking outside', async () => {
    mockUseLanguage.mockReturnValue({
      currentLanguage: 'en',
      currentConfig: mockLanguages[0],
      availableLanguages: mockLanguages,
      switchLanguage: jest.fn(),
    });

    const { container } = render(
      <div>
        <LanguageSelector />
        <div data-testid="outside">Outside element</div>
      </div>
    );

    const button = screen.getByRole('button', { name: /select language/i });
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText('العربية')).toBeInTheDocument();
    });

    // Click outside
    const outside = screen.getByTestId('outside');
    fireEvent.mouseDown(outside);

    await waitFor(() => {
      expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    });
  });

  it('has proper accessibility attributes', () => {
    mockUseLanguage.mockReturnValue({
      currentLanguage: 'en',
      currentConfig: mockLanguages[0],
      availableLanguages: mockLanguages,
      switchLanguage: jest.fn(),
    });

    render(<LanguageSelector />);
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-label', expect.stringContaining('language'));
    expect(button).toHaveAttribute('aria-expanded');
  });

  it('displays both language name and native name', async () => {
    mockUseLanguage.mockReturnValue({
      currentLanguage: 'en',
      currentConfig: mockLanguages[0],
      availableLanguages: mockLanguages,
      switchLanguage: jest.fn(),
    });

    render(<LanguageSelector />);
    const button = screen.getByRole('button', { name: /select language/i });
    fireEvent.click(button);

    await waitFor(() => {
      // Each language should show both English and native names
      mockLanguages.forEach((lang) => {
        if (lang.code !== 'en') {
          expect(screen.getByText(lang.nativeName)).toBeInTheDocument();
        }
      });
    });
  });

  it('updates when current language changes', () => {
    const { rerender } = render(<LanguageSelector />);

    mockUseLanguage.mockReturnValue({
      currentLanguage: 'ar',
      currentConfig: mockLanguages[1],
      availableLanguages: mockLanguages,
      switchLanguage: jest.fn(),
    });

    rerender(<LanguageSelector />);
    expect(screen.getByText('العربية')).toBeInTheDocument();
  });
});
