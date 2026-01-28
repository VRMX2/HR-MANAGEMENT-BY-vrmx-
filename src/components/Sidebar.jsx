import React, { useState } from 'react';
import { LayoutDashboard, Users, Building2, CalendarDays, FileText, BarChart3, Settings, Bell, HelpCircle } from 'lucide-react';

export default function Sidebar() {
    const [active, setActive] = useState('Dashboard');

    const menuItems = [
        { icon: LayoutDashboard, label: 'Dashboard' },
        { icon: Users, label: 'Employees', badge: 248 },
        { icon: Building2, label: 'Departments' },
        { icon: CalendarDays, label: 'Attendance' },
        { icon: FileText, label: 'Documents' },
        { icon: BarChart3, label: 'Analytics' },
    ];

    const settingsItems = [
        { icon: Bell, label: 'Notifications', badge: 5, badgeColor: 'bg-red-500' },
        { icon: Settings, label: 'Settings' },
        { icon: HelpCircle, label: 'Help Center' },
    ];

    return (
        <div className="w-64 bg-dark-800 border-r border-dark-700 flex flex-col h-screen fixed left-0 top-0">
            <div className="p-6">
                <div className="flex items-center gap-2 mb-8">
                    <div className="bg-primary-500 w-8 h-8 rounded-lg flex items-center justify-center font-bold text-white">P</div>
                    <h1 className="text-xl font-bold text-white">PeopleHub</h1>
                </div>

                <div className="mb-6">
                    <h2 className="text-xs font-semibold text-gray-500 mb-4 px-2 uppercase tracking-wider">Main Menu</h2>
                    <nav className="space-y-1">
                        {menuItems.map((item) => (
                            <button
                                key={item.label}
                                onClick={() => setActive(item.label)}
                                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors duration-200 group ${active === item.label
                                        ? 'bg-gradient-to-r from-primary-600/20 to-transparent text-primary-500 border-r-2 border-primary-500'
                                        : 'text-gray-400 hover:text-white hover:bg-dark-700'
                                    }`}
                            >
                                <item.icon size={20} className={active === item.label ? 'text-primary-500' : 'text-gray-400 group-hover:text-white'} />
                                <span className="flex-1 text-left">{item.label}</span>
                                {item.badge && (
                                    <span className={`text-xs px-2 py-0.5 rounded-full ${active === item.label ? 'bg-primary-500 text-white' : 'bg-dark-700 text-gray-400'
                                        }`}>
                                        {item.badge}
                                    </span>
                                )}
                            </button>
                        ))}
                    </nav>
                </div>

                <div>
                    <h2 className="text-xs font-semibold text-gray-500 mb-4 px-2 uppercase tracking-wider">Settings</h2>
                    <nav className="space-y-1">
                        {settingsItems.map((item) => (
                            <button
                                key={item.label}
                                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-400 hover:text-white hover:bg-dark-700 transition-colors duration-200 group"
                            >
                                <item.icon size={20} className="group-hover:text-white" />
                                <span className="flex-1 text-left">{item.label}</span>
                                {item.badge && (
                                    <span className={`text-xs px-2 py-0.5 rounded-full text-white ${item.badgeColor}`}>
                                        {item.badge}
                                    </span>
                                )}
                            </button>
                        ))}
                    </nav>
                </div>
            </div>
        </div>
    );
}
