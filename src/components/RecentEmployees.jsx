import React from 'react';
import { MoreHorizontal } from 'lucide-react';
import { useEmployees } from '../context/EmployeeContext';

export default function RecentEmployees() {
    const { employees } = useEmployees();

    return (
        <div className="bg-dark-800 rounded-xl border border-dark-700 overflow-hidden flex flex-col h-full">
            <div className="p-6 flex items-center justify-between border-b border-dark-700">
                <h2 className="text-lg font-bold text-white">Recent Employees</h2>
                <button className="text-sm text-gray-400 hover:text-white transition-colors">View all</button>
            </div>

            <div className="overflow-x-auto flex-1">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="text-xs text-gray-500 border-b border-dark-700/50">
                            <th className="px-6 py-4 font-medium uppercase tracking-wider">Employee</th>
                            <th className="px-6 py-4 font-medium uppercase tracking-wider">Department</th>
                            <th className="px-6 py-4 font-medium uppercase tracking-wider">Role</th>
                            <th className="px-6 py-4 font-medium uppercase tracking-wider">Status</th>
                            <th className="px-6 py-4 font-medium uppercase tracking-wider">Join Date</th>
                            <th className="px-6 py-4 font-medium uppercase tracking-wider"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-dark-700/50">
                        {employees.map((emp) => (
                            <tr key={emp.id} className="group hover:bg-dark-700/30 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-8 h-8 rounded-full ${emp.color} flex items-center justify-center text-xs font-bold text-white`}>
                                            {emp.avatar}
                                        </div>
                                        <div>
                                            <div className="text-sm font-medium text-white">{emp.name}</div>
                                            <div className="text-xs text-gray-500">{emp.email}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-300 font-medium">{emp.dept}</td>
                                <td className="px-6 py-4 text-sm text-gray-400">{emp.role}</td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${emp.status === 'Active'
                                            ? 'bg-green-500/10 text-green-500 border-green-500/20'
                                            : 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
                                        }`}>
                                        {emp.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-400">{emp.joined}</td>
                                <td className="px-6 py-4 text-right">
                                    <button className="p-1 text-gray-500 hover:text-white rounded transition-colors opacity-0 group-hover:opacity-100">
                                        <MoreHorizontal size={16} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
