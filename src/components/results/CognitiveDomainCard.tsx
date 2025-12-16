'use client';

import { motion } from 'framer-motion';
import { GlassCard } from '../ui/GlassCard';
import { Brain, Zap, Clock, Box, GitBranch } from 'lucide-react';

interface CognitiveDomainCardProps {
    data: {
        fluid: number;
        crystallized: number;
        memory: number;
        speed: number;
        executive: number;
    }
}

export const CognitiveDomainCard = ({ data }: CognitiveDomainCardProps) => {
    const domains = [
        {
            label: "Fluid Intelligence (Gf)",
            score: data.fluid,
            icon: Brain,
            color: "text-neon-teal",
            bar: "bg-neon-teal",
            desc: "Abstract reasoning & problem solving"
        },
        {
            label: "Crystallized (Gc)",
            score: data.crystallized,
            icon: Box,
            color: "text-neon-purple",
            bar: "bg-neon-purple",
            desc: "Verbal knowledge & diverse vocabulary"
        },
        {
            label: "Working Memory (Gwm)",
            score: data.memory,
            icon: Clock,
            color: "text-neon-blue",
            bar: "bg-neon-blue",
            desc: "Mental workspace capacity"
        },
        {
            label: "Processing Speed (Gs)",
            score: data.speed,
            icon: Zap,
            color: "text-neon-orange",
            bar: "bg-neon-orange",
            desc: "Mental reaction time & fluency"
        },
        {
            label: "Executive Function (Gex)",
            score: data.executive,
            icon: GitBranch,
            color: "text-neon-green",
            bar: "bg-neon-green",
            desc: "Cognitive control & flexibility"
        }
    ];

    return (
        <GlassCard className="p-6 h-full flex flex-col">
            <h3 className="text-xl font-display font-bold text-white mb-6 flex items-center gap-2">
                <Brain className="w-6 h-6 text-neon-teal" />
                COGNITIVE ARCHITECTURE
            </h3>

            <div className="flex-1 space-y-6">
                {domains.map((domain, i) => (
                    <motion.div
                        key={domain.label}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                    >
                        <div className="flex justify-between items-end mb-2">
                            <div className="flex items-center gap-3">
                                <domain.icon className={`w-5 h-5 ${domain.color}`} />
                                <div>
                                    <div className="text-white font-bold">{domain.label}</div>
                                    <div className="text-xs text-white/50">{domain.desc}</div>
                                </div>
                            </div>
                            <div className={`text-xl font-mono font-bold ${domain.color}`}>
                                {Math.round(domain.score)}
                            </div>
                        </div>

                        <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${domain.score}%` }}
                                transition={{ duration: 1, ease: "easeOut", delay: i * 0.1 }}
                                className={`h-full ${domain.bar} ${domain.color} shadow-[0_0_10px_currentColor]`}
                            />
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="mt-6 pt-4 border-t border-white/10 text-xs text-white/40 text-center">
                Scores normalized against n=15,000 reference set
            </div>
        </GlassCard>
    );
};
