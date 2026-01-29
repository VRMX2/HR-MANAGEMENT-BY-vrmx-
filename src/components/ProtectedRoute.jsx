import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function ProtectedRoute({ children, allowedRoles = [] }) {
    const { currentUser, userData, loading } = useAuth();
    const { showToast } = useToast();
    const location = useLocation();

    if (loading) {
        // You might want a loading spinner here
        return <div className="min-h-screen bg-dark-900 flex items-center justify-center text-white">Loading...</div>;
    }

    if (!currentUser) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Role-Based Access Control
    // If allowedRoles is provided, check if user has permission
    if (allowedRoles.length > 0) {
        const userRole = userData?.role || 'USER'; // Default to USER if no role

        if (!allowedRoles.includes(userRole)) {
            // User doesn't have required role
            // showToast('Access denied: Insufficient permissions', 'error'); // Optional: show toast
            return <Navigate to="/" replace />;
        }
    }

    return children;
}
