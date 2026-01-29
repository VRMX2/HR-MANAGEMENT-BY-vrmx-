import React from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

export default function DashboardLayout({ children }) {
    const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

    return (
        <div className="min-h-screen bg-dark-900 text-gray-100 font-sans">
            <Sidebar isOpen={isSidebarOpen} toggle={() => setIsSidebarOpen(!isSidebarOpen)} close={() => setIsSidebarOpen(false)} />
            <Header toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

            <main className={`transition-all duration-300 ${isSidebarOpen ? 'md:ml-64' : 'ml-0 md:ml-64'} p-4 md:p-8 pt-20 md:pt-8`}>
                {children}
            </main>

            {/* Mobile Overlay */}
            {isSidebarOpen && (
                <div
                    onClick={() => setIsSidebarOpen(false)}
                    className="fixed inset-0 bg-black/50 z-30 md:hidden backdrop-blur-sm"
                ></div>
            )}
        </div>
    );
}
