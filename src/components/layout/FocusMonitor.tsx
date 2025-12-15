'use client';

import { useEffect, useState } from 'react';
import { useTestStore } from '../../store/useTestStore';
import { AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const FocusMonitor = () => {
    const { isTestComplete, isPaused, currentStage, stages, isRanked, disqualify } = useTestStore();
    const [blurCount, setBlurCount] = useState(0);
    const [showWarning, setShowWarning] = useState(false);

    useEffect(() => {
        // Only monitor focus during active test stages (excluding Intro/Home)
        if (currentStage === 0 || isTestComplete || isPaused) return;

        // Optional: Also check if current stage is specifically an 'intro' type if stage 0 isn't enough
        const currentStageDef = stages[currentStage];
        if (currentStageDef?.type === 'intro') return;

        const handleBlur = () => {
            setBlurCount(prev => {
                const newCount = prev + 1;

                if (isRanked) {
                    // STRICT MODE: Disqualify immediately or after threshold
                    // For "Real" feature, let's be strict: Immediate DQ or strict warning then DQ
                    if (newCount > 1) { // Allow 1 accidental slip, 2nd is DQ
                        disqualify();
                        // We don't return here because disqualify() updates isTestComplete which triggers effect cleanup
                    }
                }

                // Show warning when blurred (cheat detected)
                setShowWarning(true);
                return newCount;
            });
        };

        const handleFocus = () => {
            // Hide warning after 2 seconds
            setTimeout(() => setShowWarning(false), 2000);
        };

        window.addEventListener('blur', handleBlur);
        window.addEventListener('focus', handleFocus);

        return () => {
            window.removeEventListener('blur', handleBlur);
            window.removeEventListener('focus', handleFocus);
        };
    }, [isTestComplete, isPaused, currentStage, isRanked, disqualify]);

    return (
        <AnimatePresence>
            {showWarning && (
                <motion.div
                    initial={{ y: -100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -100, opacity: 0 }}
                    className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] px-6 py-3 bg-red-500/90 backdrop-blur-md rounded-full border border-red-400 shadow-[0_0_20px_rgba(239,68,68,0.6)] flex items-center gap-3"
                >
                    <AlertTriangle className="w-5 h-5 text-white animate-pulse" />
                    <span className="font-mono text-white font-bold">
                        FOCUS LOSS DETECTED! ({blurCount})
                    </span>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
