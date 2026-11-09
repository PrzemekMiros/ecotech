// Browser-safe definitions shared by WebMCP and the remote MCP server.
type AgentTool = {
  name: string;
  title: string;
  description: string;
  inputSchema: { type: 'object'; properties: Record<string, unknown>; required?: string[]; additionalProperties: false };
  annotations: { readOnlyHint: boolean; destructiveHint: boolean; idempotentHint: boolean; openWorldHint: boolean };
  execute(input: unknown): Record<string, unknown>;
};

const readOnly = { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false };

function parameters(input: unknown, allowed: string[]): Record<string, unknown> {
  if (!input || typeof input !== 'object' || Array.isArray(input)) throw new TypeError('Parametry muszą być obiektem.');
  if (Object.keys(input).some(key => !allowed.includes(key))) throw new TypeError('Nieznany parametr narzędzia.');
  return input as Record<string, unknown>;
}

export const agentTools: AgentTool[] = [
  {
    name: 'ecotech_company_contact',
    title: 'Dane kontaktowe Eco Tech Group',
    description: 'Zwraca oficjalne dane kontaktowe Eco Tech Group i adres formularza zapytania ofertowego.',
    inputSchema: { type: 'object', properties: {}, additionalProperties: false },
    annotations: readOnly,
    execute(input = {}) {
      parameters(input, []);
      return {
        company: 'Eco Tech Group Sp. z o.o.',
        email: 'sprzedaz@ecotechgroup.pl',
        phone: '+48 508 299 077',
        address: 'ul. Mieczysława Pożaryskiego 32, 04-703 Warszawa, Polska',
        hours: 'poniedziałek–piątek, 8:00–16:00 Europe/Warsaw',
        contactUrl: 'https://ecotechgroup.pl/kontakt/'
      };
    }
  },
  {
    name: 'ecotech_calculate_pipe_weight',
    title: 'Kalkulator masy rury stalowej',
    description: 'Oblicza orientacyjną masę jednego metra, jednej rury i całego zestawu rur stalowych na podstawie wymiarów.',
    inputSchema: {
      type: 'object',
      properties: {
        outerDiameterMm: { type: 'number', exclusiveMinimum: 0, description: 'Średnica zewnętrzna rury w milimetrach.' },
        wallThicknessMm: { type: 'number', exclusiveMinimum: 0, description: 'Grubość ścianki w milimetrach.' },
        lengthM: { type: 'number', exclusiveMinimum: 0, description: 'Długość jednej rury w metrach.' },
        quantity: { type: 'integer', minimum: 1, description: 'Liczba rur.' }
      },
      required: ['outerDiameterMm', 'wallThicknessMm', 'lengthM', 'quantity'],
      additionalProperties: false
    },
    annotations: readOnly,
    execute(input) {
      const values = parameters(input, ['outerDiameterMm', 'wallThicknessMm', 'lengthM', 'quantity']);
      for (const key of ['outerDiameterMm', 'wallThicknessMm', 'lengthM', 'quantity']) {
        const value = values[key];
        if (typeof value !== 'number' || !Number.isFinite(value) || value <= 0) throw new RangeError('Wszystkie parametry muszą być dodatnimi liczbami.');
      }
      const { outerDiameterMm: diameter, wallThicknessMm: thickness, lengthM: length, quantity } = values as Record<string, number>;
      if (!Number.isSafeInteger(quantity)) throw new RangeError('Liczba rur musi być bezpieczną liczbą całkowitą.');
      if (thickness * 2 >= diameter) throw new RangeError('Grubość ścianki musi być mniejsza niż połowa średnicy zewnętrznej.');
      const kgPerMeter = 0.02466 * thickness * (diameter - thickness);
      const kgPerPipe = kgPerMeter * length;
      const totalKg = kgPerPipe * quantity;
      if (![kgPerMeter, kgPerPipe, totalKg].every(Number.isFinite)) throw new RangeError('Wynik przekracza zakres obsługiwanych liczb.');
      return {
        kgPerMeter: Number(kgPerMeter.toFixed(2)),
        kgPerPipe: Number(kgPerPipe.toFixed(2)),
        totalKg: Number(totalKg.toFixed(2)),
        densityKgM3: 7850,
        approximate: true,
        calculatorUrl: 'https://ecotechgroup.pl/kalkulator-wagi-rur-stalowych/'
      };
    }
  }
];
