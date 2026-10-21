import React, { useState, useMemo } from 'react';
import { TrendingUp, BarChart2, Calendar, Eye, Activity, Maximize2 } from 'lucide-react';

interface ChartProps {
  privacyMode: boolean;
  baseValuation: number;
}

type Timeframe = '1D' | '1W' | '1M' | '6M' | '1Y' | 'ALL';

export const PortfolioPerformanceChart: React.FC<ChartProps> = ({ privacyMode, baseValuation }) => {
  const [timeframe, setTimeframe] = useState<Timeframe>('1M');
  const [compareBenchmark, setCompareBenchmark] = useState<boolean>(true);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  // Generate deterministic realistic series data based on timeframe
  const points = useMemo(() => {
    const count = timeframe === '1D' ? 24 : timeframe === '1W' ? 28 : timeframe === '1M' ? 30 : 50;
    const data = [];
    let currentVal = baseValuation * 0.92;
    let benchmarkVal = 100;

    const now = new Date();

    for (let i = 0; i < count; i++) {
      const stepDate = new Date(now.getTime() - (count - i) * (timeframe === '1D' ? 3600000 : 86400000));
      // Realistic random walk with slight upward drift
      const delta = (Math.sin(i * 0.5) * 0.015 + (Math.cos(i * 0.8) * 0.008) + 0.003) * currentVal;
      currentVal = Math.max(baseValuation * 0.8, currentVal + delta);
      
      const benchDelta = (Math.sin(i * 0.4) * 0.008 + 0.001) * benchmarkVal;
      benchmarkVal += benchDelta;

      data.push({
        idx: i,
        date: stepDate.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          hour: timeframe === '1D' ? '2-digit' : undefined,
        }),
        value: currentVal,
        benchmark: benchmarkVal,
        volume: Math.floor(Math.random() * 850000 + 150000),
      });
    }

    // Ensure final point matches current baseValuation
    if (data.length > 0) {
      data[data.length - 1].value = baseValuation;
    }

    return data;
  }, [timeframe, baseValuation]);

  const activePoint = hoverIndex !== null && points[hoverIndex] ? points[hoverIndex] : points[points.length - 1];
  const startPoint = points[0];
  const changeVal = activePoint.value - startPoint.value;
  const changePct = ((changeVal / startPoint.value) * 100);

  // SVG coordinate calculations
  const minVal = Math.min(...points.map((p) => p.value)) * 0.98;
  const maxVal = Math.max(...points.map((p) => p.value)) * 1.02;
  const range = maxVal - minVal || 1;

  const width = 800;
  const height = 240;
  const paddingX = 20;
  const paddingY = 20;

  const getCoordinates = (p: { value: number }, i: number) => {
    const x = paddingX + (i / (points.length - 1)) * (width - paddingX * 2);
    const y = height - paddingY - ((p.value - minVal) / range) * (height - paddingY * 2);
    return { x, y };
  };

  const pathD = points.reduce((acc, p, i) => {
    const { x, y } = getCoordinates(p, i);
    return i === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`;
  }, '');

  const areaD = `${pathD} L ${width - paddingX} ${height} L ${paddingX} ${height} Z`;

  // Benchmark path
  const minBench = Math.min(...points.map((p) => p.benchmark));
  const maxBench = Math.max(...points.map((p) => p.benchmark));
  const benchRange = maxBench - minBench || 1;

  const benchPathD = points.reduce((acc, p, i) => {
    const x = paddingX + (i / (points.length - 1)) * (width - paddingX * 2);
    const y = height - paddingY - ((p.benchmark - minBench) / benchRange) * (height - paddingY * 2);
    return i === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`;
  }, '');

  const formatCurrency = (val: number) => {
    if (privacyMode) return '••••••••';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="glass-panel rounded-2xl p-6 border border-slate-800/80 relative">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Activity className="w-4 h-4" />
            </span>
            <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
              Institutional Valuation Engine
            </span>
          </div>

          <div className="flex items-baseline gap-3 mt-1.5">
            <h2 className="text-3xl font-extrabold text-white font-mono tracking-tight">
              {formatCurrency(activePoint.value)}
            </h2>
            <span
              className={`inline-flex items-center gap-1 text-sm font-semibold px-2 py-0.5 rounded-full ${
                changePct >= 0
                  ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                  : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              {changePct >= 0 ? '+' : ''}
              {changePct.toFixed(2)}% ({formatCurrency(Math.abs(changeVal))})
            </span>
          </div>
          <span className="text-[11px] font-mono text-slate-400">
            Recorded at {activePoint.date} (Automated Mark-to-Market)
          </span>
        </div>

        {/* Timeframe selector & Benchmark toggle */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setCompareBenchmark(!compareBenchmark)}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono border transition-all ${
              compareBenchmark
                ? 'bg-slate-800 text-cyan-300 border-cyan-500/40 shadow-sm'
                : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:text-slate-200'
            }`}
          >
            {compareBenchmark ? '● S&P 500 Overlay ON' : '○ Benchmark S&P 500'}
          </button>

          <div className="flex items-center bg-slate-900/90 p-1 rounded-xl border border-slate-800">
            {(['1D', '1W', '1M', '6M', '1Y', 'ALL'] as Timeframe[]).map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono font-medium transition-all ${
                  timeframe === tf
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* SVG Interactive Chart Canvas */}
      <div className="relative w-full overflow-hidden select-none">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-56 md:h-64 overflow-visible"
          onMouseLeave={() => setHoverIndex(null)}
        >
          <defs>
            <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.35" />
              <stop offset="60%" stopColor="#10b981" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.00" />
            </linearGradient>
            <linearGradient id="strokeGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#06b6d4" />
              <stop offset="50%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#3b82f6" />
            </linearGradient>
          </defs>

          {/* Horizontal Grid lines */}
          {[0.2, 0.4, 0.6, 0.8].map((ratio, idx) => (
            <line
              key={idx}
              x1={paddingX}
              y1={paddingY + ratio * (height - paddingY * 2)}
              x2={width - paddingX}
              y2={paddingY + ratio * (height - paddingY * 2)}
              stroke="rgba(255, 255, 255, 0.05)"
              strokeDasharray="4 4"
            />
          ))}

          {/* Area fill */}
          <path d={areaD} fill="url(#chartGradient)" />

          {/* S&P 500 comparison benchmark line */}
          {compareBenchmark && (
            <path
              d={benchPathD}
              fill="none"
              stroke="#94a3b8"
              strokeWidth="1.5"
              strokeDasharray="3 3"
              opacity="0.6"
            />
          )}

          {/* Main Portfolio stroke line */}
          <path
            d={pathD}
            fill="none"
            stroke="url(#strokeGradient)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Hover Crosshair and Dot */}
          {hoverIndex !== null && points[hoverIndex] && (
            <g>
              {/* Vertical line */}
              <line
                x1={getCoordinates(points[hoverIndex], hoverIndex).x}
                y1={paddingY}
                x2={getCoordinates(points[hoverIndex], hoverIndex).x}
                y2={height}
                stroke="#06b6d4"
                strokeWidth="1"
                strokeDasharray="2 2"
              />
              {/* Outer halo */}
              <circle
                cx={getCoordinates(points[hoverIndex], hoverIndex).x}
                cy={getCoordinates(points[hoverIndex], hoverIndex).y}
                r="7"
                fill="rgba(6, 182, 212, 0.25)"
                className="animate-ping"
              />
              {/* Center point */}
              <circle
                cx={getCoordinates(points[hoverIndex], hoverIndex).x}
                cy={getCoordinates(points[hoverIndex], hoverIndex).y}
                r="4.5"
                fill="#06b6d4"
                stroke="#090b10"
                strokeWidth="2"
              />
            </g>
          )}

          {/* Invisible hover trigger columns */}
          {points.map((p, i) => {
            const colWidth = (width - paddingX * 2) / points.length;
            const x = paddingX + i * colWidth - colWidth / 2;
            return (
              <rect
                key={i}
                x={x}
                y={0}
                width={colWidth}
                height={height}
                fill="transparent"
                onMouseEnter={() => setHoverIndex(i)}
                className="cursor-crosshair"
              />
            );
          })}
        </svg>

        {/* Date labels on bottom axis */}
        <div className="flex justify-between text-[10px] font-mono text-slate-400 mt-2 px-4">
          <span>{points[0]?.date}</span>
          <span>{points[Math.floor(points.length / 2)]?.date}</span>
          <span>{points[points.length - 1]?.date}</span>
        </div>
      </div>

      {/* Metric Cards Ribbon under chart */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6 pt-5 border-t border-slate-800/80">
        <div className="bg-slate-900/40 p-3 rounded-xl border border-slate-800">
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">Sharpe Ratio</span>
          <span className="text-base font-bold text-emerald-400 font-mono">2.84</span>
          <span className="text-[10px] text-slate-400 block mt-0.5">Top Decile Efficiency</span>
        </div>
        <div className="bg-slate-900/40 p-3 rounded-xl border border-slate-800">
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">Value at Risk (95% VaR)</span>
          <span className="text-base font-bold text-cyan-400 font-mono">1.12% Daily</span>
          <span className="text-[10px] text-slate-400 block mt-0.5">Algorithmic Risk Shield</span>
        </div>
        <div className="bg-slate-900/40 p-3 rounded-xl border border-slate-800">
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">Annualized APY Blended</span>
          <span className="text-base font-bold text-violet-400 font-mono">11.8% Net</span>
          <span className="text-[10px] text-slate-400 block mt-0.5">After all custodial fees</span>
        </div>
        <div className="bg-slate-900/40 p-3 rounded-xl border border-slate-800">
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">Hedging Allocation</span>
          <span className="text-base font-bold text-amber-400 font-mono">99.8% Hedged</span>
          <span className="text-[10px] text-slate-400 block mt-0.5">FX & Interest rate swaps</span>
        </div>
      </div>
    </div>
  );
};
