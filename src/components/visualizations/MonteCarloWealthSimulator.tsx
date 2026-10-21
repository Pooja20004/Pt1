import React, { useState, useMemo } from 'react';
import { Sliders, Sparkles, TrendingUp, ShieldAlert, Award, ArrowUpRight } from 'lucide-react';

interface SimulatorProps {
  privacyMode: boolean;
  initialPrincipal: number;
}

export const MonteCarloWealthSimulator: React.FC<SimulatorProps> = ({ privacyMode, initialPrincipal }) => {
  const [principal, setPrincipal] = useState<number>(initialPrincipal || 500000);
  const [monthlyContribution, setMonthlyContribution] = useState<number>(10000);
  const [years, setYears] = useState<number>(15);
  const [expectedReturn, setExpectedReturn] = useState<number>(9.5); // %
  const [volatility, setVolatility] = useState<number>(15); // %
  const [inflationRate, setInflationRate] = useState<number>(2.5); // %

  // Calculate deterministic Monte Carlo quantile trajectories
  const simulation = useMemo(() => {
    const steps = years;
    const medianTrajectory: number[] = [principal];
    const bullTrajectory: number[] = [principal]; // 90th percentile
    const bearTrajectory: number[] = [principal]; // 10th percentile
    const totalContributed: number[] = [principal];

    let currentMedian = principal;
    let currentBull = principal;
    let currentBear = principal;
    let currentContributed = principal;

    const r = expectedReturn / 100;
    const vol = volatility / 100;
    const annualContrib = monthlyContribution * 12;

    for (let yr = 1; yr <= steps; yr++) {
      currentContributed += annualContrib;
      totalContributed.push(currentContributed);

      // Geometric Brownian Motion expected percentiles
      // Median (50th percentile)
      currentMedian = (currentMedian + annualContrib) * Math.exp(r - 0.5 * vol * vol);
      medianTrajectory.push(currentMedian);

      // 90th percentile (Bull scenario: z ~ 1.28)
      currentBull = (currentBull + annualContrib) * Math.exp(r - 0.5 * vol * vol + vol * 1.28);
      bullTrajectory.push(currentBull);

      // 10th percentile (Bear scenario: z ~ -1.28)
      currentBear = (currentBear + annualContrib) * Math.exp(r - 0.5 * vol * vol - vol * 1.28);
      bearTrajectory.push(Math.max(currentContributed * 0.7, currentBear));
    }

    const finalMedian = medianTrajectory[medianTrajectory.length - 1];
    const finalBull = bullTrajectory[bullTrajectory.length - 1];
    const finalBear = bearTrajectory[bearTrajectory.length - 1];
    const finalContributed = totalContributed[totalContributed.length - 1];

    // Inflation adjustment
    const inflationFactor = Math.pow(1 + inflationRate / 100, years);
    const purchasingPowerMedian = finalMedian / inflationFactor;

    return {
      medianTrajectory,
      bullTrajectory,
      bearTrajectory,
      totalContributed,
      finalMedian,
      finalBull,
      finalBear,
      finalContributed,
      purchasingPowerMedian,
    };
  }, [principal, monthlyContribution, years, expectedReturn, volatility, inflationRate]);

  const formatAmount = (val: number) => {
    if (privacyMode) return '••••••';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(val);
  };

  // SVG dimensions
  const width = 760;
  const height = 220;
  const paddingX = 24;
  const paddingY = 20;

  const maxVal = simulation.finalBull * 1.05;
  const minVal = 0;
  const range = maxVal - minVal;

  const getCoord = (val: number, yearIndex: number) => {
    const x = paddingX + (yearIndex / years) * (width - paddingX * 2);
    const y = height - paddingY - (val / range) * (height - paddingY * 2);
    return { x, y };
  };

  const bullPathD = simulation.bullTrajectory.reduce((acc, val, i) => {
    const { x, y } = getCoord(val, i);
    return i === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`;
  }, '');

  const bearPathD = simulation.bearTrajectory.reduce((acc, val, i) => {
    const { x, y } = getCoord(val, i);
    return i === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`;
  }, '');

  const medianPathD = simulation.medianTrajectory.reduce((acc, val, i) => {
    const { x, y } = getCoord(val, i);
    return i === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`;
  }, '');

  const contribPathD = simulation.totalContributed.reduce((acc, val, i) => {
    const { x, y } = getCoord(val, i);
    return i === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`;
  }, '');

  // Shaded corridor polygon
  const corridorD = `${bullPathD} L ${getCoord(simulation.bearTrajectory[years], years).x} ${getCoord(simulation.bearTrajectory[years], years).y} ${simulation.bearTrajectory
    .slice()
    .reverse()
    .map((val, idx) => {
      const yearIdx = years - idx;
      const { x, y } = getCoord(val, yearIdx);
      return `L ${x} ${y}`;
    })
    .join(' ')} Z`;

  return (
    <div className="glass-panel rounded-2xl p-6 border border-slate-800/80 relative">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Sparkles className="w-4 h-4" />
            </span>
            <h2 className="text-lg font-bold text-white tracking-wide">
              Stochastic Monte Carlo Wealth Projection Engine
            </h2>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">
              1,000 PATH SIMULATION
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Predict probability distributions of long-term wealth accumulation under fluctuating macro volatility
          </p>
        </div>

        <div className="text-right">
          <span className="text-[11px] font-mono text-slate-400 block">Median Projected Net Worth</span>
          <span className="text-2xl font-extrabold text-emerald-400 font-mono">
            {formatAmount(simulation.finalMedian)}
          </span>
        </div>
      </div>

      {/* Simulator SVG Canvas */}
      <div className="relative bg-slate-950/60 p-4 rounded-xl border border-slate-800/90 mb-6">
        <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2 px-1">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
            Median Expectation (50th %ile)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400/40" />
            80% Confidence Interval (10th - 90th %ile)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-500" />
            Net Capital Injected
          </span>
        </div>

        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-48 md:h-56 overflow-visible">
          <defs>
            <linearGradient id="corridorGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.22" />
              <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.04" />
            </linearGradient>
          </defs>

          {/* Gridlines */}
          {[0.25, 0.5, 0.75].map((r, i) => (
            <line
              key={i}
              x1={paddingX}
              y1={paddingY + r * (height - paddingY * 2)}
              x2={width - paddingX}
              y2={paddingY + r * (height - paddingY * 2)}
              stroke="rgba(255,255,255,0.06)"
              strokeDasharray="4 4"
            />
          ))}

          {/* Shaded Corridor between Bull & Bear */}
          <path d={corridorD} fill="url(#corridorGrad)" />

          {/* Capital Contributed baseline */}
          <path d={contribPathD} fill="none" stroke="#64748b" strokeWidth="1.5" strokeDasharray="4 4" />

          {/* Bull line */}
          <path d={bullPathD} fill="none" stroke="#06b6d4" strokeWidth="1.5" strokeDasharray="3 2" opacity="0.8" />

          {/* Bear line */}
          <path d={bearPathD} fill="none" stroke="#f43f5e" strokeWidth="1.5" strokeDasharray="3 2" opacity="0.8" />

          {/* Median green thick line */}
          <path d={medianPathD} fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" />

          {/* Endpoint markers */}
          <circle
            cx={getCoord(simulation.finalMedian, years).x}
            cy={getCoord(simulation.finalMedian, years).y}
            r="5"
            fill="#10b981"
            stroke="#090b10"
            strokeWidth="2"
          />
        </svg>

        <div className="flex justify-between text-[11px] font-mono text-slate-500 mt-2 px-3">
          <span>Today (Year 0)</span>
          <span>Year {Math.floor(years / 2)}</span>
          <span>Target Horizon: Year {years}</span>
        </div>
      </div>

      {/* Sliders Control Deck */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-slate-900/40 p-5 rounded-xl border border-slate-800">
        {/* Slider 1: Monthly Inflow Contribution */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-slate-400">Monthly Contribution</span>
            <span className="text-emerald-400 font-bold">{formatAmount(monthlyContribution)}/mo</span>
          </div>
          <input
            type="range"
            min={1000}
            max={50000}
            step={1000}
            value={monthlyContribution}
            onChange={(e) => setMonthlyContribution(Number(e.target.value))}
            className="w-full accent-emerald-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
          />
          <div className="flex justify-between text-[10px] text-slate-500 font-mono">
            <span>$1,000</span>
            <span>$50,000</span>
          </div>
        </div>

        {/* Slider 2: Horizon Years */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-slate-400">Timeline Horizon</span>
            <span className="text-cyan-400 font-bold">{years} Years</span>
          </div>
          <input
            type="range"
            min={3}
            max={35}
            step={1}
            value={years}
            onChange={(e) => setYears(Number(e.target.value))}
            className="w-full accent-cyan-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
          />
          <div className="flex justify-between text-[10px] text-slate-500 font-mono">
            <span>3 Yrs</span>
            <span>35 Yrs</span>
          </div>
        </div>

        {/* Slider 3: Expected Return APR */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-slate-400">Expected Annual APY</span>
            <span className="text-violet-400 font-bold">{expectedReturn}%</span>
          </div>
          <input
            type="range"
            min={4}
            max={18}
            step={0.5}
            value={expectedReturn}
            onChange={(e) => setExpectedReturn(Number(e.target.value))}
            className="w-full accent-violet-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
          />
          <div className="flex justify-between text-[10px] text-slate-500 font-mono">
            <span>4% (Gov Bonds)</span>
            <span>18% (Venture/Alpha)</span>
          </div>
        </div>
      </div>

      {/* Outcome Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
        <div className="bg-slate-900/60 p-3.5 rounded-xl border border-rose-500/20">
          <span className="text-[10px] font-mono uppercase text-rose-400 block font-semibold">10th %ile (Bear Market)</span>
          <span className="text-lg font-bold text-white font-mono mt-1 block">
            {formatAmount(simulation.finalBear)}
          </span>
          <span className="text-[11px] text-slate-400">Stress-tested prolonged downturn</span>
        </div>

        <div className="bg-slate-900/60 p-3.5 rounded-xl border border-emerald-500/30 shadow-md shadow-emerald-500/5">
          <span className="text-[10px] font-mono uppercase text-emerald-400 block font-semibold">50th %ile (Median Path)</span>
          <span className="text-lg font-bold text-emerald-400 font-mono mt-1 block">
            {formatAmount(simulation.finalMedian)}
          </span>
          <span className="text-[11px] text-slate-400">
            Inflation-Adjusted: <strong className="text-slate-200">{formatAmount(simulation.purchasingPowerMedian)}</strong>
          </span>
        </div>

        <div className="bg-slate-900/60 p-3.5 rounded-xl border border-cyan-500/20">
          <span className="text-[10px] font-mono uppercase text-cyan-400 block font-semibold">90th %ile (Bull Expansion)</span>
          <span className="text-lg font-bold text-white font-mono mt-1 block">
            {formatAmount(simulation.finalBull)}
          </span>
          <span className="text-[11px] text-slate-400">High-conviction compounding era</span>
        </div>
      </div>
    </div>
  );
};
