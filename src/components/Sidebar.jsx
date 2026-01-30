import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, Building2, CalendarDays, FileText, BarChart3, TrendingUp, Settings, Bell, HelpCircle, LogOut, Search } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useLocale } from '../context/LocaleContext';
import { useSearch } from '../context/SearchContext';
import { db } from '../firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';

export default function Sidebar({ isOpen, toggle, close }) {
    const location = useLocation();
    const navigate = useNavigate();
    const { logout, currentUser } = useAuth();
    const { showToast } = useToast();
    const { t } = useLocale();
    const { searchTerm, setSearchTerm } = useSearch();
    const active = location.pathname;
    const [unreadCount, setUnreadCount] = useState(0);

    // Subscribe to unread notifications
    useEffect(() => {
        if (!currentUser) {
            setUnreadCount(0);
            return;
        }

        const q = query(
            collection(db, 'notifications'),
            where('read', '==', false)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            setUnreadCount(snapshot.size);
        });

        return unsubscribe;
    }, [currentUser]);

    const handleLogout = async () => {
        try {
            await logout();
            showToast('Logged out successfully', 'success');
            navigate('/login');
        } catch (error) {
            showToast('Failed to log out', 'error');
        }
    };

    const menuItems = [
        { icon: LayoutDashboard, label: t('dashboard'), path: '/' },
        { icon: Users, label: t('employees'), badge: null, path: '/employees' },
        { icon: Building2, label: t('departments'), path: '/departments' },
        { icon: CalendarDays, label: t('attendance'), path: '/attendance' },
        { icon: FileText, label: t('documents'), path: '/documents' },
        { icon: BarChart3, label: t('analytics'), path: '/analytics' },
        { icon: TrendingUp, label: 'Statistics', path: '/statistics' },
    ];

    const settingsItems = [
        { icon: Bell, label: t('notifications'), badge: unreadCount > 0 ? unreadCount : null, badgeColor: 'bg-red-500', path: '/notifications' },
        { icon: Settings, label: t('settings'), path: '/settings' },
        { icon: HelpCircle, label: t('help'), path: '/help' },
    ];

    return (
        <div className={`w-64 bg-dark-800 border-r border-dark-700 flex flex-col h-screen fixed left-0 top-0 text-sm z-40 transition-transform duration-300 md:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
            <div className="p-6 flex-1 flex flex-col">
                <div className="flex items-center gap-2 mb-6">
                    <div className="bg-gradient-to-br from-primary-500 to-purple-600 w-8 h-8 rounded-lg flex items-center justify-center font-bold text-white shadow-lg shadow-primary-500/20">H</div>
                    <h1 className="text-xl font-bold text-white tracking-tight">Hrvrmx</h1>
                </div>

                <div className="mb-6">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search..."
                            className="w-full bg-dark-900/50 border border-dark-700 rounded-lg pl-9 pr-3 py-2 text-xs text-gray-200 focus:outline-none focus:border-primary-500 transition-colors placeholder-gray-600"
                        />
                    </div>
                </div>

                <div className="mb-6">
                    <h2 className="text-xs font-semibold text-gray-500 mb-4 px-2 uppercase tracking-wider">{t('mainMenu')}</h2>
                    <nav className="space-y-1">
                        {menuItems.map((item) => (
                            <Link
                                key={item.label}
                                to={item.path}
                                onClick={close}
                                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative ${active === item.path
                                    ? 'bg-gradient-to-r from-primary-600/10 to-transparent text-primary-500'
                                    : 'text-gray-400 hover:text-white hover:bg-dark-700'
                                    }`}
                            >
                                {active === item.path && (
                                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-primary-500 rounded-r-full"></div>
                                )}
                                <item.icon size={20} className={active === item.path ? 'text-primary-500' : 'text-gray-400 group-hover:text-white'} />
                                <span className="flex-1 text-left font-medium">{item.label}</span>
                                {item.badge && (
                                    <span className={`text-xs px-2 py-0.5 rounded-full ${active === item.path ? 'bg-primary-500 text-white' : 'bg-dark-700 text-gray-400'
                                        }`}>
                                        {item.badge}
                                    </span>
                                )}
                            </Link>
                        ))}
                    </nav>
                </div>

                <div>
                    <h2 className="text-xs font-semibold text-gray-500 mb-4 px-2 uppercase tracking-wider">{t('system')}</h2>
                    <nav className="space-y-1">
                        {settingsItems.map((item) => (
                            <Link
                                key={item.label}
                                to={item.path}
                                onClick={close}
                                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative ${active === item.path
                                    ? 'bg-dark-700 text-white'
                                    : 'text-gray-400 hover:text-white hover:bg-dark-700'
                                    }`}
                            >
                                {active === item.path && (
                                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-gray-500 rounded-r-full"></div>
                                )}
                                <item.icon size={20} className="group-hover:text-white" />
                                <span className="flex-1 text-left font-medium">{item.label}</span>
                                {item.badge && (
                                    <span className={`text-xs px-2 py-0.5 rounded-full text-white ${item.badgeColor}`}>
                                        {item.badge}
                                    </span>
                                )}
                            </Link>
                        ))}

                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors duration-200 group mt-4"
                        >
                            <LogOut size={20} className="group-hover:text-red-400" />
                            <span className="flex-1 text-left font-medium">{t('logout')}</span>
                        </button>
                    </nav>
                </div>
            </div>

            <div className="p-4 border-t border-dark-700 bg-dark-900/50">
                <p className="text-xs text-gray-500 text-center">VRMX HR v1.0.0</p>
            </div>
        </div>
    );
}
