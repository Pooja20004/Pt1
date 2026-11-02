import React from 'react';
import { Award, CheckCircle2 } from 'lucide-react';

interface CreditRadarProps {
  score: number;
}

export const CreditScoreRadar: React.FC<CreditRadarProps> = ({ score }) => {
  // CIBIL Score range: 300 to 900
  const normalized = Math.max(0, Math.min(1, (score - 300) / (900 - 300)));

  const getTier = (s: number) => {
    if (s >= 800) return { label: 'Exceptional (अति उत्तम)', color: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-200', desc: 'Top 1% of Indian corporate and HNI borrowers under RBI CIBIL.' };
    if (s >= 750) return { label: 'Prime AAA', color: 'text-blue-700', bg: 'bg-blue-50', border: 'border-blue-200', desc: 'Instant pre-approval for Loan Against Securities & Mudra lines.' };
    if (s >= 700) return { label: 'Standard', color: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-200', desc: 'Standard RBI benchmark repo-linked interest rates.' };
    return { label: 'Sub-Prime', color: 'text-rose-700', bg: 'bg-rose-50', border: 'border-rose-200', desc: 'Additional collateralization required.' };
  };

  const tier = getTier(score);

  const factors = [
    { name: 'Repayment Track Record', rating: '100% Flawless', impact: 'High' },
    { name: 'Credit Utilization Ratio (CUR)', rating: '5.4% (Target < 30%)', impact: 'High' },
    { name: 'Credit Vintage & Age', rating: '8.6 Years Active', impact: 'Medium' },
    { name: 'Recent Bureau Enquiries', rating: '0 (Last 12 Months)', impact: 'Low' },
    { name: 'Credit Portfolio Diversity', rating: 'LAS Overdraft & Metal Cards', impact: 'Low' },
  ];

  return (
    <div className="glass-panel rounded-2xl p-6 border border-slate-200 bg-white shadow-xs relative">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-blue-50 text-blue-600 border border-blue-200">
            <Award className="w-4 h-4" />
          </span>
          <h2 className="text-base font-bold text-slate-900 tracking-tight font-sans">
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
              <linearGradient id="gaugeGradBlue" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#ef4444" />
                <stop offset="35%" stopColor="#f59e0b" />
                <stop offset="65%" stopColor="#0284c7" />
                <stop offset="100%" stopColor="#10b981" />
              </linearGradient>
            </defs>

            {/* Background semi-circle track */}
            <path
              d="M 20 100 A 80 80 0 0 1 180 100"
              fill="none"
              stroke="#e2e8f0"
              strokeWidth="16"
              strokeLinecap="round"
            />

            {/* Filled progress arc */}
            <path
              d="M 20 100 A 80 80 0 0 1 180 100"
              fill="none"
              stroke="url(#gaugeGradBlue)"
              strokeWidth="16"
              strokeLinecap="round"
              strokeDasharray={`${(normalized * 251.2).toFixed(1)} 251.2`}
              className="transition-all duration-1000 ease-out"
            />
          </svg>

          {/* Needle / Score readout */}
          <div className="absolute bottom-1 flex flex-col items-center">
            <span className="text-4xl font-extrabold text-slate-900 font-mono tracking-tight">
              {score}
            </span>
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest mt-0.5">
              CIBIL TransUnion v3.0 (Scale: 300–900)
            </span>
          </div>
        </div>

        <p className="text-xs text-slate-500 text-center max-w-xs mt-2">
          {tier.desc}
        </p>
      </div>

      {/* Credit factors */}
      <div className="mt-5 space-y-2 pt-4 border-t border-slate-100">
        <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold block mb-1">
          RBI Bureau Underwriting Breakdown
        </span>

        {factors.map((f, i) => (
          <div key={i} className="flex items-center justify-between text-xs py-1.5 px-2.5 rounded-lg bg-slate-50 border border-slate-200">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <span className="text-slate-700 font-medium font-sans">{f.name}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-mono text-slate-900 text-[11px] font-bold">{f.rating}</span>
              <span className="text-[10px] text-slate-400 font-mono">Impact: {f.impact}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Borrowing power perk */}
      <div className="mt-4 p-3 rounded-xl bg-blue-50/70 border border-blue-200 flex items-center justify-between">
        <div>
          <span className="text-[11px] font-bold text-blue-800 block font-sans">Repo Rate Concession Unlocked</span>
          <span className="text-[10px] text-slate-600 font-sans">Automatic 0.75% interest concession on Loan Against Securities (LAS)</span>
        </div>
        <span className="font-mono text-xs font-bold text-blue-700 bg-white px-2.5 py-1 rounded-lg border border-blue-200 shadow-2xs">
          Prime Tier
        </span>
      </div>
    </div>
  );
};
