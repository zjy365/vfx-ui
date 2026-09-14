# Production domain redirects

`domain-redirects.json` records this project's active Cloudflare account Bulk
Redirect list and rule. Host-level redirects are not supported by Pages
`_redirects`; keep only path redirects in that file.

The list matches only the listed production hostnames, for HTTP and HTTPS,
with a 301 to the custom HTTPS host. It preserves path suffixes and query
strings, and excludes preview subdomains and license API hosts.

These rules are already deployed. When changing them, update the identified
list and its existing rule through the Cloudflare API/dashboard; preserve all
other rules in the shared account ruleset. Pages deploys do not manage these
account-level rules. Reverify the host redirects after a domain change.
