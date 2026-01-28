import React from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

export default function DashboardLayout({ children }) {
    return (
        <div className="min-h-screen bg-dark-900 text-gray-100 font-sans">
            <Sidebar />
            <Header />
            <main className="ml-64 p-8">
                {children}
            </main>
        </div>
    );
}
