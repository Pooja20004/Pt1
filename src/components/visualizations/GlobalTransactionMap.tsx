import React, { useState, useEffect } from 'react';
import { Globe, Radio, Zap, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface CityNode {
  id: string;
  name: string;
  country: string;
  state?: string;
  x: number; // SVG coordinate (0 - 800)
  y: number; // SVG coordinate (0 - 400)
  volume: string;
  latency: string;
  rail: string;
  status: 'optimal' | 'busy';
}

const HUBS: CityNode[] = [
  { id: 'blr', name: 'Bengaluru', state: 'Karnataka', country: 'India', x: 440, y: 250, volume: '₹148.2 Cr', latency: '12ms', rail: 'UPI Switch / NPCI Hub', status: 'optimal' },
  { id: 'bom', name: 'Mumbai', state: 'Maharashtra', country: 'India', x: 410, y: 200, volume: '₹320.5 Cr', latency: '15ms', rail: 'RBI RTGS / CCIL Clearing', status: 'optimal' },
  { id: 'del', name: 'New Delhi', state: 'NCR', country: 'India', x: 430, y: 130, volume: '₹185.0 Cr', latency: '18ms', rail: 'CBDT / Treasury Gateway', status: 'optimal' },
  { id: 'hyd', name: 'Hyderabad', state: 'Telangana', country: 'India', x: 450, y: 215, volume: '₹92.4 Cr', latency: '14ms', rail: 'IMPS 2.0 / Cyber Gateway', status: 'optimal' },
  { id: 'maa', name: 'Chennai', state: 'Tamil Nadu', country: 'India', x: 460, y: 260, volume: '₹84.6 Cr', latency: '16ms', rail: 'e-RUPI / Southern Grid', status: 'optimal' },
  { id: 'gift', name: 'GIFT City', state: 'Gujarat', country: 'India', x: 395, y: 175, volume: '₹240.8 Cr', latency: '22ms', rail: 'IFSCA International Forex', status: 'optimal' },
  { id: 'dxb', name: 'Dubai', country: 'UAE', x: 280, y: 165, volume: '₹110.2 Cr', latency: '42ms', rail: 'RuPay-UAE / CEPA Link', status: 'optimal' },
  { id: 'sin', name: 'Singapore', country: 'Singapore', x: 620, y: 270, volume: '₹95.0 Cr', latency: '38ms', rail: 'UPI-PayNow Bilateral', status: 'optimal' },
  { id: 'lon', name: 'London', country: 'UK', x: 180, y: 95, volume: '₹75.4 Cr', latency: '65ms', rail: 'SWIFT gpi Cross-Border', status: 'optimal' },
];

export const GlobalTransactionMap: React.FC = () => {
  const [selectedHub, setSelectedHub] = useState<CityNode>(HUBS[0]);
  const [activeWire, setActiveWire] = useState<{ from: CityNode; to: CityNode; amount: string; id: string }>({
    from: HUBS[0],
    to: HUBS[1],
    amount: '₹25,00,000 INR (UPI 2.0)',
    id: 'UPI-NPCI-9921',
  });

  // Cycle animated active wires periodically
  useEffect(() => {
    const timer = setInterval(() => {
      const fromIdx = Math.floor(Math.random() * HUBS.length);
      let toIdx = Math.floor(Math.random() * HUBS.length);
      while (toIdx === fromIdx) {
        toIdx = Math.floor(Math.random() * HUBS.length);
      }
      const amounts = [
        '₹10,00,000 INR (UPI)',
        '₹45,00,000 INR (RTGS)',
        '₹1,25,00,000 INR (GIFT SEZ)',
        '₹5,00,000 INR (IMPS)',
        '₹75,00,000 INR (RBI Sweep)',
      ];
      setActiveWire({
        from: HUBS[fromIdx],
        to: HUBS[toIdx],
        amount: amounts[Math.floor(Math.random() * amounts.length)],
        id: `TX-SETTLE-${Math.floor(Math.random() * 8999 + 1000)}`,
      });
    }, 4500);

    return () => clearInterval(timer);
  }, []);

  // Compute curved SVG quadratic bezier path between two nodes
  const getCurvePath = (start: CityNode, end: CityNode) => {
    const midX = (start.x + end.x) / 2;
    const midY = Math.min(start.y, end.y) - 35; // arch upwards
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
              Bharat & Global IFSC Settlement Radar (भारत ग्रिड)
            </h2>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              NPCI / RBI SWITCH ACTIVE
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time interbank clearance across Indian metro nodes, GIFT City IFSC offshore corridors, and UPI-PayNow bilateral links
          </p>
        </div>

        {/* Status pills */}
        <div className="flex items-center gap-3 text-xs font-mono">
          <div className="bg-slate-900/80 px-3 py-1.5 rounded-xl border border-slate-800 flex items-center gap-2">
            <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
            <span className="text-slate-300">Avg Domestic Latency: <strong className="text-emerald-400">14ms (UPI)</strong></span>
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
              <stop offset="100%" stopColor="#f59e0b" />
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

          {/* Simplified Geometric Continents with India Highlight */}
          {/* Europe & Middle East */}
          <path
            d="M 120 70 L 260 65 L 300 150 L 250 190 L 160 140 Z"
            fill="rgba(30, 41, 59, 0.25)"
            stroke="rgba(51, 65, 85, 0.2)"
            strokeWidth="1"
          />
          {/* Middle East & Arabian Peninsula */}
          <path
            d="M 270 140 L 330 145 L 340 210 L 290 230 Z"
            fill="rgba(30, 41, 59, 0.35)"
            stroke="rgba(51, 65, 85, 0.3)"
            strokeWidth="1"
          />
          {/* INDIA SUB-CONTINENT GEOMETRY (Prominently styled in emerald glow) */}
          <path
            d="M 390 100 L 460 100 L 480 160 L 490 220 L 450 310 L 400 240 L 375 160 Z"
            fill="rgba(16, 185, 129, 0.08)"
            stroke="rgba(16, 185, 129, 0.35)"
            strokeWidth="1.5"
          />
          {/* South East Asia */}
          <path
            d="M 520 180 L 650 190 L 680 270 L 590 290 Z"
            fill="rgba(30, 41, 59, 0.25)"
            stroke="rgba(51, 65, 85, 0.2)"
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
            const isIndianHub = hub.country === 'India';

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
                  r={isSelected ? '7' : isIndianHub ? '6' : '5'}
                  fill={isSelected ? '#06b6d4' : isWireEndpoint ? '#10b981' : isIndianHub ? '#10b981' : '#64748b'}
                  stroke="#090b10"
                  strokeWidth="2"
                  className="transition-all duration-300 group-hover:scale-125"
                />

                {/* City Name label */}
                <text
                  x={hub.x}
                  y={hub.y - 12}
                  textAnchor="middle"
                  fill={isSelected ? '#38bdf8' : isIndianHub ? '#34d399' : '#94a3b8'}
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
              <span className="text-[10px] font-mono uppercase text-slate-400">
                {selectedHub.country === 'India' ? 'Domestic NPCI Switch' : 'International Corridor'}
              </span>
              <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                {selectedHub.name}{selectedHub.state ? `, ${selectedHub.state}` : `, ${selectedHub.country}`}
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              </h4>
            </div>
            <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
              {selectedHub.latency}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[11px] font-mono pt-2 border-t border-slate-800">
            <div>
              <span className="text-slate-500 block">Daily Throughput</span>
              <span className="text-slate-200 font-semibold">{selectedHub.volume}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Clearing Switch</span>
              <span className="text-slate-200 font-semibold truncate block">{selectedHub.rail}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Live In-Flight Transfer Ticker */}
      <div className="mt-4 p-3 bg-slate-900/60 rounded-xl border border-emerald-500/20 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-emerald-400 animate-bounce" />
          <span className="text-slate-400">Live Settlement In-Flight:</span>
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
