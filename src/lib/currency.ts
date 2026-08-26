export type CurrencyCode = "EGP" | "USD" | "SAR" | "AED";

export const CURRENCY_CONFIG: Record<
  CurrencyCode,
  { code: CurrencyCode; label: string; symbol: string; rateFromEgp: number }
> = {
  EGP: { code: "EGP", label: "EGP (L.E)", symbol: "EGP ", rateFromEgp: 1 },
  USD: { code: "USD", label: "USD ($)", symbol: "$", rateFromEgp: 1 / 50.0 },
  SAR: { code: "SAR", label: "SAR (SR)", symbol: "SR ", rateFromEgp: 1 / 13.3 },
  AED: { code: "AED", label: "AED (Dhs)", symbol: "AED ", rateFromEgp: 1 / 13.6 },
};

export function formatCurrency(
  priceEgpM: number,
  currencyCode: CurrencyCode = "EGP"
): string {
  const config = CURRENCY_CONFIG[currencyCode] || CURRENCY_CONFIG.EGP;
  if (!priceEgpM || priceEgpM <= 0) return "Price on Request";

  const convertedMillions = priceEgpM * config.rateFromEgp;

  if (currencyCode === "EGP") {
    return `EGP ${priceEgpM.toFixed(priceEgpM >= 100 ? 1 : 2)}M`;
  }

  if (currencyCode === "USD") {
    if (convertedMillions >= 1) {
      return `$${convertedMillions.toFixed(2)}M`;
    }
    const valK = convertedMillions * 1000;
    return `$${Math.round(valK)}K`;
  }

  if (convertedMillions >= 1) {
    return `${config.symbol}${convertedMillions.toFixed(2)}M`;
  }
  const valK = convertedMillions * 1000;
  return `${config.symbol}${Math.round(valK)}K`;
}

export function formatExactPrice(
  priceEgp: number,
  currencyCode: CurrencyCode = "EGP"
): string {
  const config = CURRENCY_CONFIG[currencyCode] || CURRENCY_CONFIG.EGP;
  if (!priceEgp || priceEgp <= 0) return "Price on Request";

  const converted = priceEgp * config.rateFromEgp;
  if (currencyCode === "EGP") {
    return `EGP ${Math.round(converted).toLocaleString()}`;
  }
  if (currencyCode === "USD") {
    return `$${Math.round(converted).toLocaleString()}`;
  }
  return `${config.symbol}${Math.round(converted).toLocaleString()}`;
}
