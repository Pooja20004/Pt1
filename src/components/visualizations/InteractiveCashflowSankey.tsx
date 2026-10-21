import React, { useState } from 'react';
import { ArrowRight, Layers, Sparkles, DollarSign, TrendingUp, ShieldCheck } from 'lucide-react';

interface SankeyProps {
  privacyMode: boolean;
}

export const InteractiveCashflowSankey: React.FC<SankeyProps> = ({ privacyMode }) => {
  const [timeframe, setTimeframe] = useState<'monthly' | 'quarterly' | 'annual'>('monthly');
  const [activeNode, setActiveNode] = useState<string | null>(null);

  const multiplier = timeframe === 'monthly' ? 1 : timeframe === 'quarterly' ? 3 : 12;

  const formatAmount = (val: number) => {
    if (privacyMode) return '••••••';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(val * multiplier);
  };

  const sources = [
    { id: 'saas', name: 'SaaS & Enterprise Rev', amount: 84500, color: '#10b981', pct: '59.5%' },
    { id: 'divs', name: 'Stock Dividends & Fixed Inc', amount: 28450, color: '#06b6d4', pct: '20.0%' },
    { id: 'yield', name: 'Quantum Yield & Staking', amount: 19050, color: '#8b5cf6', pct: '13.4%' },
    { id: 'consulting', name: 'Advisory & Board Retainers', amount: 10000, color: '#f59e0b', pct: '7.1%' },
  ];

  const totalInflow = sources.reduce((acc, s) => acc + s.amount, 0);

  const destinations = [
    { id: 'vault', name: 'High-Yield Vault (5.45%)', amount: 55000, color: '#06b6d4', pct: '38.7%', desc: 'Compounding liquid reserve' },
    { id: 'tax', name: 'Federal & State Tax Escrow', amount: 35000, color: '#64748b', pct: '24.6%', desc: '100% automated penalty hedge' },
    { id: 'invest', name: 'Index & Private Equity', amount: 22000, color: '#8b5cf6', pct: '15.5%', desc: 'Long term global asset allocation' },
    { id: 'payroll', name: 'Operating & Team Payroll', amount: 20000, color: '#ef4444', pct: '14.1%', desc: 'Engineering & cloud infra' },
    { id: 'luxury', name: 'Discretionary & Travel', amount: 10000, color: '#ec4899', pct: '7.1%', desc: 'Aviation, executive lifestyle' },
  ];

  return (
    <div className="glass-panel rounded-2xl p-6 border border-slate-800/80 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute -top-24 -right-24 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Layers className="w-4 h-4" />
            </span>
            <h2 className="text-lg font-bold text-white tracking-wide">
              Autonomous Liquidity & Cashflow Sankey Stream
            </h2>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 font-mono border border-emerald-500/30">
              LIVE ROUTING
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Visualizing real-time capital flow from origin sources through the central treasury engine into growth, taxes & operations
          </p>
        </div>

        {/* Timeframe toggle */}
        <div className="flex items-center bg-slate-900/90 p-1 rounded-xl border border-slate-800 self-start">
          {(['monthly', 'quarterly', 'annual'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTimeframe(t)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                timeframe === t
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Main Flow Canvas / Diagram Container */}
      <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-6 items-center my-4">
        {/* Left Column: Inflow Sources */}
        <div className="lg:col-span-3 space-y-3">
          <div className="text-xs font-mono uppercase tracking-wider text-slate-400 flex items-center justify-between px-1">
            <span>Inflow Origins</span>
            <span className="text-emerald-400 font-semibold">{formatAmount(totalInflow)}</span>
          </div>

          {sources.map((src) => {
            const isHovered = activeNode === src.id;
            return (
              <div
                key={src.id}
                onMouseEnter={() => setActiveNode(src.id)}
                onMouseLeave={() => setActiveNode(null)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer relative ${
                  isHovered
                    ? 'bg-slate-800/90 border-emerald-500 shadow-lg shadow-emerald-500/10 scale-[1.02]'
                    : 'bg-slate-900/60 border-slate-800/90 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold text-slate-200">{src.name}</span>
                  <span className="text-xs font-mono font-bold text-white">{formatAmount(src.amount)}</span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: src.color }} />
                    {src.pct} of inflow
                  </span>
                  <span className="text-emerald-400/80 font-mono text-[10px]">VERIFIED RAIL</span>
                </div>
                {/* Visual bar */}
                <div className="w-full h-1 bg-slate-800 rounded-full mt-2 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: src.pct,
                      backgroundColor: src.color,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Center: Central Treasury Engine Nexus */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center p-6 rounded-2xl bg-gradient-to-b from-slate-900/90 via-slate-900/70 to-slate-950 border border-emerald-500/30 relative">
          {/* Animated pulsing ring */}
          <div className="absolute inset-0 border border-emerald-500/20 rounded-2xl animate-pulse-ring pointer-events-none" />

          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-500 to-cyan-400 p-0.5 shadow-xl shadow-emerald-500/20 mb-3 flex items-center justify-center">
            <div className="w-full h-full bg-[#090b10] rounded-[14px] flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-emerald-400 animate-pulse" />
            </div>
          </div>

          <span className="text-[10px] font-mono tracking-widest uppercase text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/25 mb-1">
            Zero-Loss Liquidity Hub
          </span>
          <h3 className="text-xl font-bold text-white">Quantum Treasury Core</h3>
          <p className="text-xs text-slate-400 text-center max-w-xs mt-1 mb-4">
            Automated sub-second routing algorithms split all inbound deposits into dedicated vaults, tax escrows, and active yields
          </p>

          <div className="grid grid-cols-2 gap-3 w-full max-w-xs">
            <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800 text-center">
              <span className="text-[10px] text-slate-400 block font-mono">Total Throughput</span>
              <span className="text-sm font-bold text-white font-mono">{formatAmount(totalInflow)}</span>
            </div>
            <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800 text-center">
              <span className="text-[10px] text-slate-400 block font-mono">Routing Latency</span>
              <span className="text-sm font-bold text-emerald-400 font-mono">48ms Instant</span>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-1.5 text-[11px] text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>FDIC Insured Sweep up to $25M</span>
          </div>
        </div>

        {/* Right Column: Capital Destinations */}
        <div className="lg:col-span-4 space-y-2.5">
          <div className="text-xs font-mono uppercase tracking-wider text-slate-400 flex items-center justify-between px-1">
            <span>Automated Allocation</span>
            <span className="text-cyan-400 font-semibold">{formatAmount(totalInflow)}</span>
          </div>

          {destinations.map((dst) => {
            const isHovered = activeNode === dst.id;
            return (
              <div
                key={dst.id}
                onMouseEnter={() => setActiveNode(dst.id)}
                onMouseLeave={() => setActiveNode(null)}
                className={`p-3 rounded-xl border transition-all cursor-pointer relative ${
                  isHovered
                    ? 'bg-slate-800/90 border-cyan-400 shadow-lg shadow-cyan-500/10 scale-[1.02]'
                    : 'bg-slate-900/60 border-slate-800/90 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: dst.color }} />
                    <span className="text-xs font-semibold text-slate-200">{dst.name}</span>
                  </div>
                  <span className="text-xs font-mono font-bold text-white">{formatAmount(dst.amount)}</span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span className="truncate max-w-[190px]">{dst.desc}</span>
                  <span className="font-mono text-cyan-400 font-medium">{dst.pct}</span>
                </div>
                {/* Visual bar */}
                <div className="w-full h-1 bg-slate-800 rounded-full mt-2 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: dst.pct,
                      backgroundColor: dst.color,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer statistics ribbon */}
      <div className="mt-6 pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between text-xs text-slate-400 gap-4">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Smart Rules Active: <strong className="text-slate-200">5 Autonomous Split Rules</strong></span>
        </div>
        <div className="flex items-center gap-4 font-mono text-[11px]">
          <span>Net Savings Rate: <span className="text-emerald-400 font-bold">54.2%</span></span>
          <span>Tax Hedging Ratio: <span className="text-cyan-400 font-bold">100% Locked</span></span>
        </div>
      </div>
    </div>
  );
};
