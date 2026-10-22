import React from 'react';
import { X, FileText, Download, Printer, CheckCircle, ShieldCheck } from 'lucide-react';
import { AccountBalance, Transaction, Persona } from '../../types/fintech';
import { formatINR } from '../../utils/formatters';

interface StatementModalProps {
  isOpen: boolean;
  onClose: () => void;
  persona: Persona;
  transactions: Transaction[];
  accounts: AccountBalance[];
}

export const StatementExportModal: React.FC<StatementModalProps> = ({
  isOpen,
  onClose,
  persona,
  transactions,
  accounts,
}) => {
  if (!isOpen) return null;

  const totalBalanceINR = accounts.reduce(
    (sum, a) => sum + (a.currency === 'INR' ? a.balance : a.balance * 86.42),
    0
  );

  const downloadCSV = () => {
    const headers = ['Transaction ID', 'RRN', 'Date', 'Counterparty / Merchant', 'Category', 'Amount (INR)', 'Status', 'Risk Score'];
    const rows = transactions.map((t) => [
      t.referenceId,
      t.rrn || 'N/A',
      t.timestamp,
      `"${t.title.replace(/"/g, '""')}"`,
      t.category,
      t.amount,
      t.status,
      t.riskScore,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Valence_Bharat_Statement_${persona.name.replace(/\s+/g, '_')}_FY26.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadJSON = () => {
    const data = {
      institution: 'Valence Bharat Quantum Banking OS (भारत)',
      rbiRegulated: true,
      generatedAt: new Date().toISOString(),
      client: {
        name: persona.name,
        pan: persona.panNumber,
        city: persona.city,
        tier: persona.tier,
      },
      accounts,
      transactions,
    };
    const jsonContent = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(data, null, 2));
    const link = document.createElement('a');
    link.setAttribute('href', jsonContent);
    link.setAttribute('download', `Valence_Bharat_Ledger_${persona.name.replace(/\s+/g, '_')}_FY26.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="glass-panel w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl p-6 border border-slate-700 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Audited Financial Statement & 26AS Ledger</h3>
            <p className="text-xs text-slate-400">Official cryptographic certificate for RBI and Income Tax Department compliance</p>
          </div>
        </div>

        {/* Statement Preview Document */}
        <div className="bg-slate-950 p-6 rounded-xl border border-slate-800 text-slate-300 font-mono text-xs space-y-4">
          <div className="flex justify-between items-start border-b border-slate-800 pb-4">
            <div>
              <span className="text-emerald-400 font-bold text-sm tracking-wider">VALENCE BHARAT (भारत)</span>
              <span className="block text-[10px] text-slate-500">RBI Regulated NBFC-AA • DICGC Insured up to ₹5,00,000</span>
            </div>
            <div className="text-right">
              <span className="text-slate-200 font-semibold block">FINANCIAL YEAR: 2026-27 (Q3)</span>
              <span className="text-slate-500 text-[10px]">LEDGER HASH: VAL-IN-2026-991204</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 py-2 border-b border-slate-800 text-[11px]">
            <div>
              <span className="text-slate-500 block text-[10px]">ACCOUNT HOLDER</span>
              <strong className="text-white text-xs">{persona.name}</strong>
              <span className="text-slate-400 block">PAN: <strong className="text-emerald-400">{persona.panNumber}</strong></span>
              <span className="text-slate-500 block text-[10px]">Location: {persona.city}</span>
            </div>
            <div className="text-right">
              <span className="text-slate-500 block text-[10px]">TOTAL CONSOLIDATED LIQUIDITY</span>
              <strong className="text-emerald-400 text-sm font-bold">
                {formatINR(totalBalanceINR)}
              </strong>
              <span className="text-slate-400 block text-[10px]">Active Vaults: {accounts.length}</span>
            </div>
          </div>

          {/* Accounts Summary */}
          <div>
            <span className="text-[10px] uppercase text-slate-500 block mb-2 font-bold">
              Sub-Vault Balances & IFSC Routing
            </span>
            <div className="space-y-1.5">
              {accounts.map((acc) => (
                <div key={acc.id} className="flex justify-between text-[11px] py-1 border-b border-slate-900">
                  <span className="text-slate-300">
                    {acc.name} ({acc.ifsc || acc.accountNumber})
                  </span>
                  <span className="text-white font-semibold">
                    {formatINR(acc.currency === 'INR' ? acc.balance : acc.balance * 86.42)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-2 text-[10px] text-slate-500 text-center">
            Cryptographic Hash: 0x9f88c3a1e9482937748bb201f948e30928aa1192 • Certified by NPCI & RBI Framework
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-3 gap-3 mt-6">
          <button
            onClick={downloadCSV}
            className="py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            Export CSV
          </button>

          <button
            onClick={downloadJSON}
            className="py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            JSON Ledger
          </button>

          <button
            onClick={handlePrint}
            className="py-2.5 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-mono font-bold flex items-center justify-center gap-1.5 shadow-md shadow-emerald-500/20 transition-all cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            Print Statement
          </button>
        </div>
      </div>
    </div>
  );
};
