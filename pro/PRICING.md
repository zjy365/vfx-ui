# Pro pricing — rationale and promotion plan

## Prices

| Tier | Price | What |
|---|---|---|
| Solo | **$149** one-time | 1 developer, unlimited projects, 12 months of Pro releases |
| Team | **$299** one-time | up to 5 developers, one organization, priority support |

## Market anchors (checked at planning time, 2026-09)

| Product | Model | Price | What it proves |
|---|---|---|---|
| ReactBits Pro | one-time | $129 / $249 / $349 tiers | Devs pay ~$130–350 buyout for a React effects pack; the top tier is not 3× the price for 3× the value — it prices teams and superfans |
| Aceternity UI Pro | one-time | $199 | A single well-loved effects/landing component set clears $200 |
| Tailwind Plus | subscription | $299/yr | The ceiling for "component library" pricing; brand trust drives it |
| canvas-ui | MIT + Commons Clause | free, resale banned | The alternative monetization route; chosen against (breaks the "free stays MIT" promise) |

## Why $149 / $299

1. **Above ReactBits' entry ($129).** Pro's differentiator is real WebGPU/shader engineering — a higher-effort artifact than CSS/DOM effects, and the only such Pro library on the market. A premium of ~15% over the closest anchor is defensible without leaving the impulse-buy band (< $200).
2. **Team at 2× Solo ($299), not 3×.** ReactBits' implied team uplift and Tailwind Plus' $299 anchor make $299 feel standard for "small team, one-time". Five seats at $299 is a clear per-seat win versus 5 × $149, so teams upsize instead of buying five Solos.
3. **One-time, not subscription.** Differentiation vs Tailwind Plus; also honest — there is no hosted service to run. The 12-month release window (per `LICENSE-PRO.md` §4) leaves the door open for a future "renew for another year of drops" without ever bricking delivered code.
4. **Under the $350 ceiling.** Solo stays below the threshold where an individual dev needs manager approval; Team at $299 usually still fits a team budget line.

## Launch promotion

- **Launch code `LAUNCH30`** (−30%: Solo $104 / Team $209) for the **first 100 buyers or 14 days**, whichever ends first. Priced to make the first cohort cheap enough to seed testimonials, without anchoring the street price below $100.
- **Bundle hook:** every launch purchase enters the "founding buyers" list — their feature requests get first pick of the next Pro batch. Costs nothing, converts the cohort into a roadmap panel.
- **Distribution for the launch:** Product Hunt launch, X/Twitter thread with side-by-side free-vs-Pro shader demos (video, the product sells itself in motion), r/webdev + r/reactjs posts, pinned GitHub issue with a single Pro teaser GIF, and the Pro mention in the repo `README.md`.
- **Evergreen:** the `/pro` page keeps a "Free forever, MIT forever" banner — the upgrade path depends on the free tier staying credible. No countdown-timer dark patterns.

## Later options (not now)

- Student / OSS-maintainer discount (−50%, honor system, no verification overhead at launch).
- "Renewal" SKU ($99) once a second year of Pro releases exists.
- Site/company-wide license only on request (email, bespoke).
