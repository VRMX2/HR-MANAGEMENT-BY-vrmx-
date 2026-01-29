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
        if (!currentUser) return;

        await addDoc(collection(db, 'attendance'), {
            uid: currentUser.uid,
            email: currentUser.email,
            name: currentUser.displayName || currentUser.email.split('@')[0],
            status,
            timestamp: new Date(),
            date: new Date().toLocaleDateString(),
            checkIn: status === 'Check In' ? new Date().toLocaleTimeString() : null,
            checkOut: status === 'Check Out' ? new Date().toLocaleTimeString() : null,
            employeeName: currentUser.displayName || currentUser.email.split('@')[0], // Add for compatibility
            employeeId: currentUser.uid // Add for compatibility
        });
    };

    // Compatibility wrappers
    const attendanceRecords = attendance;

    const checkIn = async (empId, email, name) => {
        await markAttendance('Check In');
    };

    const checkOut = async (empId, email, recordId) => {
        await markAttendance('Check Out');
    };

    return (
        <AttendanceContext.Provider value={{
            attendance,
            attendanceRecords, // Export alias
            markAttendance,
            checkIn, // Export wrapper
            checkOut, // Export wrapper
            loading
        }}>
            {children}
        </AttendanceContext.Provider>
    );
}

export function useAttendance() {
    return useContext(AttendanceContext);
}
