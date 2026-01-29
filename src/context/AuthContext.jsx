import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    GoogleAuthProvider,
    signInWithPopup,
    updateProfile,
    updatePassword,
    sendPasswordResetEmail,
    fetchSignInMethodsForEmail
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';

const AuthContext = createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [userData, setUserData] = useState(null); // Extended user data from Firestore
    const [loading, setLoading] = useState(true);

    const googleProvider = new GoogleAuthProvider();

    function signup(email, password) {
        return createUserWithEmailAndPassword(auth, email, password);
    }

    function login(email, password) {
        return signInWithEmailAndPassword(auth, email, password);
    }

    function loginWithGoogle() {
        return signInWithPopup(auth, googleProvider);
    }

    function logout() {
        return signOut(auth);
    }

    async function updateUserProfile(profileData) {
        if (!auth.currentUser) return;

        // Update Auth Profile (DisplayName, PhotoURL)
        const updates = {};
        if (profileData.displayName) updates.displayName = profileData.displayName;
        if (profileData.photoURL) updates.photoURL = profileData.photoURL;

        if (Object.keys(updates).length > 0) {
            await updateProfile(auth.currentUser, updates);
        }

        // Update Firestore User Doc (Bio, Roles, Settings, etc.)
        const userRef = doc(db, 'users', auth.currentUser.uid);
        await setDoc(userRef, {
            ...profileData,
            email: auth.currentUser.email,
            lastUpdated: new Date()
        }, { merge: true }); // Merge to avoid overwriting existing fields

        // Force update local state
        setCurrentUser({ ...auth.currentUser, ...updates });
        setUserData(prev => ({ ...prev, ...profileData }));
    }

    async function changePassword(newPassword) {
        if (auth.currentUser) {
            await updatePassword(auth.currentUser, newPassword);
        }
    }

    function resetPassword(email) {
        return sendPasswordResetEmail(auth, email);
    }

    async function checkEmailExists(email) {
        try {
            const methods = await fetchSignInMethodsForEmail(auth, email);
            return methods.length > 0;
        } catch (error) {
            // If email enumeration protection is on, this might return empty or error.
            // But usually this works for valid users.
            console.error("Error checking email:", error);
            return true; // Assume exists to be safe if check fails, let reset email flow handle it
        }
    }

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            setCurrentUser(user);
            if (user) {
                // Fetch extended data
                const userDoc = await getDoc(doc(db, 'users', user.uid));
                if (userDoc.exists()) {
                    setUserData(userDoc.data());
                }
            } else {
                setUserData(null);
            }
            setLoading(false);
        });

        return unsubscribe;
    }, []);

    const value = {
        currentUser,
        userData,
        signup,
        login,
        loginWithGoogle,
        logout,
        updateUserProfile,
        changePassword,
        resetPassword,
        checkEmailExists
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}
