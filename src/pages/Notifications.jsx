import React, { useState, useEffect } from 'react';
import { Bell, Check, Trash2, Info, AlertTriangle, CheckCircle } from 'lucide-react';
import { db } from '../firebase';
import { collection, query, orderBy, onSnapshot, updateDoc, deleteDoc, doc, addDoc, where } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';

export default function Notifications() {
    const [notifications, setNotifications] = useState([]);
    const { currentUser } = useAuth();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!currentUser) {
            setLoading(false);
            return;
        }

        // Ideally query by userId, but for shared demo app we'll show all or seed user specific
        // For this demo, let's just show all notifications ordered by time
        const q = query(collection(db, 'notifications'), orderBy('timestamp', 'desc'));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const docs = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setNotifications(docs);
            setLoading(false);

            // Seed if empty for demo purposes
            if (docs.length === 0) {
                seedNotifications();
            }
        });

        return unsubscribe;
    }, [currentUser]);

    const seedNotifications = async () => {
        const seedData = [
            { title: 'Welcome to PeopleHub', message: 'Get started by adding your first employee.', type: 'success', timestamp: new Date(), read: false },
            { title: 'System Update', message: 'Maintenance scheduled for Saturday night.', type: 'warning', timestamp: new Date(Date.now() - 86400000), read: false }
        ];

        for (const data of seedData) {
            await addDoc(collection(db, 'notifications'), data);
        }
    };

    const markAsRead = async (id) => {
        const notifRef = doc(db, 'notifications', id);
        await updateDoc(notifRef, { read: true });
    };

    const markAllAsRead = async () => {
        // Batch update would be better, but simpler loop for now
        const unread = notifications.filter(n => !n.read);
        unread.forEach(async (n) => {
            await updateDoc(doc(db, 'notifications', n.id), { read: true });
        });
    };

    const deleteNotification = async (id) => {
        await deleteDoc(doc(db, 'notifications', id));
    };

    const getIcon = (type) => {
        switch (type) {
            case 'warning': return <AlertTriangle className="text-orange-500" size={20} />;
            case 'success': return <CheckCircle className="text-green-500" size={20} />;
            default: return <Info className="text-blue-500" size={20} />;
        }
    };

    const formatTime = (timestamp) => {
        if (!timestamp) return '';
        // Handle Firestore timestamp or JS Date
        const date = timestamp.seconds ? new Date(timestamp.seconds * 1000) : new Date(timestamp);

        const now = new Date();
        const diffInSeconds = Math.floor((now - date) / 1000);

        if (diffInSeconds < 60) return 'Just now';
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} mins ago`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
        return `${Math.floor(diffInSeconds / 86400)} days ago`;
    };

    if (loading) return <div className="text-white">Loading notifications...</div>;

    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-white mb-2">Notifications</h1>
                    <p className="text-gray-400">Stay updated with important alerts and activities.</p>
                </div>
                <button
                    onClick={markAllAsRead}
                    className="text-sm text-primary-500 hover:text-primary-400 font-medium"
                >
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
                                    <span className="text-xs text-gray-500">{formatTime(notif.timestamp)}</span>
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
