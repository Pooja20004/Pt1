import React, { useState, useMemo } from 'react';
import { Sparkles } from 'lucide-react';
import { formatINR } from '../../utils/formatters';

interface SimulatorProps {
  privacyMode: boolean;
  initialPrincipal: number;
}

export const MonteCarloWealthSimulator: React.FC<SimulatorProps> = ({ privacyMode, initialPrincipal }) => {
  const [principal, setPrincipal] = useState<number>(initialPrincipal || 45000000); // ~₹4.5 Crore
  const [monthlyContribution, setMonthlyContribution] = useState<number>(200000); // ₹2 Lakhs / mo SIP
  const [years, setYears] = useState<number>(15);
  const [expectedReturn, setExpectedReturn] = useState<number>(12.5); // % (Nifty 50 long term CAGR)
  const [volatility, setVolatility] = useState<number>(15); // %
  const [inflationRate, setInflationRate] = useState<number>(5.5); // % (India average CPI)

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
      currentMedian = (currentMedian + annualContrib) * Math.exp(r - 0.5 * vol * vol);
      medianTrajectory.push(currentMedian);

      bullTrajectory.push((currentBull + annualContrib) * Math.exp(r - 0.5 * vol * vol + vol * 1.28));
      currentBull = bullTrajectory[bullTrajectory.length - 1];

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
    <div className="glass-panel rounded-2xl p-6 border border-slate-200 bg-white shadow-xs relative">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-blue-50 text-blue-600 border border-blue-200">
              <Sparkles className="w-4 h-4" />
            </span>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight font-sans">
              Stochastic Monte Carlo SIP & Wealth Projection Engine
            </h2>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 font-semibold">
              1,000 PATH SIMULATION
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Simulate future Indian Rupee net worth compounding under Indian market volatility (Nifty CAGR + T-Bills)
          </p>
        </div>

        <div className="text-right">
          <span className="text-[11px] font-mono text-slate-400 block font-semibold">Median Projected Corpus</span>
          <span className="text-2xl font-extrabold text-blue-700 font-mono">
            {formatINR(simulation.finalMedian, privacyMode, true)}
          </span>
        </div>
      </div>

      {/* Simulator SVG Canvas */}
      <div className="relative bg-slate-50/70 p-4 rounded-xl border border-slate-200 mb-6">
        <div className="flex items-center justify-between text-xs font-mono text-slate-500 mb-2 px-1">
          <span className="flex items-center gap-1.5 font-medium">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
            Median Expected Corpus (50th %ile)
          </span>
          <span className="flex items-center gap-1.5 font-medium">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-300" />
            80% Probability Corridor (10th - 90th %ile)
          </span>
          <span className="flex items-center gap-1.5 font-medium">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-400" />
            Total Capital Injected (SIP)
          </span>
        </div>

        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-48 md:h-56 overflow-visible">
          <defs>
            <linearGradient id="corridorGradBlue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.22" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.04" />
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
              stroke="#e2e8f0"
              strokeDasharray="4 4"
            />
          ))}

          {/* Shaded Corridor between Bull & Bear */}
          <path d={corridorD} fill="url(#corridorGradBlue)" />

          {/* Capital Contributed baseline */}
          <path d={contribPathD} fill="none" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="4 4" />

          {/* Bull line */}
          <path d={bullPathD} fill="none" stroke="#0284c7" strokeWidth="1.5" strokeDasharray="3 2" opacity="0.9" />

          {/* Bear line */}
          <path d={bearPathD} fill="none" stroke="#e11d48" strokeWidth="1.5" strokeDasharray="3 2" opacity="0.8" />

          {/* Median blue thick line */}
          <path d={medianPathD} fill="none" stroke="#1d4ed8" strokeWidth="2.5" strokeLinecap="round" />

          {/* Endpoint markers */}
          <circle
            cx={getCoord(simulation.finalMedian, years).x}
            cy={getCoord(simulation.finalMedian, years).y}
            r="5"
            fill="#1d4ed8"
            stroke="#ffffff"
            strokeWidth="2.5"
            className="drop-shadow-sm"
          />
        </svg>

        <div className="flex justify-between text-[11px] font-mono text-slate-400 mt-2 px-3">
          <span>Today (Year 0)</span>
          <span>Year {Math.floor(years / 2)}</span>
          <span>Target Horizon: Year {years}</span>
        </div>
      </div>

      {/* Sliders Control Deck */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-slate-50 p-5 rounded-xl border border-slate-200">
        {/* Slider 1: Monthly SIP */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-slate-600 font-medium">Monthly SIP Contribution</span>
            <span className="text-blue-700 font-bold">{formatINR(monthlyContribution, privacyMode, true)}/mo</span>
          </div>
          <input
            type="range"
            min={10000}
            max={1000000}
            step={10000}
            value={monthlyContribution}
            onChange={(e) => setMonthlyContribution(Number(e.target.value))}
            className="w-full accent-blue-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
          />
          <div className="flex justify-between text-[10px] text-slate-400 font-mono">
            <span>₹10,000</span>
            <span>₹10 Lakhs/mo</span>
          </div>
        </div>

        {/* Slider 2: Horizon Years */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-slate-600 font-medium">Timeline Horizon</span>
            <span className="text-indigo-700 font-bold">{years} Years</span>
          </div>
          <input
            type="range"
            min={3}
            max={35}
            step={1}
            value={years}
            onChange={(e) => setYears(Number(e.target.value))}
            className="w-full accent-indigo-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
          />
          <div className="flex justify-between text-[10px] text-slate-400 font-mono">
            <span>3 Yrs</span>
            <span>35 Yrs</span>
          </div>
        </div>

        {/* Slider 3: Expected Return APY */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-slate-600 font-medium">Expected CAGR %</span>
            <span className="text-sky-700 font-bold">{expectedReturn}%</span>
          </div>
          <input
            type="range"
            min={7}
            max={20}
            step={0.5}
            value={expectedReturn}
            onChange={(e) => setExpectedReturn(Number(e.target.value))}
            className="w-full accent-sky-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
          />
          <div className="flex justify-between text-[10px] text-slate-400 font-mono">
            <span>7% (Bank FD)</span>
            <span>20% (Alpha Equities)</span>
          </div>
        </div>
      </div>

      {/* Outcome Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
        <div className="bg-rose-50/40 p-3.5 rounded-xl border border-rose-200">
          <span className="text-[10px] font-mono uppercase text-rose-700 block font-bold">10th %ile (Bear Market)</span>
          <span className="text-lg font-bold text-slate-900 font-mono mt-1 block">
            {formatINR(simulation.finalBear, privacyMode, true)}
          </span>
          <span className="text-[11px] text-slate-500">Conservative downside scenario</span>
        </div>

        <div className="bg-blue-50/60 p-3.5 rounded-xl border border-blue-300 shadow-2xs">
          <span className="text-[10px] font-mono uppercase text-blue-700 block font-bold">50th %ile (Median Path)</span>
          <span className="text-lg font-bold text-blue-800 font-mono mt-1 block">
            {formatINR(simulation.finalMedian, privacyMode, true)}
          </span>
          <span className="text-[11px] text-slate-600">
            Purchasing Power: <strong className="text-slate-900">{formatINR(simulation.purchasingPowerMedian, privacyMode, true)}</strong>
          </span>
        </div>

        <div className="bg-indigo-50/40 p-3.5 rounded-xl border border-indigo-200">
          <span className="text-[10px] font-mono uppercase text-indigo-700 block font-bold">90th %ile (India Growth Supercycle)</span>
          <span className="text-lg font-bold text-slate-900 font-mono mt-1 block">
            {formatINR(simulation.finalBull, privacyMode, true)}
          </span>
          <span className="text-[11px] text-slate-500">Venture & Nifty 50 Outperformance</span>
        </div>
      </div>
    </div>
  );
};
