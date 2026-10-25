import { a as createComponent, r as renderComponent, b as renderTemplate, m as maybeRenderHead, d as addAttribute } from '../chunks/astro/server_Bi_ABpQi.mjs';
import 'piccolore';
import { g as getCollection } from '../chunks/_astro_content_DkalvaRB.mjs';
import { $ as $$BaseLayout } from '../chunks/BaseLayout_DhdkqCFE.mjs';
import { $ as $$PageHero } from '../chunks/PageHero_CxXCUmZc.mjs';
export { renderers } from '../renderers.mjs';

const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const categories = (await getCollection("steelPipeCategories")).sort((a, b) => a.data.order - b.data.order);
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": "Rury stalowe | Eco Tech Group", "description": "Katalog rur stalowych: rury ze szwem, bez szwu, izolowane, dwudzielne i u\u017Cywane." }, { "default": async ($$result2) => renderTemplate` ${renderComponent($$result2, "PageHero", $$PageHero, { "title": "Rury stalowe" })} ${maybeRenderHead()}<section class="mx-auto max-w-7xl px-5 py-16 md:px-8 md:py-24"> <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3"> ${categories.map((category, index) => renderTemplate`<a${addAttribute(`/rury-stalowe-${category.data.slug}`, "href")} class="group overflow-hidden border border-accent-1/15 bg-white transition-colors hover:border-accent-1"> <div class="relative aspect-[16/9] overflow-hidden bg-mist"> ${category.data.image ? renderTemplate`<img${addAttribute(category.data.image, "src")}${addAttribute(category.data.imageAlt ?? category.data.title, "alt")} class="h-full w-full object-cover transition duration-500 group-hover:scale-105">` : renderTemplate`<div class="h-full w-full bg-[linear-gradient(135deg,rgba(29,65,142,0.18),transparent_65%)]"></div>`} <p class="absolute left-6 top-6 text-xs font-bold tracking-[0.15em] text-accent-1">${String(index + 1).padStart(2, "0")}</p> </div> <div class="flex min-h-52 flex-col justify-between p-6"> <div> <h2 class="text-xl font-semibold tracking-[-0.04em]">${category.data.title}</h2> <p class="mt-3 text-sm leading-6 text-ink/65">${category.data.description}</p> </div> <span class="mt-7 text-sm font-semibold text-accent-1 group-hover:text-accent-1/75">Zobacz produkty <span aria-hidden="true">→</span></span> </div> </a>`)} </div> </section> ` })}`;
}, "F:/Strony/Strony W toku/ecotech-astro/src/pages/rury-stalowe/index.astro", void 0);

const $$file = "F:/Strony/Strony W toku/ecotech-astro/src/pages/rury-stalowe/index.astro";
const $$url = "/rury-stalowe";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
