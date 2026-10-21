import React, { useState } from 'react';
import { Landmark, CheckCircle2, Calculator, ShieldCheck, ArrowRight, Zap } from 'lucide-react';
import confetti from 'canvas-confetti';
import { LOAN_PRESETS } from '../../data/mockData';
import { LoanPreset, Transaction } from '../../types/fintech';

interface LoanProps {
  onLoanDisbursed: (amount: number, presetTitle: string) => void;
  privacyMode: boolean;
}

export const LoanCreditUnderwriter: React.FC<LoanProps> = ({ onLoanDisbursed, privacyMode }) => {
  const [selectedPreset, setSelectedPreset] = useState<LoanPreset>(LOAN_PRESETS[0]);
  const [borrowAmount, setBorrowAmount] = useState<number>(250000);
  const [termMonths, setTermMonths] = useState<number>(24);
  const [isDisbursing, setIsDisbursing] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  // Calculate monthly amortization: M = P [ i(1 + i)^n ] / [ (1 + i)^n – 1]
  const monthlyRate = selectedPreset.interestRate / 100 / 12;
  const monthlyPayment =
    borrowAmount *
    ((monthlyRate * Math.pow(1 + monthlyRate, termMonths)) /
      (Math.pow(1 + monthlyRate, termMonths) - 1));

  const totalRepayment = monthlyPayment * termMonths;
  const totalInterest = totalRepayment - borrowAmount;

  const handleDisburse = () => {
    setIsDisbursing(true);

    setTimeout(() => {
      setIsDisbursing(false);
      setIsSuccess(true);
      onLoanDisbursed(borrowAmount, selectedPreset.title);

      confetti({
        particleCount: 90,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#10b981', '#06b6d4', '#f59e0b'],
      });

      setTimeout(() => setIsSuccess(false), 3500);
    }, 1200);
  };

  const formatAmount = (val: number) => {
    if (privacyMode) return '••••••';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="glass-panel rounded-2xl p-6 border border-slate-800/80 relative">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Landmark className="w-4 h-4" />
            </span>
            <h2 className="text-base font-bold text-white tracking-wide">
              Vault-Collateralized Lending & Growth Credit
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Pre-approved automated liquidity lines backed by your liquid treasury. No credit check delays, instant wire disbursement.
          </p>
        </div>

        <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-full self-start">
          PRE-APPROVED LIMIT: $1,500,000
        </span>
      </div>

      {/* Preset Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
        {LOAN_PRESETS.map((preset) => {
          const isSelected = selectedPreset.id === preset.id;
          return (
            <div
              key={preset.id}
              onClick={() => {
                setSelectedPreset(preset);
                setBorrowAmount(Math.min(borrowAmount, preset.maxAmount));
                setTermMonths(preset.termOptions[0]);
              }}
              className={`p-4 rounded-xl border transition-all cursor-pointer ${
                isSelected
                  ? 'bg-slate-800/90 border-emerald-500 shadow-lg shadow-emerald-500/10'
                  : 'bg-slate-900/50 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-white">{preset.title}</span>
                <span className="text-xs font-mono font-bold text-emerald-400">
                  {preset.interestRate}% APR
                </span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed mb-3">
                {preset.description}
              </p>
              <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 pt-2 border-t border-slate-800">
                <span>Max: ${preset.maxAmount.toLocaleString()}</span>
                <span>Terms: {preset.termOptions.join(', ')} mo</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Calculator Deck */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-slate-900/60 p-5 rounded-xl border border-slate-800/80">
        {/* Left: Interactive Sliders */}
        <div className="lg:col-span-7 space-y-5">
          {/* Amount Slider */}
          <div>
            <div className="flex justify-between text-xs font-mono mb-2">
              <span className="text-slate-400 uppercase">Desired Borrow Amount</span>
              <span className="text-xl font-bold font-mono text-white">
                {formatAmount(borrowAmount)}
              </span>
            </div>
            <input
              type="range"
              min={10000}
              max={selectedPreset.maxAmount}
              step={5000}
              value={borrowAmount}
              onChange={(e) => setBorrowAmount(Number(e.target.value))}
              className="w-full accent-emerald-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-1">
              <span>$10,000</span>
              <span>Max: {formatAmount(selectedPreset.maxAmount)}</span>
            </div>
          </div>

          {/* Term Months Selector */}
          <div>
            <label className="text-xs font-mono uppercase text-slate-400 block mb-2">
              Repayment Duration
            </label>
            <div className="grid grid-cols-4 gap-2">
              {selectedPreset.termOptions.map((term) => (
                <button
                  key={term}
                  type="button"
                  onClick={() => setTermMonths(term)}
                  className={`py-2 rounded-xl text-xs font-mono font-bold border transition-all ${
                    termMonths === term
                      ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-md shadow-emerald-500/20'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {term} Months
                </button>
              ))}
            </div>
          </div>

          {/* Principal vs Interest Visual Bar */}
          <div className="pt-2">
            <div className="flex justify-between text-[11px] font-mono text-slate-400 mb-1.5">
              <span>Principal: {formatAmount(borrowAmount)}</span>
              <span>Total Interest: {formatAmount(totalInterest)}</span>
            </div>
            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden flex">
              <div
                className="h-full bg-emerald-400"
                style={{ width: `${(borrowAmount / totalRepayment) * 100}%` }}
              />
              <div
                className="h-full bg-amber-400"
                style={{ width: `${(totalInterest / totalRepayment) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Right: Payment Verdict & Instant Disbursement */}
        <div className="lg:col-span-5 flex flex-col justify-between bg-slate-950/80 p-5 rounded-xl border border-slate-800">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">
              Estimated Monthly Installment
            </span>
            <span className="text-3xl font-extrabold text-emerald-400 font-mono tracking-tight block mt-1">
              {formatAmount(monthlyPayment)}
              <span className="text-xs text-slate-400 font-normal"> /mo</span>
            </span>

            <div className="space-y-1.5 mt-4 pt-3 border-t border-slate-800 text-xs font-mono">
              <div className="flex justify-between text-slate-400">
                <span>Base APR:</span>
                <span className="text-white font-semibold">{selectedPreset.interestRate}% Fixed</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Total Repayment:</span>
                <span className="text-white font-semibold">{formatAmount(totalRepayment)}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Collateral Ratio (LTV):</span>
                <span className="text-cyan-400 font-semibold">32.4% (Ultra-Safe)</span>
              </div>
            </div>
          </div>

          <div className="mt-5">
            <button
              onClick={handleDisburse}
              disabled={isDisbursing}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 disabled:opacity-50 text-slate-950 font-bold text-sm tracking-wide shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              {isDisbursing ? (
                <>
                  <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  Collateralizing Vault & Depositing...
                </>
              ) : isSuccess ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  ${borrowAmount.toLocaleString()} Deposited to Main!
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4" />
                  Disburse ${borrowAmount.toLocaleString()} Instantly
                </>
              )}
            </button>
            <span className="text-[10px] text-center block text-slate-500 mt-2 font-mono">
              Funds immediately credited to Prime Treasury Reserve
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
