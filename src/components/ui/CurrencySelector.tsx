import { useStore } from "@/lib/store";
import { CURRENCY_CONFIG, type CurrencyCode } from "@/lib/currency";
import { DollarSign } from "lucide-react";

export function CurrencySelector() {
  const currency = useStore((s) => s.currency) || "EGP";
  const setCurrency = useStore((s) => s.setCurrency);

  return (
    <div className="relative inline-flex items-center">
      <div className="flex items-center gap-1 rounded-xl border border-border/60 bg-secondary/40 px-2.5 py-1.5 text-xs font-bold text-primary hover:bg-secondary transition-colors cursor-pointer">
        <DollarSign className="h-3.5 w-3.5 text-accent" />
        <select
          value={currency}
          onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
          className="appearance-none bg-transparent font-bold pr-3 focus:outline-none cursor-pointer text-xs"
        >
          {(Object.keys(CURRENCY_CONFIG) as CurrencyCode[]).map((code) => (
            <option key={code} value={code} className="bg-card text-primary font-bold">
              {CURRENCY_CONFIG[code].label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
