'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { NeonButton } from '../ui/NeonButton';
import { Lock, Play, Loader2 } from 'lucide-react';

interface AdSlotDProps {
    onComplete: () => void;
}

export const AdSlotD = ({ onComplete }: AdSlotDProps) => {
    const [timeLeft, setTimeLeft] = useState(30);

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
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
            className="fixed inset-0 z-[100] bg-neural-bg/98 backdrop-blur-2xl flex flex-col items-center justify-center p-4"
        >
            <div className="w-full max-w-2xl space-y-8">
                <div className="text-center space-y-2">
                    <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-neon-red/10 border border-neon-red/50 text-neon-red text-xs font-bold tracking-wider mb-4">
                        <Lock className="w-3 h-3" /> RESULTS ENCRYPTED
                    </div>
                    <h2 className="text-3xl font-display font-bold text-white">DECRYPTING NEURAL PROFILE</h2>
                    <p className="text-neural-muted">Analysis complete. Decrypting final data stream...</p>
                </div>

                {/* Video Ad Container */}
                <div className="relative w-full aspect-video bg-neural-bg rounded-2xl border border-white/10 overflow-hidden shadow-2xl shadow-neon-purple/20">
                    {/* Progress Bar */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-white/10 z-20">
                        <motion.div
                            initial={{ width: "0%" }}
                            animate={{ width: "100%" }}
                            transition={{ duration: 30, ease: "linear" }}
                            className="h-full bg-neon-purple"
                        />
                    </div>

                    {/* Placeholder Content */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center animate-pulse">
                            <Play className="w-8 h-8 text-white/50 ml-1" />
                        </div>
                        <span className="font-mono text-sm text-neural-muted">
                            SPONSOR_VIDEO_AD_SLOT_D
                        </span>
                    </div>

                    {/* Countdown Overlay */}
                    <div className="absolute bottom-4 right-4 bg-neural-bg/80 backdrop-blur px-3 py-1 rounded-lg text-xs font-mono text-white border border-white/10">
                        {timeLeft > 0 ? `AD ENDS IN ${timeLeft}s` : 'AD COMPLETED'}
                    </div>
                </div>

                <div className="flex justify-center">
                    <NeonButton
                        onClick={onComplete}
                        disabled={timeLeft > 0}
                        size="lg"
                        className="w-64"
                        glow={timeLeft === 0}
                    >
                        {timeLeft > 0 ? (
                            <span className="flex items-center gap-2">
                                <Loader2 className="w-4 h-4 animate-spin" /> DECRYPTING...
                            </span>
                        ) : (
                            "ACCESS RESULTS"
                        )}
                    </NeonButton>
                </div>
            </div>
        </motion.div>
    );
};
