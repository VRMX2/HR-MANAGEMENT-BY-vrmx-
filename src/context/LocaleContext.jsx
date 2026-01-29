import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const LocaleContext = createContext();

export function LocaleProvider({ children }) {
    const { userData } = useAuth();
    const [locale, setLocale] = useState({
        language: 'en',
        region: 'US'
    });

    // Sync with user preferences
    useEffect(() => {
        if (userData?.preferences?.language && userData?.preferences?.region) {
            setLocale({
                language: userData.preferences.language,
                region: userData.preferences.region
            });
        }
    }, [userData]);

    // Format date based on region
    const formatDate = (date) => {
        if (!date) return '';

        const dateObj = date instanceof Date ? date : new Date(date);

        if (locale.region === 'US') {
            // MM/DD/YYYY
            return dateObj.toLocaleDateString('en-US');
        } else if (locale.region === 'UK') {
            // DD/MM/YYYY
            return dateObj.toLocaleDateString('en-GB');
        }

        return dateObj.toLocaleDateString();
    };

    // Format time based on region
    const formatTime = (date) => {
        if (!date) return '';

        const dateObj = date instanceof Date ? date : new Date(date);

        if (locale.region === 'US') {
            // 12-hour format
            return dateObj.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
        } else if (locale.region === 'UK') {
            // 24-hour format
            return dateObj.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
        }

        return dateObj.toLocaleTimeString();
    };

    // Format currency (for future use with salary fields)
    const formatCurrency = (amount) => {
        if (locale.region === 'US') {
            return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
        } else if (locale.region === 'UK') {
            return new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(amount);
        }
        return `$${amount}`;
    };

    // Simple translations (can be expanded)
    const translations = {
        en: {
            welcome: 'Welcome',
            employees: 'Employees',
            departments: 'Departments',
            attendance: 'Attendance',
            settings: 'Settings',
            logout: 'Logout'
        },
        es: {
            welcome: 'Bienvenido',
            employees: 'Empleados',
            departments: 'Departamentos',
            attendance: 'Asistencia',
            settings: 'Configuración',
            logout: 'Cerrar sesión'
        },
        fr: {
            welcome: 'Bienvenue',
            employees: 'Employés',
            departments: 'Départements',
            attendance: 'Présence',
            settings: 'Paramètres',
            logout: 'Déconnexion'
        }
    };

    const t = (key) => {
        return translations[locale.language]?.[key] || translations['en'][key] || key;
    };

    return (
        <LocaleContext.Provider value={{
            locale,
            formatDate,
            formatTime,
            formatCurrency,
            t
        }}>
            {children}
        </LocaleContext.Provider>
    );
}

export function useLocale() {
    return useContext(LocaleContext);
}
