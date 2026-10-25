import { Fragment } from "react";

/** Text-only syntax coloring: source never becomes HTML or executes. */
export function DetailCode({ source }: { source: string }) {
  const pattern =
    /(\/\*[\s\S]*?\*\/|\/\/[^\n]*|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`(?:\\.|[^`\\])*`|\b(?:import|from|export|default|function|return|const|let|true|false|null|undefined|new)\b|\b\d+(?:\.\d+)?\b|(?<=<\/?)[A-Z][A-Za-z0-9.]*)/g;
  return (
    <>
      {source.split(pattern).map((part, index) => {
        let kind = "";
        if (/^(\/\/|\/\*)/.test(part)) kind = "comment";
        else if (/^["'`]/.test(part)) kind = "string";
        else if (
          /^(import|from|export|default|function|return|const|let|true|false|null|undefined|new)$/.test(
            part,
          )
        )
          kind = "keyword";
        else if (/^\d/.test(part)) kind = "number";
        else if (/^[A-Z][A-Za-z0-9.]*$/.test(part)) kind = "component";
        return kind ? (
          <span key={index} className={`dw-token-${kind}`}>
            {part}
          </span>
        ) : (
          <Fragment key={index}>{part}</Fragment>
        );
      })}
    </>
  );
}
