import React, { useState } from 'react';
import { X, CreditCard, Shield, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { VirtualCard } from '../../types/fintech';
import { formatINR } from '../../utils/formatters';

interface CreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCardCreated: (card: VirtualCard) => void;
  defaultCardholder: string;
}

export const CreateCardModal: React.FC<CreateModalProps> = ({
  isOpen,
  onClose,
  onCardCreated,
  defaultCardholder,
}) => {
  const [cardName, setCardName] = useState('SaaS & Cloud Operations RuPay');
  const [cardholder, setCardholder] = useState(defaultCardholder);
  const [cardType, setCardType] = useState<VirtualCard['type']>('virtual');
  const [brand, setBrand] = useState<VirtualCard['brand']>('RuPay Select Metal');
  const [spendLimit, setSpendLimit] = useState(500000); // ₹5 Lakhs default
  const [colorTheme, setColorTheme] = useState<VirtualCard['colorTheme']>('emerald');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Generate random realistic PAN
    const prefix = brand.startsWith('RuPay') ? '6080' : brand.startsWith('Visa') ? '4929' : '5500';
    const randDigits = Math.floor(1000 + Math.random() * 9000);
    const randDigits2 = Math.floor(1000 + Math.random() * 9000);
    const last4 = Math.floor(1000 + Math.random() * 9000).toString();
    const pan = `${prefix} •••• •••• ${last4}`;
    const cvv = Math.floor(100 + Math.random() * 900).toString();

    const newCard: VirtualCard = {
      id: `card-${Date.now()}`,
      cardholder: cardholder.toUpperCase(),
      cardName,
      pan,
      last4,
      expiry: '10/30',
      cvv,
      brand,
      type: cardType,
      status: 'active',
      spendLimit,
      monthlySpent: 0,
      colorTheme,
      onlineEnabled: true,
      internationalEnabled: true,
      contactlessEnabled: true,
      ncmcEnabled: true,
      createdAt: new Date().toISOString().split('T')[0],
    };

    onCardCreated(newCard);

    // Confetti burst
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#10b981', '#06b6d4', '#f59e0b'],
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
      <div className="bg-white w-full max-w-lg rounded-2xl p-6 border border-slate-200 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-1">
          <div className="p-2 rounded-xl bg-blue-50 text-blue-600 border border-blue-200">
            <CreditCard className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">Issue RuPay / Visa Quantum Virtual Card</h3>
            <p className="text-xs text-slate-500">Instant tokenized provisioning with NCMC Metro & FASTag integration</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 mt-6">
          <div>
            <label className="text-xs font-mono uppercase text-slate-500 font-semibold block mb-1.5">Card Purpose / Nickname</label>
            <input
              type="text"
              required
              value={cardName}
              onChange={(e) => setCardName(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
              placeholder="e.g. AWS & Razorpay Cloud Procurements"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-mono uppercase text-slate-500 font-semibold block mb-1.5">Card Form Factor</label>
              <select
                value={cardType}
                onChange={(e) => setCardType(e.target.value as any)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white"
              >
                <option value="virtual">Multi-Use Virtual</option>
                <option value="disposable">Single-Use Burner</option>
                <option value="physical">RuPay Laser-Etched Metal</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-mono uppercase text-slate-500 font-semibold block mb-1.5">Payment Network</label>
              <select
                value={brand}
                onChange={(e) => setBrand(e.target.value as any)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white"
              >
                <option value="RuPay Select Metal">RuPay Select Metal (NCMC Enabled)</option>
                <option value="Visa Infinite">Visa Infinite India</option>
                <option value="Mastercard World Elite">Mastercard World Elite</option>
              </select>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs font-mono mb-1.5">
              <span className="text-slate-500 uppercase font-semibold">Monthly Spend Limit (INR)</span>
              <span className="text-blue-600 font-bold">{formatINR(spendLimit)}</span>
            </div>
            <input
              type="range"
              min={25000}
              max={5000000}
              step={25000}
              value={spendLimit}
              onChange={(e) => setSpendLimit(Number(e.target.value))}
              className="w-full accent-blue-600 h-2 bg-slate-100 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-1">
              <span>₹25,000</span>
              <span>₹50 Lakhs</span>
            </div>
          </div>

          <div>
            <label className="text-xs font-mono uppercase text-slate-500 font-semibold block mb-2">Prestige Metallic Theme</label>
            <div className="grid grid-cols-5 gap-2">
              {(
                [
                  { id: 'obsidian', label: 'Sapphire', color: 'bg-blue-800 text-white border-blue-600' },
                  { id: 'emerald', label: 'Emerald', color: 'bg-emerald-800 text-white border-emerald-600' },
                  { id: 'violet', label: 'Cobalt', color: 'bg-indigo-800 text-white border-indigo-600' },
                  { id: 'gold', label: 'Gold', color: 'bg-amber-700 text-white border-amber-500' },
                  { id: 'titanium', label: 'Titanium', color: 'bg-slate-700 text-white border-slate-500' },
                ] as const
              ).map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setColorTheme(t.id)}
                  className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${t.color} ${
                    colorTheme === t.id ? 'ring-2 ring-blue-600 ring-offset-2 scale-105 font-bold shadow-md' : 'opacity-80 hover:opacity-100'
                  }`}
                >
                  <span className="text-[10px] font-mono font-semibold block truncate">
                    {t.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="pt-3">
            <button
              type="submit"
              className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm tracking-wide shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              Tokenize & Issue RuPay Card
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
