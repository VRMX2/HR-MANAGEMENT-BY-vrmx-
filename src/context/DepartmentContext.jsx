import React, { createContext, useContext, useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, onSnapshot, addDoc, query, orderBy, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { useAuth } from './AuthContext';
import { createDepartmentNotification } from '../services/notificationService';

const DepartmentContext = createContext();

export function DepartmentProvider({ children }) {
    const [departments, setDepartments] = useState([]);
    const [employees, setEmployees] = useState([]);
    const { currentUser } = useAuth();
    const [loading, setLoading] = useState(true);

    // Subscribe to employees to calculate department counts
    useEffect(() => {
        if (!currentUser) {
            setEmployees([]);
            return;
        }

        const q = query(collection(db, 'employees'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const emps = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setEmployees(emps);
        });

        return unsubscribe;
    }, [currentUser]);

    // Subscribe to departments
    useEffect(() => {
        if (!currentUser) {
            setDepartments([]);
            setLoading(false);
            return;
        }

        const q = query(collection(db, 'departments'), orderBy('createdAt', 'desc'));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const depts = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setDepartments(depts);
            setLoading(false);
        });

        return unsubscribe;
    }, [currentUser]);

    // Calculate employee counts for each department dynamically
    const departmentsWithCounts = departments.map(dept => {
        const count = employees.filter(emp => emp.dept === dept.name).length;
        return {
            ...dept,
            employeeCount: count
        };
    });

    const addDepartment = async (name, head, count) => {
        const colors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-orange-500', 'bg-pink-500', 'bg-teal-500'];
        const color = colors[Math.floor(Math.random() * colors.length)];

        await addDoc(collection(db, 'departments'), {
            name,
            head: head || 'Unassigned',
            employeeCount: count || 0,
            color,
            createdAt: new Date()
        });

        // Create notification
        await createDepartmentNotification('added', name);
    };

    const updateDepartment = async (id, data) => {
        const deptRef = doc(db, 'departments', id);
        await updateDoc(deptRef, data);

        // Create notification
        const deptName = data.name || 'Department';
        await createDepartmentNotification('updated', deptName);
    };

    const deleteDepartment = async (id) => {
        // Get department name before deleting
        const dept = departments.find(d => d.id === id);
        const deptName = dept?.name || 'Department';

        await deleteDoc(doc(db, 'departments', id));

        // Create notification
        await createDepartmentNotification('deleted', deptName);
    };

    return (
        <DepartmentContext.Provider value={{ departments: departmentsWithCounts, addDepartment, updateDepartment, deleteDepartment, loading }}>
            {children}
        </DepartmentContext.Provider>
    );
}

export function useDepartments() {
    return useContext(DepartmentContext);
}
