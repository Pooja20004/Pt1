import React, { useState } from 'react';
import { X, Send, ArrowRight, ShieldCheck, CheckCircle2, Zap, DollarSign } from 'lucide-react';
import confetti from 'canvas-confetti';
import { AccountBalance, Transaction } from '../../types/fintech';

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
  const [recipientName, setRecipientName] = useState('Apex Liquidity Pool');
  const [recipientAccount, setRecipientAccount] = useState('US89 VALE 0001 9920 4821 00');
  const [amount, setAmount] = useState('25000');
  const [speedRail, setSpeedRail] = useState<'fednow' | 'swift' | 'ach'>('fednow');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const sourceAccount = accounts.find((a) => a.id === sourceAccountId) || accounts[0];

  const quickContacts = [
    { name: 'Apex Liquidity Pool', iban: 'US89 VALE 0001 9920 4821 00', tag: 'Treasury' },
    { name: 'Stripe Global Custody', iban: 'GB29 NWBK 6016 1331 9268 19', tag: 'Partner' },
    { name: 'Zurich Private Escrow', iban: 'CH93 0000 0000 8921 3491 2', tag: 'Vault' },
    { name: 'Dr. Alistair Croft (Law)', iban: 'US12 CHASE 9921 8840 2210', tag: 'Legal' },
  ];

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) return;

    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);

      const newTx: Transaction = {
        id: `tx-transfer-${Date.now()}`,
        title: `Instant Wire to ${recipientName}`,
        merchant: recipientName,
        category: 'Internal Transfer',
        amount: -numAmount,
        currency: sourceAccount?.currency || 'USD',
        timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
        status: 'settled',
        type: 'transfer',
        riskScore: 2,
        location: { city: 'New York', country: 'USA', lat: 40.7128, lng: -74.006 },
        referenceId: `FEDNOW-${Math.floor(100000 + Math.random() * 900000)}`,
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
      }, 1600);
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
            <h3 className="text-xl font-bold text-white">Funds Cleared & Settled</h3>
            <p className="text-sm font-mono text-emerald-400 mt-1">
              ${parseFloat(amount).toLocaleString()} {sourceAccount?.currency} dispatched via{' '}
              {speedRail.toUpperCase()}
            </p>
            <span className="text-xs text-slate-400 mt-2">
              Cryptographic Receipt ID: FEDNOW-{Math.floor(100000 + Math.random() * 900000)}
            </span>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-2 mb-1">
              <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                <Send className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Institutional Wire & Instant Pay</h3>
                <p className="text-xs text-slate-400">Zero-fee settlement across global high-value banking rails</p>
              </div>
            </div>

            {/* Quick Beneficiary Selector */}
            <div className="mt-5">
              <span className="text-[10px] font-mono uppercase text-slate-400 block mb-1.5">
                Saved Global Beneficiaries
              </span>
              <div className="grid grid-cols-2 gap-2">
                {quickContacts.map((c, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => {
                      setRecipientName(c.name);
                      setRecipientAccount(c.iban);
                    }}
                    className={`p-2 rounded-xl text-left border transition-all text-xs ${
                      recipientName === c.name
                        ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
                        : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <span className="font-semibold block truncate">{c.name}</span>
                    <span className="text-[10px] text-slate-500 font-mono">{c.tag}</span>
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleSend} className="space-y-4 mt-5">
              {/* Source Account Picker */}
              <div>
                <label className="text-xs font-mono uppercase text-slate-400 block mb-1.5">Source Account</label>
                <select
                  value={sourceAccountId}
                  onChange={(e) => setSourceAccountId(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500"
                >
                  {accounts.map((acc) => (
                    <option key={acc.id} value={acc.id}>
                      {acc.name} ({acc.currency} {acc.balance.toLocaleString()}) - {acc.accountNumber}
                    </option>
                  ))}
                </select>
              </div>

              {/* Amount input */}
              <div>
                <div className="flex justify-between text-xs font-mono mb-1.5">
                  <span className="text-slate-400 uppercase">Transfer Amount</span>
                  <span className="text-slate-400">
                    Available: {sourceAccount?.currency} {sourceAccount?.balance.toLocaleString()}
                  </span>
                </div>
                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 text-slate-400 font-mono font-bold">$</span>
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
                  Settlement Rail & Latency
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setSpeedRail('fednow')}
                    className={`p-2 rounded-xl border text-center transition-all ${
                      speedRail === 'fednow'
                        ? 'bg-emerald-500/15 border-emerald-500 text-emerald-300'
                        : 'bg-slate-900 border-slate-800 text-slate-400'
                    }`}
                  >
                    <span className="text-xs font-bold block">FedNow</span>
                    <span className="text-[10px] font-mono block text-emerald-400">&lt; 3 Secs</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSpeedRail('swift')}
                    className={`p-2 rounded-xl border text-center transition-all ${
                      speedRail === 'swift'
                        ? 'bg-cyan-500/15 border-cyan-500 text-cyan-300'
                        : 'bg-slate-900 border-slate-800 text-slate-400'
                    }`}
                  >
                    <span className="text-xs font-bold block">SWIFT gpi</span>
                    <span className="text-[10px] font-mono block text-cyan-400">Cross-Border</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSpeedRail('ach')}
                    className={`p-2 rounded-xl border text-center transition-all ${
                      speedRail === 'ach'
                        ? 'bg-slate-700 border-slate-500 text-white'
                        : 'bg-slate-900 border-slate-800 text-slate-400'
                    }`}
                  >
                    <span className="text-xs font-bold block">Same-Day ACH</span>
                    <span className="text-[10px] font-mono block text-slate-400">EOD Batch</span>
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-50 text-slate-950 font-bold text-sm tracking-wide shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  {isProcessing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                      Authenticating Biometrics & Routing...
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4" />
                      Execute Instant Transfer
                    </>
                  )}
                </button>
              </div>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-500">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Encrypted via 256-bit Post-Quantum TLS 1.3</span>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};
