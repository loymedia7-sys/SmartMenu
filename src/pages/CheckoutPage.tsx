import { useState, useEffect } from 'react';
import { 
  CreditCard, 
  ShieldCheck, 
  ArrowLeft, 
  CheckCircle2, 
  Sparkles, 
  UtensilsCrossed, 
  Lock, 
  Receipt 
} from 'lucide-react';
import { PlanId, BillingCycle, PaymentSession } from '../types';
import { PLANS } from '../data/plans';
import { createPaymentSession, getTenantBySlug } from '../services/tenantStore';
import { PaymentSimulator } from '../components/PaymentSimulator';

interface CheckoutPageProps {
  navigate: (path: string) => void;
  planId: PlanId;
  slug?: string;
  cycle?: BillingCycle;
}

export function CheckoutPage({ navigate, planId = 'pro', slug, cycle = 'monthly' }: CheckoutPageProps) {
  const [billingCycle, setBillingCycle] = useState<BillingCycle>(cycle);
  const [paymentSession, setPaymentSession] = useState<PaymentSession | null>(null);

  // If user chooses trial on checkout page, redirect to register
  useEffect(() => {
    if (planId === 'trial') {
      navigate('/register?plan=trial');
    }
  }, [planId]);

  const targetPlan = PLANS[planId] || PLANS.pro;
  const currentSlug = slug || 'my-restaurant';
  const tenant = getTenantBySlug(currentSlug);

  // Initialize payment session
  useEffect(() => {
    const session = createPaymentSession(currentSlug, targetPlan.id, billingCycle);
    setPaymentSession(session);
  }, [targetPlan.id, currentSlug, billingCycle]);

  const handlePaymentSuccess = () => {
    navigate(`/register/success?slug=${currentSlug}&plan=${targetPlan.id}&paid=true`);
  };

  const amountUSD = billingCycle === 'yearly' ? targetPlan.priceYearlyUSD : targetPlan.priceMonthlyUSD;
  const amountKHR = billingCycle === 'yearly' ? targetPlan.priceYearlyKHR : targetPlan.priceMonthlyKHR;

  return (
    <div className="min-h-screen bg-stone-100/60 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Top Breadcrumb */}
        <button
          onClick={() => navigate('/pricing')}
          className="text-xs font-semibold text-stone-500 hover:text-stone-800 flex items-center gap-1.5"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Plans</span>
        </button>

        {/* 2-Column Checkout Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Order Summary */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-sm space-y-5">
              <div className="flex items-center justify-between border-b border-stone-100 pb-4">
                <div className="flex items-center gap-2">
                  <Receipt className="w-5 h-5 text-amber-600" />
                  <h2 className="font-bold text-stone-900 text-base">Subscription Summary</h2>
                </div>
                <span className="text-[10px] uppercase font-extrabold px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                  {targetPlan.name}
                </span>
              </div>

              {/* Tenant info */}
              {tenant && (
                <div className="p-3 bg-stone-50 rounded-xl text-xs space-y-1 border border-stone-100">
                  <p className="font-bold text-stone-900">{tenant.businessName}</p>
                  <p className="text-stone-500 font-mono">Slug: {tenant.slug}</p>
                  <p className="text-stone-500">Owner: {tenant.ownerName}</p>
                </div>
              )}

              {/* Billing Cycle Selector */}
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-600">
                  Billing Frequency
                </label>
                <div className="grid grid-cols-2 gap-2 p-1 bg-stone-100 rounded-xl text-xs font-semibold">
                  <button
                    type="button"
                    onClick={() => setBillingCycle('monthly')}
                    className={`py-2 rounded-lg transition-all ${
                      billingCycle === 'monthly'
                        ? 'bg-white text-stone-950 font-bold shadow-xs'
                        : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    Monthly
                  </button>
                  <button
                    type="button"
                    onClick={() => setBillingCycle('yearly')}
                    className={`py-2 rounded-lg transition-all flex items-center justify-center gap-1 ${
                      billingCycle === 'yearly'
                        ? 'bg-amber-500 text-stone-950 font-bold shadow-xs'
                        : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    <span>Annual</span>
                    <span className="text-[10px] bg-stone-900 text-amber-300 px-1.5 py-0.2 rounded font-bold">
                      -20%
                    </span>
                  </button>
                </div>
              </div>

              {/* Price Line Items */}
              <div className="space-y-2.5 pt-2 border-t border-stone-100 text-xs text-stone-600">
                <div className="flex justify-between">
                  <span>Plan Base ({targetPlan.name})</span>
                  <span className="font-mono text-stone-900">${amountUSD.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-emerald-600 font-medium">
                  <span>Merchant Setup Fee</span>
                  <span>FREE ($0)</span>
                </div>
                <div className="flex justify-between text-emerald-600 font-medium">
                  <span>Bakong Transaction Fees</span>
                  <span>0% Commission</span>
                </div>
                <div className="flex justify-between text-stone-500">
                  <span>VAT Tax (Cambodia)</span>
                  <span>Included ($0.00)</span>
                </div>

                <div className="pt-3 border-t border-stone-200 flex justify-between items-baseline">
                  <div>
                    <span className="text-sm font-extrabold text-stone-950 block">Total Due</span>
                    <span className="text-[11px] text-stone-400 font-mono">
                      ≈ ៛{amountKHR.toLocaleString()} KHR
                    </span>
                  </div>
                  <span className="text-2xl font-extrabold text-stone-950 font-mono">
                    ${amountUSD.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Plan inclusions snapshot */}
              <div className="pt-4 border-t border-stone-100">
                <p className="text-xs font-bold text-stone-700 mb-2">Inclusions Highlights:</p>
                <div className="space-y-1.5 text-xs text-stone-600">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Up to {targetPlan.limits.tables} Dining Tables</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{targetPlan.limits.menuItems} Food & Drinks Items</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Telegram & Kitchen Display Dispatch</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Security Guarantee Box */}
            <div className="p-4 rounded-2xl bg-stone-900 text-stone-300 text-xs space-y-2 border border-stone-800">
              <div className="flex items-center gap-2 text-white font-bold">
                <Lock className="w-4 h-4 text-amber-400" />
                <span>Encrypted NBC Bakong Payment Gateway</span>
              </div>
              <p className="text-stone-400 text-[11px] leading-relaxed">
                Transactions are processed in accordance with the National Bank of Cambodia EMVCo QR standards. Funds are directly settled to SmartMenu merchant accounts.
              </p>
            </div>
          </div>

          {/* Right Column: Interactive KHQR & ABA Simulator */}
          <div className="lg:col-span-7">
            {paymentSession && (
              <PaymentSimulator
                session={paymentSession}
                onPaymentSuccess={handlePaymentSuccess}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
