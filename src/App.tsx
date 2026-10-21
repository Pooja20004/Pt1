import React, { useState } from 'react';
import {
  TrendingUp,
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  ShieldCheck,
  Send,
  Plus,
  Bot,
  Sparkles,
  Download,
  CreditCard,
  Percent,
  Layers,
  ArrowDownUp,
  Landmark,
  ShieldAlert,
  Globe,
  Radio,
} from 'lucide-react';
import confetti from 'canvas-confetti';

import {
  INITIAL_PERSONAS,
  INITIAL_CARDS,
  INITIAL_TRANSACTIONS,
  FX_RATES,
  AI_INSIGHTS,
} from './data/mockData';
import { Persona, Transaction, VirtualCard, Currency, AccountBalance } from './types/fintech';

import { TopNavbar } from './components/common/TopNavbar';
import { Sidebar, TabType } from './components/common/Sidebar';
import { TransactionTable } from './components/common/TransactionTable';
import { StatementExportModal } from './components/common/StatementExportModal';

import { InteractiveCashflowSankey } from './components/visualizations/InteractiveCashflowSankey';
import { PortfolioPerformanceChart } from './components/visualizations/PortfolioPerformanceChart';
import { MonteCarloWealthSimulator } from './components/visualizations/MonteCarloWealthSimulator';
import { GlobalTransactionMap } from './components/visualizations/GlobalTransactionMap';
import { CreditScoreRadar } from './components/visualizations/CreditScoreRadar';
import { ExpenseCategoryDonut } from './components/visualizations/ExpenseCategoryDonut';

import { HolographicVirtualCard } from './components/cards/HolographicVirtualCard';
import { CreateCardModal } from './components/cards/CreateCardModal';

import { QuickTransferModal } from './components/transfers/QuickTransferModal';
import { FxSwapEngine } from './components/transfers/FxSwapEngine';

import { LoanCreditUnderwriter } from './components/loans/LoanCreditUnderwriter';
import { FinAICopilot } from './components/ai/FinAICopilot';
import { FraudMonitoringHub } from './components/security/FraudMonitoringHub';

export default function App() {
  const [personas, setPersonas] = useState<Persona[]>(INITIAL_PERSONAS);
  const [activePersona, setActivePersona] = useState<Persona>(INITIAL_PERSONAS[0]);
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [cards, setCards] = useState<VirtualCard[]>(INITIAL_CARDS);
  const [privacyMode, setPrivacyMode] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  // Modals state
  const [isTransferOpen, setIsTransferOpen] = useState(false);
  const [isCreateCardOpen, setIsCreateCardOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);

  // Consolidated Net Worth Calculation (in USD)
  const totalNetWorth = activePersona.accounts.reduce((acc, account) => {
    if (account.currency === 'USD') return acc + account.balance;
    if (account.currency === 'EUR') return acc + account.balance * 1.0845;
    if (account.currency === 'GBP') return acc + account.balance * 1.298;
    if (account.currency === 'JPY') return acc + account.balance / 152.4;
    if (account.currency === 'BTC') return acc + account.balance * 98450;
    if (account.currency === 'ETH') return acc + account.balance * 3420.5;
    return acc + account.balance;
  }, 0);

  // Card Controls
  const handleToggleFreeze = (cardId: string) => {
    setCards((prev) =>
      prev.map((c) =>
        c.id === cardId
          ? { ...c, status: c.status === 'frozen' ? 'active' : 'frozen' }
          : c
      )
    );
  };

  const handleUpdateCardLimit = (cardId: string, newLimit: number) => {
    setCards((prev) =>
      prev.map((c) => (c.id === cardId ? { ...c, spendLimit: newLimit } : c))
    );
  };

  const handleCardCreated = (newCard: VirtualCard) => {
    setCards((prev) => [newCard, ...prev]);
  };

  // Transaction & Transfer completion
  const handleTransferComplete = (newTx: Transaction) => {
    setTransactions((prev) => [newTx, ...prev]);

    // Deduct from primary checking
    setActivePersona((prev) => ({
      ...prev,
      accounts: prev.accounts.map((acc, idx) =>
        idx === 0 ? { ...acc, balance: acc.balance + newTx.amount } : acc
      ),
    }));
  };

  // FX Swap Execution
  const handleSwapExecuted = (
    fromCur: Currency,
    toCur: Currency,
    fromAmt: number,
    toAmt: number
  ) => {
    const swapTx: Transaction = {
      id: `tx-swap-${Date.now()}`,
      title: `Institutional Swap: ${fromCur} to ${toCur}`,
      merchant: 'Valence FX Pool',
      category: 'FX Swap',
      amount: toAmt,
      currency: toCur,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
      status: 'settled',
      type: 'fx_swap',
      riskScore: 0,
      location: { city: 'Zurich', country: 'Switzerland', lat: 47.3769, lng: 8.5417 },
      referenceId: `FX-SPOT-${Math.floor(100000 + Math.random() * 900000)}`,
    };

    setTransactions((prev) => [swapTx, ...prev]);

    // Adjust balances in accounts
    setActivePersona((prev) => ({
      ...prev,
      accounts: prev.accounts.map((acc) => {
        if (acc.currency === fromCur) {
          return { ...acc, balance: Math.max(0, acc.balance - fromAmt) };
        }
        if (acc.currency === toCur) {
          return { ...acc, balance: acc.balance + toAmt };
        }
        return acc;
      }),
    }));
  };

  // Loan Disbursement
  const handleLoanDisbursed = (amount: number, presetTitle: string) => {
    const loanTx: Transaction = {
      id: `tx-loan-${Date.now()}`,
      title: `Loan Disbursement: ${presetTitle}`,
      merchant: 'Valence Credit Facility',
      category: 'Investment & Yield',
      amount: amount,
      currency: 'USD',
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
      status: 'settled',
      type: 'inflow',
      riskScore: 1,
      referenceId: `LOAN-CREDIT-${Math.floor(100000 + Math.random() * 900000)}`,
    };

    setTransactions((prev) => [loanTx, ...prev]);

    // Deposit directly into primary checking account
    setActivePersona((prev) => ({
      ...prev,
      accounts: prev.accounts.map((acc, idx) =>
        idx === 0 ? { ...acc, balance: acc.balance + amount } : acc
      ),
    }));
  };

  // Fraud approvals and actions
  const handleApproveTx = (txId: string) => {
    setTransactions((prev) =>
      prev.map((t) =>
        t.id === txId ? { ...t, status: 'settled', riskScore: 5 } : t
      )
    );
  };

  const handleBlockTx = (txId: string) => {
    setTransactions((prev) =>
      prev.map((t) =>
        t.id === txId
          ? {
              ...t,
              status: 'flagged',
              title: `${t.title} [BLOCKED & RE-KEYED]`,
              flagReason: 'User blocked transaction & triggered virtual card re-keying',
            }
          : t
      )
    );
  };

  const handleSimulateThreat = () => {
    const attackTx: Transaction = {
      id: `tx-attack-${Date.now()}`,
      title: 'Suspicious API Micro-charge from Tor Exit Node',
      merchant: 'Cryptic Host Cayman Islands',
      category: 'Cloud & Tech',
      amount: -2499.0,
      currency: 'USD',
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
      status: 'flagged',
      type: 'outflow',
      riskScore: 97,
      flagReason: 'Tor exit node IP discrepancy & rapid multiple card probe requests',
      location: { city: 'George Town', country: 'Cayman Islands', lat: 19.2869, lng: -81.3674 },
      cardLast4: '7731',
      referenceId: `ALERT-SEC-${Math.floor(1000 + Math.random() * 9000)}`,
    };

    setTransactions((prev) => [attackTx, ...prev]);
    setActiveTab('security');
  };

  const formatCurrency = (val: number) => {
    if (privacyMode) return '••••••••';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const flaggedCount = transactions.filter((t) => t.status === 'flagged').length;

  return (
    <div className="min-h-screen bg-[#090b10] text-slate-100 flex flex-col font-sans">
      {/* Top Navbar */}
      <TopNavbar
        personas={personas}
        activePersona={activePersona}
        onSelectPersona={(p) => setActivePersona(p)}
        privacyMode={privacyMode}
        onTogglePrivacy={() => setPrivacyMode(!privacyMode)}
        onOpenTransfer={() => setIsTransferOpen(true)}
        onOpenExport={() => setIsExportOpen(true)}
        fxRates={FX_RATES}
        notificationsCount={flaggedCount}
      />

      {/* Main Body Layout: Sidebar + View Content */}
      <div className="flex-1 flex flex-col lg:flex-row max-w-7xl w-full mx-auto">
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          flaggedCount={flaggedCount}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 overflow-y-auto">
          {/* VIEW: OVERVIEW / COMMAND CENTER */}
          {activeTab === 'overview' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              {/* Executive Summary Card */}
              <div className="glass-panel-glow rounded-3xl p-6 sm:p-8 border relative overflow-hidden">
                {/* Background ambient lighting */}
                <div className="absolute -top-32 -right-32 w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />

                <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-[11px] font-mono uppercase tracking-widest text-emerald-400 font-bold bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/25">
                        {activePersona.tier}
                      </span>
                      <span className="text-slate-500 text-xs font-mono">• FDIC Sweep Insured to $25M</span>
                    </div>

                    <span className="text-xs font-mono uppercase tracking-wider text-slate-400 block">
                      Total Consolidated Net Liquidity
                    </span>

                    <div className="flex items-baseline gap-4 mt-1">
                      <h2 className="text-3xl sm:text-5xl font-extrabold text-white font-mono tracking-tight text-glow-emerald">
                        {formatCurrency(totalNetWorth)}
                      </h2>
                      <span className="inline-flex items-center gap-1 text-xs sm:text-sm font-semibold px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                        <TrendingUp className="w-3.5 h-3.5" />
                        +4.82% (+$184k 30D)
                      </span>
                    </div>

                    <p className="text-xs text-slate-400 mt-2">
                      Client: <strong className="text-slate-200">{activePersona.name}</strong> •{' '}
                      {activePersona.company} • 5 Multi-Currency Vaults
                    </p>
                  </div>

                  {/* Fast Action Buttons */}
                  <div className="flex flex-wrap items-center gap-2.5">
                    <button
                      onClick={() => setIsTransferOpen(true)}
                      className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs tracking-wide shadow-lg shadow-emerald-500/25 flex items-center gap-2 transition-all cursor-pointer"
                    >
                      <Send className="w-4 h-4" />
                      Send Wire
                    </button>

                    <button
                      onClick={() => setActiveTab('accounts')}
                      className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-bold text-xs font-mono flex items-center gap-2 transition-all cursor-pointer"
                    >
                      <ArrowDownUp className="w-4 h-4 text-cyan-400" />
                      Instant FX Swap
                    </button>

                    <button
                      onClick={() => setIsCreateCardOpen(true)}
                      className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-bold text-xs font-mono flex items-center gap-2 transition-all cursor-pointer"
                    >
                      <Plus className="w-4 h-4 text-emerald-400" />
                      New Virtual Card
                    </button>
                  </div>
                </div>

                {/* Sub-account Pills */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mt-8 pt-6 border-t border-slate-800/80">
                  {activePersona.accounts.map((acc) => (
                    <div
                      key={acc.id}
                      className="bg-slate-950/70 p-3 rounded-xl border border-slate-800/80 hover:border-slate-700 transition-all"
                    >
                      <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mb-1">
                        <span className="truncate max-w-[90px]">{acc.name}</span>
                        {acc.apy && (
                          <span className="text-emerald-400 font-bold">
                            {acc.apy}% APY
                          </span>
                        )}
                      </div>
                      <span className="text-sm font-bold font-mono text-white block">
                        {privacyMode ? '••••••' : `${acc.currency} ${acc.balance.toLocaleString()}`}
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono mt-0.5 block">
                        {acc.accountNumber}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Main Visualizer: Interactive Valuation Engine */}
              <PortfolioPerformanceChart
                privacyMode={privacyMode}
                baseValuation={totalNetWorth}
              />

              {/* Cashflow Stream Sankey Preview */}
              <InteractiveCashflowSankey privacyMode={privacyMode} />

              {/* Recent Transaction Table */}
              <TransactionTable
                transactions={transactions}
                privacyMode={privacyMode}
              />
            </div>
          )}

          {/* VIEW: VISUALIZATIONS */}
          {activeTab === 'visualizations' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h2 className="text-xl font-extrabold text-white tracking-wide">
                    Deep Financial Visualizations & Algorithmic Engines
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Multi-dimensional graphical models for liquidity streams, stochastic wealth projections, and global wire routing
                  </p>
                </div>
              </div>

              {/* 1. Interactive Sankey Cashflow */}
              <InteractiveCashflowSankey privacyMode={privacyMode} />

              {/* 2. Monte Carlo Wealth Simulator */}
              <MonteCarloWealthSimulator
                privacyMode={privacyMode}
                initialPrincipal={totalNetWorth}
              />

              {/* 3. Global Transaction Map */}
              <GlobalTransactionMap />

              {/* 4. Donut & Credit Radar */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-6">
                  <ExpenseCategoryDonut
                    transactions={transactions}
                    privacyMode={privacyMode}
                  />
                </div>
                <div className="lg:col-span-6">
                  <CreditScoreRadar score={activePersona.creditScore} />
                </div>
              </div>
            </div>
          )}

          {/* VIEW: GLOBAL ACCOUNTS & FX */}
          {activeTab === 'accounts' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-extrabold text-white tracking-wide">
                    Global Multi-Currency Vaults & Clearing
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Direct local routing in USD, EUR, GBP, CHF, JPY, and algorithmic digital vaults
                  </p>
                </div>
                <button
                  onClick={() => setIsTransferOpen(true)}
                  className="px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs tracking-wide flex items-center gap-2 shadow-md shadow-emerald-500/20"
                >
                  <Send className="w-3.5 h-3.5" /> Send Wire
                </button>
              </div>

              {/* Vault Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {activePersona.accounts.map((acc) => (
                  <div
                    key={acc.id}
                    className="glass-panel rounded-2xl p-5 border border-slate-800 hover:border-slate-700 transition-all relative overflow-hidden"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-mono uppercase text-slate-400 tracking-wider">
                        {acc.type.replace('_', ' ')}
                      </span>
                      {acc.apy && (
                        <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                          {acc.apy}% APY
                        </span>
                      )}
                    </div>

                    <h3 className="text-base font-bold text-white mb-1">{acc.name}</h3>
                    <span className="text-2xl font-extrabold text-white font-mono block">
                      {privacyMode ? '••••••' : `${acc.currency} ${acc.balance.toLocaleString()}`}
                    </span>

                    <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] font-mono text-slate-400 flex justify-between">
                      <span>Acc: {acc.accountNumber}</span>
                      {acc.iban && <span className="text-cyan-400 truncate max-w-[130px]">{acc.iban}</span>}
                    </div>
                  </div>
                ))}
              </div>

              {/* FX Swap Engine */}
              <FxSwapEngine
                fxRates={FX_RATES}
                onSwapExecuted={handleSwapExecuted}
                privacyMode={privacyMode}
              />
            </div>
          )}

          {/* VIEW: CARDS & SECURITY */}
          {activeTab === 'cards' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-extrabold text-white tracking-wide">
                    3D Holographic Virtual Cards & Spend Controls
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Interactive physical-feel virtual cards with custom spend shields, auto-freeze, and burner modes
                  </p>
                </div>
                <button
                  onClick={() => setIsCreateCardOpen(true)}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold text-xs tracking-wide shadow-md shadow-emerald-500/20 flex items-center gap-2 cursor-pointer"
                >
                  <Plus className="w-4 h-4" /> Issue Virtual Card
                </button>
              </div>

              {/* 3D Cards Gallery */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {cards.map((card) => (
                  <HolographicVirtualCard
                    key={card.id}
                    card={card}
                    onToggleFreeze={handleToggleFreeze}
                    onUpdateLimit={handleUpdateCardLimit}
                    privacyMode={privacyMode}
                  />
                ))}
              </div>
            </div>
          )}

          {/* VIEW: TRANSFERS & WIRES */}
          {activeTab === 'transfers' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-extrabold text-white tracking-wide">
                    High-Value Payments & Cross-Border Clearing
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Instant settlement via FedNow, SEPA Instant, and SWIFT gpi rails
                  </p>
                </div>
                <button
                  onClick={() => setIsTransferOpen(true)}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold text-xs tracking-wide flex items-center gap-2 shadow-md shadow-emerald-500/20"
                >
                  <Send className="w-3.5 h-3.5" /> Dispatch Wire
                </button>
              </div>

              <GlobalTransactionMap />

              <TransactionTable
                transactions={transactions}
                privacyMode={privacyMode}
              />
            </div>
          )}

          {/* VIEW: LENDING & CREDIT */}
          {activeTab === 'lending' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-extrabold text-white tracking-wide">
                    Institutional Vault Credit & Growth Capital
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Instant collateralized vault borrowing with zero liquidation friction and sub-second disbursement
                  </p>
                </div>
              </div>

              <CreditScoreRadar score={activePersona.creditScore} />

              <LoanCreditUnderwriter
                onLoanDisbursed={handleLoanDisbursed}
                privacyMode={privacyMode}
              />
            </div>
          )}

          {/* VIEW: FRAUD SENTINEL & SECURITY */}
          {activeTab === 'security' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-extrabold text-white tracking-wide">
                    Quantum Threat Sentinel & Fraud Anomaly Hub
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Live Bayesian machine learning model defending against unauthorized velocity and geolocation spikes
                  </p>
                </div>
              </div>

              <FraudMonitoringHub
                transactions={transactions}
                onApproveTx={handleApproveTx}
                onBlockTx={handleBlockTx}
                onSimulateThreat={handleSimulateThreat}
              />
            </div>
          )}

          {/* VIEW: FINAI COPILOT */}
          {activeTab === 'finai' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-extrabold text-white tracking-wide">
                    FinAI Autonomous Financial Intelligence
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Predictive cashflow models, tax loss-harvesting alerts, and automated treasury yield optimization
                  </p>
                </div>
              </div>

              <FinAICopilot
                insights={AI_INSIGHTS}
                activePersona={activePersona}
                onExecuteAction={(insight) => alert(`Executing: ${insight.title}`)}
                privacyMode={privacyMode}
              />
            </div>
          )}
        </main>
      </div>

      {/* Global Modals */}
      <QuickTransferModal
        isOpen={isTransferOpen}
        onClose={() => setIsTransferOpen(false)}
        accounts={activePersona.accounts}
        onTransferComplete={handleTransferComplete}
      />

      <CreateCardModal
        isOpen={isCreateCardOpen}
        onClose={() => setIsCreateCardOpen(false)}
        onCardCreated={handleCardCreated}
        defaultCardholder={activePersona.name}
      />

      <StatementExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        persona={activePersona}
        transactions={transactions}
        accounts={activePersona.accounts}
      />
    </div>
  );
}
