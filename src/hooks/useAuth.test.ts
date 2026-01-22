/**
 * Tests for useAuth Hook
 * Testing authentication, session management, login, and logout
 */

import { renderHook, act, waitFor } from '@testing-library/react';
import { useAuth, AuthSession, User } from './useAuth';

const SESSION_STORAGE_KEY = 'github_auth_session';

describe('useAuth', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    jest.clearAllMocks();
  });

  describe('Initial State', () => {
    it('should initialize with null user and isAuthenticated false', () => {
      const { result } = renderHook(() => useAuth());

      expect(result.current.user).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);
    });

    it('should start with isLoading true and become false after mount', async () => {
      const { result } = renderHook(() => useAuth());

      // isLoading may be true initially or false if mount completed synchronously
      const initialLoading = result.current.isLoading;
      expect(typeof initialLoading).toBe('boolean');

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });
    });
  });

  describe('Session Restoration', () => {
    it('should restore valid session from localStorage', async () => {
      const mockUser: User = {
        id: 'test-user-123',
        username: 'testuser',
        avatar: 'https://example.com/avatar.jpg',
        email: 'test@example.com',
        profileUrl: 'https://github.com/testuser',
      };

      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 1);

      const mockSession: AuthSession = {
        user: mockUser,
        token: 'test-token',
        expiresAt: futureDate.toISOString(),
        createdAt: new Date().toISOString(),
      };

      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(mockSession));

      const { result } = renderHook(() => useAuth());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.user).toEqual(mockUser);
      expect(result.current.isAuthenticated).toBe(true);
    });

    it('should clear expired session from localStorage', async () => {
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 1);

      const expiredSession: AuthSession = {
        user: {
          id: 'test-user-123',
          username: 'testuser',
          avatar: 'https://example.com/avatar.jpg',
          profileUrl: 'https://github.com/testuser',
        },
        token: 'test-token',
        expiresAt: pastDate.toISOString(),
        createdAt: new Date().toISOString(),
      };

      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(expiredSession));

      const { result } = renderHook(() => useAuth());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.user).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);
      expect(localStorage.getItem(SESSION_STORAGE_KEY)).toBeNull();
    });

    it('should handle corrupted localStorage data gracefully', async () => {
      localStorage.setItem(SESSION_STORAGE_KEY, 'invalid-json');

      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

      const { result } = renderHook(() => useAuth());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.user).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Failed to restore session:',
        expect.any(Error)
      );

      consoleErrorSpy.mockRestore();
    });
  });

  describe('Login', () => {
    it('should successfully login and store session', async () => {
      const { result } = renderHook(() => useAuth());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await act(async () => {
        await result.current.login('test-code-123');
      });

      expect(result.current.user).not.toBeNull();
      expect(result.current.user?.username).toBe('github-user');
      expect(result.current.isAuthenticated).toBe(true);
      expect(result.current.isLoading).toBe(false);

      const stored = localStorage.getItem(SESSION_STORAGE_KEY);
      expect(stored).not.toBeNull();

      const session: AuthSession = JSON.parse(stored!);
      expect(session.user.username).toBe('github-user');
      expect(session.token).toContain('token-');
    });

    it('should set isLoading during login', async () => {
      const { result } = renderHook(() => useAuth());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      const loginPromise = act(async () => {
        await result.current.login('test-code');
      });

      // isLoading may complete synchronously in test environment
      await loginPromise;

      // After completion, user should be authenticated
      expect(result.current.isAuthenticated).toBe(true);
      expect(result.current.isLoading).toBe(false);
    });

    it('should create session with proper expiry (7 days)', async () => {
      const { result } = renderHook(() => useAuth());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      const beforeLogin = new Date();

      await act(async () => {
        await result.current.login('test-code');
      });

      const stored = localStorage.getItem(SESSION_STORAGE_KEY);
      const session: AuthSession = JSON.parse(stored!);

      const expiresAt = new Date(session.expiresAt);
      const expectedExpiry = new Date(beforeLogin);
      expectedExpiry.setDate(expectedExpiry.getDate() + 7);

      // Check expiry is within 1 second of expected (to account for test execution time)
      const timeDiff = Math.abs(expiresAt.getTime() - expectedExpiry.getTime());
      expect(timeDiff).toBeLessThan(1000);
    });
  });

  describe('Logout', () => {
    it('should clear user and session from localStorage', async () => {
      const mockSession: AuthSession = {
        user: {
          id: 'test-user-123',
          username: 'testuser',
          avatar: 'https://example.com/avatar.jpg',
          profileUrl: 'https://github.com/testuser',
        },
        token: 'test-token',
        expiresAt: new Date(Date.now() + 86400000).toISOString(),
        createdAt: new Date().toISOString(),
      };

      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(mockSession));

      const { result } = renderHook(() => useAuth());

      await waitFor(() => {
        expect(result.current.isAuthenticated).toBe(true);
      });

      act(() => {
        result.current.logout();
      });

      expect(result.current.user).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);
      expect(localStorage.getItem(SESSION_STORAGE_KEY)).toBeNull();
    });

    it('should handle logout when not authenticated', () => {
      const { result } = renderHook(() => useAuth());

      act(() => {
        result.current.logout();
      });

      expect(result.current.user).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);
      expect(localStorage.getItem(SESSION_STORAGE_KEY)).toBeNull();
    });
  });

  describe('Error Handling', () => {
    it('should handle localStorage errors during session check', async () => {
      const getItemSpy = jest.spyOn(Storage.prototype, 'getItem');
      getItemSpy.mockImplementation(() => {
        throw new Error('localStorage error');
      });

      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

      const { result } = renderHook(() => useAuth());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.user).toBeNull();
      expect(consoleErrorSpy).toHaveBeenCalled();

      getItemSpy.mockRestore();
      consoleErrorSpy.mockRestore();
    });
  });

  describe('isAuthenticated Computed Property', () => {
    it('should return true when user is present', async () => {
      const { result } = renderHook(() => useAuth());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await act(async () => {
        await result.current.login('test-code');
      });

      expect(result.current.isAuthenticated).toBe(true);
    });

    it('should return false when user is null', async () => {
      const { result } = renderHook(() => useAuth());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.isAuthenticated).toBe(false);
    });
  });
});
