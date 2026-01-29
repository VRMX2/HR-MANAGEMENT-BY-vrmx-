import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

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
                <div className="min-h-screen bg-dark-900 flex items-center justify-center p-6 animate-fade-in">
                    <div className="bg-dark-800 border border-dark-700 rounded-2xl p-8 max-w-lg w-full shadow-2xl">
                        <div className="flex flex-col items-center text-center mb-6">
                            <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mb-4">
                                <AlertTriangle size={32} />
                            </div>
                            <h1 className="text-2xl font-bold text-white mb-2">Something went wrong</h1>
                            <p className="text-gray-400 text-sm">
                                We apologize for the inconvenience. A critical error has occurred.
                            </p>
                        </div>

                        {this.state.error && (
                            <div className="bg-dark-900/50 rounded-xl p-4 mb-6 border border-dark-700/50 overflow-hidden">
                                <p className="text-red-400 font-mono text-xs break-words">
                                    {this.state.error.toString()}
                                </p>
                            </div>
                        )}

                        <button
                            onClick={() => window.location.reload()}
                            className="w-full bg-primary-500 hover:bg-primary-600 text-white py-3 rounded-xl font-medium transition-colors flex items-center justify-center gap-2 shadow-lg shadow-primary-500/20"
                        >
                            <RefreshCw size={18} />
                            <span>Reload Application</span>
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
