/**
 * useAuth Hook
 * Manages GitHub OAuth authentication and session management
 */

import { useEffect, useState } from "react";

export interface User {
  id: string;
  username: string;
  avatar: string;
  email?: string;
  profileUrl: string;
}

export interface AuthSession {
  user: User;
  token: string;
  expiresAt: string;
  createdAt: string;
}

interface UseAuthReturn {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (code: string) => Promise<void>;
  logout: () => void;
}

const SESSION_STORAGE_KEY = "github_auth_session";
const SESSION_EXPIRY_DAYS = 7;

/**
 * Hook for managing GitHub OAuth authentication
 * @returns Auth state and control functions
 */
export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const checkSession = () => {
      try {
        const stored = localStorage.getItem(SESSION_STORAGE_KEY);
        if (stored) {
          const session: AuthSession = JSON.parse(stored);
          const expiresAt = new Date(session.expiresAt);
          const now = new Date();

          if (now < expiresAt) {
            setUser(session.user);
          } else {
            // Session expired, clear it
            localStorage.removeItem(SESSION_STORAGE_KEY);
          }
        }
      } catch (error) {
        console.error("Failed to restore session:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();
  }, []);

  const login = async (_code: string) => {
    try {
      setIsLoading(true);

      // In a real application, this would exchange the OAuth code for a token
      // via a backend endpoint. For this educational demo, we'll simulate the flow.
      // Backend URL would be: POST /api/github/callback?code={code}

      // Simulated response (in production, call your backend)
      const userData: User = {
        id: `github-${Date.now()}`,
        username: "github-user",
        avatar: "https://api.github.com/users/github-user/avatar",
        email: "user@example.com",
        profileUrl: "https://github.com/github-user",
      };

      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + SESSION_EXPIRY_DAYS);

      const session: AuthSession = {
        user: userData,
        token: `token-${Date.now()}`,
        expiresAt: expiresAt.toISOString(),
        createdAt: new Date().toISOString(),
      };

      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
      setUser(userData);
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem(SESSION_STORAGE_KEY);
    setUser(null);
  };

  return {
    user,
    isAuthenticated: user !== null,
    isLoading,
    login,
    logout,
  };
}
