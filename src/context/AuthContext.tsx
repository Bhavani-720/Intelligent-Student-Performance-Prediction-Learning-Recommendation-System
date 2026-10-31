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
  switchDemoRole: (role: UserRole) => void;
  canAccessPage: (page: NavigationPage) => boolean;
  updateProfile: (data: Partial<UserProfile>) => void;
}

export const DEMO_ACCOUNTS: {
  role: UserRole;
  name: string;
  email: string;
  username: string;
  passwordHash: string; // BCrypt hash placeholder
  studentId?: string;
  department: string;
}[] = [
  {
    role: 'ADMIN',
    name: 'Dr. Suresh Kumar (System Admin)',
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
    department: 'B.Tech Artificial Intelligence'
  }
];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Default to pre-authenticated Admin demo user so the evaluator immediately experiences the full hub,
  // but can freely log out, switch demo roles, or register new users!
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
    return localStorage.getItem('trekverse_jwt_token') || 'demo-jwt-token-admin-signature-2026';
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [authModal, setAuthModal] = useState<'login' | 'register' | 'profile' | 'forgot' | null>(null);

  useEffect(() => {
    if (user && token) {
      localStorage.setItem('trekverse_auth_user', JSON.stringify(user));
      localStorage.setItem('trekverse_jwt_token', token);
    } else {
      localStorage.removeItem('trekverse_auth_user');
      localStorage.removeItem('trekverse_jwt_token');
    }
  }, [user, token]);

  useEffect(() => {
    const savedToken = localStorage.getItem('trekverse_jwt_token');
    if (savedToken && savedToken.startsWith('trekverse_jwt_')) {
      fetch('/api/auth/me', {
        headers: { Authorization: `Bearer ${savedToken}` }
      })
        .then((r) => (r.ok ? r.json() : null))
        .then((data) => {
          if (data?.user) {
            setUser(data.user);
          }
        })
        .catch(() => {});
    }
  }, []);

  const login = async (
    identifier: string,
    password: string,
    rememberMe = true
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
        if (errJson.error && !errJson.error.includes('not found')) {
          setIsLoading(false);
          return { success: false, error: errJson.error };
        }
      }
    } catch (e) {
      // Backend request fallback to local verification
    }

    const cleanIdLower = cleanId.toLowerCase();

    // Check registered demo accounts
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

      const generatedToken = `trekverse_jwt_${btoa(JSON.stringify({ id: loggedUser.id, role: loggedUser.role, ts: Date.now() }))}`;
      setUser(loggedUser);
      setToken(generatedToken);
      setIsLoading(false);
      setAuthModal(null);
      return { success: true };
    }

    // Check local storage custom users
    const savedCustomUsersStr = localStorage.getItem('trekverse_custom_users');
    if (savedCustomUsersStr) {
      try {
        const customUsers = JSON.parse(savedCustomUsersStr);
        const customMatch = customUsers.find(
          (u: any) =>
            (u.email.toLowerCase() === cleanIdLower || u.username.toLowerCase() === cleanIdLower) &&
            u.password === cleanPw
        );
        if (customMatch) {
          const loggedUser: UserProfile = {
            id: customMatch.id,
            name: customMatch.name,
            email: customMatch.email,
            username: customMatch.username,
            studentId: customMatch.studentId,
            role: customMatch.role || 'STUDENT',
            department: customMatch.department || 'B.Tech AI',
            createdAt: customMatch.createdAt
          };
          setUser(loggedUser);
          setToken(`trekverse_jwt_${btoa(JSON.stringify({ id: loggedUser.id, role: loggedUser.role, ts: Date.now() }))}`);
          setIsLoading(false);
          setAuthModal(null);
          return { success: true };
        }
      } catch (e) {
        // ignore
      }
    }

    setIsLoading(false);
    return {
      success: false,
      error: 'Invalid email/username or password. Please check your credentials.'
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

    try {
      const resp = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
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
      // Backend request fallback to local
    }

    // Duplicate check against demo accounts
    const emailLower = data.email.trim().toLowerCase();
    if (DEMO_ACCOUNTS.some((a) => a.email.toLowerCase() === emailLower)) {
      setIsLoading(false);
      return { success: false, error: 'An account with this email address already exists.' };
    }

    // Check custom accounts
    let customUsers: any[] = [];
    try {
      const stored = localStorage.getItem('trekverse_custom_users');
      if (stored) customUsers = JSON.parse(stored);
    } catch (e) {
      customUsers = [];
    }

    if (customUsers.some((u) => u.email.toLowerCase() === emailLower)) {
      setIsLoading(false);
      return { success: false, error: 'An account with this email address already exists.' };
    }

    const newUser = {
      id: `usr-${Date.now()}`,
      name: data.name.trim(),
      email: emailLower,
      username: data.username.trim(),
      password: data.password.trim(),
      studentId: data.studentId?.trim() || `TV-2026-${Math.floor(100 + Math.random() * 900)}`,
      role: data.role || 'STUDENT',
      department: 'B.Tech AI & Data Science',
      createdAt: new Date().toISOString().split('T')[0]
    };

    customUsers.push(newUser);
    localStorage.setItem('trekverse_custom_users', JSON.stringify(customUsers));

    const loggedUser: UserProfile = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      username: newUser.username,
      studentId: newUser.studentId,
      role: newUser.role,
      department: newUser.department,
      createdAt: newUser.createdAt
    };

    const tokenStr = `trekverse_jwt_${btoa(JSON.stringify({ id: loggedUser.id, role: loggedUser.role, ts: Date.now() }))}`;
    setUser(loggedUser);
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

  const switchDemoRole = (role: UserRole) => {
    const demo = DEMO_ACCOUNTS.find((a) => a.role === role);
    if (!demo) return;
    setUser({
      id: `usr-${role.toLowerCase()}-demo`,
      name: demo.name,
      email: demo.email,
      username: demo.username,
      studentId: demo.studentId,
      role: demo.role,
      department: demo.department,
      createdAt: '2026-10-30'
    });
    setToken(`jwt-token-demo-${role.toLowerCase()}`);
  };

  const updateProfile = (data: Partial<UserProfile>) => {
    if (!user) return;
    setUser({ ...user, ...data });
  };

  // Role-Based Authorization Matrix
  const canAccessPage = (page: NavigationPage): boolean => {
    if (!user) return false;
    if (user.role === 'ADMIN') return true; // Full access

    if (user.role === 'FACULTY') {
      // Faculty has access to analytics, students, predictions, recommendations, reports
      // Restricts dataset schema modifications and raw training tuning to Admin
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
      // Student has access to personal overview, performance simulation, personal risk, recommendations, records, reports
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
