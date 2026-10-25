import { c as createAstro, a as createComponent, m as maybeRenderHead, d as addAttribute, b as renderTemplate, r as renderComponent, F as Fragment } from './astro/server_Bi_ABpQi.mjs';
import 'piccolore';
import { $ as $$Picture } from './_astro_assets_BUnkhSbL.mjs';
import { h as hallImage } from './hala-rury-stalowe-wynajem_D5g_3BlT.mjs';

const $$Astro = createAstro("https://ecotechgroup.pl");
const $$PageHero = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$PageHero;
  const {
    title,
    breadcrumbs = [],
    image,
    imageAlt = "Hala z rurami stalowymi"
  } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<section class="relative isolate flex min-h-[10rem] items-end overflow-hidden bg-[#030b20] text-white md:min-h-[22rem]"> ${image ? renderTemplate`<img${addAttribute(image, "src")}${addAttribute(imageAlt, "alt")} class="absolute inset-0 -z-20 h-full w-full object-cover object-center">` : renderTemplate`${renderComponent($$result, "Picture", $$Picture, { "src": hallImage, "widths": [640, 960, 1440, 1920], "sizes": "100vw", "formats": ["avif", "webp"], "alt": imageAlt, "class": "absolute inset-0 -z-20 h-full w-full object-cover object-center" })}`} <div class="absolute inset-0 -z-10 bg-[#02091d]/75"></div> <div class="absolute inset-0 -z-10 bg-gradient-to-r from-[#02091d]/85 via-[#02091d]/60 to-[#02091d]/35"></div> <div class="mx-auto w-full max-w-7xl px-5 pb-16 pt-38 md:px-8 md:pb-20"> <h1 class="max-w-5xl text-3xl font-semibold leading-[1.03] tracking-[-0.05em] text-white md:text-4xl">${title}</h1> <nav class="mt-7 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-white/75" aria-label="Okruszki nawigacyjne"> <a href="/" class="hover:text-white">Strona główna</a> ${breadcrumbs.map((breadcrumb) => renderTemplate`${renderComponent($$result, "Fragment", Fragment, {}, { "default": ($$result2) => renderTemplate` <span aria-hidden="true" class="text-white/40">/</span> ${breadcrumb.href ? renderTemplate`<a${addAttribute(breadcrumb.href, "href")} class="hover:text-white">${breadcrumb.label}</a>` : renderTemplate`<span>${breadcrumb.label}</span>`}` })}`)} <span aria-hidden="true" class="text-white/40">/</span> <span aria-current="page" class="text-white">${title}</span> </nav> </div> </section>`;
}, "F:/Strony/Strony W toku/ecotech-astro/src/components/PageHero.astro", void 0);

export { $$PageHero as $ };
