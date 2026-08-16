import React, { useState, useEffect } from 'react';
import { 
  X, CheckCircle2, QrCode, Smartphone, ShieldCheck, ArrowRight, 
  Lock, RefreshCw, AlertCircle, Sparkles, Zap, Check 
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function UpiPaymentModal({ orderTotal, upiIdInput, selectedApp, onClose, onPaymentSuccess }) {
  const [activeTab, setActiveTab] = useState('qr'); // 'qr', 'vpa', 'apps'
  const [vpaId, setVpaId] = useState(upiIdInput || 'customer@okaxis');
  const [selectedUpiApp, setSelectedUpiApp] = useState(selectedApp || 'gpay');
  const [step, setStep] = useState('gateway'); // 'gateway', 'notification', 'pin', 'verifying', 'success'
  
  // Timer: 4 minutes 59 seconds
  const [timeLeft, setTimeLeft] = useState(299);
  const [enteredPin, setEnteredPin] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleSendPaymentRequest = () => {
    if (activeTab === 'vpa' && !vpaId.includes('@')) {
      setErrorMsg('Please enter a valid UPI VPA ID (e.g. name@okaxis or 9876543210@paytm)');
      return;
    }
    setErrorMsg('');
    setStep('notification');
  };

  const handleKeypadPress = (val) => {
    if (enteredPin.length < 4) {
      setEnteredPin(prev => prev + val);
    }
  };

  const handleKeypadDelete = () => {
    setEnteredPin(prev => prev.slice(0, -1));
  };

  const handlePinSubmit = () => {
    if (enteredPin.length < 4) {
      setErrorMsg('Please enter your 4-digit UPI PIN');
      return;
    }
    setErrorMsg('');
    setStep('verifying');

    setTimeout(() => {
      setStep('success');
      try {
        confetti({
          particleCount: 150,
          spread: 90,
          origin: { y: 0.5 }
        });
      } catch (err) {}

      setTimeout(() => {
        onPaymentSuccess({
          paymentMethod: `UPI Payment (${selectedUpiApp.toUpperCase()} - ${vpaId})`,
          upiRefNo: `UPI-${Math.floor(100000000000 + Math.random() * 900000000000)}`
        });
      }, 1500);
    }, 2000);
  };

  // Dynamic QR Code SVG simulation
  const qrSvgUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=upi://pay?pa=auramart@icici%26pn=AuraMart%20Store%26am=${orderTotal.toFixed(2)}%26cu=USD`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      {/* Backdrop */}
      <div onClick={step === 'gateway' ? onClose : undefined} className="fixed inset-0 bg-slate-950/85 backdrop-blur-md animate-fade-in" />

      {/* Main UPI Gateway Card */}
      <div className="relative w-full max-w-md glass-panel bg-slate-900 border border-slate-800 rounded-3xl p-6 z-10 animate-fade-in shadow-2xl text-left space-y-5 my-8">
        
        {/* Gateway Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-black text-sm shadow-md">
              UPI
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-white">NPCI Official UPI Gateway</h3>
              <p className="text-[10px] font-semibold text-slate-400">AuraMart Merchant • 256-Bit SSL</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Amount & Timer Bar */}
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 flex items-center justify-between">
          <div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Amount to Pay</p>
            <p className="text-2xl font-black gradient-text">${orderTotal.toFixed(2)}</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Session Expires</p>
            <p className="font-mono text-sm font-black text-amber-400 animate-pulse">{formatTimer(timeLeft)}</p>
          </div>
        </div>

        {/* STEP 1: GATEWAY MODE SELECTOR */}
        {step === 'gateway' && (
          <div className="space-y-4">
            {/* Mode Tabs */}
            <div className="grid grid-cols-3 gap-2 p-1 rounded-2xl bg-slate-950 border border-slate-800 text-xs font-bold">
              <button
                type="button"
                onClick={() => setActiveTab('qr')}
                className={`py-2 px-2 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  activeTab === 'qr' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
                }`}
              >
                <QrCode className="w-3.5 h-3.5" />
                <span>Scan QR</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('vpa')}
                className={`py-2 px-2 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  activeTab === 'vpa' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>UPI ID</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('apps')}
                className={`py-2 px-2 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  activeTab === 'apps' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Zap className="w-3.5 h-3.5" />
                <span>UPI Apps</span>
              </button>
            </div>

            {/* Tab 1: QR Code Scanner */}
            {activeTab === 'qr' && (
              <div className="text-center space-y-3 p-4 rounded-2xl bg-slate-950/60 border border-slate-800 animate-fade-in">
                <div className="relative inline-block p-3 bg-white rounded-2xl shadow-xl">
                  <img src={qrSvgUrl} alt="UPI QR Code" className="w-44 h-44 mx-auto rounded-lg" />
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-8 h-8 rounded-full bg-indigo-600 text-white font-black text-[10px] flex items-center justify-center shadow-lg border-2 border-white">
                      UPI
                    </div>
                  </div>
                </div>
                <p className="text-xs text-slate-300 font-bold">Scan with Google Pay, PhonePe, Paytm, or BHIM</p>
                <button
                  onClick={handleSendPaymentRequest}
                  className="w-full btn btn-primary py-3 text-xs rounded-xl flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>I Have Scanned & Paid</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Tab 2: Enter VPA ID */}
            {activeTab === 'vpa' && (
              <div className="space-y-3 animate-fade-in">
                <label className="text-xs font-bold text-slate-300 block">Enter your Virtual Payment Address (UPI ID)</label>
                <div className="relative flex items-center">
                  <input
                    type="text"
                    placeholder="e.g. 9876543210@paytm or name@okaxis"
                    value={vpaId}
                    onChange={(e) => setVpaId(e.target.value)}
                    className="input-field text-xs pr-16"
                  />
                  <span className="absolute right-3 text-xs font-black text-indigo-400">@UPI</span>
                </div>
                <div className="flex flex-wrap gap-2 text-[11px] text-slate-400 font-semibold">
                  <button type="button" onClick={() => setVpaId('name@okicici')} className="px-2 py-1 rounded-lg bg-slate-800 hover:text-white">@okicici</button>
                  <button type="button" onClick={() => setVpaId('name@okaxis')} className="px-2 py-1 rounded-lg bg-slate-800 hover:text-white">@okaxis</button>
                  <button type="button" onClick={() => setVpaId('name@ybl')} className="px-2 py-1 rounded-lg bg-slate-800 hover:text-white">@ybl</button>
                  <button type="button" onClick={() => setVpaId('name@paytm')} className="px-2 py-1 rounded-lg bg-slate-800 hover:text-white">@paytm</button>
                </div>
                {errorMsg && <p className="text-xs font-bold text-rose-500">{errorMsg}</p>}
                <button
                  onClick={handleSendPaymentRequest}
                  className="w-full btn btn-primary py-3.5 text-xs rounded-xl flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Verify VPA & Request Payment</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Tab 3: Select App */}
            {activeTab === 'apps' && (
              <div className="space-y-3 animate-fade-in">
                <p className="text-xs font-bold text-slate-300">Choose your preferred UPI Mobile App:</p>
                <div className="grid grid-cols-2 gap-3 text-xs font-bold">
                  {[
                    { id: 'gpay', name: 'Google Pay', color: 'text-emerald-400' },
                    { id: 'phonepe', name: 'PhonePe', color: 'text-purple-400' },
                    { id: 'paytm', name: 'Paytm UPI', color: 'text-cyan-400' },
                    { id: 'bhim', name: 'BHIM UPI', color: 'text-amber-400' }
                  ].map(app => (
                    <button
                      key={app.id}
                      type="button"
                      onClick={() => setSelectedUpiApp(app.id)}
                      className={`p-3 rounded-2xl border flex items-center gap-3 transition-all cursor-pointer ${
                        selectedUpiApp === app.id ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-md' : 'bg-slate-950 border-slate-800 text-slate-400'
                      }`}
                    >
                      <Smartphone className={`w-4 h-4 ${app.color}`} />
                      <span>{app.name}</span>
                    </button>
                  ))}
                </div>
                <button
                  onClick={handleSendPaymentRequest}
                  className="w-full btn btn-primary py-3.5 text-xs rounded-xl flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Open {selectedUpiApp.toUpperCase()} App</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        )}

        {/* STEP 2: SIMULATED APP NOTIFICATION POPUP */}
        {step === 'notification' && (
          <div className="space-y-4 animate-fade-in text-center py-4">
            <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-bold flex items-center gap-2">
              <RefreshCw className="w-4 h-4 animate-spin shrink-0 text-indigo-400" />
              <span>Payment collect request sent to <strong>{vpaId}</strong></span>
            </div>

            {/* Mobile Notification Card Simulator */}
            <div 
              onClick={() => setStep('pin')}
              className="p-4 rounded-2xl bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 border-2 border-indigo-500 shadow-2xl cursor-pointer hover:scale-105 transition-all text-left space-y-2 animate-bounce"
            >
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-400">
                <span className="flex items-center gap-1.5 text-indigo-400">
                  <Smartphone className="w-3.5 h-3.5" />
                  {selectedUpiApp.toUpperCase()} • Notification
                </span>
                <span>Just Now</span>
              </div>
              <p className="text-xs font-bold text-white">Payment Request: AuraMart Merchant</p>
              <p className="text-xs text-slate-300">Collect Request for <strong>${orderTotal.toFixed(2)}</strong>. Tap to enter 4-digit UPI PIN and approve.</p>
              <div className="pt-1 text-right">
                <span className="text-xs font-extrabold text-indigo-400 hover:underline">Tap to Enter UPI PIN →</span>
              </div>
            </div>

            <p className="text-[11px] text-slate-400">Click the notification above to simulate entering your UPI PIN on your phone.</p>
          </div>
        )}

        {/* STEP 3: INTERACTIVE 4-DIGIT UPI PIN KEYPAD */}
        {step === 'pin' && (
          <div className="space-y-4 animate-fade-in text-center">
            <div className="border-b border-slate-800 pb-3">
              <p className="text-xs font-bold text-slate-400">Enter 4-Digit UPI PIN for {vpaId}</p>
              
              {/* PIN Dots */}
              <div className="flex items-center justify-center gap-3 my-3">
                {[0, 1, 2, 3].map(idx => (
                  <div 
                    key={idx} 
                    className={`w-4 h-4 rounded-full border-2 transition-all ${
                      enteredPin.length > idx ? 'bg-indigo-500 border-indigo-500 scale-110' : 'border-slate-700 bg-slate-950'
                    }`}
                  />
                ))}
              </div>
            </div>

            {errorMsg && <p className="text-xs font-bold text-rose-500">{errorMsg}</p>}

            {/* Numerical Keypad */}
            <div className="grid grid-cols-3 gap-2 max-w-xs mx-auto text-sm font-bold">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map(num => (
                <button
                  key={num}
                  type="button"
                  onClick={() => handleKeypadPress(num)}
                  className="py-3.5 rounded-xl bg-slate-950 border border-slate-800 text-white hover:bg-slate-800 active:scale-95 transition-all cursor-pointer"
                >
                  {num}
                </button>
              ))}
              <button
                type="button"
                onClick={handleKeypadDelete}
                className="py-3.5 rounded-xl bg-slate-950 border border-slate-800 text-rose-400 hover:bg-slate-800 active:scale-95 transition-all cursor-pointer"
              >
                ⌫
              </button>
              <button
                type="button"
                onClick={() => handleKeypadPress('0')}
                className="py-3.5 rounded-xl bg-slate-950 border border-slate-800 text-white hover:bg-slate-800 active:scale-95 transition-all cursor-pointer"
              >
                0
              </button>
              <button
                type="button"
                onClick={handlePinSubmit}
                className="py-3.5 rounded-xl bg-emerald-600 text-white font-black hover:bg-emerald-500 active:scale-95 transition-all cursor-pointer"
              >
                ✓
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: VERIFYING PIN WITH BANK */}
        {step === 'verifying' && (
          <div className="py-8 text-center space-y-4 animate-fade-in">
            <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto" />
            <h4 className="text-base font-bold text-white">Verifying UPI PIN with Bank...</h4>
            <p className="text-xs text-indigo-400 font-bold animate-pulse">Communicating with NPCI Payment Switch...</p>
          </div>
        )}

        {/* STEP 5: SUCCESS */}
        {step === 'success' && (
          <div className="py-8 text-center space-y-4 animate-fade-in">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto shadow-2xl animate-bounce">
              <Check className="w-10 h-10" />
            </div>
            <h4 className="text-xl font-black text-white">UPI Payment Approved!</h4>
            <p className="text-xs text-emerald-400 font-bold">Transaction Ref: UPI-{Math.floor(100000000000 + Math.random() * 900000000000)}</p>
            <p className="text-[11px] text-slate-400">Redirecting to order tracking & printable receipt...</p>
          </div>
        )}

        {/* Security Footer */}
        <div className="pt-3 border-t border-slate-800 text-center text-[10px] text-slate-500 flex items-center justify-center gap-1.5">
          <Lock className="w-3 h-3 text-emerald-500" />
          <span>Secured by National Payments Corporation of India (NPCI)</span>
        </div>
      </div>
    </div>
  );
}
