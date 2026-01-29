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

    const markAttendance = async (status, recordId = null) => {
        if (!currentUser) return;

        const employeeName = currentUser.displayName || currentUser.email.split('@')[0];
        const todayStr = new Date().toLocaleDateString();

        try {
            if (status === 'Check In') {
                // Check if already checked in today to prevent duplicates
                // (Client side check usually covers this, but good for safety)
                // We'll proceed to create.
                await addDoc(collection(db, 'attendance'), {
                    uid: currentUser.uid,
                    email: currentUser.email,
                    name: employeeName,
                    status: 'Check In',
                    timestamp: new Date(),
                    date: todayStr,
                    checkIn: new Date().toLocaleTimeString(),
                    checkOut: null,
                    employeeName: employeeName,
                    employeeId: currentUser.uid
                });
            } else if (status === 'Check Out') {
                if (recordId) {
                    const docRef = doc(db, 'attendance', recordId);
                    await updateDoc(docRef, {
                        checkOut: new Date().toLocaleTimeString(),
                        status: 'Present', // Mark as completed/present for the day
                        timestamp: new Date() // Update timestamp to show last activity
                    });
                } else {
                    console.error("No record ID provided for checkout");
                    // Fallback using query if needed, but UI provides ID.
                }
            }

            // Create notification
            await createAttendanceNotification('marked', employeeName, status);

        } catch (error) {
            console.error("Attendance Error:", error);
            throw error;
        }
    };

    // Compatibility wrappers
    const attendanceRecords = attendance;

    const checkIn = async (empId, email, name) => {
        await markAttendance('Check In');
    };

    const checkOut = async (empId, email, recordId) => {
        await markAttendance('Check Out', recordId);
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
