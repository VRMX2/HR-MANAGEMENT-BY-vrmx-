import React from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Lock, Bell, Globe, Moon } from 'lucide-react';

export default function Settings() {
    const { currentUser } = useAuth();

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold text-white mb-6">Settings</h1>

            <div className="flex gap-8">
                {/* Sidebar */}
                <div className="w-64 shrink-0">
                    <div className="bg-dark-800 rounded-xl border border-dark-700 overflow-hidden">
                        <nav className="flex flex-col">
                            <button className="flex items-center gap-3 px-4 py-3 bg-primary-500/10 text-primary-500 border-l-2 border-primary-500 font-medium text-sm">
                                <User size={18} />
                                Profile Settings
                            </button>
                            <button className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:bg-dark-700 hover:text-white transition-colors text-sm">
                                <Lock size={18} />
                                Security
                            </button>
                            <button className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:bg-dark-700 hover:text-white transition-colors text-sm">
                                <Bell size={18} />
                                Notifications
                            </button>
                            <button className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:bg-dark-700 hover:text-white transition-colors text-sm">
                                <Globe size={18} />
                                Language & Region
                            </button>
                            <button className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:bg-dark-700 hover:text-white transition-colors text-sm">
                                <Moon size={18} />
                                Appearance
                            </button>
                        </nav>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 space-y-6">
                    <div className="bg-dark-800 rounded-xl border border-dark-700 p-6">
                        <h2 className="text-lg font-bold text-white mb-6">Profile Information</h2>

                        <div className="flex items-center gap-6 mb-8">
                            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center text-3xl font-bold text-white">
                                {currentUser?.email?.[0].toUpperCase()}
                            </div>
                            <div>
                                <button className="bg-dark-700 hover:bg-dark-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors border border-dark-600">
                                    Change Avatar
                                </button>
                                <p className="text-xs text-gray-500 mt-2">JPG, GIF or PNG. 1MB Max.</p>
                            </div>
                        </div>

                        <form className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">First Name</label>
                                    <input type="text" defaultValue="Admin" className="w-full bg-dark-900 border border-dark-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary-500" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Last Name</label>
                                    <input type="text" defaultValue="User" className="w-full bg-dark-900 border border-dark-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary-500" />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Email Address</label>
                                <input type="email" defaultValue={currentUser?.email} disabled className="w-full bg-dark-900/50 border border-dark-700 rounded-lg px-4 py-2 text-gray-500 cursor-not-allowed" />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Bio</label>
                                <textarea rows="4" className="w-full bg-dark-900 border border-dark-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary-500" placeholder="Tell us about yourself..."></textarea>
                            </div>

                            <div className="pt-4 flex justify-end">
                                <button type="submit" className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-2 rounded-lg font-medium transition-colors shadow-lg shadow-primary-500/20">
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
