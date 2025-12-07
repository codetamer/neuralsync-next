'use client';

import { motion, Variants } from 'framer-motion';
import { NeonButton } from '../ui/NeonButton';
import { GlassCard } from '../ui/GlassCard';
import { useTestStore } from '../../store/useTestStore';
import { Brain, Activity, Zap, ArrowRight, ShieldCheck } from 'lucide-react';

export const IntroStage = () => {
    const { nextStage } = useTestStore();

    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.3
            }
        }
    };

    const itemVariants: Variants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 100,
                damping: 10
            }
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-full py-4">
            <GlassCard className="max-w-3xl w-full mx-auto p-8 overflow-hidden relative">
                {/* Decorative Background Elements */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-neon-teal to-transparent opacity-50" />
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-neon-blue/10 rounded-full blur-[100px]" />
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-neon-purple/10 rounded-full blur-[100px]" />

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="relative z-10 text-center space-y-5"
                >
                    {/* Logo / Icon */}
                    <motion.div variants={itemVariants} className="flex justify-center mb-4">
                        <div className="relative">
                            <div className="absolute inset-0 bg-neon-teal/20 blur-xl rounded-full animate-pulse" />
                            <Brain className="w-16 h-16 text-neon-teal relative z-10 drop-shadow-[0_0_15px_rgba(45,212,191,0.5)]" />
                        </div>
                    </motion.div>

                    {/* Title */}
                    <motion.div variants={itemVariants}>
                        <h1 className="text-5xl md:text-6xl font-display font-bold text-white tracking-tight mb-2">
                            NEURAL<span className="text-neon-teal drop-shadow-[0_0_10px_rgba(45,212,191,0.3)]">PROFILE</span>
                        </h1>
                        <div className="flex items-center justify-center gap-2 text-neon-blue font-mono text-xs tracking-[0.3em] uppercase opacity-80">
                            <span className="w-1.5 h-1.5 bg-neon-blue rounded-full animate-pulse" />
                            System Online
                            <span className="w-1.5 h-1.5 bg-neon-blue rounded-full animate-pulse" />
                        </div>
                    </motion.div>

                    {/* Divider */}
                    <motion.div variants={itemVariants} className="flex justify-center py-2">
                        <div className="h-px w-16 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                    </motion.div>

                    {/* Description */}
                    <motion.div variants={itemVariants} className="space-y-3">
                        <h2 className="text-2xl font-bold text-white">
                            Unlock Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-teal to-neon-blue">Cognitive Architecture</span>
                        </h2>
                        <p className="text-base text-white/70 max-w-lg mx-auto leading-relaxed">
                            Beyond standard IQ. Map the hidden dimensions of your mind through
                            advanced <span className="text-white">Fluid Intelligence</span>, <span className="text-white">Executive Function</span>,
                            and <span className="text-white">Creative Resonance</span> analysis.
                        </p>
                    </motion.div>

                    {/* Features Grid */}
                    <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-3 max-w-2xl mx-auto py-4">
                        <div className="bg-white/5 border border-white/5 rounded-xl p-3 flex flex-col items-center gap-1.5 backdrop-blur-sm hover:bg-white/10 transition-colors group cursor-default">
                            <Activity className="w-5 h-5 text-neon-purple group-hover:scale-110 transition-transform" />
                            <span className="text-sm font-bold text-white">Dynamic difficulty</span>
                            <span className="text-[10px] text-white/50">Adapts to your skill level</span>
                        </div>
                        <div className="bg-white/5 border border-white/5 rounded-xl p-3 flex flex-col items-center gap-1.5 backdrop-blur-sm hover:bg-white/10 transition-colors group cursor-default">
                            <ShieldCheck className="w-5 h-5 text-neon-green group-hover:scale-110 transition-transform" />
                            <span className="text-sm font-bold text-white">Precision Metrics</span>
                            <span className="text-[10px] text-white/50">Clinical-grade accuracy</span>
                        </div>
                        <div className="bg-white/5 border border-white/5 rounded-xl p-3 flex flex-col items-center gap-1.5 backdrop-blur-sm hover:bg-white/10 transition-colors group cursor-default">
                            <Zap className="w-5 h-5 text-neon-yellow group-hover:scale-110 transition-transform" />
                            <span className="text-sm font-bold text-white">Neural Blueprint</span>
                            <span className="text-[10px] text-white/50">Visualize your potential</span>
                        </div>
                    </motion.div>

                    {/* CTA */}
                    <motion.div variants={itemVariants} className="pt-2">
                        <NeonButton onClick={nextStage} size="lg" className="mx-auto w-64 group relative overflow-hidden" glow>
                            <span className="relative z-10 flex items-center justify-center gap-2 font-bold tracking-wide">
                                INITIALIZE EVALUATION <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </span>
                        </NeonButton>
                        <p className="mt-3 text-[10px] text-white/30 font-mono">
                            SESSION ESTIMATE: 12-15 MINUTES • QUIET ENVIRONMENT REQUIRED
                        </p>
                    </motion.div>
                </motion.div>
            </GlassCard>
        </div>
    );
};
