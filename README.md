# CATACLYSM // WEBFALL

Hard web CTF challenge.

## Local setup

Requires Node.js 18+.

```bash
npm install
REAL_FLAG='OXCODE{your_real_flag_here}' WEBFALL_TOKEN='webfall' npm start
```

Open `http://localhost:3000`.

On Windows PowerShell:

```powershell
$env:REAL_FLAG="OXCODE{your_real_flag_here}"
$env:WEBFALL_TOKEN="webfall"
npm start
```

## Render

Create a **Web Service**, not a Static Site.

- Build Command: `npm install`
- Start Command: `npm start`
- Environment variables:
  - `REAL_FLAG` = your actual competition flag
  - `WEBFALL_TOKEN` = `webfall` (or change it)

Never commit the real flag or `.env` file.

## Intended solve path

This is deliberately a reconnaissance-heavy prototype-pollution challenge.

A clean intended route is:

1. Inspect the public site and discover `robots.txt`.
2. Follow the hidden archive path.
3. Decode the Base64 relay labels.
4. Discover the JSON merge endpoint.
5. Identify that the merge is vulnerable to `__proto__`.
6. Confirm the inherited property through the diagnostic endpoint.
7. Decode the final node and token.
8. Access the final node after pollution.

The final flag is read only from `REAL_FLAG` on the server.
