'use client';

import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, BrainCircuit } from 'lucide-react';
import { NeonButton } from '../ui/NeonButton';

interface AdSlotNativeProps {
    delay?: number;
}

export const AdSlotNative = ({ delay = 0.5 }: AdSlotNativeProps) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay, duration: 0.5 }}
            className="col-span-1 md:col-span-2 relative group overflow-hidden rounded-2xl border border-neon-teal/30 bg-neural-card/40 backdrop-blur-md"
        >
            {/* Premium Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-neon-teal/5 via-transparent to-neon-purple/5 opacity-50 group-hover:opacity-100 transition-opacity duration-500" />

            <div className="p-6 relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2 text-neon-teal font-mono text-xs tracking-widest mb-1">
                        <Sparkles className="w-3 h-3" />
                        <span>RECOMMENDED PROTOCOL</span>
                    </div>

                    <h3 className="text-xl font-display font-bold text-white group-hover:text-neon-teal transition-colors">
                        Accelerate Your Cognitive Growth
                    </h3>

                    <p className="text-sm text-neural-muted max-w-md">
                        Based on your profile, you could benefit from advanced neuro-plasticity training.
                        Unlock the full potential of your {`Archetype`}.
                    </p>
                </div>

                <div className="flex flex-col items-center gap-3 shrink-0">
                    <div className="flex items-center gap-4">
                        <div className="flex -space-x-2">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="w-8 h-8 rounded-full border border-neural-bg bg-white/10 flex items-center justify-center text-[8px] font-mono text-white">
                                    USER
                                </div>
                            ))}
                        </div>
                        <span className="text-[10px] text-neural-muted">
                            Joined by 12k+ users
                        </span>
                    </div>

                    <NeonButton
                        onClick={() => window.open('https://example.com/training', '_blank')}
                        className="w-full md:w-auto"
                        size="sm"
                        glow
                        variant="primary"
                    >
                        START TRAINING <ArrowRight className="w-4 h-4 ml-2" />
                    </NeonButton>

                    <span className="text-[9px] text-white/20 font-mono">
                        SPONSORED
                    </span>
                </div>
            </div>

            {/* Decorative Icon */}
            <BrainCircuit className="absolute -bottom-8 -right-8 w-32 h-32 text-white/5 rotate-12 group-hover:rotate-0 transition-transform duration-700" />
        </motion.div>
    );
};
