export function maintenanceResponse() {
  return new Response(`<!doctype html>
<html lang="pl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="robots" content="noindex, nofollow, noarchive">
  <title>Prace konserwacyjne | Eco Tech Group</title>
  <style>
    body { margin: 0; padding: 80px 24px; text-align: center; font-family: 'Segoe UI', Tahoma, sans-serif; color: #333; }
    main { max-width: 680px; margin: auto; }
    h1 { font-size: clamp(28px, 5vw, 36px); color: #1D418E; }
    p { font-size: 18px; line-height: 1.5; }
  </style>
</head>
<body>
  <main aria-labelledby="maintenance-title">
    <h1 id="maintenance-title">Trwają prace techniczne</h1>
    <p>Aktualizujemy platformę technologiczną Eco Tech Group Sp. z o.o. w celu dostarczenia najwyższej jakości danych technicznych i parametrów asortymentowych. Zapraszamy ponownie za chwilę.</p>
  </main>
</body>
</html>`, {
    status: 503,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Retry-After': '3600',
      'X-Robots-Tag': 'noindex, nofollow, noarchive',
      'Cache-Control': 'no-store, no-cache, must-revalidate',
      'Netlify-CDN-Cache-Control': 'no-store'
    }
  });
}
