import React from 'react';
import {
  LayoutDashboard,
  Layers,
  Wallet,
  CreditCard,
  Send,
  Landmark,
  Bot,
  LineChart,
} from 'lucide-react';

export type TabType =
  | 'overview'
  | 'visualizations'
  | 'demat'
  | 'accounts'
  | 'cards'
  | 'transfers'
  | 'lending'
  | 'finai';

interface SidebarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const navItems = [
    { id: 'overview', label: 'Command Center', icon: LayoutDashboard, badge: 'Live' },
    { id: 'visualizations', label: 'Visual Analytics', icon: Layers, badge: '4 Engines' },
    { id: 'demat', label: 'Demat & Allocations', icon: LineChart, badge: 'CDSL / NSDL' },
    { id: 'accounts', label: 'Vaults & GIFT FX', icon: Wallet },
    { id: 'cards', label: 'RuPay & Virtual Cards', icon: CreditCard, badge: 'NCMC' },
    { id: 'transfers', label: 'UPI & RTGS Payments', icon: Send },
    { id: 'lending', label: 'LAS & MSME Credit', icon: Landmark, badge: 'Pre-Approved' },
    { id: 'finai', label: 'Valence AI Copilot', icon: Bot, badge: 'v4.5' },
  ];

  return (
    <aside className="w-full lg:w-64 shrink-0 p-4 border-b lg:border-b-0 lg:border-r border-slate-200/90 bg-white lg:min-h-[calc(100vh-6rem)] shadow-xs">
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
                  ? 'bg-blue-50 text-blue-700 font-semibold border border-blue-200/80 shadow-xs'
                  : 'text-slate-600 hover:text-blue-900 hover:bg-slate-50 border border-transparent'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon
                  className={`w-4 h-4 transition-colors ${
                    isActive ? 'text-blue-600' : 'text-slate-400 group-hover:text-blue-600'
                  }`}
                />
                <span className="whitespace-nowrap">{item.label}</span>
              </div>

              {item.badge && (
                <span className={`ml-2 hidden lg:inline-block px-2 py-0.5 rounded text-[10px] font-mono font-medium ${
                  isActive 
                    ? 'bg-blue-100/70 text-blue-800' 
                    : 'bg-slate-100 text-slate-500'
                }`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* System Integrity Widget at bottom */}
      <div className="mt-8 hidden lg:block p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs shadow-xs">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-mono uppercase text-slate-500 flex items-center gap-1.5 font-semibold">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
            Valence Banking Core
          </span>
          <span className="text-[10px] font-mono text-blue-700 font-bold bg-blue-100/60 px-1.5 py-0.5 rounded">RBI REGD</span>
        </div>

        <div className="space-y-1.5 text-[11px] font-mono text-slate-600">
          <div className="flex justify-between">
            <span>NPCI UPI Switch:</span>
            <span className="text-slate-900 font-medium">12ms clearance</span>
          </div>
          <div className="flex justify-between">
            <span>Artha Liquid Vault:</span>
            <span className="text-blue-700 font-semibold">7.45% p.a.</span>
          </div>
          <div className="flex justify-between">
            <span>DICGC Insurance:</span>
            <span className="text-slate-900 font-medium">₹5,00,000 / Depositor</span>
          </div>
        </div>
      </div>
    </aside>
  );
};
