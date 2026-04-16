"use client";

import { Component, ReactNode } from "react";
import DefaultErrorFallback from "./default-error-fallback";

interface Props {
  children: ReactNode;
  fallback?: (error: Error, reset: () => void) => ReactNode;
}

interface State {
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  reset = () => this.setState({ error: null });

  render() {
    const { error } = this.state;

    if (error) {
      return this.props.fallback
        ? this.props.fallback(error, this.reset)
        : <DefaultErrorFallback error={error} reset={this.reset} />;
    }

    return this.props.children;
  }
}
