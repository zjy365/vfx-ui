# Pro delivery design — purchase → license → private registry

Status: **design only**. Nothing here is implemented yet; this document is the build spec for the delivery batch. It runs on Cloudflare (the site already lives on Cloudflare Pages; delivery adds a Worker + KV/D1).

## 0. Pieces

| Piece | Where | Notes |
|---|---|---|
| Checkout page | `/pro` (`ProPage.tsx`) | CTA → Creem hosted checkout |
| Checkout API proxy | Cloudflare Worker `vfx-ui-pro` | Holds `CREEM_API_KEY`, calls Creem |
| Webhook receiver | same Worker, `POST /api/creem/webhook` | Verifies HMAC, mints license |
| License store | Worker KV or D1 `licenses` | key → {email, plan, seats, created_at, status} |
| Private registry | same Worker, `GET /pro/r/:item.json` | Token-gated shadcn registry JSON |
| Pro registry source | `pro/components`, `pro/templates` → built JSON | Built into `registry/dist/pro` in CI, deployed with the Worker (not into public Pages assets) |

Why a proxy: `CREEM_API_KEY` is a secret — checkout creation must happen server-side; the docs SPA never sees it. The SPA's `apps/docs/src/lib/creem.ts` wraps this proxy.

## 1. Checkout

```
User clicks "Buy Solo" on /pro
  → SPA: createCheckout(CREEM_SOLO_VARIANT_ID, successUrl)      [creem.ts]
  → POST {origin}/api/creem/checkout                            [Worker]
      body: { variantId, successUrl }
      Worker checks variantId is one of the two allowlisted Pro variants
  → Worker → POST https://api.creem.io/v1/checkouts             [x-api-key]
      body: { product_variant_id: variantId,
              success_url: "https://vfx-ui.com/pro/welcome",
              metadata: { plan: "solo" | "team" } }
  → Worker returns { checkoutUrl }
  → SPA: window.location.assign(checkoutUrl)
```

Test mode: `CREEM_TEST_MODE=true` switches the base to `https://test-api.creem.io` and expects test keys. Creem (merchant of record) handles payment incl. Alipay, global taxes, and the receipt email.

## 2. Webhook → license minting

Creem calls `POST /api/creem/webhook` on payment events. Signature: HMAC-SHA256 hex digest of the **raw** request body, in the `creem-signature` header (accept `creem-hmac-sha256` as an alias), keyed with `CREEM_WEBHOOK_SECRET`.

```ts
// Worker pseudocode — not implemented
export async function handleWebhook(request, env) {
  const raw = await request.text();
  const signature = request.headers.get("creem-signature");
  const expected = await hmacSha256Hex(env.CREEM_WEBHOOK_SECRET, raw);
  if (!timingSafeEqualHex(signature, expected)) return new Response("bad signature", { status: 401 });

  const event = JSON.parse(raw);
  switch (event.eventType) {
    case "checkout.completed": {           // or payment.paid / order.paid
      const email = event.object.customer?.email;
      const plan  = event.object.metadata?.plan;         // "solo" | "team", set at checkout
      const key   = `vfxp_${crypto.randomUUID().replace(/-/g, "")}`;   // license key
      await env.LICENSES.put(key, JSON.stringify({
        email, plan, seats: plan === "team" ? 5 : 1,
        checkoutId: event.object.id,
        created_at: Date.now(), status: "active",
      }));
      // success path: user is on /pro/welcome; the page polls GET /api/license/status?checkout_id=…
      return Response.json({ ok: true });
    }
    case "refund.created": {
      // mark license revoked so the token stops working
      const lic = await findByCheckoutId(event.object.id);
      if (lic) await env.LICENSES.put(lic.key, { ...lic, status: "revoked" });
      return Response.json({ ok: true });
    }
  }
  return Response.json({ ok: true });      // ack unknown events
}
```

Success page `/pro/welcome` polls `GET /api/license/status?checkout_id=<id>` until the webhook lands, then displays:

- the license key,
- the install snippet: `npx shadcn add "https://vfx-ui.com/pro/r/pro-holo-grid.json?token=vfxp_…"`
- the support email and license terms link (`pro/LICENSE-PRO.md`).

## 3. Private registry — token-gated fetch

Pro items are standard shadcn registry item JSON, served under `https://vfx-ui.com/pro/r/<item>.json`. The token travels as a query parameter (the shadcn CLI has no header hook), which makes URLs secret-bearing — acceptable here because each URL is user-specific, and keys are rotatable.

```ts
// Worker pseudocode — not implemented
export async function handleRegistryItem(request, env) {
  const url    = new URL(request.url);
  const item   = url.pathname.match(/^\/pro\/r\/([a-z0-9-]+)\.json$/)?.[1];
  const token  = url.searchParams.get("token");
  if (!item || !token) return new Response("Not found", { status: 404 });

  const license = JSON.parse((await env.LICENSES.get(token)) ?? "null");
  if (!license || license.status !== "active") return new Response("Invalid license key", { status: 403 });

  const body = await env.PRO_REGISTRY.get(`${item}.json`);   // KV/D1, populated by CI build
  if (!body) return new Response("Not found", { status: 404 });

  return new Response(body, {
    headers: {
      "content-type": "application/json",
      "cache-control": "private, no-store",   // never cache at edge for tokened responses
    },
  });
}
```

Install from the user's side (identical DX to the free registry):

```bash
npx shadcn add "https://vfx-ui.com/pro/r/pro-holo-grid.json?token=vfxp_YOUR_KEY"
```

Notes:

- Rate-limit `/pro/r/*` per token (e.g. 60 req/min) to discourage token brute force; keys are high-entropy UUIDs anyway.
- Refunds revoke the key; `no-store` keeps revoked tokens from lingering in shared caches.
- Registry item JSON embeds `files[].content` like the free registry, so the CLI copies real sources into the user's project — the "source-available on purchase" promise in `LICENSE-PRO.md`.

## 4. Build & deploy (CI)

1. `pro/components` and `pro/templates` compile to shadcn registry JSON via the existing `registry/build.mjs` pipeline (extended with a `--pro` input), emitting into `registry/dist/pro/`.
2. `registry/dist/pro/*.json` upload to the Worker's KV/D1 — **not** copied to `apps/docs/public/r/`, which stays public/MIT-only.
3. Worker secrets: `CREEM_API_KEY`, `CREEM_WEBHOOK_SECRET`; vars: `CREEM_SOLO_VARIANT_ID`, `CREEM_TEAM_VARIANT_ID`, `CREEM_TEST_MODE`.

## 5. Environment variables (full list)

| Variable | Where | Secret | Example |
|---|---|---|---|
| `CREEM_API_KEY` | Worker (`wrangler secret put`) | yes | `creem_live_…` / test key |
| `CREEM_WEBHOOK_SECRET` | Worker | yes | from Creem dashboard → Webhooks |
| `CREEM_SOLO_VARIANT_ID` | Worker + docs SPA (`VITE_`-prefixed client copy optional) | no | `prod_var_…` |
| `CREEM_TEAM_VARIANT_ID` | Worker | no | `prod_var_…` |
| `CREEM_TEST_MODE` | Worker + SPA | no | `"true"` → use `test-api.creem.io` |

The SPA (`apps/docs/src/lib/creem.ts`) reads only the non-secret variants plus its own `VITE_CREEM_API_BASE` override for local dev; `CREEM_API_KEY` must never be exposed to the client bundle.

## 6. Failure modes

- **Webhook delay:** welcome page polls with backoff for up to ~2 min, then offers a "resend license" email link backed by the same license store.
- **Chargeback/refund:** `refund.created` (or manual dashboard action) flips `status: "revoked"`; registry fetches 403.
- **Token leak:** buyer emails support; old key revoked, new key minted with `rotated_from` linkage.
