import React, { useState } from 'react';
import { Search, ArrowUpRight, ArrowDownLeft, CheckCircle2, Clock, Globe } from 'lucide-react';
import { Transaction } from '../../types/fintech';
import { formatINR } from '../../utils/formatters';

interface TableProps {
  transactions: Transaction[];
  privacyMode: boolean;
}

export const TransactionTable: React.FC<TableProps> = ({ transactions, privacyMode }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);

  const categories = ['all', 'Inflow', 'UPI P2P & Vendor', 'SaaS & Cloud Infra', 'Advance Tax & GST'];

  const filtered = transactions.filter((t) => {
    const matchesSearch =
      t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.merchant.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.referenceId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (t.upiId && t.upiId.toLowerCase().includes(searchTerm.toLowerCase()));

    if (!matchesSearch) return false;

    if (filterCategory === 'all') return true;
    if (filterCategory === 'Inflow') return t.type === 'inflow';
    return t.category === filterCategory;
  });

  return (
    <div className="glass-panel rounded-2xl p-6 border border-slate-200 bg-white shadow-xs">
      {/* Header and Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-base font-bold text-slate-900 tracking-tight">
            NPCI Unified Transaction Ledger & Clearance (लेन-देन बहीखाता)
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time immutable ledger entries verified across RBI RTGS, NEFT, and NPCI UPI 2.0 switches
          </p>
        </div>

        {/* Search bar */}
        <div className="relative w-full md:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search merchant, UPI ID, RRN..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-3 mb-4 border-b border-slate-100 no-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilterCategory(cat)}
            className={`px-3 py-1 rounded-lg text-xs font-mono transition-all shrink-0 cursor-pointer ${
              filterCategory === cat
                ? 'bg-blue-50 text-blue-700 font-bold border border-blue-200 shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
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
            <tr className="border-b border-slate-200 text-[10px] uppercase text-slate-400 font-semibold">
              <th className="pb-3 pl-2">Transaction Details</th>
              <th className="pb-3">Category</th>
              <th className="pb-3">Clearance Rail</th>
              <th className="pb-3">Verification</th>
              <th className="pb-3 text-right pr-2">Amount (INR)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map((tx) => {
              const isInflow = tx.amount > 0;
              return (
                <tr
                  key={tx.id}
                  onClick={() => setSelectedTx(tx)}
                  className="hover:bg-blue-50/40 transition-colors cursor-pointer group"
                >
                  {/* Title & Merchant */}
                  <td className="py-3.5 pl-2">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border ${
                          isInflow
                            ? 'bg-emerald-50 border-emerald-200 text-emerald-600'
                            : 'bg-blue-50 border-blue-200 text-blue-600'
                        }`}
                      >
                        {isInflow ? (
                          <ArrowDownLeft className="w-4 h-4" />
                        ) : (
                          <ArrowUpRight className="w-4 h-4" />
                        )}
                      </div>
                      <div>
                        <span className="font-bold text-slate-900 text-xs block group-hover:text-blue-600 transition-colors font-sans">
                          {tx.title}
                        </span>
                        <span className="text-[10px] text-slate-500 flex items-center gap-1.5 mt-0.5">
                          {tx.timestamp} • Ref: {tx.referenceId}
                          {tx.upiId && <span className="text-blue-600 font-medium">({tx.upiId})</span>}
                          {tx.cardLast4 && <span>• RuPay •••• {tx.cardLast4}</span>}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Category */}
                  <td className="py-3.5 text-slate-600">
                    <span className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-[10px] font-sans">
                      {tx.category}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="py-3.5">
                    {tx.status === 'settled' ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Settled (सफल)
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                        <Clock className="w-3 h-3 text-amber-600" /> Clearing...
                      </span>
                    )}
                  </td>

                  {/* Verification Status */}
                  <td className="py-3.5">
                    <span className="text-[10px] px-2 py-0.5 rounded border bg-blue-50 text-blue-700 border-blue-200 font-medium">
                      NPCI 2FA Verified
                    </span>
                  </td>

                  {/* Amount */}
                  <td className="py-3.5 text-right pr-2">
                    <span
                      className={`text-xs font-bold font-mono ${
                        isInflow ? 'text-emerald-600' : 'text-slate-900'
                      }`}
                    >
                      {formatINR(tx.amount, privacyMode)}
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white w-full max-w-md rounded-2xl p-6 border border-slate-200 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-blue-50 text-blue-600 border border-blue-200">
                  <Globe className="w-4 h-4" />
                </span>
                <h3 className="text-sm font-bold text-slate-900 font-sans">NPCI Clearance Telemetry</h3>
              </div>
              <button
                onClick={() => setSelectedTx(null)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg cursor-pointer transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="my-5 space-y-3 font-mono text-xs">
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 flex justify-between items-center">
                <span className="text-slate-500 font-medium">Total Net Value:</span>
                <span className={`text-base font-bold ${selectedTx.amount > 0 ? 'text-emerald-600' : 'text-slate-900'}`}>
                  {formatINR(selectedTx.amount, privacyMode)}
                </span>
              </div>

              <div className="space-y-2 text-[11px] text-slate-700">
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-400">Counterparty / Merchant:</span>
                  <span className="font-semibold text-slate-900">{selectedTx.merchant}</span>
                </div>
                {selectedTx.upiId && (
                  <div className="flex justify-between py-1.5 border-b border-slate-100">
                    <span className="text-slate-400">VPA / UPI Handle:</span>
                    <span className="text-blue-600 font-semibold">{selectedTx.upiId}</span>
                  </div>
                )}
                {selectedTx.rrn && (
                  <div className="flex justify-between py-1.5 border-b border-slate-100">
                    <span className="text-slate-400">NPCI RRN:</span>
                    <span className="text-slate-900 font-semibold">{selectedTx.rrn}</span>
                  </div>
                )}
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-400">Timestamp:</span>
                  <span>{selectedTx.timestamp}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-400">Reference Hash:</span>
                  <span className="text-blue-600">{selectedTx.referenceId}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-400">Location Origin:</span>
                  <span>{selectedTx.location ? `${selectedTx.location.city}, ${selectedTx.location.state || selectedTx.location.country}` : 'India Cloud Gateway'}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-400">Clearance Status:</span>
                  <span className="text-emerald-600 font-bold">
                    Settled • Authentic
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setSelectedTx(null)}
              className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-mono text-xs font-semibold shadow-sm transition-all cursor-pointer"
            >
              Close Ledger View
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
