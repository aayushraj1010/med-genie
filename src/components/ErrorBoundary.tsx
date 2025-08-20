'use client';

import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from './ui/button';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';

interface ErrorBoundaryState {
    hasError: boolean;
    error?: Error;
}

interface ErrorBoundaryProps {
    children: React.ReactNode;
    fallback?: React.ComponentType<{ error: Error; resetError: () => void }>;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        // Log error to console in development
        if (process.env.NODE_ENV === 'development') {
            console.error('ErrorBoundary caught an error:', error, errorInfo);
        }

        // Check if this is an extension-related error
        if (error.message.includes('Cannot read properties of null') &&
            error.stack && error.stack.includes('chrome-extension')) {
            console.warn('Browser extension conflict detected, attempting to recover...');
            // Try to recover from extension errors
            this.setState({ hasError: false });
            return;
        }
    }

    resetError = () => {
        this.setState({ hasError: false, error: undefined });
    };

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return <this.props.fallback error={this.state.error!} resetError={this.resetError} />;
            }

            return (
                <div className="min-h-screen flex items-center justify-center p-4 bg-background">
                    <div className="max-w-md w-full space-y-4">
                        <Alert variant="destructive">
                            <AlertTriangle className="h-4 w-4" />
                            <AlertTitle>Something went wrong</AlertTitle>
                            <AlertDescription>
                                An unexpected error occurred. This might be due to a browser extension conflict.
                            </AlertDescription>
                        </Alert>

                        <div className="text-center space-y-4">
                            <p className="text-sm text-muted-foreground">
                                {this.state.error?.message || 'Unknown error occurred'}
                            </p>

                            <div className="flex gap-2 justify-center">
                                <Button onClick={this.resetError} variant="outline">
                                    <RefreshCw className="h-4 w-4 mr-2" />
                                    Try Again
                                </Button>
                                <Button onClick={() => window.location.reload()}>
                                    Reload Page
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
