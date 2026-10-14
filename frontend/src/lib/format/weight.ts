import { toNumber, type Decimal } from "./number";

const kilograms = new Intl.NumberFormat("en-PK", { maximumFractionDigits: 2 });

export function formatKilograms(value: Decimal): string {
  return kilograms.format(toNumber(value));
}

export function formatWeight(value: Decimal): string {
  return `${formatKilograms(value)} kg`;
}
