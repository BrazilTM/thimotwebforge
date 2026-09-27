# Thimot WebForge — GitHub Pages

This folder is ready to upload directly to the root of a GitHub repository.

## GitHub Pages
1. Put `index.html` in the repository root.
2. GitHub: Settings → Pages → Deploy from a branch → `main` → `/ (root)`.
3. Save and wait for GitHub Pages to publish.

## Discord orders
GitHub Pages is static hosting and cannot securely run the Discord webhook backend. Keep the Discord webhook on a serverless backend such as Vercel and point the order form to that API.
