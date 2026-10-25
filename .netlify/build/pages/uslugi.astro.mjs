import { a as createComponent, r as renderComponent, b as renderTemplate, m as maybeRenderHead, d as addAttribute } from '../chunks/astro/server_Bi_ABpQi.mjs';
import 'piccolore';
import { g as getCollection } from '../chunks/_astro_content_DkalvaRB.mjs';
import { $ as $$BaseLayout } from '../chunks/BaseLayout_DhdkqCFE.mjs';
import { $ as $$PageHero } from '../chunks/PageHero_CxXCUmZc.mjs';
export { renderers } from '../renderers.mjs';

const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const services = (await getCollection("services")).sort((a, b) => a.data.order - b.data.order);
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": "Us\u0142ugi | Eco Tech Group", "description": "Us\u0142ugi zwi\u0105zane z obr\xF3bk\u0105, produkcj\u0105 i konserwacj\u0105 rur stalowych." }, { "default": async ($$result2) => renderTemplate` ${renderComponent($$result2, "PageHero", $$PageHero, { "title": "Us\u0142ugi" })} ${maybeRenderHead()}<section class="mx-auto max-w-7xl px-5 py-16 md:px-8 md:py-24"> <div class="grid gap-4 md:grid-cols-2"> ${services.map((service, index) => renderTemplate`<a${addAttribute(`/uslugi/${service.data.slug}`, "href")} class="group flex min-h-64 flex-col overflow-hidden border border-accent-1/15 bg-white transition-colors hover:border-accent-1 hover:bg-mist"> ${service.data.image && renderTemplate`<img${addAttribute(service.data.image, "src")}${addAttribute(service.data.imageAlt ?? service.data.title, "alt")} class="aspect-[16/8.5] w-full object-cover transition duration-500 group-hover:scale-[1.03]" loading="lazy">`} <div class="flex flex-1 flex-col justify-between p-6"> <div> <p class="text-xs font-bold tracking-[0.15em] text-sun">${String(index + 1).padStart(2, "0")}</p> <h2 class="mt-5 text-2xl font-semibold tracking-[-0.04em]">${service.data.title}</h2> <p class="mt-3 max-w-xl text-sm leading-6 text-ink/65">${service.data.description}</p> </div> <span class="mt-7 text-sm font-semibold text-accent-1 group-hover:text-accent-1/75">Poznaj usługę <span aria-hidden="true">→</span></span> </div> </a>`)} </div> </section> ` })}`;
}, "F:/Strony/Strony W toku/ecotech-astro/src/pages/uslugi/index.astro", void 0);

const $$file = "F:/Strony/Strony W toku/ecotech-astro/src/pages/uslugi/index.astro";
const $$url = "/uslugi";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
