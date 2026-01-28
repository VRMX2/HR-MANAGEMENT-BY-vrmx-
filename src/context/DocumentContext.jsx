import React, { createContext, useContext, useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, onSnapshot, addDoc, query, orderBy, deleteDoc, doc } from 'firebase/firestore';
import { useAuth } from './AuthContext';

const DocumentContext = createContext();

export function DocumentProvider({ children }) {
    const [documents, setDocuments] = useState([]);
    const { currentUser } = useAuth();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!currentUser) {
            setDocuments([]);
            setLoading(false);
            return;
        }

        const q = query(collection(db, 'documents'), orderBy('uploadedAt', 'desc'));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const docs = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setDocuments(docs);
            setLoading(false);
        });

        return unsubscribe;
    }, [currentUser]);

    const uploadDocument = async (file) => {
        // In a real app, we would upload to Firebase Storage here.
        // For this demo, we'll simulate an upload by creating a document record.
        const type = file.name.split('.').pop().toUpperCase();

        await addDoc(collection(db, 'documents'), {
            name: file.name,
            type: type,
            size: (file.size / 1024).toFixed(1) + ' KB',
            uploadedBy: currentUser.displayName || currentUser.email,
            uploadedAt: new Date(),
            url: '#' // Mock URL
        });
    };

    const deleteDocument = async (id) => {
        await deleteDoc(doc(db, 'documents', id));
    };

    return (
        <DocumentContext.Provider value={{ documents, uploadDocument, deleteDocument, loading }}>
            {children}
        </DocumentContext.Provider>
    );
}

export function useDocuments() {
    return useContext(DocumentContext);
}
