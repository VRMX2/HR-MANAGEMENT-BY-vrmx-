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
        } else if (locale.region === 'DZ') {
            // DD/MM/YYYY (Algeria uses European format)
            return dateObj.toLocaleDateString('ar-DZ');
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
        } else if (locale.region === 'DZ') {
            // 24-hour format (Algeria uses 24-hour format)
            return dateObj.toLocaleTimeString('ar-DZ', { hour: '2-digit', minute: '2-digit' });
        }

        return dateObj.toLocaleTimeString();
    };

    // Format currency (for future use with salary fields)
    const formatCurrency = (amount) => {
        if (locale.region === 'US') {
            return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
        } else if (locale.region === 'DZ') {
            return new Intl.NumberFormat('ar-DZ', { style: 'currency', currency: 'DZD' }).format(amount);
        }
        return `$${amount}`;
    };

    // Translations for English and Arabic
    const translations = {
        en: {
            // Navigation
            welcome: 'Welcome',
            dashboard: 'Dashboard',
            employees: 'Employees',
            departments: 'Departments',
            attendance: 'Attendance',
            documents: 'Documents',
            analytics: 'Analytics',
            notifications: 'Notifications',
            settings: 'Settings',
            help: 'Help Center',
            logout: 'Logout',
            mainMenu: 'Main Menu',
            system: 'System',

            // Common Actions
            add: 'Add',
            edit: 'Edit',
            delete: 'Delete',
            save: 'Save',
            cancel: 'Cancel',
            search: 'Search',
            filter: 'Filter',
            export: 'Export',
            import: 'Import',
            refresh: 'Refresh',

            // Status
            active: 'Active',
            inactive: 'Inactive',
            pending: 'Pending',
            completed: 'Completed',

            // Messages
            loading: 'Loading...',
            noData: 'No data available',
            error: 'An error occurred',
            success: 'Success',

            // Employee related
            addEmployee: 'Add Employee',
            employeeDetails: 'Employee Details',
            totalEmployees: 'Total Employees',

            // Department related
            addDepartment: 'Add Department',
            totalDepartments: 'Total Departments',

            // Attendance related
            markAttendance: 'Mark Attendance',
            present: 'Present',
            absent: 'Absent',
            late: 'Late',

            // Notifications
            markAsRead: 'Mark as read',
            markAllAsRead: 'Mark all as read',
            newNotification: 'New notification',
            noNotifications: 'No new notifications'
        },
        ar: {
            // Navigation
            welcome: 'مرحبا',
            dashboard: 'لوحة القيادة',
            employees: 'الموظفين',
            departments: 'الأقسام',
            attendance: 'الحضور',
            documents: 'المستندات',
            analytics: 'التحليلات',
            notifications: 'الإشعارات',
            settings: 'الإعدادات',
            help: 'مركز المساعدة',
            logout: 'تسجيل الخروج',
            mainMenu: 'القائمة الرئيسية',
            system: 'النظام',

            // Common Actions
            add: 'إضافة',
            edit: 'تعديل',
            delete: 'حذف',
            save: 'حفظ',
            cancel: 'إلغاء',
            search: 'بحث',
            filter: 'تصفية',
            export: 'تصدير',
            import: 'استيراد',
            refresh: 'تحديث',

            // Status
            active: 'نشط',
            inactive: 'غير نشط',
            pending: 'قيد الانتظار',
            completed: 'مكتمل',

            // Messages
            loading: 'جاري التحميل...',
            noData: 'لا توجد بيانات',
            error: 'حدث خطأ',
            success: 'نجح',

            // Employee related
            addEmployee: 'إضافة موظف',
            employeeDetails: 'تفاصيل الموظف',
            totalEmployees: 'إجمالي الموظفين',

            // Department related
            addDepartment: 'إضافة قسم',
            totalDepartments: 'إجمالي الأقسام',

            // Attendance related
            markAttendance: 'تسجيل الحضور',
            present: 'حاضر',
            absent: 'غائب',
            late: 'متأخر',

            // Notifications
            markAsRead: 'وضع علامة كمقروء',
            markAllAsRead: 'وضع علامة على الكل كمقروء',
            newNotification: 'إشعار جديد',
            noNotifications: 'لا توجد إشعارات جديدة'
        }
    };

    const t = (key) => {
        return translations[locale.language]?.[key] || translations['en'][key] || key;
    };

    // Function to manually update locale
    const updateLocale = (newLocale) => {
        setLocale(prev => ({ ...prev, ...newLocale }));
    };

    return (
        <LocaleContext.Provider value={{
            locale,
            setLocale: updateLocale,
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
