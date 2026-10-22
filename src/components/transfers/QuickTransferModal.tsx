import React, { useState } from 'react';
import { X, Send, ArrowRight, ShieldCheck, CheckCircle2, Zap, QrCode } from 'lucide-react';
import confetti from 'canvas-confetti';
import { AccountBalance, Transaction } from '../../types/fintech';
import { formatINR } from '../../utils/formatters';

interface TransferModalProps {
  isOpen: boolean;
  onClose: () => void;
  accounts: AccountBalance[];
  onTransferComplete: (tx: Transaction) => void;
}

export const QuickTransferModal: React.FC<TransferModalProps> = ({
  isOpen,
  onClose,
  accounts,
  onTransferComplete,
}) => {
  const [sourceAccountId, setSourceAccountId] = useState(accounts[0]?.id || '');
  const [recipientName, setRecipientName] = useState('Ananya Iyer (Consulting)');
  const [recipientUpi, setRecipientUpi] = useState('ananya@okaxis');
  const [amount, setAmount] = useState('75000');
  const [speedRail, setSpeedRail] = useState<'upi' | 'imps' | 'rtgs'>('upi');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [rrnGenerated, setRrnGenerated] = useState('');

  if (!isOpen) return null;

  const sourceAccount = accounts.find((a) => a.id === sourceAccountId) || accounts[0];

  const quickContacts = [
    { name: 'Ananya Iyer (Tech Nomad)', upi: 'ananya@okaxis', tag: 'UPI P2P' },
    { name: 'Razorpay Software Escrow', upi: 'razorpay@icici', tag: 'Vendor' },
    { name: 'Zerodha Broking Demat', upi: 'zerodha@hdfcbank', tag: 'Investment' },
    { name: 'CBDT Advance Tax e-Pay', upi: 'cbdt@sbi', tag: 'Govt Tax' },
  ];

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) return;

    setIsProcessing(true);
    const rrn = `4295${Math.floor(10000000 + Math.random() * 90000000)}`;
    setRrnGenerated(rrn);

    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);

      const newTx: Transaction = {
        id: `tx-transfer-${Date.now()}`,
        title: `Instant ${speedRail.toUpperCase()} to ${recipientName}`,
        merchant: recipientName,
        category: speedRail === 'upi' ? 'UPI P2P & Vendor' : 'Internal Rebalance',
        amount: -numAmount,
        currency: 'INR',
        timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
        status: 'settled',
        type: speedRail === 'upi' ? 'upi' : 'transfer',
        riskScore: 2,
        location: { city: 'Bengaluru', state: 'Karnataka', country: 'India', lat: 12.9716, lng: 77.5946 },
        referenceId: `${speedRail.toUpperCase()}-${Math.floor(100000 + Math.random() * 900000)}`,
        upiId: recipientUpi,
        rrn,
      };

      onTransferComplete(newTx);

      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.5 },
        colors: ['#10b981', '#06b6d4', '#f59e0b'],
      });

      setTimeout(() => {
        setIsSuccess(false);
        onClose();
      }, 1800);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="glass-panel w-full max-w-lg rounded-2xl p-6 border border-slate-700 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
        >
          <X className="w-5 h-5" />
        </button>

        {isSuccess ? (
          <div className="py-12 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mb-4">
              <CheckCircle2 className="w-10 h-10 animate-bounce" />
            </div>
            <h3 className="text-xl font-bold text-white">Payment Settled (भुगतान सफल)</h3>
            <p className="text-sm font-mono text-emerald-400 mt-1">
              {formatINR(parseFloat(amount))} dispatched via {speedRail.toUpperCase()}
            </p>
            <div className="mt-3 bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-xs font-mono text-slate-300">
              <span className="text-slate-500 block text-[10px]">NPCI RRN (Retrieval Reference Number)</span>
              <strong className="text-cyan-400">{rrnGenerated}</strong>
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-2 mb-1">
              <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                <Send className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Instant UPI & RTGS Treasury Wire</h3>
                <p className="text-xs text-slate-400">Sub-second zero-fee settlement across NPCI and RBI RTGS rails</p>
              </div>
            </div>

            {/* Quick Beneficiary Selector */}
            <div className="mt-5">
              <span className="text-[10px] font-mono uppercase text-slate-400 block mb-1.5">
                Saved Beneficiaries & VPA Handles
              </span>
              <div className="grid grid-cols-2 gap-2">
                {quickContacts.map((c, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => {
                      setRecipientName(c.name);
                      setRecipientUpi(c.upi);
                    }}
                    className={`p-2 rounded-xl text-left border transition-all text-xs ${
                      recipientUpi === c.upi
                        ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
                        : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <span className="font-semibold block truncate">{c.name}</span>
                    <span className="text-[10px] text-slate-500 font-mono">{c.upi}</span>
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleSend} className="space-y-4 mt-5">
              {/* Source Account Picker */}
              <div>
                <label className="text-xs font-mono uppercase text-slate-400 block mb-1.5">Debit From Account</label>
                <select
                  value={sourceAccountId}
                  onChange={(e) => setSourceAccountId(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500"
                >
                  {accounts.map((acc) => (
                    <option key={acc.id} value={acc.id}>
                      {acc.name} ({formatINR(acc.balance)}) - {acc.ifsc || acc.accountNumber}
                    </option>
                  ))}
                </select>
              </div>

              {/* Recipient UPI / VPA */}
              <div>
                <label className="text-xs font-mono uppercase text-slate-400 block mb-1.5">
                  Recipient UPI VPA / Account IFSC
                </label>
                <input
                  type="text"
                  required
                  value={recipientUpi}
                  onChange={(e) => setRecipientUpi(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-cyan-500 font-mono"
                  placeholder="e.g. mobile@upi or HDFC0000240"
                />
              </div>

              {/* Amount input */}
              <div>
                <div className="flex justify-between text-xs font-mono mb-1.5">
                  <span className="text-slate-400 uppercase">Amount (INR)</span>
                  <span className="text-slate-400">
                    Available: {formatINR(sourceAccount?.balance || 0)}
                  </span>
                </div>
                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 text-slate-400 font-mono font-bold">₹</span>
                  <input
                    type="number"
                    required
                    min="1"
                    max={sourceAccount?.balance}
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-8 pr-4 py-2.5 text-base font-mono font-bold text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                    placeholder="0.00"
                  />
                </div>
              </div>

              {/* Payment Rail Selector */}
              <div>
                <label className="text-xs font-mono uppercase text-slate-400 block mb-1.5">
                  Indian Settlement Rail
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setSpeedRail('upi')}
                    className={`p-2 rounded-xl border text-center transition-all ${
                      speedRail === 'upi'
                        ? 'bg-emerald-500/15 border-emerald-500 text-emerald-300'
                        : 'bg-slate-900 border-slate-800 text-slate-400'
                    }`}
                  >
                    <span className="text-xs font-bold block">UPI 2.0</span>
                    <span className="text-[10px] font-mono block text-emerald-400">&lt; 1 Sec</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSpeedRail('imps')}
                    className={`p-2 rounded-xl border text-center transition-all ${
                      speedRail === 'imps'
                        ? 'bg-cyan-500/15 border-cyan-500 text-cyan-300'
                        : 'bg-slate-900 border-slate-800 text-slate-400'
                    }`}
                  >
                    <span className="text-xs font-bold block">IMPS</span>
                    <span className="text-[10px] font-mono block text-cyan-400">24x7 Instant</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSpeedRail('rtgs')}
                    className={`p-2 rounded-xl border text-center transition-all ${
                      speedRail === 'rtgs'
                        ? 'bg-slate-700 border-slate-500 text-white'
                        : 'bg-slate-900 border-slate-800 text-slate-400'
                    }`}
                  >
                    <span className="text-xs font-bold block">RTGS</span>
                    <span className="text-[10px] font-mono block text-slate-400">High-Value</span>
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 disabled:opacity-50 text-slate-950 font-bold text-sm tracking-wide shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  {isProcessing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                      Verifying UPI PIN & NPCI Switch...
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4" />
                      Authorize Instant Transfer ({formatINR(parseFloat(amount) || 0)})
                    </>
                  )}
                </button>
              </div>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-500">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>NPCI UPI 2.0 Encrypted & 2FA Device Bound</span>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};
