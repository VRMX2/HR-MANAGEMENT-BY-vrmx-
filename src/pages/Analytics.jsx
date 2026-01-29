import React, { useMemo } from 'react';
import { useEmployees } from '../context/EmployeeContext';
import { useDepartments } from '../context/DepartmentContext';
import { useAttendance } from '../context/AttendanceContext';
import { Users, Building2, TrendingUp, UserMinus, UserCheck, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

import { Skeleton } from '../components/ui/Skeleton';

export default function Analytics() {
    const { employees, loading: empLoading } = useEmployees();
    const { departments, loading: deptLoading } = useDepartments();
    const { attendance, loading: attLoading } = useAttendance();

    const loading = empLoading || deptLoading || attLoading;

    // -- Real Data Calculations --

    // 1. Total Employees
    const totalEmployees = employees.length;

    // 2. Turnover / Retention (Mock logic based on "status")
    const activeEmployees = employees.filter(e => e.status === 'Active').length;
    const leaveEmployees = employees.filter(e => e.status === 'On Leave').length;
    const onBoarding = employees.filter(e => e.status === 'Onboarding' || e.status === 'Probation').length;

    // 3. Department Data
    const deptData = useMemo(() => {
        return departments.map(d => ({
            name: d.name,
            count: d.employeeCount || 0,
            color: d.color
        })).sort((a, b) => b.count - a.count);
    }, [departments]);

    const maxCount = Math.max(...deptData.map(d => d.count), 1);

    // 4. Attendance Rate (Calculated from today's potential vs actual)
    const attendanceRate = useMemo(() => {
        if (totalEmployees === 0) return 100;
        const todayStr = new Date().toLocaleDateString();
        const checkedInCount = new Set(
            attendance
                .filter(r => r.date === todayStr && (r.status === 'Check In' || r.status === 'Present'))
                .map(r => r.email)
        ).size;
        return Math.round((checkedInCount / totalEmployees) * 100);
    }, [attendance, totalEmployees]);

    // 5. Gender Diversity (Mocked for now as we don't field "gender", using random distribution seeded by length to be consistent)
    // In a real app, we would add "Gender" to the employee form.
    // Let's iterate employees and guess based on nothing (mock) or just show a placeholder "Data Missing".
    // Better: Show "Employee Status Distribution" instead of Gender.

    const statusDistribution = useMemo(() => {
        const dist = { Active: 0, 'On Leave': 0, Onboarding: 0, Terminated: 0, Other: 0 };
        employees.forEach(e => {
            const s = e.status || 'Other';
            if (dist[s] !== undefined) dist[s]++;
            else dist.Other++;
        });
        return dist;
    }, [employees]);

    const handleExport = () => {
        const headers = ['Department', 'Employee Count'];
        const rows = deptData.map(d => [d.name, d.count]);

        const csvContent = "data:text/csv;charset=utf-8,"
            + headers.join(",") + "\n"
            + rows.map(e => e.join(",")).join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "analytics_report.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    if (loading) {
        return (
            <div className="space-y-8">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <Skeleton className="h-8 w-64 mb-2" />
                        <Skeleton className="h-4 w-96" />
                    </div>
                    <Skeleton className="h-10 w-32" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="bg-dark-800 p-6 rounded-xl border border-dark-700">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <Skeleton className="h-4 w-24 mb-2" />
                                    <Skeleton className="h-8 w-16" />
                                </div>
                                <Skeleton className="h-10 w-10 rounded-lg" />
                            </div>
                            <Skeleton className="h-4 w-32" />
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Skeleton className="h-80 w-full rounded-xl" />
                    <Skeleton className="h-80 w-full rounded-xl" />
                </div>
            </div>
        )
    }

    return (
        <div className="animate-slide-up">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-white mb-2">Analytics Dashboard</h1>
                    <p className="text-gray-400">Real-time overview of your organization's metrics.</p>
                </div>
                <button
                    onClick={handleExport}
                    className="bg-dark-800 hover:bg-dark-700 text-white px-4 py-2 rounded-lg border border-dark-700 transition-colors text-sm font-medium flex items-center gap-2"
                >
                    <TrendingUp size={16} /> Export Report
                </button>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-dark-800 p-6 rounded-xl border border-dark-700">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <p className="text-gray-400 text-sm">Total Employees</p>
                            <h3 className="text-3xl font-bold text-white mt-1">{totalEmployees}</h3>
                        </div>
                        <div className="bg-primary-500/20 p-2 rounded-lg text-primary-500">
                            <Users size={24} />
                        </div>
                    </div>
                    <p className="text-green-500 text-sm flex items-center gap-1">
                        <TrendingUp size={14} /> <span>Live Count</span>
                    </p>
                </div>

                <div className="bg-dark-800 p-6 rounded-xl border border-dark-700">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <p className="text-gray-400 text-sm">Attendance Rate</p>
                            <h3 className="text-3xl font-bold text-white mt-1">{attendanceRate}%</h3>
                        </div>
                        <div className="bg-green-500/20 p-2 rounded-lg text-green-500">
                            <UserCheck size={24} />
                        </div>
                    </div>
                    <p className="text-gray-500 text-sm">Today's Check-ins</p>
                </div>

                <div className="bg-dark-800 p-6 rounded-xl border border-dark-700">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <p className="text-gray-400 text-sm">On Leave</p>
                            <h3 className="text-3xl font-bold text-white mt-1">{leaveEmployees}</h3>
                        </div>
                        <div className="bg-orange-500/20 p-2 rounded-lg text-orange-500">
                            <UserMinus size={24} />
                        </div>
                    </div>
                    <p className="text-sm text-gray-500">Currently away</p>
                </div>

                <div className="bg-dark-800 p-6 rounded-xl border border-dark-700">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <p className="text-gray-400 text-sm">Departments</p>
                            <h3 className="text-3xl font-bold text-white mt-1">{departments.length}</h3>
                        </div>
                        <div className="bg-purple-500/20 p-2 rounded-lg text-purple-500">
                            <Building2 size={24} />
                        </div>
                    </div>
                    <p className="text-blue-500 text-sm">Active Units</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Department Distribution Chart */}
                <div className="bg-dark-800 p-6 rounded-xl border border-dark-700">
                    <h3 className="text-lg font-bold text-white mb-6">Staff by Department</h3>
                    <div className="space-y-4">
                        {deptData.map((d) => (
                            <div key={d.name}>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="text-gray-300">{d.name}</span>
                                    <span className="text-gray-400">{d.count} employees</span>
                                </div>
                                <div className="w-full bg-dark-700 h-2 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full ${d.color || 'bg-blue-500'} rounded-full`}
                                        style={{ width: `${maxCount > 0 ? (d.count / maxCount) * 100 : 0}%` }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                        {deptData.length === 0 && <p className="text-gray-500">No departments found.</p>}
                    </div>
                </div>

                {/* Status Distribution */}
                <div className="bg-dark-800 p-6 rounded-xl border border-dark-700">
                    <h3 className="text-lg font-bold text-white mb-6">Employment Status</h3>
                    <div className="space-y-6">
                        <div className="flex items-center gap-4">
                            <div className="w-24 text-sm text-gray-400">Active</div>
                            <div className="flex-1 bg-dark-700 h-8 rounded-lg overflow-hidden relative">
                                <div className="absolute inset-y-0 left-0 bg-green-500/20 flex items-center px-3 text-xs text-green-200"
                                    style={{ width: `${totalEmployees > 0 ? (statusDistribution.Active / totalEmployees) * 100 : 0}%` }}>
                                    {statusDistribution.Active}
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="w-24 text-sm text-gray-400">On Leave</div>
                            <div className="flex-1 bg-dark-700 h-8 rounded-lg overflow-hidden relative">
                                <div className="absolute inset-y-0 left-0 bg-orange-500/20 flex items-center px-3 text-xs text-orange-200"
                                    style={{ width: `${totalEmployees > 0 ? (statusDistribution['On Leave'] / totalEmployees) * 100 : 0}%` }}>
                                    {statusDistribution['On Leave']}
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="w-24 text-sm text-gray-400">Onboarding</div>
                            <div className="flex-1 bg-dark-700 h-8 rounded-lg overflow-hidden relative">
                                <div className="absolute inset-y-0 left-0 bg-blue-500/20 flex items-center px-3 text-xs text-blue-200"
                                    style={{ width: `${totalEmployees > 0 ? ((statusDistribution.Onboarding || 0) / totalEmployees) * 100 : 0}%` }}>
                                    {statusDistribution.Onboarding || 0}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
