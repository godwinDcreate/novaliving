# NØVA Living

Contemporary furniture storefront (static HTML + Express).

## Setup

```bash
npm install
npm start
```

Open [http://localhost:3000](http://localhost:3000).

## Deploy (Vercel)

Static files live in `public/` so Vercel can serve CSS, images, and scripts via its CDN. Express's `express.static()` is ignored on Vercel — assets outside `public/` will 404 and the site will look unstyled.
