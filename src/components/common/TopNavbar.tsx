import React from 'react';
import { Eye, EyeOff, Download, Send, ChevronDown, Sparkles } from 'lucide-react';
import { Persona, FXRate } from '../../types/fintech';

interface NavbarProps {
  personas: Persona[];
  activePersona: Persona;
  onSelectPersona: (p: Persona) => void;
  privacyMode: boolean;
  onTogglePrivacy: () => void;
  onOpenTransfer: () => void;
  onOpenExport: () => void;
  fxRates: FXRate[];
}

export const TopNavbar: React.FC<NavbarProps> = ({
  personas,
  activePersona,
  onSelectPersona,
  privacyMode,
  onTogglePrivacy,
  onOpenTransfer,
  onOpenExport,
  fxRates,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-xs">
      {/* Real-time Indian Market & Forex Ticker Ribbon */}
      <div className="bg-slate-50/90 border-b border-slate-200 px-4 py-1.5 flex items-center justify-between overflow-x-auto text-[11px] font-mono no-scrollbar">
        <div className="flex items-center gap-6 shrink-0">
          <div className="flex items-center gap-1.5 text-blue-700 font-semibold">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
            <span>BHARAT LIQUIDITY MATRIX (भारत ग्रिड):</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 font-medium">NIFTY 50:</span>
            <span className="text-slate-900 font-bold">25,482.40</span>
            <span className="text-[10px] text-emerald-600 font-semibold bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">+0.68%</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 font-medium">SENSEX:</span>
            <span className="text-slate-900 font-bold">83,215.10</span>
            <span className="text-[10px] text-emerald-600 font-semibold bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">+0.55%</span>
          </div>

          {fxRates.map((fx) => (
            <div key={fx.pair} className="flex items-center gap-1.5">
              <span className="text-slate-500">{fx.pair}:</span>
              <span className="text-slate-900 font-semibold">
                ₹{fx.rate.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
              </span>
              <span
                className={`text-[10px] font-medium px-1 rounded ${
                  fx.change24h >= 0 
                    ? 'text-emerald-700 bg-emerald-50' 
                    : 'text-rose-700 bg-rose-50'
                }`}
              >
                {fx.change24h >= 0 ? '+' : ''}
                {fx.change24h}%
              </span>
            </div>
          ))}
        </div>

        <div className="hidden lg:flex items-center gap-4 text-slate-500 text-[10px] shrink-0 font-medium">
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            NPCI UPI: 12ms
          </span>
          <span>RTGS: ONLINE</span>
          <span>RBI REPO: 6.50%</span>
        </div>
      </div>

      {/* Main Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand / Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 via-blue-600 to-indigo-600 p-0.5 shadow-sm shadow-blue-500/20">
            <div className="w-full h-full bg-blue-600 rounded-[10px] flex items-center justify-center font-mono font-bold text-white text-lg">
              ₹
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-extrabold tracking-tight text-slate-900 font-sans">
                VALENCE <span className="text-blue-600">BHARAT</span>
              </h1>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-semibold border border-blue-200 hidden sm:inline-block">
                FINTECH OS
              </span>
            </div>
            <p className="text-[10px] text-slate-500 font-medium hidden sm:block">
              Institutional Wealth & Banking Management
            </p>
          </div>
        </div>

        {/* Center / Right controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Privacy Toggle */}
          <button
            onClick={onTogglePrivacy}
            className={`p-2 rounded-xl border transition-all text-xs font-mono flex items-center gap-1.5 cursor-pointer ${
              privacyMode
                ? 'bg-amber-50 border-amber-300 text-amber-700 shadow-xs'
                : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 shadow-xs'
            }`}
            title="Toggle Privacy Mode (Obfuscate Rupee Balances)"
          >
            {privacyMode ? <EyeOff className="w-4 h-4 text-amber-600" /> : <Eye className="w-4 h-4 text-slate-500" />}
            <span className="hidden md:inline font-medium">{privacyMode ? 'Private' : 'Normal'}</span>
          </button>

          {/* Quick Transfer Button */}
          <button
            onClick={onOpenTransfer}
            className="py-2 px-3 sm:px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs tracking-wide shadow-sm shadow-blue-600/20 flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Send UPI / RTGS</span>
          </button>

          {/* Statement Export */}
          <button
            onClick={onOpenExport}
            className="p-2 sm:px-3 sm:py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-mono font-medium flex items-center gap-1.5 transition-all shadow-xs cursor-pointer hover:border-blue-300"
            title="Export Audited Statement"
          >
            <Download className="w-4 h-4 text-blue-600" />
            <span className="hidden sm:inline">26AS / Ledger</span>
          </button>

          {/* Persona Switcher Dropdown */}
          <div className="relative group">
            <button className="flex items-center gap-2 p-1.5 sm:pr-3 rounded-xl bg-slate-50 border border-slate-200 hover:border-blue-300 hover:bg-white transition-all cursor-pointer shadow-xs">
              <img
                src={activePersona.avatar}
                alt={activePersona.name}
                className="w-8 h-8 rounded-lg object-cover border border-blue-200"
              />
              <div className="text-left hidden md:block">
                <span className="text-xs font-bold text-slate-900 block leading-tight">{activePersona.name}</span>
                <span className="text-[10px] text-blue-600 font-mono font-medium block leading-tight truncate max-w-[120px]">
                  {activePersona.tier}
                </span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
            </button>

            {/* Persona Dropdown Menu */}
            <div className="absolute right-0 top-full mt-2 w-72 bg-white border border-slate-200 rounded-2xl shadow-xl p-2 hidden group-hover:block transition-all z-50">
              <div className="px-3 py-2 text-[10px] font-mono uppercase text-slate-400 font-bold border-b border-slate-100">
                Switch Indian Fintech Persona
              </div>
              {personas.map((p) => (
                <button
                  key={p.id}
                  onClick={() => onSelectPersona(p)}
                  className={`w-full p-2.5 rounded-xl text-left flex items-center gap-3 transition-all cursor-pointer ${
                    activePersona.id === p.id
                      ? 'bg-blue-50/80 border border-blue-200'
                      : 'hover:bg-slate-50'
                  }`}
                >
                  <img src={p.avatar} alt={p.name} className="w-9 h-9 rounded-lg object-cover border border-slate-200" />
                  <div className="truncate">
                    <span className="text-xs font-bold text-slate-900 block">{p.name}</span>
                    <span className="text-[11px] text-slate-500 block truncate">{p.city}</span>
                    <span className="text-[10px] font-mono text-blue-600 font-semibold block">{p.tier}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
