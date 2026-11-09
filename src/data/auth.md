# Dostęp agentów do Eco Tech Group

Wersja: 1.1.0

## Aktualny model dostępu

Serwis nie prowadzi kont użytkowników i nie oferuje agentom rejestracji, kluczy API ani tokenów OAuth. Publiczne strony, dokumentacja oraz interfejs tylko do odczytu są dostępne anonimowo przez HTTPS.

## Publiczny interfejs tylko do odczytu

- Specyfikacja OpenAPI: `https://ecotechgroup.pl/openapi.json`
- Katalog API: `https://ecotechgroup.pl/.well-known/api-catalog`
- Informacje o firmie: `GET https://ecotechgroup.pl/api/site-info`
- Uwierzytelnienie: niewymagane
- Zakres: publiczne informacje o firmie, ofercie i kontakcie

Nie należy przesyłać nagłówka `Authorization`. Serwis nie publikuje metadanych OAuth/OIDC ani OAuth Protected Resource, ponieważ żaden publiczny zasób nie wymaga logowania.

## Działania wymagające zgody człowieka

Zapytania ofertowe zawierają dane osobowe i wymagają świadomej zgody użytkownika. Agent powinien otworzyć formularz `https://ecotechgroup.pl/kontakt/`, przedstawić użytkownikowi treść i uzyskać jego zgodę przed wysłaniem. Publiczny interfejs tylko do odczytu nie wysyła zapytań i nie składa zamówień.

## MCP i A2A

Publiczny serwer MCP jest dostępny pod `https://ecotechgroup.pl/api/mcp` (Streamable HTTP, POST, bez sesji). Karta serwera: `https://ecotechgroup.pl/.well-known/mcp/server-card.json`. Uwierzytelnienie nie jest wymagane. Narzędzia udostępniają wyłącznie publiczne dane kontaktowe i obliczanie masy rur; nie mają dostępu do danych klientów ani możliwości zapisu. Szczegóły i parametry: `/docs/agents.md`.

Serwis nie udostępnia agenta A2A; brak jego karty jest zamierzony.
