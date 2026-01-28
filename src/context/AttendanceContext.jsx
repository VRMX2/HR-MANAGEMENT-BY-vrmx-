import React, { createContext, useContext, useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, onSnapshot, addDoc, query, orderBy, where } from 'firebase/firestore';
import { useAuth } from './AuthContext';

const AttendanceContext = createContext();

export function AttendanceProvider({ children }) {
    const [attendance, setAttendance] = useState([]);
    const { currentUser } = useAuth();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!currentUser) {
            setAttendance([]);
            setLoading(false);
            return;
        }

        const q = query(collection(db, 'attendance'), orderBy('timestamp', 'desc'));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const records = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setAttendance(records);
            setLoading(false);
        });

        return unsubscribe;
    }, [currentUser]);

    const markAttendance = async (status) => {
        // Check if checks in/out today already exist for this user? 
        // For simplicity, just adding a log.
        if (!currentUser) return;

        await addDoc(collection(db, 'attendance'), {
            uid: currentUser.uid,
            email: currentUser.email,
            name: currentUser.displayName || currentUser.email.split('@')[0], // Fallback name
            status, // 'Check In' or 'Check Out'
            timestamp: new Date(),
            date: new Date().toLocaleDateString()
        });
    };

    return (
        <AttendanceContext.Provider value={{ attendance, markAttendance, loading }}>
            {children}
        </AttendanceContext.Provider>
    );
}

export function useAttendance() {
    return useContext(AttendanceContext);
}
