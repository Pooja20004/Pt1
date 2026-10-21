import React, { useState } from 'react';
import { ArrowDownUp, RefreshCw, Zap, TrendingUp, CheckCircle, ShieldAlert } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Currency, FXRate } from '../../types/fintech';

interface FxSwapProps {
  fxRates: FXRate[];
  onSwapExecuted: (fromCur: Currency, toCur: Currency, fromAmt: number, toAmt: number) => void;
  privacyMode: boolean;
}

export const FxSwapEngine: React.FC<FxSwapProps> = ({ fxRates, onSwapExecuted, privacyMode }) => {
  const [fromCur, setFromCur] = useState<Currency>('USD');
  const [toCur, setToCur] = useState<Currency>('EUR');
  const [fromAmount, setFromAmount] = useState<string>('50000');
  const [isSwapping, setIsSwapping] = useState<boolean>(false);
  const [swapSuccess, setSwapSuccess] = useState<boolean>(false);

  // Compute exchange rate
  const getRate = (from: Currency, to: Currency) => {
    if (from === to) return 1;
    if (from === 'USD' && to === 'EUR') return 1 / 1.0845;
    if (from === 'EUR' && to === 'USD') return 1.0845;
    if (from === 'USD' && to === 'GBP') return 1 / 1.2980;
    if (from === 'GBP' && to === 'USD') return 1.2980;
    if (from === 'USD' && to === 'JPY') return 152.40;
    if (from === 'JPY' && to === 'USD') return 1 / 152.40;
    if (from === 'USD' && to === 'CHF') return 0.8650;
    if (from === 'CHF' && to === 'USD') return 1 / 0.8650;
    if (from === 'BTC' && to === 'USD') return 98450;
    if (from === 'USD' && to === 'BTC') return 1 / 98450;
    if (from === 'ETH' && to === 'USD') return 3420.5;
    if (from === 'USD' && to === 'ETH') return 1 / 3420.5;
    return 1.1;
  };

  const currentRate = getRate(fromCur, toCur);
  const numFrom = parseFloat(fromAmount) || 0;
  const convertedAmount = numFrom * currentRate;

  // Comparison savings vs traditional 2.5% FX markup
  const traditionalFee = numFrom * 0.025;
  const valenceFee = numFrom * 0.0005; // 0.05%
  const savedFee = traditionalFee - valenceFee;

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

  const currencyList: Currency[] = ['USD', 'EUR', 'GBP', 'JPY', 'CHF', 'BTC', 'ETH'];

  return (
    <div className="glass-panel rounded-2xl p-6 border border-slate-800/80 relative">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <ArrowDownUp className="w-4 h-4" />
          </span>
          <div>
            <h2 className="text-base font-bold text-white tracking-wide">
              Institutional FX Liquidity Pool & Swap
            </h2>
            <p className="text-xs text-slate-400">Zero-markup interbank spot execution with real-time settlement</p>
          </div>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
          SPREAD: 0.05% (5 BPS)
        </span>
      </div>

      {/* Swap Container */}
      <div className="space-y-3">
        {/* FROM BOX */}
        <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800">
          <div className="flex justify-between text-xs font-mono text-slate-400 mb-2">
            <span>You Swap (Sell)</span>
            <span>Market Rate Spot</span>
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
            className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-cyan-400 border border-slate-700 shadow-md transition-transform hover:rotate-180"
          >
            <ArrowDownUp className="w-4 h-4" />
          </button>
        </div>

        {/* TO BOX */}
        <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800">
          <div className="flex justify-between text-xs font-mono text-slate-400 mb-2">
            <span>You Receive (Buy)</span>
            <span className="text-cyan-400">
              1 {fromCur} = {currentRate.toFixed(4)} {toCur}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-full text-2xl font-bold font-mono text-emerald-400">
              {convertedAmount.toLocaleString(undefined, {
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
          <span className="text-emerald-400 font-semibold block">Institutional Tier Pricing</span>
          <span className="text-slate-400 text-[11px]">
            You save <strong className="text-slate-200">${savedFee.toLocaleString(undefined, { maximumFractionDigits: 0 })} USD</strong> compared to traditional wire markup
          </span>
        </div>
        <span className="font-mono text-[11px] font-bold text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded">
          SAVE 2.45%
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
              Routing Order into Liquidity Pool...
            </>
          ) : swapSuccess ? (
            <>
              <CheckCircle className="w-4 h-4 text-slate-950" />
              Swap Settled Instantly!
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
