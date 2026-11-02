import React, { useState } from 'react';
import { Landmark, CheckCircle2, Calculator, ShieldCheck, ArrowRight, Zap } from 'lucide-react';
import confetti from 'canvas-confetti';
import { LOAN_PRESETS } from '../../data/mockData';
import { LoanPreset } from '../../types/fintech';
import { formatINR } from '../../utils/formatters';

interface LoanProps {
  onLoanDisbursed: (amount: number, presetTitle: string) => void;
  privacyMode: boolean;
}

export const LoanCreditUnderwriter: React.FC<LoanProps> = ({ onLoanDisbursed, privacyMode }) => {
  const [selectedPreset, setSelectedPreset] = useState<LoanPreset>(LOAN_PRESETS[0]);
  const [borrowAmount, setBorrowAmount] = useState<number>(2500000); // ₹25 Lakhs
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

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs relative">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-blue-50 text-blue-600 border border-blue-200">
              <Landmark className="w-4 h-4" />
            </span>
            <h2 className="text-base font-bold text-slate-900 tracking-wide">
              Secured LAS & MSME Credit Underwriter (ऋण एवं साख)
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Pre-approved credit line backed by your Mutual Funds & GST cashflows. No CIBIL score hit, instant automated RTGS disbursement.
          </p>
        </div>

        <span className="text-xs font-mono font-bold text-blue-700 bg-blue-50 border border-blue-200 px-3 py-1 rounded-full self-start">
          PRE-APPROVED LINE: ₹1.0 CRORE
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
                  ? 'bg-blue-50/80 border-blue-500 shadow-xs'
                  : 'bg-slate-50 border-slate-200 hover:border-blue-300'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-900">{preset.title}</span>
                <span className="text-xs font-mono font-bold text-blue-600">
                  {preset.interestRate}% p.a.
                </span>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed mb-3">
                {preset.description}
              </p>
              <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 pt-2 border-t border-slate-200">
                <span>Max: {formatINR(preset.maxAmount, false, true)}</span>
                <span>Tenure: {preset.termOptions.join(', ')} mo</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Calculator Deck */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-slate-50/80 p-5 rounded-xl border border-slate-200">
        {/* Left: Interactive Sliders */}
        <div className="lg:col-span-7 space-y-5">
          {/* Amount Slider */}
          <div>
            <div className="flex justify-between text-xs font-mono mb-2">
              <span className="text-slate-500 uppercase font-semibold">Desired Borrow Amount (INR)</span>
              <span className="text-xl font-bold font-mono text-slate-900">
                {formatINR(borrowAmount, privacyMode)}
              </span>
            </div>
            <input
              type="range"
              min={100000}
              max={selectedPreset.maxAmount}
              step={50000}
              value={borrowAmount}
              onChange={(e) => setBorrowAmount(Number(e.target.value))}
              className="w-full accent-blue-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-1">
              <span>₹1 Lakh</span>
              <span>Max: {formatINR(selectedPreset.maxAmount, false, true)}</span>
            </div>
          </div>

          {/* Term Months Selector */}
          <div>
            <label className="text-xs font-mono uppercase text-slate-500 font-semibold block mb-2">
              Repayment Duration
            </label>
            <div className="grid grid-cols-4 gap-2">
              {selectedPreset.termOptions.map((term) => (
                <button
                  key={term}
                  type="button"
                  onClick={() => setTermMonths(term)}
                  className={`py-2 rounded-xl text-xs font-mono font-bold border transition-all cursor-pointer ${
                    termMonths === term
                      ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {term} Months
                </button>
              ))}
            </div>
          </div>

          {/* Principal vs Interest Visual Bar */}
          <div className="pt-2">
            <div className="flex justify-between text-[11px] font-mono text-slate-500 mb-1.5">
              <span>Principal: {formatINR(borrowAmount, privacyMode)}</span>
              <span>Total Interest: {formatINR(totalInterest, privacyMode)}</span>
            </div>
            <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden flex">
              <div
                className="h-full bg-blue-600"
                style={{ width: `${(borrowAmount / totalRepayment) * 100}%` }}
              />
              <div
                className="h-full bg-indigo-400"
                style={{ width: `${(totalInterest / totalRepayment) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Right: Payment Verdict & Instant Disbursement */}
        <div className="lg:col-span-5 flex flex-col justify-between bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 block font-semibold">
              Estimated Monthly EMI
            </span>
            <span className="text-3xl font-extrabold text-blue-700 font-mono tracking-tight block mt-1">
              {formatINR(monthlyPayment, privacyMode)}
              <span className="text-xs text-slate-500 font-normal"> /mo</span>
            </span>

            <div className="space-y-1.5 mt-4 pt-3 border-t border-slate-100 text-xs font-mono">
              <div className="flex justify-between text-slate-500">
                <span>RBI Linked Interest:</span>
                <span className="text-slate-800 font-semibold">{selectedPreset.interestRate}% p.a. Fixed</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Total Repayment (P+I):</span>
                <span className="text-slate-800 font-semibold">{formatINR(totalRepayment, privacyMode)}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Loan-to-Value (LTV):</span>
                <span className="text-blue-600 font-semibold">45% (Safe Margin)</span>
              </div>
            </div>
          </div>

          <div className="mt-5">
            <button
              onClick={handleDisburse}
              disabled={isDisbursing}
              className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-sm tracking-wide shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              {isDisbursing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Collateralizing LAS & Disbursing via RTGS...
                </>
              ) : isSuccess ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-white" />
                  {formatINR(borrowAmount)} Credited to Current Account!
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4" />
                  Disburse {formatINR(borrowAmount, false, true)} Instantly
                </>
              )}
            </button>
            <span className="text-[10px] text-center block text-slate-500 mt-2 font-mono">
              Zero prepayment penalty • Immediate RTGS settlement under RBI guidelines
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
