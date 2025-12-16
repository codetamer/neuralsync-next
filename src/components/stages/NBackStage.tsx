'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTestStore } from '../../store/useTestStore';
import { GlassCard } from '../ui/GlassCard';
import { NeonButton } from '../ui/NeonButton';
import { cn } from '../../lib/utils';
import { audio } from '../../engine/AudioEngine';
import { Brain, Zap, CheckCircle, XCircle, Timer, Activity, Database, AlertCircle } from 'lucide-react';

// ============================================================================
// N-BACK WORKING MEMORY TASK - Revamped Implementation
// ============================================================================

interface NBackConfig {
    nLevel: number;             // Dynamic N-back level (starts at 2)
    sequenceLength: number;     // Total items to show
    stimulusDuration: number;   // Ms to show each stimulus
    interStimulusInterval: number; // Ms between stimuli
    targetPercentage: number;   // % of items that are matches
}

interface NBackTrial {
    stimulus: string;
    isTarget: boolean;          // Is this a match with n-back?
    position: number;
}

interface NBackResult {
    hits: number;               // Correctly identified matches
    misses: number;             // Missed matches
    falseAlarms: number;        // Incorrectly pressed on non-match
    correctRejections: number;  // Correctly didn't press on non-match
    dPrime: number;             // Signal detection metric
    reactionTimes: number[];    // RT for hits
}

const LETTERS = ['A', 'B', 'C', 'D', 'E', 'H', 'J', 'K', 'L', 'M', 'O', 'P', 'R', 'S', 'T'];

const DEFAULT_CONFIG: NBackConfig = {
    nLevel: 2,
    sequenceLength: 24,         // Increased slightly for better data
    stimulusDuration: 1000,     // Faster pacing (1s show)
    interStimulusInterval: 1000, // 1s gap = 2s total cycle
    targetPercentage: 0.30,     // 30% targets
};

// ============================================================================
// COMPONENTS
// ============================================================================

const HexagonFrame = ({ children, active }: { children: React.ReactNode, active: boolean }) => (
    <div className="relative w-48 h-48 flex items-center justify-center">
        {/* Animated Hexagon Border */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
            <defs>
                <linearGradient id="hexGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.2" />
                    <stop offset="50%" stopColor="#818cf8" stopOpacity="0.5" />
                    <stop offset="100%" stopColor="#c084fc" stopOpacity="0.2" />
                </linearGradient>
            </defs>
            <motion.path
                d="M50 0 L93.3 25 L93.3 75 L50 100 L6.7 75 L6.7 25 Z"
                fill="none"
                stroke={active ? "url(#hexGradient)" : "rgba(255,255,255,0.1)"}
                strokeWidth={active ? "3" : "1"}
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1, ease: "easeInOut" }}
            />
            {active && (
                <motion.path
                    d="M50 0 L93.3 25 L93.3 75 L50 100 L6.7 75 L6.7 25 Z"
                    fill="none"
                    stroke="#22d3ee"
                    strokeWidth="2"
                    strokeDasharray="10 10"
                    initial={{ strokeDashoffset: 0 }}
                    animate={{ strokeDashoffset: 100 }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                />
            )}
        </svg>

        {/* Content */}
        <div className="relative z-10 text-6xl font-bold font-display tracking-widest text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]">
            {children}
        </div>

        {/* Glitch Overlay (Optional) */}
        {active && (
            <div className="absolute inset-0 bg-neon-blue/5 blur-xl rounded-full animate-pulse" />
        )}
    </div>
);

// ============================================================================
// MAIN STAGE
// ============================================================================

export const NBackStage: React.FC = () => {
    const { recordResponse, nextStage, addXp } = useTestStore();

    const [phase, setPhase] = useState<'instructions' | 'countdown' | 'running' | 'feedback' | 'complete'>('instructions');
    const [config] = useState<NBackConfig>(DEFAULT_CONFIG);
    const [trials, setTrials] = useState<NBackTrial[]>([]);
    const [currentTrialIndex, setCurrentTrialIndex] = useState(-1);
    const [showStimulus, setShowStimulus] = useState(false);
    const [result, setResult] = useState<NBackResult | null>(null);
    const [userPressed, setUserPressed] = useState(false);
    const [countdown, setCountdown] = useState(3);

    // Response tracking
    const responsesRef = useRef<Map<number, { pressed: boolean; rt?: number }>>(new Map());
    const trialStartTimeRef = useRef<number>(0);
    const taskStartTimeRef = useRef<number>(0);

    // ========================================================================
    // SEQUENCE GENERATION
    // ========================================================================

    useEffect(() => {
        const generateSequence = (): NBackTrial[] => {
            const sequence: NBackTrial[] = [];
            const n = config.nLevel;
            const targetCount = Math.floor(config.sequenceLength * config.targetPercentage);

            // Determine target positions (must be at index >= n)
            const availablePositions: number[] = [];
            for (let i = n; i < config.sequenceLength; i++) {
                availablePositions.push(i);
            }

            // Shuffle and pick target positions
            const shuffled = availablePositions.sort(() => Math.random() - 0.5);
            const targetPositions = new Set(shuffled.slice(0, targetCount));

            // Build sequence
            for (let i = 0; i < config.sequenceLength; i++) {
                const isTarget = targetPositions.has(i);
                let stimulus: string;

                if (isTarget) {
                    // FORCE MATCH: Copy the letter from n positions back
                    stimulus = sequence[i - n].stimulus;
                } else {
                    // FORCE NON-MATCH (Target): Pick a letter that does NOT match n-back
                    const nBackLetter = i >= n ? sequence[i - n].stimulus : null;
                    let newLetter: string;
                    do {
                        newLetter = LETTERS[Math.floor(Math.random() * LETTERS.length)];
                    } while (newLetter === nBackLetter); // Ensure it's NOT a target

                    // Note: We inherently allow 'Lures' (e.g. 1-back matches) because we don't check against i-1.
                    // This is desirable for difficulty.
                    stimulus = newLetter;
                }

                sequence.push({ stimulus, isTarget, position: i });
            }

            return sequence;
        };

        setTrials(generateSequence());
    }, [config]);

    // ========================================================================
    // LOGIC
    // ========================================================================

    const handleKeyPress = useCallback((e: KeyboardEvent) => {
        if (e.code === 'Space' || e.key === ' ') {
            e.preventDefault();

            if (phase !== 'running' || currentTrialIndex < 0) return;
            if (responsesRef.current.has(currentTrialIndex)) return; // Already responded

            const rt = Date.now() - trialStartTimeRef.current;
            responsesRef.current.set(currentTrialIndex, { pressed: true, rt });
            setUserPressed(true);
            audio.playClick();
        }
    }, [phase, currentTrialIndex]);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [handleKeyPress]);

    // Trial Loop
    useEffect(() => {
        if (phase !== 'running' || currentTrialIndex < 0) return;

        // Check completion
        if (currentTrialIndex >= trials.length) {
            calculateResults();
            return;
        }

        setUserPressed(false);
        setShowStimulus(true);
        trialStartTimeRef.current = Date.now();

        // Play subtle tick for new item
        audio.playHover();

        // TIMING LOGIC
        // 1. Show Stimulus
        const stimulusTimer = setTimeout(() => {
            setShowStimulus(false);

            // 2. Wait Inter-Stimulus Interval (ISI)
            const isiTimer = setTimeout(() => {
                // Determine if missed response for previous trial logic (internal tracking only)
                if (!responsesRef.current.has(currentTrialIndex)) {
                    responsesRef.current.set(currentTrialIndex, { pressed: false });
                }

                setCurrentTrialIndex(prev => prev + 1);
            }, config.interStimulusInterval);

            return () => clearTimeout(isiTimer);
        }, config.stimulusDuration);

        return () => clearTimeout(stimulusTimer);
    }, [phase, currentTrialIndex, trials.length, config]);

    // Countdown Logic
    useEffect(() => {
        if (phase === 'countdown') {
            if (countdown > 0) {
                const timer = setTimeout(() => setCountdown(c => c - 1), 1000);
                return () => clearTimeout(timer);
            } else {
                startTask();
            }
        }
    }, [phase, countdown]);

    const calculateResults = () => {
        let hits = 0, misses = 0, falseAlarms = 0, correctRejections = 0;
        const reactionTimes: number[] = [];

        trials.forEach((trial, index) => {
            const response = responsesRef.current.get(index);
            const pressed = response?.pressed ?? false;

            if (trial.isTarget) {
                if (pressed) {
                    hits++;
                    if (response?.rt) reactionTimes.push(response.rt);
                } else {
                    misses++;
                }
            } else {
                if (pressed) {
                    falseAlarms++;
                } else {
                    correctRejections++;
                }
            }
        });

        // d-prime Calculation
        // Avoid infinity by clamping rates
        const hitRate = Math.max(0.01, Math.min(0.99, hits / Math.max(1, hits + misses)));
        const faRate = Math.max(0.01, Math.min(0.99, falseAlarms / Math.max(1, falseAlarms + correctRejections)));

        // Inverse Error Function approximation
        const invErf = (x: number): number => {
            const a = 0.147;
            const ln = Math.log(1 - x * x);
            const t1 = (2 / (Math.PI * a)) + (ln / 2);
            const t2 = ln / a;
            return Math.sign(x) * Math.sqrt(Math.sqrt(t1 * t1 - t2) - t1);
        };

        const zHit = Math.sqrt(2) * invErf(2 * hitRate - 1);
        const zFa = Math.sqrt(2) * invErf(2 * faRate - 1);
        const dPrime = zHit - zFa;

        setResult({
            hits,
            misses,
            falseAlarms,
            correctRejections,
            dPrime: isNaN(dPrime) ? 0 : dPrime,
            reactionTimes
        });
        setPhase('feedback');
    };

    const startCountdown = () => {
        setPhase('countdown');
        setCountdown(3);
        taskStartTimeRef.current = Date.now();
    };

    const startTask = () => {
        setPhase('running');
        setCurrentTrialIndex(0);
        responsesRef.current.clear();
        taskStartTimeRef.current = Date.now();
    };

    const handleComplete = () => {
        if (!result) return;
        const totalTime = Date.now() - taskStartTimeRef.current;
        const accuracy = (result.hits + result.correctRejections) / trials.length;

        // Normalize d-prime to 0-100 score
        // Typical d' range: 0 (random) to 4.6 (perfect)
        const normalizedScore = Math.min(100, Math.max(0, Math.round((result.dPrime / 4.0) * 100)));

        recordResponse({
            choice: result.dPrime.toFixed(2), // Store raw d' as string choice
            latency_ms: totalTime,
            accuracy: accuracy >= 0.7
        });

        addXp(Math.round(normalizedScore * 1.5));

        setPhase('complete');
        setTimeout(() => nextStage(), 1500);
    };

    // ========================================================================
    // RENDER UI
    // ========================================================================

    return (
        <div className="w-full max-w-4xl mx-auto flex flex-col items-center justify-center min-h-[600px] gap-8">

            {/* HUD Header */}
            <div className="w-full flex justify-between items-end border-b border-white/10 pb-4">
                <div className="space-y-1">
                    <h2 className="text-3xl font-display font-bold text-white tracking-tight">
                        WORKING<span className="text-neon-teal">MEMORY</span>
                    </h2>
                    <div className="flex items-center gap-2 text-xs font-mono text-neural-muted">
                        <Activity className="w-4 h-4 text-neon-purple" />
                        <span>N-BACK PROTOCOL: {config.nLevel} STEPS</span>
                    </div>
                </div>

                {phase === 'running' && (
                    <div className="text-right">
                        <div className="text-xs font-mono text-neural-muted mb-1">BUFFER STREAM</div>
                        <div className="flex gap-1">
                            {Array.from({ length: 10 }).map((_, i) => {
                                const progress = (currentTrialIndex / trials.length) * 10;
                                const active = i < progress;
                                return (
                                    <div
                                        key={i}
                                        className={cn(
                                            "w-2 h-4 rounded-sm transition-colors duration-300",
                                            active ? "bg-neon-teal shadow-[0_0_8px_rgba(45,212,191,0.5)]" : "bg-white/10"
                                        )}
                                    />
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>

            {/* Main Stage Area */}
            <div className="relative w-full max-w-lg aspect-square flex items-center justify-center">

                {/* Background Decor */}
                <div className="absolute inset-0 border border-white/5 rounded-full animate-[spin_10s_linear_infinite]" />
                <div className="absolute inset-8 border border-white/5 rounded-full animate-[spin_15s_linear_infinite_reverse]" />

                <AnimatePresence mode="wait">

                    {/* INSTRUCTIONS */}
                    {phase === 'instructions' && (
                        <motion.div
                            key="intro"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="text-center z-10 glass-panel p-8 rounded-2xl max-w-md bg-black/40 backdrop-blur-xl border border-white/10"
                        >
                            <Brain className="w-16 h-16 text-neon-teal mx-auto mb-6" />
                            <h3 className="text-xl font-bold text-white mb-4">Establish Neural Link</h3>
                            <div className="space-y-4 text-neural-muted text-sm leading-relaxed mb-8">
                                <p>
                                    A sequence of data fragments will appear. Your buffer size is <span className="text-white font-bold">{config.nLevel}</span>.
                                </p>
                                <p>
                                    Press <span className="text-neon-teal font-mono font-bold bg-neon-teal/10 px-2 py-1 rounded">SPACE</span> when the current fragment MATCHES the one shown <span className="text-white font-bold">2 steps ago</span>.
                                </p>

                                <div className="grid grid-cols-5 gap-2 font-mono text-lg opacity-80 my-6">
                                    <div className="flex flex-col items-center"><span className="text-white/30">A</span></div>
                                    <div className="flex flex-col items-center"><span className="text-white/30">B</span></div>
                                    <div className="flex flex-col items-center">
                                        <span className="text-neon-teal font-bold animate-pulse">A</span>
                                        <span className="text-[10px] text-neon-teal mt-1">MATCH</span>
                                    </div>
                                    <div className="flex flex-col items-center"><span className="text-white/30">C</span></div>
                                    <div className="flex flex-col items-center">
                                        <span className="text-neon-teal font-bold animate-pulse">C</span>
                                        <span className="text-[10px] text-neon-teal mt-1">MATCH</span>
                                    </div>
                                </div>
                            </div>
                            <NeonButton onClick={startCountdown} variant="primary" size="lg" className="w-full">
                                INITIALIZE
                            </NeonButton>
                        </motion.div>
                    )}

                    {/* COUNTDOWN */}
                    {phase === 'countdown' && (
                        <motion.div
                            key="count"
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.5 }}
                            className="text-8xl font-bold font-display text-white z-10"
                        >
                            {countdown}
                        </motion.div>
                    )}

                    {/* ACTIVE GAME */}
                    {phase === 'running' && (
                        <div className="relative z-10 flex flex-col items-center">

                            {/* Hex Frame */}
                            <HexagonFrame active={showStimulus}>
                                <AnimatePresence mode="wait">
                                    {showStimulus && (
                                        <motion.span
                                            key={`stim-${currentTrialIndex}`}
                                            initial={{ opacity: 0, filter: 'blur(10px)', scale: 1.5 }}
                                            animate={{ opacity: 1, filter: 'blur(0px)', scale: 1 }}
                                            exit={{ opacity: 0, filter: 'blur(5px)', scale: 0.8 }}
                                            transition={{ duration: 0.15 }} // Fast entry
                                            className="block"
                                        >
                                            {trials[currentTrialIndex]?.stimulus}
                                        </motion.span>
                                    )}
                                </AnimatePresence>
                            </HexagonFrame>

                            {/* Interaction Feedback */}
                            <div className="h-12 mt-8 flex items-center justify-center">
                                <AnimatePresence>
                                    {userPressed && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0 }}
                                            className="flex items-center gap-2 px-4 py-2 rounded-full bg-neon-purple/20 border border-neon-purple text-neon-purple font-mono text-sm tracking-wider"
                                        >
                                            <Zap className="w-4 h-4 fill-current" />
                                            SIGNAL CAPTURED
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                        </div>
                    )}

                    {/* FEEDBACK */}
                    {phase === 'feedback' && result && (
                        <motion.div
                            key="results"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="z-10 w-full max-w-md glass-panel p-6 rounded-2xl bg-neural-card/90"
                        >
                            <h3 className="text-2xl font-bold text-center mb-6 text-white">Buffer Analysis</h3>

                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <div className="bg-black/40 p-4 rounded-xl border border-white/5 text-center">
                                    <div className="text-neural-muted text-xs uppercase tracking-wider mb-2">Accuracy</div>
                                    <div className="text-3xl font-bold text-neon-green">
                                        {Math.round(((result.hits + result.correctRejections) / trials.length) * 100)}%
                                    </div>
                                </div>
                                <div className="bg-black/40 p-4 rounded-xl border border-white/5 text-center">
                                    <div className="text-neural-muted text-xs uppercase tracking-wider mb-2">Sensitivity (d')</div>
                                    <div className="text-3xl font-bold text-neon-purple">
                                        {result.dPrime.toFixed(2)}
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2 mb-8">
                                <div className="flex justify-between text-sm">
                                    <span className="text-neural-muted">Targets Identified</span>
                                    <span className="text-white font-mono">{result.hits} / {trials.filter(t => t.isTarget).length}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-neural-muted">False Signals</span>
                                    <span className="text-white font-mono">{result.falseAlarms}</span>
                                </div>
                            </div>

                            <NeonButton onClick={handleComplete} variant="primary" className="w-full group">
                                <span className="group-hover:tracking-widest transition-all duration-300">UPLOAD DATA</span>
                            </NeonButton>
                        </motion.div>
                    )}

                    {/* COMPLETE */}
                    {phase === 'complete' && (
                        <motion.div
                            key="done"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="z-10 text-center"
                        >
                            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-neon-green/20 border-2 border-neon-green/50 flex items-center justify-center animate-pulse">
                                <Database className="w-10 h-10 text-neon-green" />
                            </div>
                            <h3 className="text-2xl font-bold text-white tracking-widest">DATA SYNCED</h3>
                        </motion.div>
                    )}

                </AnimatePresence>
            </div>

            {/* Footer Hints */}
            {phase === 'running' && (
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.5 }}
                    className="text-white/30 text-xs font-mono"
                >
                    [SPACE] TO MATCH SIGNAL
                </motion.p>
            )}

        </div>
    );
};

export default NBackStage;
