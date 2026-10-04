# Thirty in Lamu static site prototype

Files:
- `index.html` — the public-facing birthday site.
- `site-data.json` — all editable copy, image URLs, links, flight rows, and loose password.
- `edit.html` — a browser-based editor for `site-data.json`.
- `styles.css`, `script.js`, `edit.js` — presentation and behavior.

Default loose password: `lamu30`

How editing works:
1. Open `edit.html`.
2. Change copy, links, image URLs, password, activities, or flights.
3. Use **Save to browser** to preview locally in the same browser.
4. Use **Download JSON** and replace `site-data.json` with the downloaded file before deploying or sharing.

Note on password protection:
This is intentionally lightweight front-end protection only. It keeps casual visitors out, but anyone technical can inspect the files and bypass it. For real protection, deploy behind hosting-level password protection such as Netlify password protection, Vercel middleware, Cloudflare Access, or basic auth.
