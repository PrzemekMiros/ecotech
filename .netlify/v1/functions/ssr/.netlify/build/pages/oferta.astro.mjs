import { c as createAstro, a as createComponent, m as maybeRenderHead, d as addAttribute, b as renderTemplate, r as renderComponent } from '../chunks/astro/server_Bi_ABpQi.mjs';
import 'piccolore';
import { $ as $$BaseLayout } from '../chunks/BaseLayout_DhdkqCFE.mjs';
import 'clsx';
import { $ as $$PageHero } from '../chunks/PageHero_CxXCUmZc.mjs';
export { renderers } from '../renderers.mjs';

const $$Astro = createAstro("https://ecotechgroup.pl");
const $$OfferCard = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$OfferCard;
  const { number, title, description, href = "/oferta" } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<a${addAttribute(href, "href")} class="group flex min-h-64 flex-col justify-between border border-accent-1/15 bg-white p-6 hover:border-accent-1 hover:bg-mist"> <div> <p class="text-xs font-bold tracking-[0.15em] text-sun">${number}</p> <h3 class="mt-10 text-2xl font-semibold tracking-[-0.04em]">${title}</h3> <p class="mt-3 text-sm leading-6 text-ink/65">${description}</p> </div> <span class="mt-7 text-sm font-semibold text-accent-1 group-hover:text-accent-1/75">Poznaj rozwiązanie <span aria-hidden="true">→</span></span> </a>`;
}, "F:/Strony/Strony W toku/ecotech-astro/src/components/OfferCard.astro", void 0);

const $$Oferta = createComponent(($$result, $$props, $$slots) => {
  const offers = [
    ["01", "Gospodarka wodna", "Rozwi\u0105zania w zakresie oczyszczania \u015Bciek\xF3w, retencji i ponownego wykorzystania wody."],
    ["02", "Systemy rurowe", "Komponenty dla instalacji przemys\u0142owych i wodno-kanalizacyjnych."],
    ["03", "Separacja i filtracja", "Urz\u0105dzenia do efektywnego oddzielania zanieczyszcze\u0144 i ochrony instalacji."],
    ["04", "Zbiorniki i retencja", "Systemy magazynowania oraz kontrolowanego zagospodarowania w\xF3d opadowych."],
    ["05", "Produkty specjalistyczne", "Rozwi\u0105zania dobierane do wymaga\u0144 konkretnej inwestycji."],
    ["06", "Wsparcie projektu", "Konsultacja techniczna, wyceny i pomoc na etapie realizacji."]
  ];
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": "Oferta | Eco Tech Group" }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "PageHero", $$PageHero, { "title": "Oferta" })} ${maybeRenderHead()}<section class="mx-auto max-w-7xl px-5 py-16 md:px-8 md:py-24"><div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">${offers.map(([number, title, description]) => renderTemplate`${renderComponent($$result2, "OfferCard", $$OfferCard, { "number": number, "title": title, "description": description })}`)}</div></section> ` })}`;
}, "F:/Strony/Strony W toku/ecotech-astro/src/pages/oferta.astro", void 0);

const $$file = "F:/Strony/Strony W toku/ecotech-astro/src/pages/oferta.astro";
const $$url = "/oferta";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Oferta,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
