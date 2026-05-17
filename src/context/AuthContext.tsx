import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from 'react';

import { setUnauthorizedHandler } from '@/api/axiosInstance';
import { Role } from '@/constants/roles';
import { tokenService } from '@/services/tokenService';

interface User {
  username: string;
  role: Role;
}

interface AuthContextValue {
  token: string | null;
  user: User | null;
  role: Role | null;
  isHydrating: boolean;
  login: (params: { token: string; user: User }) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isHydrating, setIsHydrating] = useState(true);

  useEffect(() => {
    const hydrateToken = async () => {
      const storedToken = await tokenService.getToken();
      setToken(storedToken);
      setIsHydrating(false);
    };

    void hydrateToken();
  }, []);

  const logout = useCallback(async () => {
    await tokenService.clearToken();
    setToken(null);
    setUser(null);
  }, []);

  const login = useCallback(async ({ token: nextToken, user: nextUser }: { token: string; user: User }) => {
    await tokenService.setToken(nextToken);
    setToken(nextToken);
    setUser(nextUser);
  }, []);

  useEffect(() => {
    setUnauthorizedHandler(() => {
      void logout();
    });

    return () => {
      setUnauthorizedHandler(null);
    };
  }, [logout]);

  const value = useMemo<AuthContextValue>(
    () => ({
      token,
      user,
      role: user?.role ?? null,
      isHydrating,
      login,
      logout,
    }),
    [isHydrating, login, logout, token, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
