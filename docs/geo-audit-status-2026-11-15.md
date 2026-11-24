# Stan realizacji audytu GEO — 15.11.2026

Porównanie dokumentu „Audyt GEO - ecotechgroup.pdf” (78 stron) z kodem Astro, publicznymi danymi Sanity i próbką odpowiedzi HTTP z https://ecotechnew.netlify.app. To przegląd braków, bez zmian w aplikacji i bez publikowania treści. Nie jest pełnym crawlem wszystkich adresów ani pomiarem Core Web Vitals.

## Najważniejsze ustalenia

1. **Nowa strona nie jest jeszcze na głównej domenie.** `ecotechgroup.pl` nadal zwraca HTML WordPressa. Astro działa na Netlify. Wdrożeń w repozytorium nie można traktować jako zakończonej naprawy produkcji.
2. **Treści lokalne i Sanity różnią się.** Lokalne 7 kategorii ma FAQ, Sanity: 0/7. Lokalne 30 artykułów ma FAQ i kluczowe wnioski; Sanity ma 28 artykułów, tylko 1 z FAQ i 0 z kluczowymi wnioskami. Sprawdzona kategoria na Netlify nie ma FAQPage, a artykuł „Ceny stali…” nie ma FAQPage ani DefinedTermSet. Sam szablon jest przygotowany. Uzupełnić brakujące pola w CMS, zachowując nowsze redakcyjne zmiany, następnie przebudować stronę.
3. **Brakuje przekierowań części starych produktów.** Adres z audytu `/rura-stalowa-bez-szwu-2191-x-63/` zwraca na Netlify 404, podczas gdy w repo istnieje produkt `/rura-stalowa-bez-szwu-fi-219-1-x-6-3-mm/`. Potrzebna mapa stary URL → właściwy nowy produkt, nie tylko obecna reguła skracająca adresy `/rury-stalowe/:category/:product/`.
4. **Galerie w importowanych treściach pozostają niepoprawione.** Na sprawdzonej stronie izolowania rur 6 obrazów nie ma wymiarów; sprawdzone obrazy galerii mają puste ALT-y. Na kategorii bez szwu 2 obrazy nie mają wymiarów, a w badanym artykule 3. Test `check:images` celowo pomija kontenery importowanych treści, więc sam jego pozytywny wynik nie zamyka tego punktu audytu.
5. **Karty produktów potrzebują danych handlowych i technicznych.** Lokalne 1551 produktów ma parametry i podsumowania, ale 0 ma `productionMethod`, `intendedUse` i dokumenty. Sanity również nie ma produktów z dokumentami. Należy uzupełniać potwierdzone dane i dokumenty właściwe dla konkretnego wariantu/partii, a nie dopisywać fikcyjne certyfikaty.

## Matryca wszystkich punktów audytu

„Częściowo” oznacza wdrożony mechanizm z brakami danych, zakresu lub weryfikacji. Ocena dotyczy nowej strony, chyba że wskazano inaczej.

| ID audytu | Obszar | Stan i pozostała praca |
|---|---|---|
| 2.1.1 | robots.txt | Przygotowany: reguły dla wyszukiwarek AI i ograniczenia botów. Zweryfikować politykę śledzących parametrów oraz zachowanie starych filtrów. Robots nie jest ochroną przed botem ignorującym dyrektywy. |
| 2.1.2 | Sitemap | Działa na Netlify: 1620 URL w badanym sitemap-0.xml, bez Wigilii 2023. Po migracji sprawdzić pełne pokrycie i zgłosić mapę głównej domeny w GSC/Bing. Brak osobnych map typów treści nie jest sam w sobie błędem. |
| 2.1.3 | llms.txt / llms-full.txt | Pliki istnieją; llms.txt odpowiada 200. Pozostaje utrzymywanie zgodności z faktyczną ofertą. Nie jest to warunek obecności w Google AI. |
| 2.1.4 | Markdown | Potwierdzone na Netlify: `Accept: text/markdown` → 200, typ text/markdown, Vary uwzględniające Accept. Główna domena nadal zwraca HTML. |
| 2.1.5 | HTTP i błędy | Dedykowana strona 404 działa; `/testowa/` i badana stara taksonomia dają 404. Usunięta usługa CNC daje 301 do głównej domeny `/uslugi/`. Dokończyć mapę starych produktów. Audyt jest niespójny co do 301/410 usług — wybrać według rzeczywistego następcy treści. |
| 2.1.6 | Meta Robots / X-Robots-Tag | Nowy filtr `?diameter=114.3` ma noindex, follow; Wigilia 2023 też. Obsługa dokumentów istnieje w middleware i netlify.toml. Stary `?swoof=1&pa_srednica=100` zwraca 200 bez X-Robots-Tag; rozstrzygnąć jego przekierowanie/wycofanie. Nie zakładać, że robots pozwoli botowi zobaczyć noindex na blokowanym URL. |
| 2.2.1 | Usługi | Częściowo: nowy layout i Service JSON-LD, ale importowane treści nadal wymagają technicznych podsumowań, tabel zakresów i FAQ; brak pól FAQ/TLDR w modelu usług. |
| 2.2.2 | Kategorie | Szablon ma TLDR, listing, poradnik, tabelę i warunkowe FAQ. Lokalne treści są bogatsze od CMS: uzupełnić 7 kategorii w Sanity i sprawdzić wynik po buildzie. |
| 2.2.3 | Produkty | Jest H1, SKU, parametry, podsumowanie, Product JSON-LD, formularz i poprawne główne zdjęcie. Brakuje dokumentów, szczegółowego przeznaczenia/metody produkcji w lokalnych danych. Zweryfikować zakres norm i gatunków dla konkretnych wariantów. Ukryć pustą zakładkę opinii zamiast pokazywać placeholder. |
| 2.2.4 | Artykuły | TOC, daty, autor, wnioski, FAQ, słownik i opcjonalny HowTo są w kodzie. Uzupełnić dane CMS; autor jest globalnie przypisany jako Adam Iwanowski — potwierdzić rzeczywiste autorstwo/recenzję, ewentualnie dodać prawdziwy profil. |
| 2.2.5 | Klastry tematyczne | Długofalowa praca redakcyjna pozostaje. PDF proponuje 17 klastrów i odsyła do 174 tematów w osobnym `analiza seo.xlsx`. Bez tego załącznika nie da się sprawdzić każdej pozycji tematycznej. |
| 2.2.6 | Linkowanie wewnętrzne | Zwykłe linki w treści i kategoriach istnieją. Brakuje systematycznej relacji produkt/kategoria ↔ właściwy poradnik. „Powiązane” artykuły wybierane są według daty, nie tematu. Nie wdrażać maskowania linków Base64. |
| 2.2.7 | Dane strukturalne | Podstawowy graf Organization/WebSite/WebPage, breadcrumbs, Product, Service, ItemList i BlogPosting działa w próbie HTTP. FAQ i słowniki zależą od brakujących danych CMS. Dokończyć walidację reprezentatywnych stron; nie dodawać ceny 0 ani niepotwierdzonej dostępności. |
| 2.2.8 | Nagłówki | W badanych stronach po jednym H1; produkty kategorii nie generują masowych H2. Pozostały importowane nagłówki oraz H2 tytułów powiązanych artykułów. Zweryfikować logiczną hierarchię, bez mechanicznego zakazu nagłówków w nawigacji. |
| 2.2.9 | Title / description | W sprawdzonym produkcie nie ma surowego `[page_title]`. Meta description to całe długie podsumowanie techniczne; potrzebuje osobnego, zwięzłego pola. Opisy usług i artykułów nadal mają stare wstępy/ucięcia. |
| 2.2.10 | Duplikacja | Warianty mają odrębne wymiary i URL; opis handlowy nadal szablonowy. Sprawdzić mapę wariantów i 19 lokalnych stron dostaw. Nie scalać różnych produktów wyłącznie z powodu podobieństwa opisu. |
| 2.2.11 | URL / canonical | Badane produkty mają canonical do swojego URL na domenie docelowej, bez błędu kierowania na kategorię. Brakuje mapowania starych slugów. Testowa domena nie ma globalnego noindex w sprawdzonej odpowiedzi — ustalić ochronę stagingu, nie przenosząc jej na produkcję. |
| 2.3.1 | Core Web Vitals | Niepotwierdzone. Astro i priorytety obrazów są wdrożone, ale brak świeżego pomiaru LCP/INP/CLS. Wyniki WordPressa z audytu nie opisują nowej strony. Wykonać PageSpeed/Lighthouse oraz później ocenę danych rzeczywistych. |
| 2.3.2 | Dostępność | Formularze i filtry mają etykiety; brak pełnej weryfikacji klawiatury, kontrastów, fokusu, błędów i czytnika ekranu. Nie deklarować zgodności WCAG na podstawie kodu. |
| 2.3.3 | Mobile | Responsywne szablony i przewijanie tabel kategorii są w kodzie. Pozostaje test 320–390 px, tabel usług, filtrów, menu i formularzy. |
| 2.3.4 | Grafiki | Główne zdjęcia szablonów mają wymiary i priorytet. Galerie importowane nadal wymagają wymiarów/ALT i optymalizacji. Są duże zasoby, np. offer-workshop-technician.png ~2,14 MB i o-firmie.png ~774 kB; sprawdzić ich faktyczne użycie i wariant dostarczany do przeglądarki, następnie kompresować. |
| 2.4.1 | Ukryta treść / keyword stuffing | Brak pełnego ręcznego przeglądu. Ukryte kolejne produkty kategorii mają przycisk „Zobacz więcej” i fallback noscript — to funkcja UI, nie automatycznie spam. Przejrzeć powtarzalne treści lokalne. |
| 2.4.2 | Strony lokalne | 19 stron w repo. Przykładowe treści opisują ogólną ofertę, bez udokumentowanych realizacji lokalnych. Dodać rzeczywiste informacje o dostawie i realizacjach albo konsolidować słabe strony; nie wymyślać oddziałów. |
| 2.4.3 | Puste taksonomie | Badana stara taksonomia daje 404, nowe filtry mają noindex. Do sprawdzenia komplet starych URL i parametrów z eksportu WordPressa/GSC. |
| 2.4.4 | Spam / scraping | Formularz ma honeypot i walidację; w endpointcie brak limitu częstotliwości oraz weryfikacji Turnstile. Rozważyć limitowanie na serwerze/edge i ochronę formularza. Konfiguracji ochrony konta Netlify nie oceniano. |

## Kolejność dalszych prac

1. Uzgodnić dane lokalne z CMS: FAQ kategorii, wnioski/FAQ/słowniki artykułów; porównać również brakujące 2 artykuły, bez automatycznego przywracania celowo usuniętych.
2. Zbudować mapę przekierowań starych URL, szczególnie produktów, i zweryfikować próbę stary URL → 301 → właściwy produkt 200.
3. Poprawić importowane obrazy, metadane oraz treści usług; wykonać pomiary mobile i szybkości.
4. Uzupełnić prawdziwe dokumenty i parametry produktów, lokalne realizacje oraz tematyczne linkowanie.
5. Przed uruchomieniem głównej domeny wykonać crawl, walidację schema, kontrolę robots/canonical/sitemap i formularzy. Po uruchomieniu zgłosić sitemap i monitorować indeksację w GSC/Bing.

## Rekomendacje audytu wymagające korekty

- Nie wpisywać fikcyjnej ceny „0 zł”, `InStock`, numeru certyfikatu ani fikcyjnego autora. Dane strukturalne mają odzwierciedlać faktyczne, widoczne informacje: https://developers.google.com/search/docs/appearance/structured-data/sd-policies
- Nie maskować zwykłych linków Base64 w celu „PageRank sculpting”. Zachować crawlable `<a href>`: https://developers.google.com/search/docs/crawling-indexing/links-crawlable
- Nie traktować llms.txt, Markdown i MCP jako gwarancji cytowań ani obowiązkowego warunku Google AI: https://developers.google.com/search/docs/appearance/ai-features
- Instrukcje PHP, WooCommerce, Rank Math, FlyingPress i wtyczek WordPress nie mają bezpośredniego zastosowania do Astro. Oceniamy efekt, nie instalację wskazanej wtyczki.
- Nie ma podstaw do przejęcia z PDF szacunku 206 roboczogodzin jako pozostałego zakresu: wiele elementów jest już wdrożonych, a sam dokument zawiera różne sumy etapów.

## Granice weryfikacji

Nie wykonano pełnego crawla, audytu WCAG ani pomiaru Core Web Vitals; nie sprawdzono prywatnych kont GSC/Bing/GA4 ani konfiguracji WAF. Nie przesyłano testowych formularzy i nie zmieniano danych CMS. Brak osobnego arkusza `analiza seo.xlsx` uniemożliwia sprawdzenie całej listy historycznych adresów i tematów. Publiczne liczniki Sanity odczytano bez danych formularzy i bez tokenów.
