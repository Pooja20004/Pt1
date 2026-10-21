import React, { useState } from 'react';
import { Bot, Send, Sparkles, TrendingUp, AlertTriangle, CheckCircle, ArrowRight, CornerDownLeft } from 'lucide-react';
import { FinAIInsight, Persona } from '../../types/fintech';

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
      text: `Good day, ${activePersona.name}. I am your Valence Quantum Copilot. I've analyzed your $${(activePersona.accounts.reduce((s, a) => s + (a.currency === 'USD' ? a.balance : 0), 0)).toLocaleString()} liquid treasury across 5 accounts. Everything is optimal, with 1 key yield arbitrage opportunity detected.`,
      timestamp: 'Just now',
      badge: 'Autonomous Audit Complete',
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const quickPrompts = [
    'Analyze my 6-month cash runway',
    'Audit recurring SaaS & subscription leaks',
    'Calculate 2026 Q4 tax exposure',
    'Simulate $100k move to 5.45% Vault',
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
      let badge = 'Quantum FinAI';
      let action: Message['action'] = undefined;

      const q = query.toLowerCase();
      if (q.includes('runway')) {
        replyText = `Based on your average monthly operating burn of $${activePersona.monthlyBurn.toLocaleString()} and net monthly inflows of $${activePersona.monthlyIncome.toLocaleString()}, your net cashflow is POSITIVE (+$${(activePersona.monthlyIncome - activePersona.monthlyBurn).toLocaleString()}/month). You currently possess infinite operational runway with 44 months of pure liquid reserves.`;
        badge = 'Runway Health: 100/100';
      } else if (q.includes('subscription') || q.includes('leak')) {
        replyText = `Audit complete: Scanned 14 active corporate subscriptions across your virtual cards. Detected 2 dormant seats on AWS EMEA ($340/mo) and an unused duplicate Figma Org license ($180/mo). Consolidating these saves $6,240 annually.`;
        badge = 'Optimization Identified';
        action = { label: 'Deactivate Dormant Seats' };
      } else if (q.includes('tax')) {
        replyText = `2026 Federal & State Liability Projection: $340,000 based on $1.42M capital gains and enterprise dividends. Your dedicated Q4 Tax Escrow account currently holds $362,300 earning 4.8% APY. You are 106% covered with zero estimated underpayment penalty risk.`;
        badge = 'Tax Hedge: Fully Funded';
      } else if (q.includes('vault') || q.includes('yield')) {
        replyText = `By transferring $100,000 from non-interest checking into the Quantum High-Yield Vault (5.45% APY), you will earn an extra $5,450/yr ($454.16 monthly) with daily Mark-to-Market compounding and instant sub-second withdrawal liquidity.`;
        badge = 'Yield Arbitrage Opportunity';
        action = { label: 'Execute $100k Vault Transfer' };
      } else {
        replyText = `I have cross-checked your inquiry against Valence multi-currency ledgers, algorithmic yield vaults, and compliance rules. All metrics are within optimal private banking parameters with real-time risk scores below 4/100.`;
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
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Bot className="w-5 h-5 text-emerald-400 animate-pulse" />
            </div>
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              Valence FinAI Autonomous Advisor
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
            </h3>
            <p className="text-[11px] text-slate-400">Institutional Wealth Management Intelligence</p>
          </div>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
          PROPRIETARY MODEL V4.5
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
                  onClick={() => alert(`Executed action: ${m.action?.label}`)}
                  className="mt-3 w-full py-1.5 px-3 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 font-mono font-semibold text-[11px] border border-emerald-500/40 flex items-center justify-center gap-1.5 transition-all"
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
            placeholder="Ask about liquidity, tax strategies, yield or burn rates..."
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
