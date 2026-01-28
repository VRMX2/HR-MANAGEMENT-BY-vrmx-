import React from 'react';
import { Users, UserCheck, UserMinus, Clock } from 'lucide-react';
import StatCard from '../components/StatCard';
import RecentEmployees from '../components/RecentEmployees';
import RecentActivity from '../components/RecentActivity';
import DepartmentDistribution from '../components/DepartmentDistribution';
import UpcomingEvents from '../components/UpcomingEvents';

import { useEmployees } from '../context/EmployeeContext';

export default function Dashboard() {
    const { totalEmployees } = useEmployees();

    return (
        <div className="space-y-6">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-white mb-2">Dashboard</h1>
                <p className="text-gray-400">Welcome back, John. Here's your HR overview.</p>
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
                    value="234"
                    subtext="attendance rate"
                    icon={UserCheck}
                    trend="up"
                    trendValue="94.4%"
                    iconColor="text-green-500"
                />
                <StatCard
                    title="On Leave"
                    value="14"
                    subtext="employees today"
                    icon={UserMinus}
                    trend="down"
                    trendValue="-3"
                    iconColor="text-red-500"
                />
                <StatCard
                    title="Pending Requests"
                    value="23"
                    subtext="require attention"
                    icon={Clock}
                    trend="up"
                    trendValue="+5"
                    iconColor="text-yellow-500"
                />
            </div>

            {/* Middle Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 h-[400px]">
                    <RecentEmployees />
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
