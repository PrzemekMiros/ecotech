# Eco Tech Group

Strona Astro z obsługą formularzy przekazywanych do CRM Firmao.

## Uruchomienie

```bash
npm install
npm run dev
```

## Konfiguracja Firmao

1. Skopiuj `.env.example` do pliku `.env`.
2. Ustaw `FIRMAO_ORGANIZATION_ID` (fragment adresu URL panelu Firmao po zalogowaniu), `FIRMAO_API_LOGIN` i `FIRMAO_API_PASSWORD`.
3. Upewnij się w Firmao, że API jest włączone dla używanego konta.

Zmienne nie mogą mieć prefiksu `PUBLIC_`; są odczytywane wyłącznie przez endpoint serwerowy. Każde zapytanie tworzy kontrahenta (lub używa istniejącego kontrahenta o tym samym NIP-ie) i dodaje do niego notatkę handlową.

## Wdrożenie

Formularze wymagają hostingu obsługującego Node.js. Po wdrożeniu skonfiguruj te same trzy zmienne środowiskowe w panelu hostingu, zbuduj stronę poleceniem `npm run build` i uruchom ją przez `npm run start`.

