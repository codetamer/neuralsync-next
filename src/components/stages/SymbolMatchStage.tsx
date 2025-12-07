'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTestStore } from '../../store/useTestStore';
import { NeonButton } from '../ui/NeonButton';
import { GlassCard } from '../ui/GlassCard';
import { audio } from '../../engine/AudioEngine';
import { Zap, ArrowRight, Timer } from 'lucide-react';

// Symbol set for matching
const SYMBOLS = ['◆', '◇', '●', '○', '■', '□', '▲', '△', '★', '☆', '♠', '♣', '♥', '♦', '⬟', '⬡'];

export const SymbolMatchStage = () => {
    const { recordResponse, nextStage } = useTestStore();

    // Game state
    const [phase, setPhase] = useState<'instructions' | 'playing' | 'complete'>('instructions');
    const [targetSymbol, setTargetSymbol] = useState('');
    const [gridSymbols, setGridSymbols] = useState<string[]>([]);
    const [matchPosition, setMatchPosition] = useState(-1);
    const [trial, setTrial] = useState(0);
    const [score, setScore] = useState(0);
    const [reactionTimes, setReactionTimes] = useState<number[]>([]);
    const [trialStartTime, setTrialStartTime] = useState(0);
    const [timeRemaining, setTimeRemaining] = useState(60); // 60 second time limit
    const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);

    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const MAX_TRIALS = 30;

    // Generate a new trial
    const generateTrial = useCallback(() => {
        // Pick random target
        const target = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
        setTargetSymbol(target);

        // Generate grid with one match
        const grid: string[] = [];
        const matchPos = Math.floor(Math.random() * 9);

        for (let i = 0; i < 9; i++) {
            if (i === matchPos) {
                grid.push(target);
            } else {
                // Pick different symbol
                let sym: string;
                do {
                    sym = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
                } while (sym === target || grid.includes(sym));
                grid.push(sym);
            }
        }

        setGridSymbols(grid);
        setMatchPosition(matchPos);
        setTrialStartTime(Date.now());
        setFeedback(null);
    }, []);

    // Finish game
    const finishGame = useCallback(() => {
        if (timerRef.current) {
            clearInterval(timerRef.current);
        }
        setPhase('complete');

        // Calculate metrics
        const avgRT = reactionTimes.length > 0
            ? reactionTimes.reduce((a, b) => a + b, 0) / reactionTimes.length
            : 0;
        const accuracy = score / trial;

        // Processing speed score: items correct in time limit
        recordResponse({
            choice: score, // Number correct
            latency_ms: Math.round(avgRT),
            accuracy: accuracy > 0.7
        });

        setTimeout(nextStage, 2500);
    }, [reactionTimes, score, trial, recordResponse, nextStage]);

    // Start game
    const startGame = useCallback(() => {
        setPhase('playing');
        setTrial(1);
        generateTrial();
        setTimeRemaining(60);

        // Start countdown timer
        if (timerRef.current) clearInterval(timerRef.current);

        timerRef.current = setInterval(() => {
            setTimeRemaining(prev => {
                if (prev <= 1) {
                    // Don't call finishGame here directly to avoid render cycle issues
                    // We handle this in useEffect
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    }, [generateTrial]);

    // Watch for time end
    useEffect(() => {
        if (phase === 'playing' && timeRemaining === 0) {
            finishGame();
        }
    }, [timeRemaining, phase, finishGame]);

    // Handle symbol click
    const handleSymbolClick = (index: number) => {
        if (phase !== 'playing' || feedback !== null) return;

        const rt = Date.now() - trialStartTime;

        if (index === matchPosition) {
            // Correct!
            audio.playSuccess();
            setScore(prev => prev + 1);
            setReactionTimes(prev => [...prev, rt]);
            setFeedback('correct');
        } else {
            // Wrong
            audio.playError();
            setFeedback('wrong');
        }

        // Next trial after brief feedback
        setTimeout(() => {
            if (trial >= MAX_TRIALS) {
                finishGame();
            } else {
                setTrial(prev => prev + 1);
                generateTrial();
            }
        }, 300);
    };

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, []);

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
                        <div className="w-16 h-16 mx-auto bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-2xl flex items-center justify-center">
                            <Zap className="w-8 h-8 text-yellow-400" />
                        </div>

                        <h2 className="text-2xl font-bold text-white">Symbol Matching</h2>

                        <div className="text-white/70 space-y-4 text-left max-w-md mx-auto">
                            <p>A target symbol will appear at the top of the screen.</p>
                            <p>Find and click the <span className="text-neon-cyan font-semibold">matching symbol</span> in the grid below as quickly as possible.</p>
                            <p>You have <span className="text-yellow-400 font-semibold">60 seconds</span> to complete as many as you can.</p>
                        </div>

                        <div className="flex justify-center">
                            <NeonButton onClick={startGame}>
                                Start <ArrowRight className="w-4 h-4 ml-2" />
                            </NeonButton>
                        </div>
                    </motion.div>
                )}

                {/* Playing */}
                {phase === 'playing' && (
                    <motion.div
                        key="playing"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="space-y-6"
                    >
                        {/* Header with timer */}
                        <div className="flex justify-between items-center">
                            <div className="text-white/50">
                                Trial {trial}/{MAX_TRIALS}
                            </div>
                            <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${timeRemaining <= 10 ? 'bg-red-500/20 text-red-400' : 'bg-white/10 text-white'
                                }`}>
                                <Timer className="w-4 h-4" />
                                <span className="font-mono font-bold">{timeRemaining}s</span>
                            </div>
                            <div className="text-neon-cyan">
                                Score: {score}
                            </div>
                        </div>

                        {/* Target symbol */}
                        <div className="text-center">
                            <div className="text-white/50 text-sm mb-2">Find this symbol:</div>
                            <div className="text-6xl font-bold text-neon-cyan animate-pulse">
                                {targetSymbol}
                            </div>
                        </div>

                        {/* Symbol grid */}
                        <div className="grid grid-cols-3 gap-3 max-w-xs mx-auto">
                            {gridSymbols.map((symbol, idx) => (
                                <motion.button
                                    key={`${trial}-${idx}`}
                                    onClick={() => handleSymbolClick(idx)}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className={`aspect-square text-4xl rounded-xl border-2 transition-all ${feedback === 'correct' && idx === matchPosition
                                        ? 'bg-green-500/20 border-green-500'
                                        : feedback === 'wrong' && idx !== matchPosition
                                            ? 'bg-red-500/10 border-red-500/30'
                                            : 'bg-white/5 border-white/20 hover:border-white/40 hover:bg-white/10'
                                        }`}
                                >
                                    {symbol}
                                </motion.button>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* Complete */}
                {phase === 'complete' && (
                    <motion.div
                        key="complete"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center space-y-6"
                    >
                        <div className="w-20 h-20 mx-auto bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-full flex items-center justify-center">
                            <Zap className="w-10 h-10 text-yellow-400" />
                        </div>

                        <div>
                            <div className="text-2xl font-bold text-white">Task Complete</div>
                            <div className="text-yellow-400 text-lg mt-2">
                                Correct: {score}/{trial}
                            </div>
                            <div className="text-white/50 mt-1">
                                Avg. Reaction Time: {reactionTimes.length > 0
                                    ? Math.round(reactionTimes.reduce((a, b) => a + b, 0) / reactionTimes.length)
                                    : 0}ms
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </GlassCard>
    );
};
