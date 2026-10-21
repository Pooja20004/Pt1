import React from 'react';
import {
  LayoutDashboard,
  Layers,
  Wallet,
  CreditCard,
  Send,
  Landmark,
  ShieldAlert,
  Bot,
  Activity,
  Zap,
} from 'lucide-react';

export type TabType =
  | 'overview'
  | 'visualizations'
  | 'accounts'
  | 'cards'
  | 'transfers'
  | 'lending'
  | 'security'
  | 'finai';

interface SidebarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  flaggedCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, flaggedCount }) => {
  const navItems = [
    { id: 'overview', label: 'Command Center', icon: LayoutDashboard, badge: 'Live' },
    { id: 'visualizations', label: 'Visual Analytics', icon: Layers, badge: '4 Engine' },
    { id: 'accounts', label: 'Vaults & FX Swap', icon: Wallet },
    { id: 'cards', label: '3D Virtual Cards', icon: CreditCard },
    { id: 'transfers', label: 'Payments & Wire', icon: Send },
    { id: 'lending', label: 'Credit & Lending', icon: Landmark, badge: 'Pre-Approved' },
    {
      id: 'security',
      label: 'Fraud Sentinel',
      icon: ShieldAlert,
      alertBadge: flaggedCount > 0 ? flaggedCount : undefined,
    },
    { id: 'finai', label: 'FinAI Copilot', icon: Bot, badge: 'V4.5' },
  ];

  return (
    <aside className="w-full lg:w-64 shrink-0 p-4 border-b lg:border-b-0 lg:border-r border-slate-800/80 bg-[#090b10]/60 lg:min-h-[calc(100vh-6rem)]">
      {/* Navigation Links */}
      <div className="flex lg:flex-col gap-1.5 overflow-x-auto lg:overflow-visible no-scrollbar">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as TabType)}
              className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-xs transition-all shrink-0 cursor-pointer ${
                isActive
                  ? 'bg-gradient-to-r from-emerald-500/15 to-teal-500/10 text-emerald-300 border border-emerald-500/30 shadow-md shadow-emerald-500/5'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60 border border-transparent'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon
                  className={`w-4 h-4 transition-colors ${
                    isActive ? 'text-emerald-400' : 'text-slate-500 group-hover:text-slate-300'
                  }`}
                />
                <span className="whitespace-nowrap">{item.label}</span>
              </div>

              {item.alertBadge && (
                <span className="ml-2 px-1.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-rose-500/20 text-rose-400 border border-rose-500/40 animate-pulse">
                  {item.alertBadge}
                </span>
              )}

              {item.badge && !item.alertBadge && (
                <span className="ml-2 hidden lg:inline-block px-2 py-0.5 rounded text-[9px] font-mono text-slate-400 bg-slate-900 border border-slate-800">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* System Integrity Widget at bottom */}
      <div className="mt-8 hidden lg:block p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/90 text-xs">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-mono uppercase text-slate-400 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Core Infrastructure
          </span>
          <span className="text-[10px] font-mono text-emerald-400 font-bold">100% HEALTH</span>
        </div>

        <div className="space-y-1.5 text-[11px] font-mono text-slate-400">
          <div className="flex justify-between">
            <span>FedNow Rail:</span>
            <span className="text-slate-200">18ms clearance</span>
          </div>
          <div className="flex justify-between">
            <span>Quantum Vault:</span>
            <span className="text-emerald-400 font-semibold">5.45% APY</span>
          </div>
          <div className="flex justify-between">
            <span>FDIC Sweep:</span>
            <span className="text-slate-200">$25M Protected</span>
          </div>
        </div>
      </div>
    </aside>
  );
};
