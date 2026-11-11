const demoTransactions = Object.freeze([
  { id: "demo_txn_001", description: "Example online purchase", amountMinor: 125000, currency: "NGN", status: "demo", createdAt: "2026-11-10T10:15:00.000Z" },
  { id: "demo_txn_002", description: "Example refund", amountMinor: 45000, currency: "NGN", status: "demo", createdAt: "2026-11-09T14:20:00.000Z" },
  { id: "demo_txn_003", description: "Example subscription", amountMinor: 250000, currency: "NGN", status: "demo", createdAt: "2026-11-08T08:00:00.000Z" }
]);

export function getWalletSummary() {
  return {
    product: "Uriesmooth Wallet",
    environment: "DEMO",
    accountStatus: "not_enrolled",
    availableBalance: null,
    currency: "NGN",
    paymentMethods: [],
    capabilities: {
      livePayments: false,
      cardEnrollment: false,
      transfers: false,
      contactless: false
    },
    notice: "Demonstration only. No real account, balance, card, or payment is connected."
  };
}

export function getTransactions() {
  return demoTransactions.map((item) => ({ ...item }));
}
