import { Component } from 'react';

export default class ErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error('[ErrorBoundary]', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="mx-auto max-w-md py-24 text-center">
          <h2 className="font-display text-2xl font-semibold text-ink">Something went wrong</h2>
          <p className="mt-2 text-sm text-slate/70">
            Refresh the page. If the problem continues, the store's data services may be unavailable.
          </p>
        </div>
      );
    }
    return this.props.children;
  }
}
