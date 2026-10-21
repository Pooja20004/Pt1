import React from 'react';
import { Eye, EyeOff, Bell, Download, Send, ChevronDown, Shield, Volume2, VolumeX, Sparkles } from 'lucide-react';
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
  notificationsCount: number;
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
  notificationsCount,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#090b10]/90 backdrop-blur-xl border-b border-slate-800/80">
      {/* Real-time Ticker Ribbon */}
      <div className="bg-slate-950/80 border-b border-slate-900 px-4 py-1.5 flex items-center justify-between overflow-x-auto text-[11px] font-mono no-scrollbar">
        <div className="flex items-center gap-6 shrink-0">
          <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>GLOBAL FX & LIQUIDITY MATRIX:</span>
          </div>

          {fxRates.map((fx) => (
            <div key={fx.pair} className="flex items-center gap-1.5">
              <span className="text-slate-400">{fx.pair}</span>
              <span className="text-white font-bold">
                {fx.to === 'USD' && fx.from !== 'BTC' && fx.from !== 'ETH'
                  ? fx.rate.toFixed(4)
                  : fx.rate.toLocaleString(undefined, { maximumFractionDigits: 2 })}
              </span>
              <span
                className={`text-[10px] ${
                  fx.change24h >= 0 ? 'text-emerald-400' : 'text-rose-400'
                }`}
              >
                {fx.change24h >= 0 ? '+' : ''}
                {fx.change24h}%
              </span>
            </div>
          ))}
        </div>

        <div className="hidden lg:flex items-center gap-4 text-slate-500 text-[10px] shrink-0">
          <span>SWIFT GPI: 42ms</span>
          <span>FEDNOW: ACTIVE</span>
          <span>ZURICH CLEARING: 100% ONLINE</span>
        </div>
      </div>

      {/* Main Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand / Logo */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-400 to-cyan-500 p-0.5 shadow-lg shadow-emerald-500/20">
            <div className="w-full h-full bg-[#090b10] rounded-[10px] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-emerald-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-extrabold tracking-wider text-white font-mono">
                VALENCE<span className="text-emerald-400">.OS</span>
              </h1>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hidden sm:inline-block">
                QUANTUM BANKING
              </span>
            </div>
          </div>
        </div>

        {/* Center / Right controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Privacy Toggle */}
          <button
            onClick={onTogglePrivacy}
            className={`p-2 rounded-xl border transition-all text-xs font-mono flex items-center gap-1.5 ${
              privacyMode
                ? 'bg-amber-500/15 border-amber-500/40 text-amber-300'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
            }`}
            title="Toggle Privacy Mode (Obfuscate Balances)"
          >
            {privacyMode ? <EyeOff className="w-4 h-4 text-amber-400" /> : <Eye className="w-4 h-4" />}
            <span className="hidden md:inline">{privacyMode ? 'Private' : 'Normal'}</span>
          </button>

          {/* Quick Transfer Button */}
          <button
            onClick={onOpenTransfer}
            className="py-2 px-3 sm:px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs tracking-wide shadow-md shadow-emerald-500/20 flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Send Money</span>
          </button>

          {/* Statement Export */}
          <button
            onClick={onOpenExport}
            className="p-2 sm:px-3 sm:py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs font-mono flex items-center gap-1.5 transition-all"
            title="Export Audited Statement"
          >
            <Download className="w-4 h-4 text-cyan-400" />
            <span className="hidden sm:inline">Statement</span>
          </button>

          {/* Persona Switcher Dropdown */}
          <div className="relative group">
            <button className="flex items-center gap-2 p-1 sm:pr-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all">
              <img
                src={activePersona.avatar}
                alt={activePersona.name}
                className="w-8 h-8 rounded-lg object-cover border border-emerald-500/40"
              />
              <div className="text-left hidden md:block">
                <span className="text-xs font-bold text-white block leading-tight">{activePersona.name}</span>
                <span className="text-[10px] text-emerald-400 font-mono block leading-tight truncate max-w-[110px]">
                  {activePersona.tier}
                </span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
            </button>

            {/* Persona Dropdown Menu */}
            <div className="absolute right-0 top-full mt-2 w-72 bg-slate-900/95 backdrop-blur-xl border border-slate-700 rounded-2xl shadow-2xl p-2 hidden group-hover:block transition-all z-50">
              <div className="px-3 py-2 text-[10px] font-mono uppercase text-slate-400 border-b border-slate-800">
                Switch Test FinTech Persona
              </div>
              {personas.map((p) => (
                <button
                  key={p.id}
                  onClick={() => onSelectPersona(p)}
                  className={`w-full p-2.5 rounded-xl text-left flex items-center gap-3 transition-all ${
                    activePersona.id === p.id
                      ? 'bg-emerald-500/15 border border-emerald-500/30'
                      : 'hover:bg-slate-800/80'
                  }`}
                >
                  <img src={p.avatar} alt={p.name} className="w-9 h-9 rounded-lg object-cover" />
                  <div className="truncate">
                    <span className="text-xs font-bold text-white block">{p.name}</span>
                    <span className="text-[11px] text-slate-400 block truncate">{p.role}</span>
                    <span className="text-[10px] font-mono text-emerald-400 block">{p.tier}</span>
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
