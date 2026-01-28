import React, { useState } from 'react';
import { useDepartments } from '../context/DepartmentContext';
import { useSearch } from '../context/SearchContext';
import { useToast } from '../context/ToastContext';
import { Plus, Users, Trash2, Edit2, X } from 'lucide-react';

export default function Departments() {
    const { departments, addDepartment, updateDepartment, deleteDepartment, loading } = useDepartments();
    const { searchTerm } = useSearch();
    const { showToast } = useToast();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingDept, setEditingDept] = useState(null);

    // Local state for adding/editing department
    const [deptName, setDeptName] = useState('');
    const [deptHead, setDeptHead] = useState('');

    const handleOpenModal = (dept = null) => {
        if (dept) {
            setEditingDept(dept);
            setDeptName(dept.name);
            setDeptHead(dept.head);
        } else {
            setEditingDept(null);
            setDeptName('');
            setDeptHead('');
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingDept(null);
        setDeptName('');
        setDeptHead('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingDept) {
                if (updateDepartment) {
                    await updateDepartment(editingDept.id, { name: deptName, head: deptHead });
                    showToast('Department updated successfully', 'success');
                } else {
                    alert("Update feature not yet implemented in backend.");
                }
            } else {
                await addDepartment(deptName, deptHead, 0);
                showToast('Department created successfully', 'success');
            }
            handleCloseModal();
        } catch (error) {
            showToast('Operation failed', 'error');
        }
    };

    const handleDelete = async (id, e) => {
        e.stopPropagation(); // Prevent card click
        if (window.confirm('Are you sure you want to delete this department? This action cannot be undone.')) {
            try {
                await deleteDepartment(id);
                showToast('Department deleted successfully', 'success');
            } catch (error) {
                showToast('Failed to delete department', 'error');
            }
        }
    };

    const filteredDepartments = departments.filter(dept =>
        dept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dept.head.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div className="text-white">Loading departments...</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-white mb-2">Departments</h1>
                    <p className="text-gray-400">Manage company departments and structure.</p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="flex items-center gap-2 bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg transition-colors font-medium shadow-lg shadow-primary-500/20"
                >
                    <Plus size={20} />
                    <span>Add Department</span>
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredDepartments.length > 0 ? (
                    filteredDepartments.map((dept) => (
                        <div key={dept.id} className="bg-dark-800 rounded-xl p-6 border border-dark-700 hover:border-dark-600 transition-all group relative">
                            <div className="flex justify-between items-start mb-4">
                                <div className={`w-12 h-12 rounded-lg ${dept.color} flex items-center justify-center`}>
                                    <Users className="text-white" size={24} />
                                </div>
                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity bg-dark-900/80 p-1.5 rounded-lg border border-dark-600 backdrop-blur-sm">
                                    <button
                                        onClick={() => handleOpenModal(dept)}
                                        className="text-gray-400 hover:text-white transition-colors p-1"
                                        title="Edit"
                                    >
                                        <Edit2 size={16} />
                                    </button>
                                    <button
                                        onClick={(e) => handleDelete(dept.id, e)}
                                        className="text-gray-400 hover:text-red-500 transition-colors p-1"
                                        title="Delete"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
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
                        <p className="mb-4">
                            {searchTerm ? `No departments matching "${searchTerm}".` : "No departments found."}
                        </p>
                        {!searchTerm && (
                            <button
                                onClick={() => handleOpenModal()}
                                className="text-primary-500 hover:text-primary-400 font-medium"
                            >
                                Create your first department
                            </button>
                        )}
                    </div>
                )}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-dark-800 rounded-xl border border-dark-700 w-full max-w-md p-6 shadow-2xl relative">
                        <button
                            onClick={handleCloseModal}
                            className="absolute top-4 right-4 text-gray-400 hover:text-white"
                        >
                            <X size={20} />
                        </button>

                        <h2 className="text-xl font-bold text-white mb-6">
                            {editingDept ? 'Edit Department' : 'Add Department'}
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Department Name</label>
                                <input
                                    type="text"
                                    required
                                    value={deptName}
                                    onChange={(e) => setDeptName(e.target.value)}
                                    className="w-full bg-dark-900 border border-dark-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary-500"
                                    placeholder="e.g. Engineering"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Head of Department</label>
                                <input
                                    type="text"
                                    value={deptHead}
                                    onChange={(e) => setDeptHead(e.target.value)}
                                    className="w-full bg-dark-900 border border-dark-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary-500"
                                    placeholder="e.g. Sarah Johnson"
                                />
                            </div>
                            <div className="pt-4 flex justify-end gap-3">
                                <button type="button" onClick={handleCloseModal} className="px-4 py-2 text-gray-400 hover:text-white">Cancel</button>
                                <button type="submit" className="px-6 py-2 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-lg">
                                    {editingDept ? 'Update' : 'Create'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
