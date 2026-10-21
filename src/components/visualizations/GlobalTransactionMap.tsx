import React, { useState, useEffect } from 'react';
import { Globe, Radio, Zap, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface CityNode {
  id: string;
  name: string;
  country: string;
  x: number; // SVG coordinate (0 - 800)
  y: number; // SVG coordinate (0 - 400)
  volume: string;
  latency: string;
  rail: string;
  status: 'optimal' | 'busy';
}

const HUBS: CityNode[] = [
  { id: 'nyc', name: 'New York', country: 'USA', x: 220, y: 145, volume: '$48.2M', latency: '24ms', rail: 'FedNow / CHIPS', status: 'optimal' },
  { id: 'lon', name: 'London', country: 'UK', x: 390, y: 110, volume: '$34.8M', latency: '42ms', rail: 'CHAPS / Faster Payments', status: 'optimal' },
  { id: 'zrh', name: 'Zurich', country: 'Switzerland', x: 420, y: 130, volume: '$62.1M', latency: '38ms', rail: 'SIC / SEPA Instant', status: 'optimal' },
  { id: 'dxb', name: 'Dubai', country: 'UAE', x: 505, y: 175, volume: '$28.4M', latency: '65ms', rail: 'UAEFTS / Instant', status: 'optimal' },
  { id: 'sgp', name: 'Singapore', country: 'Singapore', x: 620, y: 235, volume: '$39.0M', latency: '52ms', rail: 'FAST / PayNow Global', status: 'optimal' },
  { id: 'tyo', name: 'Tokyo', country: 'Japan', x: 695, y: 155, volume: '$22.5M', latency: '78ms', rail: 'Zengin / BOJ-NET', status: 'optimal' },
  { id: 'syd', name: 'Sydney', country: 'Australia', x: 710, y: 310, volume: '$16.2M', latency: '88ms', rail: 'NPP / OSKO', status: 'optimal' },
];

export const GlobalTransactionMap: React.FC = () => {
  const [selectedHub, setSelectedHub] = useState<CityNode>(HUBS[0]);
  const [activeWire, setActiveWire] = useState<{ from: CityNode; to: CityNode; amount: string; id: string }>({
    from: HUBS[0],
    to: HUBS[2],
    amount: '$250,000 USD',
    id: 'TX-WIRE-9921',
  });

  // Cycle animated active wires periodically
  useEffect(() => {
    const timer = setInterval(() => {
      const fromIdx = Math.floor(Math.random() * HUBS.length);
      let toIdx = Math.floor(Math.random() * HUBS.length);
      while (toIdx === fromIdx) {
        toIdx = Math.floor(Math.random() * HUBS.length);
      }
      const amounts = ['$50,000 EUR', '$140,000 USD', '$75,000 CHF', '$320,000 USD', '$98,000 SGD'];
      setActiveWire({
        from: HUBS[fromIdx],
        to: HUBS[toIdx],
        amount: amounts[Math.floor(Math.random() * amounts.length)],
        id: `TX-WIRE-${Math.floor(Math.random() * 8999 + 1000)}`,
      });
    }, 4500);

    return () => clearInterval(timer);
  }, []);

  // Compute curved SVG quadratic bezier path between two nodes
  const getCurvePath = (start: CityNode, end: CityNode) => {
    const midX = (start.x + end.x) / 2;
    const midY = Math.min(start.y, end.y) - 40; // arch upwards
    return `M ${start.x} ${start.y} Q ${midX} ${midY} ${end.x} ${end.y}`;
  };

  return (
    <div className="glass-panel rounded-2xl p-6 border border-slate-800/80 relative overflow-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Globe className="w-4 h-4" />
            </span>
            <h2 className="text-lg font-bold text-white tracking-wide">
              Global Multi-Currency Settlement Radar
            </h2>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              GLOBAL GRID ONLINE
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time cross-border liquidity routing, FX settlement rails, and sub-100ms international clearing nodes
          </p>
        </div>

        {/* Status pills */}
        <div className="flex items-center gap-3 text-xs font-mono">
          <div className="bg-slate-900/80 px-3 py-1.5 rounded-xl border border-slate-800 flex items-center gap-2">
            <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
            <span className="text-slate-300">Avg Settlement: <strong className="text-emerald-400">46ms</strong></span>
          </div>
        </div>
      </div>

      {/* SVG Map Canvas */}
      <div className="relative bg-gradient-to-b from-slate-950 via-[#0b0f19] to-slate-950 rounded-2xl p-4 border border-slate-800/80">
        <svg viewBox="0 0 800 380" className="w-full h-64 md:h-80 select-none">
          <defs>
            {/* Grid pattern */}
            <pattern id="gridPattern" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255, 255, 255, 0.03)" strokeWidth="1" />
            </pattern>

            <linearGradient id="arcGlow" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="50%" stopColor="#06b6d4" />
              <stop offset="100%" stopColor="#3b82f6" />
            </linearGradient>

            <filter id="glowFilter">
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Grid Background */}
          <rect width="800" height="380" fill="url(#gridPattern)" />

          {/* World Map Simplified Geometric Continents (Subtle background paths) */}
          {/* North America */}
          <path
            d="M 120 70 L 260 70 L 290 120 L 250 170 L 190 190 L 160 140 Z"
            fill="rgba(30, 41, 59, 0.35)"
            stroke="rgba(51, 65, 85, 0.3)"
            strokeWidth="1"
          />
          {/* South America */}
          <path
            d="M 230 200 L 290 220 L 280 310 L 240 340 L 210 250 Z"
            fill="rgba(30, 41, 59, 0.35)"
            stroke="rgba(51, 65, 85, 0.3)"
            strokeWidth="1"
          />
          {/* Europe */}
          <path
            d="M 370 75 L 450 70 L 470 120 L 430 150 L 370 140 Z"
            fill="rgba(30, 41, 59, 0.35)"
            stroke="rgba(51, 65, 85, 0.3)"
            strokeWidth="1"
          />
          {/* Africa */}
          <path
            d="M 380 160 L 460 160 L 490 230 L 450 310 L 400 290 L 370 200 Z"
            fill="rgba(30, 41, 59, 0.35)"
            stroke="rgba(51, 65, 85, 0.3)"
            strokeWidth="1"
          />
          {/* Asia */}
          <path
            d="M 480 70 L 710 80 L 740 180 L 650 250 L 540 210 L 490 140 Z"
            fill="rgba(30, 41, 59, 0.35)"
            stroke="rgba(51, 65, 85, 0.3)"
            strokeWidth="1"
          />
          {/* Australia */}
          <path
            d="M 660 270 L 740 260 L 750 330 L 680 340 Z"
            fill="rgba(30, 41, 59, 0.35)"
            stroke="rgba(51, 65, 85, 0.3)"
            strokeWidth="1"
          />

          {/* Baseline network connections */}
          {HUBS.map((hub, idx) => {
            const nextHub = HUBS[(idx + 1) % HUBS.length];
            return (
              <path
                key={`line-${idx}`}
                d={getCurvePath(hub, nextHub)}
                fill="none"
                stroke="rgba(255, 255, 255, 0.08)"
                strokeWidth="1"
                strokeDasharray="2 4"
              />
            );
          })}

          {/* Active Wire Animated Arch */}
          <path
            d={getCurvePath(activeWire.from, activeWire.to)}
            fill="none"
            stroke="url(#arcGlow)"
            strokeWidth="2.5"
            strokeLinecap="round"
            filter="url(#glowFilter)"
          />

          {/* Hub Nodes */}
          {HUBS.map((hub) => {
            const isSelected = selectedHub.id === hub.id;
            const isWireEndpoint = activeWire.from.id === hub.id || activeWire.to.id === hub.id;

            return (
              <g
                key={hub.id}
                onClick={() => setSelectedHub(hub)}
                className="cursor-pointer group"
              >
                {/* Outer pulsing ring for active nodes */}
                {isWireEndpoint && (
                  <circle
                    cx={hub.x}
                    cy={hub.y}
                    r="12"
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="1.5"
                    className="animate-ping"
                    opacity="0.6"
                  />
                )}

                {/* Base circle */}
                <circle
                  cx={hub.x}
                  cy={hub.y}
                  r={isSelected ? '7' : '5'}
                  fill={isSelected ? '#06b6d4' : isWireEndpoint ? '#10b981' : '#64748b'}
                  stroke="#090b10"
                  strokeWidth="2"
                  className="transition-all duration-300 group-hover:scale-125"
                />

                {/* City Name label */}
                <text
                  x={hub.x}
                  y={hub.y - 12}
                  textAnchor="middle"
                  fill={isSelected ? '#38bdf8' : '#94a3b8'}
                  fontSize="11"
                  fontWeight="600"
                  fontFamily="'JetBrains Mono', monospace"
                  className="pointer-events-none drop-shadow"
                >
                  {hub.name}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Selected Hub Floating Intelligence Card */}
        <div className="absolute bottom-4 left-4 right-4 sm:right-auto sm:w-80 bg-slate-900/90 backdrop-blur-md p-3.5 rounded-xl border border-slate-700/80 shadow-2xl">
          <div className="flex items-center justify-between mb-2">
            <div>
              <span className="text-[10px] font-mono uppercase text-slate-400">Financial Clearance Hub</span>
              <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                {selectedHub.name}, {selectedHub.country}
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              </h4>
            </div>
            <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
              {selectedHub.latency}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[11px] font-mono pt-2 border-t border-slate-800">
            <div>
              <span className="text-slate-500 block">Daily Clearance</span>
              <span className="text-slate-200 font-semibold">{selectedHub.volume}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Primary Clearing Rail</span>
              <span className="text-slate-200 font-semibold truncate block">{selectedHub.rail}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Live In-Flight Transfer Ticker */}
      <div className="mt-4 p-3 bg-slate-900/60 rounded-xl border border-emerald-500/20 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-emerald-400 animate-bounce" />
          <span className="text-slate-400">In-Flight Cross-Border Wire:</span>
          <span className="text-white font-bold">{activeWire.id}</span>
        </div>

        <div className="flex items-center gap-2 text-slate-300">
          <span className="text-emerald-400 font-semibold">{activeWire.from.name}</span>
          <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
          <span className="text-cyan-400 font-semibold">{activeWire.to.name}</span>
          <span className="text-white font-bold bg-slate-800 px-2 py-0.5 rounded ml-2">
            {activeWire.amount}
          </span>
        </div>
      </div>
    </div>
  );
};
