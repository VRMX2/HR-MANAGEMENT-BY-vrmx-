import React, { useMemo, useState } from 'react';
import { useEmployees } from '../context/EmployeeContext';
import { useDepartments } from '../context/DepartmentContext';
import { useAttendance } from '../context/AttendanceContext';
import {
    TrendingUp, TrendingDown, Users, Building2, Calendar,
    Download, Activity, UserCheck, Clock, BarChart3
} from 'lucide-react';
import { Skeleton } from '../components/ui/Skeleton';
import LineChart from '../components/charts/LineChart';
import BarChart from '../components/charts/BarChart';
import DonutChart from '../components/charts/DonutChart';
import HeatMap from '../components/charts/HeatMap';
import {
    aggregateByPeriod,
    calculateAttendanceRate,
    generateDepartmentData,
    calculateStatusDistribution,
    generateHeatmapData,
    calculateEmployeeGrowth,
    getColorPalette
} from '../utils/chartHelpers';

export default function Statistics() {
    const { employees, totalEmployees, loading: empLoading } = useEmployees();
    const { departments, loading: deptLoading } = useDepartments();
    const { attendanceRecords, loading: attLoading } = useAttendance();

    const [dateRange, setDateRange] = useState('7days');

    const loading = empLoading || deptLoading || attLoading;

    // Calculate statistics
    const stats = useMemo(() => {
        const todayStr = new Date().toLocaleDateString();
        const yesterdayStr = new Date(Date.now() - 86400000).toLocaleDateString();

        // Today's attendance
        const todayAttendance = new Set(
            attendanceRecords
                .filter(r => r.date === todayStr && (r.status === 'Check In' || r.status === 'Present'))
                .map(r => r.email)
        ).size;

        // Yesterday's attendance
        const yesterdayAttendance = new Set(
            attendanceRecords
                .filter(r => r.date === yesterdayStr && (r.status === 'Check In' || r.status === 'Present'))
                .map(r => r.email)
        ).size;

        const attendanceRate = totalEmployees > 0
            ? Math.round((todayAttendance / totalEmployees) * 100)
            : 0;

        const attendanceChange = yesterdayAttendance > 0
            ? Math.round(((todayAttendance - yesterdayAttendance) / yesterdayAttendance) * 100)
            : 0;

        // Employee status counts
        const activeCount = employees.filter(e => e.status === 'Active').length;
        const onLeaveCount = employees.filter(e => e.status === 'On Leave').length;

        return {
            totalEmployees,
            todayAttendance,
            attendanceRate,
            attendanceChange,
            activeCount,
            onLeaveCount,
            departmentCount: departments.length
        };
    }, [employees, totalEmployees, departments, attendanceRecords]);

    // Chart data
    const weeklyAttendanceData = useMemo(() => {
        return aggregateByPeriod(attendanceRecords, 'day', 7);
    }, [attendanceRecords]);

    const departmentData = useMemo(() => {
        const data = generateDepartmentData(departments);
        return data.map((d, i) => ({
            ...d,
            color: getColorPalette(i).hex
        }));
    }, [departments]);

    const statusData = useMemo(() => {
        const data = calculateStatusDistribution(employees);
        return data
            .filter(d => d.value > 0)
            .map((d, i) => ({
                ...d,
                color: getColorPalette(i).hex
            }));
    }, [employees]);

    const heatmapData = useMemo(() => {
        return generateHeatmapData(attendanceRecords, totalEmployees);
    }, [attendanceRecords, totalEmployees]);

    const employeeGrowthData = useMemo(() => {
        return calculateEmployeeGrowth(employees);
    }, [employees]);

    // Export functionality
    const handleExport = () => {
        const csvData = [
            ['Statistics Report', new Date().toLocaleDateString()],
            [],
            ['Key Metrics'],
            ['Total Employees', stats.totalEmployees],
            ['Attendance Rate', `${stats.attendanceRate}%`],
            ['Active Employees', stats.activeCount],
            ['On Leave', stats.onLeaveCount],
            ['Departments', stats.departmentCount],
            [],
            ['Department Distribution'],
            ['Department', 'Employee Count'],
            ...departmentData.map(d => [d.name, d.value]),
            [],
            ['Status Distribution'],
            ['Status', 'Count', 'Percentage'],
            ...statusData.map(d => [d.name, d.value, `${d.percentage}%`])
        ];

        const csv = csvData.map(row => row.join(',')).join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `statistics_${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    if (loading) {
        return (
            <div className="space-y-8">
                <div className="flex justify-between items-center">
                    <div>
                        <Skeleton className="h-8 w-64 mb-2" />
                        <Skeleton className="h-4 w-96" />
                    </div>
                    <Skeleton className="h-10 w-32" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map(i => (
                        <Skeleton key={i} className="h-32 rounded-xl" />
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Skeleton className="h-80 rounded-xl" />
                    <Skeleton className="h-80 rounded-xl" />
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-slide-up">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-white mb-2 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center">
                            <BarChart3 size={20} className="text-white" />
                        </div>
                        Statistics Dashboard
                    </h1>
                    <p className="text-gray-400">Comprehensive analytics and insights for your organization</p>
                </div>

                <button
                    onClick={handleExport}
                    className="flex items-center gap-2 bg-gradient-to-r from-primary-600 to-purple-600 hover:from-primary-500 hover:to-purple-500 text-white px-5 py-2.5 rounded-lg transition-all duration-200 font-medium shadow-lg shadow-primary-500/20"
                >
                    <Download size={18} />
                    <span>Export Report</span>
                </button>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Total Employees */}
                <div className="bg-gradient-to-br from-dark-800 to-dark-900 p-6 rounded-xl border border-dark-700 relative overflow-hidden group hover:border-primary-500/50 transition-all duration-300">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
                    <div className="relative">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <p className="text-gray-400 text-sm mb-1">Total Employees</p>
                                <h3 className="text-3xl font-bold text-white">{stats.totalEmployees}</h3>
                            </div>
                            <div className="w-12 h-12 rounded-lg bg-primary-500/10 flex items-center justify-center text-primary-500">
                                <Users size={24} />
                            </div>
                        </div>
                        <div className="flex items-center gap-1 text-sm">
                            <TrendingUp size={16} className="text-green-500" />
                            <span className="text-green-500 font-medium">Active workforce</span>
                        </div>
                    </div>
                </div>

                {/* Attendance Rate */}
                <div className="bg-gradient-to-br from-dark-800 to-dark-900 p-6 rounded-xl border border-dark-700 relative overflow-hidden group hover:border-green-500/50 transition-all duration-300">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
                    <div className="relative">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <p className="text-gray-400 text-sm mb-1">Attendance Rate</p>
                                <h3 className="text-3xl font-bold text-white">{stats.attendanceRate}%</h3>
                            </div>
                            <div className="w-12 h-12 rounded-lg bg-green-500/10 flex items-center justify-center text-green-500">
                                <UserCheck size={24} />
                            </div>
                        </div>
                        <div className="flex items-center gap-1 text-sm">
                            {stats.attendanceChange >= 0 ? (
                                <TrendingUp size={16} className="text-green-500" />
                            ) : (
                                <TrendingDown size={16} className="text-red-500" />
                            )}
                            <span className={stats.attendanceChange >= 0 ? 'text-green-500' : 'text-red-500'}>
                                {stats.attendanceChange >= 0 ? '+' : ''}{stats.attendanceChange}% from yesterday
                            </span>
                        </div>
                    </div>
                </div>

                {/* Active Employees */}
                <div className="bg-gradient-to-br from-dark-800 to-dark-900 p-6 rounded-xl border border-dark-700 relative overflow-hidden group hover:border-blue-500/50 transition-all duration-300">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
                    <div className="relative">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <p className="text-gray-400 text-sm mb-1">Active Employees</p>
                                <h3 className="text-3xl font-bold text-white">{stats.activeCount}</h3>
                            </div>
                            <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500">
                                <Activity size={24} />
                            </div>
                        </div>
                        <div className="flex items-center gap-1 text-sm text-gray-400">
                            <Clock size={16} />
                            <span>{stats.onLeaveCount} on leave</span>
                        </div>
                    </div>
                </div>

                {/* Departments */}
                <div className="bg-gradient-to-br from-dark-800 to-dark-900 p-6 rounded-xl border border-dark-700 relative overflow-hidden group hover:border-purple-500/50 transition-all duration-300">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
                    <div className="relative">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <p className="text-gray-400 text-sm mb-1">Departments</p>
                                <h3 className="text-3xl font-bold text-white">{stats.departmentCount}</h3>
                            </div>
                            <div className="w-12 h-12 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-500">
                                <Building2 size={24} />
                            </div>
                        </div>
                        <div className="flex items-center gap-1 text-sm text-gray-400">
                            <Calendar size={16} />
                            <span>Active units</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Weekly Attendance Trend */}
                <div className="bg-dark-800 p-6 rounded-xl border border-dark-700 hover:border-dark-600 transition-colors">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-bold text-white">Weekly Attendance Trend</h3>
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                            <TrendingUp size={16} />
                            <span>Last 7 days</span>
                        </div>
                    </div>
                    <LineChart data={weeklyAttendanceData} height={250} color="#10b981" />
                </div>

                {/* Department Distribution */}
                <div className="bg-dark-800 p-6 rounded-xl border border-dark-700 hover:border-dark-600 transition-colors">
                    <h3 className="text-lg font-bold text-white mb-6">Department Distribution</h3>
                    <DonutChart data={departmentData} size={250} />
                </div>

                {/* Employee Status */}
                <div className="bg-dark-800 p-6 rounded-xl border border-dark-700 hover:border-dark-600 transition-colors">
                    <h3 className="text-lg font-bold text-white mb-6">Employee Status</h3>
                    <BarChart data={statusData} horizontal={true} height={250} />
                </div>

                {/* Attendance Heatmap */}
                <div className="bg-dark-800 p-6 rounded-xl border border-dark-700 hover:border-dark-600 transition-colors">
                    <h3 className="text-lg font-bold text-white mb-6">Attendance Heatmap (Last 30 Days)</h3>
                    <HeatMap data={heatmapData} />
                </div>
            </div>

            {/* Employee Growth Chart */}
            <div className="bg-dark-800 p-6 rounded-xl border border-dark-700 hover:border-dark-600 transition-colors">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold text-white">Employee Growth (Last 6 Months)</h3>
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                        <Users size={16} />
                        <span>New hires per month</span>
                    </div>
                </div>
                <LineChart data={employeeGrowthData} height={200} color="#a855f7" />
            </div>
        </div>
    );
}
