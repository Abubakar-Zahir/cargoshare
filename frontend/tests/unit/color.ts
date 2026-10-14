export interface Oklch {
  l: number;
  c: number;
  h: number;
  alpha: number;
}

export type Rgb = [number, number, number];

const OKLCH =
  /^oklch\(\s*([\d.]+)\s+([\d.]+)\s+([\d.]+)\s*(?:\/\s*([\d.]+))?\s*\)$/;

export function parseOklch(value: string): Oklch {
  const match = OKLCH.exec(value.trim());
  if (match === null) {
    throw new Error(`Not an oklch() color: ${value}`);
  }
  const [, l = "", c = "", h = "", alpha = "1"] = match;
  return { l: Number(l), c: Number(c), h: Number(h), alpha: Number(alpha) };
}

function clamp(value: number): number {
  return Math.min(1, Math.max(0, value));
}

export function toLinearRgb({ l, c, h }: Oklch): Rgb {
  const a = c * Math.cos((h * Math.PI) / 180);
  const b = c * Math.sin((h * Math.PI) / 180);
  const lc = (l + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const mc = (l - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const sc = (l - 0.0894841775 * a - 1.291485548 * b) ** 3;
  return [
    clamp(4.0767416621 * lc - 3.3077115913 * mc + 0.2309699292 * sc),
    clamp(-1.2684380046 * lc + 2.6097574011 * mc - 0.3413193965 * sc),
    clamp(-0.0041960863 * lc - 0.7034186147 * mc + 1.707614701 * sc),
  ];
}

export function luminance([r, g, b]: Rgb): number {
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function contrast(a: Rgb, b: Rgb): number {
  const la = luminance(a);
  const lb = luminance(b);
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
}
