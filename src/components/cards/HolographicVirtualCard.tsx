import React, { useState, useRef } from 'react';
import { Copy, Check, Eye, EyeOff, Snowflake, Wifi, ShieldCheck, Lock, Unlock, Sliders } from 'lucide-react';
import { VirtualCard } from '../../types/fintech';

interface CardProps {
  card: VirtualCard;
  onToggleFreeze: (id: string) => void;
  onUpdateLimit: (id: string, newLimit: number) => void;
  privacyMode: boolean;
}

export const HolographicVirtualCard: React.FC<CardProps> = ({
  card,
  onToggleFreeze,
  onUpdateLimit,
  privacyMode,
}) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [showSensitive, setShowSensitive] = useState(false);
  const [copied, setCopied] = useState(false);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50 });
  const cardRef = useRef<HTMLDivElement>(null);

  // 3D Tilt calculation on mouse move
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || isFlipped) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rX = ((y - centerY) / centerY) * -12; // tilt angle
    const rY = ((x - centerX) / centerX) * 12;

    setRotateX(rX);
    setRotateY(rY);
    setGlarePos({ x: (x / rect.width) * 100, y: (y / rect.height) * 100 });
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard?.writeText(card.pan.replace(/\s+/g, ''));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getThemeStyle = (theme: VirtualCard['colorTheme']) => {
    switch (theme) {
      case 'emerald':
        return 'from-emerald-900 via-slate-900 to-teal-950 border-emerald-500/40 text-emerald-400';
      case 'violet':
        return 'from-purple-900 via-slate-900 to-indigo-950 border-purple-500/40 text-purple-400';
      case 'gold':
        return 'from-amber-900 via-slate-900 to-yellow-950 border-amber-500/40 text-amber-400';
      case 'titanium':
        return 'from-slate-700 via-slate-800 to-slate-900 border-slate-400/40 text-slate-200';
      case 'obsidian':
      default:
        return 'from-slate-900 via-black to-slate-950 border-slate-700/60 text-slate-100';
    }
  };

  const percentSpent = Math.min(100, (card.monthlySpent / card.spendLimit) * 100);

  return (
    <div className="flex flex-col gap-4">
      {/* 3D Perspective Container */}
      <div
        className="w-full max-w-md mx-auto h-56 cursor-pointer select-none"
        style={{ perspective: '1200px' }}
        onClick={() => setIsFlipped(!isFlipped)}
      >
        <div
          ref={cardRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className={`relative w-full h-full rounded-2xl p-6 transition-all duration-500 ease-out border shadow-2xl overflow-hidden bg-gradient-to-br ${getThemeStyle(
            card.colorTheme
          )} ${card.status === 'frozen' ? 'filter grayscale-[80%] opacity-85' : ''}`}
          style={{
            transform: `rotateX(${rotateX}deg) rotateY(${isFlipped ? 180 : rotateY}deg)`,
            transformStyle: 'preserve-3d',
          }}
        >
          {/* Holographic foil glare layer */}
          <div
            className="absolute inset-0 pointer-events-none transition-opacity duration-300"
            style={{
              background: `radial-gradient(circle at ${glarePos.x}% ${glarePos.y}%, rgba(255,255,255,0.18) 0%, rgba(6,182,212,0.12) 30%, rgba(16,185,129,0.08) 55%, transparent 80%)`,
              opacity: card.status === 'frozen' ? 0.2 : 0.8,
            }}
          />

          {/* Frozen Ice Shimmer Overlay if card is frozen */}
          {card.status === 'frozen' && (
            <div className="absolute inset-0 bg-cyan-950/40 backdrop-blur-[2px] flex items-center justify-center border-2 border-cyan-400/50 rounded-2xl z-20">
              <div className="flex items-center gap-2 bg-slate-950/90 px-4 py-2 rounded-xl border border-cyan-400/60 shadow-lg text-cyan-300 font-mono text-xs font-bold tracking-wider">
                <Snowflake className="w-4 h-4 text-cyan-400 animate-spin" />
                CARD TEMPORARILY FROZEN
              </div>
            </div>
          )}

          {/* FRONT OF CARD */}
          {!isFlipped ? (
            <div className="relative h-full flex flex-col justify-between z-10">
              {/* Card Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-7 rounded bg-amber-400/20 border border-amber-300/40 p-1 flex items-center justify-center shadow-inner">
                    {/* Simulated gold chip circuits */}
                    <div className="w-full h-full border border-amber-400/40 rounded-sm grid grid-cols-2 gap-0.5 p-0.5">
                      <div className="bg-amber-400/40 rounded-xs" />
                      <div className="bg-amber-400/40 rounded-xs" />
                    </div>
                  </div>
                  <Wifi className="w-5 h-5 text-slate-400 rotate-90" />
                </div>

                <div className="text-right">
                  <span className="text-[10px] font-mono tracking-widest uppercase text-slate-400 block font-semibold">
                    VALENCE
                  </span>
                  <span className="text-xs font-bold tracking-wider text-white">
                    {card.brand}
                  </span>
                </div>
              </div>

              {/* Card PAN Number */}
              <div>
                <div className="flex items-center gap-3">
                  <span className="text-lg sm:text-xl font-mono font-bold tracking-[0.2em] text-white text-glow-cyan">
                    {privacyMode ? '•••• •••• •••• ' + card.last4 : card.pan}
                  </span>
                  <button
                    onClick={handleCopy}
                    className="p-1 rounded hover:bg-white/10 text-slate-300 transition-colors"
                    title="Copy Card Number"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
                <div className="flex items-center gap-4 text-[10px] font-mono text-slate-400 mt-1">
                  <span>EXP: {card.expiry}</span>
                  <span>CVV: {showSensitive ? card.cvv : '•••'}</span>
                </div>
              </div>

              {/* Cardholder & Card Nickname */}
              <div className="flex items-end justify-between">
                <div>
                  <span className="text-[9px] uppercase tracking-wider text-slate-400 block">Cardholder</span>
                  <span className="text-xs font-bold font-mono tracking-wider text-white">
                    {card.cardholder}
                  </span>
                </div>

                <div className="text-right">
                  <span className="text-[9px] uppercase tracking-wider text-slate-400 block">Type</span>
                  <span className="text-[11px] font-semibold font-mono text-emerald-400 uppercase">
                    {card.type}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            /* BACK OF CARD (Flipped 180deg) */
            <div
              className="relative h-full flex flex-col justify-between z-10"
              style={{ transform: 'rotateY(180deg)' }}
            >
              {/* Magnetic Strip */}
              <div className="-mx-6 -mt-2 h-10 bg-slate-950 border-y border-slate-800" />

              {/* Signature Strip & CVV */}
              <div className="px-2">
                <div className="flex items-center justify-between bg-slate-300 text-slate-900 px-3 py-1.5 rounded text-xs font-mono">
                  <span className="italic font-serif tracking-widest text-[11px] text-slate-700">
                    Authorized Signature
                  </span>
                  <span className="bg-white px-2 py-0.5 rounded font-bold tracking-widest text-slate-950 border border-slate-400">
                    {card.cvv}
                  </span>
                </div>
                <span className="text-[9px] text-slate-400 mt-1 block">
                  3-digit Card Verification Value (CVV)
                </span>
              </div>

              {/* Footer info */}
              <div className="text-[9px] text-slate-400 text-center font-mono">
                Issued by Valence Quantum Banking Member FDIC • Click anywhere to flip back
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Card Controls & Limits */}
      <div className="w-full max-w-md mx-auto bg-slate-900/60 p-4 rounded-xl border border-slate-800/80 space-y-3">
        {/* Spending Progress Bar */}
        <div>
          <div className="flex justify-between text-xs font-mono mb-1">
            <span className="text-slate-400">Monthly Limit Used</span>
            <span className="text-white font-semibold">
              ${card.monthlySpent.toLocaleString()} / ${card.spendLimit.toLocaleString()}
            </span>
          </div>
          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                percentSpent > 80 ? 'bg-rose-500' : percentSpent > 50 ? 'bg-amber-400' : 'bg-emerald-400'
              }`}
              style={{ width: `${percentSpent}%` }}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800 text-xs font-mono">
          <button
            onClick={() => onToggleFreeze(card.id)}
            className={`py-2 px-3 rounded-lg border flex items-center justify-center gap-1.5 transition-all ${
              card.status === 'frozen'
                ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/25'
                : 'bg-cyan-500/10 border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/20'
            }`}
          >
            {card.status === 'frozen' ? (
              <>
                <Unlock className="w-3.5 h-3.5 text-emerald-400" />
                Unfreeze Card
              </>
            ) : (
              <>
                <Snowflake className="w-3.5 h-3.5 text-cyan-400" />
                Freeze Card
              </>
            )}
          </button>

          <button
            onClick={() => setShowSensitive(!showSensitive)}
            className="py-2 px-3 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 hover:text-white flex items-center justify-center gap-1.5 transition-all"
          >
            {showSensitive ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            {showSensitive ? 'Hide CVV' : 'Reveal CVV'}
          </button>
        </div>
      </div>
    </div>
  );
};
