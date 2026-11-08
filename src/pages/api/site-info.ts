import type { APIRoute } from 'astro';

export const prerender = false;

const payload = {
  name: 'Eco Tech Group Sp. z o.o.',
  description: 'Importer, dystrybutor i hurtownia rur stalowych oraz producent konstrukcji stalowych.',
  website: 'https://ecotechgroup.pl/',
  offer: [
    { name: 'Rury stalowe', url: 'https://ecotechgroup.pl/rury-stalowe/' },
    { name: 'Usługi obróbki i konserwacji rur', url: 'https://ecotechgroup.pl/uslugi/' },
    { name: 'Produkcja elementów i konstrukcji stalowych', url: 'https://ecotechgroup.pl/produkcja/' },
    { name: 'Dostawa rur stalowych', url: 'https://ecotechgroup.pl/dostawa-rur-stalowych/' }
  ],
  contact: {
    email: 'sprzedaz@ecotechgroup.pl',
    phone: '+48 508 299 077',
    address: 'ul. Mieczysława Pożaryskiego 32, 04-703 Warszawa, Polska',
    hours: 'poniedziałek–piątek, 8:00–16:00 Europe/Warsaw',
    url: 'https://ecotechgroup.pl/kontakt/'
  }
};

const response = () => Response.json(payload, {
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Cache-Control': 'public, max-age=3600',
    'X-Content-Type-Options': 'nosniff'
  }
});

export const GET: APIRoute = response;
export const HEAD: APIRoute = () => new Response(null, response());
