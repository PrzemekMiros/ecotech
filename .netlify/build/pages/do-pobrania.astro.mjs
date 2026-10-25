import { a as createComponent, r as renderComponent, b as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_Bi_ABpQi.mjs';
import 'piccolore';
import { $ as $$BaseLayout } from '../chunks/BaseLayout_DhdkqCFE.mjs';
import { $ as $$PageHero } from '../chunks/PageHero_CxXCUmZc.mjs';
export { renderers } from '../renderers.mjs';

const $$DoPobrania = createComponent(($$result, $$props, $$slots) => {
  const sections = [
    ["Katalogi produkt\xF3w", "Materia\u0142y dotycz\u0105ce oferty rur stalowych, produkcji i us\u0142ug."],
    ["Dokumenty techniczne", "Karty techniczne, deklaracje oraz dokumentacja produktowa."],
    ["Certyfikaty", "Dokumenty potwierdzaj\u0105ce standardy jako\u015Bci i zgodno\u015B\u0107 materia\u0142\xF3w."],
    ["Formularze", "Dokumenty pomocne przy sk\u0142adaniu zapyta\u0144 i realizacji zam\xF3wie\u0144."]
  ];
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": "Do pobrania | Eco Tech Group", "description": "Dokumenty, katalogi i materia\u0142y techniczne Eco Tech Group." }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "PageHero", $$PageHero, { "title": "Do pobrania" })} ${maybeRenderHead()}<section class="mx-auto max-w-7xl px-5 py-16 md:px-8 md:py-24"> <div class="max-w-2xl"> <p class="eyebrow">Materiały</p> <h2 class="mt-3 text-xl font-semibold tracking-[-0.04em] md:text-2xl">Dokumenty i materiały techniczne</h2> <p class="mt-5 text-ink/70">W tej sekcji będą dostępne aktualne katalogi, karty techniczne, certyfikaty oraz formularze.</p> </div> <div class="mt-12 grid gap-4 md:grid-cols-2"> ${sections.map(([title, description], index) => renderTemplate`<article class="border border-accent-1/15 bg-white p-6"> <p class="text-xs font-bold tracking-[0.15em] text-sun">${String(index + 1).padStart(2, "0")}</p> <h3 class="mt-8 text-2xl font-semibold tracking-[-0.04em]">${title}</h3> <p class="mt-3 text-sm leading-6 text-ink/65">${description}</p> <p class="mt-7 text-sm font-semibold text-ink/45">Pliki w przygotowaniu</p> </article>`)} </div> </section> ` })}`;
}, "F:/Strony/Strony W toku/ecotech-astro/src/pages/do-pobrania.astro", void 0);

const $$file = "F:/Strony/Strony W toku/ecotech-astro/src/pages/do-pobrania.astro";
const $$url = "/do-pobrania";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$DoPobrania,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
