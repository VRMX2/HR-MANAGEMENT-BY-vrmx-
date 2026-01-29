import React, { createContext, useContext, useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, onSnapshot, addDoc, query, orderBy, deleteDoc, doc } from 'firebase/firestore';
import { useAuth } from './AuthContext';
import { uploadToCloudinary } from '../services/cloudinary';

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
        setLoading(true);
        try {
            // 1. Upload to Cloudinary
            const url = await uploadToCloudinary(file);

            // 2. Determine type
            const type = file.name.split('.').pop().toUpperCase();

            // 3. Save metadata to Firestore
            await addDoc(collection(db, 'documents'), {
                name: file.name,
                type: type,
                size: (file.size / 1024).toFixed(1) + ' KB',
                uploadedBy: currentUser.displayName || currentUser.email,
                uploadedAt: new Date(), // This will be converted to Timestamp by Firestore
                url: url // Real Cloudinary URL
            });
        } catch (error) {
            console.error("Error uploading document:", error);
            throw error; // Propagate error to UI
        } finally {
            setLoading(false);
        }
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
