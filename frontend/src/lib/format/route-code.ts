const knownCodes: Readonly<Record<string, string>> = {
  abbottabad: "AAW",
  bahawalpur: "BHV",
  "dera ghazi khan": "DEA",
  "dera ismail khan": "DSK",
  faisalabad: "LYP",
  gilgit: "GIL",
  gujranwala: "GRW",
  gwadar: "GWD",
  hyderabad: "HDD",
  islamabad: "ISB",
  karachi: "KHI",
  lahore: "LHE",
  larkana: "LRG",
  multan: "MUX",
  muzaffarabad: "MFG",
  peshawar: "PEW",
  quetta: "UET",
  rawalpindi: "RWP",
  "rahim yar khan": "RYK",
  sargodha: "SGI",
  sialkot: "SKT",
  skardu: "KDU",
  sukkur: "SKZ",
  turbat: "TUK",
};

export function normalizeCity(name: string): string {
  return name
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function cityCode(name: string): string {
  const normalized = normalizeCity(name);
  const known = knownCodes[normalized];
  if (known !== undefined) {
    return known;
  }
  const letters = normalized.replace(/\s/g, "").toUpperCase();
  return letters.length >= 3 ? letters.slice(0, 3) : letters.padEnd(3, "X");
}
