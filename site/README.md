# agrometry.org

Static site served by a Cloudflare Worker (static assets). `npm run build` assembles
`dist/` from `public/` and the schemas in `../schema`.

Deploy is manual from a maintainer machine:

```
npx wrangler login
CLOUDFLARE_ACCOUNT_ID=<account that owns the zone> npm run deploy
```

The route in `wrangler.jsonc` attaches `agrometry.org` as a custom domain; the zone
must be on the same Cloudflare account.
