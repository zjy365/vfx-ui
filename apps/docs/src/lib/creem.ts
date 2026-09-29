/**
 * Creem checkout integration for VFX UI Pro.
 *
 * Architecture (see pro/DELIVERY.md — designed, not yet implemented):
 * - The docs SPA never talks to Creem directly with credentials. It POSTs to a
 *   same-origin Cloudflare Worker proxy (`/api/creem/checkout`) that holds the
 *   secret `CREEM_API_KEY`.
 * - This module can also run server-side (Node / Worker), where it calls the
 *   Creem REST API directly when `CREEM_API_KEY` is present in the runtime.
 *
 * Environment variables:
 * - `CREEM_API_KEY`            secret; server/Worker only. Never prefixed with
 *                              `VITE_` — it must not reach the client bundle.
 * - `CREEM_SOLO_VARIANT_ID`    Creem product/variant id for the $149 Solo tier.
 * - `CREEM_TEAM_VARIANT_ID`    Creem product/variant id for the $299 Team tier.
 * - `CREEM_TEST_MODE`          "true"/"1" switches to Creem's test environment.
 * - `CREEM_API_BASE`           optional API base override (defaults below).
 * - `CREEM_CHECKOUT_ENDPOINT`  optional proxy endpoint (default `/api/creem/checkout`).
 *
 * The variant ids are safe to expose to the SPA (`VITE_CREEM_*` copies); they only
 * identify which product the proxy is asked to check out.
 */

/** Pro purchase tiers as configured in the Creem dashboard. */
export type CreemTier = "solo" | "team";

/** A checkout session as created by Creem (POST /v1/checkouts). */
export type CreemCheckoutSession = {
  /** Creem checkout id, e.g. `ch_…`. */
  id: string;
  /** Hosted checkout URL to redirect the buyer to, e.g. `https://checkout.creem.io/ch_…`. */
  checkoutUrl: string;
  /** Product id the session was created for, when Creem returns it. */
  productId?: string;
  /** Session status, e.g. `pending`. */
  status?: string;
};

export type CreateCheckoutOptions = {
  /** Idempotency/order reference forwarded as `request_id`. */
  requestId?: string;
  /** Arbitrary metadata Creem echoes back in the webhook (e.g. `{ plan: "solo" }`). */
  metadata?: Record<string, string>;
  /** Fetch implementation override, e.g. for tests. */
  fetch?: typeof fetch;
};

export class CreemError extends Error {
  readonly status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = "CreemError";
    this.status = status;
  }
}

const LIVE_API_BASE = "https://api.creem.io";
const TEST_API_BASE = "https://test-api.creem.io";
const DEFAULT_CHECKOUT_ENDPOINT = "/api/creem/checkout";

/* Environment access that works in the browser (Vite), Node, and Workers. */

function readEnv(key: string): string | undefined {
  // import.meta.env is typed by vite/client; runtime value is undefined outside Vite.
  const viteValue: unknown = import.meta.env?.[key];
  if (typeof viteValue === "string" && viteValue.length > 0) return viteValue;

  const proc = (globalThis as { process?: { env?: Record<string, unknown> } }).process;
  const procValue: unknown = proc?.env?.[key];
  if (typeof procValue === "string" && procValue.length > 0) return procValue;

  return undefined;
}

/** True when running inside a browser document (the docs SPA). */
function isBrowser(): boolean {
  return typeof window !== "undefined";
}

/** Creem test mode: explicit flag, or a test-prefixed API key. */
export function isCreemTestMode(): boolean {
  const flag = readEnv("CREEM_TEST_MODE")?.toLowerCase();
  if (flag === "true" || flag === "1") return true;
  const apiKey = readEnv("CREEM_API_KEY");
  return apiKey !== undefined && /^test/i.test(apiKey);
}

/** API base URL; Creem exposes a separate test environment. */
export function creemApiBase(): string {
  return readEnv("CREEM_API_BASE") ?? (isCreemTestMode() ? TEST_API_BASE : LIVE_API_BASE);
}

/** The Creem product/variant id configured for a Pro tier. */
export function creemTierVariantId(tier: CreemTier): string | undefined {
  return tier === "team" ? readEnv("CREEM_TEAM_VARIANT_ID") : readEnv("CREEM_SOLO_VARIANT_ID");
}

type CreemCheckoutApiResponse = {
  id?: unknown;
  checkout_url?: unknown;
  product_id?: unknown;
  status?: unknown;
};

function toSession(data: CreemCheckoutApiResponse): CreemCheckoutSession {
  const id = typeof data.id === "string" ? data.id : undefined;
  const checkoutUrl =
    typeof data.checkout_url === "string" ? data.checkout_url : undefined;
  if (!id || !checkoutUrl) {
    throw new CreemError("Creem checkout response is missing id or checkout_url", 502);
  }
  return {
    id,
    checkoutUrl,
    productId: typeof data.product_id === "string" ? data.product_id : undefined,
    status: typeof data.status === "string" ? data.status : undefined,
  };
}

/**
 * Create a Creem checkout session for a Pro tier product/variant.
 *
 * - Browser: POSTs to the Worker proxy so the secret `CREEM_API_KEY` stays
 *   server-side. Returns the proxy's `{ checkoutUrl }` payload.
 * - Server (API key present, no window): calls `POST {creemApiBase()}/v1/checkouts`
 *   directly with the `x-api-key` header.
 *
 * Redirect the buyer to `session.checkoutUrl` on success.
 */
export async function createCheckout(
  productVariantId: string,
  successUrl: string,
  options: CreateCheckoutOptions = {},
): Promise<CreemCheckoutSession> {
  const apiKey = readEnv("CREEM_API_KEY");

  if (!isBrowser() && apiKey) {
    const doFetch = options.fetch ?? fetch;
    const response = await doFetch(`${creemApiBase()}/v1/checkouts`, {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        // Creem's checkout API takes the product id in this field; Pro tiers are
        // configured as products/variants `CREEM_SOLO_VARIANT_ID` / `CREEM_TEAM_VARIANT_ID`.
        product_id: productVariantId,
        success_url: successUrl,
        request_id: options.requestId,
        metadata: options.metadata,
      }),
    });
    if (!response.ok) {
      throw new CreemError(
        `Creem checkout failed (${response.status} ${response.statusText})`,
        response.status,
      );
    }
    return toSession((await response.json()) as CreemCheckoutApiResponse);
  }

  if (isBrowser() && apiKey) {
    // Fail loud rather than risk shipping a secret to the client.
    throw new CreemError(
      "CREEM_API_KEY must not be used in the browser; route checkouts through the Worker proxy",
      403,
    );
  }

  const endpoint = readEnv("CREEM_CHECKOUT_ENDPOINT") ?? DEFAULT_CHECKOUT_ENDPOINT;
  const doFetch = options.fetch ?? fetch;
  const response = await doFetch(endpoint, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      variantId: productVariantId,
      successUrl,
      requestId: options.requestId,
      metadata: options.metadata,
    }),
  });
  if (!response.ok) {
    throw new CreemError(
      `Checkout proxy failed (${response.status} ${response.statusText})`,
      response.status,
    );
  }
  return toSession((await response.json()) as CreemCheckoutApiResponse);
}

/**
 * Verify a Creem webhook signature. Server/Worker only — never called from the SPA.
 *
 * Contract (per pro/DELIVERY.md §2): Creem sends the HMAC-SHA256 hex digest of
 * the raw request body in the `creem-signature` header (accept `creem-hmac-sha256`
 * as an alias), keyed with `CREEM_WEBHOOK_SECRET`.
 *
 * Implemented with Web Crypto: HMAC-SHA256 over the raw body, hex digest
 * compared in constant time. Fails closed on missing signature/secret,
 * length mismatch, or any byte difference.
 */
export async function verifyCreemWebhookSignature(
  rawBody: string,
  signature: string | null | undefined,
  secret: string,
): Promise<boolean> {
  if (!signature || !secret) return false;
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const mac = await crypto.subtle.sign("HMAC", key, encoder.encode(rawBody));
  const expected = toHex(new Uint8Array(mac));
  const provided = signature.trim().toLowerCase().replace(/^sha256=/, "");
  return timingSafeEqualHex(expected, provided);
}

function toHex(bytes: Uint8Array): string {
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

/** Length-checked XOR compare so comparison time does not leak the prefix. */
function timingSafeEqualHex(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}
