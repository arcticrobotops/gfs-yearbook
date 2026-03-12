'use client';

import { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="flex flex-col items-center justify-center py-12 px-4">
            <div className="mx-auto w-12 h-12 rounded-full border border-gold/40 flex items-center justify-center mb-4">
              <span className="text-gold text-lg">&#9733;</span>
            </div>
            <p className="font-display text-varsity-blue text-sm italic mb-1">
              This section didn&apos;t load correctly.
            </p>
            <p className="font-body text-charcoal/40 text-[13px]">
              Something went wrong.
            </p>
            <button
              onClick={() => this.setState({ hasError: false })}
              className="mt-4 font-body text-varsity-blue text-[13px] underline underline-offset-2 hover:text-maroon transition-colors min-h-[44px] px-4 py-2 inline-flex items-center"
            >
              Try again
            </button>
          </div>
        )
      );
    }

    return this.props.children;
  }
}
