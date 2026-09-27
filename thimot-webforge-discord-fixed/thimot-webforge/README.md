# Thimot WebForge

Professional website agency storefront. Prices are in MAD, starting at 1,500 MAD.

## Run locally
Requires Node.js 18+.

1. Open a terminal in this folder.
2. Run `node server.js`.
3. Open http://localhost:3000

The included `.env` contains the Discord webhook supplied for this project. For production, set `DISCORD_WEBHOOK_URL` in your hosting provider instead and regenerate the webhook if it has been exposed.

## Vercel
Import this folder as a project and add an Environment Variable named `DISCORD_WEBHOOK_URL` containing your Discord webhook. The `/api/order` endpoint will receive the form and send the order to Discord. Do not put the webhook URL in `public/index.html`.
