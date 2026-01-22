/**
 * Tests for UserProfile Component
 * Testing user profile dropdown, logout, and click-outside behavior
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { UserProfile } from './UserProfile';
import { User } from '@hooks/useAuth';

const mockUser: User = {
  id: 'user-123',
  username: 'testuser',
  avatar: 'https://example.com/avatar.jpg',
  email: 'test@example.com',
  profileUrl: 'https://github.com/testuser',
};

describe('UserProfile', () => {
  const mockOnLogout = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render user avatar', () => {
      render(<UserProfile user={mockUser} onLogout={mockOnLogout} />);

      const avatar = screen.getByAltText("testuser's avatar");
      expect(avatar).toBeInTheDocument();
      expect(avatar).toHaveAttribute('src', mockUser.avatar);
    });

    it('should render profile button with proper aria attributes', () => {
      render(<UserProfile user={mockUser} onLogout={mockOnLogout} />);

      const button = screen.getByRole('button', {
        name: `User menu for ${mockUser.username}`,
      });
      expect(button).toBeInTheDocument();
      expect(button).toHaveAttribute('aria-expanded', 'false');
      expect(button).toHaveAttribute('aria-haspopup', 'true');
    });

    it('should not render dropdown initially', () => {
      render(<UserProfile user={mockUser} onLogout={mockOnLogout} />);

      const dropdown = screen.queryByRole('menu');
      expect(dropdown).not.toBeInTheDocument();
    });
  });

  describe('Dropdown Toggle', () => {
    it('should open dropdown when avatar is clicked', () => {
      render(<UserProfile user={mockUser} onLogout={mockOnLogout} />);

      const button = screen.getByRole('button');
      fireEvent.click(button);

      const dropdown = screen.getByRole('menu', { name: 'User menu' });
      expect(dropdown).toBeInTheDocument();
    });

    it('should update aria-expanded when dropdown opens', () => {
      render(<UserProfile user={mockUser} onLogout={mockOnLogout} />);

      const button = screen.getByRole('button');
      fireEvent.click(button);

      expect(button).toHaveAttribute('aria-expanded', 'true');
    });

    it('should close dropdown when avatar is clicked again', () => {
      render(<UserProfile user={mockUser} onLogout={mockOnLogout} />);

      const button = screen.getByRole('button');

      // Open dropdown
      fireEvent.click(button);
      expect(screen.getByRole('menu')).toBeInTheDocument();

      // Close dropdown
      fireEvent.click(button);
      expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    });
  });

  describe('Dropdown Content', () => {
    it('should display username in dropdown', () => {
      render(<UserProfile user={mockUser} onLogout={mockOnLogout} />);

      const button = screen.getByRole('button');
      fireEvent.click(button);

      expect(screen.getByText(mockUser.username)).toBeInTheDocument();
    });

    it('should display email if provided', () => {
      render(<UserProfile user={mockUser} onLogout={mockOnLogout} />);

      const button = screen.getByRole('button');
      fireEvent.click(button);

      expect(screen.getByText(mockUser.email!)).toBeInTheDocument();
    });

    it('should not display email if not provided', () => {
      const userWithoutEmail = { ...mockUser, email: undefined };
      render(<UserProfile user={userWithoutEmail} onLogout={mockOnLogout} />);

      const button = screen.getByRole('button');
      fireEvent.click(button);

      expect(screen.queryByText(/test@example.com/)).not.toBeInTheDocument();
    });

    it('should render GitHub profile link', () => {
      render(<UserProfile user={mockUser} onLogout={mockOnLogout} />);

      const button = screen.getByRole('button');
      fireEvent.click(button);

      const profileLink = screen.getByRole('menuitem', {
        name: /view github profile/i,
      });
      expect(profileLink).toBeInTheDocument();
      expect(profileLink).toHaveAttribute('href', mockUser.profileUrl);
      expect(profileLink).toHaveAttribute('target', '_blank');
      expect(profileLink).toHaveAttribute('rel', 'noopener noreferrer');
    });

    it('should render logout button', () => {
      render(<UserProfile user={mockUser} onLogout={mockOnLogout} />);

      const button = screen.getByRole('button');
      fireEvent.click(button);

      const logoutButton = screen.getByRole('menuitem', { name: /logout/i });
      expect(logoutButton).toBeInTheDocument();
    });
  });

  describe('Logout Functionality', () => {
    it('should call onLogout when logout button is clicked', () => {
      render(<UserProfile user={mockUser} onLogout={mockOnLogout} />);

      const button = screen.getByRole('button');
      fireEvent.click(button);

      const logoutButton = screen.getByRole('menuitem', { name: /logout/i });
      fireEvent.click(logoutButton);

      expect(mockOnLogout).toHaveBeenCalledTimes(1);
    });

    it('should close dropdown after logout', () => {
      render(<UserProfile user={mockUser} onLogout={mockOnLogout} />);

      const button = screen.getByRole('button');
      fireEvent.click(button);

      const logoutButton = screen.getByRole('menuitem', { name: /logout/i });
      fireEvent.click(logoutButton);

      expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    });
  });

  describe('Click Outside Behavior', () => {
    it('should close dropdown when clicking outside', async () => {
      render(
        <div>
          <div data-testid="outside-element">Outside</div>
          <UserProfile user={mockUser} onLogout={mockOnLogout} />
        </div>
      );

      const button = screen.getByRole('button');
      fireEvent.click(button);

      expect(screen.getByRole('menu')).toBeInTheDocument();

      const outsideElement = screen.getByTestId('outside-element');
      fireEvent.mouseDown(outsideElement);

      await waitFor(() => {
        expect(screen.queryByRole('menu')).not.toBeInTheDocument();
      });
    });

    it('should not close dropdown when clicking inside', () => {
      render(<UserProfile user={mockUser} onLogout={mockOnLogout} />);

      const button = screen.getByRole('button');
      fireEvent.click(button);

      const dropdown = screen.getByRole('menu');
      fireEvent.mouseDown(dropdown);

      expect(screen.getByRole('menu')).toBeInTheDocument();
    });

    it('should remove event listener when dropdown closes', () => {
      const removeEventListenerSpy = jest.spyOn(document, 'removeEventListener');

      const { unmount } = render(
        <UserProfile user={mockUser} onLogout={mockOnLogout} />
      );

      const button = screen.getByRole('button');
      fireEvent.click(button);

      unmount();

      expect(removeEventListenerSpy).toHaveBeenCalledWith(
        'mousedown',
        expect.any(Function)
      );

      removeEventListenerSpy.mockRestore();
    });
  });

  describe('Accessibility', () => {
    it('should have proper menu role for dropdown', () => {
      render(<UserProfile user={mockUser} onLogout={mockOnLogout} />);

      const button = screen.getByRole('button');
      fireEvent.click(button);

      const dropdown = screen.getByRole('menu');
      expect(dropdown).toHaveAttribute('aria-label', 'User menu');
    });

    it('should have menuitem roles for dropdown items', () => {
      render(<UserProfile user={mockUser} onLogout={mockOnLogout} />);

      const button = screen.getByRole('button');
      fireEvent.click(button);

      const menuItems = screen.getAllByRole('menuitem');
      expect(menuItems).toHaveLength(2); // Profile link + Logout button
    });
  });

  describe('Component Styling', () => {
    it('should apply userProfile CSS class', () => {
      const { container } = render(
        <UserProfile user={mockUser} onLogout={mockOnLogout} />
      );

      const profileDiv = container.querySelector('.userProfile');
      expect(profileDiv).toBeInTheDocument();
    });

    it('should apply profileButton CSS class to button', () => {
      const { container } = render(
        <UserProfile user={mockUser} onLogout={mockOnLogout} />
      );

      const button = container.querySelector('.profileButton');
      expect(button).toBeInTheDocument();
    });

    it('should apply profileDropdown CSS class when open', () => {
      const { container } = render(
        <UserProfile user={mockUser} onLogout={mockOnLogout} />
      );

      const button = screen.getByRole('button');
      fireEvent.click(button);

      const dropdown = container.querySelector('.profileDropdown');
      expect(dropdown).toBeInTheDocument();
    });
  });
});
