export type Currency = 'USD' | 'EUR' | 'GBP' | 'JPY' | 'CHF' | 'SGD' | 'BTC' | 'ETH';

export interface AccountBalance {
  id: string;
  name: string;
  type: 'checking' | 'savings' | 'investment' | 'crypto_vault' | 'tax_reserve';
  currency: Currency;
  balance: number;
  apy?: number;
  accountNumber: string;
  routingNumber?: string;
  iban?: string;
  change24h: number;
  color: string;
}

export type TransactionCategory =
  | 'Cloud & Tech'
  | 'Payroll & Operations'
  | 'Dividends & Staking'
  | 'Travel & Logistics'
  | 'Investment & Yield'
  | 'Dining & Luxury'
  | 'FX Swap'
  | 'Internal Transfer';

export interface Transaction {
  id: string;
  title: string;
  merchant: string;
  category: TransactionCategory;
  amount: number;
  currency: Currency;
  timestamp: string;
  status: 'settled' | 'pending' | 'flagged';
  type: 'inflow' | 'outflow' | 'transfer' | 'fx_swap';
  riskScore: number; // 0 to 100
  flagReason?: string;
  location?: {
    city: string;
    country: string;
    lat: number;
    lng: number;
  };
  cardLast4?: string;
  referenceId: string;
}

export interface VirtualCard {
  id: string;
  cardholder: string;
  cardName: string;
  pan: string;
  last4: string;
  expiry: string;
  cvv: string;
  brand: 'Visa Infinite' | 'Mastercard World Elite';
  type: 'virtual' | 'disposable' | 'physical';
  status: 'active' | 'frozen' | 'cancelled';
  spendLimit: number;
  monthlySpent: number;
  colorTheme: 'obsidian' | 'emerald' | 'violet' | 'gold' | 'titanium';
  onlineEnabled: boolean;
  internationalEnabled: boolean;
  contactlessEnabled: boolean;
  createdAt: string;
}

export interface LoanPreset {
  id: string;
  title: string;
  maxAmount: number;
  interestRate: number; // APR %
  termOptions: number[]; // in months
  description: string;
  category: 'Lombard Vault Credit' | 'SME Growth Facility' | 'Instant Working Capital';
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
  tier: 'Diamond Private Client' | 'Enterprise Prime' | 'Quantitative Pro';
  accounts: AccountBalance[];
  creditScore: number;
  monthlyIncome: number;
  monthlyBurn: number;
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
