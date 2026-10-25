import { a as createComponent, r as renderComponent, b as renderTemplate, m as maybeRenderHead, d as addAttribute } from '../chunks/astro/server_Bi_ABpQi.mjs';
import 'piccolore';
import { g as getCollection } from '../chunks/_astro_content_DkalvaRB.mjs';
import { $ as $$BaseLayout } from '../chunks/BaseLayout_DhdkqCFE.mjs';
import { $ as $$PageHero } from '../chunks/PageHero_CxXCUmZc.mjs';
export { renderers } from '../renderers.mjs';

const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const jobs = (await getCollection("jobs")).sort((a, b) => a.data.order - b.data.order);
  const formatDate = new Intl.DateTimeFormat("pl-PL", { day: "2-digit", month: "long", year: "numeric" });
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": "Praca | Eco Tech Group", "description": "Aktualne oferty pracy w Eco Tech Group" }, { "default": async ($$result2) => renderTemplate` ${renderComponent($$result2, "PageHero", $$PageHero, { "title": "Praca" })} ${maybeRenderHead()}<section class="mx-auto max-w-7xl px-5 py-16 md:px-8 md:py-24"> <div class="max-w-2xl"> <p class="eyebrow">Kariera w Eco Tech Group</p> <h2 class="mt-3 text-2xl font-semibold tracking-[-0.04em] md:text-3xl">Aktualne oferty pracy</h2> <p class="mt-5 text-ink/70">Rozwijaj się z nami w branży stalowej. Szukamy osób zaangażowanych, samodzielnych i otwartych na wyzwania. Oferujemy stabilne zatrudnienie, realne możliwości rozwoju oraz pracę w zgranym zespole.</p> </div> <div class="mt-12 grid gap-4 md:grid-cols-2"> ${jobs.map((job) => renderTemplate`<a${addAttribute(`/praca/${job.data.slug}`, "href")} class="group flex min-h-56 flex-col justify-between border border-accent-1/15 bg-white p-6 transition-colors hover:border-accent-1 hover:bg-mist"> <div> <div class="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-bold uppercase tracking-[0.12em] text-accent-1"> ${job.data.location && renderTemplate`<span>${job.data.location}</span>`} ${job.data.location && job.data.pubDate && renderTemplate`<span class="size-1 rounded-full bg-sun"></span>`} ${job.data.pubDate && renderTemplate`<time${addAttribute(job.data.pubDate.toISOString(), "datetime")}>${formatDate.format(job.data.pubDate)}</time>`} </div> <h2 class="mt-8 text-2xl font-semibold leading-8 tracking-[-0.04em]">${job.data.title}</h2> <p class="mt-3 text-sm leading-6 text-ink/65">${job.data.description}</p> </div> <span class="mt-7 text-sm font-semibold text-accent-1 group-hover:text-accent-1/75">Zobacz ofertę <span aria-hidden="true">→</span></span> </a>`)} </div> </section> ` })}`;
}, "F:/Strony/Strony W toku/ecotech-astro/src/pages/praca/index.astro", void 0);

const $$file = "F:/Strony/Strony W toku/ecotech-astro/src/pages/praca/index.astro";
const $$url = "/praca";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
