import { useState, Fragment } from 'react';
import { 
  UtensilsCrossed, 
  QrCode, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck, 
  Smartphone, 
  Zap, 
  Clock, 
  Globe2, 
  CreditCard, 
  ChevronRight, 
  HelpCircle,
  BarChart3,
  Users2,
  ChevronDown
} from 'lucide-react';
import { PLANS, COMPARISON_CATEGORIES } from '../data/plans';
import { PlanCard } from '../components/PlanCard';
import { BillingCycle } from '../types';

interface LandingPageProps {
  navigate: (path: string) => void;
}

export function LandingPage({ navigate }: LandingPageProps) {
  const [billingCycle, setBillingCycle] = useState<BillingCycle>('monthly');
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const handleSelectPlan = (planId: string) => {
    if (planId === 'trial') {
      navigate('/register?plan=trial');
    } else {
      navigate(`/register?plan=${planId}&cycle=${billingCycle}`);
    }
  };

  const faqs = [
    {
      q: 'How does the 30-Day Free Trial work?',
      a: 'You get full, unrestricted access to the entire SmartMenu platform for 30 days without entering any credit card. You can create your menu, generate printable QR codes for all tables, and receive customer orders. At the end of the 30 days, you can choose to continue on Normal, Pro, or Max plan.',
    },
    {
      q: 'Do customers need to download an app to view the menu?',
      a: 'No app download needed! Customers simply scan your table QR code with their default smartphone camera (iPhone or Android), and your menu opens instantly in their mobile browser in under a second.',
    },
    {
      q: 'How does Bakong KHQR customer payment work?',
      a: 'SmartMenu generates an official dynamic or static NBC Bakong KHQR code on the customer bill. When customers pay via any Cambodian banking app (ABA, Bakong, ACLEDA, Wing, Canadia), money settles directly into your own bank account with 0% commission fees.',
    },
    {
      q: 'Can I customize the menu in Khmer and English?',
      a: 'Yes! Every dish item supports dual-language titles (Khmer and English), category names, ingredient tags, spicy levels, and dish photo uploads.',
    },
    {
      q: 'How do I receive incoming orders in the kitchen?',
      a: 'Orders ping instantly to your dedicated Telegram group bot, and appear in real-time on your Kitchen Display Screen (KDS) tablet or waiter dashboard.',
    },
  ];

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 bg-gradient-to-b from-amber-500/10 via-white to-stone-50 border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Hero Text */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100/90 text-amber-900 border border-amber-200 text-xs font-bold shadow-xs">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>#1 Digital QR Menu & KHQR Ordering System in Cambodia</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-stone-950 leading-[1.1]">
                Delight Your Diners. <br />
                <span className="text-amber-600 underline decoration-amber-300 decoration-wavy decoration-2">
                  Zero Commission
                </span>{' '}
                QR Ordering.
              </h1>

              <p className="text-lg text-stone-600 max-w-2xl leading-relaxed">
                Transform paper menus into interactive, lightning-fast digital menus. Accept direct Bakong KHQR payments, receive Telegram order alerts, and update dish prices in real time.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
                <button
                  id="hero-start-trial-btn"
                  onClick={() => navigate('/register')}
                  className="w-full sm:w-auto px-8 py-4 bg-amber-500 hover:bg-amber-600 text-stone-950 rounded-xl font-extrabold text-base shadow-lg shadow-amber-500/25 hover:shadow-xl hover:scale-105 transition-all flex items-center justify-center gap-2.5"
                >
                  <UtensilsCrossed className="w-5 h-5" />
                  <span>Start 30-Day Free Trial</span>
                  <ArrowRight className="w-5 h-5" />
                </button>

                <button
                  id="hero-demo-menu-btn"
                  onClick={() => navigate('/menu/phnom-penh-bistro')}
                  className="w-full sm:w-auto px-6 py-4 bg-white hover:bg-stone-100 text-stone-800 border border-stone-300 rounded-xl font-bold text-base shadow-xs hover:shadow transition-all flex items-center justify-center gap-2"
                >
                  <QrCode className="w-5 h-5 text-amber-600" />
                  <span>View Live Menu Demo</span>
                </button>
              </div>

              {/* Key Trust Checkmarks */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-4 text-xs font-semibold text-stone-600">
                <div className="flex items-center gap-1.5 justify-center lg:justify-start">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>No credit card required</span>
                </div>
                <div className="flex items-center gap-1.5 justify-center lg:justify-start">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Setup in under 2 minutes</span>
                </div>
                <div className="flex items-center gap-1.5 justify-center lg:justify-start">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Bakong KHQR integrated</span>
                </div>
              </div>
            </div>

            {/* Right Interactive Preview Mockup */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-full max-w-sm">
                {/* Decorative glow */}
                <div className="absolute -inset-2 bg-gradient-to-r from-amber-400 to-rose-400 rounded-3xl blur-xl opacity-30 animate-pulse" />

                {/* Simulated Smartphone Shell */}
                <div className="relative bg-stone-900 rounded-[2.5rem] p-3 shadow-2xl border-4 border-stone-800">
                  <div className="bg-white rounded-[2rem] overflow-hidden shadow-inner text-xs">
                    {/* Phone Top Notch */}
                    <div className="bg-stone-900 text-white px-6 py-1 flex items-center justify-between text-[10px] font-mono">
                      <span>9:41</span>
                      <div className="w-16 h-3.5 bg-stone-800 rounded-full" />
                      <span>5G 100%</span>
                    </div>

                    {/* App Bar */}
                    <div className="p-3 bg-amber-500 text-stone-950 flex items-center justify-between font-bold">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-stone-950 text-amber-400 flex items-center justify-center text-xs">
                          PP
                        </div>
                        <div>
                          <p className="font-extrabold text-xs leading-none">Phnom Penh Bistro</p>
                          <p className="text-[10px] opacity-80">Table #08 • Live Menu</p>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded bg-stone-950 text-amber-300 text-[10px]">Open</span>
                    </div>

                    {/* Food Items Preview */}
                    <div className="p-3 space-y-2.5 bg-stone-50 max-h-80 overflow-y-auto">
                      <div className="bg-white p-2.5 rounded-xl border border-stone-200 shadow-xs flex items-center gap-3">
                        <img
                          src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200&auto=format&fit=crop&q=80"
                          alt="Fish Amok"
                          className="w-14 h-14 rounded-lg object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-stone-900 truncate">Royal Fish Amok</p>
                          <p className="text-[10px] text-stone-500">អាម៉ុកត្រីដូងខ្ចី</p>
                          <div className="flex items-center justify-between mt-1">
                            <span className="font-extrabold text-amber-700">$8.50</span>
                            <span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded text-[10px] font-bold">+ Add</span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white p-2.5 rounded-xl border border-stone-200 shadow-xs flex items-center gap-3">
                        <img
                          src="https://images.unsplash.com/photo-1544025162-d76694265947?w=200&auto=format&fit=crop&q=80"
                          alt="Lok Lak"
                          className="w-14 h-14 rounded-lg object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-stone-900 truncate">Kampot Pepper Lok Lak</p>
                          <p className="text-[10px] text-stone-500">ឡុកឡាក់សាច់គោ</p>
                          <div className="flex items-center justify-between mt-1">
                            <span className="font-extrabold text-amber-700">$9.00</span>
                            <span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded text-[10px] font-bold">+ Add</span>
                          </div>
                        </div>
                      </div>

                      {/* KHQR Mini Banner */}
                      <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded bg-rose-600 text-white font-extrabold text-[8px] flex items-center justify-center">
                            KHQR
                          </div>
                          <div>
                            <p className="font-bold text-rose-950 text-[10px]">Bakong Instant Pay</p>
                            <p className="text-[9px] text-rose-700">Scan & pay at table</p>
                          </div>
                        </div>
                        <span className="text-[10px] font-bold text-rose-700">0% Fee</span>
                      </div>
                    </div>

                    {/* Bottom CTA */}
                    <div className="p-3 bg-white border-t border-stone-200">
                      <button
                        onClick={() => navigate('/menu/phnom-penh-bistro')}
                        className="w-full py-2 bg-stone-950 hover:bg-stone-800 text-white rounded-lg font-bold text-xs flex items-center justify-center gap-1.5"
                      >
                        <span>Test Scan & Order Live</span>
                        <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section className="py-16 bg-white border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-xs font-bold uppercase tracking-widest text-amber-700 mb-2">Designed for Cambodian Hospitality</h2>
            <p className="text-3xl font-extrabold text-stone-900 tracking-tight">
              Everything Your Restaurant Needs to Run Smoothly
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-stone-50 border border-stone-200 hover:border-amber-400 transition-all space-y-3">
              <div className="w-12 h-12 rounded-xl bg-amber-500/15 text-amber-700 flex items-center justify-center">
                <QrCode className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-stone-900">1-Click Table QR Generator</h3>
              <p className="text-sm text-stone-600 leading-relaxed">
                Generate high-resolution printable table tent PDFs for 10 to 100+ dining tables instantly. Each QR code is tied directly to the specific table number.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-stone-50 border border-stone-200 hover:border-amber-400 transition-all space-y-3">
              <div className="w-12 h-12 rounded-xl bg-rose-500/15 text-rose-700 flex items-center justify-center">
                <CreditCard className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-stone-900">National Bakong KHQR</h3>
              <p className="text-sm text-stone-600 leading-relaxed">
                Receive payments from ABA Mobile, Bakong App, ACLEDA, Wing, and 30+ Cambodian financial institutions with zero middleman deductions.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-stone-50 border border-stone-200 hover:border-amber-400 transition-all space-y-3">
              <div className="w-12 h-12 rounded-xl bg-sky-500/15 text-sky-700 flex items-center justify-center">
                <Smartphone className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-stone-900">Telegram Kitchen Dispatch</h3>
              <p className="text-sm text-stone-600 leading-relaxed">
                When a diner places an order or calls for the bill, a clean notification pings your kitchen Telegram group bot immediately with table and item details.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Plan Comparison Section (Step 1 of Flow) */}
      <section id="plans" className="py-20 bg-stone-100/70 border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <h2 className="text-xs font-bold uppercase tracking-widest text-amber-700 mb-2">Step 1 — Pick Your Plan</h2>
            <p className="text-3xl sm:text-4xl font-extrabold text-stone-950 tracking-tight">
              Start Free or Unlock Uncapped Growth
            </p>
            <p className="text-sm text-stone-600 mt-2">
              All plans include complete menu customization, KHQR ordering, and 24/7 uptime.
            </p>

            {/* Monthly / Yearly Toggle */}
            <div className="mt-6 inline-flex items-center p-1.5 rounded-xl bg-white border border-stone-300 shadow-xs">
              <button
                id="billing-monthly-toggle"
                onClick={() => setBillingCycle('monthly')}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                  billingCycle === 'monthly'
                    ? 'bg-stone-900 text-white shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                Monthly Billing
              </button>

              <button
                id="billing-yearly-toggle"
                onClick={() => setBillingCycle('yearly')}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  billingCycle === 'yearly'
                    ? 'bg-amber-500 text-stone-950 shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <span>Annual Billing</span>
                <span className="bg-stone-900 text-amber-300 text-[10px] px-1.5 py-0.5 rounded font-bold">
                  Save 20%
                </span>
              </button>
            </div>
          </div>

          {/* 4 Plan Cards Grid */}
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

          {/* Full Feature Comparison Table */}
          <div className="mt-16 bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-stone-200 bg-stone-50 flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-lg text-stone-900">Detailed Feature Comparison</h3>
                <p className="text-xs text-stone-500 mt-0.5">Explore the exact limits and capabilities across all plans</p>
              </div>
              <button
                onClick={() => navigate('/pricing')}
                className="text-xs font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1"
              >
                <span>Full Pricing Matrix</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-stone-200 bg-stone-100/70 text-stone-700">
                    <th className="py-3 px-4 font-bold w-1/3">Feature Category</th>
                    <th className="py-3 px-3 font-bold text-center">Trial (30d)</th>
                    <th className="py-3 px-3 font-bold text-center">Normal ($7.99)</th>
                    <th className="py-3 px-3 font-bold text-center bg-amber-50/80 text-amber-900">Pro ($14.99)</th>
                    <th className="py-3 px-3 font-bold text-center">Max ($24.99)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200">
                  {COMPARISON_CATEGORIES.map((cat, catIdx) => (
                    <Fragment key={`cat-group-${catIdx}`}>
                      <tr key={`cat-${catIdx}`} className="bg-stone-50 font-bold text-stone-900">
                        <td colSpan={5} className="py-2.5 px-4 text-xs tracking-wider uppercase bg-stone-100/90 text-stone-800">
                          {cat.name}
                        </td>
                      </tr>
                      {cat.features.map((feat, featIdx) => (
                        <tr key={`feat-${catIdx}-${featIdx}`} className="hover:bg-amber-50/20">
                          <td className="py-3 px-4 font-medium text-stone-800">{feat.name}</td>
                          <td className="py-3 px-3 text-center text-stone-600 font-mono">{feat.trial}</td>
                          <td className="py-3 px-3 text-center text-stone-600 font-mono">{feat.normal}</td>
                          <td className="py-3 px-3 text-center text-stone-900 font-mono font-bold bg-amber-50/50">
                            {feat.pro}
                          </td>
                          <td className="py-3 px-3 text-center text-stone-600 font-mono">{feat.max}</td>
                        </tr>
                      ))}
                    </Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Accordion Section */}
      <section className="py-16 bg-white border-b border-stone-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-xs font-bold uppercase tracking-widest text-amber-700 mb-2">Got Questions?</h2>
            <p className="text-3xl font-extrabold text-stone-900">Frequently Asked Questions</p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="rounded-xl border border-stone-200 overflow-hidden bg-stone-50/50 hover:bg-stone-50 transition-colors"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full p-4 text-left flex items-center justify-between font-bold text-stone-900 text-sm focus:outline-none"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-stone-500 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                    />
                  </button>

                  {isOpen && (
                    <div className="px-4 pb-4 pt-1 text-xs text-stone-600 leading-relaxed border-t border-stone-200/60 bg-white">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="py-16 bg-stone-950 text-white">
        <div className="max-w-5xl mx-auto px-4 text-center space-y-6">
          <div className="w-12 h-12 bg-amber-500 text-stone-950 rounded-2xl flex items-center justify-center mx-auto">
            <UtensilsCrossed className="w-6 h-6" />
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Ready to Launch Your Digital Menu in 2 Minutes?
          </h2>

          <p className="text-stone-400 max-w-xl mx-auto text-sm leading-relaxed">
            Join hundreds of restaurants, cafes, and rooftop lounges in Phnom Penh and Siem Reap. Start your 30-day trial with full access.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <button
              id="cta-footer-register-btn"
              onClick={() => navigate('/register')}
              className="w-full sm:w-auto px-8 py-4 bg-amber-500 hover:bg-amber-400 text-stone-950 rounded-xl font-extrabold text-sm shadow-lg shadow-amber-500/20 hover:scale-105 transition-all flex items-center justify-center gap-2"
            >
              <span>Start Free 30-Day Trial</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              id="cta-footer-pricing-btn"
              onClick={() => navigate('/pricing')}
              className="w-full sm:w-auto px-6 py-4 bg-stone-900 hover:bg-stone-800 text-stone-300 border border-stone-700 rounded-xl font-bold text-sm"
            >
              Explore Pricing Plans
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
