'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTestStore } from '../../store/useTestStore';
import { NeonButton } from '../ui/NeonButton';
import { GlassCard } from '../ui/GlassCard';
import { audio } from '../../engine/AudioEngine';
import { Brain, ArrowRight, RotateCcw, Check, X } from 'lucide-react';

interface DigitSpanStageProps {
    mode?: 'forward' | 'backward';
}

export const DigitSpanStage = ({ mode = 'forward' }: DigitSpanStageProps) => {
    const { recordResponse, nextStage } = useTestStore();

    // Game state
    const [phase, setPhase] = useState<'instructions' | 'display' | 'recall' | 'feedback' | 'complete'>('instructions');
    const [currentSequence, setCurrentSequence] = useState<number[]>([]);
    const [userInput, setUserInput] = useState<number[]>([]);
    const [sequenceIndex, setSequenceIndex] = useState(0);
    const [spanLength, setSpanLength] = useState(3); // Start with 3 digits
    const [trial, setTrial] = useState(1);
    const [correctTrials, setCorrectTrials] = useState(0);
    const [consecutiveErrors, setConsecutiveErrors] = useState(0);
    const [maxSpan, setMaxSpan] = useState(0);
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
    const [startTime] = useState(Date.now());
    const [allResults, setAllResults] = useState<{ length: number; correct: boolean }[]>([]);

    const MAX_TRIALS = 14; // 2 trials per span length (3-9)
    const MAX_SPAN = 9;

    // Generate a random sequence of digits
    const generateSequence = useCallback((length: number): number[] => {
        const digits: number[] = [];
        for (let i = 0; i < length; i++) {
            let digit: number;
            do {
                digit = Math.floor(Math.random() * 9) + 1; // 1-9
            } while (digits.length > 0 && digit === digits[digits.length - 1]); // No consecutive repeats
            digits.push(digit);
        }
        return digits;
    }, []);

    // Start displaying sequence
    const startTrial = useCallback(() => {
        const sequence = generateSequence(spanLength);
        setCurrentSequence(sequence);
        setUserInput([]);
        setSequenceIndex(0);
        setIsCorrect(null);
        setPhase('display');
    }, [spanLength, generateSequence]);

    // Display digits one at a time
    useEffect(() => {
        if (phase !== 'display') return;

        if (sequenceIndex < currentSequence.length) {
            const timer = setTimeout(() => {
                audio.playClick();
                setSequenceIndex(prev => prev + 1);
            }, 1000); // 1 second per digit
            return () => clearTimeout(timer);
        } else {
            // Done displaying, move to recall
            const timer = setTimeout(() => {
                setPhase('recall');
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [phase, sequenceIndex, currentSequence.length]);

    // Handle digit input
    const handleDigitClick = (digit: number) => {
        if (phase !== 'recall') return;

        audio.playClick();
        const newInput = [...userInput, digit];
        setUserInput(newInput);

        // Check if complete
        if (newInput.length === currentSequence.length) {
            checkAnswer(newInput);
        }
    };

    // Check if answer is correct
    const checkAnswer = (input: number[]) => {
        const target = mode === 'backward'
            ? [...currentSequence].reverse()
            : currentSequence;

        const correct = input.every((digit, idx) => digit === target[idx]);
        setIsCorrect(correct);
        setAllResults(prev => [...prev, { length: spanLength, correct }]);

        if (correct) {
            audio.playSuccess();
            setCorrectTrials(prev => prev + 1);
            setConsecutiveErrors(0);
            if (spanLength > maxSpan) {
                setMaxSpan(spanLength);
            }
        } else {
            audio.playError();
            setConsecutiveErrors(prev => prev + 1);
        }

        setPhase('feedback');
    };

    // Handle feedback and progression
    const handleContinue = () => {
        const newTrial = trial + 1;

        // Check termination conditions
        if (newTrial > MAX_TRIALS || consecutiveErrors >= 2 || spanLength > MAX_SPAN) {
            finishTask();
            return;
        }

        // Increase span after 2 correct at same length
        const trialsAtLength = allResults.filter(r => r.length === spanLength).length;
        const correctAtLength = allResults.filter(r => r.length === spanLength && r.correct).length;

        if (trialsAtLength >= 2 && correctAtLength >= 1) {
            setSpanLength(prev => Math.min(prev + 1, MAX_SPAN));
        }

        setTrial(newTrial);
        startTrial();
    };

    // Finish and record results
    const finishTask = () => {
        setPhase('complete');

        // Calculate d-prime-like score
        const totalCorrect = allResults.filter(r => r.correct).length;
        const accuracy = totalCorrect / allResults.length;

        recordResponse({
            choice: maxSpan, // Record max span as primary metric
            latency_ms: Date.now() - startTime,
            accuracy: accuracy > 0.5 // Consider successful if >50% correct
        });

        setTimeout(nextStage, 2000);
    };

    // Delete last digit
    const handleBackspace = () => {
        if (userInput.length > 0) {
            setUserInput(prev => prev.slice(0, -1));
        }
    };

    return (
        <GlassCard className="max-w-2xl mx-auto p-8">
            <AnimatePresence mode="wait">
                {/* Instructions */}
                {phase === 'instructions' && (
                    <motion.div
                        key="instructions"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="text-center space-y-6"
                    >
                        <div className="w-16 h-16 mx-auto bg-gradient-to-br from-neon-cyan/20 to-neon-purple/20 rounded-2xl flex items-center justify-center">
                            <Brain className="w-8 h-8 text-neon-cyan" />
                        </div>

                        <h2 className="text-2xl font-bold text-white">
                            Digit Span {mode === 'backward' ? '(Backward)' : '(Forward)'}
                        </h2>

                        <div className="text-white/70 space-y-4 text-left max-w-md mx-auto">
                            <p>You will see a sequence of digits, one at a time.</p>
                            <p>
                                {mode === 'backward'
                                    ? 'After the sequence ends, enter the digits in REVERSE order.'
                                    : 'After the sequence ends, enter the digits in the SAME order.'}
                            </p>
                            <p>The sequences will get longer as you progress.</p>
                        </div>

                        <div className="flex justify-center">
                            <NeonButton onClick={startTrial}>
                                Begin <ArrowRight className="w-4 h-4 ml-2" />
                            </NeonButton>
                        </div>
                    </motion.div>
                )}

                {/* Display Phase */}
                {phase === 'display' && (
                    <motion.div
                        key="display"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="text-center space-y-8"
                    >
                        <div className="text-white/50 text-sm">
                            Trial {trial} • Span {spanLength}
                        </div>

                        <div className="h-40 flex items-center justify-center">
                            <AnimatePresence mode="wait">
                                {sequenceIndex > 0 && sequenceIndex <= currentSequence.length && (
                                    <motion.div
                                        key={sequenceIndex}
                                        initial={{ scale: 0.5, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        exit={{ scale: 1.5, opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="text-8xl font-bold text-neon-cyan"
                                    >
                                        {currentSequence[sequenceIndex - 1]}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        <div className="text-white/30 text-sm">
                            Remember {mode === 'backward' ? 'in reverse order' : 'the order'}
                        </div>
                    </motion.div>
                )}

                {/* Recall Phase */}
                {phase === 'recall' && (
                    <motion.div
                        key="recall"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="space-y-6"
                    >
                        <div className="text-center">
                            <div className="text-white/50 text-sm mb-2">
                                Enter {spanLength} digits {mode === 'backward' ? '(backward)' : ''}
                            </div>

                            {/* User input display */}
                            <div className="flex justify-center gap-2 h-16 items-center">
                                {Array.from({ length: spanLength }).map((_, idx) => (
                                    <div
                                        key={idx}
                                        className={`w-12 h-12 rounded-lg border-2 flex items-center justify-center text-2xl font-bold transition-all ${idx < userInput.length
                                            ? 'border-neon-cyan bg-neon-cyan/10 text-neon-cyan'
                                            : 'border-white/20 text-white/30'
                                            }`}
                                    >
                                        {userInput[idx] || '_'}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Number pad */}
                        <div className="grid grid-cols-3 gap-3 max-w-xs mx-auto">
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(digit => (
                                <button
                                    key={digit}
                                    onClick={() => handleDigitClick(digit)}
                                    onMouseEnter={() => audio.playHover()}
                                    disabled={userInput.length >= spanLength}
                                    className="aspect-square text-2xl font-bold rounded-xl bg-white/5 border border-white/10 text-white hover:bg-neon-cyan/20 hover:border-neon-cyan/50 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                                >
                                    {digit}
                                </button>
                            ))}
                            <button
                                onClick={handleBackspace}
                                onMouseEnter={() => audio.playHover()}
                                className="aspect-square text-xl rounded-xl bg-white/5 border border-white/10 text-white/70 hover:bg-red-500/20 hover:border-red-500/50 transition-all flex items-center justify-center"
                            >
                                <RotateCcw className="w-5 h-5" />
                            </button>
                            <button
                                onClick={() => handleDigitClick(0)}
                                onMouseEnter={() => audio.playHover()}
                                disabled={userInput.length >= spanLength}
                                className="aspect-square text-2xl font-bold rounded-xl bg-white/5 border border-white/10 text-white hover:bg-neon-cyan/20 hover:border-neon-cyan/50 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                            >
                                0
                            </button>
                        </div>
                    </motion.div>
                )}

                {/* Feedback Phase */}
                {phase === 'feedback' && (
                    <motion.div
                        key="feedback"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        className="text-center space-y-6"
                    >
                        <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center ${isCorrect ? 'bg-green-500/20' : 'bg-red-500/20'
                            }`}>
                            {isCorrect ? (
                                <Check className="w-10 h-10 text-green-400" />
                            ) : (
                                <X className="w-10 h-10 text-red-400" />
                            )}
                        </div>

                        <div>
                            <div className={`text-2xl font-bold ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>
                                {isCorrect ? 'Correct!' : 'Incorrect'}
                            </div>
                            <div className="text-white/50 mt-2">
                                Sequence: {mode === 'backward'
                                    ? [...currentSequence].reverse().join(' → ')
                                    : currentSequence.join(' → ')}
                            </div>
                            <div className="text-white/30 mt-1">
                                Your answer: {userInput.join(' → ')}
                            </div>
                        </div>

                        <NeonButton onClick={handleContinue}>
                            Continue <ArrowRight className="w-4 h-4 ml-2" />
                        </NeonButton>
                    </motion.div>
                )}

                {/* Complete Phase */}
                {phase === 'complete' && (
                    <motion.div
                        key="complete"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center space-y-6"
                    >
                        <div className="w-20 h-20 mx-auto bg-gradient-to-br from-neon-cyan/20 to-neon-purple/20 rounded-full flex items-center justify-center">
                            <Brain className="w-10 h-10 text-neon-cyan" />
                        </div>

                        <div>
                            <div className="text-2xl font-bold text-white">Task Complete</div>
                            <div className="text-neon-cyan text-lg mt-2">
                                Maximum Span: {maxSpan} digits
                            </div>
                            <div className="text-white/50 mt-1">
                                Accuracy: {Math.round((correctTrials / allResults.length) * 100)}%
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </GlassCard>
    );
};
