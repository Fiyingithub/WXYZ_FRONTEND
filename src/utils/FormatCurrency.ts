import type { SupportedCurrency } from "../Types/Payment";

const LOCALE_BY_CURRENCY: Record<SupportedCurrency, string> = {
  NGN: "en-NG",
  GHS: "en-GH",
  KES: "en-KE",
  ZAR: "en-ZA",
  USD: "en-US",
  GBP: "en-GB",
};

export function formatCurrency(amount: number, currency: SupportedCurrency): string {
  return new Intl.NumberFormat(LOCALE_BY_CURRENCY[currency] ?? "en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(amount);
}

/** Stripe and Paystack expect the smallest currency unit (cents/kobo). */
export function toMinorUnit(amount: number): number {
  return Math.round(amount * 100);
}