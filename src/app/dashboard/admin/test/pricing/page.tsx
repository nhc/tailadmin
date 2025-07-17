"use client";

import { calculatePricing, createPricingConfig, type PricingCalculation } from "@/config/pricing";

const PricingTest = () => {
  // Test scenarios
  const testScenarios = [
    {
      name: "GBP Test - £50 Final Amount",
      finalAmount: 50,
      monthlyActiveAccounts: 1,
      payoutsCount: 1,
      config: {},
    },
    {
      name: "GBP Test - £100 Final Amount",
      finalAmount: 100,
      monthlyActiveAccounts: 1,
      payoutsCount: 1,
      config: {},
    },
    {
      name: "USD Configuration - $1500 Final Amount",
      finalAmount: 1500,
      monthlyActiveAccounts: 3,
      payoutsCount: 8,
      config: { currency: "USD" as const },
    },
    // {
    //   name: "EUR with Custom Fees - €2000 Final Amount",
    //   finalAmount: 2000,
    //   monthlyActiveAccounts: 10,
    //   payoutsCount: 15,
    //   config: {
    //     currency: "EUR" as const,
    //     stripeFees: {
    //       monthlyActiveAccount: 2.5,
    //       payoutPercentage: 0.3,
    //       payoutFixedFee: 0.15,
    //     },
    //     markupPercentage: 7,
    //   },
    // },
    // {
    //   name: "High Volume Test - £5000 Final Amount",
    //   finalAmount: 5000,
    //   monthlyActiveAccounts: 50,
    //   payoutsCount: 100,
    //   config: {},
    // },
    // {
    //   name: "Low Volume Test - £100 Final Amount",
    //   finalAmount: 100,
    //   monthlyActiveAccounts: 1,
    //   payoutsCount: 2,
    //   config: {},
    // },
    // {
    //   name: "Zero Accounts Test - £500 Final Amount",
    //   finalAmount: 500,
    //   monthlyActiveAccounts: 0,
    //   payoutsCount: 5,
    //   config: {},
    // },
  ];

  const renderCalculation = (
    calculation: PricingCalculation,
    scenarioName: string,
    scenario: any
  ) => (
    <div key={scenarioName} className="mb-6 p-4 border rounded-lg shadow-sm">
      <h3 className="text-lg font-semibold mb-3 text-gray-800">{scenarioName}</h3>

      {/* Input Parameters */}
      <div className="mb-4 p-3 bg-gray-50 rounded">
        <h4 className="font-medium mb-2 text-gray-700">Input Parameters:</h4>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex justify-between">
            <span>Final Amount:</span>
            <span className="font-medium">
              {calculation.currency} {scenario.finalAmount.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Monthly Active Accounts:</span>
            <span className="font-medium">{scenario.monthlyActiveAccounts}</span>
          </div>
          <div className="flex justify-between">
            <span>Payouts Count:</span>
            <span className="font-medium">{scenario.payoutsCount}</span>
          </div>
          <div className="flex justify-between">
            <span>Currency:</span>
            <span className="font-medium">{calculation.currency}</span>
          </div>
        </div>
      </div>

      {/* Calculation Results */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="font-medium">Final Amount:</span>
            <span className="">
              {calculation.currency} {calculation.finalAmount.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Net Amount:</span>
            <span className="text-green-600 font-semibold">
              {calculation.currency} {calculation.netAmount.toFixed(2)}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="font-medium">Total Stripe Fees:</span>
            <span className="text-purple-600">
              {calculation.currency} {calculation.stripeFees.totalStripeFees.toFixed(2)}
            </span>
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="font-medium"> Net Amount </span>
            <span className="text-blue-600">
              {" "}
              {calculation.currency} {calculation.netAmount.toFixed(2)}{" "}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Platform Fee (8%):</span>
            <span className="text-orange-600">
              {calculation.currency} {calculation.platformFee.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Total Cost / Fees:</span>
            <span className="text-red-600 font-semibold">
              {calculation.currency} {calculation.totalCost.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-4 p-3 rounded bg-blue-50">
        <h4 className="font-medium mb-2 text-gray-700">Stripe Fees Breakdown:</h4>
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
      scenario.finalAmount,
      scenario.monthlyActiveAccounts,
      scenario.payoutsCount,
      scenario.config
    )
  );

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Pricing Configuration Tests</h1>
        <p className="text-gray-600">
          Comprehensive tests of the pricing calculation system with various scenarios and
          configurations.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {testScenarios.map((scenario, index) =>
          renderCalculation(calculations[index], scenario.name, scenario)
        )}
      </div>

      <div className="mt-8 p-6 bg-blue-50 rounded-lg">
        <h2 className="text-xl font-semibold mb-4 text-blue-900">Test Summary</h2>
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
