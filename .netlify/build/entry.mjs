import { renderers } from './renderers.mjs';
import { s as serverEntrypointModule } from './chunks/_@astrojs-ssr-adapter_CvSoi7hX.mjs';
import { manifest } from './manifest_B7OyzRc9.mjs';
import { createExports } from '@astrojs/netlify/ssr-function.js';

const serverIslandMap = new Map();;

const _page0 = () => import('./pages/_image.astro.mjs');
const _page1 = () => import('./pages/404.astro.mjs');
const _page2 = () => import('./pages/503.astro.mjs');
const _page3 = () => import('./pages/aktualnosci/_slug_.astro.mjs');
const _page4 = () => import('./pages/aktualnosci.astro.mjs');
const _page5 = () => import('./pages/api/firmao-lead.astro.mjs');
const _page6 = () => import('./pages/do-pobrania.astro.mjs');
const _page7 = () => import('./pages/dostawa-rur-stalowych/_slug_.astro.mjs');
const _page8 = () => import('./pages/dostawa-rur-stalowych.astro.mjs');
const _page9 = () => import('./pages/kalkulator-wagi-rur-stalowych.astro.mjs');
const _page10 = () => import('./pages/kontakt.astro.mjs');
const _page11 = () => import('./pages/o-nas.astro.mjs');
const _page12 = () => import('./pages/oferta.astro.mjs');
const _page13 = () => import('./pages/polityka-prywatnosci.astro.mjs');
const _page14 = () => import('./pages/praca/_slug_.astro.mjs');
const _page15 = () => import('./pages/praca.astro.mjs');
const _page16 = () => import('./pages/produkcja/_slug_.astro.mjs');
const _page17 = () => import('./pages/produkcja.astro.mjs');
const _page18 = () => import('./pages/rury-stalowe/_category_/_slug_.astro.mjs');
const _page19 = () => import('./pages/rury-stalowe.astro.mjs');
const _page20 = () => import('./pages/uslugi/_slug_.astro.mjs');
const _page21 = () => import('./pages/uslugi.astro.mjs');
const _page22 = () => import('./pages/rury-stalowe-_category_.astro.mjs');
const _page23 = () => import('./pages/index.astro.mjs');
const pageMap = new Map([
    ["node_modules/astro/dist/assets/endpoint/generic.js", _page0],
    ["src/pages/404.astro", _page1],
    ["src/pages/503.astro", _page2],
    ["src/pages/aktualnosci/[slug].astro", _page3],
    ["src/pages/aktualnosci/index.astro", _page4],
    ["src/pages/api/firmao-lead.ts", _page5],
    ["src/pages/do-pobrania.astro", _page6],
    ["src/pages/dostawa-rur-stalowych/[slug].astro", _page7],
    ["src/pages/dostawa-rur-stalowych/index.astro", _page8],
    ["src/pages/kalkulator-wagi-rur-stalowych.astro", _page9],
    ["src/pages/kontakt.astro", _page10],
    ["src/pages/o-nas.astro", _page11],
    ["src/pages/oferta.astro", _page12],
    ["src/pages/polityka-prywatnosci.astro", _page13],
    ["src/pages/praca/[slug].astro", _page14],
    ["src/pages/praca/index.astro", _page15],
    ["src/pages/produkcja/[slug].astro", _page16],
    ["src/pages/produkcja/index.astro", _page17],
    ["src/pages/rury-stalowe/[category]/[slug].astro", _page18],
    ["src/pages/rury-stalowe/index.astro", _page19],
    ["src/pages/uslugi/[slug].astro", _page20],
    ["src/pages/uslugi/index.astro", _page21],
    ["src/pages/rury-stalowe-[category].astro", _page22],
    ["src/pages/index.astro", _page23]
]);

const _manifest = Object.assign(manifest, {
    pageMap,
    serverIslandMap,
    renderers,
    actions: () => import('./noop-entrypoint.mjs'),
    middleware: () => import('./_astro-internal_middleware.mjs')
});
const _args = {
    "middlewareSecret": "1c132426-b1af-4f9e-81b3-5df9aba17372"
};
const _exports = createExports(_manifest, _args);
const __astrojsSsrVirtualEntry = _exports.default;
const _start = 'start';
if (Object.prototype.hasOwnProperty.call(serverEntrypointModule, _start)) {
	serverEntrypointModule[_start](_manifest, _args);
}

export { __astrojsSsrVirtualEntry as default, pageMap };
