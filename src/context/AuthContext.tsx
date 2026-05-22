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

interface JwtPayload {
  role?: string;
  userName?: string;
  sub?: string;
}

const decodeBase64Url = (value: string) => {
  const normalizedValue = value.replace(/-/g, '+').replace(/_/g, '/');
  const paddedValue = normalizedValue.padEnd(
    normalizedValue.length + ((4 - (normalizedValue.length % 4)) % 4),
    '=',
  );

  if (typeof globalThis.atob === 'function') {
    return globalThis.atob(paddedValue);
  }

  if (typeof Buffer !== 'undefined') {
    return Buffer.from(paddedValue, 'base64').toString('utf8');
  }

  throw new Error('Unable to decode auth token');
};

const mapRole = (role?: string): Role | null => {
  switch (role) {
    case 'ROLE_PATIENT':
      return Role.PATIENT;
    case 'ROLE_DOCTOR':
      return Role.DOCTOR;
    case 'ROLE_RECEPTIONIST':
      return Role.RECEPTIONIST;
    case 'ROLE_ADMIN':
      return Role.ADMIN;
    default:
      return null;
  }
};

const parseUserFromToken = (token: string): User | null => {
  try {
    const payloadSegment = token.split('.')[1];

    if (!payloadSegment) {
      return null;
    }

    const payload = JSON.parse(decodeBase64Url(payloadSegment)) as JwtPayload;
    const role = mapRole(payload.role);
    const username = payload.userName ?? payload.sub;

    if (!role || !username) {
      return null;
    }

    return { username, role };
  } catch {
    return null;
  }
};

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
      setUser(storedToken ? parseUserFromToken(storedToken) : null);
      setIsHydrating(false);
    };

    void hydrateToken();
  }, []);

  const logout = useCallback(async () => {
    await tokenService.clearToken();
    setToken(null);
    setUser(null);
  }, []);

  const login = useCallback(
    async ({ token: nextToken, user: nextUser }: { token: string; user: User }) => {
      await tokenService.setToken(nextToken);
      setToken(nextToken);
      setUser(nextUser);
    },
    [],
  );

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
