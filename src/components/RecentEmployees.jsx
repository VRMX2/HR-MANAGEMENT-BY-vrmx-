import React from 'react';
import { Link } from 'react-router-dom';
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
                <Link to="/employees" className="text-sm text-primary-500 hover:text-primary-400 font-medium">View All</Link>
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
                                <td colSpan="3" className="py-12 text-center">
                                    <div className="flex flex-col items-center gap-3">
                                        <div className="w-12 h-12 rounded-full bg-gray-700/30 flex items-center justify-center">
                                            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="text-gray-400 font-medium mb-1">
                                                {searchTerm ? `No employees found matching "${searchTerm}"` : 'No employees yet'}
                                            </p>
                                            <p className="text-gray-600 text-xs">
                                                {searchTerm ? 'Try a different search term' : 'Add your first employee to get started'}
                                            </p>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
