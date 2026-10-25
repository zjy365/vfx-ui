import { Shell } from "@/components/shell";
export const metadata = { title: "Privacy" };
export default function Privacy() {
  return (
    <Shell>
      <main id="main" className="prose-page page-width">
        <p className="eyebrow">LAST UPDATED / OCTOBER 22, 2026</p>
        <h1>Privacy</h1>
        <p>
          The public VFX UI library can be browsed without an account. Component
          search, filters and preview changes run in your browser.
        </p>
        <h2>Website delivery</h2>
        <p>
          Our hosting provider processes request information, such as IP
          addresses and browser details, to deliver and secure the website.
          Links to GitHub and external services are governed by those services’
          policies.
        </p>
        <h2>Purchases and accounts</h2>
        <p>
          When the Pro store is available, the account service will process your
          OAuth identity, email address, session cookies, purchase records and
          download history. The payment provider handles payment details; VFX UI
          does not store card numbers.
        </p>
        <h2>Your data</h2>
        <p>
          Account data is used for sign-in, purchase access, support and
          preventing abuse. Purchase records may need to be retained for tax and
          accounting obligations. A support contact and account data request
          process will be provided in the store before checkout is enabled.
        </p>
        <h2>Preview isolation</h2>
        <p>
          Interactive examples load in same-origin isolated frames. Example
          controls do not submit your content to an AI service.
        </p>
      </main>
    </Shell>
  );
}
