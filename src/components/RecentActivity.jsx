import React from 'react';

const activities = [
    { id: 1, user: 'Sarah Johnson', action: 'submitted leave request', time: '2 minutes ago', avatar: 'SJ', color: 'bg-yellow-600' },
    { id: 2, user: 'Michael Chen', action: 'completed onboarding', time: '15 minutes ago', avatar: 'MC', color: 'bg-green-600' },
    { id: 3, user: 'Emily Davis', action: 'updated profile information', time: '1 hour ago', avatar: 'ED', color: 'bg-orange-600' },
    { id: 4, user: 'James Wilson', action: 'joined the Sales team', time: '3 hours ago', avatar: 'JW', color: 'bg-purple-600' },
    { id: 5, user: 'Lisa Anderson', action: 'approved 3 leave requests', time: '5 hours ago', avatar: 'LA', color: 'bg-pink-600' },
];

export default function RecentActivity() {
    return (
        <div className="bg-dark-800 rounded-xl p-6 border border-dark-700 h-full">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-white">Recent Activity</h2>
                <button className="text-sm text-gray-400 hover:text-white transition-colors">View all</button>
            </div>

            <div className="space-y-6">
                {activities.map((activity) => (
                    <div key={activity.id} className="flex gap-4">
                        <div className={`w-8 h-8 rounded-full ${activity.color} flex-shrink-0 flex items-center justify-center text-xs font-bold text-white`}>
                            {activity.avatar}
                        </div>
                        <div>
                            <p className="text-sm text-gray-300">
                                <span className="font-semibold text-white">{activity.user}</span> {activity.action}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
