const container = document.querySelector("#transactions");
const formatMoney = (minor, currency) => new Intl.NumberFormat("en-NG", { style: "currency", currency }).format(minor / 100);
const formatDate = (value) => new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(new Date(value));

async function loadTransactions() {
  try {
    const response = await fetch("/api/v1/transactions", { headers: { accept: "application/json" } });
    if (!response.ok) throw new Error("Unable to load sample activity");
    const payload = await response.json();
    container.replaceChildren();
    for (const item of payload.items) {
      const row = document.createElement("div");
      row.className = "transaction";
      const details = document.createElement("div");
      const title = document.createElement("strong");
      title.textContent = item.description;
      const date = document.createElement("small");
      date.textContent = formatDate(item.createdAt) + " · Demonstration";
      details.append(title, date);
      const amount = document.createElement("span");
      amount.className = "amount";
      amount.textContent = formatMoney(item.amountMinor, item.currency);
      row.append(details, amount);
      container.append(row);
    }
  } catch {
    container.textContent = "Sample activity is currently unavailable.";
  }
}
loadTransactions();
