'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { NeonButton } from '../ui/NeonButton';
import { Zap } from 'lucide-react';

interface AdSlotBProps {
    onComplete: () => void;
    nextSection: string;
}

export const AdSlotB = ({ onComplete, nextSection }: AdSlotBProps) => {
    const [timeLeft, setTimeLeft] = useState(3);
    const [canSkip, setCanSkip] = useState(false);

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    setCanSkip(true);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-neural-bg/95 backdrop-blur-xl flex flex-col items-center justify-center p-4"
        >
            <div className="w-full max-w-md space-y-8 text-center">
                <div className="space-y-2">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        className="w-16 h-16 border-4 border-neon-teal border-t-transparent rounded-full mx-auto"
                    />
                    <h2 className="text-2xl font-display font-bold text-white">SYSTEM CALIBRATION</h2>
                    <p className="text-neural-muted">
                        Initializing {nextSection} protocols...
                    </p>
                </div>

                {/* Ad Container */}
                <div className="w-full aspect-video bg-neural-bg/50 rounded-xl border border-white/10 flex items-center justify-center relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-tr from-neon-purple/10 to-neon-blue/10 opacity-50" />
                    <span className="font-mono text-sm text-neural-muted group-hover:text-white transition-colors">
                        SPONSORED_CONTENT_SLOT
                    </span>
                    <div className="absolute bottom-2 right-2 text-[10px] text-white/20 font-mono">
                        ADVERTISEMENT
                    </div>
                </div>

                <div className="h-12 flex items-center justify-center">
                    {canSkip ? (
                        <NeonButton onClick={onComplete} className="w-full" glow>
                            PROCEED TO {nextSection} <Zap className="ml-2 w-4 h-4" />
                        </NeonButton>
                    ) : (
                        <div className="font-mono text-neon-teal animate-pulse">
                            CALIBRATING... {timeLeft}s
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
};
