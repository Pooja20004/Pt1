export type Currency = 'INR' | 'USD' | 'EUR' | 'GBP' | 'AED' | 'SGD' | 'BTC' | 'ETH';

export interface AccountBalance {
  id: string;
  name: string;
  type: 'checking' | 'savings' | 'investment' | 'tax_escrow' | 'crypto_vault';
  currency: Currency;
  balance: number;
  apy?: number;
  accountNumber: string;
  ifsc?: string;
  upiId?: string;
  branch?: string;
  change24h: number;
  color: string;
}

export type TransactionCategory =
  | 'SaaS & Cloud Infra'
  | 'Team Payroll & Operations'
  | 'Nifty Dividends & SGB Yield'
  | 'Logistics & Travel'
  | 'Mutual Funds & LAS'
  | 'Dining & Lifestyle'
  | 'UPI P2P & Vendor'
  | 'Advance Tax & GST'
  | 'Internal Rebalance';

export interface Transaction {
  id: string;
  title: string;
  merchant: string;
  category: TransactionCategory;
  amount: number;
  currency: Currency;
  timestamp: string;
  status: 'settled' | 'pending' | 'flagged';
  type: 'inflow' | 'outflow' | 'transfer' | 'fx_swap' | 'upi';
  riskScore: number; // 0 to 100
  flagReason?: string;
  location?: {
    city: string;
    state?: string;
    country: string;
    lat: number;
    lng: number;
  };
  cardLast4?: string;
  referenceId: string;
  upiId?: string;
  rrn?: string;
}

export interface VirtualCard {
  id: string;
  cardholder: string;
  cardName: string;
  pan: string;
  last4: string;
  expiry: string;
  cvv: string;
  brand: 'RuPay Select Metal' | 'Visa Infinite' | 'Mastercard World Elite';
  type: 'virtual' | 'disposable' | 'physical';
  status: 'active' | 'frozen' | 'cancelled';
  spendLimit: number;
  monthlySpent: number;
  colorTheme: 'obsidian' | 'emerald' | 'violet' | 'gold' | 'titanium';
  onlineEnabled: boolean;
  internationalEnabled: boolean;
  contactlessEnabled: boolean;
  ncmcEnabled?: boolean; // National Common Mobility Card for Metro & Tolls
  createdAt: string;
}

export interface LoanPreset {
  id: string;
  title: string;
  maxAmount: number;
  interestRate: number; // APR % p.a.
  termOptions: number[]; // in months
  description: string;
  category: 'Loan Against Securities (LAS)' | 'MSME Growth Facility' | 'Instant GST Invoice Credit';
}

export interface FinAIInsight {
  id: string;
  title: string;
  type: 'opportunity' | 'alert' | 'tax' | 'runway';
  description: string;
  impactValue: string;
  urgency: 'low' | 'medium' | 'high';
  actionPrompt: string;
  actionPayload?: {
    type: 'transfer' | 'card_limit' | 'fx_swap';
    from?: string;
    to?: string;
    amount?: number;
  };
}

export interface Persona {
  id: string;
  name: string;
  role: string;
  company: string;
  avatar: string;
  tier: 'Bharat Private Wealth' | 'Unicorn Founder Treasury' | 'Global NRI Quant';
  accounts: AccountBalance[];
  cibilScore: number;
  monthlyIncome: number;
  monthlyBurn: number;
  panNumber: string;
  city: string;
}

export interface FXRate {
  pair: string;
  from: Currency;
  to: Currency;
  rate: number;
  change24h: number;
  high24h: number;
  low24h: number;
  sparkline: number[];
}
