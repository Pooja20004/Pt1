import React, { useState } from 'react';
import { PieChart } from 'lucide-react';
import { Transaction } from '../../types/fintech';
import { formatINR } from '../../utils/formatters';

interface DonutProps {
  transactions: Transaction[];
  privacyMode: boolean;
}

export const ExpenseCategoryDonut: React.FC<DonutProps> = ({ transactions, privacyMode }) => {
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

  // Group Indian outflows by category
  const categories = [
    { name: 'Team Payroll & Ops', color: '#2563eb', amount: 480000.0 },
    { name: 'Advance Tax & GST', color: '#059669', amount: 350000.0 },
    { name: 'SaaS & Cloud Infra', color: '#0284c7', amount: 214500.0 },
    { name: 'Logistics & Travel', color: '#4f46e5', amount: 56400.0 },
    { name: 'Dining & Lifestyle', color: '#d97706', amount: 34800.0 },
  ];

  const totalExpense = categories.reduce((sum, c) => sum + c.amount, 0);

  const radius = 70;
  const strokeWidth = 24;
  const center = 100;
  const circumference = 2 * Math.PI * radius;

  let accumulatedPercent = 0;

  const slices = categories.map((cat) => {
    const percent = cat.amount / totalExpense;
    const strokeDasharray = `${(percent * circumference).toFixed(2)} ${circumference.toFixed(2)}`;
    const strokeDashoffset = (-accumulatedPercent * circumference).toFixed(2);
    accumulatedPercent += percent;

    return {
      ...cat,
      percent: (percent * 100).toFixed(1),
      strokeDasharray,
      strokeDashoffset,
    };
  });

  const active = hoveredCategory ? slices.find((s) => s.name === hoveredCategory) : null;

  return (
    <div className="glass-panel rounded-2xl p-6 border border-slate-200 bg-white shadow-xs relative">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-blue-50 text-blue-600 border border-blue-200">
            <PieChart className="w-4 h-4" />
          </span>
          <h2 className="text-base font-bold text-slate-900 tracking-tight font-sans">
            Monthly Expenditure & Tax Vectors (मासिक व्यय)
          </h2>
        </div>
        <span className="text-xs font-mono font-medium text-slate-400">OCTOBER 2026</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* SVG Donut */}
        <div className="md:col-span-6 flex items-center justify-center relative">
          <svg viewBox="0 0 200 200" className="w-52 h-52 -rotate-90 transform">
            {/* Background track */}
            <circle
              cx={center}
              cy={center}
              r={radius}
              fill="transparent"
              stroke="#f1f5f9"
              strokeWidth={strokeWidth}
            />

            {/* Slices */}
            {slices.map((slice) => {
              const isHovered = hoveredCategory === slice.name;
              return (
                <circle
                  key={slice.name}
                  cx={center}
                  cy={center}
                  r={radius}
                  fill="transparent"
                  stroke={slice.color}
                  strokeWidth={isHovered ? strokeWidth + 6 : strokeWidth}
                  strokeDasharray={slice.strokeDasharray}
                  strokeDashoffset={slice.strokeDashoffset}
                  className="transition-all duration-300 cursor-pointer"
                  onMouseEnter={() => setHoveredCategory(slice.name)}
                  onMouseLeave={() => setHoveredCategory(null)}
                />
              );
            })}
          </svg>

          {/* Center Text Readout */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-[10px] font-mono uppercase text-slate-400 font-semibold">
              {active ? active.name : 'Total Outflows'}
            </span>
            <span className="text-base font-bold text-slate-900 font-mono mt-0.5">
              {formatINR(active ? active.amount : totalExpense, privacyMode)}
            </span>
            <span className="text-[11px] font-mono text-blue-700 font-semibold">
              {active ? `${active.percent}% of total` : 'Monthly Burn-Rate'}
            </span>
          </div>
        </div>

        {/* Legend List */}
        <div className="md:col-span-6 space-y-2">
          {slices.map((slice) => {
            const isHovered = hoveredCategory === slice.name;
            return (
              <div
                key={slice.name}
                onMouseEnter={() => setHoveredCategory(slice.name)}
                onMouseLeave={() => setHoveredCategory(null)}
                className={`p-2 rounded-xl border transition-all cursor-pointer flex items-center justify-between text-xs ${
                  isHovered
                    ? 'bg-blue-50/80 border-blue-300 shadow-2xs'
                    : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: slice.color }} />
                  <span className="text-slate-700 font-medium truncate max-w-[120px] font-sans">{slice.name}</span>
                </div>
                <div className="flex items-center gap-2 text-right">
                  <span className="font-mono text-slate-900 font-semibold">{formatINR(slice.amount, privacyMode)}</span>
                  <span className="font-mono text-slate-400 text-[11px] w-10 text-right">{slice.percent}%</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
