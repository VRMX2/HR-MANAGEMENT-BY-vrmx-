import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
    const { userData, currentUser } = useAuth();
    const [theme, setTheme] = useState('dark');

    // Sync with User Data from Firestore
    useEffect(() => {
        if (userData?.preferences?.theme) {
            setTheme(userData.preferences.theme);
        }
    }, [userData]);

    // Apply Theme to Body
    useEffect(() => {
        const root = window.document.documentElement; // or document.body
        if (theme === 'light') {
            root.classList.add('light-mode');
            root.classList.remove('dark');
        } else {
            root.classList.remove('light-mode');
            root.classList.add('dark');
        }
    }, [theme]);

    const toggleTheme = async (newTheme) => {
        setTheme(newTheme);
        if (currentUser) {
            try {
                const userRef = doc(db, 'users', currentUser.uid);
                await updateDoc(userRef, {
                    'preferences.theme': newTheme
                });
            } catch (error) {
                console.error("Failed to save theme preference", error);
            }
        }
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    return useContext(ThemeContext);
}
