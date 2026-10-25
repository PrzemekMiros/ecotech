import { c as createAstro, a as createComponent, r as renderComponent, b as renderTemplate, m as maybeRenderHead, d as addAttribute, e as renderScript, u as unescapeHTML } from '../../chunks/astro/server_Bi_ABpQi.mjs';
import 'piccolore';
import { g as getCollection, r as renderEntry } from '../../chunks/_astro_content_DkalvaRB.mjs';
import { $ as $$BaseLayout } from '../../chunks/BaseLayout_DhdkqCFE.mjs';
export { renderers } from '../../renderers.mjs';

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$Astro = createAstro("https://ecotechgroup.pl");
const prerender = false;
const $$slug = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$slug;
  const posts = await getCollection("news");
  const post = posts.find((entry) => entry.data.slug === Astro2.params.slug);
  if (!post) throw new Error(`Nie znaleziono artyku\u0142u: ${Astro2.params.slug}`);
  const { Content } = await renderEntry(post);
  const formatDate = new Intl.DateTimeFormat("pl-PL", { day: "2-digit", month: "long", year: "numeric" });
  const relatedPosts = posts.filter((entry) => entry.id !== post.id).sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf()).slice(0, 3);
  const author = {
    name: "Adam Iwanowski",
    role: "Specjalista ds. Technicznych"
  };
  const glossary = [
    {
      term: "Rura stalowa",
      definition: "Hutniczy wyr\xF3b rurowy wykonany ze stali, stosowany mi\u0119dzy innymi w konstrukcjach, instalacjach i ruroci\u0105gach."
    },
    {
      term: "Rura ze szwem",
      definition: "Rura powsta\u0142a przez uformowanie stalowego arkusza lub ta\u015Bmy i po\u0142\u0105czenie jej kraw\u0119dzi za pomoc\u0105 spawania."
    },
    {
      term: "Rura bezszwowa",
      definition: "Rura wytwarzana z pe\u0142nego k\u0119sa stalowego, bez pod\u0142u\u017Cnego po\u0142\u0105czenia spawanego."
    },
    {
      term: "Gatunek stali",
      definition: "Oznaczenie sk\u0142adu chemicznego i w\u0142a\u015Bciwo\u015Bci mechanicznych stali, kt\xF3re wp\u0142ywaj\u0105 na jej zastosowanie."
    },
    {
      term: "Norma techniczna",
      definition: "Ustalony zbi\xF3r wymaga\u0144 dotycz\u0105cych mi\u0119dzy innymi wymiar\xF3w, parametr\xF3w, bada\u0144 i odbioru wyrobu."
    },
    {
      term: "Pow\u0142oka antykorozyjna",
      definition: "Warstwa ochronna nak\u0142adana na powierzchni\u0119 stali w celu ograniczenia korozji i wyd\u0142u\u017Cenia trwa\u0142o\u015Bci elementu."
    }
  ];
  const faq = post.data.faq ?? [];
  const faqSchema = faq.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((entry) => ({
      "@type": "Question",
      name: entry.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: entry.answer
      }
    }))
  } : null;
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": `${post.data.title} | Eco Tech Group`, "description": post.data.description }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<article class="overflow-hidden"> <section class="relative isolate min-h-[15rem] bg-[#030b20] text-white"> <img src="/img/main/hala-rury-stalowe-wynajem.jpg" alt="Rury stalowe w hali Eco Tech Group" class="absolute inset-0 -z-20 h-full w-full object-cover object-center"> <div class="absolute inset-0 -z-10 bg-[#061126]/75"></div> <div class="absolute inset-0 -z-10 bg-gradient-to-r from-[#061126]/90 via-[#061126]/48 to-transparent"></div> <div class="mx-auto flex min-h-[15rem] max-w-7xl items-end px-5 pb-28 pt-36 md:px-8 md:pb-32"> <div> <nav class="mt-4 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-white/70" aria-label="Okruszki nawigacyjne"> <a href="/" class="hover:text-white">Strona główna</a><span aria-hidden="true" class="text-white/35">/</span> <a href="/aktualnosci" class="hover:text-white">Aktualności</a><span aria-hidden="true" class="text-white/35">/</span> <span aria-current="page" class="text-white">Artykuł</span> </nav> </div> </div> </section> <section class="relative z-10 mx-auto -mt-16 max-w-7xl px-5 pb-16 md:-mt-24 md:px-8 md:pb-24"> <div class="bg-white shadow-[0_18px_55px_rgba(6,17,38,0.04)]"> <div class="grid gap-12 p-6 sm:p-10 lg:grid-cols-[minmax(0,1fr)_17rem] lg:gap-16 lg:p-14"> <div class="min-w-0"> <figure class="mb-8"> <img${addAttribute(post.data.image ?? "/img/main/hero-industrial-pipes.jpg", "src")}${addAttribute(post.data.imageAlt ?? post.data.title, "alt")} class="aspect-[16/9] w-full object-cover" loading="eager"> </figure> <div class="flex flex-wrap items-center gap-3 text-xs font-bold uppercase tracking-[0.16em] text-accent-1"> <span>${post.data.category}</span><span class="size-1 rounded-full bg-sun"></span> <time${addAttribute(post.data.pubDate.toISOString(), "datetime")}>${formatDate.format(post.data.pubDate)}</time> </div> <h1 class="mt-6 max-w-4xl text-2xl font-semibold leading-[1.1] tracking-[-0.045em] text-ink sm:text-3xl md:text-4xl">${post.data.title}</h1> <aside class="mt-6 max-w-3xl border border-accent-1/20 bg-mist/45 p-5 sm:p-6" aria-label="Kluczowe wnioski"> <p class="text-xs font-bold uppercase tracking-[0.16em] text-accent-1">Kluczowe wnioski</p> <p class="mt-3 text-base leading-7 text-ink/75">${post.data.description}</p> </aside> <div class="mt-8 flex flex-wrap items-center gap-4 border-y border-ink/10 py-4 text-sm text-ink/60"> <span class="font-semibold text-ink">Eco Tech Group</span><span aria-hidden="true" class="size-1 rounded-full bg-sun"></span><span>Szacowany czas czytania: 3 min</span> </div> <nav id="article-toc" class="mt-10 hidden border border-ink/10 bg-mist/45 p-5" aria-label="Spis treści"> <p class="text-xs font-bold uppercase tracking-[0.16em] text-accent-1">Spis treści</p> <div id="article-toc-list" class="mt-4 text-sm leading-6 text-ink/75"></div> </nav> <div class="article-content mt-10 max-w-3xl text-base leading-8 text-ink/75 [&_h2]:mt-10 [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:leading-tight [&_h2]:tracking-[-0.035em] [&_h3]:mt-7 [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:leading-snug [&_p]:mt-6 [&_ul]:mt-6 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-6 [&_ol]:mt-6 [&_ol]:list-decimal [&_ol]:space-y-2 [&_ol]:pl-6 [&_figure]:mt-8 [&_figure_img]:w-full [&_figure_img]:object-cover [&_table]:mt-8 [&_table]:w-full [&_table]:border-collapse [&_table]:text-sm [&_td]:border [&_td]:border-ink/15 [&_td]:p-3 [&_th]:border [&_th]:border-ink/15 [&_th]:bg-mist [&_th]:p-3 [&_a]:font-semibold [&_a]:text-accent-1 [&_a]:underline [&_a]:underline-offset-4">${renderComponent($$result2, "Content", Content, {})}</div> ${renderScript($$result2, "F:/Strony/Strony W toku/ecotech-astro/src/pages/aktualnosci/[slug].astro?astro&type=script&index=0&lang.ts")} <section class="mt-12 border-t border-ink/10 pt-8" aria-labelledby="article-glossary-heading"> <h2 id="article-glossary-heading" class="text-2xl font-semibold leading-tight tracking-[-0.035em] text-ink">Słownik pojęć</h2> <p class="mt-3 max-w-3xl text-sm leading-6 text-ink/65">Najważniejsze pojęcia techniczne związane z tematyką artykułu.</p> <dl class="mt-6 grid gap-x-8 gap-y-5 sm:grid-cols-2"> ${glossary.map((entry) => renderTemplate`<div class="border-l-2 border-sun pl-4"> <dt class="font-semibold text-ink">${entry.term}</dt> <dd class="mt-1 text-sm leading-6 text-ink/70">${entry.definition}</dd> </div>`)} </dl> </section> ${faq.length > 0 && renderTemplate`<section class="mt-12 border-t border-ink/10 pt-8" aria-labelledby="article-faq-heading"> <h2 id="article-faq-heading" class="text-2xl font-semibold leading-tight tracking-[-0.035em] text-ink">Pytania i odpowiedzi</h2> <p class="mt-3 max-w-3xl text-sm leading-6 text-ink/65">Najczęstsze pytania podsumowujące najważniejsze informacje z artykułu.</p> <div class="mt-6 divide-y divide-ink/10 border-y border-ink/10"> ${faq.map((entry) => renderTemplate`<details class="group py-5 first:pt-4 last:pb-4"> <summary class="flex cursor-pointer list-none items-start justify-between gap-6 font-semibold text-ink marker:hidden"> <span>${entry.question}</span> <span class="shrink-0 text-xl font-normal leading-none text-accent-1 transition-transform group-open:rotate-45" aria-hidden="true">+</span> </summary> <p class="mt-3 max-w-3xl text-sm leading-7 text-ink/70">${entry.answer}</p> </details>`)} </div> </section>`} <div class="mt-10 flex items-center gap-4 border-y border-ink/10 py-4"${addAttribute(`Autor: ${author.name}`, "aria-label")}> <div class="flex size-11 shrink-0 items-center justify-center rounded-full bg-accent-1 text-sm font-semibold text-white" aria-hidden="true">AI</div> <div> <p class="text-sm font-semibold text-ink">${author.name}</p> <p class="mt-0.5 text-sm text-ink/60">${author.role}</p> </div> </div> <div class="mt-12 border-t border-ink/10 pt-7"> <p class="text-sm font-semibold text-ink">Udostępnij artykuł</p> <div class="mt-4 flex flex-wrap gap-3"> <a${addAttribute(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(Astro2.url.href)}`, "href")} target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-2 border border-ink/15 px-4 py-2.5 text-sm font-semibold text-ink hover:border-accent-1 hover:text-accent-1">LinkedIn <span aria-hidden="true">↗</span></a> <a${addAttribute(`mailto:?subject=${encodeURIComponent(post.data.title)}&body=${encodeURIComponent(Astro2.url.href)}`, "href")} class="inline-flex items-center gap-2 border border-ink/15 px-4 py-2.5 text-sm font-semibold text-ink hover:border-accent-1 hover:text-accent-1">Wyślij e-mailem <span aria-hidden="true">↗</span></a> </div> </div> </div> <aside class="h-fit lg:sticky lg:top-8"> <div class="border border-ink/10 p-5"> <p class="text-xs font-bold uppercase tracking-[0.16em] text-accent-1">Najnowsze wpisy</p> <div class="mt-4 divide-y divide-ink/10"> ${relatedPosts.map((related) => renderTemplate`<a${addAttribute(`/aktualnosci/${related.data.slug}`, "href")} class="group block py-4 first:pt-0"> <p class="text-xs font-bold uppercase tracking-[0.14em] text-accent-1/65">${formatDate.format(related.data.pubDate)}</p> <h2 class="mt-2 text-sm font-semibold leading-5 text-ink transition-colors group-hover:text-accent-1">${related.data.title}</h2> </a>`)} </div> <a href="/aktualnosci" class="mt-5 inline-flex text-sm font-semibold text-accent-1 hover:text-ink">Zobacz wszystkie <span class="ml-2" aria-hidden="true">→</span></a> </div> <div class="mt-5 bg-accent-1 p-6 text-white"> <p class="text-xs font-bold uppercase tracking-[0.16em] text-white/65">Potrzebujesz wsparcia?</p> <h2 class="mt-3 text-xl font-semibold leading-6 tracking-[-0.03em]">Porozmawiajmy o Twojej inwestycji.</h2> <p class="mt-3 text-sm leading-6 text-white/75">Dobierzemy rozwiązanie dopasowane do specyfiki projektu.</p> <a href="/kontakt" class="mt-6 inline-flex bg-white px-4 py-3 text-sm font-semibold text-accent-1 hover:bg-sand">Skontaktuj się <span class="ml-2" aria-hidden="true">→</span></a> </div> </aside> </div> </div> </section> </article> ${faqSchema && renderTemplate(_a || (_a = __template(['<script type="application/ld+json">', "<\/script>"])), unescapeHTML(JSON.stringify(faqSchema)))}` })}`;
}, "F:/Strony/Strony W toku/ecotech-astro/src/pages/aktualnosci/[slug].astro", void 0);

const $$file = "F:/Strony/Strony W toku/ecotech-astro/src/pages/aktualnosci/[slug].astro";
const $$url = "/aktualnosci/[slug]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$slug,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
