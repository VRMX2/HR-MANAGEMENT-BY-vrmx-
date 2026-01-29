import React, { useState, useMemo } from 'react';
import { useAttendance } from '../context/AttendanceContext';
import { useEmployees } from '../context/EmployeeContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { CheckCircle, XCircle, Clock, Calendar, Download, Search, UserCheck } from 'lucide-react';

export default function Attendance() {
    const { attendanceRecords, checkIn, checkOut, loading } = useAttendance();
    const { employees } = useEmployees();
    const { currentUser } = useAuth();
    const { showToast } = useToast();

    // UI state
    const [searchTerm, setSearchTerm] = useState('');
    const [filterDate, setFilterDate] = useState(new Date().toISOString().split('T')[0]);

    // Check current user status
    // In real app, we would query the backend for *my* status.
    // For this context, we just loop the today list to see if *I* am checked in.
    // Assuming currentUser.email matches employee email for linking (demo logic)
    const todayStr = new Date().toLocaleDateString();

    const myTodayRecord = attendanceRecords.find(r =>
        r.email === currentUser?.email && r.date === todayStr
    );

    const isCheckedIn = !!(myTodayRecord && myTodayRecord.status === 'Check In');

    const handleCheckInOut = async () => {
        // Need to find my employee ID first
        const myEmployeeProfile = employees.find(e => e.email === currentUser?.email);

        if (!myEmployeeProfile) {
            alert("Your account is not linked to an employee profile. Please ask an admin to add you as an employee with email: " + currentUser?.email);
            return;
        }

        try {
            if (isCheckedIn) {
                await checkOut(myEmployeeProfile.id, myEmployeeProfile.email, myTodayRecord.id);
                showToast('Checked out successfully', 'success');
            } else {
                await checkIn(myEmployeeProfile.id, myEmployeeProfile.email, myEmployeeProfile.name);
                showToast('Checked in successfully', 'success');
            }
        } catch (error) {
            showToast('Attendance action failed', 'error');
        }
    };

    const handleExport = () => {
        showToast("Exporting attendance report...", "info");
        // Real CSV logic
        const header = ["Date", "Employee", "Email", "Status", "Time"];
        const rows = filteredRecords.map(r => [
            r.date,
            r.employeeName,
            r.email,
            r.status,
            r.checkIn || r.checkOut
        ]);

        const csvContent = "data:text/csv;charset=utf-8,"
            + header.join(",") + "\n"
            + rows.map(e => e.join(",")).join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `attendance_report_${filterDate}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // Filter records
    const filteredRecords = attendanceRecords.filter(record => {
        const matchesSearch = record.employeeName?.toLowerCase().includes(searchTerm.toLowerCase()) || false;
        return matchesSearch;
    });

    if (loading) return <div className="text-white">Loading attendance...</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-white mb-2">Attendance</h1>
                    <p className="text-gray-400">Track employee work hours and presence.</p>
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={handleExport}
                        className="flex items-center gap-2 bg-dark-800 hover:bg-dark-700 text-white px-4 py-2 rounded-lg border border-dark-700 transition-colors font-medium"
                    >
                        <Download size={18} />
                        <span>Export CSV</span>
                    </button>
                    {!isCheckedIn ? (
                        <button
                            onClick={handleCheckInOut}
                            className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg transition-colors font-bold shadow-lg shadow-green-500/20"
                        >
                            <CheckCircle size={20} />
                            <span>Check In</span>
                        </button>
                    ) : (
                        <button
                            onClick={handleCheckInOut}
                            className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg transition-colors font-bold shadow-lg shadow-red-500/20"
                        >
                            <XCircle size={20} />
                            <span>Check Out</span>
                        </button>
                    )}
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-dark-800 p-6 rounded-xl border border-dark-700 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-green-500/10 text-green-500 flex items-center justify-center">
                        <UserCheck size={24} />
                    </div>
                    <div>
                        <p className="text-gray-400 text-sm">Present Today</p>
                        <h3 className="text-2xl font-bold text-white">
                            {new Set(attendanceRecords.filter(r => r.date === todayStr && r.status === 'Check In').map(r => r.email)).size}
                        </h3>
                    </div>
                </div>
                <div className="bg-dark-800 p-6 rounded-xl border border-dark-700 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center">
                        <Clock size={24} />
                    </div>
                    <div>
                        <p className="text-gray-400 text-sm">Average Hours</p>
                        <h3 className="text-2xl font-bold text-white">8.2</h3>
                    </div>
                </div>
                <div className="bg-dark-800 p-6 rounded-xl border border-dark-700 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-orange-500/10 text-orange-500 flex items-center justify-center">
                        <Calendar size={24} />
                    </div>
                    <div>
                        <p className="text-gray-400 text-sm">Current Time</p>
                        <h3 className="text-2xl font-bold text-white">
                            {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </h3>
                    </div>
                </div>
            </div>

            <div className="bg-dark-800 rounded-xl border border-dark-700 overflow-hidden">
                <div className="p-4 border-b border-dark-700 bg-dark-800/50 flex justify-between items-center">
                    <h3 className="font-bold text-white">Attendance Logs</h3>
                    <div className="relative max-w-xs">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                        <input
                            type="text"
                            placeholder="Search employee..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="bg-dark-900 border border-dark-700 rounded-lg pl-9 pr-4 py-1.5 text-sm text-gray-200 focus:outline-none focus:border-primary-500"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="text-xs text-gray-500 border-b border-dark-700/50 bg-dark-900/30">
                                <th className="px-6 py-4 font-medium uppercase tracking-wider">Employee</th>
                                <th className="px-6 py-4 font-medium uppercase tracking-wider">Date</th>
                                <th className="px-6 py-4 font-medium uppercase tracking-wider">Check In</th>
                                <th className="px-6 py-4 font-medium uppercase tracking-wider">Check Out</th>
                                <th className="px-6 py-4 font-medium uppercase tracking-wider">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-dark-700/50">
                            {filteredRecords.map((record) => (
                                <tr key={record.id} className="hover:bg-dark-700/30 transition-colors">
                                    <td className="px-6 py-4 text-sm font-medium text-white">{record.employeeName}</td>
                                    <td className="px-6 py-4 text-sm text-gray-400">{record.date}</td>
                                    <td className="px-6 py-4 text-sm text-gray-300 font-mono">{record.checkIn}</td>
                                    <td className="px-6 py-4 text-sm text-gray-300 font-mono">{record.checkOut || '-'}</td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${record.status === 'Check In'
                                            ? 'bg-green-500/10 text-green-500 border-green-500/20'
                                            : 'bg-gray-500/10 text-gray-400 border-gray-500/20'
                                            }`}>
                                            {record.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                            {filteredRecords.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                                        No attendance records found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
