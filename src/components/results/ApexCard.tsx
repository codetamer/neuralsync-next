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
        <GlassCard className="relative overflow-hidden p-8 border-white/10">
            <div className="absolute top-0 right-0 p-4 opacity-20">
                <span className="text-6xl font-display font-bold">APEX</span>
            </div>

            <div className="relative z-10 space-y-4">
                <div className="flex items-center gap-4">
                    <div className={cn("w-2 h-12 rounded-full bg-current", colorClass)} />
                    <div>
                        <h3 className="text-sm text-neural-muted font-mono tracking-widest">DOMINANT ARCHETYPE</h3>
                        <h2 className={cn("text-4xl font-display font-bold tracking-wide", colorClass)}>
                            {trait.toUpperCase()}
                        </h2>
                    </div>
                </div>

                <div className="flex items-end gap-2">
                    <span className="text-5xl font-bold text-white">{score}</span>
                    <span className="text-xl text-neural-muted mb-2">/100</span>
                </div>

                <p className="text-lg text-gray-300 leading-relaxed max-w-xl">
                    {description}
                </p>

                <div className="pt-4">
                    <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${score}%` }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                            className={cn("h-full", colorClass.replace('text-', 'bg-'))}
                        />
                    </div>
                </div>
            </div>

            {/* Decorative background glow */}
            <div className={cn("absolute -bottom-20 -right-20 w-64 h-64 rounded-full blur-[100px] opacity-20", colorClass.replace('text-', 'bg-'))} />
        </GlassCard>
    );
};
