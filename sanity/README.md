# Sanity — Eco Tech Group

## Pierwsze uruchomienie

1. Utwórz projekt i dataset `production` w https://www.sanity.io/manage (lub użyj istniejących).
2. Dopisz do istniejącego `.env` zmienne z sekcji Sanity w `.env.example`. Ustaw `SANITY_STUDIO_PROJECT_ID` i `SANITY_STUDIO_DATASET`. Na razie pozostaw `CONTENT_SOURCE=local`.
3. Uruchom `npm run studio`. Panel działa oddzielnie od Astro pod `http://localhost:3333`. Zaloguj się kontem z dostępem do projektu. Jeśli wymagane, dodaj ten adres do CORS Origins projektu Sanity z obsługą credentials.
4. Wykonaj `npm run sanity:export`, aby przygotować `sanity-export/content.ndjson` z obecnych plików. Eksport niczego nie wysyła i nie zmienia plików źródłowych.
5. Zaloguj CLI: `npx sanity login`. Następnie zaimportuj do właściwego datasetu: `npx sanity dataset import sanity-export/content.ndjson production`. Nie dodawaj `--replace`, chyba że świadomie chcesz nadpisać edycje wykonane w CMS. Dokumenty mają stabilne identyfikatory.
6. Sprawdź treści w Studio, ustaw `CONTENT_SOURCE=sanity`, zrestartuj Astro i wykonaj `npm run build`.

Publiczny dataset nie wymaga tokenu odczytu. Dla prywatnego ustaw `SANITY_API_READ_TOKEN` z uprawnieniami Viewer. Nigdy nie nadawaj tokenowi prefiksu `SANITY_STUDIO_` ani `PUBLIC_`, bo takie zmienne mogą trafić do przeglądarki.

## Zakres edycji

Panel zawiera aktualności, usługi, produkcję, oferty pracy, dostawy, kategorie rur i produkty. Pozostałe elementy strony (np. strona główna, menu, stopka, kontakt) nadal edytuje się w kodzie Astro.

Treść dokumentów jest polem tekstowym Markdown/HTML, aby zachować istniejące układy i klasy HTML. To nie jest edytor wizualny Portable Text. Pola SEO, daty, parametry, FAQ i dokumenty mają osobne kontrolki. Slug produktu w polu kategorii musi odpowiadać istniejącej kategorii rur.

Istniejące zdjęcia zachowują adresy `/img/...` i są nadal serwowane z katalogu `public`. Można zastąpić je zdjęciem przesłanym do pola „Zdjęcie”. Pliki PDF dodaje się przez adres URL. Import nie kopiuje mediów do Sanity.

## Publikacja

Loader pobiera wyłącznie opublikowane dokumenty podczas `astro build` lub synchronizacji treści w trybie developerskim. Samo kliknięcie Publish w CMS nie odświeża wdrożonej strony, również przy SSR. Po zmianach uruchom ponowny build/deploy; opcjonalnie skonfiguruj webhook Sanity (create/update/delete dokumentów, bez draftów) wskazujący na Netlify Build Hook. W lokalnym dev zrestartuj serwer po publikacji.

Na hostingu ustaw `CONTENT_SOURCE=sanity`, identyfikator projektu, dataset i ewentualny token odczytu. Najpierw zaimportuj wszystkie kolekcje: po przełączeniu puste kolekcje Sanity pozostają puste, bez domieszki lokalnych wpisów. Błędy pobierania lub walidacji przerywają build. Powrót do `CONTENT_SOURCE=local` przywraca lokalne treści przy następnym buildzie.

`npm run studio:build` buduje oddzielny panel do `sanity-dist`. `npm run studio:deploy` publikuje panel na Sanity Hosting po zalogowaniu. Nie jest on osadzony pod `/studio` na stronie Astro.

Studio 3 i klient 6 zostały dobrane do lokalnego Node 20. Przed aktualizacją Sanity do najnowszej głównej wersji zaktualizuj Node (obecne wydania wymagają co najmniej 22.12). Niektóre istniejące zależności Netlify wymagają już Node 22.19 lub nowszego.

Dokumentacja: [Astro Content Loader](https://docs.astro.build/en/reference/content-loader-reference/), [konfiguracja Studio](https://www.sanity.io/docs/studio/configuration).
