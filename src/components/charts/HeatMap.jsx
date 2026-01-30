import React, { useState } from 'react';

export default function HeatMap({ data }) {
    const [hoveredCell, setHoveredCell] = useState(null);

    if (!data || data.length === 0) {
        return (
            <div className="flex items-center justify-center h-full text-gray-500">
                No data available
            </div>
        );
    }

    // Get intensity color
    const getIntensityColor = (intensity) => {
        switch (intensity) {
            case 'high':
                return 'bg-green-500';
            case 'medium':
                return 'bg-yellow-500';
            case 'low':
                return 'bg-orange-500';
            case 'none':
                return 'bg-red-500/30';
            default:
                return 'bg-gray-700';
        }
    };

    // Group by weeks
    const weeks = [];
    for (let i = 0; i < data.length; i += 7) {
        weeks.push(data.slice(i, i + 7));
    }

    return (
        <div className="space-y-4">
            {/* Legend */}
            <div className="flex items-center gap-4 text-xs text-gray-400">
                <span>Attendance Rate:</span>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-red-500/30"></div>
                    <span>&lt;50%</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-orange-500"></div>
                    <span>50-70%</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-yellow-500"></div>
                    <span>70-90%</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-green-500"></div>
                    <span>&gt;90%</span>
                </div>
            </div>

            {/* Heatmap Grid */}
            <div className="space-y-2">
                {weeks.map((week, weekIndex) => (
                    <div key={weekIndex} className="flex gap-2">
                        {week.map((day, dayIndex) => {
                            const cellKey = `${weekIndex}-${dayIndex}`;
                            const isHovered = hoveredCell === cellKey;

                            return (
                                <div
                                    key={dayIndex}
                                    className="relative group"
                                    onMouseEnter={() => setHoveredCell(cellKey)}
                                    onMouseLeave={() => setHoveredCell(null)}
                                >
                                    <div
                                        className={`w-10 h-10 rounded-lg ${getIntensityColor(day.intensity)} 
                                            transition-all duration-200 cursor-pointer flex items-center justify-center
                                            ${isHovered ? 'scale-110 ring-2 ring-white' : ''}`}
                                        style={{ animationDelay: `${(weekIndex * 7 + dayIndex) * 20}ms` }}
                                    >
                                        <span className="text-xs text-white font-medium opacity-70">
                                            {day.day}
                                        </span>
                                    </div>

                                    {/* Tooltip */}
                                    {isHovered && (
                                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-10 animate-fade-in">
                                            <div className="bg-dark-700 border border-dark-600 rounded-lg px-3 py-2 shadow-xl whitespace-nowrap">
                                                <div className="text-xs text-gray-300 mb-1">{day.weekday}, {day.month} {day.day}</div>
                                                <div className="text-sm text-white font-bold">{day.rate}% Attendance</div>
                                            </div>
                                            <div className="w-2 h-2 bg-dark-700 border-r border-b border-dark-600 transform rotate-45 absolute -bottom-1 left-1/2 -translate-x-1/2"></div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                ))}
            </div>

            {/* Weekday labels */}
            <div className="flex gap-2 text-xs text-gray-500">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, i) => (
                    <div key={i} className="w-10 text-center">{day}</div>
                ))}
            </div>
        </div>
    );
}
