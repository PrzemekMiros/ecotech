import { c as createAstro, a as createComponent, r as renderComponent, b as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_Bi_ABpQi.mjs';
import 'piccolore';
import { $ as $$BaseLayout } from '../chunks/BaseLayout_DhdkqCFE.mjs';
export { renderers } from '../renderers.mjs';

const $$Astro = createAstro("https://ecotechgroup.pl");
const prerender = false;
const $$404 = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$404;
  Astro2.response.status = 404;
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": "Nie znaleziono strony | Eco Tech Group", "description": "Szukana strona nie istnieje lub zosta\u0142a przeniesiona. Przejd\u017A do oferty rur stalowych, us\u0142ug, produkcji albo skontaktuj si\u0119 z Eco Tech Group." }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<main class="mx-auto flex min-h-[calc(100vh-15rem)] max-w-7xl items-center px-5 py-20 md:px-8 md:py-28" aria-labelledby="error-title"> <section class="w-full border border-accent-1/15 bg-white p-7 shadow-[0_18px_55px_rgba(6,17,38,0.04)] sm:p-12 lg:p-16"> <div class="max-w-3xl"> <p class="text-sm font-bold uppercase tracking-[0.2em] text-sun">Błąd 404</p> <h1 id="error-title" class="mt-4 text-3xl font-semibold leading-tight tracking-[-0.045em] text-accent-1 sm:text-4xl md:text-5xl">Zasób nie został odnaleziony</h1> <p class="mt-6 text-lg leading-8 text-ink/70">Szukana podstrona nie istnieje, została przeniesiona albo wycofano ją z oferty. Skorzystaj z poniższych sekcji, aby przejść dalej.</p> <nav class="mt-10 grid gap-3 sm:grid-cols-2" aria-label="Najważniejsze sekcje serwisu"> <a href="/rury-stalowe/" class="group border border-ink/10 p-5 transition-colors hover:border-accent-1 hover:bg-mist"> <span class="text-xs font-bold uppercase tracking-[0.16em] text-sun">01</span> <span class="mt-3 block text-lg font-semibold text-ink group-hover:text-accent-1">Rury stalowe</span> <span class="mt-2 block text-sm leading-6 text-ink/60">Zobacz kategorie rur nowych i używanych.</span> </a> <a href="/uslugi/" class="group border border-ink/10 p-5 transition-colors hover:border-accent-1 hover:bg-mist"> <span class="text-xs font-bold uppercase tracking-[0.16em] text-sun">02</span> <span class="mt-3 block text-lg font-semibold text-ink group-hover:text-accent-1">Usługi przetwórstwa</span> <span class="mt-2 block text-sm leading-6 text-ink/60">Poznaj gięcie, izolowanie i spawanie rur.</span> </a> <a href="/produkcja/" class="group border border-ink/10 p-5 transition-colors hover:border-accent-1 hover:bg-mist"> <span class="text-xs font-bold uppercase tracking-[0.16em] text-sun">03</span> <span class="mt-3 block text-lg font-semibold text-ink group-hover:text-accent-1">Produkcja</span> <span class="mt-2 block text-sm leading-6 text-ink/60">Sprawdź zakres produkcji elementów stalowych.</span> </a> <a href="/kontakt/" class="group border border-ink/10 p-5 transition-colors hover:border-accent-1 hover:bg-mist"> <span class="text-xs font-bold uppercase tracking-[0.16em] text-sun">04</span> <span class="mt-3 block text-lg font-semibold text-ink group-hover:text-accent-1">Skontaktuj się z nami</span> <span class="mt-2 block text-sm leading-6 text-ink/60">Poproś o dobór materiału lub wycenę.</span> </a> </nav> <a href="/" class="mt-8 inline-flex bg-accent-1 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-accent-1/85">Wróć na stronę główną <span class="ml-2" aria-hidden="true">→</span></a> </div> </section> </main> ` })}`;
}, "F:/Strony/Strony W toku/ecotech-astro/src/pages/404.astro", void 0);

const $$file = "F:/Strony/Strony W toku/ecotech-astro/src/pages/404.astro";
const $$url = "/404";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$404,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
