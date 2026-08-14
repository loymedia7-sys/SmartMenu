import { useState, FormEvent } from 'react';
import { 
  Store, 
  Lock, 
  Mail, 
  ArrowRight, 
  LogIn, 
  AlertCircle, 
  ShieldCheck, 
  ChefHat, 
  UserCheck, 
  UtensilsCrossed, 
  Sparkles,
  KeyRound
} from 'lucide-react';
import { loginTenant, getAllTenants } from '../services/tenantStore';
import { UserRole } from '../types';

interface LoginPageProps {
  navigate: (path: string) => void;
}

export function LoginPage({ navigate }: LoginPageProps) {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('admin');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  const existingTenants = getAllTenants();

  const handleLogin = (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const result = loginTenant(identifier, password, role);
    setIsSubmitting(false);

    if (!result.success) {
      setError(result.error || 'Invalid credentials.');
      return;
    }

    navigate('/admin');
  };

  // Quick 1-click login helper for testing
  const handleQuickDemoLogin = (tenantSlug: string, userRole: UserRole = 'admin') => {
    const tenant = existingTenants.find(t => t.slug === tenantSlug) || existingTenants[0];
    if (tenant) {
      loginTenant(tenant.email, 'Password123!', userRole);
      navigate('/admin');
    }
  };

  return (
    <div className="min-h-screen bg-stone-100/60 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-md w-full space-y-6">
        {/* Main Card */}
        <div className="bg-white rounded-3xl border border-stone-200 shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-stone-900 text-white p-6 sm:p-8 text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-amber-500 text-stone-950 flex items-center justify-center mx-auto shadow-md">
              <Store className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white">Tenant Login Portal</h1>
            <p className="text-xs text-stone-400">
              Access your digital menu management, kitchen display, and live analytics.
            </p>
          </div>

          {/* Form Body */}
          <form onSubmit={handleLogin} className="p-6 sm:p-8 space-y-5">
            {/* Role Switcher */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-600">
                Login Role
              </label>
              <div className="grid grid-cols-3 gap-1.5 p-1 bg-stone-100 rounded-xl text-xs font-semibold">
                <button
                  type="button"
                  id="role-admin-btn"
                  onClick={() => setRole('admin')}
                  className={`py-2 rounded-lg flex items-center justify-center gap-1 transition-all ${
                    role === 'admin' ? 'bg-stone-900 text-white shadow-xs' : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  <Store className="w-3.5 h-3.5" />
                  <span>Admin</span>
                </button>
                <button
                  type="button"
                  id="role-chef-btn"
                  onClick={() => setRole('chef')}
                  className={`py-2 rounded-lg flex items-center justify-center gap-1 transition-all ${
                    role === 'chef' ? 'bg-amber-500 text-stone-950 shadow-xs' : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  <ChefHat className="w-3.5 h-3.5" />
                  <span>Chef</span>
                </button>
                <button
                  type="button"
                  id="role-waiter-btn"
                  onClick={() => setRole('waiter')}
                  className={`py-2 rounded-lg flex items-center justify-center gap-1 transition-all ${
                    role === 'waiter' ? 'bg-stone-900 text-white shadow-xs' : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>Staff</span>
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Identifier input (Email, Phone or Slug) */}
            <div className="space-y-1.5">
              <label htmlFor="login-identifier" className="block text-xs font-bold uppercase tracking-wider text-stone-700">
                Email, Phone, or Shop Slug
              </label>
              <div className="relative rounded-xl border border-stone-300 focus-within:border-amber-500 focus-within:ring-2 focus-within:ring-amber-500/20 bg-white transition-all">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  id="login-identifier"
                  type="text"
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="e.g. sokha@phnompenhbistro.com or phnom-penh-bistro"
                  className="w-full pl-9 pr-4 py-2.5 text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label htmlFor="login-password" className="block text-xs font-bold uppercase tracking-wider text-stone-700">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowForgotModal(true)}
                  className="text-xs text-amber-700 hover:text-amber-800 font-semibold"
                >
                  Forgot?
                </button>
              </div>
              <div className="relative rounded-xl border border-stone-300 focus-within:border-amber-500 focus-within:ring-2 focus-within:ring-amber-500/20 bg-white transition-all">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="login-password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-4 py-2.5 text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none"
                />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              id="login-submit-btn"
              disabled={isSubmitting}
              className="w-full py-3.5 px-4 bg-stone-950 hover:bg-stone-800 text-white rounded-xl font-bold text-sm shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer hover:scale-[1.01]"
            >
              <LogIn className="w-4 h-4 text-amber-400" />
              <span>Log in as {role.toUpperCase()}</span>
            </button>
          </form>

          {/* 1-Click Quick Demo Switcher for fast evaluation */}
          <div className="p-6 bg-stone-50 border-t border-stone-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-500 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>1-Click Test Logins</span>
              </span>
              <span className="text-[10px] text-stone-400 font-mono">Demo Accounts</span>
            </div>

            <div className="space-y-2">
              <button
                type="button"
                id="demo-login-phnom-penh"
                onClick={() => handleQuickDemoLogin('phnom-penh-bistro', 'admin')}
                className="w-full p-2.5 rounded-xl border border-stone-200 bg-white hover:bg-amber-50 hover:border-amber-300 text-left text-xs transition-all flex items-center justify-between group"
              >
                <div>
                  <p className="font-bold text-stone-900">Phnom Penh Bistro & Lounge</p>
                  <p className="text-[11px] text-stone-500">Pro Plan • 24 Tables Active</p>
                </div>
                <span className="text-amber-700 font-bold text-xs group-hover:translate-x-0.5 transition-transform">
                  Login &rarr;
                </span>
              </button>

              <button
                type="button"
                id="demo-login-nomad-coffee"
                onClick={() => handleQuickDemoLogin('nomad-coffee', 'admin')}
                className="w-full p-2.5 rounded-xl border border-stone-200 bg-white hover:bg-amber-50 hover:border-amber-300 text-left text-xs transition-all flex items-center justify-between group"
              >
                <div>
                  <p className="font-bold text-stone-900">Nomad Coffee & Artisan Bakery</p>
                  <p className="text-[11px] text-stone-500">Trial Plan • 12 Tables Active</p>
                </div>
                <span className="text-amber-700 font-bold text-xs group-hover:translate-x-0.5 transition-transform">
                  Login &rarr;
                </span>
              </button>
            </div>
          </div>

          {/* Footer Registration CTA */}
          <div className="p-4 bg-stone-100 border-t border-stone-200 text-center text-xs text-stone-600 flex items-center justify-center gap-1.5">
            <span>New restaurant owner?</span>
            <button
              onClick={() => navigate('/register')}
              className="font-bold text-amber-700 hover:text-amber-800 underline"
            >
              Start 30-Day Free Trial
            </button>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 bg-stone-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl space-y-4">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
              <KeyRound className="w-5 h-5" />
            </div>

            <h3 className="font-bold text-lg text-stone-900">Reset Portal Password</h3>
            <p className="text-xs text-stone-500">
              Enter your registered restaurant email or Telegram phone to receive a quick reset magic link.
            </p>

            {resetSent ? (
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-800 text-xs font-semibold">
                Reset instructions dispatched to your Telegram bot & Email!
              </div>
            ) : (
              <input
                type="text"
                placeholder="sokha@restaurant.com"
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs focus:outline-none focus:border-amber-500"
              />
            )}

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  setShowForgotModal(false);
                  setResetSent(false);
                }}
                className="flex-1 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-xs font-semibold text-stone-700"
              >
                Close
              </button>
              {!resetSent && (
                <button
                  type="button"
                  onClick={() => setResetSent(true)}
                  className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-xs font-bold text-stone-950"
                >
                  Send Reset Link
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
