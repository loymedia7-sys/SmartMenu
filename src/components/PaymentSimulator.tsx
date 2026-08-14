import { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { QrCode, CheckCircle2, Loader2, Sparkles, Smartphone, ShieldCheck, ArrowRight, Upload, AlertCircle, Copy, Check } from 'lucide-react';
import { PaymentSession } from '../types';
import { handlePaymentWebhook } from '../services/tenantStore';

interface PaymentSimulatorProps {
  session: PaymentSession;
  onPaymentSuccess: () => void;
}

export function PaymentSimulator({ session, onPaymentSuccess }: PaymentSimulatorProps) {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'khqr' | 'aba' | 'slip'>('khqr');
  const [isProcessing, setIsProcessing] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(15 * 60); // 15 mins
  const [copied, setCopied] = useState(false);
  const [slipFile, setSlipFile] = useState<string | null>(null);

  // Generate QR Code data URL
  useEffect(() => {
    QRCode.toDataURL(session.qrString, {
      width: 280,
      margin: 1,
      color: {
        dark: '#000000',
        light: '#ffffff',
      },
    })
      .then(url => setQrDataUrl(url))
      .catch(err => console.error(err));
  }, [session.qrString]);

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Simulate payment completion via Webhook
  const triggerSimulation = () => {
    setIsProcessing(true);
    setTimeout(() => {
      handlePaymentWebhook(
        session.transactionId,
        session.tenantSlug,
        session.plan,
        session.billingCycle
      );
      setIsProcessing(false);
      onPaymentSuccess();
    }, 1200);
  };

  const copyQrString = () => {
    navigator.clipboard.writeText(session.qrString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white rounded-2xl border border-stone-200 shadow-xl overflow-hidden max-w-lg mx-auto">
      {/* Top Method Tabs */}
      <div className="grid grid-cols-3 border-b border-stone-200 bg-stone-50 text-xs font-bold">
        <button
          id="tab-khqr-btn"
          onClick={() => setActiveTab('khqr')}
          className={`py-3.5 px-3 flex items-center justify-center gap-1.5 transition-colors border-b-2 ${
            activeTab === 'khqr'
              ? 'border-rose-600 text-rose-600 bg-white'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          <div className="w-2.5 h-2.5 rounded-full bg-rose-600" />
          <span>Bakong KHQR</span>
        </button>

        <button
          id="tab-aba-btn"
          onClick={() => setActiveTab('aba')}
          className={`py-3.5 px-3 flex items-center justify-center gap-1.5 transition-colors border-b-2 ${
            activeTab === 'aba'
              ? 'border-sky-600 text-sky-600 bg-white'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          <Smartphone className="w-4 h-4" />
          <span>ABA PAY</span>
        </button>

        <button
          id="tab-slip-btn"
          onClick={() => setActiveTab('slip')}
          className={`py-3.5 px-3 flex items-center justify-center gap-1.5 transition-colors border-b-2 ${
            activeTab === 'slip'
              ? 'border-amber-600 text-amber-600 bg-white'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          <Upload className="w-4 h-4" />
          <span>Upload Slip</span>
        </button>
      </div>

      {/* Main Content Area */}
      <div className="p-6">
        {/* KHQR Bakong Tab */}
        {activeTab === 'khqr' && (
          <div className="flex flex-col items-center text-center space-y-4">
            {/* Official KHQR Frame */}
            <div className="w-full max-w-xs bg-rose-600 rounded-2xl p-3 text-white shadow-lg relative">
              {/* KHQR Header */}
              <div className="flex items-center justify-between pb-2 border-b border-rose-500/60 mb-2.5">
                <div className="flex items-center gap-1.5">
                  <div className="bg-white text-rose-600 font-extrabold text-[10px] px-1.5 py-0.5 rounded tracking-tighter">
                    KHQR
                  </div>
                  <span className="text-[11px] font-bold tracking-tight">National Bakong QR</span>
                </div>
                <span className="text-[10px] bg-rose-700/80 px-2 py-0.5 rounded-full font-mono">
                  NBC Verified
                </span>
              </div>

              {/* QR Container */}
              <div className="bg-white rounded-xl p-3 flex flex-col items-center text-stone-950">
                <p className="text-xs font-bold text-stone-900 truncate max-w-[220px]">
                  MenuCloud Co., Ltd ({session.tenantName})
                </p>
                <div className="my-2 p-1 border border-stone-100 rounded-lg">
                  {qrDataUrl ? (
                    <img src={qrDataUrl} alt="Bakong KHQR Code" className="w-48 h-48 mx-auto" />
                  ) : (
                    <div className="w-48 h-48 flex items-center justify-center bg-stone-100 rounded">
                      <Loader2 className="w-6 h-6 animate-spin text-stone-400" />
                    </div>
                  )}
                </div>

                <div className="w-full pt-1 border-t border-stone-100 flex items-center justify-between">
                  <div className="text-left">
                    <span className="text-[10px] text-stone-400 block font-medium">Total Amount</span>
                    <span className="text-base font-extrabold text-stone-900">${session.amountUSD.toFixed(2)} USD</span>
                  </div>
                  <div className="text-right font-mono text-[11px] text-stone-500">
                    ≈ ៛{session.amountKHR.toLocaleString()} KHR
                  </div>
                </div>
              </div>

              {/* KHQR Bottom Logo Banner */}
              <div className="pt-2 flex items-center justify-center gap-2 text-[10px] text-rose-100 font-medium">
                <span>Scan with Bakong, ABA, ACLEDA, Wing, Canadia</span>
              </div>
            </div>

            {/* Polling status & timer */}
            <div className="w-full bg-stone-50 rounded-xl p-3.5 border border-stone-200 text-xs flex items-center justify-between">
              <div className="flex items-center gap-2 text-stone-700">
                <Loader2 className="w-4 h-4 text-amber-600 animate-spin" />
                <span>Waiting for customer payment...</span>
              </div>
              <span className="font-mono font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                {formatTimer(timeRemaining)}
              </span>
            </div>

            {/* Instant Demo Sandbox Simulator Action */}
            <div className="w-full pt-2">
              <button
                id="simulate-scan-btn"
                onClick={triggerSimulation}
                disabled={isProcessing}
                className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-sm shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Confirming Bakong Payment Webhook...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    <span>Simulate Successful Bank Payment Scan</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
              <p className="text-[11px] text-stone-400 mt-1.5">
                Clicking the simulator triggers the automated webhook callback to instantly activate your subscription.
              </p>
            </div>
          </div>
        )}

        {/* ABA PAY Mobile Deeplink Tab */}
        {activeTab === 'aba' && (
          <div className="space-y-4 text-center py-2">
            <div className="w-14 h-14 bg-sky-600 text-white rounded-2xl flex items-center justify-center mx-auto shadow-md">
              <Smartphone className="w-7 h-7" />
            </div>

            <div>
              <h4 className="font-bold text-stone-900 text-base">Pay directly via ABA Mobile App</h4>
              <p className="text-xs text-stone-500 mt-1">
                If you are on mobile, tap below to open ABA Mobile directly and authorize payment of{' '}
                <span className="font-bold text-stone-800">${session.amountUSD.toFixed(2)} USD</span>.
              </p>
            </div>

            <div className="p-4 bg-sky-50 rounded-xl border border-sky-100 text-left space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-stone-500">Merchant:</span>
                <span className="font-semibold text-stone-900">MenuCloud SaaS</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Account ID:</span>
                <span className="font-mono font-bold text-sky-900">000 888 777 (USD)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Invoice Ref:</span>
                <span className="font-mono text-stone-700">{session.transactionId}</span>
              </div>
            </div>

            <button
              id="aba-deeplink-btn"
              onClick={triggerSimulation}
              disabled={isProcessing}
              className="w-full py-3 px-4 bg-sky-600 hover:bg-sky-500 text-white rounded-xl font-bold text-sm shadow-md shadow-sky-600/20 flex items-center justify-center gap-2"
            >
              {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Smartphone className="w-4 h-4" />}
              <span>Open & Pay via ABA Mobile</span>
            </button>
          </div>
        )}

        {/* Bank Transfer Slip Upload Tab */}
        {activeTab === 'slip' && (
          <div className="space-y-4 text-center py-2">
            <div className="border-2 border-dashed border-stone-300 hover:border-amber-500 rounded-2xl p-6 transition-all bg-stone-50/50 flex flex-col items-center justify-center cursor-pointer">
              <Upload className="w-8 h-8 text-stone-400 mb-2" />
              <p className="text-sm font-semibold text-stone-800">
                {slipFile ? 'Slip Uploaded: transfer_receipt.jpg' : 'Upload Bank Transfer Slip'}
              </p>
              <p className="text-xs text-stone-400 mt-1">PNG, JPG, or PDF up to 10MB</p>
              
              <button
                id="mock-upload-slip-btn"
                onClick={() => setSlipFile('transfer_receipt.jpg')}
                className="mt-3 px-3 py-1.5 bg-stone-200 hover:bg-stone-300 text-stone-800 rounded-lg text-xs font-semibold"
              >
                {slipFile ? 'Change File' : 'Select Sample Slip'}
              </button>
            </div>

            <button
              id="confirm-slip-btn"
              onClick={triggerSimulation}
              disabled={isProcessing}
              className="w-full py-3 px-4 bg-amber-500 hover:bg-amber-600 text-stone-950 rounded-xl font-bold text-sm shadow-sm flex items-center justify-center gap-2"
            >
              {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
              <span>Submit Slip for Instant Verification</span>
            </button>
          </div>
        )}
      </div>

      {/* Footer info */}
      <div className="px-6 py-3 bg-stone-50 border-t border-stone-200 flex items-center justify-between text-[11px] text-stone-500">
        <div className="flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Secured by NBC Bakong Gateway</span>
        </div>
        <button
          onClick={copyQrString}
          className="hover:text-stone-800 flex items-center gap-1 font-mono text-[10px]"
        >
          {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
          <span>{copied ? 'Copied' : 'Copy EMV Payload'}</span>
        </button>
      </div>
    </div>
  );
}
