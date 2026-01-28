import React from 'react';
import { useEmployees } from '../context/EmployeeContext';
import { useDepartments } from '../context/DepartmentContext';
import { Users, Building2, TrendingUp, DollarSign } from 'lucide-react';

export default function Analytics() {
    const { employees } = useEmployees();
    const { departments } = useDepartments();

    // Simple derived stats
    const totalEmployees = employees.length;
    const activeEmployees = employees.filter(e => e.status === 'Active').length;
    const leaveEmployees = employees.filter(e => e.status === 'On Leave').length;

    const deptData = departments.map(d => ({
        name: d.name,
        count: d.employeeCount || Math.floor(Math.random() * 20) + 5, // Mock count if 0
        color: d.color
    }));

    const maxCount = Math.max(...deptData.map(d => d.count), 1);

    return (
        <div>
            <h1 className="text-2xl font-bold text-white mb-2">Analytics Dashboard</h1>
            <p className="text-gray-400 mb-8">Overview of company performance and metrics.</p>

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
                        <TrendingUp size={14} /> <span>+12% from last month</span>
                    </p>
                </div>

                <div className="bg-dark-800 p-6 rounded-xl border border-dark-700">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <p className="text-gray-400 text-sm">Active Departments</p>
                            <h3 className="text-3xl font-bold text-white mt-1">{departments.length}</h3>
                        </div>
                        <div className="bg-purple-500/20 p-2 rounded-lg text-purple-500">
                            <Building2 size={24} />
                        </div>
                    </div>
                    <p className="text-gray-500 text-sm">Stable structure</p>
                </div>

                <div className="bg-dark-800 p-6 rounded-xl border border-dark-700">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <p className="text-gray-400 text-sm">On Leave</p>
                            <h3 className="text-3xl font-bold text-white mt-1">{leaveEmployees}</h3>
                        </div>
                        <div className="bg-orange-500/20 p-2 rounded-lg text-orange-500">
                            <Users size={24} />
                        </div>
                    </div>
                    <p className="text-sm text-gray-500">Currently away</p>
                </div>

                <div className="bg-dark-800 p-6 rounded-xl border border-dark-700">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <p className="text-gray-400 text-sm">Avg. Attendance</p>
                            <h3 className="text-3xl font-bold text-white mt-1">94%</h3>
                        </div>
                        <div className="bg-green-500/20 p-2 rounded-lg text-green-500">
                            <TrendingUp size={24} />
                        </div>
                    </div>
                    <p className="text-green-500 text-sm">+2.4% increase</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Department Distribution Chart */}
                <div className="bg-dark-800 p-6 rounded-xl border border-dark-700">
                    <h3 className="text-lg font-bold text-white mb-6">Department Distribution</h3>
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
                                        style={{ width: `${(d.count / maxCount) * 100}%` }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                        {deptData.length === 0 && <p className="text-gray-500">No departments data available.</p>}
                    </div>
                </div>

                {/* Recruitment Funnel (Mock) */}
                <div className="bg-dark-800 p-6 rounded-xl border border-dark-700">
                    <h3 className="text-lg font-bold text-white mb-6">Recruitment Pipeline</h3>
                    <div className="space-y-6">
                        <div className="flex items-center gap-4">
                            <div className="w-24 text-sm text-gray-400">Applications</div>
                            <div className="flex-1 bg-dark-700 h-8 rounded-lg overflow-hidden relative">
                                <div className="absolute inset-y-0 left-0 bg-blue-500/20 w-[80%] flex items-center px-3 text-xs text-blue-200">142 Candidates</div>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="w-24 text-sm text-gray-400">Interview</div>
                            <div className="flex-1 bg-dark-700 h-8 rounded-lg overflow-hidden relative">
                                <div className="absolute inset-y-0 left-0 bg-purple-500/20 w-[45%] flex items-center px-3 text-xs text-purple-200">64 Scheduled</div>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="w-24 text-sm text-gray-400">Offer</div>
                            <div className="flex-1 bg-dark-700 h-8 rounded-lg overflow-hidden relative">
                                <div className="absolute inset-y-0 left-0 bg-orange-500/20 w-[20%] flex items-center px-3 text-xs text-orange-200">18 Offered</div>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="w-24 text-sm text-gray-400">Hired</div>
                            <div className="flex-1 bg-dark-700 h-8 rounded-lg overflow-hidden relative">
                                <div className="absolute inset-y-0 left-0 bg-green-500/20 w-[12%] flex items-center px-3 text-xs text-green-200">12 Joined</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
