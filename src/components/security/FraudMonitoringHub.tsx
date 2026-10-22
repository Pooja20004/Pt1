import React, { useState } from 'react';
import { ShieldAlert, ShieldCheck, CheckCircle2, XCircle, AlertTriangle, Cpu, Lock, Terminal, RefreshCw } from 'lucide-react';
import { Transaction } from '../../types/fintech';
import { formatINR } from '../../utils/formatters';

interface FraudProps {
  transactions: Transaction[];
  onApproveTx: (id: string) => void;
  onBlockTx: (id: string) => void;
  onSimulateThreat: () => void;
}

export const FraudMonitoringHub: React.FC<FraudProps> = ({
  transactions,
  onApproveTx,
  onBlockTx,
  onSimulateThreat,
}) => {
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(
    transactions.find((t) => t.status === 'flagged') || transactions[0] || null
  );

  const flaggedTransactions = transactions.filter((t) => t.status === 'flagged' || t.riskScore > 50);

  const getRiskBadge = (score: number) => {
    if (score >= 75)
      return { label: 'CRITICAL ANOMALY', color: 'bg-rose-500/20 text-rose-400 border-rose-500/40' };
    if (score >= 40)
      return { label: 'ELEVATED RISK', color: 'bg-amber-500/20 text-amber-400 border-amber-500/40' };
    return { label: 'VERIFIED BENIGN', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40' };
  };

  return (
    <div className="glass-panel rounded-2xl p-6 border border-slate-800/80 relative">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20">
              <ShieldAlert className="w-4 h-4" />
            </span>
            <h2 className="text-base font-bold text-white tracking-wide">
              NPCI & Cyber Sentinel Threat Shield (साइबर सुरक्षा)
            </h2>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
              RBI FRAUD REGISTRY SYNCED
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time machine learning heuristics inspecting UPI handle velocity, SIM swap indicators, and cross-border IP discrepancies
          </p>
        </div>

        <button
          onClick={onSimulateThreat}
          className="self-start text-xs font-mono font-bold px-3 py-1.5 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 border border-rose-500/30 flex items-center gap-1.5 transition-all cursor-pointer"
        >
          <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
          Simulate Cyber Attack Vector
        </button>
      </div>

      {/* Grid of Security telemetry */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Flagged queue */}
        <div className="lg:col-span-5 space-y-2.5">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 px-1">
            <span>Threat Quarantine Queue</span>
            <span className="text-rose-400 font-bold">{flaggedTransactions.length} Pending Review</span>
          </div>

          {flaggedTransactions.length === 0 ? (
            <div className="p-8 rounded-xl bg-slate-900/40 border border-slate-800 text-center">
              <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
              <p className="text-xs text-slate-300 font-semibold">Zero Active Threat Flags</p>
              <p className="text-[11px] text-slate-500 mt-1">
                All 30-day transactional velocity and geographic vectors match your baseline profile.
              </p>
            </div>
          ) : (
            flaggedTransactions.map((tx) => {
              const isSelected = selectedTx?.id === tx.id;
              const badge = getRiskBadge(tx.riskScore);
              return (
                <div
                  key={tx.id}
                  onClick={() => setSelectedTx(tx)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-slate-800/90 border-rose-500/80 shadow-lg shadow-rose-500/10'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-white truncate max-w-[180px]">{tx.merchant}</span>
                    <span className="text-xs font-mono font-bold text-rose-400">
                      {formatINR(Math.abs(tx.amount))}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-400">{tx.timestamp}</span>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${badge.color}`}>
                      Risk Score: {tx.riskScore}/100
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right: Detailed Deep Threat Inspection */}
        <div className="lg:col-span-7 bg-slate-950/80 p-5 rounded-xl border border-slate-800 flex flex-col justify-between">
          {selectedTx ? (
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div>
                  <span className="text-[10px] font-mono uppercase text-slate-500">Heuristic Analysis</span>
                  <h4 className="text-sm font-bold text-white">{selectedTx.merchant}</h4>
                </div>
                <span className="text-xs font-mono text-slate-400">{selectedTx.referenceId}</span>
              </div>

              <div className="grid grid-cols-2 gap-3 my-4 text-xs font-mono">
                <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">Attempt Amount</span>
                  <span className="text-white font-bold">{formatINR(Math.abs(selectedTx.amount))}</span>
                </div>
                <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">Origin IP Location</span>
                  <span className="text-amber-400 font-bold">
                    {selectedTx.location ? `${selectedTx.location.city}, ${selectedTx.location.country}` : 'Anonymized Proxy'}
                  </span>
                </div>
              </div>

              {/* Anomaly Narrative */}
              <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/25 text-xs text-rose-300 leading-relaxed mb-4">
                <strong className="block mb-0.5 font-mono text-[11px] text-rose-200">Trigger Rule:</strong>
                {selectedTx.flagReason ||
                  'Heuristic engine identified rapid IP velocity hopping across non-whitelisted foreign jurisdiction.'}
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  onClick={() => onApproveTx(selectedTx.id)}
                  className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-mono text-xs font-bold border border-slate-700 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  Mark Authorized
                </button>
                <button
                  onClick={() => onBlockTx(selectedTx.id)}
                  className="py-2.5 px-3 rounded-xl bg-rose-500 hover:bg-rose-600 text-slate-950 font-mono text-xs font-bold shadow-md shadow-rose-500/20 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <XCircle className="w-3.5 h-3.5" />
                  Block & Re-Key RuPay Token
                </button>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-xs text-slate-500">
              Select an event from the queue to inspect ML telemetry
            </div>
          )}

          {/* Security Perimeter Status */}
          <div className="mt-5 pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] font-mono text-slate-400">
            <span className="flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-cyan-400" />
              NPCI Tokenization & AES-256 GCM
            </span>
            <span className="text-emerald-400 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              RBI Cyber Security Framework Compliant
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
