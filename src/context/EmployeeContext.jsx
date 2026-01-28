import React, { createContext, useContext, useState } from 'react';

const EmployeeContext = createContext();

const initialEmployees = [
    { id: 1, name: 'Sarah Johnson', email: 'sarah.j@company.com', dept: 'Engineering', role: 'Senior Developer', status: 'Active', joined: 'Jan 15, 2023', avatar: 'SJ', color: 'bg-blue-600' },
    { id: 2, name: 'Michael Chen', email: 'm.chen@company.com', dept: 'Design', role: 'UI/UX Designer', status: 'Active', joined: 'Mar 22, 2023', avatar: 'MC', color: 'bg-green-600' },
    { id: 3, name: 'Emily Davis', email: 'e.davis@company.com', dept: 'Marketing', role: 'Marketing Manager', status: 'On Leave', joined: 'Sep 10, 2022', avatar: 'ED', color: 'bg-orange-600' },
    { id: 4, name: 'James Wilson', email: 'j.wilson@company.com', dept: 'Sales', role: 'Sales Executive', status: 'Active', joined: 'Jul 05, 2023', avatar: 'JW', color: 'bg-purple-600' },
    { id: 5, name: 'Lisa Anderson', email: 'l.anderson@company.com', dept: 'HR', role: 'HR Specialist', status: 'Active', joined: 'Feb 28, 2022', avatar: 'LA', color: 'bg-pink-600' },
];

export function EmployeeProvider({ children }) {
    const [employees, setEmployees] = useState(initialEmployees);
    const [totalEmployees, setTotalEmployees] = useState(248); // Mock total for stat card

    const addEmployee = (newEmployee) => {
        // Generate simple ID and avatar/color
        const id = employees.length + 1;
        const avatar = newEmployee.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
        const colors = ['bg-blue-600', 'bg-green-600', 'bg-purple-600', 'bg-pink-600', 'bg-orange-600', 'bg-teal-600'];
        const color = colors[Math.floor(Math.random() * colors.length)];
        const joined = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

        const employeeToAdd = {
            id,
            ...newEmployee,
            joined,
            avatar,
            color,
            status: 'Active' // Default to active
        };

        setEmployees([employeeToAdd, ...employees]);
        setTotalEmployees(prev => prev + 1);
    };

    return (
        <EmployeeContext.Provider value={{ employees, addEmployee, totalEmployees }}>
            {children}
        </EmployeeContext.Provider>
    );
}

export function useEmployees() {
    return useContext(EmployeeContext);
}
