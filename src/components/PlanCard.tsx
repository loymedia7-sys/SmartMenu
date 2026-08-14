import { Check, Sparkles, Zap, ArrowRight, ShieldCheck } from 'lucide-react';
import { PlanInfo, BillingCycle } from '../types';

interface PlanCardProps {
  key?: string;
  plan: PlanInfo;
  billingCycle: BillingCycle;
  onSelect: (planId: string) => void;
  selected?: boolean;
  compact?: boolean;
}

export function PlanCard({ plan, billingCycle, onSelect, selected, compact }: PlanCardProps) {
  const isYearly = billingCycle === 'yearly';
  const priceUSD = isYearly 
    ? (plan.priceYearlyUSD / 12).toFixed(2) 
    : (Number.isInteger(plan.priceMonthlyUSD) ? plan.priceMonthlyUSD : plan.priceMonthlyUSD.toFixed(2));
  const priceKHR = isYearly ? Math.round(plan.priceYearlyKHR / 12) : plan.priceMonthlyKHR;

  const isPro = plan.id === 'pro';
  const isTrial = plan.id === 'trial';

  return (
    <div
      id={`plan-card-${plan.id}`}
      className={`relative rounded-2xl transition-all duration-200 flex flex-col ${
        compact ? 'p-5' : 'p-6 sm:p-7'
      } ${
        isPro
          ? 'bg-stone-900 text-white shadow-xl shadow-stone-900/15 ring-2 ring-amber-500'
          : 'bg-white text-stone-900 border border-stone-200 shadow-sm hover:shadow-md'
      } ${selected ? 'ring-2 ring-amber-500 bg-amber-50/20' : ''}`}
    >
      {/* Popular or Trial badge */}
      {plan.badge && (
        <div className="absolute -top-3 left-6">
          <span
            className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
              isPro
                ? 'bg-amber-500 text-stone-950 shadow-sm'
                : isTrial
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-stone-800 text-amber-400'
            }`}
          >
            {isPro && <Sparkles className="w-3.5 h-3.5" />}
            {isTrial && <ShieldCheck className="w-3.5 h-3.5" />}
            {plan.badge}
          </span>
        </div>
      )}

      {/* Header */}
      <div className="pt-2 mb-4">
        <h3 className={`text-xl font-bold ${isPro ? 'text-white' : 'text-stone-900'}`}>{plan.name}</h3>
        <p className={`text-xs mt-1 leading-relaxed ${isPro ? 'text-stone-400' : 'text-stone-500'}`}>
          {plan.description}
        </p>
      </div>

      {/* Price section */}
      <div className="mb-6 pb-6 border-b border-stone-200/40">
        <div className="flex items-baseline gap-1.5">
          {plan.id === 'trial' ? (
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-extrabold tracking-tight">$0</span>
              <span className={`text-sm font-medium ${isPro ? 'text-stone-400' : 'text-stone-500'}`}>/ 30 days</span>
            </div>
          ) : (
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-extrabold tracking-tight">${priceUSD}</span>
              <span className={`text-sm font-medium ${isPro ? 'text-stone-400' : 'text-stone-500'}`}>
                / month {isYearly && <span className="text-xs text-amber-500 font-semibold">(billed annually)</span>}
              </span>
            </div>
          )}
        </div>

        {plan.id !== 'trial' && (
          <p className={`text-xs mt-1 font-mono ${isPro ? 'text-stone-400' : 'text-stone-500'}`}>
            ≈ ៛{priceKHR.toLocaleString()} KHR / mo
          </p>
        )}
      </div>

      {/* Limits snapshot */}
      <div className={`grid grid-cols-2 gap-2 mb-6 p-3 rounded-xl text-xs font-medium ${
        isPro ? 'bg-stone-800/80 text-stone-300' : 'bg-stone-50 text-stone-700'
      }`}>
        <div>
          <span className="text-[11px] text-stone-400 block">Table Capacity</span>
          <span className="font-bold text-stone-900 dark:text-white">
            {typeof plan.limits.tables === 'number' ? `${plan.limits.tables} Tables` : plan.limits.tables}
          </span>
        </div>
        <div>
          <span className="text-[11px] text-stone-400 block">Menu Items</span>
          <span className="font-bold text-stone-900 dark:text-white">
            {typeof plan.limits.menuItems === 'number' ? `${plan.limits.menuItems} Items` : plan.limits.menuItems}
          </span>
        </div>
      </div>

      {/* Feature list */}
      <div className="space-y-2.5 flex-1 mb-6 text-xs">
        {plan.features.map((feature, idx) => (
          <div key={idx} className="flex items-start gap-2.5">
            <div
              className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                isPro ? 'bg-amber-500/20 text-amber-400' : 'bg-amber-100 text-amber-800'
              }`}
            >
              <Check className="w-3 h-3" />
            </div>
            <span className={isPro ? 'text-stone-300' : 'text-stone-600'}>{feature}</span>
          </div>
        ))}
      </div>

      {/* CTA Button */}
      <button
        id={`select-plan-${plan.id}-btn`}
        onClick={() => onSelect(plan.id)}
        className={`w-full py-3 px-4 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-sm ${
          isPro
            ? 'bg-amber-500 hover:bg-amber-400 text-stone-950 shadow-amber-500/20 hover:scale-[1.02]'
            : isTrial
            ? 'bg-stone-900 hover:bg-stone-800 text-white hover:scale-[1.02]'
            : 'bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300'
        }`}
      >
        <span>{plan.ctaText}</span>
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
}
