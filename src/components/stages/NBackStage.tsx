'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTestStore } from '../../store/useTestStore';
import { GlassCard } from '../ui/GlassCard';
import { NeonButton } from '../ui/NeonButton';
import { cn } from '../../lib/utils';
import { audio } from '../../engine/AudioEngine';
import { Brain, Zap, CheckCircle, XCircle, Volume2 } from 'lucide-react';

// ============================================================================
// N-BACK WORKING MEMORY TASK
// ============================================================================

interface NBackConfig {
    nLevel: 2 | 3;             // How far back to remember
    sequenceLength: number;    // Total items to show
    stimulusDuration: number;  // Ms to show each stimulus
    interStimulusInterval: number; // Ms between stimuli
    targetPercentage: number;  // % of items that are matches
}

interface NBackTrial {
    stimulus: string;
    isTarget: boolean;        // Is this a match with n-back?
    position: number;
}

interface NBackResult {
    hits: number;             // Correctly identified matches
    misses: number;           // Missed matches
    falseAlarms: number;      // Incorrectly pressed on non-match
    correctRejections: number; // Correctly didn't press on non-match
    dPrime: number;           // Signal detection metric
    reactionTimes: number[];  // RT for hits
}

const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K', 'L', 'M'];

const DEFAULT_CONFIG: NBackConfig = {
    nLevel: 2,
    sequenceLength: 20,
    stimulusDuration: 2000,
    interStimulusInterval: 500,
    targetPercentage: 0.25,
};

// ============================================================================
// COMPONENT
// ============================================================================

export const NBackStage: React.FC = () => {
    const { recordResponse, nextStage, currentStage, addXp } = useTestStore();

    const [phase, setPhase] = useState<'instructions' | 'running' | 'feedback' | 'complete'>('instructions');
    const [config] = useState<NBackConfig>(DEFAULT_CONFIG);
    const [trials, setTrials] = useState<NBackTrial[]>([]);
    const [currentTrialIndex, setCurrentTrialIndex] = useState(-1);
    const [showStimulus, setShowStimulus] = useState(false);
    const [result, setResult] = useState<NBackResult | null>(null);

    // Response tracking
    const responsesRef = useRef<Map<number, { pressed: boolean; rt?: number; timestamp: number }>>(new Map());
    const trialStartTimeRef = useRef<number>(0);

    // Generate sequence
    useEffect(() => {
        const generateSequence = (): NBackTrial[] => {
            const sequence: NBackTrial[] = [];
            const targetCount = Math.floor(config.sequenceLength * config.targetPercentage);

            // Generate target positions
            const targetPositions = new Set<number>();
            while (targetPositions.size < targetCount) {
                const pos = config.nLevel + Math.floor(Math.random() * (config.sequenceLength - config.nLevel));
                targetPositions.add(pos);
            }

            // Build sequence
            for (let i = 0; i < config.sequenceLength; i++) {
                const isTarget = targetPositions.has(i);
                let stimulus: string;

                if (isTarget && i >= config.nLevel) {
                    // Match the letter from n positions back
                    stimulus = sequence[i - config.nLevel].stimulus;
                } else {
                    // Pick a non-matching letter
                    let newLetter: string;
                    do {
                        newLetter = LETTERS[Math.floor(Math.random() * LETTERS.length)];
                    } while (i >= config.nLevel && newLetter === sequence[i - config.nLevel].stimulus);
                    stimulus = newLetter;
                }

                sequence.push({ stimulus, isTarget, position: i });
            }

            return sequence;
        };

        setTrials(generateSequence());
    }, [config]);

    // Handle keypress
    const handleKeyPress = useCallback((e: KeyboardEvent) => {
        if (phase !== 'running' || currentTrialIndex < 0) return;
        if (e.code === 'Space' || e.key === ' ') {
            e.preventDefault();
            const rt = Date.now() - trialStartTimeRef.current;

            // Record response
            responsesRef.current.set(currentTrialIndex, {
                pressed: true,
                rt,
                timestamp: Date.now()
            });

            // Trigger re-render for visual feedback
            setTrials(prev => [...prev]);
        }
    }, [phase, currentTrialIndex]);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [handleKeyPress]);

    // Run trial sequence
    useEffect(() => {
        if (phase !== 'running' || currentTrialIndex >= trials.length) return;

        // Show stimulus
        setShowStimulus(true);
        trialStartTimeRef.current = Date.now();

        // Initialize response as not pressed
        if (!responsesRef.current.has(currentTrialIndex)) {
            responsesRef.current.set(currentTrialIndex, { pressed: false, timestamp: Date.now() });
        }

        // Hide after duration
        const hideTimer = setTimeout(() => {
            setShowStimulus(false);
        }, config.stimulusDuration);

        // Move to next trial
        const nextTimer = setTimeout(() => {
            if (currentTrialIndex + 1 >= trials.length) {
                // Calculate results
                calculateResults();
            } else {
                setCurrentTrialIndex(prev => prev + 1);
            }
        }, config.stimulusDuration + config.interStimulusInterval);

        return () => {
            clearTimeout(hideTimer);
            clearTimeout(nextTimer);
        };
    }, [phase, currentTrialIndex, trials, config]);

    const calculateResults = () => {
        let hits = 0, misses = 0, falseAlarms = 0, correctRejections = 0;
        const hitRTs: number[] = [];

        trials.forEach((trial, idx) => {
            const response = responsesRef.current.get(idx);
            const pressed = response?.pressed || false;

            if (trial.isTarget) {
                if (pressed) {
                    hits++;
                    if (response?.rt) hitRTs.push(response.rt);
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

        // Calculate d-prime (signal detection)
        const hitRate = Math.max(0.01, Math.min(0.99, hits / (hits + misses)));
        const faRate = Math.max(0.01, Math.min(0.99, falseAlarms / (falseAlarms + correctRejections)));
        const zHitRate = normalZScore(hitRate);
        const zFaRate = normalZScore(faRate);
        const dPrime = zHitRate - zFaRate;

        const finalResult: NBackResult = {
            hits,
            misses,
            falseAlarms,
            correctRejections,
            dPrime,
            reactionTimes: hitRTs,
        };

        setResult(finalResult);
        setPhase('feedback');

        // Award XP based on performance
        const accuracy = (hits + correctRejections) / trials.length;
        addXp(Math.round(accuracy * 100));
    };

    const startTask = () => {
        setPhase('running');
        setCurrentTrialIndex(0);
        responsesRef.current.clear();
    };

    const completeTask = () => {
        if (!result) return;

        // Convert d-prime to standardized score (mean 0, sd 1 -> mean 100, sd 15)
        const standardizedScore = Math.round(100 + (result.dPrime * 15));
        const accuracy = (result.hits + result.correctRejections) / trials.length;

        recordResponse({
            choice: result.dPrime, // Store d-prime as choice
            latency_ms: result.reactionTimes.length > 0
                ? result.reactionTimes.reduce((a, b) => a + b, 0) / result.reactionTimes.length
                : 0,
            accuracy: accuracy > 0.7,
            // Additional data stored in response
        });

        nextStage();
    };

    // ========================================================================
    // RENDER
    // ========================================================================

    return (
        <div className="w-full max-w-2xl mx-auto flex flex-col gap-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Brain className="w-5 h-5 text-neon-purple" />
                    <h2 className="text-2xl font-display font-bold text-white">Working Memory</h2>
                </div>
                <div className="text-xs text-neural-muted font-mono">
                    {config.nLevel}-BACK TASK
                </div>
            </div>

            <GlassCard className="p-8 bg-neural-card min-h-[400px] flex flex-col items-center justify-center">
                <AnimatePresence mode="wait">
                    {phase === 'instructions' && (
                        <motion.div
                            key="instructions"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="text-center space-y-6 max-w-md"
                        >
                            <div className="w-16 h-16 mx-auto bg-neon-purple/20 rounded-2xl flex items-center justify-center">
                                <Brain className="w-8 h-8 text-neon-purple" />
                            </div>

                            <h3 className="text-xl font-bold text-white">
                                {config.nLevel}-Back Task
                            </h3>

                            <p className="text-neural-muted leading-relaxed">
                                You will see a sequence of letters. Press <kbd className="px-2 py-1 bg-white/10 rounded text-neon-cyan font-mono">SPACE</kbd> when the current letter matches the one from <span className="text-neon-purple font-bold">{config.nLevel} positions ago</span>.
                            </p>

                            <div className="bg-white/5 rounded-lg p-4 text-sm text-neural-muted">
                                <p className="font-mono mb-2">Example (2-back):</p>
                                <p>A → B → <span className="text-neon-green">A</span> → C → <span className="text-neon-green">A</span> → ...</p>
                                <p className="mt-2 text-xs">Press SPACE when you see the green letters</p>
                            </div>

                            <NeonButton onClick={startTask} variant="primary" className="w-full">
                                <Zap className="w-4 h-4 mr-2" />
                                START TASK
                            </NeonButton>
                        </motion.div>
                    )}

                    {phase === 'running' && (
                        <motion.div
                            key="running"
                            className="text-center space-y-8"
                        >
                            {/* Progress */}
                            <div className="w-full max-w-xs mx-auto">
                                <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                                    <motion.div
                                        className="h-full bg-neon-purple"
                                        initial={{ width: 0 }}
                                        animate={{ width: `${((currentTrialIndex + 1) / trials.length) * 100}%` }}
                                    />
                                </div>
                                <p className="text-xs text-neural-muted mt-2 font-mono">
                                    {currentTrialIndex + 1} / {trials.length}
                                </p>
                            </div>

                            {/* Stimulus Display */}
                            <div className="relative w-32 h-32 mx-auto">
                                <div className="absolute inset-0 bg-neon-purple/10 rounded-2xl border border-neon-purple/30" />
                                <AnimatePresence>
                                    {showStimulus && currentTrialIndex >= 0 && trials[currentTrialIndex] && (
                                        <motion.div
                                            key={currentTrialIndex}
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.8 }}
                                            className="absolute inset-0 flex items-center justify-center"
                                        >
                                            <span className="text-6xl font-display font-bold text-white">
                                                {trials[currentTrialIndex].stimulus}
                                            </span>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Instructions reminder & Mobile Control */}
                            <div className="flex flex-col items-center gap-4">
                                <p className="text-sm text-neural-muted hidden md:block">
                                    Press <kbd className="px-2 py-0.5 bg-white/10 rounded text-neon-cyan font-mono text-xs">SPACE</kbd> if this matches {config.nLevel} back
                                </p>

                                {/* Mobile/Tablet Touch Button */}
                                <button
                                    className="md:hidden active:scale-95 transition-transform w-24 h-24 rounded-full bg-neon-purple/20 border-2 border-neon-purple flex items-center justify-center"
                                    onTouchStart={(e) => {
                                        e.preventDefault();
                                        audio.playClick();
                                        handleKeyPress({ code: 'Space', preventDefault: () => { } } as any);
                                    }}
                                    onClick={(e) => {
                                        // Fallback for click
                                        audio.playClick();
                                        handleKeyPress({ code: 'Space', preventDefault: () => { } } as any);
                                    }}
                                >
                                    <span className="font-bold text-neon-purple">MATCH</span>
                                </button>

                                {/* Visual Feedback Indicator */}
                                <div className={`h-2 w-2 rounded-full transition-colors duration-100 ${responsesRef.current.get(currentTrialIndex)?.pressed
                                    ? 'bg-neon-cyan shadow-[0_0_10px_#0ff]'
                                    : 'bg-transparent'
                                    }`} />
                            </div>
                        </motion.div>
                    )}

                    {phase === 'feedback' && result && (
                        <motion.div
                            key="feedback"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-center space-y-6 w-full max-w-sm"
                        >
                            <h3 className="text-xl font-bold text-white">Task Complete</h3>

                            {/* Results Grid */}
                            <div className="grid grid-cols-2 gap-4">
                                <ResultStat
                                    label="Hits"
                                    value={result.hits}
                                    total={result.hits + result.misses}
                                    color="green"
                                />
                                <ResultStat
                                    label="False Alarms"
                                    value={result.falseAlarms}
                                    total={result.falseAlarms + result.correctRejections}
                                    color="red"
                                    inverted
                                />
                                <ResultStat
                                    label="d' Score"
                                    value={result.dPrime.toFixed(2)}
                                    color="cyan"
                                />
                                <ResultStat
                                    label="Avg RT"
                                    value={result.reactionTimes.length > 0
                                        ? `${Math.round(result.reactionTimes.reduce((a, b) => a + b, 0) / result.reactionTimes.length)}ms`
                                        : 'N/A'
                                    }
                                    color="purple"
                                />
                            </div>

                            {/* Performance interpretation */}
                            <div className={cn(
                                "p-3 rounded-lg text-sm",
                                result.dPrime >= 2.0 ? "bg-neon-green/10 text-neon-green" :
                                    result.dPrime >= 1.0 ? "bg-neon-cyan/10 text-neon-cyan" :
                                        result.dPrime >= 0.5 ? "bg-yellow-500/10 text-yellow-400" :
                                            "bg-red-500/10 text-red-400"
                            )}>
                                {result.dPrime >= 2.0 ? "Excellent working memory performance!" :
                                    result.dPrime >= 1.0 ? "Good working memory capacity." :
                                        result.dPrime >= 0.5 ? "Average working memory performance." :
                                            "Below average - try focusing more on the task."}
                            </div>

                            <NeonButton onClick={completeTask} variant="primary" className="w-full">
                                CONTINUE
                            </NeonButton>
                        </motion.div>
                    )}
                </AnimatePresence>
            </GlassCard>
        </div>
    );
};

// ============================================================================
// HELPER COMPONENTS
// ============================================================================

interface ResultStatProps {
    label: string;
    value: string | number;
    total?: number;
    color: 'green' | 'red' | 'cyan' | 'purple';
    inverted?: boolean;
}

const ResultStat: React.FC<ResultStatProps> = ({ label, value, total, color, inverted }) => {
    const colors = {
        green: 'text-neon-green',
        red: 'text-red-400',
        cyan: 'text-neon-cyan',
        purple: 'text-neon-purple',
    };

    return (
        <div className="bg-white/5 rounded-lg p-3 text-left">
            <p className="text-xs text-neural-muted mb-1">{label}</p>
            <p className={cn("text-2xl font-bold font-mono", colors[color])}>
                {value}
                {total !== undefined && (
                    <span className="text-sm text-neural-muted">/{total}</span>
                )}
            </p>
        </div>
    );
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

function normalZScore(p: number): number {
    // Approximation of inverse normal CDF
    if (p <= 0) return -3;
    if (p >= 1) return 3;

    const a1 = -3.969683028665376e+01;
    const a2 = 2.209460984245205e+02;
    const a3 = -2.759285104469687e+02;
    const a4 = 1.383577518672690e+02;
    const a5 = -3.066479806614716e+01;
    const a6 = 2.506628277459239e+00;

    const b1 = -5.447609879822406e+01;
    const b2 = 1.615858368580409e+02;
    const b3 = -1.556989798598866e+02;
    const b4 = 6.680131188771972e+01;
    const b5 = -1.328068155288572e+01;

    const c1 = -7.784894002430293e-03;
    const c2 = -3.223964580411365e-01;
    const c3 = -2.400758277161838e+00;
    const c4 = -2.549732539343734e+00;
    const c5 = 4.374664141464968e+00;
    const c6 = 2.938163982698783e+00;

    const d1 = 7.784695709041462e-03;
    const d2 = 3.224671290700398e-01;
    const d3 = 2.445134137142996e+00;
    const d4 = 3.754408661907416e+00;

    const pLow = 0.02425;
    const pHigh = 1 - pLow;

    let q: number, r: number;

    if (p < pLow) {
        q = Math.sqrt(-2 * Math.log(p));
        return (((((c1 * q + c2) * q + c3) * q + c4) * q + c5) * q + c6) /
            ((((d1 * q + d2) * q + d3) * q + d4) * q + 1);
    } else if (p <= pHigh) {
        q = p - 0.5;
        r = q * q;
        return (((((a1 * r + a2) * r + a3) * r + a4) * r + a5) * r + a6) * q /
            (((((b1 * r + b2) * r + b3) * r + b4) * r + b5) * r + 1);
    } else {
        q = Math.sqrt(-2 * Math.log(1 - p));
        return -(((((c1 * q + c2) * q + c3) * q + c4) * q + c5) * q + c6) /
            ((((d1 * q + d2) * q + d3) * q + d4) * q + 1);
    }
}

export default NBackStage;
