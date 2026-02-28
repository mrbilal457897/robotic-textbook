/**
 * useAuth Hook
 * Manages GitHub OAuth authentication and session management
 * Works with backend session cookies from OAuth flow
 */

import { useEffect, useState } from 'react';
import { getApiUrl, API_ENDPOINTS } from '../config/api';

export interface User {
  id: string;
  username: string;
  avatar: string;
  email?: string;
  provider?: string;
}

interface UseAuthReturn {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  logout: () => Promise<void>;
}

/**
 * Hook for managing GitHub OAuth authentication
 * @returns Auth state and control functions
 */
export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch(getApiUrl(API_ENDPOINTS.auth.me), {
          credentials: 'include', // Include cookies in request
        });

        if (response.ok) {
          const userData = await response.json();
          setUser({
            id: userData.id,
            username: userData.username || 'GitHub User',
            avatar: userData.avatar || 'https://github.com/identicons/default.png',
            email: userData.email,
            provider: userData.provider,
          });
        } else {
          // Not authenticated
          setUser(null);
        }
      } catch (error) {
        console.error('Failed to check session:', error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();
  }, []);

  const logout = async () => {
    try {
      await fetch(getApiUrl(API_ENDPOINTS.auth.logout), {
        method: 'POST',
        credentials: 'include',
      });
      setUser(null);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return {
    user,
    isAuthenticated: user !== null,
    isLoading,
    logout,
  };
}
