import { useState, useEffect, FormEvent } from 'react';
import { 
  UtensilsCrossed, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Lock, 
  Mail, 
  User, 
  Store, 
  ShieldCheck, 
  AlertCircle,
  Eye,
  EyeOff,
  KeyRound
} from 'lucide-react';
import { PlanId, BillingCycle, RegistrationFormData } from '../types';
import { PLANS } from '../data/plans';
import { PhoneInput } from '../components/PhoneInput';
import { generateSlug, createTenant, sendOTP } from '../services/tenantStore';

interface RegisterPageProps {
  navigate: (path: string) => void;
  initialPlan?: PlanId;
  initialCycle?: BillingCycle;
}

export function RegisterPage({ navigate, initialPlan = 'trial', initialCycle = 'monthly' }: RegisterPageProps) {
  const [formData, setFormData] = useState<RegistrationFormData>({
    businessName: '',
    slug: '',
    ownerName: '',
    phone: '',
    countryCode: '+855',
    email: '',
    password: '',
    confirmPassword: '',
    selectedPlan: initialPlan,
    billingCycle: initialCycle,
    agreeTerms: true,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [enableOTPStep, setEnableOTPStep] = useState(true);

  // Sync plan if initialPlan prop changes
  useEffect(() => {
    if (initialPlan) {
      setFormData(prev => ({ ...prev, selectedPlan: initialPlan }));
    }
  }, [initialPlan]);

  // Auto-generate slug when businessName changes
  const handleBusinessNameChange = (name: string) => {
    setFormData(prev => ({
      ...prev,
      businessName: name,
      slug: generateSlug(name) || `shop-${Date.now()}`,
    }));
  };

  // Real-time validations
  const isBusinessNameValid = formData.businessName.trim().length >= 2;
  const isOwnerNameValid = formData.ownerName.trim().length >= 2;
  const isPhoneValid = formData.phone.replace(/\D/g, '').length >= 8;
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim());
  const isPasswordLengthValid = formData.password.length >= 6;
  const doPasswordsMatch = formData.password.length > 0 && formData.password === formData.confirmPassword;
  
  // Submit is enabled only when all mandatory criteria pass
  const isFormValid = 
    isBusinessNameValid &&
    isOwnerNameValid &&
    isPhoneValid &&
    isEmailValid &&
    isPasswordLengthValid &&
    doPasswordsMatch &&
    formData.agreeTerms;

  // "Continue with Google" Auth Simulation
  const handleGoogleAuthFill = () => {
    setFormData(prev => {
      const gName = 'Sophea Pich';
      const gEmail = 'sophea.pich@gmail.com';
      const sampleShop = prev.businessName || 'Angkor Garden Cafe';
      const autoSlug = generateSlug(sampleShop) || `shop-${Date.now()}`;
      return {
        ...prev,
        ownerName: gName,
        email: gEmail,
        businessName: sampleShop,
        slug: autoSlug,
        phone: prev.phone || '12888999',
        password: 'Password123!',
        confirmPassword: 'Password123!',
      };
    });
  };

  // Submit Handler
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!isFormValid) {
      if (!isPasswordLengthValid) setFormError('Password must be at least 6 characters');
      else if (!doPasswordsMatch) setFormError('Passwords do not match');
      else setFormError('Please fill in all required fields accurately.');
      return;
    }

    const resolvedSlug = formData.slug || generateSlug(formData.businessName) || `shop-${Date.now()}`;
    const payload = { ...formData, slug: resolvedSlug };

    setIsSubmitting(true);

    // If phone OTP verification is enabled (Step 3)
    if (enableOTPStep) {
      sendOTP(formData.phone, formData.countryCode, 'telegram', payload);
      setIsSubmitting(false);
      navigate(`/register/verify?plan=${formData.selectedPlan}&slug=${resolvedSlug}`);
      return;
    }

    // Direct account creation (Step 4)
    const result = createTenant(payload, { phoneVerified: false });
    setIsSubmitting(false);

    if (!result.success) {
      setFormError(result.error || 'Failed to create tenant account.');
      return;
    }

    // Check if free trial or paid plan
    if (formData.selectedPlan === 'trial') {
      navigate(`/register/success?slug=${resolvedSlug}&plan=trial`);
    } else {
      navigate(`/checkout/${formData.selectedPlan}?slug=${resolvedSlug}&cycle=${formData.billingCycle}`);
    }
  };

  const selectedPlanInfo = PLANS[formData.selectedPlan];

  return (
    <div className="min-h-screen bg-stone-100/60 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Form Container Card */}
        <div className="bg-white rounded-3xl border border-stone-200 shadow-xl overflow-hidden">
          {/* Header Banner */}
          <div className="bg-stone-900 text-white p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-amber-500 text-stone-950 text-xs uppercase font-extrabold px-2.5 py-1 rounded-full">
                    Step 2 of 4 • Account Setup
                  </span>
                  <span className="text-stone-400 text-xs">SmartMenu Onboarding</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  Create Your Restaurant Account
                </h1>
                <p className="text-xs sm:text-sm text-stone-400 mt-1">
                  Launch your digital QR menu in under 2 minutes. No credit card required for trial.
                </p>
              </div>

              {/* Plan Snapshot Badge */}
              <div className="bg-stone-800 border border-stone-700/80 rounded-2xl p-3.5 text-right shrink-0">
                <span className="text-[10px] text-stone-400 uppercase font-semibold block">Selected Plan</span>
                <span className="text-base font-bold text-amber-400">{selectedPlanInfo.name}</span>
                <span className="text-xs text-stone-300 block font-mono">
                  {selectedPlanInfo.id === 'trial' ? 'Free 30 Days' : `$${selectedPlanInfo.priceMonthlyUSD}/month`}
                </span>
              </div>
            </div>
          </div>

          {/* Form Body */}
          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
            {/* Step 1: Plan Picker Bar */}
            <div className="space-y-2 pb-4 border-b border-stone-100">
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700">
                Select Your Plan
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {Object.values(PLANS).map((p) => {
                  const isSelected = formData.selectedPlan === p.id;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      id={`plan-choice-${p.id}`}
                      onClick={() => setFormData(prev => ({ ...prev, selectedPlan: p.id }))}
                      className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
                        isSelected
                          ? 'border-amber-500 bg-amber-50/50 ring-2 ring-amber-500/20 text-stone-950'
                          : 'border-stone-200 bg-stone-50 hover:bg-white text-stone-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold">{p.name}</span>
                        {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 shrink-0" />}
                      </div>
                      <span className="text-xs font-bold font-mono mt-1 text-stone-900">
                        {p.id === 'trial' ? '$0' : `$${p.priceMonthlyUSD}/mo`}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quick Google Sign In */}
            <div className="space-y-2">
              <button
                type="button"
                id="google-auth-btn"
                onClick={handleGoogleAuthFill}
                className="w-full py-3 px-4 rounded-xl border border-stone-300 bg-white hover:bg-stone-50 text-stone-800 font-semibold text-xs flex items-center justify-center gap-3 transition-colors shadow-xs"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Auto-Fill with Google Account (Demo)</span>
              </button>

              <div className="relative flex py-1 items-center">
                <div className="flex-grow border-t border-stone-200"></div>
                <span className="flex-shrink mx-4 text-[11px] text-stone-400 uppercase font-bold tracking-wider">
                  or register with email & phone
                </span>
                <div className="flex-grow border-t border-stone-200"></div>
              </div>
            </div>

            {/* Error Banner */}
            {formError && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            {/* Form Fields Grid */}
            <div className="space-y-4">
              {/* Business Name */}
              <div className="space-y-1.5">
                <label htmlFor="business-name" className="block text-xs font-bold uppercase tracking-wider text-stone-700">
                  Business / Restaurant Name <span className="text-rose-500">*</span>
                </label>
                <div className="relative rounded-xl border border-stone-300 focus-within:border-amber-500 focus-within:ring-2 focus-within:ring-amber-500/20 bg-white transition-all">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
                    <Store className="w-4 h-4" />
                  </div>
                  <input
                    id="business-name"
                    type="text"
                    required
                    value={formData.businessName}
                    onChange={(e) => handleBusinessNameChange(e.target.value)}
                    placeholder="e.g. Phnom Penh Bistro & Cafe"
                    className="w-full pl-9 pr-4 py-2.5 text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none"
                  />
                </div>
              </div>

              {/* Owner Name & Email 2-col */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Owner Name */}
                <div className="space-y-1.5">
                  <label htmlFor="owner-name" className="block text-xs font-bold uppercase tracking-wider text-stone-700">
                    Owner Full Name <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative rounded-xl border border-stone-300 focus-within:border-amber-500 focus-within:ring-2 focus-within:ring-amber-500/20 bg-white transition-all">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
                      <User className="w-4 h-4" />
                    </div>
                    <input
                      id="owner-name"
                      type="text"
                      required
                      value={formData.ownerName}
                      onChange={(e) => setFormData(prev => ({ ...prev, ownerName: e.target.value }))}
                      placeholder="e.g. Sokha Chan"
                      className="w-full pl-9 pr-4 py-2.5 text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Email Address */}
                <div className="space-y-1.5">
                  <label htmlFor="email-input" className="block text-xs font-bold uppercase tracking-wider text-stone-700">
                    Email Address <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative rounded-xl border border-stone-300 focus-within:border-amber-500 focus-within:ring-2 focus-within:ring-amber-500/20 bg-white transition-all">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      id="email-input"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="sokha@restaurant.com"
                      className="w-full pl-9 pr-4 py-2.5 text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Phone Input */}
              <PhoneInput
                value={formData.phone}
                countryCode={formData.countryCode}
                onChange={(phone) => setFormData(prev => ({ ...prev, phone }))}
                onCountryCodeChange={(code) => setFormData(prev => ({ ...prev, countryCode: code }))}
                id="phone-field"
              />

              {/* Password & Confirm Password (Real-Time Validation) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Password */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label htmlFor="password-input" className="block text-xs font-bold uppercase tracking-wider text-stone-700">
                      Password <span className="text-rose-500">*</span>
                    </label>
                    <span className={`text-[10px] font-semibold ${isPasswordLengthValid ? 'text-emerald-600' : 'text-stone-400'}`}>
                      Min 6 chars
                    </span>
                  </div>
                  <div className="relative rounded-xl border border-stone-300 focus-within:border-amber-500 focus-within:ring-2 focus-within:ring-amber-500/20 bg-white transition-all">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      id="password-input"
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={formData.password}
                      onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                      placeholder="••••••••"
                      className="w-full pl-9 pr-10 py-2.5 text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-stone-400 hover:text-stone-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label htmlFor="confirm-password-input" className="block text-xs font-bold uppercase tracking-wider text-stone-700">
                      Confirm Password <span className="text-rose-500">*</span>
                    </label>
                    {formData.confirmPassword.length > 0 && (
                      <span className={`text-[10px] font-bold ${doPasswordsMatch ? 'text-emerald-600' : 'text-rose-500'}`}>
                        {doPasswordsMatch ? '✓ Passwords Match' : '✗ Do Not Match'}
                      </span>
                    )}
                  </div>
                  <div className={`relative rounded-xl border transition-all ${
                    formData.confirmPassword.length > 0
                      ? doPasswordsMatch
                        ? 'border-emerald-500 bg-emerald-50/20'
                        : 'border-rose-400 bg-rose-50/20'
                      : 'border-stone-300 bg-white focus-within:border-amber-500'
                  }`}>
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
                      <KeyRound className="w-4 h-4" />
                    </div>
                    <input
                      id="confirm-password-input"
                      type={showConfirmPassword ? 'text' : 'password'}
                      required
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                      placeholder="••••••••"
                      className="w-full pl-9 pr-10 py-2.5 text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-stone-400 hover:text-stone-600"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* OTP Phone Verification Option (Step 3 Config) */}
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <input
                    id="enable-otp-checkbox"
                    type="checkbox"
                    checked={enableOTPStep}
                    onChange={(e) => setEnableOTPStep(e.target.checked)}
                    className="w-4 h-4 text-amber-600 rounded border-stone-300 focus:ring-amber-500"
                  />
                  <label htmlFor="enable-otp-checkbox" className="text-xs text-stone-700 font-medium">
                    Include Step 3: Phone/Telegram OTP Verification (Recommended)
                  </label>
                </div>
                <span className="text-[10px] text-stone-400">Confirms real phone</span>
              </div>
            </div>

            {/* Terms & Submit Button */}
            <div className="pt-4 border-t border-stone-200 space-y-4">
              <div className="flex items-start gap-2">
                <input
                  id="agree-terms"
                  type="checkbox"
                  checked={formData.agreeTerms}
                  onChange={(e) => setFormData(prev => ({ ...prev, agreeTerms: e.target.checked }))}
                  className="w-4 h-4 mt-0.5 text-amber-600 rounded border-stone-300 focus:ring-amber-500"
                />
                <label htmlFor="agree-terms" className="text-xs text-stone-600">
                  I agree to the SmartMenu Terms of Service and Privacy Policy. I confirm I am the authorized owner or manager of this food establishment.
                </label>
              </div>

              <button
                type="submit"
                id="submit-registration-btn"
                disabled={!isFormValid || isSubmitting}
                className={`w-full py-4 px-6 rounded-xl font-extrabold text-base flex items-center justify-center gap-2 shadow-lg transition-all ${
                  isFormValid && !isSubmitting
                    ? 'bg-amber-500 hover:bg-amber-600 text-stone-950 shadow-amber-500/25 hover:scale-[1.01] cursor-pointer'
                    : 'bg-stone-200 text-stone-400 cursor-not-allowed shadow-none'
                }`}
              >
                <span>
                  {formData.selectedPlan === 'trial'
                    ? enableOTPStep
                      ? 'Continue to Phone OTP Verification'
                      : 'Create Free Account & Provision Menu'
                    : enableOTPStep
                    ? 'Continue to Verification & Checkout'
                    : 'Proceed to Payment (Bakong KHQR)'}
                </span>
                <ArrowRight className="w-5 h-5" />
              </button>

              {!isFormValid && (
                <p className="text-center text-[11px] text-stone-400">
                  * Complete all required fields and matching passwords to proceed.
                </p>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
