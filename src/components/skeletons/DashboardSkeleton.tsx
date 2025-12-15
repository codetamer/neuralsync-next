import React from 'react';
import { GlassCard } from '../ui/GlassCard';

export const DashboardSkeleton = () => {
    return (
        <div className="max-w-6xl mx-auto w-full space-y-8 pb-12 animate-pulse">
            {/* Header Skeleton */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="space-y-2">
                    <div className="h-8 w-64 bg-white/10 rounded"></div>
                    <div className="h-4 w-48 bg-white/5 rounded"></div>
                </div>
                <div className="h-12 w-40 bg-white/10 rounded-full"></div>
            </div>

            {/* Stats Grid Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                    <GlassCard key={i} className="p-4 flex items-center gap-4 h-24 border-none bg-white/5">
                        <div className="w-12 h-12 rounded-lg bg-white/10"></div>
                        <div className="space-y-2 flex-1">
                            <div className="h-3 w-20 bg-white/10 rounded"></div>
                            <div className="h-6 w-16 bg-white/10 rounded"></div>
                        </div>
                    </GlassCard>
                ))}
            </div>

            {/* Charts Row Skeleton */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <GlassCard className="h-[400px] border-none bg-white/5"><div></div></GlassCard>
                <GlassCard className="h-[400px] border-none bg-white/5"><div></div></GlassCard>
            </div>

            {/* Main Content Split Skeleton */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <div className="h-6 w-32 bg-white/10 rounded"></div>
                    <div className="space-y-2">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="h-16 w-full bg-white/5 rounded-lg"></div>
                        ))}
                    </div>
                </div>
                <div className="h-64 bg-white/5 rounded-lg"></div>
            </div>
        </div>
    );
};
