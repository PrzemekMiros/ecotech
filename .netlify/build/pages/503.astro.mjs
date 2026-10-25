import { c as createAstro, a as createComponent, r as renderComponent, b as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_Bi_ABpQi.mjs';
import 'piccolore';
import { $ as $$BaseLayout } from '../chunks/BaseLayout_DhdkqCFE.mjs';
export { renderers } from '../renderers.mjs';

const $$Astro = createAstro("https://ecotechgroup.pl");
const prerender = false;
const $$503 = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$503;
  Astro2.response.status = 503;
  Astro2.response.headers.set("Retry-After", "3600");
  Astro2.response.headers.set("X-Robots-Tag", "noindex, nofollow, noarchive");
  Astro2.response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate");
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": "Prace konserwacyjne | Eco Tech Group", "description": "Eco Tech Group prowadzi chwilowe prace techniczne. Serwis b\u0119dzie ponownie dost\u0119pny wkr\xF3tce." }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<main class="mx-auto flex min-h-[calc(100vh-15rem)] max-w-7xl items-center justify-center px-5 py-20 md:px-8 md:py-28" aria-labelledby="maintenance-title"> <section class="w-full max-w-3xl border border-accent-1/15 bg-white p-8 text-center shadow-[0_18px_55px_rgba(6,17,38,0.04)] sm:p-14"> <p class="text-sm font-bold uppercase tracking-[0.2em] text-sun">503 · Service Unavailable</p> <h1 id="maintenance-title" class="mt-4 text-3xl font-semibold leading-tight tracking-[-0.045em] text-accent-1 sm:text-4xl">Trwają prace techniczne</h1> <p class="mx-auto mt-6 max-w-2xl text-lg leading-8 text-ink/70">Aktualizujemy platformę technologiczną Eco Tech Group, aby zapewnić najwyższą jakość danych technicznych i parametrów asortymentowych. Zapraszamy ponownie za chwilę.</p> </section> </main> ` })}`;
}, "F:/Strony/Strony W toku/ecotech-astro/src/pages/503.astro", void 0);

const $$file = "F:/Strony/Strony W toku/ecotech-astro/src/pages/503.astro";
const $$url = "/503";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$503,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
