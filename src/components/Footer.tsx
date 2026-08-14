import { UtensilsCrossed, ShieldCheck, QrCode, Phone, Mail, Send, CheckCircle2 } from 'lucide-react';

interface FooterProps {
  navigate: (path: string) => void;
}

export default function Footer({ navigate }: FooterProps) {
  return (
    <footer className="bg-stone-950 text-stone-300 border-t border-stone-800">
      {/* Top Value Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8 border-b border-stone-800/80">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-sm">
          <div className="flex items-center gap-3 bg-stone-900/60 p-4 rounded-xl border border-stone-800">
            <div className="w-10 h-10 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <p className="font-semibold text-white">Instant QR Generation</p>
              <p className="text-xs text-stone-400">Generate high-res table tent PDFs in 1-click</p>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-stone-900/60 p-4 rounded-xl border border-stone-800">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="font-semibold text-white">National Bakong KHQR</p>
              <p className="text-xs text-stone-400">Direct settlement to your ABA or Bakong account</p>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-stone-900/60 p-4 rounded-xl border border-stone-800">
            <div className="w-10 h-10 rounded-lg bg-sky-500/10 text-sky-400 flex items-center justify-center shrink-0">
              <Send className="w-5 h-5" />
            </div>
            <div>
              <p className="font-semibold text-white">Telegram Order Bot</p>
              <p className="text-xs text-stone-400">Live order pings directly to your phone & kitchen</p>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-stone-900/60 p-4 rounded-xl border border-stone-800">
            <div className="w-10 h-10 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <p className="font-semibold text-white">30-Day Free Trial</p>
              <p className="text-xs text-stone-400">No credit card or upfront commitment required</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-500 flex items-center justify-center text-stone-950 font-bold">
                <UtensilsCrossed className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-xl text-white tracking-tight">SmartMenu</span>
            </div>
            <p className="text-sm text-stone-400 max-w-sm leading-relaxed">
              Empowering Cambodian restaurants, cafes, and bars with lightning-fast digital QR menus, bilingual Khmer & English ordering, and seamless Bakong KHQR checkout.
            </p>
            <div className="flex items-center gap-3 text-xs text-stone-400">
              <span className="px-2.5 py-1 rounded bg-stone-800 text-stone-300 font-mono">Battambang, Cambodia</span>
              <span>•</span>
              <span>English & ភាសាខ្មែរ</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3 text-sm">
            <p className="font-semibold text-white tracking-wide uppercase text-xs">Pages & Flow</p>
            <ul className="space-y-2">
              <li>
                <button onClick={() => navigate('/')} className="hover:text-amber-400 transition-colors">
                  Overview & Demo
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/pricing')} className="hover:text-amber-400 transition-colors">
                  Subscription Plans
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/register')} className="hover:text-amber-400 transition-colors">
                  Register 30-Day Free Trial
                </button>
              </li>
            </ul>
          </div>

          {/* Plans */}
          <div className="space-y-3 text-sm">
            <p className="font-semibold text-white tracking-wide uppercase text-xs">SmartMenu Plans</p>
            <ul className="space-y-2 text-stone-400">
              <li>
                <button onClick={() => navigate('/register?plan=trial')} className="hover:text-amber-400 transition-colors">
                  30-Day Free Trial ($0)
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/checkout/normal')} className="hover:text-amber-400 transition-colors">
                  Normal Plan ($7.99/mo)
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/checkout/pro')} className="hover:text-amber-400 transition-colors">
                  Pro Plan ($14.99/mo)
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/checkout/max')} className="hover:text-amber-400 transition-colors">
                  Max Enterprise ($24.99/mo)
                </button>
              </li>
            </ul>
          </div>

          {/* Support & Contact */}
          <div className="space-y-3 text-sm">
            <p className="font-semibold text-white tracking-wide uppercase text-xs">Support & Contact</p>
            <div className="space-y-2 text-stone-400">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-amber-500 shrink-0" />
                <div className="flex flex-col text-xs">
                  <a href="tel:087579737" className="hover:text-amber-400 transition-colors font-mono">087 579 737</a>
                  <a href="tel:060295918" className="hover:text-amber-400 transition-colors font-mono">060 295 918</a>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Send className="w-4 h-4 text-sky-400 shrink-0" />
                <a
                  href="https://t.me/SmartMenu7"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-sky-400 transition-colors text-xs"
                >
                  t.me/SmartMenu7
                </a>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-blue-500 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                <a
                  href="https://facebook.com/SmartMenu"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-blue-400 transition-colors text-xs"
                >
                  Page: SmartMenu
                </a>
              </div>
              <div className="flex items-center gap-2 text-xs text-stone-400">
                <span className="font-semibold text-stone-300">Location:</span>
                <span>Battambang</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="mt-10 pt-6 border-t border-stone-800/60 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 gap-4">
          <p>© {new Date().getFullYear()} SmartMenu Technologies Co., Ltd. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="hover:text-stone-400 cursor-pointer">Privacy Policy</span>
            <span>•</span>
            <span className="hover:text-stone-400 cursor-pointer">Terms of Service</span>
            <span>•</span>
            <span className="hover:text-stone-400 cursor-pointer">Bakong KHQR Partner</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
