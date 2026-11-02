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
  Globe,
  Radio,
  QrCode,
} from 'lucide-react';
import confetti from 'canvas-confetti';

import {
  INITIAL_PERSONAS,
  INITIAL_CARDS,
  INITIAL_TRANSACTIONS,
  FX_RATES,
  AI_INSIGHTS,
  INITIAL_DEMAT_ACCOUNT,
} from './data/mockData';
import { Persona, Transaction, VirtualCard, Currency, AccountBalance, DematAccount, DematHolding } from './types/fintech';
import { formatINR, formatINRCurrencyExact } from './utils/formatters';

import { TopNavbar } from './components/common/TopNavbar';
import { Sidebar, TabType } from './components/common/Sidebar';
import { TransactionTable } from './components/common/TransactionTable';
import { StatementExportModal } from './components/common/StatementExportModal';
import { LinkDematModal } from './components/demat/LinkDematModal';
import { DematPortfolioWidget } from './components/demat/DematPortfolioWidget';

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

export default function App() {
  const [personas, setPersonas] = useState<Persona[]>(INITIAL_PERSONAS);
  const [activePersona, setActivePersona] = useState<Persona>(INITIAL_PERSONAS[0]);
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [cards, setCards] = useState<VirtualCard[]>(INITIAL_CARDS);
  const [dematAccount, setDematAccount] = useState<DematAccount | null>(INITIAL_DEMAT_ACCOUNT);
  const [privacyMode, setPrivacyMode] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  // Modals state
  const [isTransferOpen, setIsTransferOpen] = useState(false);
  const [isCreateCardOpen, setIsCreateCardOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isLinkDematOpen, setIsLinkDematOpen] = useState(false);

  // Consolidated Liquid Cash & Vaults in INR
  const totalLiquidTreasuryINR = activePersona.accounts.reduce((acc, account) => {
    if (account.currency === 'INR') return acc + account.balance;
    if (account.currency === 'USD') return acc + account.balance * 86.42;
    if (account.currency === 'EUR') return acc + account.balance * 93.75;
    if (account.currency === 'GBP') return acc + account.balance * 112.3;
    if (account.currency === 'AED') return acc + account.balance * 23.53;
    if (account.currency === 'BTC') return acc + account.balance * 8520000;
    if (account.currency === 'ETH') return acc + account.balance * 295000;
    return acc + account.balance;
  }, 0);

  // Total Net Worth (Liquid Treasury + Linked Demat Equities & Mutual Funds)
  const totalNetWorthINR = totalLiquidTreasuryINR + (dematAccount ? dematAccount.totalPortfolioValue : 0);

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
      title: `GIFT City Spot Swap: ${fromCur} to ${toCur}`,
      merchant: 'GIFT City IFSC Forex Pool',
      category: 'Internal Rebalance',
      amount: toAmt,
      currency: toCur,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
      status: 'settled',
      type: 'fx_swap',
      riskScore: 0,
      location: { city: 'Gandhinagar', state: 'Gujarat', country: 'India', lat: 23.2156, lng: 72.6369 },
      referenceId: `GIFT-SPOT-${Math.floor(100000 + Math.random() * 900000)}`,
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
      title: `LAS Credit Disbursement: ${presetTitle}`,
      merchant: 'Artha Capital Lending Facility',
      category: 'Mutual Funds & LAS',
      amount: amount,
      currency: 'INR',
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
      status: 'settled',
      type: 'inflow',
      riskScore: 0,
      referenceId: `RTGS-LAS-${Math.floor(100000 + Math.random() * 900000)}`,
    };

    setTransactions((prev) => [loanTx, ...prev]);

    // Deposit directly into primary current account
    setActivePersona((prev) => ({
      ...prev,
      accounts: prev.accounts.map((acc, idx) =>
        idx === 0 ? { ...acc, balance: acc.balance + amount } : acc
      ),
    }));
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      {/* Top Navbar */}
      <TopNavbar
        personas={personas}
        activePersona={activePersona}
        onSelectPersona={(p) => setActivePersona(p)}
        privacyMode={privacyMode}
        onTogglePrivacy={() => setPrivacyMode(!privacyMode)}
        onOpenTransfer={() => setIsTransferOpen(true)}
        onOpenExport={() => setIsExportOpen(true)}
        onOpenLinkDemat={() => setIsLinkDematOpen(true)}
        isDematLinked={!!dematAccount}
        dematPortfolioValue={dematAccount?.totalPortfolioValue || 0}
        fxRates={FX_RATES}
      />

      {/* Main Body Layout: Sidebar + View Content */}
      <div className="flex-1 flex flex-col lg:flex-row max-w-7xl w-full mx-auto">
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 overflow-y-auto">
          {/* VIEW: OVERVIEW / COMMAND CENTER */}
          {activeTab === 'overview' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              {/* Executive Summary Card - Crisp Royal Blue Luxury Gradient */}
              <div className="rounded-3xl p-6 sm:p-8 relative overflow-hidden bg-gradient-to-br from-blue-700 via-blue-800 to-indigo-900 text-white shadow-lg border border-blue-600/30">
                {/* Decorative background geometry */}
                <div className="absolute -top-24 -right-24 w-80 h-80 bg-white/10 rounded-full blur-2xl pointer-events-none" />
                <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-sky-400/15 rounded-full blur-2xl pointer-events-none" />

                <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-[11px] font-mono uppercase tracking-widest text-blue-100 font-bold bg-white/15 px-2.5 py-0.5 rounded-full border border-white/20">
                        {activePersona.tier}
                      </span>
                      <span className="text-blue-200 text-xs font-mono">• DICGC Insured to ₹5,00,000 / Depositor</span>
                    </div>

                    <span className="text-xs font-mono uppercase tracking-wider text-blue-200 block">
                      Total Consolidated Net Treasury (कुल संपत्ति)
                    </span>

                    <div className="flex items-baseline gap-4 mt-1.5">
                      <h2 className="text-3xl sm:text-5xl font-extrabold text-white font-mono tracking-tight drop-shadow-sm">
                        {formatINR(totalNetWorthINR, privacyMode)}
                      </h2>
                      <span className="inline-flex items-center gap-1 text-xs sm:text-sm font-semibold px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                        <TrendingUp className="w-3.5 h-3.5" />
                        +5.24% (+₹18.4L 30D)
                      </span>
                    </div>

                    <p className="text-xs text-blue-100 mt-2">
                      Client: <strong className="text-white">{activePersona.name}</strong> •{' '}
                      PAN: <strong className="text-sky-300 font-mono">{activePersona.panNumber}</strong> •{' '}
                      {activePersona.city}
                    </p>
                  </div>

                  {/* Fast Action Buttons */}
                  <div className="flex flex-wrap items-center gap-2.5">
                    <button
                      onClick={() => setIsTransferOpen(true)}
                      className="px-4 py-2.5 rounded-xl bg-white hover:bg-blue-50 text-blue-700 font-bold text-xs tracking-wide shadow-md flex items-center gap-2 transition-all cursor-pointer"
                    >
                      <Send className="w-4 h-4 text-blue-600" />
                      Send UPI / RTGS
                    </button>

                    <button
                      onClick={() => setActiveTab('demat')}
                      className="px-4 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 border border-white/25 text-white font-bold text-xs font-mono flex items-center gap-2 transition-all cursor-pointer backdrop-blur-sm"
                    >
                      <Layers className="w-4 h-4 text-sky-300" />
                      {dematAccount ? 'Demat Portfolio' : 'Link Demat'}
                    </button>

                    <button
                      onClick={() => setActiveTab('accounts')}
                      className="px-4 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 border border-white/25 text-white font-bold text-xs font-mono flex items-center gap-2 transition-all cursor-pointer backdrop-blur-sm"
                    >
                      <ArrowDownUp className="w-4 h-4 text-sky-300" />
                      GIFT City FX Swap
                    </button>

                    <button
                      onClick={() => setIsCreateCardOpen(true)}
                      className="px-4 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 border border-white/25 text-white font-bold text-xs font-mono flex items-center gap-2 transition-all cursor-pointer backdrop-blur-sm"
                    >
                      <Plus className="w-4 h-4 text-emerald-300" />
                      New RuPay Card
                    </button>
                  </div>
                </div>

                {/* Sub-account Pills */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mt-8 pt-6 border-t border-white/15">
                  {/* Demat Holding Pill */}
                  {dematAccount && (
                    <div
                      onClick={() => setActiveTab('demat')}
                      className="bg-white/15 hover:bg-white/20 backdrop-blur-md p-3 rounded-xl border border-white/25 transition-all text-white cursor-pointer"
                    >
                      <div className="flex items-center justify-between text-[10px] font-mono text-blue-100 mb-1">
                        <span className="truncate max-w-[90px]">{dematAccount.brokerName}</span>
                        <span className="text-emerald-300 font-bold">
                          +{dematAccount.totalPnlPercent}%
                        </span>
                      </div>
                      <span className="text-sm font-bold font-mono text-white block">
                        {privacyMode ? '••••••' : formatINR(dematAccount.totalPortfolioValue)}
                      </span>
                      <span className="text-[10px] text-blue-200 font-mono mt-0.5 block truncate">
                        {dematAccount.depository} • {dematAccount.holdings.length} Holdings
                      </span>
                    </div>
                  )}

                  {activePersona.accounts.map((acc) => (
                    <div
                      key={acc.id}
                      className="bg-white/10 hover:bg-white/15 backdrop-blur-md p-3 rounded-xl border border-white/15 transition-all text-white"
                    >
                      <div className="flex items-center justify-between text-[10px] font-mono text-blue-200 mb-1">
                        <span className="truncate max-w-[90px]">{acc.name}</span>
                        {acc.apy && (
                          <span className="text-emerald-300 font-bold">
                            {acc.apy}% p.a.
                          </span>
                        )}
                      </div>
                      <span className="text-sm font-bold font-mono text-white block">
                        {privacyMode
                          ? '••••••'
                          : acc.currency === 'INR'
                          ? formatINR(acc.balance)
                          : `${acc.currency} ${acc.balance.toLocaleString()}`}
                      </span>
                      <span className="text-[10px] text-blue-200 font-mono mt-0.5 block truncate">
                        {acc.ifsc || acc.accountNumber}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Main Visualizer: Interactive Valuation Engine */}
              <PortfolioPerformanceChart
                privacyMode={privacyMode}
                baseValuation={totalNetWorthINR}
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
                  <h2 className="text-xl font-extrabold text-slate-900 tracking-wide">
                    Deep Financial Visualizations & Algorithmic Engines
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Multi-dimensional graphical models for Indian liquidity streams, stochastic SIP compounding, and interbank routing
                  </p>
                </div>
              </div>

              {/* 1. Interactive Sankey Cashflow */}
              <InteractiveCashflowSankey privacyMode={privacyMode} />

              {/* 2. Monte Carlo Wealth Simulator */}
              <MonteCarloWealthSimulator
                privacyMode={privacyMode}
                initialPrincipal={totalNetWorthINR}
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
                  <CreditScoreRadar score={activePersona.cibilScore} />
                </div>
              </div>
            </div>
          )}

          {/* VIEW: DEMAT & ALLOCATIONS */}
          {activeTab === 'demat' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-extrabold text-slate-900 tracking-wide">
                    Indian Demat & Financial Asset Allocations (डीमैट एवं निवेश)
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Real-time CDSL & NSDL depository synchronization for Equities, Sovereign Gold Bonds, and Direct Mutual Funds with T+1 settlement
                  </p>
                </div>
                <button
                  onClick={() => setIsLinkDematOpen(true)}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs tracking-wide shadow-sm flex items-center gap-2 cursor-pointer transition-all"
                >
                  <Plus className="w-4 h-4" /> Link Demat Account
                </button>
              </div>

              <DematPortfolioWidget
                account={dematAccount}
                privacyMode={privacyMode}
                onOpenLinkModal={() => setIsLinkDematOpen(true)}
                onPledgeHoldings={() => {
                  setActiveTab('lending');
                }}
              />
            </div>
          )}

          {/* VIEW: GLOBAL ACCOUNTS & FX */}
          {activeTab === 'accounts' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-extrabold text-slate-900 tracking-wide">
                    Indian Current, Savings, & GIFT City IFSC Vaults
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Direct IFSC clearing in INR, high-yield T-Bills, and GIFT City tax-exempt offshore foreign currency reserves
                  </p>
                </div>
                <button
                  onClick={() => setIsTransferOpen(true)}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs tracking-wide flex items-center gap-2 shadow-sm transition-all cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" /> Send UPI / RTGS
                </button>
              </div>

              {/* Vault Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {activePersona.accounts.map((acc) => (
                  <div
                    key={acc.id}
                    className="glass-panel rounded-2xl p-5 border border-slate-200 hover:border-blue-300 transition-all shadow-xs hover:shadow-md relative overflow-hidden bg-white"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-mono uppercase text-slate-500 font-semibold tracking-wider">
                        {acc.type.replace('_', ' ')}
                      </span>
                      {acc.apy && (
                        <span className="text-xs font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                          {acc.apy}% p.a.
                        </span>
                      )}
                    </div>

                    <h3 className="text-base font-bold text-slate-900 mb-1">{acc.name}</h3>
                    <span className="text-2xl font-extrabold text-blue-900 font-mono block">
                      {privacyMode
                        ? '••••••'
                        : acc.currency === 'INR'
                        ? formatINR(acc.balance)
                        : `${acc.currency} ${acc.balance.toLocaleString()}`}
                    </span>

                    <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] font-mono text-slate-500 flex justify-between">
                      <span>IFSC: <strong className="text-slate-800">{acc.ifsc || 'N/A'}</strong></span>
                      {acc.upiId && <span className="text-blue-600 font-semibold">{acc.upiId}</span>}
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

          {/* VIEW: CARDS */}
          {activeTab === 'cards' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-extrabold text-slate-900 tracking-wide">
                    RuPay Select Metal & NCMC Metro Cards (रुपे कार्ड्स)
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Interactive physical-feel RuPay metal cards with NCMC transit integration, spend shields, and instant tokenized burners
                  </p>
                </div>
                <button
                  onClick={() => setIsCreateCardOpen(true)}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs tracking-wide shadow-sm flex items-center gap-2 cursor-pointer transition-all"
                >
                  <Plus className="w-4 h-4" /> Issue RuPay Card
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
                  <h2 className="text-xl font-extrabold text-slate-900 tracking-wide">
                    High-Value Payments, UPI & RTGS Settlement (भुगतान)
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Sub-second settlement via NPCI UPI 2.0, IMPS, RTGS, and GIFT City offshore rails
                  </p>
                </div>
                <button
                  onClick={() => setIsTransferOpen(true)}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs tracking-wide flex items-center gap-2 shadow-sm cursor-pointer transition-all"
                >
                  <Send className="w-3.5 h-3.5" /> Dispatch Payment
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
                  <h2 className="text-xl font-extrabold text-slate-900 tracking-wide">
                    Loan Against Securities (LAS) & MSME Mudra Credit
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Instant collateralized credit backed by your Mutual Funds & GST cashflows without liquidating investments
                  </p>
                </div>
              </div>

              <CreditScoreRadar score={activePersona.cibilScore} />

              <LoanCreditUnderwriter
                onLoanDisbursed={handleLoanDisbursed}
                privacyMode={privacyMode}
              />
            </div>
          )}

          {/* VIEW: FINAI COPILOT */}
          {activeTab === 'finai' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-extrabold text-slate-900 tracking-wide">
                    Valence AI Autonomous Financial Intelligence
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Predictive cashflow models, Section 208 Advance Tax optimization, GSTR-2B ITC reconciliation, and T-Bill yield harvesting
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

      <LinkDematModal
        isOpen={isLinkDematOpen}
        onClose={() => setIsLinkDematOpen(false)}
        userPan={activePersona.panNumber}
        onLinkSuccess={(newAccount) => {
          setDematAccount(newAccount);
        }}
      />
    </div>
  );
}
