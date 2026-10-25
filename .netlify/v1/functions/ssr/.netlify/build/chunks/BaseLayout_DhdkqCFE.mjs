import { c as createAstro, a as createComponent, d as addAttribute, e as renderScript, b as renderTemplate, m as maybeRenderHead, r as renderComponent, f as renderHead, g as renderTransition, h as renderSlot } from './astro/server_Bi_ABpQi.mjs';
import 'piccolore';
/* empty css                       */
import 'clsx';
import { g as getCollection } from './_astro_content_DkalvaRB.mjs';

const $$Astro$2 = createAstro("https://ecotechgroup.pl");
const $$ClientRouter = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$2, $$props, $$slots);
  Astro2.self = $$ClientRouter;
  const { fallback = "animate" } = Astro2.props;
  return renderTemplate`<meta name="astro-view-transitions-enabled" content="true"><meta name="astro-view-transitions-fallback"${addAttribute(fallback, "content")}>${renderScript($$result, "F:/Strony/Strony W toku/ecotech-astro/node_modules/astro/components/ClientRouter.astro?astro&type=script&index=0&lang.ts")}`;
}, "F:/Strony/Strony W toku/ecotech-astro/node_modules/astro/components/ClientRouter.astro", void 0);

const darkLogo = new Proxy({"src":"/_astro/EcoTech_Logo_dark.CukQAiLS.png","width":350,"height":53,"format":"png"}, {
						get(target, name, receiver) {
							if (name === 'clone') {
								return structuredClone(target);
							}
							if (name === 'fsPath') {
								return "F:/Strony/Strony W toku/ecotech-astro/src/assets/img/logo/EcoTech_Logo_dark.png";
							}
							
							return target[name];
						}
					});

const $$Astro$1 = createAstro("https://ecotechgroup.pl");
const $$Header = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$Header;
  const links = [
    { href: "/rury-stalowe", label: "Rury stalowe", dropdown: true, menu: "pipes" },
    { href: "/uslugi", label: "Us\u0142ugi", dropdown: true, menu: "services" },
    { href: "/produkcja", label: "Produkcja", dropdown: true, menu: "production" },
    { href: "/aktualnosci", label: "Aktualno\u015Bci", dropdown: false, menu: void 0 },
    { href: "/do-pobrania", label: "Do pobrania", dropdown: false, menu: void 0 },
    { href: "/praca", label: "Praca", dropdown: false, menu: void 0 },
    { href: "/o-nas", label: "O nas", dropdown: false, menu: void 0 },
    { href: "/kontakt", label: "Kontakt", dropdown: false, menu: void 0 }
  ];
  const pathname = Astro2.url.pathname;
  const services = (await getCollection("services")).sort((a, b) => a.data.order - b.data.order);
  const productionItems = (await getCollection("production")).sort((a, b) => a.data.order - b.data.order);
  const pipeCategories = (await getCollection("steelPipeCategories")).sort((a, b) => a.data.order - b.data.order);
  const itemHref = (menu, baseHref, slug) => menu === "pipes" ? `/rury-stalowe-${slug}` : `${baseHref}/${slug}`;
  return renderTemplate`${maybeRenderHead()}<header class="absolute inset-x-0 top-0 z-30 text-white"> <div class="mx-auto grid min-h-20 max-w-7xl grid-cols-[1fr_auto] items-center gap-8 px-5 lg:px-8"> <a href="/" class="w-fit" aria-label="Eco Tech Group — strona główna"> <img src="/img/logo/EcoTech_Logo_white.png" alt="Eco Tech Group" class="site-logo--light h-6 w-auto xs:h-8 sm:h-8 lg:h-10 md:-mb-12"> <img${addAttribute(darkLogo.src, "src")} alt="Eco Tech Group" class="site-logo--dark h-6 w-auto xs:h-8 sm:h-8 lg:h-10 md:-mb-12"> </a> <div class="hidden self-stretch lg:block"> <div class="flex h-[66px] items-center justify-end gap-7 text-sm font-medium"> <div class="flex items-center gap-4 text-lg" aria-label="Wybór języka"> <a href="https://ecotech-group.uk/" aria-label="English" class="transition-opacity hover:opacity-70">🇬🇧</a> <a href="https://ecotechgroup.de/" aria-label="Deutsch" class="transition-opacity hover:opacity-70">🇩🇪</a> </div> <a href="mailto:biuro@ecotechgroup.pl" class="text-white/90 transition-colors hover:text-white">✉ biuro@ecotechgroup.pl</a> <a href="/kontakt" class="bg-accent-1 px-9 py-3 text-sm font-semibold tracking-[0.02em] transition-colors hover:bg-accent-1/85">Wyślij zapytanie</a> </div> <nav class="flex h-[44px] items-center justify-end gap-8 border-t border-white/20 text-sm font-semibold" aria-label="Nawigacja główna"> ${links.map((link) => link.dropdown ? renderTemplate`<div class="group relative flex h-full items-center"> <a${addAttribute(link.href, "href")} aria-haspopup="true"${addAttribute([
    "flex h-full items-center gap-2 transition-colors hover:text-white/70 group-focus-within:text-white",
    pathname.startsWith(link.href) ? "text-white" : "text-white/90"
  ], "class:list")}> ${link.label}<span aria-hidden="true" class="transition-transform group-hover:rotate-180 group-focus-within:rotate-180"> <svg viewBox="0 0 330 512" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em"><path fill="#fff" d="M305.913 197.085c0 2.266-1.133 4.815-2.833 6.514L171.087 335.593c-1.7 1.7-4.249 2.832-6.515 2.832s-4.815-1.133-6.515-2.832L26.064 203.599c-1.7-1.7-2.832-4.248-2.832-6.514s1.132-4.816 2.832-6.515l14.162-14.163c1.7-1.699 3.966-2.832 6.515-2.832 2.266 0 4.815 1.133 6.515 2.832l111.316 111.317 111.316-111.317c1.7-1.699 4.249-2.832 6.515-2.832s4.815 1.133 6.515 2.832l14.162 14.163c1.7 1.7 2.833 4.249 2.833 6.515z"></path></svg> </span> </a> <div class="pointer-events-none fixed inset-x-0 top-[113px] z-50 translate-y-2 pt-3 opacity-0 transition duration-200 group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:translate-y-0 group-focus-within:opacity-100"> <div class="mx-auto max-w-7xl px-5 lg:px-8"> <div class="border border-ink/10 bg-white p-8 shadow-2xl shadow-ink/15"> <div class="flex items-end justify-between gap-8 border-b border-ink/10 pb-6"> <div> <p class="text-xs font-bold uppercase tracking-[0.18em] text-accent-1">${link.label}</p> </div> <a${addAttribute(link.href, "href")} class="shrink-0 text-sm font-semibold text-accent-1 transition-colors hover:text-ink">${link.menu === "pipes" ? "Wszystkie kategorie" : link.menu === "production" ? "Ca\u0142a produkcja" : "Wszystkie us\u0142ugi"} →</a> </div> <div class="mt-6 grid grid-cols-2 gap-x-10 gap-y-1"> ${(link.menu === "pipes" ? pipeCategories : link.menu === "production" ? productionItems : services).map((item, index) => renderTemplate`<a${addAttribute(itemHref(link.menu, link.href, item.data.slug), "href")} class="flex items-start gap-3 border-b border-ink/8 py-4 text-ink/70 transition-colors hover:border-accent-1 hover:text-accent-1 focus:border-accent-1 focus:text-accent-1"> <span class="pt-0.5 text-xs font-bold tracking-[0.12em] text-accent-1/65">${String(index + 1).padStart(2, "0")}</span> <span class="leading-5">${item.data.title}</span> </a>`)} </div> </div> </div> </div> </div>` : renderTemplate`<a${addAttribute(link.href, "href")}${addAttribute([
    "flex items-center gap-2 transition-colors hover:text-white/70",
    pathname === link.href ? "text-white" : "text-white/90"
  ], "class:list")}> ${link.label} </a>`)} </nav> </div> <details class="group justify-self-end lg:hidden"> <summary class="flex cursor-pointer list-none items-center gap-3 bg-accent-1 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-accent-1/85 [&::-webkit-details-marker]:hidden"> <span>Menu</span> <span class="flex size-4 flex-col justify-center gap-1" aria-hidden="true"> <span class="h-px w-full bg-white transition-transform group-open:translate-y-[3px] group-open:rotate-45"></span> <span class="h-px w-full bg-white transition-opacity group-open:opacity-0"></span> <span class="h-px w-full bg-white transition-transform group-open:-translate-y-[3px] group-open:-rotate-45"></span> </span> </summary> <div class="fixed inset-x-0 top-20 z-40 max-h-[calc(100svh-5rem)] overflow-y-auto border-t border-ink/10 bg-white text-ink shadow-2xl shadow-ink/15"> <nav class="mx-auto max-w-7xl px-5 py-6" aria-label="Nawigacja mobilna"> <div class="divide-y divide-ink/10 border-y border-ink/10"> <details class="group/mobile"> <summary class="flex cursor-pointer list-none items-center justify-between py-5 text-lg font-semibold [&::-webkit-details-marker]:hidden">
Rury stalowe
<span class="text-accent-1 transition-transform group-open/mobile:rotate-45" aria-hidden="true">+</span> </summary> <div class="pb-5"> <a href="/rury-stalowe" class="mb-2 block text-sm font-semibold text-sun">Wszystkie kategorie →</a> <div class="grid gap-1 sm:grid-cols-2"> ${pipeCategories.map((category) => renderTemplate`<a${addAttribute(itemHref("pipes", "/rury-stalowe", category.data.slug), "href")} class="block py-2 text-sm text-ink/65 hover:text-accent-1">${category.data.title}</a>`)} </div> </div> </details> <details class="group/mobile"> <summary class="flex cursor-pointer list-none items-center justify-between py-5 text-lg font-semibold [&::-webkit-details-marker]:hidden">
Usługi
<span class="text-accent-1 transition-transform group-open/mobile:rotate-45" aria-hidden="true">+</span> </summary> <div class="pb-5"> <a href="/uslugi" class="mb-2 block text-sm font-semibold text-sun">Wszystkie usługi →</a> <div class="grid gap-1 sm:grid-cols-2"> ${services.map((service) => renderTemplate`<a${addAttribute(`/uslugi/${service.data.slug}`, "href")} class="block py-2 text-sm text-ink/65 hover:text-accent-1">${service.data.title}</a>`)} </div> </div> </details> <details class="group/mobile"> <summary class="flex cursor-pointer list-none items-center justify-between py-5 text-lg font-semibold [&::-webkit-details-marker]:hidden">
Produkcja
<span class="text-accent-1 transition-transform group-open/mobile:rotate-45" aria-hidden="true">+</span> </summary> <div class="pb-5"> <a href="/produkcja" class="mb-2 block text-sm font-semibold text-sun">Cała produkcja →</a> <div class="grid gap-1 sm:grid-cols-2"> ${productionItems.map((item) => renderTemplate`<a${addAttribute(`/produkcja/${item.data.slug}`, "href")} class="block py-2 text-sm text-ink/65 hover:text-accent-1">${item.data.title}</a>`)} </div> </div> </details> ${links.filter((link) => !link.dropdown).map((link) => renderTemplate`<a${addAttribute(link.href, "href")} class="flex items-center justify-between py-5 text-lg font-semibold hover:text-accent-1"> ${link.label}<span aria-hidden="true" class="text-accent-1/60">→</span> </a>`)} </div> <div class="mt-6 grid gap-3 sm:grid-cols-2"> <a href="/kontakt" class="bg-accent-1 px-5 py-4 text-center text-sm font-semibold text-white hover:bg-accent-1/85">Wyślij zapytanie</a> <a href="mailto:biuro@ecotechgroup.pl" class="border border-ink/20 px-5 py-4 text-center text-sm font-semibold text-ink hover:border-accent-1 hover:text-accent-1">biuro@ecotechgroup.pl</a> </div> </nav> </div> </details> </div> </header> `;
}, "F:/Strony/Strony W toku/ecotech-astro/src/components/Header.astro", void 0);

const $$Footer = createComponent(($$result, $$props, $$slots) => {
  const quickLinks = [
    { href: "/rury-stalowe", label: "Rury stalowe" },
    { href: "/uslugi", label: "Us\u0142ugi" },
    { href: "/produkcja", label: "Produkcja" },
    { href: "/dostawa-rur-stalowych", label: "Dostawa rur" },
    { href: "/kontakt", label: "Kontakt" }
  ];
  const companyLinks = [
    { href: "/o-nas", label: "O firmie" },
    { href: "/aktualnosci", label: "Aktualno\u015Bci" },
    { href: "/do-pobrania", label: "Do pobrania" },
    { href: "/praca", label: "Praca" },
    { href: "/kalkulator-wagi-rur-stalowych", label: "Kalkulator wagi rur" }
  ];
  return renderTemplate`${maybeRenderHead()}<footer class="border-t border-white/10 bg-[#07111e] text-white"> <div class="mx-auto max-w-7xl px-5 md:px-8"> <div class="grid border-x border-white/10 md:grid-cols-2 lg:grid-cols-4"> <section class="border-b border-white/10 px-6 py-10 md:border-r lg:border-b-0 lg:px-8 lg:py-12" aria-labelledby="footer-links"> <h2 id="footer-links" class="text-sm font-semibold uppercase tracking-[0.03em] text-white/55">Szybkie linki</h2> <ul class="mt-6 space-y-3 text-sm leading-5 text-white/75"> ${quickLinks.map((link) => renderTemplate`<li><a${addAttribute(link.href, "href")} class="transition-colors hover:text-sun">${link.label}</a></li>`)} </ul> </section> <section class="border-b border-white/10 px-6 py-10 md:px-8 lg:border-b-0 lg:border-r lg:py-12" aria-labelledby="footer-company"> <h2 id="footer-company" class="text-sm font-semibold uppercase tracking-[0.03em] text-white/55">Eco Tech Group</h2> <ul class="mt-6 space-y-3 text-sm leading-5 text-white/75"> ${companyLinks.map((link) => renderTemplate`<li><a${addAttribute(link.href, "href")} class="transition-colors hover:text-sun">${link.label}</a></li>`)} </ul> </section> <section class="border-b border-white/10 px-6 py-10 md:border-r md:px-8 lg:border-b-0 lg:py-12" aria-labelledby="footer-contact"> <h2 id="footer-contact" class="text-sm font-semibold uppercase tracking-[0.03em] text-white/55">Kontakt</h2> <div class="mt-6 space-y-3 text-sm leading-6 text-white/75"> <a href="tel:+48508299077" class="block transition-colors hover:text-sun">+48 508 299 077</a> <a href="mailto:sprzedaz@ecotechgroup.pl" class="block break-words transition-colors hover:text-sun">sprzedaz@ecotechgroup.pl</a> <p class="pt-2 text-white/50">Poniedziałek–piątek<br>8:00–16:00</p> </div> </section> <section class="px-6 py-10 md:px-8 lg:py-12" aria-labelledby="footer-address"> <h2 id="footer-address" class="text-sm font-semibold uppercase tracking-[0.03em] text-white/55">Siedziba firmy</h2> <address class="mt-6 text-sm leading-6 not-italic text-white/75">
Eco Tech Group Sp. z o.o.<br>
ul. Mieczysława Pożaryskiego 32<br>
04-703 Warszawa
</address> <a href="/kontakt" class="mt-4 inline-flex text-sm font-semibold text-sun transition-colors hover:text-white">Zobacz mapę →</a> </section> </div> <div class="grid border-x border-white/10 border-t border-white/10 md:grid-cols-[1fr_auto]"> <div class="flex flex-wrap items-center gap-x-6 gap-y-4 px-6 py-5 md:px-8"> <p class="text-sm font-semibold uppercase tracking-[0.03em] text-white/55">Obserwuj nas</p> <div class="flex items-center gap-3 text-white/70" aria-label="Kanały społecznościowe Eco Tech Group"> <a href="https://www.facebook.com/RurystaloweHurtownia" target="_blank" rel="noopener noreferrer" class="grid size-8 place-items-center border border-white/20 transition-colors hover:border-sun hover:text-sun" aria-label="Eco Tech Group na Facebooku"> <svg viewBox="0 0 24 24" class="size-4 fill-current" aria-hidden="true"><path d="M13.5 21v-8h2.7l.4-3.1h-3.1v-2c0-.9.3-1.5 1.6-1.5h1.7V3.6c-.3 0-1.3-.1-2.4-.1-2.4 0-4.1 1.5-4.1 4.2v2.3H7.5V13h2.8v8h3.2Z"></path></svg> </a> <span class="grid size-8 place-items-center border border-white/20 text-xs font-bold" aria-label="LinkedIn">in</span> <span class="grid size-8 place-items-center border border-white/20" aria-label="YouTube"> <svg viewBox="0 0 24 24" class="size-4 fill-current" aria-hidden="true"><path d="M21.6 7.2a2.9 2.9 0 0 0-2-2C17.8 4.7 12 4.7 12 4.7s-5.8 0-7.6.5a2.9 2.9 0 0 0-2 2A30.1 30.1 0 0 0 2 12a30.1 30.1 0 0 0 .4 4.8 2.9 2.9 0 0 0 2 2c1.8.5 7.6.5 7.6.5s5.8 0 7.6-.5a2.9 2.9 0 0 0 2-2A30.1 30.1 0 0 0 22 12a30.1 30.1 0 0 0-.4-4.8ZM10.1 15.1V8.9l5.3 3.1-5.3 3.1Z"></path></svg> </span> </div> </div> <div class="flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-white/10 px-6 py-5 text-sm text-white/50 md:border-l md:border-t-0 md:px-8"> <a href="/polityka-prywatnosci" class="hover:text-white">Polityka prywatności</a> <a href="/kontakt" class="hover:text-white">Pliki cookies</a> </div> </div> <div class="grid gap-7 border-x border-white/10 border-t border-white/10 px-6 py-9 md:grid-cols-[minmax(14rem,0.8fr)_minmax(0,1.2fr)] md:items-center md:px-8 md:py-10"> <a href="/" class="w-fit" aria-label="Eco Tech Group — strona główna"> <img src="/img/logo/EcoTech_Logo_white.png" alt="Eco Tech Group" class="h-9 w-auto"> </a> <p class="max-w-2xl text-sm leading-6 text-white/45 md:justify-self-end">Eco Tech Group dostarcza rury stalowe, konstrukcje i rozwiązania dla projektów przemysłowych oraz infrastrukturalnych.</p> </div> </div> </footer>`;
}, "F:/Strony/Strony W toku/ecotech-astro/src/components/Footer.astro", void 0);

const $$LeadSourceTracker = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderScript($$result, "F:/Strony/Strony W toku/ecotech-astro/src/components/LeadSourceTracker.astro?astro&type=script&index=0&lang.ts")}`;
}, "F:/Strony/Strony W toku/ecotech-astro/src/components/LeadSourceTracker.astro", void 0);

const $$Astro = createAstro("https://ecotechgroup.pl");
const $$BaseLayout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$BaseLayout;
  const {
    title = "Eco Tech Group | Rury i konstrukcje stalowe",
    description = "Rury i konstrukcje stalowe"
  } = Astro2.props;
  const pageTransition = {
    forwards: {
      old: { name: "page-exit", duration: "180ms", easing: "ease-out", fillMode: "both" },
      new: { name: "page-enter", duration: "360ms", easing: "cubic-bezier(0.22, 1, 0.36, 1)", fillMode: "both" }
    },
    backwards: {
      old: { name: "page-exit", duration: "180ms", easing: "ease-out", fillMode: "both" },
      new: { name: "page-enter", duration: "360ms", easing: "cubic-bezier(0.22, 1, 0.36, 1)", fillMode: "both" }
    }
  };
  return renderTemplate`<html lang="pl"> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width"><meta name="description"${addAttribute(description, "content")}><meta name="generator"${addAttribute(Astro2.generator, "content")}><meta name="robots" content="noindex"><link rel="alternate" type="text/markdown"${addAttribute(Astro2.url.href, "href")}><title>${title} - EcoTech Group Sp. z o. o.</title>${renderComponent($$result, "ClientRouter", $$ClientRouter, {})}${renderHead()}</head> <body> ${renderComponent($$result, "LeadSourceTracker", $$LeadSourceTracker, {})} ${renderComponent($$result, "Header", $$Header, {})} <main${addAttribute(renderTransition($$result, "hrd3ipvg", pageTransition), "data-astro-transition-scope")}>${renderSlot($$result, $$slots["default"])}</main> ${renderComponent($$result, "Footer", $$Footer, {})} </body></html>`;
}, "F:/Strony/Strony W toku/ecotech-astro/src/layouts/BaseLayout.astro", "self");

export { $$BaseLayout as $ };
