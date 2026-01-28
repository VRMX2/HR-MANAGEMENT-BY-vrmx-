import React from 'react';
import { useEmployees } from '../context/EmployeeContext';

export default function RecentEmployees({ searchTerm = '' }) {
    const { employees } = useEmployees();

    // Filter based on search term directly here
    const filteredEmployees = employees.filter(emp =>
        emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.dept.toLowerCase().includes(searchTerm.toLowerCase())
    ).slice(0, 5); // Show only top 5 recent even when filtered? Or just show filtered list. Dashboard usually shows "Recent". 
    // Let's keep it "Recent" but filtered.

    return (
        <div className="bg-dark-800 rounded-xl border border-dark-700 h-full flex flex-col">
            <div className="p-6 border-b border-dark-700 flex justify-between items-center bg-dark-800/50">
                <h2 className="text-lg font-bold text-white">Recent Employees</h2>
                <button className="text-sm text-primary-500 hover:text-primary-400 font-medium">View All</button>
            </div>
            <div className="p-4 overflow-x-auto flex-1">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="text-xs text-gray-500">
                            <th className="pb-4 font-medium uppercase tracking-wider pl-2">Employee</th>
                            <th className="pb-4 font-medium uppercase tracking-wider">Role</th>
                            <th className="pb-4 font-medium uppercase tracking-wider">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-dark-700/50">
                        {filteredEmployees.map((employee) => (
                            <tr key={employee.id} className="group hover:bg-dark-700/30 transition-colors">
                                <td className="py-3 pl-2">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-8 h-8 rounded-full ${employee.color || 'bg-gray-600'} flex items-center justify-center text-xs font-bold text-white`}>
                                            {employee.avatar}
                                        </div>
                                        <div>
                                            <div className="text-sm font-medium text-white">{employee.name}</div>
                                            <div className="text-xs text-gray-500">{employee.email}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="py-3 text-sm text-gray-400">{employee.role}</td>
                                <td className="py-3">
                                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${employee.status === 'Active'
                                            ? 'bg-green-500/10 text-green-500'
                                            : employee.status === 'On Leave'
                                                ? 'bg-red-500/10 text-red-500'
                                                : 'bg-yellow-500/10 text-yellow-500'
                                        }`}>
                                        {employee.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                        {filteredEmployees.length === 0 && (
                            <tr>
                                <td colSpan="3" className="py-8 text-center text-gray-500">
                                    No employees found matching "{searchTerm}".
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
