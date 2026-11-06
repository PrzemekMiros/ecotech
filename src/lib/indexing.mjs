/** @param {string} pathname */
export const isExcludedFromIndexing = (pathname) =>
  /^\/(?:aktualnosci\/)?wigilia-firmowa-(?:2023|2024|2025)\/?$/.test(pathname);
