import React, { useState } from 'react';
import { useDepartments } from '../context/DepartmentContext';
import { Plus, Users, Trash2, MoreHorizontal } from 'lucide-react';

export default function Departments() {
    const { departments, addDepartment, deleteDepartment, loading } = useDepartments();
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Local state for adding department
    const [newDeptName, setNewDeptName] = useState('');
    const [newDeptHead, setNewDeptHead] = useState('');

    const handleAddSubmit = async (e) => {
        e.preventDefault();
        await addDepartment(newDeptName, newDeptHead, 0); // Start with 0 employees logic for now
        setIsModalOpen(false);
        setNewDeptName('');
        setNewDeptHead('');
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this department?')) {
            await deleteDepartment(id);
        }
    };

    if (loading) return <div className="text-white">Loading departments...</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-white mb-2">Departments</h1>
                    <p className="text-gray-400">Manage company departments and structure.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg transition-colors font-medium shadow-lg shadow-primary-500/20"
                >
                    <Plus size={20} />
                    <span>Add Department</span>
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {departments.length > 0 ? (
                    departments.map((dept) => (
                        <div key={dept.id} className="bg-dark-800 rounded-xl p-6 border border-dark-700 hover:border-dark-600 transition-all group">
                            <div className="flex justify-between items-start mb-4">
                                <div className={`w-12 h-12 rounded-lg ${dept.color} flex items-center justify-center`}>
                                    <Users className="text-white" size={24} />
                                </div>
                                <button
                                    onClick={() => handleDelete(dept.id)}
                                    className="text-dark-600 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                                >
                                    <Trash2 size={20} />
                                </button>
                            </div>

                            <h3 className="text-xl font-bold text-white mb-1">{dept.name}</h3>
                            <p className="text-sm text-gray-400 mb-4">Head: <span className="text-gray-200">{dept.head}</span></p>

                            <div className="flex items-center gap-2 text-sm text-gray-400 bg-dark-900/50 py-2 px-3 rounded-lg border border-dark-700/50">
                                <Users size={16} />
                                <span>{dept.employeeCount} Members</span>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full bg-dark-800 rounded-xl p-8 text-center text-gray-400 border border-dark-700 border-dashed">
                        <p className="mb-4">No departments found.</p>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="text-primary-500 hover:text-primary-400 font-medium"
                        >
                            Create your first department
                        </button>
                    </div>
                )}
            </div>

            {/* Simple Modal for Adding Department */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="bg-dark-800 rounded-xl border border-dark-700 w-full max-w-md p-6 shadow-2xl">
                        <h2 className="text-xl font-bold text-white mb-6">Add Department</h2>
                        <form onSubmit={handleAddSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Department Name</label>
                                <input
                                    type="text"
                                    required
                                    value={newDeptName}
                                    onChange={(e) => setNewDeptName(e.target.value)}
                                    className="w-full bg-dark-900 border border-dark-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary-500"
                                    placeholder="e.g. Engineering"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Head of Department</label>
                                <input
                                    type="text"
                                    value={newDeptHead}
                                    onChange={(e) => setNewDeptHead(e.target.value)}
                                    className="w-full bg-dark-900 border border-dark-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary-500"
                                    placeholder="e.g. Sarah Johnson"
                                />
                            </div>
                            <div className="pt-4 flex justify-end gap-3">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-400 hover:text-white">Cancel</button>
                                <button type="submit" className="px-6 py-2 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-lg">Create</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
