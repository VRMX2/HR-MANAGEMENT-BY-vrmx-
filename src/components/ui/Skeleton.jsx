import React from 'react';
import { cn } from '../../lib/utils';

function Skeleton({ className, ...props }) {
    return (
        <div
            className={cn("animate-pulse rounded-md bg-dark-700/50", className)}
            {...props}
        />
    )
}

export { Skeleton };
