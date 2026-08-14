import { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  CheckCircle2, 
  Copy, 
  Check, 
  ExternalLink, 
  Store, 
  LogIn, 
  Sparkles, 
  Send, 
  Calendar, 
  ShieldCheck,
  ArrowRight
} from 'lucide-react';
import { getTenantBySlug, sendCredentialsNotification } from '../services/tenantStore';
import { Tenant } from '../types';

interface SuccessPageProps {
  navigate: (path: string) => void;
  slug?: string;
  plan?: string;
  isPaid?: boolean;
}

export function SuccessPage({ navigate, slug = 'phnom-penh-bistro', plan = 'trial', isPaid }: SuccessPageProps) {
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [copiedAdminLink, setCopiedAdminLink] = useState(false);
  const [showNotificationToast, setShowNotificationToast] = useState(false);

  const adminLink = 'https://comfortable-achievement-production-fccf.up.railway.app/';

  useEffect(() => {
    // Fire confetti celebration
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#f59e0b', '#10b981', '#6366f1', '#ec4899'],
      });
    } catch (e) {
      console.error(e);
    }

    const t = getTenantBySlug(slug);
    if (t) {
      setTenant(t);
    }
  }, [slug]);

  const copyLink = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedAdminLink(true);
    setTimeout(() => setCopiedAdminLink(false), 2000);
  };

  const handleResendCredentials = () => {
    if (tenant) {
      sendCredentialsNotification(tenant, 'Your SmartMenu Admin Portal Login Link');
      setShowNotificationToast(true);
      setTimeout(() => setShowNotificationToast(false), 4000);
    }
  };

  const isTrialPlan = tenant ? tenant.planType === 'trial' : plan === 'trial';

  return (
    <div className="min-h-screen bg-stone-100/60 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Celebration Header */}
        <div className="text-center space-y-3">
          <div className="w-16 h-16 rounded-3xl bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/25">
            <CheckCircle2 className="w-9 h-9" />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-200">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Registration & Account Setup Complete</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-stone-950 tracking-tight">
            Welcome to SmartMenu!
          </h1>

          <p className="text-sm text-stone-600 max-w-lg mx-auto">
            {tenant?.businessName ? (
              <>
                Your restaurant account for <strong className="text-stone-900">{tenant.businessName}</strong> is ready. Log in to your admin portal below to manage dishes, prices, and settings.
              </>
            ) : (
              'Your restaurant administrative portal has been provisioned and is ready for management.'
            )}
          </p>
        </div>

        {/* Resend Confirmation Toast */}
        {showNotificationToast && (
          <div className="p-3.5 rounded-2xl bg-emerald-600 text-white text-xs font-semibold flex items-center justify-between shadow-lg animate-in fade-in">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-200" />
              <span>Admin login link has been dispatched to your Telegram & Email!</span>
            </div>
            <button
              onClick={() => setShowNotificationToast(false)}
              className="text-emerald-200 hover:text-white font-bold"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Primary Admin Portal Login Link Card */}
        <div className="bg-white rounded-3xl border-2 border-amber-500/50 p-6 sm:p-8 shadow-xl space-y-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-stone-900 text-white text-[11px] font-extrabold px-4 py-1.5 rounded-bl-2xl uppercase tracking-wider flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
            <span>Admin Management</span>
          </div>

          <div className="space-y-3 pt-2">
            <div className="w-12 h-12 rounded-2xl bg-stone-900 text-white flex items-center justify-center shadow-md">
              <Store className="w-6 h-6 text-amber-400" />
            </div>

            <div>
              <h2 className="font-extrabold text-2xl text-stone-950">
                Admin Portal Login Link
              </h2>
              <p className="text-xs sm:text-sm text-stone-500 mt-1">
                Access your restaurant dashboard to manage digital menus, categories, tables, and staff.
              </p>
            </div>

            {/* URL Display Box */}
            <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 font-mono text-xs sm:text-sm text-stone-900 break-all select-all flex items-center justify-between gap-3 shadow-inner">
              <span className="font-semibold text-amber-900">{adminLink}</span>
              <button
                id="copy-admin-link-btn"
                onClick={() => copyLink(adminLink)}
                className="px-3 py-2 rounded-xl bg-white hover:bg-stone-100 text-stone-700 border border-stone-300 shrink-0 transition-all flex items-center gap-1.5 text-xs font-bold shadow-xs cursor-pointer"
                title="Copy Admin Login Link"
              >
                {copiedAdminLink ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span className="text-emerald-600">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-stone-600" />
                    <span>Copy Link</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 pt-2">
            <a
              id="open-admin-portal-link"
              href={adminLink}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-4 px-6 bg-stone-900 hover:bg-stone-800 text-white font-extrabold text-sm rounded-2xl shadow-lg shadow-stone-900/20 flex items-center justify-center gap-2 hover:scale-[1.01] transition-all"
            >
              <span>Go to Admin Login</span>
              <ExternalLink className="w-4 h-4 text-amber-400" />
            </a>

            <button
              id="resend-links-btn"
              onClick={handleResendCredentials}
              className="w-full py-3 px-4 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors"
            >
              <Send className="w-3.5 h-3.5 text-sky-600" />
              <span>Re-send Admin Login Link via Telegram & Email</span>
            </button>
          </div>
        </div>

        {/* Subscription Status Card */}
        <div className="bg-stone-900 text-white rounded-3xl p-6 border border-stone-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-sm text-white">
                {isTrialPlan ? '30-Day Full Access Free Trial Active' : 'Paid Subscription Active'}
              </p>
              <p className="text-xs text-stone-400">
                {isTrialPlan
                  ? 'Your 30-day trial is now active. We sent confirmation details to your phone/email.'
                  : 'Your subscription is active and renewing automatically with 0% transaction fees.'}
              </p>
            </div>
          </div>

          <div className="shrink-0 flex items-center gap-2">
            <button
              onClick={() => navigate('/pricing')}
              className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-amber-400 rounded-xl text-xs font-bold border border-stone-700"
            >
              View Plan Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
