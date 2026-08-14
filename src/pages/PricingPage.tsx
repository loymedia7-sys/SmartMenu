import { useState } from 'react';
import { 
  Sparkles, 
  Check, 
  HelpCircle, 
  ShieldCheck, 
  UtensilsCrossed, 
  ArrowRight, 
  Smartphone,
  ChevronRight
} from 'lucide-react';
import { PLANS, COMPARISON_CATEGORIES } from '../data/plans';
import { PlanCard } from '../components/PlanCard';
import { BillingCycle, PlanId } from '../types';

interface PricingPageProps {
  navigate: (path: string) => void;
}

export function PricingPage({ navigate }: PricingPageProps) {
  const [billingCycle, setBillingCycle] = useState<BillingCycle>('monthly');

  const handleSelectPlan = (planId: string) => {
    if (planId === 'trial') {
      navigate('/register?plan=trial');
    } else {
      navigate(`/register?plan=${planId}&cycle=${billingCycle}`);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100 text-amber-900 text-xs font-bold border border-amber-200">
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span>Transparent Pricing • 0% Transaction Fees</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold text-stone-950 tracking-tight">
            Plans Built for Every Dining Experience
          </h1>

          <p className="text-stone-600 text-base max-w-2xl mx-auto">
            From intimate cafes to high-volume multi-floor bistros. Start with our full-featured 30-Day Free Trial and upgrade anytime.
          </p>

          {/* Billing Cycle Switcher */}
          <div className="pt-4 flex justify-center">
            <div className="inline-flex items-center p-1.5 rounded-2xl bg-white border border-stone-300 shadow-xs">
              <button
                id="pricing-monthly-btn"
                onClick={() => setBillingCycle('monthly')}
                className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  billingCycle === 'monthly'
                    ? 'bg-stone-900 text-white shadow-xs'
                    : 'text-stone-600 hover:text-stone-950'
                }`}
              >
                Monthly Billing
              </button>

              <button
                id="pricing-yearly-btn"
                onClick={() => setBillingCycle('yearly')}
                className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  billingCycle === 'yearly'
                    ? 'bg-amber-500 text-stone-950 shadow-xs'
                    : 'text-stone-600 hover:text-stone-950'
                }`}
              >
                <span>Annual Billing</span>
                <span className="bg-stone-900 text-amber-300 text-[10px] px-2 py-0.5 rounded-full font-bold">
                  Save 20%
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* 4 Plan Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Object.values(PLANS).map((plan) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              billingCycle={billingCycle}
              onSelect={handleSelectPlan}
            />
          ))}
        </div>

        {/* Full Interactive Comparison Matrix */}
        <div className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden">
          <div className="p-6 sm:p-8 bg-stone-900 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold">Detailed Plan Feature Matrix</h2>
              <p className="text-xs text-stone-400 mt-1">Compare all specifications and technical capabilities side-by-side</p>
            </div>
            <button
              onClick={() => navigate('/register')}
              className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs rounded-xl shadow-sm transition-all shrink-0"
            >
              Start Free Trial Now
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-stone-200 bg-stone-100/90 text-stone-700">
                  <th className="py-4 px-6 font-bold w-2/5">Platform Feature</th>
                  <th className="py-4 px-4 font-bold text-center">Trial (30 Days)</th>
                  <th className="py-4 px-4 font-bold text-center">Normal Plan</th>
                  <th className="py-4 px-4 font-bold text-center bg-amber-50/80 text-amber-900">Pro Plan</th>
                  <th className="py-4 px-4 font-bold text-center">Max Enterprise</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200">
                {COMPARISON_CATEGORIES.map((cat, catIdx) => (
                  <>
                    <tr key={`cat-title-${catIdx}`} className="bg-stone-50 font-bold text-stone-900">
                      <td colSpan={5} className="py-3 px-6 text-xs uppercase tracking-wider bg-stone-100 text-stone-900 font-extrabold">
                        {cat.name}
                      </td>
                    </tr>
                    {cat.features.map((feat, featIdx) => (
                      <tr key={`feat-row-${catIdx}-${featIdx}`} className="hover:bg-amber-50/20 transition-colors">
                        <td className="py-3.5 px-6 font-medium text-stone-800">{feat.name}</td>
                        <td className="py-3.5 px-4 text-center text-stone-600 font-mono">{feat.trial}</td>
                        <td className="py-3.5 px-4 text-center text-stone-600 font-mono">{feat.normal}</td>
                        <td className="py-3.5 px-4 text-center text-stone-950 font-mono font-bold bg-amber-50/50">
                          {feat.pro}
                        </td>
                        <td className="py-3.5 px-4 text-center text-stone-600 font-mono">{feat.max}</td>
                      </tr>
                    ))}
                  </>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Enterprise Assistance Callout */}
        <div className="bg-amber-500/10 border border-amber-300 rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-xl font-bold text-stone-950">Managing more than 3 restaurant locations?</h3>
            <p className="text-sm text-stone-700 max-w-xl">
              We provide custom enterprise onboarding, POS hardware integration, on-site staff training, and dedicated account managers for restaurant groups.
            </p>
          </div>
          <button
            onClick={() => navigate('/register?plan=max')}
            className="px-6 py-3.5 bg-stone-950 hover:bg-stone-800 text-white font-bold text-sm rounded-xl shadow-sm shrink-0 flex items-center gap-2"
          >
            <span>Talk to Enterprise Team</span>
            <ArrowRight className="w-4 h-4 text-amber-400" />
          </button>
        </div>
      </div>
    </div>
  );
}
