import React, { useState } from 'react';
import {
  LineChart,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  Plus,
  ShieldCheck,
  CheckCircle2,
  PieChart,
  ArrowUpRight,
  Sparkles,
  Layers,
  ExternalLink,
  Sliders,
  DollarSign,
  Landmark,
} from 'lucide-react';
import { DematAccount, DematHolding } from '../../types/fintech';
import { formatINR } from '../../utils/formatters';

interface DematPortfolioProps {
  account: DematAccount | null;
  privacyMode: boolean;
  onOpenLinkModal: () => void;
  onPledgeHoldings?: (holding: DematHolding) => void;
}

export const DematPortfolioWidget: React.FC<DematPortfolioProps> = ({
  account,
  privacyMode,
  onOpenLinkModal,
  onPledgeHoldings,
}) => {
  const [filterClass, setFilterClass] = useState<string>('all');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [rebalancedNotice, setRebalancedNotice] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 800);
  };

  const handleSimulateRebalance = () => {
    setRebalancedNotice(true);
    setTimeout(() => setRebalancedNotice(false), 4000);
  };

  if (!account) {
    return (
      <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-xs text-center">
        <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 border border-blue-200 flex items-center justify-center mx-auto mb-4 shadow-sm">
          <LineChart className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold text-slate-900">No Demat Account Linked</h3>
        <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 mb-6 leading-relaxed">
          Link your CDSL / NSDL Demat account (Zerodha, Groww, Angel One, Upstox, or ICICI Direct) to track live stock portfolios, monitor asset allocation, and unlock instant Loans Against Securities (LAS).
        </p>
        <button
          onClick={onOpenLinkModal}
          className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs tracking-wide shadow-md shadow-blue-500/20 inline-flex items-center gap-2 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Link Demat Account Now
        </button>
      </div>
    );
  }

  const holdings = account.holdings || [];
  const filteredHoldings = filterClass === 'all'
    ? holdings
    : holdings.filter((h) => h.assetClass === filterClass);

  return (
    <div className="space-y-6">
      {/* Top Portfolio Valuation & Sync Card */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs relative overflow-hidden">
        {/* Subtle accent glow */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-blue-50 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 font-bold uppercase">
                {account.brokerName} • {account.depository}
              </span>
              <span className="text-[10px] font-mono text-slate-400">
                BO ID: {account.boId}
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] text-emerald-600 font-semibold hidden sm:inline">
                T+1 Settlement Synced
              </span>
            </div>

            <span className="text-xs font-mono uppercase text-slate-500 font-semibold block">
              Consolidated Demat Portfolio Valuation (डीमैट संपत्ति)
            </span>

            <div className="flex items-baseline gap-3 mt-1.5 flex-wrap">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-mono tracking-tight">
                {formatINR(account.totalPortfolioValue, privacyMode)}
              </h2>

              <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                <TrendingUp className="w-3.5 h-3.5" />
                +{account.totalPnlPercent}% ({formatINR(account.totalPnl, privacyMode)})
              </span>

              <span className="text-xs font-mono text-slate-500">
                Today: <strong className="text-emerald-600">+{formatINR(account.dayPnl, privacyMode)} (+{account.dayPnlPercent}%)</strong>
              </span>
            </div>

            <div className="mt-2 text-xs text-slate-500 flex items-center gap-4 font-mono">
              <span>Invested Capital: <strong className="text-slate-800">{formatINR(account.totalInvestedValue, privacyMode)}</strong></span>
              <span>Total Holdings: <strong className="text-slate-800">{holdings.length} Assets</strong></span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              onClick={handleRefresh}
              className="px-3.5 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-mono text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs"
              title="Refresh live prices via NSE / BSE market feed"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-blue-600 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>Refresh Feed</span>
            </button>

            <button
              onClick={handleSimulateRebalance}
              className="px-3.5 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-700 font-mono text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs"
            >
              <Sliders className="w-3.5 h-3.5 text-blue-600" />
              <span>Auto-Rebalance</span>
            </button>

            <button
              onClick={onOpenLinkModal}
              className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-mono text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs shadow-blue-500/20"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Switch Broker</span>
            </button>
          </div>
        </div>

        {rebalancedNotice && (
          <div className="mt-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center justify-between animate-in fade-in duration-200">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Rebalance simulation executed: Portfolio aligned to 50% Equity, 25% Mutual Funds, 15% SGBs, 10% ETFs.</span>
            </div>
          </div>
        )}

        {/* Asset Allocation Multi-Bar */}
        <div className="mt-6">
          <div className="flex items-center justify-between text-xs font-mono mb-2">
            <span className="text-slate-500 uppercase font-semibold flex items-center gap-1.5">
              <PieChart className="w-3.5 h-3.5 text-blue-600" />
              Financial Asset Allocation
            </span>
            <span className="text-slate-500">
              Optimal Allocation Index: <strong className="text-blue-700">96/100</strong>
            </span>
          </div>

          <div className="w-full h-3 rounded-full overflow-hidden flex bg-slate-100 p-0.5 gap-0.5">
            <div
              className="h-full bg-blue-600 rounded-l-full transition-all duration-500"
              style={{ width: `${account.assetAllocation.equity}%` }}
              title={`Large Cap Equity: ${account.assetAllocation.equity}%`}
            />
            <div
              className="h-full bg-indigo-500 transition-all duration-500"
              style={{ width: `${account.assetAllocation.mutualFunds}%` }}
              title={`Direct Mutual Funds: ${account.assetAllocation.mutualFunds}%`}
            />
            <div
              className="h-full bg-amber-500 transition-all duration-500"
              style={{ width: `${account.assetAllocation.sgbGold}%` }}
              title={`Sovereign Gold Bonds (SGB): ${account.assetAllocation.sgbGold}%`}
            />
            <div
              className="h-full bg-emerald-500 rounded-r-full transition-all duration-500"
              style={{ width: `${account.assetAllocation.etfIndex}%` }}
              title={`Nifty Index ETFs: ${account.assetAllocation.etfIndex}%`}
            />
          </div>

          {/* Allocation Breakdown Chips */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3">
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
              <div className="flex items-center gap-1.5 mb-1">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                <span className="text-[11px] font-semibold text-slate-700">Equities</span>
                <span className="text-[10px] font-mono text-blue-600 font-bold ml-auto">{account.assetAllocation.equity}%</span>
              </div>
              <span className="text-xs font-mono font-bold text-slate-900 block">
                {formatINR(account.totalPortfolioValue * (account.assetAllocation.equity / 100), privacyMode)}
              </span>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
              <div className="flex items-center gap-1.5 mb-1">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
                <span className="text-[11px] font-semibold text-slate-700">Mutual Funds</span>
                <span className="text-[10px] font-mono text-indigo-600 font-bold ml-auto">{account.assetAllocation.mutualFunds}%</span>
              </div>
              <span className="text-xs font-mono font-bold text-slate-900 block">
                {formatINR(account.totalPortfolioValue * (account.assetAllocation.mutualFunds / 100), privacyMode)}
              </span>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
              <div className="flex items-center gap-1.5 mb-1">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <span className="text-[11px] font-semibold text-slate-700">SGB Gold</span>
                <span className="text-[10px] font-mono text-amber-600 font-bold ml-auto">{account.assetAllocation.sgbGold}%</span>
              </div>
              <span className="text-xs font-mono font-bold text-slate-900 block">
                {formatINR(account.totalPortfolioValue * (account.assetAllocation.sgbGold / 100), privacyMode)}
              </span>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
              <div className="flex items-center gap-1.5 mb-1">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span className="text-[11px] font-semibold text-slate-700">Index ETFs</span>
                <span className="text-[10px] font-mono text-emerald-600 font-bold ml-auto">{account.assetAllocation.etfIndex}%</span>
              </div>
              <span className="text-xs font-mono font-bold text-slate-900 block">
                {formatINR(account.totalPortfolioValue * (account.assetAllocation.etfIndex / 100), privacyMode)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Holdings Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {/* Table Header Controls */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Synchronized Demat Holdings (शेयर पोर्टफोलियो)</h3>
            <p className="text-[11px] text-slate-500">Live prices linked to National Stock Exchange (NSE) and Bombay Stock Exchange (BSE)</p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {[
              { id: 'all', label: 'All Holdings' },
              { id: 'equity_largecap', label: 'Large Cap' },
              { id: 'mutual_fund', label: 'Mutual Funds' },
              { id: 'gold_sgb', label: 'SGB Gold' },
              { id: 'etf_index', label: 'Index ETFs' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setFilterClass(f.id)}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-all cursor-pointer whitespace-nowrap ${
                  filterClass === f.id
                    ? 'bg-blue-600 text-white font-semibold shadow-xs'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-[10px] font-mono uppercase text-slate-500 tracking-wider">
                <th className="py-3 px-4">Instrument / Company</th>
                <th className="py-3 px-4">Qty & Avg Buy</th>
                <th className="py-3 px-4">LTP (Market Price)</th>
                <th className="py-3 px-4">Current Valuation</th>
                <th className="py-3 px-4">Total P&L</th>
                <th className="py-3 px-4 text-center">Allocation</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredHoldings.map((h) => {
                const isPositive = h.pnl >= 0;
                return (
                  <tr key={h.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <div>
                          <span className="font-bold font-mono text-slate-900 block">
                            {h.symbol}
                          </span>
                          <span className="text-[11px] text-slate-500 block truncate max-w-[160px]">
                            {h.name}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-mono">
                      <span className="text-slate-900 font-semibold block">{h.quantity.toLocaleString()}</span>
                      <span className="text-[10px] text-slate-400 block">Avg: ₹{h.avgBuyPrice.toFixed(2)}</span>
                    </td>

                    <td className="py-3.5 px-4 font-mono">
                      <span className="text-slate-900 font-bold block">₹{h.currentPrice.toFixed(2)}</span>
                      <span className={`text-[10px] font-semibold block ${h.dayChangePercentage >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {h.dayChangePercentage >= 0 ? '+' : ''}{h.dayChangePercentage}%
                      </span>
                    </td>

                    <td className="py-3.5 px-4 font-mono">
                      <span className="text-slate-900 font-bold block">
                        {formatINR(h.currentValue, privacyMode)}
                      </span>
                      <span className="text-[10px] text-slate-400 block">
                        Cost: {formatINR(h.investedValue, privacyMode)}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 font-mono">
                      <span className={`font-bold block ${isPositive ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {isPositive ? '+' : ''}{formatINR(h.pnl, privacyMode)}
                      </span>
                      <span className={`text-[10px] font-semibold block ${isPositive ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {isPositive ? '+' : ''}{h.pnlPercentage.toFixed(2)}%
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-center font-mono font-semibold text-blue-700">
                      <span className="px-2 py-0.5 rounded-full bg-blue-50 border border-blue-200 text-[11px]">
                        {h.allocationPercentage}%
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => {
                          if (onPledgeHoldings) {
                            onPledgeHoldings(h);
                          } else {
                            alert(`Pledged ${h.quantity} units of ${h.symbol} as collateral for instant Loan Against Securities (LAS) at 8.25% p.a.`);
                          }
                        }}
                        className="px-2.5 py-1.5 rounded-lg bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-300 text-blue-700 text-[11px] font-mono font-semibold transition-all cursor-pointer inline-flex items-center gap-1 shadow-2xs"
                        title="Pledge holdings for instant LAS Credit Line"
                      >
                        <Landmark className="w-3 h-3 text-blue-600" />
                        <span>Pledge LAS</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 text-[11px] font-mono text-slate-500 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
            <span>CDSL / NSDL Depository Electronic Pledging Authorized</span>
          </div>
          <span>Showing {filteredHoldings.length} of {holdings.length} Positions</span>
        </div>
      </div>
    </div>
  );
};
