import React, { createContext, useContext, useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, onSnapshot, addDoc, query, orderBy, where, updateDoc, doc } from 'firebase/firestore';
import { useAuth } from './AuthContext';
import { createAttendanceNotification } from '../services/notificationService';

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

    const markAttendance = async (status, recordId = null, employeeData = null) => {
        if (!currentUser) return;

        // Use provided employee data or fallback to defaults
        const nameToUse = employeeData?.name || currentUser.displayName || currentUser.email.split('@')[0];
        const emailToUse = employeeData?.email || currentUser.email;
        const uidToUse = employeeData?.id || currentUser.uid;

        const todayStr = new Date().toLocaleDateString();

        try {
            if (status === 'Check In') {
                await addDoc(collection(db, 'attendance'), {
                    uid: uidToUse, // Link to employee ID if possible
                    authId: currentUser.uid, // Keep track of who actually performed the action
                    email: emailToUse,
                    name: nameToUse,
                    status: 'Check In',
                    timestamp: new Date(),
                    date: todayStr,
                    checkIn: new Date().toLocaleTimeString(),
                    checkOut: null,
                    employeeName: nameToUse,
                    employeeId: uidToUse
                });
            } else if (status === 'Check Out') {
                if (recordId) {
                    const docRef = doc(db, 'attendance', recordId);
                    await updateDoc(docRef, {
                        checkOut: new Date().toLocaleTimeString(),
                        status: 'Present',
                        timestamp: new Date()
                    });
                }
            }

            await createAttendanceNotification('marked', nameToUse, status);

        } catch (error) {
            console.error("Attendance Error:", error);
            throw error;
        }
    };

    // Compatibility wrappers
    const attendanceRecords = attendance;

    const checkIn = async (empId, email, name) => {
        await markAttendance('Check In', null, { id: empId, email, name });
    };

    const checkOut = async (empId, email, recordId) => {
        await markAttendance('Check Out', recordId, { id: empId, email });
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
