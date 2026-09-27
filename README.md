# Eco Tech Group — wersja Astro

Wstępny, statyczny szkielet strony firmowej w architekturze Jamstack.

## Uruchomienie

```bash
npm install
npm run dev
```

Strona będzie dostępna pod adresem wyświetlonym przez Astro (zwykle `http://localhost:4321`).

## Założenia

- Astro generuje strony statyczne (SSG), co sprzyja szybkości i SEO.
- Tailwind CSS odpowiada za style.
- Dane oferty są chwilowo wpisane w komponenty. W kolejnym etapie można je przenieść do plików Markdown/JSON lub do headless CMS.
- Formularz kontaktowy jest wizualnym szkieletem; wymaga podłączenia dostawcy formularza/API przed publikacją.
