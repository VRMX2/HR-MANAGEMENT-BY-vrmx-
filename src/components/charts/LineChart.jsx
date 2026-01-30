import React, { useState } from 'react';

export default function LineChart({ data, height = 200, color = '#3b82f6', showGrid = true }) {
    const [hoveredIndex, setHoveredIndex] = useState(null);

    if (!data || data.length === 0) {
        return (
            <div className="flex items-center justify-center h-full text-gray-500">
                No data available
            </div>
        );
    }

    const maxValue = Math.max(...data.map(d => d.count || d.value || 0), 1);
    const padding = 40;
    const width = 600;
    const chartHeight = height - padding * 2;
    const chartWidth = width - padding * 2;

    // Generate points for the line
    const points = data.map((item, index) => {
        const x = padding + (index / (data.length - 1)) * chartWidth;
        const y = padding + chartHeight - ((item.count || item.value || 0) / maxValue) * chartHeight;
        return { x, y, ...item };
    });

    // Create path for line
    const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');

    // Create path for area fill
    const areaPath = `${linePath} L ${points[points.length - 1].x} ${height - padding} L ${padding} ${height - padding} Z`;

    return (
        <div className="relative">
            <svg
                viewBox={`0 0 ${width} ${height}`}
                className="w-full"
                style={{ height: `${height}px` }}
            >
                {/* Grid lines */}
                {showGrid && (
                    <g className="opacity-10">
                        {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => (
                            <line
                                key={i}
                                x1={padding}
                                y1={padding + chartHeight * ratio}
                                x2={width - padding}
                                y2={padding + chartHeight * ratio}
                                stroke="currentColor"
                                strokeWidth="1"
                                className="text-gray-400"
                            />
                        ))}
                    </g>
                )}

                {/* Area fill with gradient */}
                <defs>
                    <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor={color} stopOpacity="0.3" />
                        <stop offset="100%" stopColor={color} stopOpacity="0.05" />
                    </linearGradient>
                </defs>

                <path
                    d={areaPath}
                    fill="url(#areaGradient)"
                    className="animate-fade-in"
                />

                {/* Line */}
                <path
                    d={linePath}
                    fill="none"
                    stroke={color}
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="animate-draw-line"
                />

                {/* Data points */}
                {points.map((point, index) => (
                    <g key={index}>
                        <circle
                            cx={point.x}
                            cy={point.y}
                            r={hoveredIndex === index ? 6 : 4}
                            fill={color}
                            className="transition-all duration-200 cursor-pointer animate-scale-in"
                            style={{ animationDelay: `${index * 50}ms` }}
                            onMouseEnter={() => setHoveredIndex(index)}
                            onMouseLeave={() => setHoveredIndex(null)}
                        />
                        {hoveredIndex === index && (
                            <g>
                                {/* Tooltip background */}
                                <rect
                                    x={point.x - 40}
                                    y={point.y - 45}
                                    width="80"
                                    height="35"
                                    rx="6"
                                    fill="#1f2937"
                                    stroke={color}
                                    strokeWidth="2"
                                    className="animate-fade-in"
                                />
                                {/* Tooltip text */}
                                <text
                                    x={point.x}
                                    y={point.y - 30}
                                    textAnchor="middle"
                                    className="text-xs fill-white font-medium"
                                >
                                    {point.label || point.date}
                                </text>
                                <text
                                    x={point.x}
                                    y={point.y - 15}
                                    textAnchor="middle"
                                    className="text-sm fill-white font-bold"
                                >
                                    {point.count || point.value || 0}
                                </text>
                            </g>
                        )}
                    </g>
                ))}

                {/* X-axis labels */}
                {points.map((point, index) => {
                    // Show every other label to avoid crowding
                    if (index % Math.ceil(points.length / 6) !== 0) return null;
                    return (
                        <text
                            key={`label-${index}`}
                            x={point.x}
                            y={height - padding + 20}
                            textAnchor="middle"
                            className="text-xs fill-gray-400"
                        >
                            {point.label || ''}
                        </text>
                    );
                })}
            </svg>
        </div>
    );
}
