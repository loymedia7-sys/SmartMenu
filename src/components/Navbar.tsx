import { useState, useEffect } from 'react';
import { UtensilsCrossed, ArrowRight, LogIn, Bell, CheckCircle2, Shield, Menu, X, ExternalLink, Store } from 'lucide-react';
import { getCurrentSession, logoutTenant, getNotifications } from '../services/tenantStore';
import { UserSession, NotificationLog } from '../types';

interface NavbarProps {
  currentPath: string;
  navigate: (path: string) => void;
}

export default function Navbar({ currentPath, navigate }: NavbarProps) {
  const [session, setSession] = useState<UserSession | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationLog[]>([]);

  useEffect(() => {
    setSession(getCurrentSession());
    setNotifications(getNotifications());
    
    // Refresh session on custom storage events
    const handleStorage = () => {
      setSession(getCurrentSession());
      setNotifications(getNotifications());
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [currentPath]);

  const handleLogout = () => {
    logoutTenant();
    setSession(null);
    navigate('/');
  };

  const navLinks = [
    { label: 'Overview', path: '/' },
    { label: 'Pricing & Plans', path: '/pricing' },
    { label: 'Register Free', path: '/register' },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Brand Logo */}
            <div className="flex items-center gap-8">
              <button 
                id="brand-logo-btn"
                onClick={() => navigate('/')} 
                className="flex items-center gap-2.5 text-left group focus:outline-none"
              >
                <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center text-stone-950 font-bold shadow-sm shadow-amber-500/20 group-hover:scale-105 transition-transform">
                  <UtensilsCrossed className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-extrabold text-lg text-stone-900 tracking-tight">SmartMenu</span>
                    <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-200">Cambodia</span>
                  </div>
                  <p className="text-xs text-stone-500 font-medium">Digital QR Menu Platform</p>
                </div>
              </button>

              {/* Desktop Nav Links */}
              <nav className="hidden md:flex items-center gap-1">
                {navLinks.map(link => {
                  const isActive = currentPath === link.path || (link.path === '/' && currentPath === '');
                  return (
                    <button
                      key={link.path}
                      id={`nav-link-${link.label.toLowerCase().replace(/\s+/g, '-')}`}
                      onClick={() => navigate(link.path)}
                      className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                        isActive
                          ? 'bg-amber-50 text-amber-900 font-semibold'
                          : 'text-stone-600 hover:text-stone-950 hover:bg-stone-100'
                      }`}
                    >
                      {link.label}
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Right Side Actions */}
            <div className="hidden sm:flex items-center gap-3">
              {/* Notification Simulation Bell */}
              <button
                id="notif-toggle-btn"
                onClick={() => {
                  setNotifications(getNotifications());
                  setNotifOpen(true);
                }}
                className="relative p-2 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors"
                title="System Notifications (Telegram & Email)"
              >
                <Bell className="w-5 h-5" />
                {notifications.length > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-white animate-pulse" />
                )}
              </button>

              {session ? (
                <div className="flex items-center gap-2">
                  <button
                    id="nav-admin-dashboard-btn"
                    onClick={() => navigate('/admin')}
                    className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-stone-900 text-white text-sm font-semibold hover:bg-stone-800 shadow-sm transition-all"
                  >
                    <Store className="w-4 h-4 text-amber-400" />
                    <span>{session.tenant.businessName.substring(0, 16)}...</span>
                  </button>

                  <button
                    id="nav-logout-btn"
                    onClick={handleLogout}
                    className="px-3 py-2 text-xs font-semibold text-stone-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2.5">
                  <button
                    id="nav-start-trial-cta"
                    onClick={() => navigate('/register')}
                    className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold bg-amber-500 hover:bg-amber-600 text-stone-950 rounded-lg shadow-sm shadow-amber-500/20 hover:shadow transition-all"
                  >
                    <span>Start Free Trial</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="flex sm:hidden items-center gap-2">
              <button
                id="mobile-notif-btn"
                onClick={() => setNotifOpen(true)}
                className="p-2 text-stone-600 hover:bg-stone-100 rounded-lg"
              >
                <Bell className="w-5 h-5" />
              </button>
              <button
                id="mobile-menu-toggle"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-stone-600 hover:bg-stone-100 rounded-lg"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="sm:hidden border-t border-stone-200 bg-white px-4 pt-2 pb-4 space-y-2 shadow-lg">
            {navLinks.map(link => (
              <button
                key={link.path}
                id={`mobile-link-${link.label.toLowerCase().replace(/\s+/g, '-')}`}
                onClick={() => {
                  navigate(link.path);
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium text-stone-700 hover:bg-amber-50 hover:text-amber-900"
              >
                {link.label}
              </button>
            ))}
            <div className="pt-3 border-t border-stone-100 space-y-2">
              {session ? (
                <>
                  <button
                    id="mobile-admin-btn"
                    onClick={() => {
                      navigate('/admin');
                      setMobileMenuOpen(false);
                    }}
                    className="w-full py-2.5 bg-stone-900 text-white text-sm font-semibold rounded-lg"
                  >
                    Manage {session.tenant.businessName}
                  </button>
                  <button
                    id="mobile-logout-btn"
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full py-2 text-rose-600 text-sm font-medium"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <button
                    id="mobile-register-btn"
                    onClick={() => {
                      navigate('/register');
                      setMobileMenuOpen(false);
                    }}
                    className="w-full py-2.5 bg-amber-500 text-stone-950 text-sm font-bold rounded-lg shadow-sm"
                  >
                    Start 30-Day Free Trial
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Notifications Drawer */}
      {notifOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-stone-900/40 backdrop-blur-xs flex justify-end">
          <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
            <div className="p-4 border-b border-stone-200 flex items-center justify-between bg-stone-50">
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-amber-600" />
                <h3 className="font-bold text-stone-900 text-base">Dispatched Notifications</h3>
                <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-semibold">
                  {notifications.length}
                </span>
              </div>
              <button
                id="close-notif-drawer-btn"
                onClick={() => setNotifOpen(false)}
                className="p-1.5 rounded-lg text-stone-500 hover:bg-stone-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 bg-amber-50/60 border-b border-amber-100 text-xs text-amber-900 flex items-start gap-2">
              <Shield className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <p>Simulating live Telegram Bot & Email notifications dispatched after registration, plan checkout, and OTP verification.</p>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {notifications.length === 0 ? (
                <div className="py-12 text-center text-stone-500">
                  <Bell className="w-10 h-10 text-stone-300 mx-auto mb-2" />
                  <p className="font-medium text-sm">No notification logs yet.</p>
                  <p className="text-xs text-stone-400 mt-1">Register a new shop or complete payment to see automated credential emails & Telegram alerts.</p>
                </div>
              ) : (
                notifications.map((notif) => (
                  <div key={notif.id} className="p-3.5 rounded-xl border border-stone-200 bg-stone-50/80 hover:bg-stone-50 transition-all text-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <span className={`px-2 py-0.5 rounded font-bold uppercase tracking-wider text-[10px] ${
                        notif.type === 'telegram' ? 'bg-sky-100 text-sky-800' : 'bg-purple-100 text-purple-800'
                      }`}>
                        {notif.type}
                      </span>
                      <span className="text-stone-400 text-[11px]">
                        {new Date(notif.sentAt).toLocaleTimeString()}
                      </span>
                    </div>

                    <p className="font-bold text-stone-900 text-sm">{notif.subject}</p>
                    <p className="text-stone-600 whitespace-pre-line leading-relaxed bg-white p-2.5 rounded-lg border border-stone-200 font-mono text-[11px]">
                      {notif.message}
                    </p>

                    <div className="flex items-center gap-2 pt-1">
                      <button
                        onClick={() => {
                          window.open(notif.menuLink, '_blank');
                        }}
                        className="flex items-center gap-1 text-amber-700 hover:text-amber-800 font-semibold"
                      >
                        <span>Open Menu</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="p-4 border-t border-stone-200 bg-stone-50 flex justify-between items-center">
              <span className="text-xs text-stone-500">Auto-synced with store</span>
              <button
                onClick={() => setNotifOpen(false)}
                className="px-4 py-2 bg-stone-900 text-white rounded-lg text-xs font-semibold hover:bg-stone-800"
              >
                Close Drawer
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
