/**
 * Provider boundary. Implementations must be supplied only after vendor,
 * legal, security, and certification approval. Raw card data must never pass
 * through this application.
 */
export function createPaymentProvider() {
  return Object.freeze({
    isConfigured: false,
    async createPaymentMethod() {
      const error = new Error("A licensed and approved tokenization provider is not configured.");
      error.code = "PROVIDER_NOT_CONFIGURED";
      throw error;
    }
  });
}
