'use client';

import { motion } from 'framer-motion';
import { GlassCard } from '../ui/GlassCard';
import { cn } from '../../lib/utils';

interface ApexCardProps {
    trait: string;
    score: number;
    description: string;
}

export const ApexCard = ({ trait, score, description }: ApexCardProps) => {
    // Determine color based on trait (mock logic for visual variety)
    const getColor = (t: string) => {
        const colors: Record<string, string> = {
            'Openness': 'text-neon-purple',
            'Conscientiousness': 'text-neon-blue',
            'Extraversion': 'text-neon-orange',
            'Agreeableness': 'text-neon-green',
            'Neuroticism': 'text-neon-red'
        };
        return colors[t] || 'text-neon-teal';
    };

    const colorClass = getColor(trait);

    return (
        <GlassCard className="relative overflow-hidden p-6 border-white/10 flex flex-col justify-between h-full min-h-[320px]">
            {/* Watermark - Top Right */}
            <div className="absolute top-6 right-6 opacity-10 pointer-events-none select-none z-0">
                <span className="text-7xl font-display font-bold text-white tracking-widest">APEX</span>
            </div>

            <div className="relative z-10 flex flex-col h-full justify-center space-y-6">
                <div className="flex items-start gap-4">
                    <div className={cn("w-1.5 h-12 rounded-full bg-current mt-1 shrink-0 shadow-[0_0_10px_currentColor]", colorClass)} />
                    <div className="flex-1 min-w-0">
                        <h3 className="text-xs text-neural-muted font-mono tracking-widest mb-1 uppercase">Dominant Archetype</h3>
                        <h2 className={cn("text-3xl md:text-4xl font-display font-bold tracking-wide leading-tight break-words drop-shadow-lg", colorClass)}>
                            {trait.toUpperCase()}
                        </h2>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="flex items-baseline gap-2 pl-5.5">
                        <span className="text-6xl font-bold text-white tracking-tighter drop-shadow-md">{score}</span>
                        <span className="text-sm text-neural-muted font-mono">/100</span>
                    </div>

                    <p className="text-base text-gray-300 leading-relaxed pl-5.5 max-w-lg line-clamp-3 font-light">
                        {description}
                    </p>

                    <div className="pt-2 pl-5.5">
                        <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${score}%` }}
                                transition={{ duration: 1.5, ease: "easeOut" }}
                                className={cn("h-full shadow-[0_0_15px_currentColor]", colorClass.replace('text-', 'bg-'))}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Decorative background glow */}
            <div className={cn("absolute -top-20 -right-20 w-64 h-64 rounded-full blur-[100px] opacity-10 pointer-events-none", colorClass.replace('text-', 'bg-'))} />
        </GlassCard>
    );
};
