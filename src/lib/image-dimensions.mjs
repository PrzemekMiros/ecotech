// Intrinsic dimensions of public images used by the page templates.
// Keep these in sync with the files; scripts/check-images.mjs verifies them.
/** @type {Record<string, { width: number; height: number }>} */
export const imageDimensions = {
  '/img/logo/EcoTech_Logo_white.png': { width: 350, height: 53 },
  '/img/main/hala-rury-stalowe-wynajem.jpg': { width: 1024, height: 683 },
  '/img/main/hero-industrial-pipes.jpg': { width: 1080, height: 720 },
  '/img/pipes/Rury-stalowe-bez-szwu.webp': { width: 550, height: 367 },
  '/img/pipes/Rury-stalowe-ze-szwem-spiralnym.webp': { width: 500, height: 334 },
  '/img/pipes/ecotech-group-rury-stalowe-uzywane.webp': { width: 767, height: 511 },
  '/img/pipes/rura-stalowa.jpg': { width: 504, height: 562 },
  '/img/pipes/rury-dwudzielne-na-samochodzie.webp': { width: 1440, height: 1080 },
  '/img/pipes/rury-stalowe-dwudzielne.jpg': { width: 504, height: 562 },
  '/img/pipes/rury-stalowe-w-izolacji.webp': { width: 1620, height: 1080 },
  '/img/pipes/rury-stalowe-zwijane-z-blachy.webp': { width: 510, height: 340 },
  '/img/posts/2022/06/Rozparcia-do-scian-szczelinowych-compress.jpg': { width: 1019, height: 720 },
  '/img/posts/2022/06/ecotech-group-rury-stalowe-ze-szwem-wzdluznym_1.jpg': { width: 767, height: 511 },
  '/img/posts/2022/06/plozy-dystansowe-compress.jpg': { width: 1280, height: 720 },
  '/img/posts/2022/12/eco-tech-izolowanie-rur-compress.jpeg': { width: 1080, height: 720 },
  '/img/posts/2022/12/eco-tech-kolana-segmentowe-compress.jpg': { width: 1280, height: 427 },
  '/img/posts/2022/12/eco-tech-kolnierze-rurowe-compress.jpg': { width: 1280, height: 427 },
  '/img/posts/2022/12/eco-tech-kominy-przemyslowe-compress.jpg': { width: 1280, height: 427 },
  '/img/posts/2022/12/eco-tech-laminowanie-compress.webp': { width: 840, height: 480 },
  '/img/posts/2022/12/eco-tech-malowanie-rur.jpeg': { width: 840, height: 480 },
  '/img/posts/2022/12/eco-tech-paloscianki-compress.jpg': { width: 1280, height: 427 },
  '/img/posts/2022/12/eco-tech-podpory-mostowe-compress.jpg': { width: 1280, height: 427 },
  '/img/posts/2022/12/eco-tech-skup-rur-compress.webp': { width: 767, height: 511 },
  '/img/posts/2022/12/eco-tech-zbiorniki-stalowe-compress.jpg': { width: 1280, height: 427 },
  '/img/posts/2022/12/ecotech-walcowanie-blach-1-compress.jpg': { width: 1280, height: 427 },
  '/img/posts/2022/12/montaz-rur-stalowych-dwudzielnych-compress.jpeg': { width: 1280, height: 671 },
  '/img/posts/2022/12/spawanie-konstrukcji-compress.jpeg': { width: 1078, height: 720 }
};

/** @param {string} src */
export function getImageDimensions(src) {
  const dimensions = imageDimensions[src];
  if (dimensions) return dimensions;
  // The Sanity loader returns the original asset URL (without transformations).
  // https://www.sanity.io/docs/content-lake/image-urls
  const sanity = src.match(/^https:\/\/cdn\.sanity\.io\/images\/[^/]+\/[^/]+\/[^/]+-([1-9]\d*)x([1-9]\d*)\.[a-z0-9]+$/i);
  if (sanity) return { width: Number(sanity[1]), height: Number(sanity[2]) };
  throw new Error(`Missing image dimensions for ${src}. Add the intrinsic size to src/lib/image-dimensions.mjs.`);
}
