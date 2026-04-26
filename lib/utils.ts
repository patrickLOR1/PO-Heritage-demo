import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(
  amount: number,
  currency: string = "MXN",
  symbol: string = "$"
): string {
  return `${symbol}${amount.toLocaleString("es-MX")} ${currency}`;
}
