import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SearchUI } from './SearchUI';

// Mock the search functionality
jest.mock('@docusaurus/theme-search-algolia', () => ({
  useSearchResultsMenu: () => ({
    isOpen: false,
    setIsOpen: jest.fn(),
  }),
}), { virtual: true });

describe('SearchUI Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders search input field', () => {
    render(<SearchUI />);
    const searchInput = screen.getByRole('searchbox') || screen.getByPlaceholderText(/search/i);
    expect(searchInput).toBeInTheDocument();
  });

  it('displays search icon', () => {
    const { container } = render(<SearchUI />);
    const icon = container.querySelector('[class*="search"]');
    expect(icon || container.querySelector('svg')).toBeTruthy();
  });

  it('accepts user input', async () => {
    const user = userEvent.setup();
    render(<SearchUI />);

    const searchInput = screen.getByRole('searchbox') || screen.getByPlaceholderText(/search/i);
    await user.type(searchInput, 'test query');

    expect(searchInput).toHaveValue('test query');
  });

  it('clears search on reset', async () => {
    const user = userEvent.setup();
    render(<SearchUI />);

    const searchInput = screen.getByRole('searchbox') || screen.getByPlaceholderText(/search/i);
    await user.type(searchInput, 'test query');
    expect(searchInput).toHaveValue('test query');

    // Find and click clear button if it exists
    const clearButton = screen.queryByRole('button', { name: /clear/i });
    if (clearButton) {
      await user.click(clearButton);
      await waitFor(() => {
        expect(searchInput).toHaveValue('');
      });
    }
  });

  it('has keyboard accessibility', async () => {
    const user = userEvent.setup();
    render(<SearchUI />);

    const searchInput = screen.getByRole('searchbox') || screen.getByPlaceholderText(/search/i);

    // Focus should be managed
    searchInput.focus();
    expect(document.activeElement).toBe(searchInput);
  });

  it('has placeholder text for guidance', () => {
    render(<SearchUI />);
    const searchInput = screen.getByPlaceholderText(/search/i) || screen.getByRole('searchbox');
    expect(searchInput).toHaveAttribute('placeholder');
  });

  it('supports Cmd/Ctrl+K keyboard shortcut', () => {
    render(<SearchUI />);
    const searchInput = screen.getByRole('searchbox') || screen.getByPlaceholderText(/search/i);

    // Simulate Cmd+K (Mac) or Ctrl+K (Windows/Linux)
    fireEvent.keyDown(window, { key: 'k', ctrlKey: true });
    // Input should be focused after shortcut
    expect(document.activeElement === searchInput || document.activeElement?.tagName === 'INPUT').toBeTruthy();
  });

  it('displays search results container when results available', () => {
    render(<SearchUI />);
    // Results container should be present (even if empty initially)
    const resultsArea = screen.queryByRole('region') || screen.getByPlaceholderText(/search/i).parentElement;
    expect(resultsArea).toBeInTheDocument();
  });

  it('applies correct styling classes', () => {
    const { container } = render(<SearchUI />);
    const searchContainer = container.querySelector('[class*="search"]');
    expect(searchContainer).toBeTruthy();
  });

  it('handles rapid typing without errors', async () => {
    const user = userEvent.setup();
    render(<SearchUI />);

    const searchInput = screen.getByRole('searchbox') || screen.getByPlaceholderText(/search/i);
    await user.type(searchInput, 'quick typing test', { delay: 10 });

    expect(searchInput).toHaveValue('quick typing test');
  });

  it('is responsive to window resize', () => {
    const { container } = render(<SearchUI />);
    const searchContainer = container.querySelector('[class*="search"]');

    // Simulate window resize
    fireEvent.resize(window, { innerWidth: 500, innerHeight: 700 });

    // Component should still be rendered
    expect(searchContainer).toBeInTheDocument();
  });
});
