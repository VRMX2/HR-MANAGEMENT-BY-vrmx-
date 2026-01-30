/**
 * Chart Helper Utilities
 * Functions for data processing and chart visualization
 */

/**
 * Calculate percentage change between two values
 */
export function calculateTrend(current, previous) {
    if (previous === 0) return current > 0 ? 100 : 0;
    return Math.round(((current - previous) / previous) * 100);
}

/**
 * Aggregate attendance data by period (day, week, month)
 */
export function aggregateByPeriod(attendanceRecords, period = 'day', limit = 7) {
    const now = new Date();
    const data = [];

    for (let i = limit - 1; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        const dateStr = date.toLocaleDateString();

        const dayRecords = attendanceRecords.filter(r => r.date === dateStr);
        const uniqueAttendees = new Set(dayRecords.map(r => r.email)).size;

        data.push({
            date: dateStr,
            label: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            count: uniqueAttendees,
            records: dayRecords.length
        });
    }

    return data;
}

/**
 * Calculate attendance rate for a given period
 */
export function calculateAttendanceRate(attendanceRecords, totalEmployees, dateStr) {
    if (totalEmployees === 0) return 0;

    const checkedIn = new Set(
        attendanceRecords
            .filter(r => r.date === dateStr && (r.status === 'Check In' || r.status === 'Present'))
            .map(r => r.email)
    ).size;

    return Math.round((checkedIn / totalEmployees) * 100);
}

/**
 * Generate department distribution data for charts
 */
export function generateDepartmentData(departments) {
    return departments
        .map(dept => ({
            name: dept.name,
            value: dept.employeeCount || 0,
            color: dept.color || 'bg-blue-500',
            percentage: 0
        }))
        .sort((a, b) => b.value - a.value);
}

/**
 * Calculate employee status distribution
 */
export function calculateStatusDistribution(employees) {
    const distribution = {
        Active: 0,
        'On Leave': 0,
        Onboarding: 0,
        Terminated: 0,
        Other: 0
    };

    employees.forEach(emp => {
        const status = emp.status || 'Other';
        if (distribution[status] !== undefined) {
            distribution[status]++;
        } else {
            distribution.Other++;
        }
    });

    return Object.entries(distribution).map(([name, value]) => ({
        name,
        value,
        percentage: employees.length > 0 ? Math.round((value / employees.length) * 100) : 0
    }));
}

/**
 * Get color palette for charts
 */
export function getColorPalette(index) {
    const colors = [
        { bg: 'bg-blue-500', text: 'text-blue-500', hex: '#3b82f6' },
        { bg: 'bg-green-500', text: 'text-green-500', hex: '#10b981' },
        { bg: 'bg-purple-500', text: 'text-purple-500', hex: '#a855f7' },
        { bg: 'bg-orange-500', text: 'text-orange-500', hex: '#f97316' },
        { bg: 'bg-pink-500', text: 'text-pink-500', hex: '#ec4899' },
        { bg: 'bg-teal-500', text: 'text-teal-500', hex: '#14b8a6' },
        { bg: 'bg-red-500', text: 'text-red-500', hex: '#ef4444' },
        { bg: 'bg-yellow-500', text: 'text-yellow-500', hex: '#eab308' }
    ];

    return colors[index % colors.length];
}

/**
 * Format numbers with K/M suffix
 */
export function formatNumber(num) {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
}

/**
 * Generate monthly attendance heatmap data
 */
export function generateHeatmapData(attendanceRecords, totalEmployees) {
    const now = new Date();
    const data = [];

    // Get last 30 days
    for (let i = 29; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        const dateStr = date.toLocaleDateString();

        const rate = calculateAttendanceRate(attendanceRecords, totalEmployees, dateStr);

        data.push({
            date: dateStr,
            day: date.getDate(),
            month: date.toLocaleDateString('en-US', { month: 'short' }),
            weekday: date.toLocaleDateString('en-US', { weekday: 'short' }),
            rate,
            intensity: rate >= 90 ? 'high' : rate >= 70 ? 'medium' : rate >= 50 ? 'low' : 'none'
        });
    }

    return data;
}

/**
 * Calculate employee growth trend
 */
export function calculateEmployeeGrowth(employees) {
    const monthlyData = {};

    employees.forEach(emp => {
        if (emp.joined) {
            // Parse the joined date
            const joinDate = new Date(emp.joined);
            const monthKey = `${joinDate.getFullYear()}-${String(joinDate.getMonth() + 1).padStart(2, '0')}`;

            if (!monthlyData[monthKey]) {
                monthlyData[monthKey] = 0;
            }
            monthlyData[monthKey]++;
        }
    });

    // Get last 6 months
    const now = new Date();
    const result = [];

    for (let i = 5; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        const label = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });

        result.push({
            month: monthKey,
            label,
            count: monthlyData[monthKey] || 0
        });
    }

    return result;
}
