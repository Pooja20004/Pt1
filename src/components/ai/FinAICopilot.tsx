import React, { useState } from 'react';
import { Bot, Send, Sparkles, TrendingUp, AlertTriangle, CheckCircle, ArrowRight, CornerDownLeft } from 'lucide-react';
import { FinAIInsight, Persona } from '../../types/fintech';
import { formatINR } from '../../utils/formatters';

interface AICopilotProps {
  insights: FinAIInsight[];
  activePersona: Persona;
  onExecuteAction: (insight: FinAIInsight) => void;
  privacyMode: boolean;
}

interface Message {
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  badge?: string;
  action?: {
    label: string;
    payload?: any;
  };
}

export const FinAICopilot: React.FC<AICopilotProps> = ({
  insights,
  activePersona,
  onExecuteAction,
  privacyMode,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'assistant',
      text: `Namaste, ${activePersona.name}! I am your Bharat FinAI Copilot. I have audited your ${formatINR(
        activePersona.accounts.reduce((s, a) => s + (a.currency === 'INR' ? a.balance : a.balance * 86.42), 0),
        privacyMode,
        true
      )} treasury across your Indian Current, Artha Liquid, and Tax Escrow accounts. All RBI compliance vectors are green, with 1 key yield arbitrage opportunity detected.`,
      timestamp: 'Just now',
      badge: 'RBI & Tax Audit Complete',
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const quickPrompts = [
    'Analyze my 6-month cash runway in INR',
    'Audit GST Input Tax Credit & SaaS leaks',
    'Calculate Q3 Advance Tax (Sec 208) liability',
    'Simulate ₹35 Lakhs auto-sweep to 7.45% Vault',
  ];

  const handleSend = (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    const userMsg: Message = {
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      let replyText = '';
      let badge = 'Bharat FinAI';
      let action: Message['action'] = undefined;

      const q = query.toLowerCase();
      if (q.includes('runway')) {
        replyText = `Based on your monthly operating burn of ${formatINR(activePersona.monthlyBurn, privacyMode)} and recurring inflows of ${formatINR(activePersona.monthlyIncome, privacyMode)}, your net monthly cashflow is POSITIVE (+${formatINR(activePersona.monthlyIncome - activePersona.monthlyBurn, privacyMode)}/month). You possess infinite operational runway with over 36 months of pure liquid reserves.`;
        badge = 'Runway Health: 100/100';
      } else if (q.includes('gst') || q.includes('saas') || q.includes('leak')) {
        replyText = `GST & SaaS Audit Complete: Scanned 12 corporate vendors. Detected ₹24,500 in un-claimed Input Tax Credit (ITC) on AWS Cloud India invoices because GSTR-2B filing was pending vendor reconciliation. Furthermore, 2 dormant GitHub Enterprise seats (₹6,800/mo) can be safely pruned.`;
        badge = 'ITC & SaaS Leak Detected';
        action = { label: 'Reconcile GSTR-2B & Prune Seats' };
      } else if (q.includes('tax') || q.includes('advance')) {
        replyText = `Advance Tax (Sec 208/211) Projection: Q3 installment due on Dec 15th is ₹3,50,000 based on your ₹2.45 Cr annualized net revenue. Your Advance Tax Escrow holds ₹42,50,000 (100% covered). You face 0% interest penalty under Section 234B & 234C.`;
        badge = 'Sec 208: 100% Compliant';
      } else if (q.includes('vault') || q.includes('sweep') || q.includes('yield')) {
        replyText = `By transferring ₹35,00,000 from your non-interest Current Account to the Artha High-Yield Liquid Vault (7.45% p.a. T-Bills), you will generate an additional ₹21,729 monthly risk-free passive returns with instant UPI T+0 liquidity.`;
        badge = 'Yield Arbitrage Opportunity';
        action = { label: 'Execute ₹35 Lakhs Auto-Sweep' };
      } else {
        replyText = `I have cross-checked your inquiry against Valence Bharat multi-currency ledgers, NPCI UPI switches, and SEBI/RBI compliance frameworks. All metrics are within optimal corporate treasury guidelines with real-time risk scores below 3/100.`;
      }

      setMessages((prev) => [
        ...prev,
        {
          sender: 'assistant',
          text: replyText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          badge,
          action,
        },
      ]);
      setIsTyping(false);
    }, 900);
  };

  return (
    <div className="glass-panel rounded-2xl p-6 border border-slate-800/80 relative flex flex-col h-[520px]">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-cyan-500 p-0.5 shadow-lg shadow-emerald-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center font-mono font-bold text-emerald-400">
              ₹
            </div>
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              Bharat FinAI Wealth Copilot (भारत फ़िनएआई)
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
            </h3>
            <p className="text-[11px] text-slate-400">Institutional Indian Treasury & Tax Intelligence</p>
          </div>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
          INDIAN REGIME OPTIMIZED
        </span>
      </div>

      {/* Messages Stream */}
      <div className="flex-1 overflow-y-auto py-4 space-y-3.5 pr-1">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            {m.badge && (
              <span className="text-[9px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/25 px-2 py-0.5 rounded-full mb-1">
                {m.badge}
              </span>
            )}
            <div
              className={`max-w-[85%] rounded-2xl p-3.5 text-xs leading-relaxed ${
                m.sender === 'user'
                  ? 'bg-cyan-600 text-white rounded-br-none shadow-md'
                  : 'bg-slate-900/90 text-slate-200 border border-slate-800 rounded-bl-none shadow-sm'
              }`}
            >
              <p>{m.text}</p>
              {m.action && (
                <button
                  onClick={() => alert(`Executed: ${m.action?.label}`)}
                  className="mt-3 w-full py-1.5 px-3 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 font-mono font-semibold text-[11px] border border-emerald-500/40 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                  {m.action.label}
                </button>
              )}
            </div>
            <span className="text-[9px] font-mono text-slate-500 mt-1 px-1">{m.timestamp}</span>
          </div>
        ))}

        {isTyping && (
          <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-900/60 p-3 rounded-2xl w-32 border border-slate-800">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce" />
            <div className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce [animation-delay:0.2s]" />
            <div className="w-2 h-2 rounded-full bg-violet-400 animate-bounce [animation-delay:0.4s]" />
          </div>
        )}
      </div>

      {/* Quick Prompts Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto py-2 shrink-0 no-scrollbar">
        {quickPrompts.map((p, i) => (
          <button
            key={i}
            onClick={() => handleSend(p)}
            className="text-[10px] font-mono whitespace-nowrap bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white px-2.5 py-1.5 rounded-lg border border-slate-800 transition-all shrink-0 cursor-pointer"
          >
            {p}
          </button>
        ))}
      </div>

      {/* Input box */}
      <div className="pt-2 border-t border-slate-800 shrink-0">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="relative flex items-center"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about Advance Tax (Sec 208), GST reconciliation, UPI limits, or LAS..."
            className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl pl-4 pr-12 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
          <button
            type="submit"
            disabled={!input.trim()}
            className="absolute right-2 p-1.5 rounded-lg bg-emerald-500 disabled:opacity-30 text-slate-950 font-bold hover:bg-emerald-400 transition-all cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
};
