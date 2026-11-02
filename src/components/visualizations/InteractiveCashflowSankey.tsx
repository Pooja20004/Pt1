import React, { useState } from 'react';
import { Layers, Sparkles, ShieldCheck } from 'lucide-react';
import { formatINR } from '../../utils/formatters';

interface SankeyProps {
  privacyMode: boolean;
}

export const InteractiveCashflowSankey: React.FC<SankeyProps> = ({ privacyMode }) => {
  const [timeframe, setTimeframe] = useState<'monthly' | 'quarterly' | 'annual'>('monthly');
  const [activeNode, setActiveNode] = useState<string | null>(null);

  const multiplier = timeframe === 'monthly' ? 1 : timeframe === 'quarterly' ? 3 : 12;

  const sources = [
    { id: 'saas', name: 'Razorpay SaaS & Enterprise', amount: 1245000, color: '#2563eb', pct: '50.8%' },
    { id: 'nifty', name: 'Nifty 50 & SGB Interest', amount: 425000, color: '#0284c7', pct: '17.3%' },
    { id: 'treasury', name: 'Artha 7.45% Liquid Yield', amount: 380000, color: '#4f46e5', pct: '15.5%' },
    { id: 'advisory', name: 'Tech Advisory Retainers', amount: 400000, color: '#059669', pct: '16.4%' },
  ];

  const totalInflow = sources.reduce((acc, s) => acc + s.amount, 0);

  const destinations = [
    { id: 'vault', name: 'Artha Liquid Vault (7.45% p.a.)', amount: 950000, color: '#2563eb', pct: '38.8%', desc: 'Compounding T-Bill reserve' },
    { id: 'tax', name: 'Advance Tax (Sec 208) & GST', amount: 550000, color: '#64748b', pct: '22.4%', desc: 'Zero penalty 234B/C hedge' },
    { id: 'invest', name: 'Mutual Funds & Demat Basket', amount: 350000, color: '#4f46e5', pct: '14.3%', desc: 'Nifty & GIFT City equities' },
    { id: 'payroll', name: 'RazorpayX Team Payroll', amount: 450000, color: '#dc2626', pct: '18.4%', desc: 'Engineering & cloud infra' },
    { id: 'lifestyle', name: 'Executive Lifestyle & Travel', amount: 150000, color: '#0891b2', pct: '6.1%', desc: 'Tata Neu, Air India, dining' },
  ];

  return (
    <div className="glass-panel rounded-2xl p-6 border border-slate-200 bg-white shadow-xs relative overflow-hidden">
      {/* Background glow accents */}
      <div className="absolute -top-24 -right-24 w-72 h-72 bg-blue-100/50 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-indigo-100/50 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-blue-50 text-blue-600 border border-blue-200">
              <Layers className="w-4 h-4" />
            </span>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight font-sans">
              Autonomous Liquidity & Cashflow Sankey Stream (भारत ग्रिड)
            </h2>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 font-mono font-semibold border border-blue-200">
              UPI & RTGS ROUTING
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Visualizing real-time INR capital flow from origin revenues through the central treasury engine into high-yield vaults, advance tax, and operations
          </p>
        </div>

        {/* Timeframe toggle */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 self-start">
          {(['monthly', 'quarterly', 'annual'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTimeframe(t)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                timeframe === t
                  ? 'bg-blue-600 text-white font-bold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
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
          <div className="text-xs font-mono uppercase tracking-wider text-slate-500 font-semibold flex items-center justify-between px-1">
            <span>Inflow Origins</span>
            <span className="text-blue-700 font-bold">{formatINR(totalInflow * multiplier, privacyMode)}</span>
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
                    ? 'bg-blue-50/70 border-blue-400 shadow-sm scale-[1.02]'
                    : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold text-slate-800">{src.name}</span>
                  <span className="text-xs font-mono font-bold text-slate-900">
                    {formatINR(src.amount * multiplier, privacyMode)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: src.color }} />
                    {src.pct} of inflow
                  </span>
                  <span className="text-blue-700 font-mono text-[10px] font-semibold">NPCI VERIFIED</span>
                </div>
                {/* Visual bar */}
                <div className="w-full h-1.5 bg-slate-200 rounded-full mt-2 overflow-hidden">
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
        <div className="lg:col-span-5 flex flex-col items-center justify-center p-6 rounded-2xl bg-gradient-to-b from-blue-50/90 via-indigo-50/40 to-white border border-blue-200 relative shadow-sm">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-700 to-indigo-600 p-0.5 shadow-md shadow-blue-500/20 mb-3 flex items-center justify-center">
            <div className="w-full h-full bg-blue-600 rounded-[14px] flex items-center justify-center font-mono font-bold text-2xl text-white">
              ₹
            </div>
          </div>

          <span className="text-[10px] font-mono tracking-widest uppercase text-blue-700 bg-blue-100/70 px-2.5 py-0.5 rounded-full border border-blue-300 font-semibold mb-1">
            RBI Regulated Architecture
          </span>
          <h3 className="text-xl font-bold text-slate-900 font-sans">Artha Treasury Engine</h3>
          <p className="text-xs text-slate-600 text-center max-w-xs mt-1 mb-4">
            Sub-second algorithmic routing splits all inbound receipts into T-Bill liquid vaults, CBDT tax escrows, and operating working capital
          </p>

          <div className="grid grid-cols-2 gap-3 w-full max-w-xs">
            <div className="bg-white p-2.5 rounded-xl border border-slate-200 text-center shadow-2xs">
              <span className="text-[10px] text-slate-500 block font-mono font-semibold">Monthly Run-Rate</span>
              <span className="text-sm font-bold text-slate-900 font-mono">
                {formatINR(totalInflow * multiplier, privacyMode, true)}
              </span>
            </div>
            <div className="bg-white p-2.5 rounded-xl border border-slate-200 text-center shadow-2xs">
              <span className="text-[10px] text-slate-500 block font-mono font-semibold">UPI / RTGS Latency</span>
              <span className="text-sm font-bold text-blue-700 font-mono">18ms Instant</span>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-1.5 text-[11px] text-slate-600 font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
            <span>DICGC Insured & RBI Account Aggregator (AA)</span>
          </div>
        </div>

        {/* Right Column: Capital Destinations */}
        <div className="lg:col-span-4 space-y-2.5">
          <div className="text-xs font-mono uppercase tracking-wider text-slate-500 font-semibold flex items-center justify-between px-1">
            <span>Automated Allocation</span>
            <span className="text-blue-700 font-bold">{formatINR(totalInflow * multiplier, privacyMode)}</span>
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
                    ? 'bg-blue-50/70 border-blue-400 shadow-sm scale-[1.02]'
                    : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: dst.color }} />
                    <span className="text-xs font-semibold text-slate-800">{dst.name}</span>
                  </div>
                  <span className="text-xs font-mono font-bold text-slate-900">
                    {formatINR(dst.amount * multiplier, privacyMode)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span className="truncate max-w-[190px]">{dst.desc}</span>
                  <span className="font-mono text-blue-700 font-bold">{dst.pct}</span>
                </div>
                {/* Visual bar */}
                <div className="w-full h-1.5 bg-slate-200 rounded-full mt-2 overflow-hidden">
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
      <div className="mt-6 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between text-xs text-slate-500 gap-4">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
          <span>Autonomous Direct Tax Mandates: <strong className="text-slate-800">Sec 208 Advance Tax + GST Auto-Sweep</strong></span>
        </div>
        <div className="flex items-center gap-4 font-mono text-[11px]">
          <span>Net Savings Rate: <span className="text-blue-700 font-bold">53.1%</span></span>
          <span>Advance Tax Hedging: <span className="text-emerald-700 font-bold">100% Fully Funded</span></span>
        </div>
      </div>
    </div>
  );
};
