'use client';

import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

/**
 * Sleek Progress Bar - Minimal design with subtle section markers
 * 
 * Keeps the clean aesthetic while showing:
 * - Smooth progress gradient
 * - Small section labels (optional)
 * - Time/percentage in corner
 */

interface ProgressBarProps {
    currentStage: number;
    totalStages: number;
    currentSection: 'INTRO' | 'IQ' | 'EQ' | 'RISK' | 'PERSONALITY';
    elapsedSeconds?: number;
    estimatedTotalMinutes?: number;
    className?: string;
}

const SECTION_COLORS: Record<string, string> = {
    'INTRO': 'from-neon-teal to-neon-blue',
    'IQ': 'from-neon-purple to-violet-500',
    'EQ': 'from-pink-500 to-rose-500',
    'RISK': 'from-amber-500 to-orange-500',
    'PERSONALITY': 'from-neon-green to-emerald-500'
};

export const ProgressBar = ({
    currentStage,
    totalStages,
    currentSection,
    elapsedSeconds = 0,
    estimatedTotalMinutes = 8,
    className
}: ProgressBarProps) => {
    const progress = Math.min(100, Math.round((currentStage / Math.max(1, totalStages)) * 100));

    // Calculate time remaining
    const progressRatio = progress / 100;
    const estimatedRemaining = progressRatio > 0.1
        ? Math.round((elapsedSeconds / progressRatio - elapsedSeconds) / 60)
        : estimatedTotalMinutes;

    const timeRemainingText = estimatedRemaining <= 1 ? '< 1 min' : `~${estimatedRemaining} min`;
    const gradientColor = SECTION_COLORS[currentSection] || SECTION_COLORS['INTRO'];

    return (
        <div className={cn("w-full space-y-1.5", className)}>
            {/* Labels Row */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <span className="text-[10px] font-mono text-neural-muted uppercase tracking-wider">
                        {currentSection === 'INTRO' ? 'STARTING' : currentSection}
                    </span>
                    <span className="text-[10px] font-mono text-white/30">
                        {timeRemainingText} left
                    </span>
                </div>
                <span className="text-[10px] font-mono text-neon-teal">
                    {progress}%
                </span>
            </div>

            {/* Progress Bar */}
            <div className="relative h-1.5 bg-white/5 rounded-full overflow-hidden">
                {/* Progress Fill */}
                <motion.div
                    className={cn(
                        "absolute top-0 bottom-0 left-0 rounded-full bg-gradient-to-r",
                        gradientColor
                    )}
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                    style={{
                        boxShadow: currentSection === 'IQ'
                            ? '0 0 12px rgba(168, 85, 247, 0.5)'
                            : currentSection === 'EQ'
                                ? '0 0 12px rgba(236, 72, 153, 0.5)'
                                : currentSection === 'RISK'
                                    ? '0 0 12px rgba(251, 146, 60, 0.5)'
                                    : currentSection === 'PERSONALITY'
                                        ? '0 0 12px rgba(34, 197, 94, 0.5)'
                                        : '0 0 12px rgba(34, 211, 238, 0.5)'
                    }}
                />
            </div>
        </div>
    );
};

export default ProgressBar;
