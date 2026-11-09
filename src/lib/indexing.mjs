// Explicit editorial exclusions; technical articles also use the Aktualności category.
export const excludedArticleSlugs = new Set([
  "certyfikat-iso-dla-naszego-systemu-zarzadzania-jakoscia",
  "gosia-prus-na-rajdzie-barborka-2025",
  "gosia-prus-na-rajdzie-barborka",
  "podnoszenie-kompetencji-naszego-zespolu-zaswiadczenia-z-kursow",
  "wigilia-firmowa-2023",
  "wigilia-firmowa-2024",
  "wigilia-firmowa-2025",
  "wspieramy-sport-eco-tech-w-rajdzie-barborka",
  "wspieramy-sport-kolejna-wygrana-patryka-mielniczuka"
]);

/** @param {string} pathname */
export const isExcludedFromIndexing = (pathname) => {
  const slug = pathname.replace(/^\/(?:aktualnosci\/)?/, '').replace(/\/$/, '');
  return excludedArticleSlugs.has(slug);
};
