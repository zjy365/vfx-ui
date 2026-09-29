# VFX UI Pro

The commercial tier of VFX UI: shader- and WebGPU-grade components that go beyond what the free MIT catalog ships. The free tier stays MIT forever; Pro is how the project funds itself.

## Positioning

- **Free tier** (this repository): the full MIT-licensed `packages/react` library plus the public copy-paste registry. Commitment unchanged.
- **Pro tier** (this directory): a source-available, paid extension focused on the layer competitors do not reach — advanced WebGPU/shader scenes, production page templates, and the highest-effort compositions. No other React component library sells this tier: ReactBits Pro stops at DOM/CSS effects, canvas-ui is MIT with Commons Clause. VFX UI Pro is the only Pro library whose centerpiece is real GPU rendering.

## What is included

| | Free (MIT) | Pro |
|---|---|---|
| Component library `@vfx-ui/react` | Yes | Yes |
| Public copy-paste registry (`registry/`) | Yes | Yes |
| Advanced WebGPU/shader Pro components | — | Yes (`pro/components/`, filled in later batches) |
| Complete page templates & sections | Example pages only | Yes (`pro/templates/`, filled in later batches) |
| Private token-gated registry | — | Yes (`https://vfx-ui.com/pro/r/<item>.json`) |
| Updates | Community | 12 months of new Pro releases per purchase |
| Support | GitHub issues | Email support (Team: priority) |

Pro items are delivered through the same `npx shadcn add` flow as the free registry — you own the code once it lands in your project. See [DELIVERY.md](./DELIVERY.md).

## Pricing

One-time purchase, no subscription:

| Tier | Price | Seats | Notes |
|---|---|---|---|
| **Solo** | **$149** | 1 developer | Personal, client, and commercial projects. Unlimited end products. |
| **Team** | **$299** | up to 5 developers | Everything in Solo, for one company/team. Priority support. |

Both tiers are perpetual licenses for everything released during the 12 months after purchase. Rationale and anchors: [PRICING.md](./PRICING.md).

## Licensing

Pro is **source-available**, not open source:

- Purchase grants access: the buyer receives a license key and can download/read every source file through the private registry (sources are delivered, not obfuscated).
- Use in unlimited personal and commercial projects — including client work and paid SaaS products.
- **You may not** redistribute or resell the Pro sources, publish them in another registry/template pack, or use them to build a competing component/template product.
- Team license covers up to 5 developers within one organization; beyond that, buy additional team licenses.

Full terms: [LICENSE-PRO.md](./LICENSE-PRO.md). The free tier remains MIT ([../LICENSE](../LICENSE)) — Pro changes nothing about it.

## Buying and delivery

1. Checkout runs through **Creem** (merchant of record; handles global taxes and pays out incl. Alipay).
2. On payment, a webhook generates a license key bound to the buyer's email.
3. The key unlocks the private registry: `npx shadcn add https://vfx-ui.com/pro/r/<item>.json` with the key as token.
4. Sources land in your project. You own the copy; the license governs redistribution.

End-to-end design (webhook, license keys, Cloudflare Worker validation — designed, not yet implemented): [DELIVERY.md](./DELIVERY.md).

## How free users upgrade (acquisition)

- Every free component page stays complete and usable — Pro is never a crippled free tier.
- Pro items appear in the catalog as "Pro" badged entries with live previews; only the source fetch requires a key. See the visual spec in [../DESIGN.md](../DESIGN.md).
- The `/pro` page (`apps/docs/src/components/ProPage.tsx`) carries the pricing cards, comparison table, and FAQ; its CTA points at the Creem checkout (placeholder until launch).
- Launch sequence: Product Hunt / X / Reddit post with a launch code discount ([PRICING.md](./PRICING.md)), pinned GitHub issue with a Pro teaser, and a Pro mention in `README.md` that repeats the MIT promise.

## Directory layout

```
pro/
├── README.md          # this file
├── LICENSE-PRO.md     # commercial single/team license terms
├── PRICING.md         # price anchors and launch promotion plan
├── DELIVERY.md        # purchase → webhook → license → private registry design
├── components/        # Pro components (later batches)
└── templates/         # Pro page templates (later batches)
```
