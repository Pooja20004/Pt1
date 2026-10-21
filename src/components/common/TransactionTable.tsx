import React, { useState } from 'react';
import { Search, Filter, ArrowUpRight, ArrowDownLeft, ShieldAlert, CheckCircle2, Clock, Globe } from 'lucide-react';
import { Transaction } from '../../types/fintech';

interface TableProps {
  transactions: Transaction[];
  privacyMode: boolean;
}

export const TransactionTable: React.FC<TableProps> = ({ transactions, privacyMode }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);

  const categories = ['all', 'Inflow', 'Cloud & Tech', 'Payroll & Operations', 'Investment & Yield', 'Flagged'];

  const filtered = transactions.filter((t) => {
    const matchesSearch =
      t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.merchant.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.referenceId.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;

    if (filterCategory === 'all') return true;
    if (filterCategory === 'Inflow') return t.type === 'inflow';
    if (filterCategory === 'Flagged') return t.status === 'flagged';
    return t.category === filterCategory;
  });

  const formatAmount = (amount: number, currency: string) => {
    if (privacyMode) return '••••••';
    const isNegative = amount < 0;
    const absVal = Math.abs(amount).toLocaleString(undefined, { minimumFractionDigits: 2 });
    return `${isNegative ? '-' : '+'}${absVal} ${currency}`;
  };

  return (
    <div className="glass-panel rounded-2xl p-6 border border-slate-800/80">
      {/* Header and Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-base font-bold text-white tracking-wide">
            Cryptographic Transaction Ledger & Clearance
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time immutable ledger entries verified across global SWIFT and FedNow gateways
          </p>
        </div>

        {/* Search bar */}
        <div className="relative w-full md:w-64">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search merchant, hash, ref..."
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-3 mb-4 border-b border-slate-800/80 no-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilterCategory(cat)}
            className={`px-3 py-1 rounded-lg text-xs font-mono transition-all shrink-0 ${
              filterCategory === cat
                ? 'bg-emerald-500/15 text-emerald-300 font-bold border border-emerald-500/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            {cat.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs font-mono">
          <thead>
            <tr className="border-b border-slate-800 text-[10px] uppercase text-slate-400">
              <th className="pb-3 pl-2">Transaction Details</th>
              <th className="pb-3">Category</th>
              <th className="pb-3">Clearance Status</th>
              <th className="pb-3">Risk Vector</th>
              <th className="pb-3 text-right pr-2">Net Value</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50">
            {filtered.map((tx) => {
              const isInflow = tx.amount > 0;
              return (
                <tr
                  key={tx.id}
                  onClick={() => setSelectedTx(tx)}
                  className="hover:bg-slate-800/40 transition-colors cursor-pointer group"
                >
                  {/* Title & Merchant */}
                  <td className="py-3.5 pl-2">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border ${
                          tx.status === 'flagged'
                            ? 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                            : isInflow
                            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                            : 'bg-slate-800 border-slate-700 text-slate-300'
                        }`}
                      >
                        {tx.status === 'flagged' ? (
                          <ShieldAlert className="w-4 h-4" />
                        ) : isInflow ? (
                          <ArrowDownLeft className="w-4 h-4" />
                        ) : (
                          <ArrowUpRight className="w-4 h-4" />
                        )}
                      </div>
                      <div>
                        <span className="font-bold text-white text-xs block group-hover:text-cyan-300 transition-colors">
                          {tx.title}
                        </span>
                        <span className="text-[10px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                          {tx.timestamp} • Ref: {tx.referenceId}
                          {tx.cardLast4 && <span>• Card •••• {tx.cardLast4}</span>}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Category */}
                  <td className="py-3.5 text-slate-300">
                    <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px]">
                      {tx.category}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="py-3.5">
                    {tx.status === 'settled' && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-400">
                        <CheckCircle2 className="w-3 h-3" /> Settled
                      </span>
                    )}
                    {tx.status === 'pending' && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-400">
                        <Clock className="w-3 h-3" /> Clearing...
                      </span>
                    )}
                    {tx.status === 'flagged' && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-rose-400">
                        <ShieldAlert className="w-3 h-3" /> Quarantined
                      </span>
                    )}
                  </td>

                  {/* Risk Score */}
                  <td className="py-3.5">
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded border ${
                        tx.riskScore > 50
                          ? 'bg-rose-500/20 text-rose-400 border-rose-500/30'
                          : tx.riskScore > 20
                          ? 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                          : 'bg-slate-900 text-slate-400 border-slate-800'
                      }`}
                    >
                      {tx.riskScore}/100 Risk
                    </span>
                  </td>

                  {/* Amount */}
                  <td className="py-3.5 text-right pr-2">
                    <span
                      className={`text-xs font-bold font-mono ${
                        tx.status === 'flagged'
                          ? 'text-rose-400 line-through'
                          : isInflow
                          ? 'text-emerald-400'
                          : 'text-white'
                      }`}
                    >
                      {formatAmount(tx.amount, tx.currency)}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Transaction Detail Drawer / Popover Modal */}
      {selectedTx && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="glass-panel w-full max-w-md rounded-2xl p-6 border border-slate-700 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <Globe className="w-4 h-4" />
                </span>
                <h3 className="text-sm font-bold text-white">Cryptographic Clearance Telemetry</h3>
              </div>
              <button
                onClick={() => setSelectedTx(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <div className="my-5 space-y-3 font-mono text-xs">
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex justify-between items-center">
                <span className="text-slate-400">Total Net Amount:</span>
                <span className={`text-base font-bold ${selectedTx.amount > 0 ? 'text-emerald-400' : 'text-white'}`}>
                  {formatAmount(selectedTx.amount, selectedTx.currency)}
                </span>
              </div>

              <div className="space-y-2 text-[11px] text-slate-300">
                <div className="flex justify-between py-1 border-b border-slate-900">
                  <span className="text-slate-500">Merchant / Counterparty:</span>
                  <span className="font-semibold">{selectedTx.merchant}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-900">
                  <span className="text-slate-500">Timestamp:</span>
                  <span>{selectedTx.timestamp}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-900">
                  <span className="text-slate-500">Reference Hash:</span>
                  <span className="text-cyan-400">{selectedTx.referenceId}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-900">
                  <span className="text-slate-500">Location Origin:</span>
                  <span>{selectedTx.location ? `${selectedTx.location.city}, ${selectedTx.location.country}` : 'Global Cloud Edge'}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-900">
                  <span className="text-slate-500">Risk Assessment:</span>
                  <span className={selectedTx.riskScore > 50 ? 'text-rose-400 font-bold' : 'text-emerald-400 font-bold'}>
                    {selectedTx.riskScore} / 100 ({selectedTx.riskScore > 50 ? 'High Anomaly' : 'Optimal'})
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setSelectedTx(null)}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-mono text-xs font-bold transition-all"
            >
              Close Ledger View
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
