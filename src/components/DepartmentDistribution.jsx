import React from 'react';

const departments = [
    { name: 'Engineering', count: 68, percentage: 27, color: 'bg-orange-500' },
    { name: 'Sales', count: 52, percentage: 21, color: 'bg-teal-500' },
    { name: 'Marketing', count: 45, percentage: 18, color: 'bg-purple-500' },
    { name: 'Design', count: 38, percentage: 15, color: 'bg-blue-500' },
    { name: 'HR', count: 25, percentage: 10, color: 'bg-pink-500' },
    { name: 'Finance', count: 20, percentage: 8, color: 'bg-gray-500' },
];

export default function DepartmentDistribution() {
    return (
        <div className="bg-dark-800 rounded-xl p-6 border border-dark-700 h-full">
            <h2 className="text-lg font-bold text-white mb-6">Department Distribution</h2>

            <div className="space-y-5">
                {departments.map((dept) => (
                    <div key={dept.name}>
                        <div className="flex justify-between items-end mb-2">
                            <span className="text-sm font-medium text-white">{dept.name}</span>
                            <span className="text-xs text-gray-400">{dept.count} ({dept.percentage}%)</span>
                        </div>
                        <div className="h-2 w-full bg-dark-700 rounded-full overflow-hidden">
                            <div
                                className={`h-full ${dept.color} rounded-full`}
                                style={{ width: `${dept.percentage}%` }}
                            ></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
