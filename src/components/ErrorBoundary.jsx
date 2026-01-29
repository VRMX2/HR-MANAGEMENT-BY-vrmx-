import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        console.error('ErrorBoundary caught an error:', error, errorInfo);
        this.setState({ hasError: true, error, errorInfo });
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-dark-900 flex items-center justify-center p-8">
                    <div className="bg-dark-800 border border-red-500/20 rounded-xl p-8 max-w-2xl w-full">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 bg-red-500/10 text-red-500 rounded-lg flex items-center justify-center">
                                ⚠️
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-white">Something went wrong</h1>
                                <p className="text-gray-400 text-sm">The application encountered an error</p>
                            </div>
                        </div>

                        <div className="bg-dark-900 rounded-lg p-4 mb-4">
                            <p className="text-white font-mono text-sm mb-2 whitespace-pre-wrap break-words">
                                {this.state.error && this.state.error.toString()}
                            </p>
                            {this.state.errorInfo && (
                                <details className="text-gray-400 text-xs mt-3">
                                    <summary className="cursor-pointer hover:text-gray-300">Show stack trace</summary>
                                    <pre className="mt-2 overflow-auto text-gray-500 whitespace-pre-wrap break-words">
                                        {this.state.errorInfo.componentStack}
                                    </pre>
                                </details>
                            )}
                        </div>

                        <button
                            onClick={() => window.location.reload()}
                            className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-2 rounded-lg transition-colors"
                        >
                            Reload Page
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
