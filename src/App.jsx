import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from './layouts/DashboardLayout';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import { EmployeeProvider } from './context/EmployeeContext';

function App() {
    return (
        <Router>
            <AuthProvider>
                <EmployeeProvider>
                    <Routes>
                        <Route path="/login" element={<Login />} />
                        <Route path="/" element={
                            <ProtectedRoute>
                                <DashboardLayout>
                                    <Dashboard />
                                </DashboardLayout>
                            </ProtectedRoute>
                        } />
                        {/* Catch all redirect */}
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </EmployeeProvider>
            </AuthProvider>
        </Router>
    );
}

export default App;
