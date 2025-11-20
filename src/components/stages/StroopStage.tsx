'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTestStore } from '../../store/useTestStore';
import { generateStroopTask, StroopStimulus, COLOR_MAP, COLOR_NAMES, ColorName } from '../../engine/EmotionalStroop';

export const StroopStage = () => {
    const { recordResponse, nextStage, currentStage } = useTestStore();
    const [stimulus, setStimulus] = useState<StroopStimulus | null>(null);
    const [startTime, setStartTime] = useState<number>(0);

    useEffect(() => {
        // Difficulty based on stage number (6-10) -> (2-6)
        const difficulty = ((currentStage - 5) % 5) + 2;
        const newStimulus = generateStroopTask(difficulty as any);
        setStimulus(newStimulus);
        setStartTime(performance.now());
    }, [currentStage]);

    const handleChoice = (color: ColorName) => {
        if (!stimulus) return;

        const latency = performance.now() - startTime;
        const isCorrect = color === stimulus.correctColorName;

        recordResponse({
            choice: color,
            latency_ms: Math.round(latency),
            accuracy: isCorrect
        });
        nextStage();
    };

    if (!stimulus) return null;

    return (
        <div className="w-full max-w-4xl mx-auto flex flex-col gap-12 items-center justify-center min-h-[60vh]">
            <div className="text-center space-y-2">
                <h2 className="text-3xl font-display font-bold text-white">Synaptic Resonance</h2>
                <p className="text-neural-muted">Select the <span className="text-white font-bold">COLOR</span> of the word, not the meaning.</p>
            </div>

            {/* The Stimulus Word */}
            <div className="relative flex items-center justify-center h-64 w-full">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={stimulus.emotionalWord + currentStage}
                        initial={{ scale: 0.5, opacity: 0, filter: 'blur(10px)' }}
                        animate={{
                            scale: 1,
                            opacity: 1,
                            filter: 'blur(0px)',
                            x: stimulus.interference ? [0, -5, 5, -5, 5, 0] : 0, // Shake effect on interference
                        }}
                        exit={{ scale: 1.5, opacity: 0, filter: 'blur(20px)' }}
                        transition={{ duration: 0.3 }}
                        className="text-7xl md:text-9xl font-black tracking-tighter"
                        style={{
                            color: stimulus.displayColor,
                            textShadow: `0 0 30px ${stimulus.displayColor}80`
                        }}
                    >
                        {stimulus.emotionalWord}
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Color Options */}
            <div className="grid grid-cols-3 md:grid-cols-6 gap-4 w-full max-w-3xl">
                {COLOR_NAMES.map((color) => (
                    <motion.button
                        key={color}
                        whileHover={{ scale: 1.1, y: -5 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleChoice(color)}
                        className="flex flex-col items-center gap-3 group"
                    >
                        <div
                            className="w-16 h-16 rounded-2xl shadow-lg transition-all duration-300 group-hover:shadow-[0_0_20px_currentColor]"
                            style={{ backgroundColor: COLOR_MAP[color], color: COLOR_MAP[color] }}
                        />
                        <span className="text-sm font-mono text-neural-muted uppercase group-hover:text-white transition-colors">
                            {color}
                        </span>
                    </motion.button>
                ))}
            </div>
        </div>
    );
};
