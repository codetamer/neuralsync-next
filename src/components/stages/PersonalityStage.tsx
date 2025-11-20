'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTestStore, STAGE_DEFINITIONS } from '../../store/useTestStore';
import { PERSONALITY_ITEMS } from '../../data/testContent';
import { GlassCard } from '../ui/GlassCard';
import { NeonButton } from '../ui/NeonButton';
import { cn } from '../../lib/utils';

export const PersonalityStage = () => {
    const { recordResponse, nextStage, currentStage } = useTestStore();
    const [sliderValue, setSliderValue] = useState(4); // 1-7 scale, default middle
    const [startTime, setStartTime] = useState(0);

    const stageDef = STAGE_DEFINITIONS[currentStage];
    const question = PERSONALITY_ITEMS.find(i => i.id === stageDef.contentId);

    useEffect(() => {
        setSliderValue(4);
        setStartTime(performance.now());
    }, [currentStage]);

    const handleConfirm = () => {
        const latency = performance.now() - startTime;

        recordResponse({
            choice: sliderValue,
            latency_ms: Math.round(latency),
            accuracy: true // Personality has no "wrong" answers
        });

        nextStage();
    };

    if (!question) return <div>Loading question...</div>;

    return (
        <div className="w-full max-w-3xl mx-auto flex flex-col items-center gap-12 min-h-[60vh] justify-center">
            <div className="text-center space-y-2">
                <h2 className="text-3xl font-display font-bold text-white">Identity Matrix</h2>
                <p className="text-neural-muted">Calibrate your neural profile parameters.</p>
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={question.id}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.3 }}
                    className="w-full"
                >
                    <GlassCard className="p-8 md:p-12 flex flex-col gap-12 items-center">
                        <h3 className="text-2xl md:text-3xl text-center font-light leading-relaxed">
                            "{question.text}"
                        </h3>

                        <div className="w-full max-w-xl space-y-6">
                            <div className="flex justify-between text-sm text-neural-muted font-mono uppercase tracking-widest">
                                <span>Disagree</span>
                                <span>Agree</span>
                            </div>

                            {/* Custom Range Slider */}
                            <div className="relative h-12 flex items-center">
                                <div className="absolute inset-0 bg-white/5 rounded-full overflow-hidden">
                                    <motion.div
                                        className="h-full bg-gradient-to-r from-neon-purple/20 to-neon-teal/20"
                                        animate={{ width: `${((sliderValue - 1) / 6) * 100}%` }}
                                    />
                                </div>

                                <input
                                    type="range"
                                    min="1"
                                    max="7"
                                    step="1"
                                    value={sliderValue}
                                    onChange={(e) => setSliderValue(Number(e.target.value))}
                                    className="absolute inset-0 w-full opacity-0 cursor-pointer"
                                />

                                {/* Visual Thumb */}
                                <motion.div
                                    animate={{ left: `${((sliderValue - 1) / 6) * 100}%` }}
                                    className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 bg-white rounded-full shadow-[0_0_20px_rgba(255,255,255,0.5)] flex items-center justify-center text-black font-bold text-sm pointer-events-none"
                                >
                                    {sliderValue}
                                </motion.div>

                                {/* Ticks */}
                                <div className="absolute inset-0 flex justify-between px-4 pointer-events-none">
                                    {[1, 2, 3, 4, 5, 6, 7].map(n => (
                                        <div key={n} className={cn("w-1 h-1 rounded-full", n === sliderValue ? "bg-transparent" : "bg-white/20")} />
                                    ))}
                                </div>
                            </div>

                            <div className="text-center text-neon-teal font-mono text-sm">
                                {sliderValue === 1 && "STRONGLY DISAGREE"}
                                {sliderValue === 2 && "DISAGREE"}
                                {sliderValue === 3 && "SLIGHTLY DISAGREE"}
                                {sliderValue === 4 && "NEUTRAL"}
                                {sliderValue === 5 && "SLIGHTLY AGREE"}
                                {sliderValue === 6 && "AGREE"}
                                {sliderValue === 7 && "STRONGLY AGREE"}
                            </div>
                        </div>

                        <NeonButton onClick={handleConfirm} size="lg" className="w-full max-w-xs">
                            CONFIRM INPUT
                        </NeonButton>
                    </GlassCard>
                </motion.div>
            </AnimatePresence>

            <div className="text-neural-muted font-mono text-sm">
                PARAMETER: {currentStage - 20}/30
            </div>
        </div>
    );
};
