import React, { useState } from 'react';
import { useEmployees } from '../context/EmployeeContext';
import { Search, Plus, MoreHorizontal, Trash2, Edit } from 'lucide-react';
import AddEmployeeModal from '../components/AddEmployeeModal';

export default function Employees() {
    const { employees, deleteEmployee, addEmployee, loading } = useEmployees();
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    const filteredEmployees = employees.filter(emp =>
        emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.dept.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this employee?')) {
            await deleteEmployee(id);
        }
    };

    if (loading) {
        return <div className="text-white">Loading employees...</div>;
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-white mb-2">Employees</h1>
                    <p className="text-gray-400">Manage your team members and their roles.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg transition-colors font-medium shadow-lg shadow-primary-500/20"
                >
                    <Plus size={20} />
                    <span>Add Employee</span>
                </button>
            </div>

            <div className="bg-dark-800 rounded-xl border border-dark-700 overflow-hidden flex flex-col">
                <div className="p-4 border-b border-dark-700 bg-dark-800/50">
                    <div className="relative max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                        <input
                            type="text"
                            placeholder="Search by name, role, or department..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-dark-900 border border-dark-700 rounded-lg pl-10 pr-4 py-2 text-sm text-gray-200 focus:outline-none focus:border-primary-500 transition-colors"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="text-xs text-gray-500 border-b border-dark-700/50 bg-dark-900/30">
                                <th className="px-6 py-4 font-medium uppercase tracking-wider">Employee</th>
                                <th className="px-6 py-4 font-medium uppercase tracking-wider">Department</th>
                                <th className="px-6 py-4 font-medium uppercase tracking-wider">Role</th>
                                <th className="px-6 py-4 font-medium uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 font-medium uppercase tracking-wider">Join Date</th>
                                <th className="px-6 py-4 font-medium uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-dark-700/50">
                            {filteredEmployees.length > 0 ? (
                                filteredEmployees.map((emp) => (
                                    <tr key={emp.id} className="group hover:bg-dark-700/30 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-10 h-10 rounded-full ${emp.color || 'bg-gray-600'} flex items-center justify-center text-sm font-bold text-white`}>
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
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button className="p-2 text-gray-400 hover:text-white hover:bg-dark-600 rounded-lg transition-colors" title="Edit">
                                                    <Edit size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(emp.id)}
                                                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                                                    title="Delete"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                                        No employees found matching your search.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="px-6 py-4 border-t border-dark-700 bg-dark-800/50 text-xs text-gray-500 flex justify-between items-center">
                    <span>Showing {filteredEmployees.length} of {employees.length} employees</span>
                    <div className="flex gap-2">
                        <button className="px-3 py-1 rounded border border-dark-600 hover:bg-dark-700 hover:text-white transition-colors disabled:opacity-50" disabled>Previous</button>
                        <button className="px-3 py-1 rounded border border-dark-600 hover:bg-dark-700 hover:text-white transition-colors disabled:opacity-50" disabled>Next</button>
                    </div>
                </div>
            </div>

            <AddEmployeeModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onAdd={addEmployee}
            />
        </div>
    );
}
