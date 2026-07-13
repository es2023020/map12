export const fmtEGP = (n: number) => `EGP ${n}M`;
export const fmtPriceRange = (n: number) => `From EGP ${n}M`;
export const titleArea = (slug: string) =>
  slug.split("-").map((s) => s[0].toUpperCase() + s.slice(1)).join(" ");