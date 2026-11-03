import React, { useState } from 'react';
import {
  X,
  Lock,
  Mail,
  User,
  Eye,
  EyeOff,
  Shield,
  KeyRound,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowRight,
  LogOut,
  GraduationCap
} from 'lucide-react';
import { useAuth, DEMO_ACCOUNTS } from '../../context/AuthContext';
import { UserRole } from '../../types';

export const AuthModals: React.FC = () => {
  const {
    user,
    authModal,
    setAuthModal,
    login,
    register,
    logout,
    switchDemoRole,
    updateProfile
  } = useAuth();

  // Login form state
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loginLoading, setLoginLoading] = useState(false);

  // Register form state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regUsername, setRegUsername] = useState('');
  const [regStudentId, setRegStudentId] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [regRole, setRegRole] = useState<UserRole>('STUDENT');
  const [regError, setRegError] = useState<string | null>(null);
  const [regLoading, setRegLoading] = useState(false);

  // Profile modal state
  const [editName, setEditName] = useState(user?.name || '');
  const [editDept, setEditDept] = useState(user?.department || '');
  const [profileSaved, setProfileSaved] = useState(false);

  // Forgot password state
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSent, setForgotSent] = useState(false);

  if (!authModal) return null;

  // Password strength check
  const getPasswordStrength = (pw: string) => {
    if (!pw) return 0;
    let score = 0;
    if (pw.length >= 8) score += 25;
    if (/[A-Z]/.test(pw)) score += 25;
    if (/[0-9]/.test(pw)) score += 25;
    if (/[^A-Za-z0-9]/.test(pw)) score += 25;
    return score;
  };

  const strength = getPasswordStrength(regPassword);
  const strengthLabel = strength >= 100 ? 'Strong' : strength >= 75 ? 'Good' : strength >= 50 ? 'Moderate' : 'Weak';
  const strengthColor = strength >= 75 ? 'bg-emerald-500' : strength >= 50 ? 'bg-amber-500' : 'bg-rose-500';

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    if (!loginIdentifier.trim() || !loginPassword.trim()) {
      setLoginError('Please enter both email/username and password.');
      return;
    }
    setLoginLoading(true);
    const res = await login(loginIdentifier, loginPassword, rememberMe);
    setLoginLoading(false);
    if (!res.success) {
      setLoginError(res.error || 'Authentication failed.');
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegError(null);

    if (!regName.trim() || !regEmail.trim() || !regUsername.trim() || !regPassword.trim()) {
      setRegError('All fields are required.');
      return;
    }

    if (regPassword !== regConfirmPassword) {
      setRegError('Passwords do not match.');
      return;
    }

    if (regPassword.length < 8) {
      setRegError('Password must contain at least 8 characters.');
      return;
    }

    setRegLoading(true);
    const res = await register({
      name: regName,
      email: regEmail,
      username: regUsername,
      password: regPassword,
      studentId: regStudentId,
      role: regRole
    });
    setRegLoading(false);

    if (!res.success) {
      setRegError(res.error || 'Registration failed.');
    }
  };

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({ name: editName, department: editDept });
    setProfileSaved(true);
    setTimeout(() => {
      setProfileSaved(false);
      setAuthModal(null);
    }, 800);
  };

  const handleQuickDemoLogin = async (demo: typeof DEMO_ACCOUNTS[0]) => {
    setLoginIdentifier(demo.email);
    setLoginPassword(demo.passwordHash);
    setLoginLoading(true);
    await login(demo.email, demo.passwordHash, true);
    setLoginLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      {/* 1. LOGIN MODAL */}
      {authModal === 'login' && (
        <div className="bg-[#21123B] border border-purple-800/70 rounded-2xl max-w-md w-full p-6 shadow-2xl shadow-purple-950/80 relative animate-in fade-in zoom-in-95 duration-200">
          <button
            onClick={() => setAuthModal(null)}
            className="absolute top-4 right-4 text-[#C4B5FD] hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#6D28D9] to-[#D946EF] text-white flex items-center justify-center shadow-md shadow-purple-900/40">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#F5F3FF]">
                Sign in to Trekverse AI
              </h3>
              <p className="text-xs text-[#B8A9D1]">Student Academic Intelligence Hub</p>
            </div>
          </div>

          {/* Quick Demo Role Switcher Pill Header */}
          <div className="mb-4 p-3 rounded-xl bg-[#190D30]/80 border border-purple-800/50">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#C4B5FD] font-bold block mb-2">
              Instant Demo Logins (Click to autofill & authenticate):
            </span>
            <div className="grid grid-cols-3 gap-1.5">
              {DEMO_ACCOUNTS.map((d) => (
                <button
                  key={d.role}
                  type="button"
                  onClick={() => handleQuickDemoLogin(d)}
                  className="px-2 py-1.5 rounded-lg border border-purple-800/60 bg-[#2D1452]/70 hover:border-[#D946EF] text-[11px] font-mono text-[#F5F3FF] truncate font-semibold transition-all cursor-pointer shadow-sm"
                  title={`Log in as ${d.role} (${d.email})`}
                >
                  {d.role}
                </button>
              ))}
            </div>
          </div>

          {loginError && (
            <div className="mb-4 p-3 rounded-lg bg-rose-950/40 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-[#C4B5FD] mb-1">
                Email Address or Username
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#A855F7] absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="admin@trekverse.edu or admin"
                  value={loginIdentifier}
                  onChange={(e) => setLoginIdentifier(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-purple-800/60 bg-[#190D30] text-[#F5F3FF] placeholder-purple-400/40 focus:outline-none focus:ring-1 focus:ring-[#8B5CF6] focus:border-[#A855F7]"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="font-semibold text-[#C4B5FD]">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setAuthModal('forgot')}
                  className="text-[11px] text-[#A855F7] hover:text-[#D946EF] underline cursor-pointer"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#A855F7] absolute left-3 top-2.5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••••••"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full pl-9 pr-9 py-2 rounded-xl border border-purple-800/60 bg-[#190D30] text-[#F5F3FF] placeholder-purple-400/40 focus:outline-none focus:ring-1 focus:ring-[#8B5CF6] focus:border-[#A855F7]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-[#C4B5FD] hover:text-white cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-[#B8A9D1]">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 accent-[#8B5CF6] rounded"
                />
                <span>Remember me on this browser</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={loginLoading}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#6D28D9] via-[#8B5CF6] to-[#D946EF] hover:from-[#7C3AED] hover:to-[#E879F9] disabled:opacity-50 text-white font-bold transition-all shadow-lg shadow-purple-900/40 cursor-pointer"
            >
              {loginLoading ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-4 pt-4 border-t border-purple-900/50 text-center text-xs text-[#B8A9D1]">
            Don't have an account?{' '}
            <button
              onClick={() => setAuthModal('register')}
              className="text-[#A855F7] font-bold hover:text-[#D946EF] hover:underline cursor-pointer"
            >
              Register New Account
            </button>
          </div>
        </div>
      )}

      {/* 2. REGISTRATION MODAL */}
      {authModal === 'register' && (
        <div className="bg-[#21123B] border border-purple-800/70 rounded-2xl max-w-md w-full p-6 shadow-2xl shadow-purple-950/80 relative animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
          <button
            onClick={() => setAuthModal(null)}
            className="absolute top-4 right-4 text-[#C4B5FD] hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#6D28D9] to-[#D946EF] text-white flex items-center justify-center shadow-md shadow-purple-900/40">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#F5F3FF]">
                Create Trekverse Account
              </h3>
              <p className="text-xs text-[#B8A9D1]">Register as Student, Faculty, or Admin</p>
            </div>
          </div>

          {regError && (
            <div className="mb-4 p-3 rounded-lg bg-rose-950/40 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{regError}</span>
            </div>
          )}

          <form onSubmit={handleRegisterSubmit} className="space-y-3 text-xs">
            <div>
              <label className="block font-semibold text-[#C4B5FD] mb-1">
                Account Type
              </label>
              <div className="p-2.5 rounded-xl border border-purple-800/60 bg-[#190D30] flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-[#D946EF] uppercase tracking-wider">
                  STUDENT PORTAL ACCESS
                </span>
                <span className="text-[10px] text-[#B8A9D1]/70 font-sans">
                  (Admin provisioned internally)
                </span>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-[#C4B5FD] mb-1">
                Full Name
              </label>
              <input
                type="text"
                placeholder="e.g. John Doe"
                value={regName}
                onChange={(e) => setRegName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-purple-800/60 bg-[#190D30] text-[#F5F3FF] placeholder-purple-400/40 focus:outline-none focus:ring-1 focus:ring-[#8B5CF6] focus:border-[#A855F7]"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block font-semibold text-[#C4B5FD] mb-1">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="user@trekverse.edu"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-purple-800/60 bg-[#190D30] text-[#F5F3FF] placeholder-purple-400/40 focus:outline-none focus:ring-1 focus:ring-[#8B5CF6] focus:border-[#A855F7]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#C4B5FD] mb-1">
                  Username
                </label>
                <input
                  type="text"
                  placeholder="johndoe"
                  value={regUsername}
                  onChange={(e) => setRegUsername(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-purple-800/60 bg-[#190D30] text-[#F5F3FF] placeholder-purple-400/40 focus:outline-none focus:ring-1 focus:ring-[#8B5CF6] focus:border-[#A855F7]"
                />
              </div>
            </div>

            {regRole === 'STUDENT' && (
              <div>
                <label className="block font-semibold text-[#C4B5FD] mb-1">
                  Student ID Number
                </label>
                <input
                  type="text"
                  placeholder="TV-2024-001"
                  value={regStudentId}
                  onChange={(e) => setRegStudentId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-purple-800/60 bg-[#190D30] text-[#F5F3FF] placeholder-purple-400/40 focus:outline-none focus:ring-1 focus:ring-[#8B5CF6] focus:border-[#A855F7] font-mono"
                />
              </div>
            )}

            <div>
              <label className="block font-semibold text-[#C4B5FD] mb-1">
                Password
              </label>
              <input
                type="password"
                placeholder="At least 8 characters"
                value={regPassword}
                onChange={(e) => setRegPassword(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-purple-800/60 bg-[#190D30] text-[#F5F3FF] placeholder-purple-400/40 focus:outline-none focus:ring-1 focus:ring-[#8B5CF6] focus:border-[#A855F7]"
              />

              {regPassword && (
                <div className="mt-1.5 space-y-1">
                  <div className="flex justify-between text-[10px] text-[#B8A9D1]">
                    <span>Password Strength:</span>
                    <span className="font-semibold text-[#C4B5FD]">{strengthLabel}</span>
                  </div>
                  <div className="w-full bg-[#190D30] h-1.5 rounded-full overflow-hidden">
                    <div className={`h-full ${strengthColor} transition-all`} style={{ width: `${strength}%` }} />
                  </div>
                </div>
              )}
            </div>

            <div>
              <label className="block font-semibold text-[#C4B5FD] mb-1">
                Confirm Password
              </label>
              <input
                type="password"
                placeholder="Repeat password"
                value={regConfirmPassword}
                onChange={(e) => setRegConfirmPassword(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-purple-800/60 bg-[#190D30] text-[#F5F3FF] placeholder-purple-400/40 focus:outline-none focus:ring-1 focus:ring-[#8B5CF6] focus:border-[#A855F7]"
              />
            </div>

            <button
              type="submit"
              disabled={regLoading}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#6D28D9] via-[#8B5CF6] to-[#D946EF] hover:from-[#7C3AED] hover:to-[#E879F9] disabled:opacity-50 text-white font-bold transition-all shadow-lg shadow-purple-900/40 cursor-pointer mt-2"
            >
              {regLoading ? 'Creating Account...' : 'Complete Registration'}
            </button>
          </form>

          <div className="mt-4 pt-4 border-t border-purple-900/50 text-center text-xs text-[#B8A9D1]">
            Already have an account?{' '}
            <button
              onClick={() => setAuthModal('login')}
              className="text-[#A855F7] font-bold hover:text-[#D946EF] hover:underline cursor-pointer"
            >
              Sign In
            </button>
          </div>
        </div>
      )}

      {/* 3. PROFILE MODAL */}
      {authModal === 'profile' && user && (
        <div className="bg-[#21123B] border border-purple-800/70 rounded-2xl max-w-md w-full p-6 shadow-2xl shadow-purple-950/80 relative animate-in fade-in zoom-in-95 duration-200">
          <button
            onClick={() => setAuthModal(null)}
            className="absolute top-4 right-4 text-[#C4B5FD] hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#6D28D9] via-[#8B5CF6] to-[#D946EF] text-white flex items-center justify-center font-bold text-lg font-mono shadow-md shadow-purple-900/40">
              {user.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-[#F5F3FF]">
                  {user.name}
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#D946EF]/20 text-[#D946EF] border border-[#D946EF]/40">
                  {user.role}
                </span>
              </div>
              <p className="text-xs text-[#C4B5FD] font-mono">{user.email}</p>
            </div>
          </div>

          {profileSaved && (
            <div className="mb-4 p-2.5 rounded-lg bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>Profile updated successfully!</span>
            </div>
          )}

          <form onSubmit={handleProfileSave} className="space-y-3 text-xs">
            <div>
              <label className="block text-[#C4B5FD] mb-1">Display Name</label>
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-purple-800/60 bg-[#190D30] text-[#F5F3FF] focus:outline-none focus:ring-1 focus:ring-[#8B5CF6] focus:border-[#A855F7]"
              />
            </div>

            <div>
              <label className="block text-[#C4B5FD] mb-1">Department</label>
              <input
                type="text"
                value={editDept}
                onChange={(e) => setEditDept(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-purple-800/60 bg-[#190D30] text-[#F5F3FF] focus:outline-none focus:ring-1 focus:ring-[#8B5CF6] focus:border-[#A855F7]"
              />
            </div>

            {user.studentId && (
              <div>
                <label className="block text-[#C4B5FD] mb-1">Student ID (Registered)</label>
                <div className="px-3 py-2 rounded-xl bg-[#190D30] border border-purple-900/50 text-[#C4B5FD] font-mono text-xs">
                  {user.studentId}
                </div>
              </div>
            )}

            <div className="pt-2 flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  logout();
                  setAuthModal('login');
                }}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-rose-500/40 text-rose-400 hover:bg-rose-500/10 text-xs font-semibold cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Log Out</span>
              </button>

              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#6D28D9] to-[#8B5CF6] hover:from-[#7C3AED] hover:to-[#A855F7] text-white font-bold cursor-pointer shadow-md shadow-purple-900/40"
              >
                Save Changes
              </button>
            </div>
          </form>

          {/* Quick Demo Switcher inside profile for testing ease */}
          <div className="mt-5 pt-4 border-t border-purple-900/50">
            <span className="text-[10px] font-mono text-[#C4B5FD] block mb-2 uppercase">
              Switch Active Role (Testing):
            </span>
            <div className="grid grid-cols-3 gap-1.5">
              {(['ADMIN', 'FACULTY', 'STUDENT'] as UserRole[]).map((r) => (
                <button
                  key={r}
                  onClick={() => switchDemoRole(r)}
                  className={`py-1.5 rounded-lg text-[11px] font-mono font-bold transition-colors cursor-pointer ${
                    user.role === r
                      ? 'bg-gradient-to-r from-[#6D28D9] to-[#D946EF] text-white shadow-sm shadow-purple-900/40'
                      : 'border border-purple-800/50 bg-[#190D30] text-[#B8A9D1] hover:text-white hover:border-[#A855F7]'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 4. FORGOT PASSWORD MODAL */}
      {authModal === 'forgot' && (
        <div className="bg-[#21123B] border border-purple-800/70 rounded-2xl max-w-md w-full p-6 shadow-2xl shadow-purple-950/80 relative animate-in fade-in zoom-in-95 duration-200">
          <button
            onClick={() => setAuthModal(null)}
            className="absolute top-4 right-4 text-[#C4B5FD] hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#6D28D9] to-[#D946EF] text-white flex items-center justify-center shadow-md shadow-purple-900/40">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#F5F3FF]">
                Reset Password
              </h3>
              <p className="text-xs text-[#B8A9D1]">Academic Account Recovery</p>
            </div>
          </div>

          {forgotSent ? (
            <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-xs space-y-2">
              <div className="flex items-center gap-2 text-emerald-400 font-bold">
                <CheckCircle2 className="w-4 h-4" />
                <span>Password Recovery Link Dispatched</span>
              </div>
              <p className="text-[#F5F3FF]">
                A secure password reset authorization token has been sent to <strong className="font-mono text-[#D946EF]">{forgotEmail}</strong>.
              </p>
              <button
                onClick={() => {
                  setForgotSent(false);
                  setAuthModal('login');
                }}
                className="mt-2 text-[#A855F7] font-bold hover:text-[#D946EF] underline cursor-pointer"
              >
                Return to Login
              </button>
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (forgotEmail) setForgotSent(true);
              }}
              className="space-y-4 text-xs"
            >
              <p className="text-[#B8A9D1]">
                Enter your institutional email address to receive a cryptographically signed reset token.
              </p>
              <div>
                <label className="block font-semibold text-[#C4B5FD] mb-1">
                  Institutional Email
                </label>
                <input
                  type="email"
                  required
                  placeholder="user@trekverse.edu"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-purple-800/60 bg-[#190D30] text-[#F5F3FF] focus:outline-none focus:ring-1 focus:ring-[#8B5CF6] focus:border-[#A855F7]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#6D28D9] via-[#8B5CF6] to-[#D946EF] hover:from-[#7C3AED] hover:to-[#E879F9] text-white font-bold transition-all shadow-lg shadow-purple-900/40 cursor-pointer"
              >
                Send Password Reset Token
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
};
