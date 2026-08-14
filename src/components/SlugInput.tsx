import { useState, useEffect } from 'react';
import { Globe, CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { checkSlugAvailable } from '../services/tenantStore';

interface SlugInputProps {
  slug: string;
  onChange: (slug: string) => void;
  onAvailabilityChange?: (isAvailable: boolean) => void;
  id?: string;
}

export function SlugInput({
  slug,
  onChange,
  onAvailabilityChange,
  id = 'slug-input',
}: SlugInputProps) {
  const [checking, setChecking] = useState(false);
  const [status, setStatus] = useState<{ available: boolean; reason?: string }>({ available: true });

  useEffect(() => {
    if (!slug) {
      setStatus({ available: false, reason: 'Please specify a shop URL' });
      onAvailabilityChange?.(false);
      return;
    }

    setChecking(true);
    const timer = setTimeout(() => {
      const result = checkSlugAvailable(slug);
      setStatus(result);
      onAvailabilityChange?.(result.available);
      setChecking(false);
    }, 200);

    return () => clearTimeout(timer);
  }, [slug]);

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label htmlFor={id} className="block text-xs font-bold uppercase tracking-wider text-stone-700">
          Digital Menu URL (Slug) <span className="text-rose-500">*</span>
        </label>
        <span className="text-[11px] text-stone-400">Shareable to customers via QR & link</span>
      </div>

      <div className="flex items-center rounded-xl border border-stone-300 focus-within:border-amber-500 focus-within:ring-2 focus-within:ring-amber-500/20 bg-white transition-all overflow-hidden">
        <span className="bg-stone-50 border-r border-stone-200 px-3 py-2.5 text-xs font-mono font-medium text-stone-500 select-none">
          menucloud.app/menu/
        </span>
        
        <input
          id={id}
          type="text"
          value={slug}
          onChange={(e) => {
            const sanitized = e.target.value
              .toLowerCase()
              .replace(/[^a-z0-9-]/g, '')
              .replace(/-+/g, '-');
            onChange(sanitized);
          }}
          placeholder="your-shop-name"
          className="flex-1 px-3 py-2.5 text-sm font-mono text-stone-900 placeholder:text-stone-300 focus:outline-none"
        />

        <div className="pr-3 flex items-center">
          {checking ? (
            <Loader2 className="w-4 h-4 text-stone-400 animate-spin" />
          ) : status.available ? (
            <div className="flex items-center gap-1 text-emerald-600 text-xs font-semibold">
              <CheckCircle2 className="w-4 h-4" />
              <span className="hidden sm:inline">Available</span>
            </div>
          ) : (
            <div className="flex items-center gap-1 text-rose-600 text-xs font-semibold">
              <XCircle className="w-4 h-4" />
              <span className="hidden sm:inline">Taken</span>
            </div>
          )}
        </div>
      </div>

      {!status.available && status.reason && (
        <p className="text-xs text-rose-600 font-medium">{status.reason}</p>
      )}

      {status.available && slug.length >= 3 && (
        <p className="text-[11px] text-emerald-700 flex items-center gap-1 font-medium">
          <Globe className="w-3.5 h-3.5" />
          Your customers will order at: <span className="font-mono font-semibold underline">menucloud.app/menu/{slug}</span>
        </p>
      )}
    </div>
  );
}
