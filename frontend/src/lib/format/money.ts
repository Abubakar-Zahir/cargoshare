import { toNumber, type Decimal } from "./number";

const whole = new Intl.NumberFormat("en-PK", { maximumFractionDigits: 0 });
const fractional = new Intl.NumberFormat("en-PK", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function formatAmount(value: Decimal): string {
  const cents = Math.round(toNumber(value) * 100);
  const formatter = cents % 100 === 0 ? whole : fractional;
  return formatter.format(cents / 100);
}

export function formatMoney(value: Decimal): string {
  return `Rs ${formatAmount(value)}`;
}
