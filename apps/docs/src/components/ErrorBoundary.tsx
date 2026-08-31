import { Component, type ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  error: Error | null;
}

/**
 * Keeps one broken live preview from unmounting the whole app — React removes
 * the entire root on an uncaught render error, which used to blank the page
 * (e.g. a component throwing on missing props).
 */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error): void {
    console.error("[vfx-ui docs] preview crashed:", error);
  }

  render() {
    if (this.state.error) {
      return (
        <main className="browse-page" aria-labelledby="preview-error-title">
          <header className="browse-header">
            <h1 id="preview-error-title">Preview failed to render</h1>
            <p className="lede">
              The live preview threw an error ({this.state.error.message}). The rest of the docs still work —
              pick another component from the sidebar.
            </p>
          </header>
        </main>
      );
    }
    return this.props.children;
  }
}
