import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserRole, UserProfile, NavigationPage } from '../types';

interface AuthContextType {
  user: UserProfile | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  authModal: 'login' | 'register' | 'profile' | 'forgot' | null;
  setAuthModal: (modal: 'login' | 'register' | 'profile' | 'forgot' | null) => void;
  login: (identifier: string, password: string, rememberMe?: boolean) => Promise<{ success: boolean; error?: string }>;
  register: (data: {
    name: string;
    email: string;
    username: string;
    password: string;
    studentId?: string;
    role?: UserRole;
  }) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  switchDemoRole: (role: UserRole) => Promise<void>;
  canAccessPage: (page: NavigationPage) => boolean;
  updateProfile: (data: Partial<UserProfile>) => void;
}

export const DEMO_ACCOUNTS: {
  role: UserRole;
  name: string;
  email: string;
  username: string;
  passwordHash: string; // Plain password for demo authentication
  studentId?: string;
  department: string;
}[] = [
  {
    role: 'ADMIN',
    name: 'Dr. Suresh Kumar (Lead Admin)',
    email: 'admin@trekverse.ai',
    username: 'admin',
    passwordHash: 'TrekverseAdmin@2026',
    department: 'Computer Science & AI'
  },
  {
    role: 'FACULTY',
    name: 'Prof. Ananya Sharma (Academic Advisor)',
    email: 'faculty@trekverse.ai',
    username: 'prof_sharma',
    passwordHash: 'FacultyLead#2026',
    department: 'Department of AI & Data Engineering'
  },
  {
    role: 'STUDENT',
    name: 'Aarav Sharma (Undergraduate)',
    email: 'aarav.sharma@trekverse.ai',
    username: 'aarav_student',
    studentId: 'TV-2024-001',
    passwordHash: 'StudentPass!2026',
    department: 'Artificial Intelligence & Data Science'
  }
];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('trekverse_auth_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // fallback
      }
    }
    return {
      id: 'usr-admin-01',
      name: 'Dr. Suresh Kumar (Lead Admin)',
      email: 'admin@trekverse.ai',
      username: 'admin',
      role: 'ADMIN',
      department: 'Computer Science & AI',
      createdAt: '2026-01-15'
    };
  });

  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('trekverse_jwt_token') || null;
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [authModal, setAuthModal] = useState<'login' | 'register' | 'profile' | 'forgot' | null>(null);

  // Sync state to local storage
  useEffect(() => {
    if (user && token) {
      localStorage.setItem('trekverse_auth_user', JSON.stringify(user));
      localStorage.setItem('trekverse_jwt_token', token);
    } else {
      localStorage.removeItem('trekverse_auth_user');
      localStorage.removeItem('trekverse_jwt_token');
    }
  }, [user, token]);

  // Verify signed token on mount with backend /api/auth/me
  useEffect(() => {
    const savedToken = localStorage.getItem('trekverse_jwt_token');
    if (savedToken) {
      fetch('/api/auth/me', {
        headers: { Authorization: `Bearer ${savedToken}` }
      })
        .then((r) => (r.ok ? r.json() : null))
        .then((data) => {
          if (data?.user) {
            setUser(data.user);
          } else {
            // Token expired or server restarted: re-authenticate with default Admin credentials
            login('admin', 'TrekverseAdmin@2026');
          }
        })
        .catch(() => {
          login('admin', 'TrekverseAdmin@2026');
        });
    } else {
      // First boot: log in with Admin demo credentials to provision a genuine signed JWT
      login('admin', 'TrekverseAdmin@2026');
    }
  }, []);

  const login = async (
    identifier: string,
    password: string,
    _rememberMe = true
  ): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);

    const cleanId = identifier.trim();
    const cleanPw = password.trim();

    try {
      const resp = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: cleanId, password: cleanPw })
      });
      if (resp.ok) {
        const data = await resp.json();
        setUser(data.user);
        setToken(data.token);
        setIsLoading(false);
        setAuthModal(null);
        return { success: true };
      } else {
        const errJson = await resp.json().catch(() => ({}));
        if (errJson.error) {
          setIsLoading(false);
          return { success: false, error: errJson.error };
        }
      }
    } catch (e) {
      // Backend unavailable fallback
    }

    const cleanIdLower = cleanId.toLowerCase();

    // Check demo accounts fallback
    const matched = DEMO_ACCOUNTS.find(
      (acc) =>
        (acc.email.toLowerCase() === cleanIdLower || acc.username.toLowerCase() === cleanIdLower) &&
        acc.passwordHash === cleanPw
    );

    if (matched) {
      const loggedUser: UserProfile = {
        id: `usr-${matched.role.toLowerCase()}-${Date.now()}`,
        name: matched.name,
        email: matched.email,
        username: matched.username,
        studentId: matched.studentId,
        role: matched.role,
        department: matched.department,
        createdAt: '2026-10-30'
      };

      const generatedToken = `jwt-token-${matched.role.toLowerCase()}-${Date.now()}`;
      setUser(loggedUser);
      setToken(generatedToken);
      setIsLoading(false);
      setAuthModal(null);
      return { success: true };
    }

    setIsLoading(false);
    return {
      success: false,
      error: 'Invalid email/username or password. Please verify your credentials.'
    };
  };

  const register = async (data: {
    name: string;
    email: string;
    username: string;
    password: string;
    studentId?: string;
    role?: UserRole;
  }): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);

    // Enforce security rule: Public registration CANNOT choose ADMIN or FACULTY
    if (data.role && data.role !== 'STUDENT') {
      setIsLoading(false);
      return {
        success: false,
        error: 'Privileged role registration forbidden. Administrator and Faculty accounts are provisioned internally.'
      };
    }

    try {
      const resp = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          role: 'STUDENT'
        })
      });
      if (resp.ok) {
        const result = await resp.json();
        setUser(result.user);
        setToken(result.token);
        setIsLoading(false);
        setAuthModal(null);
        return { success: true };
      } else {
        const errorData = await resp.json().catch(() => ({}));
        if (errorData.error) {
          setIsLoading(false);
          return { success: false, error: errorData.error };
        }
      }
    } catch (e) {
      // Backend fallback
    }

    const emailLower = data.email.trim().toLowerCase();
    if (DEMO_ACCOUNTS.some((a) => a.email.toLowerCase() === emailLower)) {
      setIsLoading(false);
      return { success: false, error: 'An account with this email address already exists.' };
    }

    const newUser: UserProfile = {
      id: `usr-student-${Date.now()}`,
      name: data.name.trim(),
      email: emailLower,
      username: data.username.trim(),
      studentId: data.studentId?.trim() || `TV-2026-${Math.floor(100 + Math.random() * 900)}`,
      role: 'STUDENT',
      department: 'Artificial Intelligence & Data Science',
      createdAt: new Date().toISOString().split('T')[0]
    };

    const tokenStr = `jwt-token-student-${Date.now()}`;
    setUser(newUser);
    setToken(tokenStr);
    setIsLoading(false);
    setAuthModal(null);
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('trekverse_auth_user');
    localStorage.removeItem('trekverse_jwt_token');
  };

  const switchDemoRole = async (role: UserRole) => {
    const demo = DEMO_ACCOUNTS.find((a) => a.role === role);
    if (!demo) return;
    await login(demo.username, demo.passwordHash);
  };

  const updateProfile = (data: Partial<UserProfile>) => {
    if (!user) return;
    setUser({ ...user, ...data });
  };

  // Role-Based Authorization Matrix
  const canAccessPage = (page: NavigationPage): boolean => {
    if (!user) return false;
    if (user.role === 'ADMIN') return true; // Full access across all 13 modules

    if (user.role === 'FACULTY') {
      // Faculty has access to 12 modules (overview, EDA, training, evaluation, prediction, risk, clustering, XAI, recommendations, records, reports, testing)
      // Excludes dataset schema modification which is reserved for Admin
      const facultyPages: NavigationPage[] = [
        'overview',
        'eda',
        'training',
        'evaluation',
        'prediction',
        'risk',
        'clustering',
        'xai',
        'recommendations',
        'records',
        'reports',
        'testing'
      ];
      return facultyPages.includes(page);
    }

    if (user.role === 'STUDENT') {
      // Student has access to personal performance, simulations, risk, recommendations, personal record, and reports
      const studentPages: NavigationPage[] = [
        'overview',
        'prediction',
        'risk',
        'recommendations',
        'records',
        'reports',
        'testing'
      ];
      return studentPages.includes(page);
    }

    return false;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user && !!token,
        isLoading,
        authModal,
        setAuthModal,
        login,
        register,
        logout,
        switchDemoRole,
        canAccessPage,
        updateProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
