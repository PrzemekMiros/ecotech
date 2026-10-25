import { a as createComponent, r as renderComponent, b as renderTemplate, m as maybeRenderHead, d as addAttribute } from '../chunks/astro/server_Bi_ABpQi.mjs';
import 'piccolore';
import { g as getCollection } from '../chunks/_astro_content_DkalvaRB.mjs';
import { $ as $$BaseLayout } from '../chunks/BaseLayout_DhdkqCFE.mjs';
import { $ as $$PageHero } from '../chunks/PageHero_CxXCUmZc.mjs';
export { renderers } from '../renderers.mjs';

const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const productionItems = (await getCollection("production")).sort((a, b) => a.data.order - b.data.order);
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": "Produkcja | Eco Tech Group", "description": "Produkcja element\xF3w i konstrukcji stalowych na potrzeby inwestycji przemys\u0142owych oraz infrastrukturalnych." }, { "default": async ($$result2) => renderTemplate` ${renderComponent($$result2, "PageHero", $$PageHero, { "title": "Produkcja" })} ${maybeRenderHead()}<section class="mx-auto max-w-7xl px-5 py-16 md:px-8 md:py-24"> <div class="grid gap-4 md:grid-cols-2"> ${productionItems.map((item, index) => renderTemplate`<a${addAttribute(`/produkcja/${item.data.slug}`, "href")} class="group flex min-h-64 flex-col overflow-hidden border border-accent-1/15 bg-white transition-colors hover:border-accent-1 hover:bg-mist"> ${item.data.image && renderTemplate`<img${addAttribute(item.data.image, "src")}${addAttribute(item.data.imageAlt ?? item.data.title, "alt")} class="aspect-[16/8.5] w-full object-cover transition duration-500 group-hover:scale-[1.03]" loading="lazy">`} <div class="flex flex-1 flex-col justify-between p-6"> <div> <p class="text-xs font-bold tracking-[0.15em] text-sun">${String(index + 1).padStart(2, "0")}</p> <h2 class="mt-5 text-2xl font-semibold tracking-[-0.04em]">${item.data.title}</h2> <p class="mt-3 max-w-xl text-sm leading-6 text-ink/65">${item.data.description}</p> </div> <span class="mt-7 text-sm font-semibold text-accent-1 group-hover:text-accent-1/75">Poznaj zakres produkcji <span aria-hidden="true">→</span></span> </div> </a>`)} </div> </section> ` })}`;
}, "F:/Strony/Strony W toku/ecotech-astro/src/pages/produkcja/index.astro", void 0);

const $$file = "F:/Strony/Strony W toku/ecotech-astro/src/pages/produkcja/index.astro";
const $$url = "/produkcja";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
