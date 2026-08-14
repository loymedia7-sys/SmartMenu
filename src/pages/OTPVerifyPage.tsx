import { useState, useEffect, useRef, FormEvent, KeyboardEvent, ClipboardEvent } from 'react';
import { 
  ShieldCheck, 
  Send, 
  Smartphone, 
  ArrowRight, 
  RotateCw, 
  AlertCircle, 
  Sparkles, 
  CheckCircle2, 
  ChevronLeft
} from 'lucide-react';
import { getOTPState, verifyOTP, createTenant, sendOTP } from '../services/tenantStore';
import { RegistrationFormData } from '../types';

interface OTPVerifyPageProps {
  navigate: (path: string) => void;
  plan?: string;
  slug?: string;
}

export function OTPVerifyPage({ navigate, plan = 'trial', slug = '' }: OTPVerifyPageProps) {
  const [digits, setDigits] = useState(['', '', '', '', '', '']);
  const [method, setMethod] = useState<'telegram' | 'sms'>('telegram');
  const [resendTimer, setResendTimer] = useState(60);
  const [error, setError] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [otpInfo, setOtpInfo] = useState<{ phone: string; countryCode: string } | null>(null);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    const state = getOTPState();
    if (state) {
      setOtpInfo({ phone: state.phone, countryCode: state.countryCode });
      setMethod(state.method);
    }
  }, []);

  // Resend countdown
  useEffect(() => {
    const interval = setInterval(() => {
      setResendTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Handle single digit input
  const handleDigitChange = (index: number, value: string) => {
    const clean = value.replace(/\D/g, '');
    if (!clean) {
      const next = [...digits];
      next[index] = '';
      setDigits(next);
      return;
    }

    const val = clean[clean.length - 1]; // take last entered digit
    const next = [...digits];
    next[index] = val;
    setDigits(next);

    // Auto-focus next input
    if (index < 5 && val) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Handle backspace
  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Handle paste full 6-digit code
  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted.length > 0) {
      const next = [...digits];
      for (let i = 0; i < 6; i++) {
        next[i] = pasted[i] || '';
      }
      setDigits(next);
      const focusIndex = Math.min(pasted.length, 5);
      inputRefs.current[focusIndex]?.focus();
    }
  };

  // Auto-fill demo helper
  const handleAutoFillDemo = () => {
    setDigits(['1', '2', '3', '4', '5', '6']);
    setError(null);
  };

  // Resend code
  const handleResend = () => {
    if (resendTimer > 0) return;
    const state = getOTPState();
    if (state) {
      sendOTP(state.phone, state.countryCode, method, state.pendingTenantData);
      setResendTimer(60);
      setError(null);
    }
  };

  // Final confirmation
  const handleVerify = (skip = false) => {
    setError(null);
    setIsVerifying(true);

    const fullCode = digits.join('');
    
    if (!skip && fullCode.length !== 6) {
      setError('Please enter all 6 digits of the verification code.');
      setIsVerifying(false);
      return;
    }

    // Verify OTP state
    const result = skip ? { success: true, pendingData: getOTPState()?.pendingTenantData } : verifyOTP(fullCode);

    if (!result.success) {
      setError(result.error || 'Verification failed. Please check the code.');
      setIsVerifying(false);
      return;
    }

    // If pending tenant data was stored, finalize tenant creation
    const pending = result.pendingData;
    if (pending) {
      const creation = createTenant(pending, { phoneVerified: !skip });
      setIsVerifying(false);

      if (!creation.success) {
        setError(creation.error || 'Account creation error.');
        return;
      }

      if (pending.selectedPlan === 'trial') {
        navigate(`/register/success?slug=${pending.slug}&plan=trial`);
      } else {
        navigate(`/checkout/${pending.selectedPlan}?slug=${pending.slug}&cycle=${pending.billingCycle}`);
      }
    } else {
      // Fallback if accessed directly with URL params
      setIsVerifying(false);
      if (plan === 'trial') {
        navigate(`/register/success?slug=${slug || 'demo-shop'}&plan=trial`);
      } else {
        navigate(`/checkout/${plan}?slug=${slug || 'demo-shop'}`);
      }
    }
  };

  const isComplete = digits.every((d) => d !== '');

  return (
    <div className="min-h-screen bg-stone-100/60 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-md w-full">
        {/* Top Back Link */}
        <button
          onClick={() => navigate('/register')}
          className="mb-4 text-xs font-semibold text-stone-500 hover:text-stone-800 flex items-center gap-1"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Registration</span>
        </button>

        {/* Verification Card */}
        <div className="bg-white rounded-3xl border border-stone-200 shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-stone-900 text-white p-6 text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-amber-500 text-stone-950 flex items-center justify-center mx-auto shadow-md">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <span className="text-[11px] uppercase font-extrabold tracking-wider bg-amber-500/20 text-amber-300 px-3 py-0.5 rounded-full inline-block">
              Step 3 of 4 • Phone Verification
            </span>
            <h1 className="text-xl font-bold text-white">Verify Your Phone Number</h1>
            <p className="text-xs text-stone-400 max-w-xs mx-auto">
              We sent a 6-digit verification code to{' '}
              <span className="font-mono text-stone-200 font-semibold">
                {otpInfo ? `${otpInfo.countryCode} ${otpInfo.phone}` : 'your phone'}
              </span>
            </p>
          </div>

          {/* Delivery Method Selector */}
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-2 gap-2 bg-stone-100 p-1 rounded-xl text-xs font-bold">
              <button
                type="button"
                onClick={() => setMethod('telegram')}
                className={`py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                  method === 'telegram'
                    ? 'bg-sky-600 text-white shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <Send className="w-3.5 h-3.5" />
                <span>Telegram Bot</span>
              </button>

              <button
                type="button"
                onClick={() => setMethod('sms')}
                className={`py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                  method === 'sms'
                    ? 'bg-stone-900 text-white shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>SMS Message</span>
              </button>
            </div>

            {/* Error banner */}
            {error && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* 6-Digit Inputs */}
            <div className="space-y-3">
              <label className="block text-center text-xs font-bold uppercase tracking-wider text-stone-600">
                Enter 6-Digit Code
              </label>

              <div className="flex justify-center gap-2 sm:gap-3" onPaste={handlePaste}>
                {digits.map((digit, idx) => (
                  <input
                    key={idx}
                    ref={(el) => (inputRefs.current[idx] = el)}
                    id={`otp-digit-${idx}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleDigitChange(idx, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(idx, e)}
                    className="w-11 h-13 sm:w-12 sm:h-14 text-center text-xl font-extrabold font-mono rounded-xl border-2 border-stone-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 bg-stone-50 focus:bg-white transition-all text-stone-900 focus:outline-none"
                  />
                ))}
              </div>

              {/* Demo Helper Button */}
              <div className="text-center pt-1">
                <button
                  type="button"
                  id="autofill-otp-btn"
                  onClick={handleAutoFillDemo}
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 px-3 py-1.5 rounded-lg border border-amber-200 transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  <span>Auto-fill Demo Code (123456)</span>
                </button>
              </div>
            </div>

            {/* Resend & Action Buttons */}
            <div className="space-y-3 pt-2">
              <button
                type="button"
                id="verify-submit-btn"
                onClick={() => handleVerify(false)}
                disabled={!isComplete || isVerifying}
                className={`w-full py-3.5 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-md transition-all ${
                  isComplete && !isVerifying
                    ? 'bg-amber-500 hover:bg-amber-600 text-stone-950 shadow-amber-500/20 cursor-pointer hover:scale-[1.01]'
                    : 'bg-stone-200 text-stone-400 cursor-not-allowed'
                }`}
              >
                <span>Confirm & Provision Account</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-between text-xs text-stone-500 pt-1">
                <span>Didn't get the code?</span>
                <button
                  type="button"
                  id="resend-otp-btn"
                  disabled={resendTimer > 0}
                  onClick={handleResend}
                  className={`font-semibold flex items-center gap-1 ${
                    resendTimer > 0 ? 'text-stone-400 cursor-not-allowed' : 'text-amber-700 hover:text-amber-800'
                  }`}
                >
                  <RotateCw className="w-3.5 h-3.5" />
                  <span>{resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend Code'}</span>
                </button>
              </div>

              {/* Optional MVP Skip action */}
              <div className="pt-3 border-t border-stone-100 text-center">
                <button
                  type="button"
                  id="skip-otp-btn"
                  onClick={() => handleVerify(true)}
                  className="text-xs text-stone-500 hover:text-stone-800 font-medium underline"
                >
                  Skip verification for now (Launch MVP mode)
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
