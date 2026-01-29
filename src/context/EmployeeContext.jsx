import React, { createContext, useContext, useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, onSnapshot, addDoc, query, orderBy, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { useAuth } from './AuthContext';
import { createEmployeeNotification } from '../services/notificationService';

const EmployeeContext = createContext();

export function EmployeeProvider({ children }) {
    const [employees, setEmployees] = useState([]);
    const { currentUser } = useAuth();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!currentUser) {
            setEmployees([]);
            setLoading(false);
            return;
        }

        const q = query(collection(db, 'employees'), orderBy('joined', 'desc'));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const docs = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setEmployees(docs);
            setLoading(false);
        });

        return unsubscribe;
    }, [currentUser]);

    const addEmployee = async (employeeData) => {
        const defaultData = {
            joined: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            status: 'Active',
            avatar: employeeData.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase(),
            color: `bg-${['blue', 'green', 'purple', 'orange', 'pink'][Math.floor(Math.random() * 5)]}-600`
        };

        await addDoc(collection(db, 'employees'), {
            ...defaultData,
            ...employeeData,
            createdAt: new Date()
        });

        // Create notification
        await createEmployeeNotification('added', employeeData.name);
    };

    const updateEmployee = async (id, updatedData) => {
        const employeeRef = doc(db, 'employees', id);
        // Recalculate avatar if name changed
        if (updatedData.name) {
            updatedData.avatar = updatedData.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
        }
        await updateDoc(employeeRef, updatedData);

        // Create notification
        const employeeName = updatedData.name || 'Employee';
        await createEmployeeNotification('updated', employeeName);
    };

    const deleteEmployee = async (id) => {
        // Get employee name before deleting
        const employee = employees.find(emp => emp.id === id);
        const employeeName = employee?.name || 'Employee';

        await deleteDoc(doc(db, 'employees', id));

        // Create notification
        await createEmployeeNotification('deleted', employeeName);
    };

    // Derived stats
    const totalEmployees = employees.length;

    return (
        <EmployeeContext.Provider value={{ employees, addEmployee, updateEmployee, deleteEmployee, loading, totalEmployees }}>
            {children}
        </EmployeeContext.Provider>
    );
}

export function useEmployees() {
    return useContext(EmployeeContext);
}
