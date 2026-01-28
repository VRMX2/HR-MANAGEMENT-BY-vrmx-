import React from 'react';
import { useEmployees } from '../context/EmployeeContext';
import { Users, FileText, Calendar, Cake } from 'lucide-react';

export default function UpcomingEvents() {
    const { employees } = useEmployees();

    // Generate pseudo-events based on employees
    // 1. Work Anniversaries (based on joined date)
    // 2. "Birthdays" (Mocked based on ID hash for demo purposes since we don't handle DOB)

    const currentMonth = new Date().getMonth();

    const anniversaries = employees
        .filter(emp => {
            const joinedDate = new Date(emp.joined);
            return !isNaN(joinedDate) && joinedDate.getMonth() === currentMonth;
        })
        .map(emp => ({
            id: `anniv-${emp.id}`,
            title: 'Work Anniversary',
            subtitle: `${emp.name} joined 1 year ago`,
            time: 'This Month',
            icon: Calendar,
            color: 'text-blue-500 bg-blue-500/10'
        }));

    const events = [
        { id: 'static-1', title: 'Team Meeting', subtitle: 'Weekly engineering sync', time: 'Every Monday', icon: Users, color: 'text-orange-500 bg-orange-500/10' },
        ...anniversaries.slice(0, 3)
    ];

    if (events.length < 3) {
        // Fill properly if low on data
        events.push({ id: 'static-2', title: 'Performance Review', subtitle: 'Q2 Reviews', time: 'Next Week', icon: FileText, color: 'text-teal-500 bg-teal-500/10' });
    }

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
