'use client';

import { useState, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useTestStore } from '../../store/useTestStore';
import { LOGIC_PUZZLES, VISUAL_PUZZLES } from '../../data/testContent';
import { GlassCard } from '../ui/GlassCard';
import { cn } from '../../lib/utils';
import { VisualPattern, renderShape } from './VisualPattern';

export const MatrixStage = () => {
    const { recordResponse, nextStage, currentStage, addXp, stages } = useTestStore();
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [startTime] = useState(Date.now());
    const controls = useAnimation();

    const stageDef = stages[currentStage];
    // Try to find in both collections dynamically
    const textPuzzle = LOGIC_PUZZLES.find(p => p.id === stageDef?.contentId);
    const visualPuzzle = VISUAL_PUZZLES.find(p => p.id === stageDef?.contentId);
    const puzzle = textPuzzle || visualPuzzle;
    const isVisual = !!visualPuzzle;

    // Neural Decay Effect: Random glitches
    useEffect(() => {
        const glitchInterval = setInterval(() => {
            if (Math.random() > 0.7) { // 30% chance per interval
                controls.start({
                    x: [0, -2, 2, -1, 0],
                    filter: ["blur(0px)", "blur(2px)", "blur(0px)"],
                    opacity: [1, 0.9, 1],
                    transition: { duration: 0.2 }
                });
            }
        }, 3000);

        return () => clearInterval(glitchInterval);
    }, [controls]);

    const handleChoice = (index: number) => {
        if (!puzzle) return;
        setSelectedOption(index);

        const isCorrect = index === puzzle.correctIndex;
        if (isCorrect) addXp(50);

        // Small delay for visual feedback
        setTimeout(() => {
            recordResponse({
                choice: index,
                latency_ms: Date.now() - startTime,
                accuracy: isCorrect
            });
            nextStage();
        }, 500);
    };

    if (!puzzle) return <div>Loading puzzle...</div>;

    return (
        <div className="w-full max-w-4xl mx-auto flex flex-col gap-8">
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-3xl font-display font-bold text-white mb-2">Logic Protocol</h2>
                    <p className="text-neural-muted">Analyze the pattern and deduce the correct output.</p>
                </div>
                <div className="text-neon-teal font-mono text-sm">
                    SEQUENCE: {currentStage}/15
                </div>
            </div>

            <motion.div animate={controls}>
                <GlassCard className="p-8 md:p-12 flex flex-col gap-8 items-center bg-neural-card relative overflow-hidden">
                    {/* Decay Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-neon-teal/5 to-transparent opacity-0 animate-pulse pointer-events-none" />

                    <h3 className="text-xl md:text-2xl text-center font-medium leading-relaxed text-white/90 relative z-10">
                        {puzzle.question}
                    </h3>

                    {isVisual && visualPuzzle && (
                        <VisualPattern type={visualPuzzle.type} shapes={visualPuzzle.shapes} />
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full relative z-10">
                        {puzzle.options.map((option, index) => (
                            <motion.button
                                key={index}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => handleChoice(index)}
                                className={cn(
                                    "p-6 rounded-xl border transition-all duration-300 text-left relative overflow-hidden group flex items-center gap-4",
                                    selectedOption === index
                                        ? "border-neon-teal bg-neon-teal/10 shadow-[0_0_15px_rgba(34,211,238,0.3)]"
                                        : "border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20"
                                )}
                            >
                                <div className={cn(
                                    "w-8 h-8 rounded-full border flex-shrink-0 flex items-center justify-center text-sm font-mono transition-colors",
                                    selectedOption === index ? "border-neon-teal text-neon-teal" : "border-white/20 text-white/40 group-hover:border-white/40 group-hover:text-white/60"
                                )}>
                                    {String.fromCharCode(65 + index)}
                                </div>

                                {isVisual ? (
                                    <div className="w-12 h-12 flex items-center justify-center">
                                        {renderShape(option)}
                                    </div>
                                ) : (
                                    <span className={cn(
                                        "text-lg transition-colors",
                                        selectedOption === index ? "text-white" : "text-white/70 group-hover:text-white"
                                    )}>
                                        {option}
                                    </span>
                                )}
                            </motion.button>
                        ))}
                    </div>
                </GlassCard>
            </motion.div>
        </div>
    );
};
