import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from './layouts/DashboardLayout';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Employees from './pages/Employees';
import Departments from './pages/Departments';
import Attendance from './pages/Attendance';
import Documents from './pages/Documents';
import Analytics from './pages/Analytics';
import Notifications from './pages/Notifications';
import Settings from './pages/Settings';
import HelpCenter from './pages/HelpCenter';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import { EmployeeProvider } from './context/EmployeeContext';
import { DepartmentProvider } from './context/DepartmentContext';
import { AttendanceProvider } from './context/AttendanceContext';
import { DocumentProvider } from './context/DocumentContext';
import { SearchProvider } from './context/SearchContext';
import { ToastProvider } from './context/ToastContext';
import { ThemeProvider } from './context/ThemeContext';
import { LocaleProvider } from './context/LocaleContext';

function App() {
    return (
        <Router>
            <AuthProvider>
                <ToastProvider>
                    <ThemeProvider>
                        <LocaleProvider>
                            <SearchProvider>
                                <DepartmentProvider>
                                    <EmployeeProvider>
                                        <AttendanceProvider>
                                            <DocumentProvider>
                                                <Routes>
                                                    <Route path="/login" element={<Login />} />
                                                    <Route path="/" element={
                                                        <ProtectedRoute>
                                                            <DashboardLayout>
                                                                <Dashboard />
                                                            </DashboardLayout>
                                                        </ProtectedRoute>
                                                    } />
                                                    <Route path="/employees" element={
                                                        <ProtectedRoute>
                                                            <DashboardLayout>
                                                                <Employees />
                                                            </DashboardLayout>
                                                        </ProtectedRoute>
                                                    } />
                                                    <Route path="/departments" element={
                                                        <ProtectedRoute>
                                                            <DashboardLayout>
                                                                <Departments />
                                                            </DashboardLayout>
                                                        </ProtectedRoute>
                                                    } />
                                                    <Route path="/attendance" element={
                                                        <ProtectedRoute>
                                                            <DashboardLayout>
                                                                <Attendance />
                                                            </DashboardLayout>
                                                        </ProtectedRoute>
                                                    } />
                                                    <Route path="/documents" element={
                                                        <ProtectedRoute>
                                                            <DashboardLayout>
                                                                <Documents />
                                                            </DashboardLayout>
                                                        </ProtectedRoute>
                                                    } />
                                                    <Route path="/analytics" element={
                                                        <ProtectedRoute>
                                                            <DashboardLayout>
                                                                <Analytics />
                                                            </DashboardLayout>
                                                        </ProtectedRoute>
                                                    } />
                                                    <Route path="/notifications" element={
                                                        <ProtectedRoute>
                                                            <DashboardLayout>
                                                                <Notifications />
                                                            </DashboardLayout>
                                                        </ProtectedRoute>
                                                    } />
                                                    <Route path="/settings" element={
                                                        <ProtectedRoute>
                                                            <DashboardLayout>
                                                                <Settings />
                                                            </DashboardLayout>
                                                        </ProtectedRoute>
                                                    } />
                                                    <Route path="/help" element={
                                                        <ProtectedRoute>
                                                            <DashboardLayout>
                                                                <HelpCenter />
                                                            </DashboardLayout>
                                                        </ProtectedRoute>
                                                    } />
                                                    {/* Catch all redirect */}
                                                    <Route path="*" element={<Navigate to="/" replace />} />
                                                </Routes>
                                            </DocumentProvider>
                                        </AttendanceProvider>
                                    </EmployeeProvider>
                                </DepartmentProvider>
                            </SearchProvider>
                        </LocaleProvider>
                    </ThemeProvider>
                </ToastProvider>
            </AuthProvider>
        </Router>
    );
}

export default App;
