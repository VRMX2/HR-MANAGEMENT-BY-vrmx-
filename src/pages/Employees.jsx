import React, { useState, useEffect } from 'react';
import { useEmployees } from '../context/EmployeeContext';
import { useSearch } from '../context/SearchContext';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import { Plus, MoreHorizontal, Trash2, Edit } from 'lucide-react';
import clsx from 'clsx';
import AddEmployeeModal from '../components/AddEmployeeModal';

import { Skeleton } from '../components/ui/Skeleton';

const statusColors = {
    'Active': 'bg-green-500/10 text-green-500 border border-green-500/20',
    'On Leave': 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20',
    'Terminated': 'bg-red-500/10 text-red-500 border border-red-500/20'
};

export default function Employees() {
    const { employees, deleteEmployee, addEmployee, updateEmployee, loading } = useEmployees();
    const { searchTerm } = useSearch();
    const { showToast } = useToast();
    const { userData } = useAuth();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingEmployee, setEditingEmployee] = useState(null);

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Reset to page 1 when search term changes
    React.useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    const filteredEmployees = employees.filter(emp =>
        emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.dept.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Calculate pages
    const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentEmployees = filteredEmployees.slice(indexOfFirstItem, indexOfLastItem);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this employee?')) {
            try {
                await deleteEmployee(id);
                showToast('Employee deleted successfully', 'success');
            } catch (error) {
                showToast('Failed to delete employee', 'error');
            }
        }
    };

    const handleEdit = (employee) => {
        setEditingEmployee(employee);
        setIsModalOpen(true);
    };

    const handleModalSubmit = async (data) => {
        try {
            if (editingEmployee) {
                await updateEmployee(editingEmployee.id, data);
                showToast('Employee updated successfully', 'success');
            } else {
                await addEmployee(data);
                showToast('Employee added successfully', 'success');
            }
            setEditingEmployee(null);
            setIsModalOpen(false);
        } catch (error) {
            showToast('Operation failed', 'error');
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingEmployee(null);
    }

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <Skeleton className="h-8 w-48 mb-2" />
                        <Skeleton className="h-4 w-64" />
                    </div>
                    <Skeleton className="h-10 w-40" />
                </div>
                <div className="bg-dark-800 rounded-xl border border-dark-700 overflow-hidden">
                    <div className="p-4 border-b border-dark-700">
                        <Skeleton className="h-10 w-full max-w-md" />
                    </div>
                    <div className="p-4 space-y-4">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="flex gap-4">
                                <Skeleton className="h-12 w-12 rounded-full" />
                                <div className="space-y-2 flex-1">
                                    <Skeleton className="h-4 w-1/3" />
                                    <Skeleton className="h-3 w-1/4" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="animate-slide-up">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-white mb-2">Employees</h1>
                    <p className="text-gray-400">Manage your team members and their roles.</p>
                </div>
                <button
                    onClick={() => { setEditingEmployee(null); setIsModalOpen(true); }}
                    className="flex items-center gap-2 bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg transition-colors font-medium shadow-lg shadow-primary-500/20"
                >
                    <Plus size={20} />
                    <span>Add Employee</span>
                </button>
            </div>

            <div className="bg-dark-800 rounded-xl border border-dark-700 overflow-hidden flex flex-col">
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
                            {currentEmployees.length > 0 ? (
                                currentEmployees.map((emp, idx) => (
                                    <tr key={emp.id} className="border-b border-dark-700 hover:bg-dark-700/30 transition-all duration-200 elevation-1">
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center text-sm font-bold text-white">
                                                    {emp.name?.charAt(0)?.toUpperCase() || 'U'}
                                                </div>
                                                <div>
                                                    <div className="font-medium text-white">{emp.name}</div>
                                                    <div className="text-sm text-gray-400">{emp.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6 text-sm text-gray-300 font-medium">{emp.dept}</td>
                                        <td className="py-4 px-6 text-sm text-gray-400">{emp.role}</td>
                                        <td className="py-4 px-6">
                                            <span className={clsx("px-3 py-1 rounded-full text-xs font-medium", statusColors[emp.status] || statusColors.Active)}>
                                                {emp.status}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6 text-sm text-gray-400">{emp.joined}</td>
                                        <td className="py-4 px-6 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => handleEdit(emp)}
                                                    className="p-2 text-gray-400 hover:text-white hover:bg-dark-600 rounded-lg transition-colors"
                                                    title="Edit"
                                                >
                                                    <Edit size={16} />
                                                </button>
                                                {userData?.role === 'ADMIN' && (
                                                    <button
                                                        onClick={() => handleDelete(emp.id)}
                                                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                                                        title="Delete"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="px-6 py-16 text-center text-gray-500">
                                        <div className="flex flex-col items-center gap-4">
                                            <div className="w-16 h-16 rounded-full bg-dark-900 border border-dark-700 flex items-center justify-center text-gray-600">
                                                <Search size={32} />
                                            </div>
                                            <div>
                                                <p className="text-gray-300 font-medium mb-1">No employees found</p>
                                                <p className="text-xs">
                                                    {searchTerm
                                                        ? `We couldn't find any match for "${searchTerm}"`
                                                        : "Get started by adding your first team member"}
                                                </p>
                                            </div>
                                            {!searchTerm && (
                                                <button
                                                    onClick={() => setIsModalOpen(true)}
                                                    className="mt-2 text-primary-500 hover:text-primary-400 text-sm font-medium"
                                                >
                                                    Add New Employee
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Stats */}
                <div className="px-6 py-4 border-t border-dark-700 bg-dark-800/50 text-xs text-gray-500 flex justify-between items-center">
                    <span>Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredEmployees.length)} of {filteredEmployees.length} employees</span>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className="px-3 py-1 rounded border border-dark-600 hover:bg-dark-700 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Previous
                        </button>
                        <button
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages || totalPages === 0}
                            className="px-3 py-1 rounded border border-dark-600 hover:bg-dark-700 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>

            <AddEmployeeModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onAdd={handleModalSubmit}
                initialData={editingEmployee}
            />
        </div>
    );
}
