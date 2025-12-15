'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTestStore } from '../../store/useTestStore';
import { NeonButton } from '../ui/NeonButton';
import { GlassCard } from '../ui/GlassCard';
import { audio } from '../../engine/AudioEngine';
import { Timer, ArrowRight, ArrowLeft, Circle } from 'lucide-react';

type RTMode = 'simple' | 'choice';

interface ReactionTimeStageProps {
    mode?: RTMode;
}

export const ReactionTimeStage = ({ mode = 'simple' }: ReactionTimeStageProps) => {
    const { recordResponse, nextStage } = useTestStore();

    // Game state
    const [phase, setPhase] = useState<'instructions' | 'waiting' | 'ready' | 'tooEarly' | 'result' | 'complete'>('instructions');
    const [trial, setTrial] = useState(0);
    const [reactionTimes, setReactionTimes] = useState<number[]>([]);
    const [currentRT, setCurrentRT] = useState(0);
    const [targetDirection, setTargetDirection] = useState<'left' | 'right' | null>(null);
    const stimulusTime = useRef(0);
    const taskStartTimeRef = useRef(0);

    const waitTimerRef = useRef<NodeJS.Timeout | null>(null);
    const TOTAL_TRIALS = 5;

    // Start a trial
    const startTrial = useCallback(() => {
        // Track task start time on first trial
        if (taskStartTimeRef.current === 0) {
            taskStartTimeRef.current = Date.now();
        }
        setPhase('waiting');
        setTargetDirection(null);

        // Random wait 1-4 seconds
        const waitTime = 1000 + Math.random() * 3000;

        waitTimerRef.current = setTimeout(() => {
            // Show stimulus
            if (mode === 'choice') {
                setTargetDirection(Math.random() < 0.5 ? 'left' : 'right');
            }
            // Just trigger the phase change, timing handled in effect
            setPhase('ready');
        }, waitTime);
    }, [mode]);

    // Capture the exact time the "ready" phase is painted
    useEffect(() => {
        if (phase === 'ready') {
            // This runs after the render happens, clearer to what user sees
            stimulusTime.current = performance.now();
            audio.playClick();
        }
    }, [phase]);

    // Handle response
    const handleResponse = (direction?: 'left' | 'right') => {
        if (phase === 'waiting') {
            // Too early!
            if (waitTimerRef.current) clearTimeout(waitTimerRef.current);
            audio.playError();
            setPhase('tooEarly');
            return;
        }

        if (phase !== 'ready') return;

        const rt = performance.now() - stimulusTime.current;

        // For choice RT, check if correct direction
        if (mode === 'choice' && direction !== targetDirection) {
            audio.playError();
            // Record as slow RT (penalty)
            setCurrentRT(rt + 500);
            setReactionTimes(prev => [...prev, rt + 500]);
        } else {
            audio.playSuccess();
            setCurrentRT(rt);
            setReactionTimes(prev => [...prev, rt]);
        }

        setPhase('result');
    };

    // Handle keypress for choice RT
    useEffect(() => {
        if (mode !== 'choice' || (phase !== 'waiting' && phase !== 'ready')) return;

        const handleKey = (e: KeyboardEvent) => {
            if (e.key === 'ArrowLeft') {
                handleResponse('left');
            } else if (e.key === 'ArrowRight') {
                handleResponse('right');
            }
        };

        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, [mode, phase, handleResponse]);

    // Continue to next trial
    const continueToNext = () => {
        const newTrial = trial + 1;

        if (newTrial > TOTAL_TRIALS) {
            finishTask();
        } else {
            setTrial(newTrial);
            startTrial();
        }
    };

    // Finish task
    const finishTask = () => {
        setPhase('complete');

        // Remove outliers (too fast or too slow)
        const validRTs = reactionTimes.filter(rt => rt > 100 && rt < 2000);
        const avgRT = validRTs.length > 0
            ? validRTs.reduce((a, b) => a + b, 0) / validRTs.length
            : 500;

        recordResponse({
            choice: Math.round(avgRT), // Store avg RT as choice
            latency_ms: Date.now() - taskStartTimeRef.current, // Total stage time
            accuracy: true
        });

        setTimeout(nextStage, 2000);
    };

    // Cleanup
    useEffect(() => {
        return () => {
            if (waitTimerRef.current) clearTimeout(waitTimerRef.current);
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
                        <div className="w-16 h-16 mx-auto bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-2xl flex items-center justify-center">
                            <Timer className="w-8 h-8 text-green-400" />
                        </div>

                        <h2 className="text-2xl font-bold text-white">
                            {mode === 'choice' ? 'Choice Reaction Time' : 'Simple Reaction Time'}
                        </h2>

                        <div className="text-white/70 space-y-4 text-left max-w-md mx-auto">
                            {mode === 'simple' ? (
                                <>
                                    <p>Wait for the screen to turn <span className="text-green-400">green</span>.</p>
                                    <p>Click <span className="text-neon-cyan font-semibold">as fast as possible</span> when it changes.</p>
                                    <p>Don't click too early, or it won't count!</p>
                                </>
                            ) : (
                                <>
                                    <p>Wait for an arrow to appear.</p>
                                    <p>Press the <span className="text-neon-cyan font-semibold">matching arrow key</span> (← or →) as fast as possible.</p>
                                    <p>Wrong direction will add a penalty!</p>
                                </>
                            )}
                        </div>

                        <div className="flex justify-center">
                            <NeonButton onClick={() => { setTrial(1); startTrial(); }}>
                                Start <ArrowRight className="w-4 h-4 ml-2" />
                            </NeonButton>
                        </div>
                    </motion.div>
                )}

                {/* Active Trial (Waiting or Ready) */}
                {(phase === 'waiting' || phase === 'ready') && (
                    <motion.div
                        key="trial-active"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onPointerDown={mode === 'simple' ? () => handleResponse() : undefined}
                        className="text-center space-y-6 cursor-pointer touch-manipulation"
                    >
                        <div className="text-white/50 text-sm">Trial {trial}/{TOTAL_TRIALS}</div>

                        <div
                            className={`
                                h-64 flex items-center justify-center rounded-3xl border-2 transition-none select-none
                                ${phase === 'ready'
                                    ? 'bg-green-500 text-black border-green-400'
                                    : 'bg-red-500/10 text-red-400 border-red-500/30'
                                }
                            `}
                        >
                            {phase === 'ready' ? (
                                mode === 'simple' ? (
                                    <div className="text-4xl font-bold">CLICK!</div>
                                ) : (
                                    <div className="text-8xl">
                                        {targetDirection === 'left' ? '←' : '→'}
                                    </div>
                                )
                            ) : (
                                <div className="text-2xl font-bold">Wait...</div>
                            )}
                        </div>

                        {phase === 'waiting' && (
                            <div className="text-white/30 text-sm">
                                {mode === 'simple' ? 'Click when the box turns green' : 'Press arrow key when arrow appears'}
                            </div>
                        )}

                        {phase === 'ready' && mode === 'choice' && (
                            <div className="flex justify-center gap-4">
                                <button
                                    onPointerDown={(e) => { e.stopPropagation(); handleResponse('left'); }}
                                    onMouseEnter={() => audio.playHover()}
                                    className="px-8 py-4 bg-white/10 rounded-xl text-2xl hover:bg-white/20"
                                >
                                    ← Left
                                </button>
                                <button
                                    onPointerDown={(e) => { e.stopPropagation(); handleResponse('right'); }}
                                    onMouseEnter={() => audio.playHover()}
                                    className="px-8 py-4 bg-white/10 rounded-xl text-2xl hover:bg-white/20"
                                >
                                    Right →
                                </button>
                            </div>
                        )}
                    </motion.div>
                )}

                {/* Too Early */}
                {phase === 'tooEarly' && (
                    <motion.div
                        key="tooEarly"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center space-y-6"
                    >
                        <div className="h-64 flex items-center justify-center bg-yellow-500/10 rounded-3xl border-2 border-yellow-500/30">
                            <div className="text-yellow-400 text-2xl font-bold">
                                Too Early!
                            </div>
                        </div>

                        <NeonButton onClick={continueToNext}>
                            Try Again <ArrowRight className="w-4 h-4 ml-2" />
                        </NeonButton>
                    </motion.div>
                )}

                {/* Result */}
                {phase === 'result' && (
                    <motion.div
                        key="result"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center space-y-6"
                    >
                        <div className="text-white/50 text-sm">Trial {trial}/{TOTAL_TRIALS}</div>

                        <div className="h-64 flex flex-col items-center justify-center bg-neon-cyan/10 rounded-3xl border-2 border-neon-cyan/30">
                            <div className="text-neon-cyan text-5xl font-bold font-mono">
                                {currentRT.toFixed(2)}ms
                            </div>
                            <div className="text-white/50 mt-2">
                                {currentRT < 200 ? 'Incredible!' : currentRT < 300 ? 'Great!' : currentRT < 400 ? 'Good' : 'Keep trying'}
                            </div>
                        </div>

                        <NeonButton onClick={continueToNext}>
                            {trial >= TOTAL_TRIALS ? 'Finish' : 'Next'} <ArrowRight className="w-4 h-4 ml-2" />
                        </NeonButton>
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
                        <div className="w-20 h-20 mx-auto bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-full flex items-center justify-center">
                            <Timer className="w-10 h-10 text-green-400" />
                        </div>

                        <div>
                            <div className="text-2xl font-bold text-white">Task Complete</div>
                            <div className="text-green-400 text-lg mt-2 font-mono">
                                Average: {reactionTimes.length > 0
                                    ? Math.round(reactionTimes.reduce((a, b) => a + b, 0) / reactionTimes.length)
                                    : 0}ms
                            </div>
                            <div className="text-white/50 mt-1">
                                Best: {reactionTimes.length > 0 ? Math.min(...reactionTimes).toFixed(2) : 0}ms
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </GlassCard>
    );
};
