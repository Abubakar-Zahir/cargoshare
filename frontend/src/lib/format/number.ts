export type Decimal = number | string;

export function toNumber(value: Decimal): number {
  const parsed = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(parsed)) {
    throw new RangeError(`Not a finite number: ${String(value)}`);
  }
  return parsed;
}
