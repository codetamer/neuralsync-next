'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTestStore } from '../../store/useTestStore';
import { NeonButton } from '../ui/NeonButton';
import { GlassCard } from '../ui/GlassCard';
import { audio } from '../../engine/AudioEngine';
import { Grid3X3, ArrowRight, Check, X, RotateCcw } from 'lucide-react';

interface SpatialSpanStageProps {
    mode?: 'forward' | 'backward';
}

const GRID_SIZE = 9;

export const SpatialSpanStage = ({ mode = 'forward' }: SpatialSpanStageProps) => {
    const { recordResponse, nextStage } = useTestStore();

    // Game state
    const [phase, setPhase] = useState<'instructions' | 'display' | 'recall' | 'feedback' | 'complete'>('instructions');
    const [sequence, setSequence] = useState<number[]>([]);
    const [userSequence, setUserSequence] = useState<number[]>([]);
    const [displayIndex, setDisplayIndex] = useState(-1);
    const [activeBlock, setActiveBlock] = useState<number | null>(null);
    const [spanLength, setSpanLength] = useState(3);
    const [trial, setTrial] = useState(1);
    const [maxSpan, setMaxSpan] = useState(0);
    const [correctTrials, setCorrectTrials] = useState(0);
    const [consecutiveErrors, setConsecutiveErrors] = useState(0);
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
    const [startTime, setStartTime] = useState(Date.now());
    const [allResults, setAllResults] = useState<{ length: number; correct: boolean }[]>([]);

    useEffect(() => {
        setStartTime(Date.now());
    }, [mode]);

    const MAX_TRIALS = 14;
    const MAX_SPAN = 9;

    // Generate random sequence without immediate repeats
    const generateSequence = useCallback((length: number): number[] => {
        const seq: number[] = [];
        while (seq.length < length) {
            const block = Math.floor(Math.random() * GRID_SIZE);
            if (seq.length === 0 || block !== seq[seq.length - 1]) {
                seq.push(block);
            }
        }
        return seq;
    }, []);

    const startTrial = useCallback(() => {
        const newSeq = generateSequence(spanLength);
        setSequence(newSeq);
        setUserSequence([]);
        setDisplayIndex(0);
        setIsCorrect(null);
        setPhase('display');
    }, [spanLength, generateSequence]);

    // Handle display animation
    useEffect(() => {
        if (phase !== 'display') return;

        if (displayIndex < sequence.length) {
            const timer1 = setTimeout(() => {
                const block = sequence[displayIndex];
                setActiveBlock(block);
                audio.playClick(); // Or a custom tone

                const timer2 = setTimeout(() => {
                    setActiveBlock(null);
                    const timer3 = setTimeout(() => {
                        setDisplayIndex(prev => prev + 1);
                    }, 200); // 200ms gap
                    return () => clearTimeout(timer3);
                }, 800); // 800ms display time
                return () => clearTimeout(timer2);
            }, 100);
            return () => clearTimeout(timer1);
        } else {
            // Sequence finished
            const timerEnd = setTimeout(() => {
                setPhase('recall');
            }, 500);
            return () => clearTimeout(timerEnd);
        }
    }, [phase, displayIndex, sequence]);

    const handleBlockClick = (blockIndex: number) => {
        if (phase !== 'recall') return;

        // Visual feedback
        audio.playClick();
        setActiveBlock(blockIndex);
        setTimeout(() => setActiveBlock(null), 150);

        const newUserSeq = [...userSequence, blockIndex];
        setUserSequence(newUserSeq);

        // Check if sequence length reached
        if (newUserSeq.length === sequence.length) {
            checkAnswer(newUserSeq);
        }
    };

    const checkAnswer = (userSeq: number[]) => {
        const target = mode === 'backward' ? [...sequence].reverse() : sequence;
        const correct = userSeq.every((block, idx) => block === target[idx]);

        setIsCorrect(correct);
        setAllResults(prev => [...prev, { length: spanLength, correct }]);

        if (correct) {
            audio.playSuccess();
            setCorrectTrials(prev => prev + 1);
            setConsecutiveErrors(0);
            if (spanLength > maxSpan) setMaxSpan(spanLength);
        } else {
            audio.playError();
            setConsecutiveErrors(prev => prev + 1);
        }
        setPhase('feedback');
    };

    const handleContinue = () => {
        const newTrial = trial + 1;
        // Termination logic
        if (newTrial > MAX_TRIALS || consecutiveErrors >= 2) {
            finishTask();
            return;
        }

        // Adaptive difficulty: Increase span if last 2 trials at this length were correct? 
        // Standard rule: 2 trials per span length. If both correct (or 1?), increase. 
        // Let's stick to strict: Increase span if correct? Or every 2 trials?
        // Simple logic for app: If correct, same length or increase?
        // Standard WAIS: 2 trials at each span. If fail both, stop. 
        // Implementation here: We increase span if we have enough success history.

        const recentResults = allResults.filter(r => r.length === spanLength);
        const recentCorrect = recentResults.filter(r => r.correct).length;

        // If we have 2 trials at this len, and at least 1 was correct -> Increase
        // If we have 2 trials and 0 correct -> Stop (caught by consecutiveErrors logic above)

        let nextSpan = spanLength;
        if (recentResults.length >= 2 && recentCorrect >= 1) {
            nextSpan = Math.min(spanLength + 1, MAX_SPAN);
        }

        setSpanLength(nextSpan);
        setTrial(newTrial);
        startTrial();
    };

    const finishTask = () => {
        setPhase('complete');
        const accuracy = correctTrials / (allResults.length || 1);
        recordResponse({
            choice: maxSpan,
            latency_ms: Date.now() - startTime,
            accuracy: accuracy > 0.5 // Pass if decent accuracy?
        });
        setTimeout(nextStage, 2500);
    };

    return (
        <GlassCard className="max-w-xl mx-auto p-6 md:p-8 flex flex-col items-center justify-center min-h-[500px]">
            <AnimatePresence mode="wait">
                {/* INSTRUCTIONS */}
                {phase === 'instructions' && (
                    <motion.div
                        key="instructions"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="text-center space-y-8"
                    >
                        <div className="w-20 h-20 bg-neon-purple/10 rounded-full flex items-center justify-center mx-auto ring-1 ring-neon-purple/30">
                            <Grid3X3 className="w-10 h-10 text-neon-purple" />
                        </div>
                        <div className="space-y-4">
                            <h2 className="text-3xl font-bold text-white tracking-tight">
                                Spatial Span {mode === 'backward' && '(Reverse)'}
                            </h2>
                            <p className="text-white/60 max-w-sm mx-auto leading-relaxed">
                                Observe the sequence of lighting blocks.
                                {mode === 'backward'
                                    ? ' Repeat the pattern in reverse order.'
                                    : ' Repeat the pattern in the exact order.'}
                            </p>
                        </div>
                        <div className="flex justify-center">
                            <NeonButton onClick={startTrial} size="lg">
                                START SEQUENCE
                            </NeonButton>
                        </div>
                    </motion.div>
                )}

                {/* GAME GRID */}
                {(phase === 'display' || phase === 'recall') && (
                    <motion.div
                        key="game"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="w-full max-w-sm mx-auto space-y-8"
                    >
                        <div className="flex justify-between items-center text-xs font-mono tracking-widest text-white/40 uppercase">
                            <span>Length: {spanLength}</span>
                            <span>Trial: {trial}</span>
                        </div>

                        {/* 3x3 Grid */}
                        <div className="grid grid-cols-3 gap-3 md:gap-4 aspect-square">
                            {Array.from({ length: GRID_SIZE }).map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => handleBlockClick(i)}
                                    onMouseEnter={() => audio.playHover()}
                                    disabled={phase !== 'recall'}
                                    className={`
                                        relative rounded-xl border transition-all duration-200
                                        ${activeBlock === i
                                            ? 'bg-neon-cyan border-neon-cyan shadow-[0_0_30px_rgba(34,211,238,0.6)] z-10 scale-105'
                                            : phase === 'recall'
                                                ? 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20 hover:scale-[1.02] active:scale-95 cursor-pointer'
                                                : 'bg-white/5 border-white/5 cursor-default'
                                        }
                                    `}
                                >
                                    {/* Inner dot for subtle detail */}
                                    <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full transition-colors duration-300 ${activeBlock === i ? 'bg-white' : 'bg-white/5'}`} />
                                </button>
                            ))}
                        </div>

                        <div className="h-6 flex justify-center items-center">
                            <span className="text-sm font-medium text-white/50 animate-pulse">
                                {phase === 'display' ? 'WATCH SEQUENCE' : 'YOUR TURN'}
                            </span>
                        </div>
                    </motion.div>
                )}

                {/* FEEDBACK */}
                {phase === 'feedback' && (
                    <motion.div
                        key="feedback"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.05 }}
                        className="text-center flex flex-col items-center gap-6"
                    >
                        <div className={`w-24 h-24 rounded-full flex items-center justify-center ring-4 ${isCorrect ? 'bg-neon-green/10 ring-neon-green/30' : 'bg-neon-red/10 ring-neon-red/30'}`}>
                            {isCorrect ? (
                                <Check className="w-12 h-12 text-neon-green" />
                            ) : (
                                <X className="w-12 h-12 text-neon-red" />
                            )}
                        </div>

                        <div className="space-y-1">
                            <h3 className={`text-2xl font-bold ${isCorrect ? 'text-neon-green' : 'text-neon-red'}`}>
                                {isCorrect ? 'SEQUENCE CORRECT' : 'SEQUENCE FAILED'}
                            </h3>
                            <p className="text-white/50">
                                {isCorrect ? `Completed length ${spanLength}` : 'Pattern mismatch'}
                            </p>
                        </div>

                        <NeonButton onClick={handleContinue} className="mt-4">
                            CONTINUE <ArrowRight className="w-4 h-4 ml-2" />
                        </NeonButton>
                    </motion.div>
                )}

                {/* COMPLETE */}
                {phase === 'complete' && (
                    <motion.div
                        key="complete"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center space-y-6"
                    >
                        <div className="w-24 h-24 bg-neon-cyan/10 rounded-full flex items-center justify-center mx-auto ring-1 ring-neon-cyan/30 mb-8">
                            <Grid3X3 className="w-12 h-12 text-neon-cyan" />
                        </div>
                        <div>
                            <div className="text-sm text-neon-cyan font-mono tracking-widest uppercase mb-2">Assessment Complete</div>
                            <div className="text-4xl font-bold text-white mb-2">{maxSpan}</div>
                            <div className="text-white/40">Max Span Capacity</div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </GlassCard>
    );
};
