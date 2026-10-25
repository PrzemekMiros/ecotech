import { a as createComponent, r as renderComponent, b as renderTemplate, m as maybeRenderHead, d as addAttribute } from '../chunks/astro/server_Bi_ABpQi.mjs';
import 'piccolore';
import { g as getCollection } from '../chunks/_astro_content_DkalvaRB.mjs';
import { $ as $$BaseLayout } from '../chunks/BaseLayout_DhdkqCFE.mjs';
import { $ as $$PageHero } from '../chunks/PageHero_CxXCUmZc.mjs';
export { renderers } from '../renderers.mjs';

const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const posts = (await getCollection("news")).sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
  const formatDate = new Intl.DateTimeFormat("pl-PL", { day: "2-digit", month: "long", year: "numeric" });
  const featuredImages = {
    Aktualno\u015Bci: { src: "/img/main/eco-tech-o-firmie.jpg", alt: "Eco Tech Group" },
    Rynek: { src: "/img/main/hero-industrial-pipes.jpg", alt: "Rury stalowe w przemy\u015Ble" },
    Wiedza: { src: "/img/main/hala-rury-stalowe-wynajem.jpg", alt: "Rury stalowe w hali" }
  };
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": "Aktualno\u015Bci | Eco Tech Group", "description": "Najnowsze informacje, wiedza bran\u017Cowa i aktualno\u015Bci Eco Tech Group." }, { "default": async ($$result2) => renderTemplate` ${renderComponent($$result2, "PageHero", $$PageHero, { "title": "Aktualno\u015Bci" })} ${maybeRenderHead()}<section class="mx-auto max-w-7xl px-5 py-16 md:px-8 md:py-24"> <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3"> ${posts.map((post) => {
    const featuredImage = post.data.image ? { src: post.data.image, alt: post.data.imageAlt ?? post.data.title } : featuredImages[post.data.category];
    return renderTemplate`<a${addAttribute(`/aktualnosci/${post.data.slug}`, "href")} class="group flex min-h-80 flex-col overflow-hidden border border-accent-1/15 bg-white transition-colors hover:border-accent-1 hover:bg-mist"> <img${addAttribute(featuredImage.src, "src")}${addAttribute(featuredImage.alt, "alt")} class="aspect-[16/8.5] w-full object-cover transition duration-500 group-hover:scale-[1.03]" loading="lazy"> <div class="flex flex-1 flex-col justify-between p-6"> <div> <div class="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.12em] text-accent-1"> <span>${post.data.category}</span> <span class="size-1 rounded-full bg-sun"></span> <time${addAttribute(post.data.pubDate.toISOString(), "datetime")}>${formatDate.format(post.data.pubDate)}</time> </div> <h2 class="mt-5 text-lg font-semibold tracking-[-0.04em]">${post.data.title}</h2> </div> <span class="mt-7 text-sm font-semibold text-accent-1 group-hover:text-accent-1/75">Czytaj artykuł <span aria-hidden="true">→</span></span> </div> </a>`;
  })} </div> </section> ` })}`;
}, "F:/Strony/Strony W toku/ecotech-astro/src/pages/aktualnosci/index.astro", void 0);

const $$file = "F:/Strony/Strony W toku/ecotech-astro/src/pages/aktualnosci/index.astro";
const $$url = "/aktualnosci";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
