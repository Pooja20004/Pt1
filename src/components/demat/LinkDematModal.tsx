import React, { useState } from 'react';
import { X, ShieldCheck, CheckCircle2, ArrowRight, Sparkles, Lock, RefreshCw, Layers } from 'lucide-react';
import confetti from 'canvas-confetti';
import { DematAccount, DematBroker } from '../../types/fintech';
import { AVAILABLE_BROKERS, INITIAL_DEMAT_ACCOUNT } from '../../data/mockData';

interface LinkDematModalProps {
  isOpen: boolean;
  onClose: () => void;
  userPan: string;
  onLinkSuccess: (account: DematAccount) => void;
}

export const LinkDematModal: React.FC<LinkDematModalProps> = ({
  isOpen,
  onClose,
  userPan,
  onLinkSuccess,
}) => {
  const [selectedBroker, setSelectedBroker] = useState<DematBroker>('zerodha');
  const [boId, setBoId] = useState('1208160004928173');
  const [pan, setPan] = useState(userPan);
  const [tpin, setTpin] = useState('482910');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [step, setStep] = useState<'details' | 'tpin'>('details');

  if (!isOpen) return null;

  const activeBrokerInfo = AVAILABLE_BROKERS.find((b) => b.id === selectedBroker) || AVAILABLE_BROKERS[0];

  const handleProceedToTpin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!boId.trim() || !pan.trim()) return;
    setStep('tpin');
  };

  const handleVerifyAndLink = (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);

    setTimeout(() => {
      setIsVerifying(false);
      setIsSuccess(true);

      const linkedAccount: DematAccount = {
        ...INITIAL_DEMAT_ACCOUNT,
        id: `demat-${selectedBroker}-${Date.now()}`,
        broker: selectedBroker,
        brokerName: activeBrokerInfo.name,
        boId: boId.trim(),
        depository: activeBrokerInfo.depository,
        lastSynced: 'Just now (T+1 Settlement Synced)',
      };

      onLinkSuccess(linkedAccount);

      confetti({
        particleCount: 100,
        spread: 75,
        origin: { y: 0.6 },
        colors: ['#2563eb', '#3b82f6', '#10b981', '#f59e0b'],
      });

      setTimeout(() => {
        setIsSuccess(false);
        setStep('details');
        onClose();
      }, 1800);
    }, 1400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-lg rounded-2xl p-6 border border-slate-200 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {isSuccess ? (
          <div className="py-12 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 rounded-full bg-blue-50 text-blue-600 border border-blue-200 flex items-center justify-center mb-4 shadow-sm">
              <CheckCircle2 className="w-10 h-10 animate-bounce" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Demat Account Successfully Linked!</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm">
              Holdings across <strong>{activeBrokerInfo.name}</strong> ({activeBrokerInfo.depository}) are now synchronized into your Valence allocation dashboard.
            </p>
            <div className="mt-4 bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs font-mono text-slate-700">
              <span className="text-slate-500 block text-[10px]">Beneficiary Owner ID (BO ID)</span>
              <strong className="text-blue-700 font-bold">{boId}</strong>
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-3 mb-5">
              <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 border border-blue-200">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Link Indian Demat Account</h3>
                <p className="text-xs text-slate-500">
                  Connect via CDSL / NSDL e-DIS Gateway for portfolio tracking & LAS collateralization
                </p>
              </div>
            </div>

            {step === 'details' ? (
              <form onSubmit={handleProceedToTpin} className="space-y-4">
                {/* Broker Selector */}
                <div>
                  <label className="text-xs font-mono uppercase text-slate-500 font-semibold block mb-2">
                    Select Depository Participant / Broker
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {AVAILABLE_BROKERS.map((broker) => {
                      const isSelected = selectedBroker === broker.id;
                      return (
                        <button
                          key={broker.id}
                          type="button"
                          onClick={() => setSelectedBroker(broker.id as DematBroker)}
                          className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-blue-50 border-blue-500 shadow-xs'
                              : 'bg-slate-50 border-slate-200 hover:border-blue-300'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-bold text-slate-900">{broker.name}</span>
                            <span className="text-[9px] font-mono font-semibold px-1 py-0.5 rounded bg-slate-200 text-slate-700">
                              {broker.depository}
                            </span>
                          </div>
                          <span className="text-[10px] text-slate-500 block truncate leading-tight">
                            {broker.tagline}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 16-Digit BO ID / Demat Number */}
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="text-xs font-mono uppercase text-slate-500 font-semibold">
                      16-Digit Demat Number (BO ID)
                    </label>
                    <span className="text-[10px] font-mono text-blue-600 font-medium">
                      {activeBrokerInfo.depository} Depository
                    </span>
                  </div>
                  <input
                    type="text"
                    required
                    maxLength={16}
                    value={boId}
                    onChange={(e) => setBoId(e.target.value.replace(/\D/g, ''))}
                    placeholder="e.g. 1208160004928173"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm font-mono text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white transition-all tracking-wider"
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    Found in your {activeBrokerInfo.name} Profile under &quot;Demat / BO ID&quot;
                  </span>
                </div>

                {/* Permanent Account Number (PAN) */}
                <div>
                  <label className="text-xs font-mono uppercase text-slate-500 font-semibold block mb-1.5">
                    Registered PAN (आयकर पैन)
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={10}
                    value={pan}
                    onChange={(e) => setPan(e.target.value.toUpperCase())}
                    placeholder="e.g. AAACT1948B"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm font-mono font-bold text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white transition-all uppercase tracking-wider"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm tracking-wide shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <span>Proceed to CDSL / NSDL Authorization</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            ) : (
              /* Step 2: CDSL / NSDL TPIN Verification */
              <form onSubmit={handleVerifyAndLink} className="space-y-4">
                <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200 text-xs">
                  <div className="flex items-center gap-2 text-blue-900 font-bold mb-1">
                    <ShieldCheck className="w-4 h-4 text-blue-600" />
                    <span>{activeBrokerInfo.depository} e-DIS Electronic Mandate</span>
                  </div>
                  <p className="text-slate-600 text-[11px] leading-relaxed">
                    Enter your 6-digit {activeBrokerInfo.depository} TPIN to authorize Valence to fetch and monitor your equity holdings and mutual funds in read-only mode.
                  </p>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="text-xs font-mono uppercase text-slate-500 font-semibold">
                      6-Digit {activeBrokerInfo.depository} TPIN
                    </label>
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        alert('A fresh 6-digit TPIN has been requested from CDSL/NSDL to your registered mobile and email.');
                      }}
                      className="text-[10px] font-mono text-blue-600 hover:underline"
                    >
                      Generate New TPIN?
                    </a>
                  </div>
                  <input
                    type="password"
                    required
                    maxLength={6}
                    value={tpin}
                    onChange={(e) => setTpin(e.target.value.replace(/\D/g, ''))}
                    placeholder="••••••"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-center text-lg font-mono tracking-[0.5em] text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white transition-all font-bold"
                  />
                </div>

                <div className="pt-2 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setStep('details')}
                    className="py-3 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-mono font-semibold transition-all cursor-pointer"
                  >
                    Back
                  </button>

                  <button
                    type="submit"
                    disabled={isVerifying || tpin.length < 6}
                    className="flex-1 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-sm tracking-wide shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    {isVerifying ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Verifying with {activeBrokerInfo.depository} Gateway...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        <span>Authorize & Fetch Holdings</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-center gap-1.5 text-[11px] text-slate-500 font-mono">
              <Lock className="w-3.5 h-3.5 text-blue-600" />
              <span>Read-only 256-Bit Encrypted CDSL/NSDL e-DIS Integration</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
