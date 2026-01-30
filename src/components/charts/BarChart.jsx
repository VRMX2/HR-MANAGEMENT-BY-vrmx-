import React, { useState } from 'react';

export default function BarChart({ data, horizontal = false, height = 300, showValues = true }) {
    const [hoveredIndex, setHoveredIndex] = useState(null);

    if (!data || data.length === 0) {
        return (
            <div className="flex items-center justify-center h-full text-gray-500">
                No data available
            </div>
        );
    }

    const maxValue = Math.max(...data.map(d => d.value || 0), 1);

    if (horizontal) {
        return (
            <div className="space-y-4">
                {data.map((item, index) => (
                    <div
                        key={index}
                        className="group"
                        onMouseEnter={() => setHoveredIndex(index)}
                        onMouseLeave={() => setHoveredIndex(null)}
                    >
                        <div className="flex justify-between items-center mb-1">
                            <span className="text-sm text-gray-300 font-medium">{item.name}</span>
                            <span className="text-sm text-gray-400">{item.value}</span>
                        </div>
                        <div className="relative w-full bg-dark-700 h-8 rounded-lg overflow-hidden">
                            <div
                                className="absolute inset-y-0 left-0 rounded-lg transition-all duration-700 ease-out flex items-center px-3"
                                style={{
                                    width: `${(item.value / maxValue) * 100}%`,
                                    background: `linear-gradient(90deg, ${item.color || '#3b82f6'}, ${item.color || '#3b82f6'}dd)`,
                                    animationDelay: `${index * 100}ms`
                                }}
                            >
                                {showValues && hoveredIndex === index && (
                                    <span className="text-xs text-white font-bold animate-fade-in">
                                        {item.percentage ? `${item.percentage}%` : item.value}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    // Vertical bar chart
    return (
        <div className="flex items-end justify-between gap-2" style={{ height: `${height}px` }}>
            {data.map((item, index) => (
                <div
                    key={index}
                    className="flex-1 flex flex-col items-center gap-2 group cursor-pointer"
                    onMouseEnter={() => setHoveredIndex(index)}
                    onMouseLeave={() => setHoveredIndex(null)}
                >
                    {/* Value label on hover */}
                    {hoveredIndex === index && (
                        <div className="bg-dark-700 px-2 py-1 rounded text-xs text-white font-bold animate-fade-in border border-primary-500">
                            {item.value}
                        </div>
                    )}

                    {/* Bar */}
                    <div className="w-full relative flex-1 flex items-end">
                        <div
                            className="w-full rounded-t-lg transition-all duration-700 ease-out"
                            style={{
                                height: `${(item.value / maxValue) * 100}%`,
                                background: `linear-gradient(180deg, ${item.color || '#3b82f6'}, ${item.color || '#3b82f6'}aa)`,
                                animationDelay: `${index * 100}ms`,
                                transform: hoveredIndex === index ? 'scaleY(1.05)' : 'scaleY(1)',
                                transformOrigin: 'bottom'
                            }}
                        />
                    </div>

                    {/* Label */}
                    <span className="text-xs text-gray-400 text-center line-clamp-2">
                        {item.name}
                    </span>
                </div>
            ))}
        </div>
    );
}
