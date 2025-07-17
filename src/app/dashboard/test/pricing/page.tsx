"use client";

import { calculatePricing, createPricingConfig, type PricingCalculation } from "@/config/pricing";

const PricingTest = () => {
  // Test scenarios
  const testScenarios = [
    {
      name: "Basic GBP Test",
      amount: 1000,
      monthlyActiveAccounts: 5,
      payoutsCount: 10,
      config: {},
    },
    {
      name: "USD Configuration",
      amount: 1500,
      monthlyActiveAccounts: 3,
      payoutsCount: 8,
      config: { currency: "USD" as const },
    },
    {
      name: "EUR with Custom Fees",
      amount: 2000,
      monthlyActiveAccounts: 10,
      payoutsCount: 15,
      config: {
        currency: "EUR" as const,
        stripeFees: {
          monthlyActiveAccount: 2.5,
          payoutPercentage: 0.3,
          payoutFixedFee: 0.15,
        },
        markupPercentage: 7,
      },
    },
    {
      name: "High Volume Test",
      amount: 5000,
      monthlyActiveAccounts: 50,
      payoutsCount: 100,
      config: {},
    },
    {
      name: "Low Volume Test",
      amount: 100,
      monthlyActiveAccounts: 1,
      payoutsCount: 2,
      config: {},
    },
    {
      name: "Zero Accounts Test",
      amount: 500,
      monthlyActiveAccounts: 0,
      payoutsCount: 5,
      config: {},
    },
  ];

  const renderCalculation = (calculation: PricingCalculation, scenarioName: string) => (
    <div key={scenarioName} className="mb-6 p-4 border rounded-lg bg-white shadow-sm">
      <h3 className="text-lg font-semibold mb-3">{scenarioName}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="font-medium">Base Amount:</span>
            <span>
              {calculation.currency} {calculation.amount.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Currency:</span>
            <span>{calculation.currency}</span>
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="font-medium">Total Cost:</span>
            <span className="font-semibold">
              {calculation.currency} {calculation.totalCost.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Markup:</span>
            <span>
              {calculation.currency} {calculation.markup.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-4 p-3 bg-gray-50 rounded">
        <h4 className="font-medium mb-2">Stripe Fees Breakdown:</h4>
        <div className="space-y-1 text-sm">
          <div className="flex justify-between">
            <span>Monthly Active Account Fees:</span>
            <span>
              {calculation.currency} {calculation.stripeFees.monthlyActiveAccount.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Payout Fees:</span>
            <span>
              {calculation.currency} {calculation.stripeFees.payoutFee.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between font-medium border-t pt-1">
            <span>Total Stripe Fees:</span>
            <span>
              {calculation.currency} {calculation.stripeFees.totalStripeFees.toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  const calculations = testScenarios.map((scenario) =>
    calculatePricing(
      scenario.amount,
      scenario.monthlyActiveAccounts,
      scenario.payoutsCount,
      scenario.config
    )
  );

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Pricing Configuration Tests</h1>
        <p>
          Comprehensive tests of the pricing calculation system with various scenarios and
          configurations.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {testScenarios.map((scenario, index) =>
          renderCalculation(calculations[index], scenario.name)
        )}
      </div>

      <div className="mt-8 p-6 bg-gray-50 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Test Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <span className="font-medium">Total Tests:</span> {testScenarios.length}
          </div>
          <div>
            <span className="font-medium">Currencies Tested:</span> GBP, USD, EUR
          </div>
          <div>
            <span className="font-medium">Configurations:</span> Default, Custom Fees, Custom Markup
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingTest;
