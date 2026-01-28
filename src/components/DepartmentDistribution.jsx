import React from 'react';
import { useDepartments } from '../context/DepartmentContext';

export default function DepartmentDistribution() {
    const { departments } = useDepartments();

    // Calculate total employees across all departments to determine percentages
    const totalEmployees = departments.reduce((acc, dept) => acc + (dept.employeeCount || 0), 0);

    // Sort by count descending
    const sortedDepartments = [...departments].sort((a, b) => (b.employeeCount || 0) - (a.employeeCount || 0));

    return (
        <div className="bg-dark-800 rounded-xl p-6 border border-dark-700 h-full">
            <h2 className="text-lg font-bold text-white mb-6">Department Distribution</h2>

            <div className="space-y-5">
                {sortedDepartments.length > 0 ? (
                    sortedDepartments.map((dept) => {
                        const count = dept.employeeCount || 0;
                        const percentage = totalEmployees > 0 ? Math.round((count / totalEmployees) * 100) : 0;

                        return (
                            <div key={dept.id}>
                                <div className="flex justify-between items-end mb-2">
                                    <span className="text-sm font-medium text-white">{dept.name}</span>
                                    <span className="text-xs text-gray-400">{count} ({percentage}%)</span>
                                </div>
                                <div className="h-2 w-full bg-dark-700 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full ${dept.color ? dept.color.replace('text-', 'bg-') : 'bg-blue-500'} rounded-full`}
                                        style={{ width: `${percentage}%` }}
                                    ></div>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <p className="text-gray-500 text-sm">No department data available.</p>
                )}
            </div>
        </div>
    );
}
