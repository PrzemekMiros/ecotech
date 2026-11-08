---
name: pipe-weight-calculator
description: Oblicz orientacyjną masę rur stalowych z ich średnicy zewnętrznej, grubości ścianki, długości i liczby sztuk. Użyj, gdy użytkownik pyta o wagę pojedynczej rury lub całej partii.
---

# Kalkulator masy rur stalowych

1. Zbierz średnicę zewnętrzną `D` w mm, grubość ścianki `s` w mm, długość jednej rury `L` w m i liczbę sztuk `n`.
2. Sprawdź, czy wszystkie wartości są dodatnie, `n` jest liczbą całkowitą, a `2 × s < D`.
3. Oblicz masę jednego metra: `kg/m = 0,02466 × s × (D − s)`.
4. Oblicz masę jednej rury: `kg/rura = kg/m × L`.
5. Oblicz masę całkowitą: `kg = kg/rura × n`.
6. Zaokrąglij wyniki do dwóch miejsc po przecinku i zaznacz, że są orientacyjne dla gęstości stali 7 850 kg/m³.

Jeśli użytkownik potrzebuje potwierdzenia handlowego lub dokładnej wyceny, skieruj go do `https://ecotechgroup.pl/kontakt/`. Nie deklaruj dostępności towaru ani ceny bez potwierdzenia przez dział sprzedaży.
