/** Preserve authored imports, children and dependencies; append only editable props. */
export function usageWithProps(
  source: string,
  componentName: string,
  props: Record<string, unknown>,
): string {
  const values = Object.fromEntries(
    Object.entries(props).filter(([, value]) => value !== undefined),
  );
  if (!Object.keys(values).length) return source;
  const escaped = componentName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = new RegExp(`<${escaped}(?=[\\s/>])`).exec(source);
  if (!match) return source;
  let depth = 0,
    quote = "",
    lineComment = false,
    blockComment = false;
  let end = match.index + match[0].length;
  // Nested JSX/object expressions, arrows and quoted > do not close the tag.
  for (; end < source.length; end++) {
    const c = source[end],
      next = source[end + 1];
    if (lineComment) {
      if (c === "\n") lineComment = false;
      continue;
    }
    if (blockComment) {
      if (c === "*" && next === "/") {
        blockComment = false;
        end++;
      }
      continue;
    }
    if (quote) {
      if (c === "\\") {
        end++;
        continue;
      }
      if (c === quote) quote = "";
      continue;
    }
    if (c === '"' || c === "'" || c === "`") {
      quote = c;
      continue;
    }
    if (depth && c === "/" && next === "/") {
      lineComment = true;
      end++;
      continue;
    }
    if (depth && c === "/" && next === "*") {
      blockComment = true;
      end++;
      continue;
    }
    if (c === "{") depth++;
    if (c === "}") depth--;
    if (c === ">" && depth === 0) break;
  }
  if (end === source.length) return source;
  let insertion = source[end - 1] === "/" ? end - 1 : end;
  while (insertion > match.index && /\s/.test(source[insertion - 1]))
    insertion--;
  const indent =
    /^\s*/.exec(
      source.slice(source.lastIndexOf("\n", match.index) + 1, match.index),
    )?.[0] || "";
  const formatted = JSON.stringify(values, null, 2)
    .replace(/"([A-Za-z_$][\w$]*)":/g, "$1:")
    .split("\n")
    .map((line, index) => (index ? indent + "  " + line : line))
    .join("\n");
  return (
    source.slice(0, insertion) +
    `\n${indent}  {...${formatted}}\n${indent}` +
    source.slice(insertion).trimStart()
  );
}
