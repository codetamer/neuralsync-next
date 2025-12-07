'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useTestStore } from '../../store/useTestStore';
import { MATRIX_PUZZLES } from '../../data/matrixContent';
import { LOGIC_PUZZLES, VISUAL_PUZZLES } from '../../data/testContent';
import { MatrixRenderer } from '../matrix/MatrixRenderer';
import { GlassCard } from '../ui/GlassCard';
import { cn } from '../../lib/utils';
import { VisualPattern, renderShape } from './VisualPattern';
import { Clock, Brain, Zap } from 'lucide-react';
import type { MatrixPuzzle } from '../../types/matrix';

// ============================================================================
// ENHANCED MATRIX STAGE
// ============================================================================

export const MatrixStageEnhanced = () => {
    const { recordResponse, nextStage, currentStage, addXp, stages } = useTestStore();
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [showFeedback, setShowFeedback] = useState(false);
    const [startTime, setStartTime] = useState(Date.now());
    const [elapsedTime, setElapsedTime] = useState(0);

    // Reset timer on stage change
    useEffect(() => {
        setStartTime(Date.now());
    }, [currentStage]);
    const controls = useAnimation();

    const stageDef = stages[currentStage];

    // Determine puzzle type: new visual matrix vs legacy
    const puzzleData = useMemo(() => {
        if (!stageDef?.contentId) return null;

        // Check new matrix puzzles first
        const newMatrixPuzzle = MATRIX_PUZZLES.find(p => p.id === stageDef.contentId);
        if (newMatrixPuzzle) {
            return { type: 'new_matrix' as const, puzzle: newMatrixPuzzle };
        }

        // Fall back to legacy puzzles
        const logicPuzzle = LOGIC_PUZZLES.find(p => p.id === stageDef.contentId);
        if (logicPuzzle) {
            return { type: 'logic' as const, puzzle: logicPuzzle };
        }

        const visualPuzzle = VISUAL_PUZZLES.find(p => p.id === stageDef.contentId);
        if (visualPuzzle) {
            return { type: 'visual' as const, puzzle: visualPuzzle };
        }

        // Default to random new matrix puzzle based on difficulty
        const difficultyTarget = stageDef.difficulty || 5;
        const candidates = MATRIX_PUZZLES.filter(p =>
            Math.abs(p.difficulty - difficultyTarget) <= 2
        );
        const randomPuzzle = candidates[Math.floor(Math.random() * candidates.length)] || MATRIX_PUZZLES[0];
        return { type: 'new_matrix' as const, puzzle: randomPuzzle };

    }, [stageDef]);

    // Timer
    useEffect(() => {
        const timer = setInterval(() => {
            setElapsedTime(Date.now() - startTime);
        }, 100);
        return () => clearInterval(timer);
    }, [startTime]);

    // Neural Decay Effect
    useEffect(() => {
        const glitchInterval = setInterval(() => {
            if (Math.random() > 0.8) {
                controls.start({
                    x: [0, -2, 2, -1, 0],
                    filter: ["blur(0px)", "blur(1px)", "blur(0px)"],
                    transition: { duration: 0.15 }
                });
            }
        }, 4000);
        return () => clearInterval(glitchInterval);
    }, [controls]);

    const handleChoice = (index: number) => {
        if (!puzzleData || showFeedback) return;
        setSelectedOption(index);

        const isCorrect = index === puzzleData.puzzle.correctIndex;

        // Show brief feedback for new matrix puzzles
        if (puzzleData.type === 'new_matrix') {
            setShowFeedback(true);
            if (isCorrect) addXp(75); // Higher XP for visual matrices

            setTimeout(() => {
                recordResponse({
                    choice: index,
                    latency_ms: Date.now() - startTime,
                    accuracy: isCorrect
                });
                setShowFeedback(false);
                setSelectedOption(null);
                nextStage();
            }, 1500); // Show feedback longer for learning
        } else {
            if (isCorrect) addXp(50);

            setTimeout(() => {
                recordResponse({
                    choice: index,
                    latency_ms: Date.now() - startTime,
                    accuracy: isCorrect
                });
                nextStage();
            }, 400);
        }
    };

    if (!puzzleData) {
        return (
            <div className="w-full max-w-4xl mx-auto flex items-center justify-center h-64">
                <div className="text-neural-muted animate-pulse">Loading puzzle...</div>
            </div>
        );
    }

    const { type, puzzle } = puzzleData;

    return (
        <div className="w-full max-w-2xl mx-auto flex flex-col gap-3">
            {/* Header */}
            <div className="flex justify-between items-end px-2">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <Brain className="w-4 h-4 text-neon-cyan" />
                        <h2 className="text-xl font-display font-bold text-white">
                            {type === 'new_matrix' ? 'Pattern Analysis' : 'Logic Protocol'}
                        </h2>
                    </div>
                    <p className="text-neural-muted text-xs">
                        {type === 'new_matrix'
                            ? 'Identify the pattern and select the missing piece'
                            : 'Analyze the pattern and deduce the correct output'}
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    {/* Difficulty indicator */}
                    <div className="flex items-center gap-1">
                        {Array.from({ length: 10 }, (_, i) => (
                            <div
                                key={i}
                                className={cn(
                                    "w-1 h-3 rounded-full transition-colors",
                                    i < puzzle.difficulty
                                        ? "bg-neon-cyan"
                                        : "bg-white/10"
                                )}
                            />
                        ))}
                    </div>
                    {/* Timer */}
                    <div className="flex items-center gap-1 text-neural-muted text-xs font-mono">
                        <Clock className="w-3 h-3" />
                        {Math.floor(elapsedTime / 1000)}s
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <motion.div animate={controls}>
                {type === 'new_matrix' ? (
                    // New Visual Matrix Renderer
                    <GlassCard className="p-4 bg-neural-card relative overflow-hidden">
                        <MatrixRenderer
                            puzzle={puzzle as MatrixPuzzle}
                            selectedIndex={selectedOption}
                            onSelect={handleChoice}
                            showFeedback={showFeedback}
                            isCorrect={selectedOption === puzzle.correctIndex}
                        />
                    </GlassCard>
                ) : (
                    // Legacy Logic/Visual Puzzle Renderer
                    <GlassCard className="p-6 flex flex-col gap-4 items-center bg-neural-card relative overflow-hidden">
                        <h3 className="text-lg md:text-xl text-center font-medium leading-relaxed text-white/90">
                            {puzzle.question}
                        </h3>

                        {type === 'visual' && 'shapes' in puzzle && (
                            <VisualPattern type={(puzzle as any).type} shapes={(puzzle as any).shapes} />
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full">
                            {puzzle.options.map((option: string, index: number) => (
                                <motion.button
                                    key={index}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => handleChoice(index)}
                                    className={cn(
                                        "p-3 rounded-xl border transition-all duration-300 text-left relative overflow-hidden group flex items-center gap-3",
                                        selectedOption === index
                                            ? "border-neon-cyan bg-neon-cyan/10 shadow-[0_0_15px_rgba(34,211,238,0.3)]"
                                            : "border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20"
                                    )}
                                >
                                    <div className={cn(
                                        "w-6 h-6 rounded-full border flex-shrink-0 flex items-center justify-center text-xs font-mono transition-colors",
                                        selectedOption === index
                                            ? "border-neon-cyan text-neon-cyan"
                                            : "border-white/20 text-white/40 group-hover:border-white/40"
                                    )}>
                                        {String.fromCharCode(65 + index)}
                                    </div>

                                    {type === 'visual' ? (
                                        <div className="w-8 h-8 flex items-center justify-center">
                                            {renderShape(option)}
                                        </div>
                                    ) : (
                                        <span className={cn(
                                            "text-base transition-colors",
                                            selectedOption === index
                                                ? "text-white"
                                                : "text-white/70 group-hover:text-white"
                                        )}>
                                            {option}
                                        </span>
                                    )}
                                </motion.button>
                            ))}
                        </div>
                    </GlassCard>
                )}
            </motion.div>

            {/* Progress indicator */}
            <div className="flex items-center justify-center gap-2">
                <Zap className="w-3 h-3 text-neon-cyan" />
                <span className="text-[10px] text-neural-muted font-mono">
                    PATTERN {Math.min(currentStage + 1, 15)} OF 15
                </span>
            </div>
        </div>
    );
};

export default MatrixStageEnhanced;
