'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTestStore, STAGE_DEFINITIONS } from '../../store/useTestStore';
import { LOGIC_PUZZLES } from '../../data/testContent';
import { GlassCard } from '../ui/GlassCard';
import { cn } from '../../lib/utils';

export const MatrixStage = () => {
    const { recordResponse, nextStage, currentStage, addXp } = useTestStore();
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [startTime] = useState(Date.now());

    const stageDef = STAGE_DEFINITIONS[currentStage];
    const puzzle = LOGIC_PUZZLES.find(p => p.id === stageDef.contentId);

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
                    SEQUENCE: {currentStage}/10
                </div>
            </div>

            <GlassCard className="p-8 md:p-12 flex flex-col gap-8 items-center bg-black/20">
                <h3 className="text-xl md:text-2xl text-center font-medium leading-relaxed text-white/90">
                    {puzzle.question}
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                    {puzzle.options.map((option, index) => (
                        <motion.button
                            key={index}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleChoice(index)}
                            className={cn(
                                "p-6 rounded-xl border transition-all duration-300 text-left relative overflow-hidden group",
                                selectedOption === index
                                    ? "border-neon-teal bg-neon-teal/10 shadow-[0_0_15px_rgba(34,211,238,0.3)]"
                                    : "border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20"
                            )}
                        >
                            <div className="flex items-center gap-4">
                                <div className={cn(
                                    "w-8 h-8 rounded-full border flex items-center justify-center text-sm font-mono transition-colors",
                                    selectedOption === index ? "border-neon-teal text-neon-teal" : "border-white/20 text-white/40 group-hover:border-white/40 group-hover:text-white/60"
                                )}>
                                    {String.fromCharCode(65 + index)}
                                </div>
                                <span className={cn(
                                    "text-lg transition-colors",
                                    selectedOption === index ? "text-white" : "text-white/70 group-hover:text-white"
                                )}>
                                    {option}
                                </span>
                            </div>
                        </motion.button>
                    ))}
                </div>
            </GlassCard>
        </div>
    );
};
