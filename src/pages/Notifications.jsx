import React, { useState } from 'react';
import { Bell, Check, Trash2, Info, AlertTriangle, CheckCircle } from 'lucide-react';

// Mock notifications - in real app would come from Firestore
const initialNotifications = [
    { id: 1, title: 'New Leave Request', message: 'Sarah Johnson requested leave for Jan 24-25.', type: 'info', time: '2 hours ago', read: false },
    { id: 2, title: 'System Update', message: 'System maintenance scheduled for tonight at 2 AM.', type: 'warning', time: '5 hours ago', read: false },
    { id: 3, title: 'Welcome New Hire', message: 'Michael Chen has joined the Design team.', type: 'success', time: '1 day ago', read: true },
    { id: 4, title: 'Document Uploaded', message: 'Q4 Financial Report.pdf was uploaded by Admin.', type: 'info', time: '2 days ago', read: true },
];

export default function Notifications() {
    const [notifications, setNotifications] = useState(initialNotifications);

    const markAsRead = (id) => {
        setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
    };

    const deleteNotification = (id) => {
        setNotifications(notifications.filter(n => n.id !== id));
    };

    const getIcon = (type) => {
        switch (type) {
            case 'warning': return <AlertTriangle className="text-orange-500" size={20} />;
            case 'success': return <CheckCircle className="text-green-500" size={20} />;
            default: return <Info className="text-blue-500" size={20} />;
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-white mb-2">Notifications</h1>
                    <p className="text-gray-400">Stay updated with important alerts and activities.</p>
                </div>
                <button className="text-sm text-primary-500 hover:text-primary-400 font-medium">
                    Mark all as read
                </button>
            </div>

            <div className="space-y-4">
                {notifications.length > 0 ? (
                    notifications.map((notif) => (
                        <div
                            key={notif.id}
                            className={`flex items-start gap-4 p-4 rounded-xl border transition-all ${notif.read
                                    ? 'bg-dark-800 border-dark-700 opacity-75'
                                    : 'bg-dark-800 border-l-4 border-l-primary-500 border-y-dark-700 border-r-dark-700 shadow-md shadow-black/20'
                                }`}
                        >
                            <div className={`mt-1 p-2 rounded-full bg-dark-900 border border-dark-700`}>
                                {getIcon(notif.type)}
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between items-start">
                                    <h3 className={`font-semibold ${notif.read ? 'text-gray-400' : 'text-white'}`}>{notif.title}</h3>
                                    <span className="text-xs text-gray-500">{notif.time}</span>
                                </div>
                                <p className="text-gray-400 text-sm mt-1">{notif.message}</p>
                            </div>
                            <div className="flex gap-2">
                                {!notif.read && (
                                    <button
                                        onClick={() => markAsRead(notif.id)}
                                        className="p-1.5 text-gray-400 hover:text-primary-500 hover:bg-dark-700 rounded-lg transition-colors"
                                        title="Mark as read"
                                    >
                                        <Check size={18} />
                                    </button>
                                )}
                                <button
                                    onClick={() => deleteNotification(notif.id)}
                                    className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                                    title="Delete"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-12 text-gray-500">
                        <Bell size={48} className="mx-auto mb-4 opacity-20" />
                        <p>No new notifications</p>
                    </div>
                )}
            </div>
        </div>
    );
}
