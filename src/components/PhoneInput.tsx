import { Phone, CheckCircle2, AlertCircle } from 'lucide-react';

interface PhoneInputProps {
  value: string;
  countryCode: string;
  onChange: (phone: string) => void;
  onCountryCodeChange: (code: string) => void;
  error?: string;
  id?: string;
}

const COUNTRY_CODES = [
  { code: '+855', country: 'Cambodia 🇰🇭', placeholder: '12 345 678', minLen: 8 },
  { code: '+66', country: 'Thailand 🇹🇭', placeholder: '81 234 5678', minLen: 9 },
  { code: '+84', country: 'Vietnam 🇻🇳', placeholder: '91 234 5678', minLen: 9 },
  { code: '+65', country: 'Singapore 🇸🇬', placeholder: '8123 4567', minLen: 8 },
  { code: '+1', country: 'USA / Canada 🇺🇸', placeholder: '202 555 0123', minLen: 10 },
  { code: '+33', country: 'France 🇫🇷', placeholder: '6 12 34 56 78', minLen: 9 },
];

export function PhoneInput({
  value,
  countryCode,
  onChange,
  onCountryCodeChange,
  error,
  id = 'phone-input',
}: PhoneInputProps) {
  const currentCountry = COUNTRY_CODES.find(c => c.code === countryCode) || COUNTRY_CODES[0];
  const digitsOnly = value.replace(/\D/g, '');
  const isValidLength = digitsOnly.length >= currentCountry.minLen;

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label htmlFor={id} className="block text-xs font-bold uppercase tracking-wider text-stone-700">
          Phone Number <span className="text-rose-500">*</span>
        </label>
        <span className="text-[11px] text-stone-400">Used for OTP verification & Telegram bot</span>
      </div>

      <div className="flex rounded-xl border border-stone-300 focus-within:border-amber-500 focus-within:ring-2 focus-within:ring-amber-500/20 bg-white transition-all overflow-hidden">
        {/* Country Code Select */}
        <select
          id={`${id}-country-code`}
          value={countryCode}
          onChange={(e) => onCountryCodeChange(e.target.value)}
          className="bg-stone-50 border-r border-stone-200 px-3 py-2.5 text-xs font-semibold text-stone-800 focus:outline-none cursor-pointer hover:bg-stone-100"
        >
          {COUNTRY_CODES.map((c) => (
            <option key={c.code} value={c.code}>
              {c.code} ({c.country})
            </option>
          ))}
        </select>

        {/* Number Input */}
        <div className="relative flex-1 flex items-center">
          <input
            id={id}
            type="tel"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={`e.g. ${currentCountry.placeholder}`}
            className="w-full px-3 py-2.5 text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none"
          />

          {digitsOnly.length > 0 && (
            <div className="pr-3">
              {isValidLength ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              ) : (
                <AlertCircle className="w-4 h-4 text-amber-500" />
              )}
            </div>
          )}
        </div>
      </div>

      {error ? (
        <p className="text-xs text-rose-600 font-medium flex items-center gap-1">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          {error}
        </p>
      ) : (
        <p className="text-[11px] text-stone-500">
          Format: {countryCode} {currentCountry.placeholder} (ABA/Bakong & Telegram compatible)
        </p>
      )}
    </div>
  );
}
