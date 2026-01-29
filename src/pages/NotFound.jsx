import React from 'react';
import { Link } from 'react-router-dom';
import { Home, AlertCircle } from 'lucide-react';

export default function NotFound() {
    return (
        <div className="min-h-screen bg-dark-900 flex items-center justify-center p-6 text-center animate-fade-in">
            <div className="max-w-md w-full">
                <div className="w-24 h-24 bg-dark-800 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-primary-500/10 border border-dark-700 relative">
                    <span className="text-4xl font-bold text-gray-700">404</span>
                    <AlertCircle className="absolute -bottom-2 -right-2 text-primary-500 bg-dark-900 rounded-full border-4 border-dark-900" size={40} />
                </div>

                <h1 className="text-3xl font-bold text-white mb-3">Page not found</h1>
                <p className="text-gray-400 mb-8">
                    The page you are looking for doesn't exist or has been moved.
                </p>

                <Link
                    to="/"
                    className="inline-flex items-center gap-2 bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-xl font-medium transition-all hover:scale-105 shadow-lg shadow-primary-500/20"
                >
                    <Home size={18} />
                    <span>Back to Dashboard</span>
                </Link>
            </div>
        </div>
    );
}
