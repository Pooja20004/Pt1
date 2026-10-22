import React from 'react';
import { Award, ShieldCheck, CheckCircle2, TrendingUp, AlertCircle, ArrowUpRight } from 'lucide-react';

interface CreditRadarProps {
  score: number;
}

export const CreditScoreRadar: React.FC<CreditRadarProps> = ({ score }) => {
  // CIBIL Score range: 300 to 900
  const normalized = Math.max(0, Math.min(1, (score - 300) / (900 - 300)));

  const getTier = (s: number) => {
    if (s >= 800) return { label: 'Exceptional (अति उत्तम)', color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', desc: 'Top 1% of Indian corporate and HNI borrowers under RBI CIBIL.' };
    if (s >= 750) return { label: 'Prime AAA', color: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-500/30', desc: 'Instant pre-approval for Loan Against Securities & Mudra lines.' };
    if (s >= 700) return { label: 'Standard', color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/30', desc: 'Standard RBI benchmark repo-linked interest rates.' };
    return { label: 'Sub-Prime', color: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/30', desc: 'Additional collateralization required.' };
  };

  const tier = getTier(score);

  const factors = [
    { name: 'Repayment Track Record', rating: '100% Flawless', impact: 'High', status: 'optimal' },
    { name: 'Credit Utilization Ratio (CUR)', rating: '5.4% (Target < 30%)', impact: 'High', status: 'optimal' },
    { name: 'Credit Vintage & Age', rating: '8.6 Years Active', impact: 'Medium', status: 'optimal' },
    { name: 'Recent Bureau Enquiries', rating: '0 (Last 12 Months)', impact: 'Low', status: 'optimal' },
    { name: 'Credit Portfolio Diversity', rating: 'LAS Overdraft & Metal Cards', impact: 'Low', status: 'optimal' },
  ];

  return (
    <div className="glass-panel rounded-2xl p-6 border border-slate-800/80 relative">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Award className="w-4 h-4" />
          </span>
          <h2 className="text-base font-bold text-white tracking-wide">
            CIBIL TransUnion Credit Health Radar (सिबिल)
          </h2>
        </div>
        <span className={`text-xs font-mono font-bold px-2.5 py-0.5 rounded-full border ${tier.bg} ${tier.color} ${tier.border}`}>
          {tier.label}
        </span>
      </div>

      {/* Semi-circular gauge SVG */}
      <div className="flex flex-col items-center justify-center my-2">
        <div className="relative w-64 h-32 flex items-center justify-center overflow-hidden">
          <svg viewBox="0 0 200 110" className="w-64 h-36">
            <defs>
              <linearGradient id="gaugeGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#ef4444" />
                <stop offset="35%" stopColor="#f59e0b" />
                <stop offset="65%" stopColor="#06b6d4" />
                <stop offset="100%" stopColor="#10b981" />
              </linearGradient>
            </defs>

            {/* Background semi-circle track */}
            <path
              d="M 20 100 A 80 80 0 0 1 180 100"
              fill="none"
              stroke="#1e293b"
              strokeWidth="16"
              strokeLinecap="round"
            />

            {/* Filled progress arc */}
            <path
              d="M 20 100 A 80 80 0 0 1 180 100"
              fill="none"
              stroke="url(#gaugeGrad)"
              strokeWidth="16"
              strokeLinecap="round"
              strokeDasharray={`${(normalized * 251.2).toFixed(1)} 251.2`}
              className="transition-all duration-1000 ease-out"
            />
          </svg>

          {/* Needle / Score readout */}
          <div className="absolute bottom-1 flex flex-col items-center">
            <span className="text-4xl font-extrabold text-white font-mono tracking-tight drop-shadow-md">
              {score}
            </span>
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest mt-0.5">
              CIBIL TransUnion v3.0 (Scale: 300–900)
            </span>
          </div>
        </div>

        <p className="text-xs text-slate-400 text-center max-w-xs mt-2">
          {tier.desc}
        </p>
      </div>

      {/* Credit factors */}
      <div className="mt-5 space-y-2 pt-4 border-t border-slate-800">
        <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block mb-1">
          RBI Bureau Underwriting Breakdown
        </span>

        {factors.map((f, i) => (
          <div key={i} className="flex items-center justify-between text-xs py-1 px-2 rounded-lg bg-slate-900/40 border border-slate-800/60">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span className="text-slate-300 font-medium">{f.name}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-mono text-white text-[11px] font-semibold">{f.rating}</span>
              <span className="text-[10px] text-slate-500 font-mono">Impact: {f.impact}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Borrowing power perk */}
      <div className="mt-4 p-3 rounded-xl bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 border border-emerald-500/20 flex items-center justify-between">
        <div>
          <span className="text-[11px] font-semibold text-emerald-400 block">Repo Rate Concession Unlocked</span>
          <span className="text-[10px] text-slate-400">Automatic 0.75% interest concession on Loan Against Securities (LAS)</span>
        </div>
        <span className="font-mono text-xs font-bold text-white bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-700">
          Prime Tier
        </span>
      </div>
    </div>
  );
};
