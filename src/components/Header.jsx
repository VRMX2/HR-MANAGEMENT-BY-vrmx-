import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Bell, Menu } from 'lucide-react';
import { useEmployees } from '../context/EmployeeContext';

import { useAuth } from '../context/AuthContext';
import AddEmployeeModal from './AddEmployeeModal';

export default function Header({ toggleSidebar }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { addEmployee } = useEmployees();

    const { currentUser } = useAuth();

    return (
        <>
            <header className="h-16 border-b border-dark-700 bg-dark-900/50 backdrop-blur-sm sticky top-0 z-10 px-4 md:px-6 flex items-center justify-between transition-all duration-300">
                <div className="flex items-center gap-4 flex-1 max-w-xl">
                    <button onClick={toggleSidebar} className="md:hidden text-gray-400 hover:text-white">
                        <Menu size={24} />
                    </button>
                    {/* Search moved to Sidebar */}
                </div>

                <div className="flex items-center gap-4">
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center gap-2 bg-dark-800 hover:bg-dark-700 text-white px-4 py-2 rounded-lg border border-dark-700 transition-colors text-sm font-medium hover:border-gray-600"
                    >
                        <Plus size={16} />
                        <span>Add Employee</span>
                    </button>

                    <Link to="/notifications" className="relative p-2 text-gray-400 hover:text-white transition-colors">
                        <Bell size={20} />
                        {/* Simple dot for now, ideally we read unread count from context if we had a NotificationContext */}
                        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary-500 rounded-full border border-dark-900"></span>
                    </Link>

                    <div className="h-8 w-[1px] bg-dark-700 mx-2"></div>

                    <Link to="/settings" className="flex items-center gap-3 pl-2 pr-1 rounded-lg hover:bg-dark-800 transition-colors">
                        <div className="w-8 h-8 rounded-full overflow-hidden bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center text-xs font-bold text-white border border-dark-700">
                            {currentUser?.photoURL ? (
                                <img src={currentUser.photoURL} alt="Avatar" className="w-full h-full object-cover" />
                            ) : (
                                currentUser?.email?.[0]?.toUpperCase() || 'U'
                            )}
                        </div>
                    </Link>
                </div>
            </header>

            <AddEmployeeModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onAdd={addEmployee}
            />
        </>
    );
}
