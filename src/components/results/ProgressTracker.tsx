'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
    TrendingUp,
    TrendingDown,
    Minus,
    Calendar,
    Clock,
    Target,
    BarChart3,
    ArrowUpRight
} from 'lucide-react';
import { cn } from '../../lib/utils';

// ============================================================================
// TYPES
// ============================================================================

export interface ProgressDataPoint {
    date: string;
    gf?: number;
    gwm?: number;
    gs?: number;
    gc?: number;
    gex?: number;
    meta?: number;
    composite?: number;
}

export interface ProgressTrackerProps {
    data: ProgressDataPoint[];
    currentScores: Record<string, number>;
    className?: string;
}

// ============================================================================
// PROGRESS TRACKER COMPONENT
// ============================================================================

export const ProgressTracker: React.FC<ProgressTrackerProps> = ({
    data,
    currentScores,
    className,
}) => {
    // Calculate changes since first assessment
    const firstAssessment = data[0];
    const latestAssessment = data[data.length - 1];

    const metrics = [
        { key: 'gf', label: 'Fluid Intelligence', color: '#22d3ee' },
        { key: 'gwm', label: 'Working Memory', color: '#a855f7' },
        { key: 'gs', label: 'Processing Speed', color: '#22c55e' },
        { key: 'gc', label: 'Crystallized', color: '#f97316' },
        { key: 'gex', label: 'Executive Func.', color: '#ec4899' },
        { key: 'meta', label: 'Meta-Cognition', color: '#eab308' },
    ];

    return (
        <div className={cn(
            "bg-neural-card/80 backdrop-blur-md rounded-2xl border border-white/10 overflow-hidden",
            className
        )}>
            {/* Header */}
            <div className="p-4 border-b border-white/10 bg-gradient-to-r from-white/5 to-transparent">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="font-display text-lg font-bold text-white tracking-wider flex items-center gap-2">
                            <BarChart3 className="w-5 h-5 text-neon-purple" />
                            PROGRESS TRACKER
                        </h3>
                        <p className="text-neural-muted text-xs mt-1">
                            Track your cognitive growth over time
                        </p>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-neural-muted">
                        <Calendar className="w-4 h-4" />
                        <span>{data.length} assessments</span>
                    </div>
                </div>
            </div>

            {/* Mini Sparkline Chart Area */}
            <div className="p-4 border-b border-white/10">
                <div className="h-24 relative">
                    {/* Placeholder for actual chart - would use recharts */}
                    <div className="absolute inset-0 flex items-end justify-around gap-1">
                        {data.slice(-10).map((point, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ height: 0 }}
                                animate={{ height: `${((point.composite || 100) - 60) / 0.8}%` }}
                                transition={{ delay: idx * 0.05, duration: 0.4 }}
                                className="w-full bg-gradient-to-t from-neon-cyan/30 to-neon-cyan rounded-t"
                            />
                        ))}
                    </div>
                    {/* Reference lines */}
                    <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                        <div className="border-b border-dashed border-white/10" />
                        <div className="border-b border-dashed border-white/20 flex items-center">
                            <span className="text-xs text-neural-muted -translate-y-2 bg-neural-card px-1">100</span>
                        </div>
                        <div className="border-b border-dashed border-white/10" />
                    </div>
                </div>
            </div>

            {/* Change Summary Grid */}
            <div className="p-4 grid grid-cols-2 md:grid-cols-3 gap-3">
                {metrics.map((metric) => {
                    const current = currentScores[metric.key] || 100;
                    const first = (firstAssessment as any)?.[metric.key] || 100;
                    const change = current - first;

                    return (
                        <ChangeIndicator
                            key={metric.key}
                            label={metric.label}
                            current={current}
                            change={change}
                            color={metric.color}
                        />
                    );
                })}
            </div>

            {/* Footer Stats */}
            <div className="p-4 border-t border-white/10 bg-white/5">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 text-xs text-neural-muted">
                            <Clock className="w-4 h-4" />
                            <span>Last: {latestAssessment?.date || 'Today'}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-neural-muted">
                            <Target className="w-4 h-4" />
                            <span>Goal: 120+</span>
                        </div>
                    </div>
                    <button className="flex items-center gap-1 text-xs text-neon-cyan hover:text-neon-cyan/80 transition-colors">
                        View History
                        <ArrowUpRight className="w-3 h-3" />
                    </button>
                </div>
            </div>
        </div>
    );
};

// ============================================================================
// CHANGE INDICATOR
// ============================================================================

interface ChangeIndicatorProps {
    label: string;
    current: number;
    change: number;
    color: string;
}

const ChangeIndicator: React.FC<ChangeIndicatorProps> = ({ label, current, change, color }) => {
    const isPositive = change > 0;
    const isNegative = change < 0;
    const isNeutral = change === 0;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white/5 rounded-lg p-2 border border-white/5"
        >
            <p className="text-xs text-neural-muted truncate mb-1">{label}</p>
            <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-white font-mono">{current}</span>
                <div className={cn(
                    "flex items-center gap-0.5 text-xs font-mono",
                    isPositive && "text-neon-green",
                    isNegative && "text-red-400",
                    isNeutral && "text-neural-muted"
                )}>
                    {isPositive && <TrendingUp className="w-3 h-3" />}
                    {isNegative && <TrendingDown className="w-3 h-3" />}
                    {isNeutral && <Minus className="w-3 h-3" />}
                    <span>{isPositive ? '+' : ''}{change}</span>
                </div>
            </div>
            <div className="h-1 bg-white/10 rounded-full mt-2 overflow-hidden">
                <div
                    className="h-full rounded-full transition-all"
                    style={{
                        width: `${Math.min(100, Math.max(0, ((current - 60) / 80) * 100))}%`,
                        backgroundColor: color
                    }}
                />
            </div>
        </motion.div>
    );
};

// ============================================================================
// SAMPLE DATA GENERATOR (for testing)
// ============================================================================

export const generateSampleProgressData = (count: number = 5): ProgressDataPoint[] => {
    const data: ProgressDataPoint[] = [];
    const baseDate = new Date();

    for (let i = count - 1; i >= 0; i--) {
        const date = new Date(baseDate);
        date.setMonth(date.getMonth() - i);

        // Simulate gradual improvement with some variance
        const improvement = (count - 1 - i) * 2;
        const variance = () => Math.floor(Math.random() * 6) - 3;

        const gf = 95 + improvement + variance();
        const gwm = 98 + improvement + variance();
        const gs = 102 + improvement + variance();
        const gc = 100 + improvement + variance();
        const gex = 96 + improvement + variance();
        const meta = 94 + improvement + variance();

        data.push({
            date: date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
            gf,
            gwm,
            gs,
            gc,
            gex,
            meta,
            composite: Math.round((gf + gwm + gs + gc + gex + meta) / 6),
        });
    }

    return data;
};

export default ProgressTracker;
