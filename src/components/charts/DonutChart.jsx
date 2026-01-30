import React, { useState } from 'react';

export default function DonutChart({ data, size = 200, innerRadius = 0.6 }) {
    const [hoveredIndex, setHoveredIndex] = useState(null);

    if (!data || data.length === 0) {
        return (
            <div className="flex items-center justify-center h-full text-gray-500">
                No data available
            </div>
        );
    }

    const total = data.reduce((sum, item) => sum + (item.value || 0), 0);

    if (total === 0) {
        return (
            <div className="flex items-center justify-center h-full text-gray-500">
                No data to display
            </div>
        );
    }

    const center = size / 2;
    const radius = size / 2 - 10;
    const innerR = radius * innerRadius;

    // Calculate segments
    let currentAngle = -90; // Start from top
    const segments = data.map((item, index) => {
        const percentage = (item.value / total) * 100;
        const angle = (item.value / total) * 360;
        const startAngle = currentAngle;
        const endAngle = currentAngle + angle;

        currentAngle = endAngle;

        return {
            ...item,
            percentage: Math.round(percentage),
            startAngle,
            endAngle,
            color: item.color || `hsl(${index * 360 / data.length}, 70%, 60%)`
        };
    });

    // Create SVG path for donut segment
    const createArc = (startAngle, endAngle, outerRadius, innerRadius) => {
        const startRad = (startAngle * Math.PI) / 180;
        const endRad = (endAngle * Math.PI) / 180;

        const x1 = center + outerRadius * Math.cos(startRad);
        const y1 = center + outerRadius * Math.sin(startRad);
        const x2 = center + outerRadius * Math.cos(endRad);
        const y2 = center + outerRadius * Math.sin(endRad);

        const x3 = center + innerRadius * Math.cos(endRad);
        const y3 = center + innerRadius * Math.sin(endRad);
        const x4 = center + innerRadius * Math.cos(startRad);
        const y4 = center + innerRadius * Math.sin(startRad);

        const largeArc = endAngle - startAngle > 180 ? 1 : 0;

        return `
            M ${x1} ${y1}
            A ${outerRadius} ${outerRadius} 0 ${largeArc} 1 ${x2} ${y2}
            L ${x3} ${y3}
            A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${x4} ${y4}
            Z
        `;
    };

    return (
        <div className="flex items-center gap-6">
            {/* Chart */}
            <div className="relative" style={{ width: size, height: size }}>
                <svg width={size} height={size} className="transform -rotate-0">
                    {segments.map((segment, index) => (
                        <g key={index}>
                            <path
                                d={createArc(
                                    segment.startAngle,
                                    segment.endAngle,
                                    hoveredIndex === index ? radius + 5 : radius,
                                    innerR
                                )}
                                fill={segment.color}
                                className="transition-all duration-300 cursor-pointer animate-scale-in"
                                style={{
                                    animationDelay: `${index * 100}ms`,
                                    opacity: hoveredIndex === null || hoveredIndex === index ? 1 : 0.5
                                }}
                                onMouseEnter={() => setHoveredIndex(index)}
                                onMouseLeave={() => setHoveredIndex(null)}
                            />
                        </g>
                    ))}
                </svg>

                {/* Center text */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className="text-2xl font-bold text-white">{total}</div>
                    <div className="text-xs text-gray-400">Total</div>
                </div>
            </div>

            {/* Legend */}
            <div className="flex-1 space-y-2">
                {segments.map((segment, index) => (
                    <div
                        key={index}
                        className="flex items-center gap-2 cursor-pointer group"
                        onMouseEnter={() => setHoveredIndex(index)}
                        onMouseLeave={() => setHoveredIndex(null)}
                    >
                        <div
                            className="w-3 h-3 rounded-full transition-transform duration-200"
                            style={{
                                backgroundColor: segment.color,
                                transform: hoveredIndex === index ? 'scale(1.3)' : 'scale(1)'
                            }}
                        />
                        <div className="flex-1 flex items-center justify-between">
                            <span className={`text-sm transition-colors ${hoveredIndex === index ? 'text-white font-medium' : 'text-gray-400'
                                }`}>
                                {segment.name}
                            </span>
                            <span className={`text-sm transition-colors ${hoveredIndex === index ? 'text-white font-bold' : 'text-gray-500'
                                }`}>
                                {segment.percentage}%
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
