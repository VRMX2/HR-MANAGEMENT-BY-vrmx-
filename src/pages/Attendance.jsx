import React from 'react';
import { useAttendance } from '../context/AttendanceContext';
import { useAuth } from '../context/AuthContext';
import { Clock, LogIn, LogOut, CalendarCheck } from 'lucide-react';

export default function Attendance() {
    const { attendance, markAttendance, loading } = useAttendance();
    const { currentUser } = useAuth();

    if (loading) return <div className="text-white">Loading attendance records...</div>;

    // Simple logic to determine if last action was check-in
    const myRecords = attendance.filter(r => r.email === currentUser?.email);
    const lastRecord = myRecords.length > 0 ? myRecords[0] : null; // Sorted by desc in context
    const isCheckedIn = lastRecord?.status === 'Check In';

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-white mb-2">Attendance</h1>
                    <p className="text-gray-400">Track employee check-ins and working hours.</p>
                </div>
                <div className="flex gap-3">
                    {!isCheckedIn ? (
                        <button
                            onClick={() => markAttendance('Check In')}
                            className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg transition-colors font-medium shadow-lg shadow-green-500/20"
                        >
                            <LogIn size={20} />
                            <span>Check In</span>
                        </button>
                    ) : (
                        <button
                            onClick={() => markAttendance('Check Out')}
                            className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg transition-colors font-medium shadow-lg shadow-red-500/20"
                        >
                            <LogOut size={20} />
                            <span>Check Out</span>
                        </button>
                    )}
                </div>
            </div>

            <div className="bg-dark-800 rounded-xl border border-dark-700 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="text-xs text-gray-500 border-b border-dark-700/50 bg-dark-900/30">
                                <th className="px-6 py-4 font-medium uppercase tracking-wider">Employee</th>
                                <th className="px-6 py-4 font-medium uppercase tracking-wider">Date</th>
                                <th className="px-6 py-4 font-medium uppercase tracking-wider">Time</th>
                                <th className="px-6 py-4 font-medium uppercase tracking-wider">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-dark-700/50">
                            {attendance.map((record) => (
                                <tr key={record.id} className="group hover:bg-dark-700/30 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-primary-600/20 flex items-center justify-center text-primary-500">
                                                <CalendarCheck size={16} />
                                            </div>
                                            <div className="text-sm font-medium text-white">{record.name}</div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-400">{record.date}</td>
                                    <td className="px-6 py-4 text-sm text-gray-400">
                                        {record.timestamp?.seconds ? new Date(record.timestamp.seconds * 1000).toLocaleTimeString() : 'Just now'}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${record.status === 'Check In'
                                                ? 'bg-green-500/10 text-green-500 border-green-500/20'
                                                : 'bg-orange-500/10 text-orange-500 border-orange-500/20'
                                            }`}>
                                            {record.status === 'Check In' ? <LogIn size={12} /> : <LogOut size={12} />}
                                            {record.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                            {attendance.length === 0 && (
                                <tr>
                                    <td colSpan="4" className="px-6 py-8 text-center text-gray-500">No attendance records found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
