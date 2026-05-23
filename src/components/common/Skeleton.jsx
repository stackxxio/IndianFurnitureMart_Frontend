import React from 'react';

const Skeleton = ({ className = '', variant = 'rect' }) => {
    const variants = {
        rect: 'rounded-2xl',
        circle: 'rounded-full',
        luxury: 'rounded-[2rem]'
    };

    return (
        <div className={`animate-pulse bg-primary/5 ${variants[variant]} ${className}`} />
    );
};

export const ProductSkeleton = () => (
    <div className="space-y-6">
        <Skeleton variant="luxury" className="aspect-[3/4]" />
        <div className="space-y-3">
            <Skeleton className="h-6 w-2/3" />
            <Skeleton className="h-4 w-1/3" />
        </div>
    </div>
);

export default Skeleton;
