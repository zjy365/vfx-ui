import { useState } from "react";
import { CopyIcon } from "./icons";
import { SyntaxHighlightedCode } from "./SyntaxHighlightedCode";

export const INSTALL_COMMANDS = {
  npm: "npm install @vfx-ui/react",
  pnpm: "pnpm add @vfx-ui/react",
  bun: "bun add @vfx-ui/react",
  yarn: "yarn add @vfx-ui/react",
} as const;

type PackageManager = keyof typeof INSTALL_COMMANDS;

type InstallationStepsProps = {
  importName: string;
  onNotify: (message: string) => void;
};

async function copyText(text: string) {
  await navigator.clipboard.writeText(text);
}

export function InstallationSteps({ importName, onNotify }: InstallationStepsProps) {
  const [packageManager, setPackageManager] = useState<PackageManager>("npm");

  return (
    <div className="steps">
      <div className="step">
        <div className="num card">1</div>
        <div className="h3row"><h3>Install the package</h3></div>
        <p>Add vfx-ui and its React peer dependencies to your project:</p>
        <div className="code-card card">
          <div className="tabbar">
            <div className="tabs" role="tablist" aria-label="Package manager">
              {(Object.keys(INSTALL_COMMANDS) as PackageManager[]).map((manager) => (
                <button
                  className="tab"
                  role="tab"
                  aria-selected={packageManager === manager}
                  key={manager}
                  onClick={() => setPackageManager(manager)}
                >
                  {manager}
                </button>
              ))}
            </div>
            <button
              className="icon-btn inset-shadow"
              aria-label="Copy install command"
              onClick={() => copyText(INSTALL_COMMANDS[packageManager]).then(() => onNotify("Copied"))}
            >
              <CopyIcon />
            </button>
          </div>
          <pre className="code"><SyntaxHighlightedCode code={INSTALL_COMMANDS[packageManager]} language="text" /></pre>
        </div>
      </div>

      <div className="step">
        <div className="num card">2</div>
        <div className="h3row"><h3>Import the component</h3></div>
        <p className="gap32">Import only from the package entrypoint:</p>
        <div className="code-card padded card code-inline">
          <button
            className="icon-btn inset-shadow copy-corner"
            aria-label="Copy component import"
            onClick={() => copyText(`import { ${importName} } from "@vfx-ui/react";`).then(() => onNotify("Copied"))}
          >
            <CopyIcon />
          </button>
          <pre className="code"><SyntaxHighlightedCode code={`import { ${importName} } from "@vfx-ui/react";`} language="typescript" /></pre>
        </div>
      </div>
    </div>
  );
}
