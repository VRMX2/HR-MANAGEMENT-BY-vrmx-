import React, { createContext, useContext, useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, onSnapshot, addDoc, query, orderBy, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { useAuth } from './AuthContext';

const DepartmentContext = createContext();

export function DepartmentProvider({ children }) {
    const [departments, setDepartments] = useState([]);
    const { currentUser } = useAuth();
    const [loading, setLoading] = useState(true);

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
    };

    const deleteDepartment = async (id) => {
        await deleteDoc(doc(db, 'departments', id));
    };

    return (
        <DepartmentContext.Provider value={{ departments, addDepartment, deleteDepartment, loading }}>
            {children}
        </DepartmentContext.Provider>
    );
}

export function useDepartments() {
    return useContext(DepartmentContext);
}
