import { a as createComponent, r as renderComponent, b as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_Bi_ABpQi.mjs';
import 'piccolore';
import { $ as $$BaseLayout } from '../chunks/BaseLayout_DhdkqCFE.mjs';
import { $ as $$PageHero } from '../chunks/PageHero_CxXCUmZc.mjs';
export { renderers } from '../renderers.mjs';

const $$ONas = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": "O nas | Eco Tech Group" }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "PageHero", $$PageHero, { "title": "O nas" })} ${maybeRenderHead()}<section class="mx-auto max-w-7xl px-5 py-20 md:px-8 md:py-28"></section> ` })}`;
}, "F:/Strony/Strony W toku/ecotech-astro/src/pages/o-nas.astro", void 0);

const $$file = "F:/Strony/Strony W toku/ecotech-astro/src/pages/o-nas.astro";
const $$url = "/o-nas";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$ONas,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
