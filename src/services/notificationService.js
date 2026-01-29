import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

/**
 * Notification Service
 * Handles creation of notifications in Firestore
 */

/**
 * Create a notification in Firestore
 * @param {string} userId - User ID to send notification to (optional, null for system-wide)
 * @param {string} title - Notification title
 * @param {string} message - Notification message
 * @param {string} type - Notification type: 'info', 'success', 'warning', 'error'
 */
export const createNotification = async (userId, title, message, type = 'info') => {
    try {
        await addDoc(collection(db, 'notifications'), {
            userId: userId || null, // null means system-wide notification
            title,
            message,
            type,
            read: false,
            timestamp: serverTimestamp()
        });
    } catch (error) {
        console.error('Error creating notification:', error);
    }
};

/**
 * Create employee-related notification
 */
export const createEmployeeNotification = async (action, employeeName, userId = null) => {
    const messages = {
        added: {
            title: 'New Employee Added',
            message: `${employeeName} has been added to the system.`,
            type: 'success'
        },
        updated: {
            title: 'Employee Updated',
            message: `${employeeName}'s information has been updated.`,
            type: 'info'
        },
        deleted: {
            title: 'Employee Removed',
            message: `${employeeName} has been removed from the system.`,
            type: 'warning'
        }
    };

    const notif = messages[action];
    if (notif) {
        await createNotification(userId, notif.title, notif.message, notif.type);
    }
};

/**
 * Create attendance-related notification
 */
export const createAttendanceNotification = async (action, employeeName, status, userId = null) => {
    const messages = {
        marked: {
            title: 'Attendance Marked',
            message: `${employeeName} marked as ${status}.`,
            type: status === 'Present' ? 'success' : status === 'Late' ? 'warning' : 'info'
        },
        late: {
            title: 'Late Arrival',
            message: `${employeeName} arrived late today.`,
            type: 'warning'
        },
        absent: {
            title: 'Absence Recorded',
            message: `${employeeName} is absent today.`,
            type: 'warning'
        }
    };

    const notif = messages[action];
    if (notif) {
        await createNotification(userId, notif.title, notif.message, notif.type);
    }
};

/**
 * Create department-related notification
 */
export const createDepartmentNotification = async (action, deptName, userId = null) => {
    const messages = {
        added: {
            title: 'New Department Created',
            message: `${deptName} department has been created.`,
            type: 'success'
        },
        updated: {
            title: 'Department Updated',
            message: `${deptName} department has been updated.`,
            type: 'info'
        },
        deleted: {
            title: 'Department Removed',
            message: `${deptName} department has been removed.`,
            type: 'warning'
        }
    };

    const notif = messages[action];
    if (notif) {
        await createNotification(userId, notif.title, notif.message, notif.type);
    }
};

/**
 * Create document-related notification
 */
export const createDocumentNotification = async (action, docName, userId = null) => {
    const messages = {
        uploaded: {
            title: 'Document Uploaded',
            message: `${docName} has been uploaded.`,
            type: 'success'
        },
        deleted: {
            title: 'Document Deleted',
            message: `${docName} has been deleted.`,
            type: 'warning'
        }
    };

    const notif = messages[action];
    if (notif) {
        await createNotification(userId, notif.title, notif.message, notif.type);
    }
};
