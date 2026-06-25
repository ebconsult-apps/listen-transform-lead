import { Component, type ErrorInfo, type ReactNode } from "react";
import { RefreshCw, Home } from "lucide-react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * App-wide error boundary. Any render or lifecycle error in the tree below it is
 * caught here and replaced with a recoverable full-page fallback, instead of
 * unmounting React and leaving a blank white screen. (Event-handler and async
 * errors aren't catchable by React boundaries, so those stay on the existing
 * try/catch + toast paths.) componentDidCatch is the single place to wire an
 * external error reporter later.
 */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("Uncaught render error:", error, info.componentStack);
  }

  private handleReload = () => window.location.reload();
  private handleHome = () => window.location.assign("/");

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div className="min-h-screen flex items-center justify-center px-6 bg-background">
        <div className="glass-card p-8 sm:p-10 w-full max-w-md text-center">
          <h1 className="heading-md mb-2">Something went wrong</h1>
          <p className="body-md mb-6">
            The page ran into an unexpected error. Reloading usually fixes it, or
            you can head back to the homepage.
          </p>
          <div className="flex flex-col sm:flex-row gap-2 justify-center">
            <button onClick={this.handleReload} className="btn-primary">
              <RefreshCw className="h-4 w-4 mr-1.5" /> Reload page
            </button>
            <button onClick={this.handleHome} className="btn-secondary">
              <Home className="h-4 w-4 mr-1.5" /> Go to homepage
            </button>
          </div>
          {import.meta.env.DEV && this.state.error && (
            <pre className="mt-6 max-h-48 overflow-auto whitespace-pre-wrap rounded-lg bg-destructive/5 p-3 text-left text-xs text-destructive/80">
              {this.state.error.message}
              {"\n"}
              {this.state.error.stack}
            </pre>
          )}
        </div>
      </div>
    );
  }
}

export default ErrorBoundary;
