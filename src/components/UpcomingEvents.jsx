import React from 'react';
import { Users, FileText, Calendar, Cake } from 'lucide-react';

const events = [
    { id: 1, title: 'Team Meeting', subtitle: 'Weekly engineering sync', time: 'Today, 2:00 PM', icon: Users, color: 'text-orange-500 bg-orange-500/10' },
    { id: 2, title: 'Performance Review', subtitle: 'Q4 2025 reviews begin', time: 'Tomorrow', icon: FileText, color: 'text-teal-500 bg-teal-500/10' },
    { id: 3, title: 'Company Holiday', subtitle: 'Office closed', time: 'Feb 14, 2026', icon: Calendar, color: 'text-blue-500 bg-blue-500/10' },
    { id: 4, title: 'Birthday Celebration', subtitle: '5 birthdays this week', time: 'This Week', icon: Cake, color: 'text-yellow-500 bg-yellow-500/10' },
];

export default function UpcomingEvents() {
    return (
        <div className="bg-dark-800 rounded-xl p-6 border border-dark-700 h-full">
            <h2 className="text-lg font-bold text-white mb-6">Upcoming Events</h2>

            <div className="space-y-4">
                {events.map((event) => (
                    <div key={event.id} className="flex items-center gap-4 p-3 rounded-lg hover:bg-dark-700/50 transition-colors">
                        <div className={`w-10 h-10 rounded-lg ${event.color} flex items-center justify-center`}>
                            <event.icon size={20} />
                        </div>
                        <div className="flex-1">
                            <h4 className="text-sm font-semibold text-white">{event.title}</h4>
                            <p className="text-xs text-gray-500">{event.subtitle}</p>
                        </div>
                        <div className="text-xs font-medium text-gray-400">
                            {event.time}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
