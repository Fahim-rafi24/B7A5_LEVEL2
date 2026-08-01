'use client';

import React from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';

interface ErrorBoundaryProps {
    children: React.ReactNode;
    fallback?: React.ReactNode;
}

interface ErrorBoundaryState {
    hasError: boolean;
}

export default class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(): ErrorBoundaryState {
        return { hasError: true };
    }

    componentDidCatch(error: Error) {
        console.error('ErrorBoundary caught an error:', error);
    }

    private handleReset = () => {
        this.setState({ hasError: false });
    };

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) return this.props.fallback;
            return (
                <div className="container-custom py-20 max-w-md mx-auto text-center">
                    <div className="card p-10 shadow-xl space-y-4">
                        <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto">
                            <AlertTriangle className="w-8 h-8" />
                        </div>
                        <h2 className="text-xl font-bold text-slate-900">Something went wrong</h2>
                        <p className="text-sm text-slate-500">
                            An unexpected error occurred while rendering this section. Please try again.
                        </p>
                        <button onClick={this.handleReset} className="btn-primary justify-center text-sm mx-auto">
                            <RotateCcw className="w-4 h-4" /> Try Again
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
