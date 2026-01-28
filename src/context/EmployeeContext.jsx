import React, { createContext, useContext, useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, onSnapshot, addDoc, query, orderBy, deleteDoc, doc } from 'firebase/firestore';
import { useAuth } from './AuthContext';

const EmployeeContext = createContext();

const initialMockEmployees = [
    { name: 'Sarah Johnson', email: 'sarah.j@company.com', dept: 'Engineering', role: 'Senior Developer', status: 'Active', joined: 'Jan 15, 2023', avatar: 'SJ', color: 'bg-blue-600' },
    { name: 'Michael Chen', email: 'm.chen@company.com', dept: 'Design', role: 'UI/UX Designer', status: 'Active', joined: 'Mar 22, 2023', avatar: 'MC', color: 'bg-green-600' },
    { name: 'Emily Davis', email: 'e.davis@company.com', dept: 'Marketing', role: 'Marketing Manager', status: 'On Leave', joined: 'Sep 10, 2022', avatar: 'ED', color: 'bg-orange-600' },
    { name: 'James Wilson', email: 'j.wilson@company.com', dept: 'Sales', role: 'Sales Executive', status: 'Active', joined: 'Jul 05, 2023', avatar: 'JW', color: 'bg-purple-600' },
    { name: 'Lisa Anderson', email: 'l.anderson@company.com', dept: 'HR', role: 'HR Specialist', status: 'Active', joined: 'Feb 28, 2022', avatar: 'LA', color: 'bg-pink-600' },
];

export function EmployeeProvider({ children }) {
    const [employees, setEmployees] = useState([]);
    const [totalEmployees, setTotalEmployees] = useState(0);
    const { currentUser } = useAuth();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!currentUser) {
            setEmployees([]);
            setLoading(false);
            return;
        }

        const q = query(collection(db, 'employees'), orderBy('joined', 'desc'));

        const unsubscribe = onSnapshot(q, async (snapshot) => {
            const emps = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            // Seed data if empty (only for demo purposes)
            if (emps.length === 0 && !snapshot.metadata.fromCache) {
                // Optional: you could seed directly here, but usually risky in production
                setEmployees([]);
            } else {
                setEmployees(emps);
            }

            setTotalEmployees(emps.length);
            setLoading(false);
        });

        return unsubscribe;
    }, [currentUser]);

    const addEmployee = async (newEmployee) => {
        const avatar = newEmployee.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
        const colors = ['bg-blue-600', 'bg-green-600', 'bg-purple-600', 'bg-pink-600', 'bg-orange-600', 'bg-teal-600'];
        const color = colors[Math.floor(Math.random() * colors.length)];
        const joined = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

        const employeeToAdd = {
            ...newEmployee,
            joined,
            avatar,
            color,
            status: 'Active',
            createdAt: new Date()
        };

        await addDoc(collection(db, 'employees'), employeeToAdd);
    };

    const deleteEmployee = async (id) => {
        try {
            await deleteDoc(doc(db, 'employees', id));
        } catch (error) {
            console.error("Error deleting employee:", error);
        }
    };

    return (
        <EmployeeContext.Provider value={{ employees, addEmployee, deleteEmployee, totalEmployees, loading }}>
            {children}
        </EmployeeContext.Provider>
    );
}

export function useEmployees() {
    return useContext(EmployeeContext);
}
