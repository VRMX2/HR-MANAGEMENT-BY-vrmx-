import React from 'react';
import { useEmployees } from '../context/EmployeeContext';
import { useAttendance } from '../context/AttendanceContext';
import { useLocale } from '../context/LocaleContext';
import { UserPlus, LogIn, LogOut } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function RecentActivity() {
    const { employees } = useEmployees();
    const { attendance } = useAttendance();
    const { formatDate, formatTime } = useLocale();

    // 1. Map Attendance Check-ins
    // Assuming attendanceRecords structure has { employeeName, checkInTime, id }
    // We filter for today's check-ins or recent ones.
    // For simplicity, let's take the last 5 records from the raw list if available

    // Note: The context might return grouped data. We need to check useAttendance implementation.
    // Looking at previous patterns, attendanceRecords seems to be a list.

    // Let's mix in "New Hires" from employees list based on 'createdAt' or 'joined' date.

    // Use spread syntax to create a copy before sorting to avoid mutating state
    const recentHires = [...employees]
        .sort((a, b) => new Date(b.joined) - new Date(a.joined))
        .slice(0, 3)
        .map(emp => ({
            id: `hire-${emp.id}`,
            user: emp.name,
            action: `joined the ${emp.dept} team`,
            time: emp.joined, // This is a date string like "Oct 24, 2025"
            timestamp: new Date(emp.joined).getTime(),
            avatar: emp.avatar,
            color: 'bg-green-600'
        }));

    // Mocking "attendance" activity from the context if it provides timestamps. 
    // If context only provides "today's" records, we use that.
    // For now, let's assume attendance contains { employeeId, checkIn, date }

    const recentCheckIns = (attendance || [])
        .slice(0, 5)
        .map(record => {
            const emp = employees.find(e => e.id === record.employeeId || e.id === record.uid);
            return {
                id: `att-${record.id}`,
                user: emp ? emp.name : record.name || record.employeeName || 'Unknown Employee',
                action: 'checked in',
                time: record.checkIn || formatTime(record.timestamp), // e.g., "09:00 AM"
                timestamp: record.timestamp ? new Date(record.timestamp).getTime() : new Date().getTime(),
                avatar: emp ? emp.avatar : (record.name ? record.name.substring(0, 2).toUpperCase() : '??'),
                color: 'bg-blue-600'
            };
        });

    // Merge and sort
    // Since we don't have exact timestamps for everything, we'll just stack them: Check-ins first (today), then recent hires.

    const activities = [...recentCheckIns, ...recentHires].slice(0, 5);

    return (
        <div className="bg-dark-800 rounded-xl p-6 border border-dark-700 h-full">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-white">Recent Activity</h2>
                <Link to="/attendance" className="text-sm text-gray-400 hover:text-white transition-colors">View all</Link>
            </div>

            <div className="space-y-6">
                {activities.length > 0 ? (
                    activities.map((activity) => (
                        <div key={activity.id} className="flex gap-4">
                            <div className={`w-8 h-8 rounded-full ${activity.color} flex-shrink-0 flex items-center justify-center text-xs font-bold text-white overflow-hidden`}>
                                {activity.avatar && activity.avatar.length > 2 ? (
                                    <img src={activity.avatar} alt="avatar" className="w-full h-full object-cover" />
                                ) : (
                                    activity.avatar
                                )}
                            </div>
                            <div>
                                <p className="text-sm text-gray-300">
                                    <span className="font-semibold text-white">{activity.user}</span> {activity.action}
                                </p>
                                <div className="text-xs text-gray-500">
                                    {activity.timestamp ? formatTime(activity.timestamp) : activity.time}
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-500 text-sm">No recent activity recorded.</p>
                )}
            </div>
        </div>
    );
}
