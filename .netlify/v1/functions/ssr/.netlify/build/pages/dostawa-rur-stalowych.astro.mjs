import { a as createComponent, r as renderComponent, b as renderTemplate, m as maybeRenderHead, d as addAttribute } from '../chunks/astro/server_Bi_ABpQi.mjs';
import 'piccolore';
import { g as getCollection } from '../chunks/_astro_content_DkalvaRB.mjs';
import { $ as $$BaseLayout } from '../chunks/BaseLayout_DhdkqCFE.mjs';
import { $ as $$PageHero } from '../chunks/PageHero_CxXCUmZc.mjs';
export { renderers } from '../renderers.mjs';

const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const deliveries = (await getCollection("delivery")).sort((a, b) => a.data.order - b.data.order);
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": "Dostawa rur stalowych | Eco Tech Group", "description": "Dostawa rur stalowych do miast w ca\u0142ej Polsce." }, { "default": async ($$result2) => renderTemplate` ${renderComponent($$result2, "PageHero", $$PageHero, { "title": "Dostawa rur stalowych" })} ${maybeRenderHead()}<section class="mx-auto max-w-7xl px-5 py-16 md:px-8 md:py-24"> <div class="max-w-2xl"> <p class="eyebrow">Dostawa w całej Polsce</p> <h2 class="mt-3 text-2xl font-semibold tracking-[-0.04em] md:text-3xl">Rury stalowe z dostawą do Twojego miasta</h2> <p class="mt-5 text-ink/70">Wybierz miasto, aby przejść do informacji o dostawie rur stalowych.</p> </div> <div class="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"> ${deliveries.map((delivery, index) => renderTemplate`<a${addAttribute(`/dostawa-rur-stalowych/${delivery.data.slug}`, "href")} class="group flex min-h-52 flex-col justify-between border border-accent-1/15 bg-white p-6 transition-colors hover:border-accent-1 hover:bg-mist"> <div> <p class="text-xs font-bold tracking-[0.15em] text-sun">${String(index + 1).padStart(2, "0")}</p> <h2 class="mt-8 text-2xl font-semibold tracking-[-0.04em]">${delivery.data.city}</h2> <p class="mt-3 text-sm leading-6 text-ink/65">Dostawa rur stalowych do miasta ${delivery.data.city} i okolic.</p> </div> <span class="mt-7 text-sm font-semibold text-accent-1 group-hover:text-accent-1/75">Sprawdź dostawę <span aria-hidden="true">→</span></span> </a>`)} </div> </section> ` })}`;
}, "F:/Strony/Strony W toku/ecotech-astro/src/pages/dostawa-rur-stalowych/index.astro", void 0);

const $$file = "F:/Strony/Strony W toku/ecotech-astro/src/pages/dostawa-rur-stalowych/index.astro";
const $$url = "/dostawa-rur-stalowych";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
