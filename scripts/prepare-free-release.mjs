import { execFileSync } from "node:child_process";
import { access, mkdir, mkdtemp, readdir, readFile, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";
import { resolve, relative, join } from "node:path";
import { verifyStaticArchive } from "./verify-static-archive.mjs";
import { PRO_PUBLISHED } from "../catalog/publication.mjs";

const root = fileURLToPath(new URL("..", import.meta.url));
if (process.argv.length > 2) throw new Error("Usage: pnpm release:free (prepares local files only; accepts no flags)");
process.chdir(root);
const accountOrigin = PRO_PUBLISHED ? (process.env.NEXT_PUBLIC_ACCOUNT_URL || "").replace(/\/+$/, "") : "";
if (accountOrigin && accountOrigin !== "https://account.vfx-ui.com") {
  throw new Error("Release builds accept only the production account origin, or no account link.");
}
// An explicit empty string must override Next.js .env.local/.env.production.
// Otherwise a local development account URL could enter a production build
// while the release manifest incorrectly records that the entry is disabled.
const run = (...args) => execFileSync(args[0], args.slice(1), {
  cwd: root, stdio: "inherit", env: { ...process.env, NEXT_PUBLIC_ACCOUNT_URL: accountOrigin },
});
run("pnpm", "--filter", "@vfx-ui/docs", "build");
run("pnpm", "seo:check");
const output = resolve(root, "apps/docs/dist");
for (const file of ["index.html", "sitemap.xml", "robots.txt", "_headers", "_redirects", "blog/index.html", "docs/index.html"]) {
  await access(join(output, file));
}
const files = [];
async function inventory(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isSymbolicLink()) throw new Error("Static release cannot contain symlinks.");
    if (entry.isDirectory()) { await inventory(path); continue; }
    const name = relative(output, path).split("\\").join("/");
    if (/(^|\/)(?:\.env(?:\.|$)|\.git(?:\/|$)|node_modules(?:\/|$)|\._|\.DS_Store$|__pycache__(?:\/|$))|\.(?:zip|pem|key|pyc|log)$/i.test(name)) {
      throw new Error(`Unexpected private or configuration artifact: ${name}`);
    }
    const bytes = await readFile(path);
    if (bytes.length > 25 * 1024 * 1024) throw new Error(`Asset exceeds the Cloudflare Pages upload size limit: ${name}`);
    files.push({ file: name, bytes: bytes.length, sha256: createHash("sha256").update(bytes).digest("hex") });
  }
}
await inventory(output);
if (files.length > 20000) throw new Error("Static output exceeds the Cloudflare Pages Wrangler file limit.");
files.sort((a, b) => a.file.localeCompare(b.file));
const stamp = new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d+Z$/, "Z");
const parent = resolve(root, "output/free-site");
await mkdir(parent, { recursive: true });
const directory = await mkdtemp(join(parent, stamp + "-"));
const filename = `vfx-ui-free-${stamp}.tar.gz`;
execFileSync("tar", ["--format=ustar", "-czf", join(directory, filename), "-C", output, "."], {
  cwd: root, stdio: "inherit", env: { ...process.env, COPYFILE_DISABLE: "1" },
});
const archive = await readFile(join(directory, filename));
verifyStaticArchive(archive, files);
const sha256 = createHash("sha256").update(archive).digest("hex");
const git = (...args) => execFileSync("git", args, { cwd: root, encoding: "utf8" }).trim();
await writeFile(join(directory, "manifest.json"), JSON.stringify({
  product: "VFX UI Free", format: "static-site", createdAt: new Date().toISOString(),
  proPublished: PRO_PUBLISHED,
  sourceCommit: git("rev-parse", "HEAD"), workingTreeDirty: Boolean(git("status", "--porcelain")),
  accountOrigin: accountOrigin || null, directory: "apps/docs/dist", filename, bytes: archive.length, sha256,
  files,
}, null, 2) + "\n");
await writeFile(join(directory, "SHA256SUMS"), `${sha256}  ${filename}\n`);
console.log(`Prepared static release: ${directory}\nFiles: ${files.length}; archive bytes: ${archive.length}\nAccount link: ${accountOrigin || "disabled until Pro deployment is ready"}\nNo upload or deployment performed.`);
