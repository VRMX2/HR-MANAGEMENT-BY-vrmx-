import React from 'react';
import { MoreHorizontal } from 'lucide-react';
import clsx from 'clsx';

export default function StatCard({ title, value, subtext, icon: Icon, trend, trendValue, iconColor }) {
    const isPositive = trend === 'up';

    return (
        <div className="bg-dark-800 rounded-xl p-6 border border-dark-700 relative group hover:border-primary-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary-500/10 animate-slide-up">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-gray-400 text-sm font-medium mb-1">{title}</h3>
                    <div className="text-3xl font-bold text-white mb-2 transition-transform duration-200 group-hover:scale-105">{value}</div>
                </div>
                <div className={clsx("p-3 rounded-xl bg-dark-700/50 text-gray-400 transition-all duration-200 group-hover:scale-110", iconColor)}>
                    {Icon && <Icon size={22} />}
                </div>
            </div>

            <div className="flex items-center gap-2 text-xs">
                {trendValue && (
                    <span className={clsx("font-medium px-2 py-0.5 rounded-md", isPositive ? "text-green-500 bg-green-500/10" : "text-red-500 bg-red-500/10")}>
                        {trendValue}
                    </span>
                )}
                <span className="text-gray-500">{subtext}</span>
            </div>
        </div>
    );
}
