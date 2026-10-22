/**
 * Utility formatters for Indian Rupee (INR) and Indian financial conventions
 */

export const formatINR = (
  val: number,
  privacyMode = false,
  compact = false
): string => {
  if (privacyMode) return '••••••';

  const isNegative = val < 0;
  const absVal = Math.abs(val);

  if (compact) {
    if (absVal >= 10000000) {
      // 1 Crore = 10,000,000
      const cr = (absVal / 10000000).toFixed(2);
      return `${isNegative ? '-' : ''}₹${cr} Cr`;
    }
    if (absVal >= 100000) {
      // 1 Lakh = 100,000
      const lk = (absVal / 100000).toFixed(2);
      return `${isNegative ? '-' : ''}₹${lk} L`;
    }
  }

  // Full Indian comma standard formatting (e.g. ₹1,45,20,500)
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(val);
};

export const formatINRCurrencyExact = (
  val: number,
  privacyMode = false
): string => {
  if (privacyMode) return '••••••••';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(val);
};
