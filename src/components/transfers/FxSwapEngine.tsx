import React, { useState } from 'react';
import { ArrowDownUp, RefreshCw, Zap, TrendingUp, CheckCircle, ShieldAlert } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Currency, FXRate } from '../../types/fintech';
import { formatINR } from '../../utils/formatters';

interface FxSwapProps {
  fxRates: FXRate[];
  onSwapExecuted: (fromCur: Currency, toCur: Currency, fromAmt: number, toAmt: number) => void;
  privacyMode: boolean;
}

export const FxSwapEngine: React.FC<FxSwapProps> = ({ fxRates, onSwapExecuted, privacyMode }) => {
  const [fromCur, setFromCur] = useState<Currency>('INR');
  const [toCur, setToCur] = useState<Currency>('USD');
  const [fromAmount, setFromAmount] = useState<string>('500000'); // ₹5 Lakhs default
  const [isSwapping, setIsSwapping] = useState<boolean>(false);
  const [swapSuccess, setSwapSuccess] = useState<boolean>(false);

  // Compute exchange rate to/from INR
  const getRate = (from: Currency, to: Currency) => {
    if (from === to) return 1;
    // INR to foreign
    if (from === 'INR' && to === 'USD') return 1 / 86.42;
    if (from === 'USD' && to === 'INR') return 86.42;
    if (from === 'INR' && to === 'EUR') return 1 / 93.75;
    if (from === 'EUR' && to === 'INR') return 93.75;
    if (from === 'INR' && to === 'GBP') return 1 / 112.3;
    if (from === 'GBP' && to === 'INR') return 112.3;
    if (from === 'INR' && to === 'AED') return 1 / 23.53;
    if (from === 'AED' && to === 'INR') return 23.53;
    if (from === 'INR' && to === 'SGD') return 1 / 65.2;
    if (from === 'SGD' && to === 'INR') return 65.2;
    if (from === 'INR' && to === 'BTC') return 1 / 8520000;
    if (from === 'BTC' && to === 'INR') return 8520000;
    if (from === 'INR' && to === 'ETH') return 1 / 295000;
    if (from === 'ETH' && to === 'INR') return 295000;
    return 1;
  };

  const currentRate = getRate(fromCur, toCur);
  const numFrom = parseFloat(fromAmount) || 0;
  const convertedAmount = numFrom * currentRate;

  // Comparison savings vs traditional 2.5% Indian bank wire spread
  const traditionalFee = numFrom * 0.025;
  const giftCityFee = numFrom * 0.0015; // 0.15% GIFT City rate
  const savedFee = traditionalFee - giftCityFee;

  const handleInvert = () => {
    setFromCur(toCur);
    setToCur(fromCur);
  };

  const handleExecuteSwap = () => {
    if (numFrom <= 0) return;
    setIsSwapping(true);

    setTimeout(() => {
      setIsSwapping(false);
      setSwapSuccess(true);
      onSwapExecuted(fromCur, toCur, numFrom, convertedAmount);

      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#06b6d4', '#10b981', '#3b82f6'],
      });

      setTimeout(() => setSwapSuccess(false), 3000);
    }, 1000);
  };

  const currencyList: Currency[] = ['INR', 'USD', 'EUR', 'GBP', 'AED', 'SGD', 'BTC', 'ETH'];

  return (
    <div className="glass-panel rounded-2xl p-6 border border-slate-800/80 relative">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <ArrowDownUp className="w-4 h-4" />
          </span>
          <div>
            <h2 className="text-base font-bold text-white tracking-wide">
              GIFT City IFSC Institutional FX Swap Pool
            </h2>
            <p className="text-xs text-slate-400">Zero-markup RBI Liberalised Remittance Scheme (LRS) spot engine</p>
          </div>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
          SPREAD: 0.15% (GIFT SEZ)
        </span>
      </div>

      {/* Swap Container */}
      <div className="space-y-3">
        {/* FROM BOX */}
        <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800">
          <div className="flex justify-between text-xs font-mono text-slate-400 mb-2">
            <span>You Sell (डेबिट)</span>
            <span>Interbank Spot Feed</span>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="number"
              value={fromAmount}
              onChange={(e) => setFromAmount(e.target.value)}
              className="w-full bg-transparent text-2xl font-bold font-mono text-white focus:outline-none"
              placeholder="0.00"
            />
            <select
              value={fromCur}
              onChange={(e) => setFromCur(e.target.value as Currency)}
              className="bg-slate-800 border border-slate-700 text-white font-mono font-bold rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-cyan-500"
            >
              {currencyList.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* INVERT BUTTON */}
        <div className="flex justify-center -my-2 relative z-10">
          <button
            onClick={handleInvert}
            className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-cyan-400 border border-slate-700 shadow-md transition-transform hover:rotate-180 cursor-pointer"
          >
            <ArrowDownUp className="w-4 h-4" />
          </button>
        </div>

        {/* TO BOX */}
        <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800">
          <div className="flex justify-between text-xs font-mono text-slate-400 mb-2">
            <span>You Receive (क्रेडिट)</span>
            <span className="text-cyan-400">
              1 {fromCur} = {currentRate.toFixed(4)} {toCur}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-full text-2xl font-bold font-mono text-emerald-400">
              {toCur === 'INR'
                ? formatINR(convertedAmount, privacyMode)
                : convertedAmount.toLocaleString(undefined, {
                    maximumFractionDigits: toCur === 'BTC' || toCur === 'ETH' ? 4 : 2,
                  })}
            </div>
            <select
              value={toCur}
              onChange={(e) => setToCur(e.target.value as Currency)}
              className="bg-slate-800 border border-slate-700 text-white font-mono font-bold rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-cyan-500"
            >
              {currencyList.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Savings Callout Ribbon */}
      <div className="mt-4 p-3 rounded-xl bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 flex items-center justify-between text-xs">
        <div>
          <span className="text-emerald-400 font-semibold block">GIFT City SEZ Tax-Exempt Route</span>
          <span className="text-slate-400 text-[11px]">
            You save <strong className="text-slate-200">{formatINR(savedFee)}</strong> in traditional foreign exchange markup
          </span>
        </div>
        <span className="font-mono text-[11px] font-bold text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded">
          SAVE 2.35%
        </span>
      </div>

      {/* Swap Button */}
      <div className="mt-4">
        <button
          onClick={handleExecuteSwap}
          disabled={isSwapping || numFrom <= 0}
          className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 disabled:opacity-50 text-slate-950 font-bold text-sm tracking-wide shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          {isSwapping ? (
            <>
              <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
              Routing Order via GIFT City IFSC Gateway...
            </>
          ) : swapSuccess ? (
            <>
              <CheckCircle className="w-4 h-4 text-slate-950" />
              Spot Swap Settled Instantly!
            </>
          ) : (
            <>
              <Zap className="w-4 h-4" />
              Instant Spot Swap ({fromCur} → {toCur})
            </>
          )}
        </button>
      </div>
    </div>
  );
};
