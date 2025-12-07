'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTestStore } from '../../store/useTestStore';
import { EQ_SCENARIOS } from '../../data/testContent';
import { NeonButton } from '../ui/NeonButton';
import { audio } from '../../engine/AudioEngine';
import { cn } from '../../lib/utils';

export const ScenarioStage = () => {
    const { currentStage, recordResponse, nextStage, addXp, stages } = useTestStore();
    const [startTime] = useState(Date.now());
    const [selectedIdx, setSelectedIdx] = useState<number | null>(null);

    const stageDef = stages[currentStage];
    const scenario = EQ_SCENARIOS.find(s => s.id === stageDef?.contentId);

    const handleChoice = (index: number) => {
        if (selectedIdx !== null) return; // Prevent double clicks
        setSelectedIdx(index);

        // Audio Cue
        audio.playClick();

        // Award XP for completing scenarios
        addXp(30);

        // Delay for "Echo" effect
        setTimeout(() => {
            recordResponse({
                choice: index,
                latency_ms: Date.now() - startTime,
                accuracy: true // Scenarios are subjective/weighted, handled in engine
            });
            nextStage();
        }, 800);
    };

    if (!stageDef || !scenario) return <div>Loading scenario...</div>;

    return (
        <div className="w-full max-w-4xl mx-auto px-4">
            <div className="mb-8 text-center">
                <h2 className="text-2xl font-display font-bold text-neon-teal mb-2">
                    {stageDef.title}
                </h2>
                <p className="text-neural-muted text-sm uppercase tracking-widest">
                    SITUATIONAL JUDGMENT PROTOCOL
                </p>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-neural-dark/50 border border-neon-teal/20 rounded-xl p-8 mb-8 backdrop-blur-sm shadow-[0_0_30px_rgba(34,211,238,0.1)]"
            >
                <p className="text-xl text-white leading-relaxed">
                    {scenario.scenario}
                </p>
            </motion.div>

            <div className="grid grid-cols-1 gap-4">
                {scenario.options.map((option, index) => (
                    <motion.button
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        onClick={() => handleChoice(index)}
                        className={cn(
                            "group relative w-full text-left p-6 rounded-lg border transition-all duration-500 overflow-hidden",
                            selectedIdx === index
                                ? "border-neon-teal bg-neon-teal/20"
                                : "border-neural-border bg-neural-bg/50 hover:bg-neural-dark hover:border-neon-teal/50"
                        )}
                    >
                        {/* Empathy Echo Ripple */}
                        {selectedIdx === index && (
                            <motion.div
                                layoutId="echo-ripple"
                                initial={{ scale: 0, opacity: 0.5 }}
                                animate={{ scale: 2, opacity: 0 }}
                                transition={{ duration: 0.8, ease: "easeOut" }}
                                className="absolute inset-0 bg-neon-teal/30 rounded-lg pointer-events-none"
                            />
                        )}

                        <div className="flex items-start gap-4 relative z-10">
                            <div className={cn(
                                "flex-shrink-0 w-8 h-8 rounded-full border flex items-center justify-center transition-colors duration-300",
                                selectedIdx === index
                                    ? "border-neon-teal text-neon-teal bg-neon-teal/10"
                                    : "border-neural-muted text-neural-muted group-hover:border-neon-teal group-hover:text-neon-teal"
                            )}>
                                {String.fromCharCode(65 + index)}
                            </div>
                            <span className={cn(
                                "transition-colors text-lg duration-300",
                                selectedIdx === index ? "text-white font-medium" : "text-neural-gray-100 group-hover:text-white"
                            )}>
                                {option.text}
                            </span>
                        </div>

                        {/* Hover Glow Effect */}
                        <div className="absolute inset-0 rounded-lg bg-neon-teal/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                    </motion.button>
                ))}
            </div>
        </div>
    );
};
