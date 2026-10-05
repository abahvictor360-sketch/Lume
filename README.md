# Lume

A responsive (mobile + desktop) lamp storefront with a dark, gold-accented design: Discover, Product and Cart pages.

- Plain HTML/CSS/JS, so there's no build step. Product data is in `js/data.js`.
- The cart is saved in `localStorage`. Checkout uses a swipe-to-order control.
- The product photos in `img/` have had their backgrounds removed and are saved as transparent WebP files.

## Run locally

```sh
npx serve .
```

## Deploy

Deploys to Vercel as a static site (`vercel.json` turns on clean URLs, e.g. `/product?id=helix`).

## Pages

`/` Discover · `/product?id=…` · `/cart` · `/contact` · `/terms` · `/privacy` · `/login` · `/signup` · `/account`

## Accounts

Login and sign-up run in **demo mode** by default, which means accounts are stored only in the visitor's browser. To use real accounts, add your Supabase project URL and publishable key to `js/config.js`. Auth then switches to Supabase Auth automatically. The contact email, phone and address are also set in `js/config.js`.
