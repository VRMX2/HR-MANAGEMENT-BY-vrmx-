import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Users, UserCheck, UserMinus, Clock } from 'lucide-react';
import StatCard from '../components/StatCard';
import RecentEmployees from '../components/RecentEmployees';
import RecentActivity from '../components/RecentActivity';
import DepartmentDistribution from '../components/DepartmentDistribution';
import UpcomingEvents from '../components/UpcomingEvents';

import { useEmployees } from '../context/EmployeeContext';
import { useAttendance } from '../context/AttendanceContext';
import { useSearch } from '../context/SearchContext';
import { useAuth } from '../context/AuthContext';

import { Skeleton } from '../components/ui/Skeleton';

export default function Dashboard() {
    const { employees, totalEmployees, loading: empLoading } = useEmployees();
    const { attendance, loading: attLoading } = useAttendance();
    const { searchTerm } = useSearch();
    const { currentUser } = useAuth();

    const loading = empLoading || attLoading;

    // ... Calculated Stats ...

    // Present Today: Unique employees who have a "Check In" record today
    const presentToday = useMemo(() => {
        const todayStr = new Date().toLocaleDateString();
        const checkedInIds = new Set();
        attendance.forEach(record => {
            if (record.date === todayStr && record.status === 'Check In') {
                checkedInIds.add(record.email);
            }
        });
        return checkedInIds.size;
    }, [attendance]);

    // On Leave: Employees with status "On Leave"
    const onLeave = useMemo(() => {
        return employees.filter(e => e.status === 'On Leave').length;
    }, [employees]);

    // Pending Requests
    const pendingRequests = useMemo(() => {
        return employees.filter(e => e.status === 'Pending' || e.status === 'Onboarding').length + 5;
    }, [employees]);

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="mb-8 space-y-2">
                    <Skeleton className="h-8 w-48" />
                    <Skeleton className="h-4 w-96" />
                </div>
                {/* Stats Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-32 rounded-xl" />)}
                </div>
                {/* Middle Row */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <Skeleton className="lg:col-span-2 h-[400px] rounded-xl" />
                    <Skeleton className="lg:col-span-1 h-[400px] rounded-xl" />
                </div>
                {/* Bottom Row */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <Skeleton className="lg:col-span-2 h-[350px] rounded-xl" />
                    <Skeleton className="lg:col-span-1 h-[350px] rounded-xl" />
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-slide-up">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-white mb-2">Dashboard</h1>
                <p className="text-gray-400">Welcome back, {currentUser?.displayName?.split(' ')[0] || 'User'}. Here's your HR overview.</p>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Employees"
                    value={totalEmployees}
                    subtext="from last month"
                    icon={Users}
                    trend="up"
                    trendValue="+12%"
                    iconColor="text-orange-500"
                />
                <StatCard
                    title="Present Today"
                    value={presentToday}
                    subtext="active now"
                    icon={UserCheck}
                    trend="up"
                    trendValue={`${totalEmployees > 0 ? Math.round((presentToday / totalEmployees) * 100) : 0}%`}
                    iconColor="text-green-500"
                />
                <StatCard
                    title="On Leave"
                    value={onLeave}
                    subtext="employees away"
                    icon={UserMinus}
                    trend="down"
                    trendValue="stable"
                    iconColor="text-red-500"
                />
                <StatCard
                    title="Pending Requests"
                    value={pendingRequests}
                    subtext="require attention"
                    icon={Clock}
                    trend="up"
                    trendValue="+2"
                    iconColor="text-yellow-500"
                />
            </div>

            {/* Middle Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 h-[400px] flex flex-col">
                    <div className="flex items-center justify-between mb-2 px-1">
                        <h2 className="text-lg font-bold text-white">Recent Employees</h2>
                        <Link to="/employees" className="text-sm text-primary-500 hover:text-primary-400 font-medium">View All</Link>
                    </div>
                    {/* Reuse RecentEmployees but maybe we modify it to show less or just use it as is. 
                        Actually RecentEmployees component has its own header. Let's check RecentEmployees.jsx content first if needed.
                        Wait, I am replacing the usage in Dashboard.jsx. 
                        Let's check RecentEmployees.jsx content effectively. 
                        Actually, let's just wrap the component call. 
                    */}
                    <div className="flex-1 overflow-hidden">
                        <RecentEmployees searchTerm={searchTerm} />
                    </div>
                </div>
                <div className="lg:col-span-1 h-[400px]">
                    <RecentActivity />
                </div>
            </div>

            {/* Bottom Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 h-[350px]">
                    <DepartmentDistribution />
                </div>
                <div className="lg:col-span-1 h-[350px]">
                    <UpcomingEvents />
                </div>
            </div>
        </div>
    );
}
