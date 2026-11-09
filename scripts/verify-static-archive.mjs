import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { gunzipSync } from "node:zlib";

// The release writer deliberately uses USTAR, so there are no opaque PAX or
// platform-specific metadata entries to hide from the file manifest.
export function verifyStaticArchive(archive, files) {
  const tar = gunzipSync(archive);
  const expected = new Map(files.map(file => [file.file, file]));
  const seen = new Set();
  const text = bytes => bytes.toString("utf8").split("\0", 1)[0];
  let offset = 0;
  while (offset + 512 <= tar.length) {
    const header = tar.subarray(offset, offset + 512);
    if (header.every(byte => byte === 0)) break;
    const prefix = text(header.subarray(345, 500));
    const path = (prefix ? prefix + "/" : "") + text(header.subarray(0, 100));
    const name = path.replace(/^\.\//, "");
    const size = Number.parseInt(text(header.subarray(124, 136)).trim(), 8);
    assert(Number.isSafeInteger(size) && size >= 0, "Invalid tar entry size");
    const type = text(header.subarray(156, 157));
    const data = tar.subarray(offset + 512, offset + 512 + size);
    assert.equal(data.length, size, "Truncated tar content");
    if (type !== "5") {
      assert(type === "0" || type === "", `Unexpected tar entry type: ${type}`);
      const file = expected.get(name);
      assert(file && !seen.has(name), `Undeclared or duplicate archive entry: ${name}`);
      assert.equal(size, file.bytes, `Archive size mismatch: ${name}`);
      assert.equal(createHash("sha256").update(data).digest("hex"), file.sha256, `Archive checksum mismatch: ${name}`);
      seen.add(name);
    }
    offset += 512 + Math.ceil(size / 512) * 512;
  }
  assert.equal(seen.size, expected.size, "Archive is missing manifest files");
  return seen.size;
}
