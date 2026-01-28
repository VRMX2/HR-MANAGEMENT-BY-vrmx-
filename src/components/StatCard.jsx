import React from 'react';
import { MoreHorizontal } from 'lucide-react';
import clsx from 'clsx';

export default function StatCard({ title, value, subtext, icon: Icon, trend, trendValue, iconColor }) {
    const isPositive = trend === 'up';

    return (
        <div className="bg-dark-800 rounded-xl p-6 border border-dark-700 relative group hover:border-dark-600 transition-all duration-200">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-gray-400 text-sm font-medium mb-1">{title}</h3>
                    <div className="text-3xl font-bold text-white mb-2">{value}</div>
                </div>
                <div className={clsx("p-2 rounded-lg bg-dark-700/50 text-gray-400", iconColor)}>
                    {Icon && <Icon size={20} />}
                </div>
            </div>

            <div className="flex items-center gap-2 text-xs">
                {trendValue && (
                    <span className={clsx("font-medium", isPositive ? "text-green-500" : "text-red-500")}>
                        {trendValue}
                    </span>
                )}
                <span className="text-gray-500">{subtext}</span>
            </div>
        </div>
    );
}
