import React from 'react';
import DashboardLayout from './layouts/DashboardLayout';
import Dashboard from './pages/Dashboard';
import { EmployeeProvider } from './context/EmployeeContext';

function App() {
    return (
        <EmployeeProvider>
            <DashboardLayout>
                <Dashboard />
            </DashboardLayout>
        </EmployeeProvider>
    );
}

export default App;
