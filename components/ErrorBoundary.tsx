import React, { Component, ErrorInfo, ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_: Error): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('Error caught in error boundary', error, errorInfo);
  }

  render(): ReactNode {
    const { children } = this.props;
    const { hasError } = this.state;
    if (hasError) {
      return <h1>Something went wrong.</h1>;
    }
    return children;
  }
}

export default ErrorBoundary;
