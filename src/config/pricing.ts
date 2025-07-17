type Currency = "GBP" | "USD" | "EUR";

type PricingConfig = {
  currency: Currency;
  stripeFees: {
    monthlyActiveAccount: number;
    payoutPercentage: number;
    payoutFixedFee: number;
  };
  platformFeePercentage: number;
};

type PricingCalculation = {
  amount: number;
  netAmount: number;
  currency: Currency;
  stripeFees: {
    monthlyActiveAccount: number;
    payoutFee: number;
    totalStripeFees: number;
  };
  platformFee: number;
  totalCost: number;
};

const getCurrencyConfig = (currency: Currency): PricingConfig => {
  const baseConfig = {
    stripeFees: {
      monthlyActiveAccount: 2.0,
      payoutPercentage: 0.25,
      payoutFixedFee: 10, // 10p in smallest currency unit
    },
    platformFeePercentage: 8,
  };

  switch (currency) {
    case "GBP":
      return {
        currency: "GBP",
        ...baseConfig,
        stripeFees: {
          ...baseConfig.stripeFees,
          payoutFixedFee: 10, // 10p
        },
      };
    case "USD":
      return {
        currency: "USD",
        ...baseConfig,
        stripeFees: {
          ...baseConfig.stripeFees,
          payoutFixedFee: 10, // 10c
        },
      };
    case "EUR":
      return {
        currency: "EUR",
        ...baseConfig,
        stripeFees: {
          ...baseConfig.stripeFees,
          payoutFixedFee: 10, // 10 cents
        },
      };
  }
};

export const calculatePricing = (
  finalAmount: number, // always in the smallest currency unit so £1 = 100
  config: Partial<PricingConfig> = {}
): PricingCalculation => {
  const currency = config.currency || "GBP";
  const currencyConfig = getCurrencyConfig(currency);
  const finalConfig = { ...currencyConfig, ...config };
  const monthlyActiveAccounts = 1;
  const payoutsCount = 1;

  // Convert config values from major currency units to smallest currency units
  const monthlyActiveAccountFeeInSmallestUnit = finalConfig.stripeFees.monthlyActiveAccount * 100;

  // Calculate Stripe fees (all in smallest currency units)
  const monthlyActiveAccountFees = monthlyActiveAccounts * monthlyActiveAccountFeeInSmallestUnit;
  const payoutFees =
    finalAmount * (finalConfig.stripeFees.payoutPercentage / 100) +
    payoutsCount * finalConfig.stripeFees.payoutFixedFee;
  const totalStripeFees = monthlyActiveAccountFees + payoutFees;

  // Calculate platform fee (8% of final amount)
  const platformFee = finalAmount * (finalConfig.platformFeePercentage / 100);

  // Calculate total cost (stripe fees + platform fee)
  const totalCost = totalStripeFees + platformFee;

  // Calculate net amount (final amount minus total cost)
  const netAmount = finalAmount - totalCost;

  return {
    amount: finalAmount,
    currency: finalConfig.currency,
    stripeFees: {
      monthlyActiveAccount: Math.round(monthlyActiveAccountFees),
      payoutFee: Math.round(payoutFees),
      totalStripeFees: Math.round(totalStripeFees),
    },
    platformFee: Math.round(platformFee),
    totalCost: Math.round(totalCost),
    netAmount: Math.round(netAmount),
  };
};

export const createPricingConfig = (config: Partial<PricingConfig>): PricingConfig => {
  const currency = config.currency || "GBP";
  const currencyConfig = getCurrencyConfig(currency);
  return { ...currencyConfig, ...config };
};

export type { PricingConfig, PricingCalculation, Currency };

/*

// Basic usage with default GBP config (amounts in smallest currency unit)
const result = calculatePricing(12500, 5, 10); // 12500 = £125.00
// Returns net amount after deducting Stripe fees for 5 monthly active accounts and 10 payouts

// Custom currency
const usdResult = calculatePricing(15000, 5, 10, { currency: 'USD' }); // 15000 = $150.00

// Custom pricing config
const customConfig = createPricingConfig({
  currency: 'EUR',
  stripeFees: {
    monthlyActiveAccount: 2.50,
    payoutPercentage: 0.3,
    payoutFixedFee: 0.15,
  },
  markupPercentage: 7,
});
const customResult = calculatePricing(20000, 5, 10, customConfig); // 20000 = €200.00

*/
