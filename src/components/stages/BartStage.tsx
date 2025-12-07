'use client';

import { useState } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { useTestStore } from '../../store/useTestStore';
import { NeonButton } from '../ui/NeonButton';
import { GlassCard } from '../ui/GlassCard';
import { cn } from '../../lib/utils';
import { Zap, Shield, AlertTriangle, Info } from 'lucide-react';
import { audio } from '../../engine/AudioEngine';

export const BartStage = () => {
    const { recordResponse, nextStage, currentStage, addXp } = useTestStore();
    const controls = useAnimation();

    // Game State
    const [trial, setTrial] = useState(1);
    const TOTAL_TRIALS = 10; // Increased from 5 for better reliability
    const [pumps, setPumps] = useState(0);
    const [currentValue, setCurrentValue] = useState(0);
    const [totalEarnings, setTotalEarnings] = useState(0);
    const [isExploded, setIsExploded] = useState(false);
    const [isCashedOut, setIsCashedOut] = useState(false);
    const [riskLevel, setRiskLevel] = useState(0); // 0 to 1
    const [showBrief, setShowBrief] = useState(true);
    const [startTime] = useState(Date.now());
    const [pumpHistory, setPumpHistory] = useState<number[]>([]);

    // Constants
    const maxPumps = 15; // Standard max pumps
    const baseReward = 10;

    const nextTrial = () => {
        if (trial >= TOTAL_TRIALS) {
            // Finish Stage
            const averagePumps = pumpHistory.reduce((a, b) => a + b, 0) / pumpHistory.length || 0;
            recordResponse({
                choice: Math.round(averagePumps), // Record average pumps as the "choice"
                latency_ms: Date.now() - startTime,
                accuracy: true
            });
            nextStage();
        } else {
            // Next Trial
            setTrial(prev => prev + 1);
            setPumps(0);
            setCurrentValue(0);
            setIsExploded(false);
            setIsCashedOut(false);
            setRiskLevel(0);
            controls.set({ scale: 1, opacity: 1, filter: "blur(0px)" });
        }
    };

    const handlePump = async () => {
        if (isExploded || isCashedOut) return;

        audio.playClick();
        const newPumps = pumps + 1;

        // Calculate burst probability (exponential)
        // Standard BART: p = 1 / (max - current + 1) or similar. 
        // Here we use a curve that gets risky fast after 10.
        const burstProb = Math.min(0.95, Math.pow(newPumps / maxPumps, 2.5));

        // Check burst
        if (Math.random() < burstProb) {
            setIsExploded(true);
            audio.playError();
            controls.start({
                scale: [1, 1.5, 0],
                opacity: [1, 0.8, 0],
                filter: ["blur(0px)", "blur(20px)"],
                transition: { duration: 0.2 }
            });

            // No points for this round
            setPumpHistory(prev => [...prev, 0]); // 0 pumps counted for burst (or could count pumps but 0 money)

            setTimeout(nextTrial, 1500);
        } else {
            setPumps(newPumps);
            setCurrentValue(newPumps * baseReward);
            setRiskLevel(burstProb);

            // Pulse animation with increasing intensity
            controls.start({
                scale: [1, 1.05 + burstProb * 0.4, 1], // More swelling
                ...getShakeParams(),
                transition: { duration: 0.2 } // Faster shake
            });
        }
    };

    const handleCashOut = () => {
        if (isExploded || isCashedOut) return;
        setIsCashedOut(true);
        audio.playSuccess();

        const earnings = pumps * baseReward;
        setTotalEarnings(prev => prev + earnings);
        addXp(earnings); // Award XP immediately
        setPumpHistory(prev => [...prev, pumps]);

        setTimeout(nextTrial, 1000);
    };

    // Color interpolation based on risk
    const getCoreColor = () => {
        if (riskLevel < 0.2) return '#22d3ee'; // Teal (Safe)
        if (riskLevel < 0.4) return '#4ade80'; // Green (Low Risk)
        if (riskLevel < 0.6) return '#facc15'; // Yellow (Caution)
        if (riskLevel < 0.8) return '#f97316'; // Orange (Danger)
        return '#ef4444'; // Red (Critical)
    };

    // Shake intensity based on risk
    const getShakeParams = () => {
        const intensity = riskLevel * 25; // Increased for visceral feedback
        return {
            x: [0, -intensity, intensity, -intensity / 2, intensity / 2, 0],
            y: [0, intensity / 2, -intensity / 2, intensity / 4, -intensity / 4, 0],
        };
    };

    return (
        <div className="w-full max-w-4xl mx-auto flex flex-col items-center gap-8">
            {/* Mission Brief Overlay */}
            <AnimatePresence>
                {showBrief && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-neural-bg/80 backdrop-blur-sm p-4"
                    >
                        <GlassCard className="max-w-md w-full p-8 text-center space-y-6 border-neon-teal/30">
                            <Info className="w-12 h-12 text-neon-teal mx-auto" />
                            <h2 className="text-2xl font-display font-bold text-white">MISSION BRIEFING</h2>
                            <div className="text-neural-muted space-y-4 text-left bg-neural-card p-4 rounded-lg">
                                <p>1. <span className="text-white font-bold">CHARGE</span> the core to increase energy ($).</p>
                                <p>2. <span className="text-white font-bold">STABILIZE</span> to bank earnings before meltdown.</p>
                                <p>3. <span className="text-neon-teal font-bold">GOAL:</span> Maximize total earnings over {TOTAL_TRIALS} trials.</p>
                            </div>
                            <NeonButton onClick={() => setShowBrief(false)} className="w-full">
                                ACKNOWLEDGE
                            </NeonButton>
                        </GlassCard>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="flex justify-between w-full max-w-md items-end">
                <div className="text-left">
                    <h2 className="text-2xl font-display font-bold text-white">Core Stability</h2>
                    <p className="text-neural-muted text-sm">Trial {trial} / {TOTAL_TRIALS}</p>
                </div>
                <div className="text-right">
                    <div className="text-sm text-neural-muted">TOTAL BANK</div>
                    <div className="text-2xl font-mono text-neon-teal">${totalEarnings}</div>
                </div>
            </div>

            <div className="relative w-full max-w-md aspect-square flex flex-col items-center justify-center">
                {/* Background Rings */}
                <div className="absolute inset-0 border border-white/5 rounded-full animate-[spin_10s_linear_infinite]" />
                <div className="absolute inset-12 border border-white/5 rounded-full animate-[spin_15s_linear_infinite_reverse]" />

                {/* The Core */}
                <AnimatePresence>
                    {!isExploded && (
                        <motion.div
                            animate={controls}
                            className="relative z-10"
                        >
                            <motion.div
                                animate={{
                                    boxShadow: `0 0 ${20 + riskLevel * 50}px ${getCoreColor()}`,
                                    backgroundColor: getCoreColor(),
                                }}
                                className="w-40 h-40 rounded-full blur-md opacity-80"
                            />
                            <motion.div
                                animate={{
                                    scale: [1, 1.05 + riskLevel * 0.3, 1],
                                }}
                                transition={{ duration: Math.max(0.2, 2 - riskLevel * 1.8), repeat: Infinity }}
                                className="absolute inset-0 rounded-full bg-white mix-blend-overlay opacity-50"
                            />
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Explosion Effect */}
                {isExploded && (
                    <motion.div
                        initial={{ scale: 0, opacity: 1 }}
                        animate={{ scale: 2, opacity: 0 }}
                        className="absolute inset-0 bg-neon-red rounded-full blur-xl"
                    />
                )}

                {/* Integrated Stats Overlay - Centered & Clear */}
                <div className="absolute top-4 w-full flex justify-between px-8 z-20">
                    <div className="text-center">
                        <div className="text-xs text-neural-muted tracking-widest mb-1">STABILITY</div>
                        <div className={cn("text-xl font-mono font-bold transition-colors duration-300", riskLevel > 0.5 ? "text-neon-red" : "text-neon-blue")}>
                            {Math.round((1 - riskLevel) * 100)}%
                        </div>
                    </div>
                    <div className="text-center">
                        <div className="text-xs text-neural-muted tracking-widest mb-1">POTENTIAL</div>
                        <div className="text-xl font-mono font-bold text-white">${currentValue}</div>
                    </div>
                </div>

                {/* Critical Mass Gauge */}
                <div className="absolute bottom-10 w-48 h-2 bg-white/10 rounded-full overflow-hidden z-20">
                    <motion.div
                        className={cn("h-full transition-colors duration-300", riskLevel > 0.7 ? "bg-neon-red shadow-[0_0_10px_#ef4444]" : "bg-neon-teal")}
                        animate={{ width: `${riskLevel * 100}%` }}
                    />
                </div>
                <div className="absolute bottom-6 text-[10px] text-neural-muted font-mono tracking-widest z-20">
                    CORE CRITICALITY
                </div>

                {/* High Risk Warning */}
                {riskLevel > 0.65 && !isExploded && !isCashedOut && (
                    <motion.div
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 0.5, repeat: Infinity }}
                        className="absolute inset-0 flex items-center justify-center pointer-events-none z-30"
                    >
                        <AlertTriangle className="w-64 h-64 text-neon-red/10" strokeWidth={1} />
                    </motion.div>
                )}
            </div>

            {/* Controls */}
            <GlassCard className="flex flex-col md:flex-row gap-8 p-8 items-center justify-center min-w-[500px]">
                <NeonButton
                    onClick={handlePump}
                    disabled={isExploded || isCashedOut}
                    className="w-48 h-14 text-lg font-bold tracking-wider"
                    variant={riskLevel > 0.6 ? 'danger' : 'primary'}
                >
                    <Zap className="w-5 h-5 mr-2 fill-current" />
                    CHARGE ${baseReward}
                </NeonButton>

                <div className="flex flex-col items-center gap-1 min-w-[120px]">
                    <div className="text-[10px] text-neural-muted font-mono uppercase tracking-widest">Risk Level</div>
                    <div className={cn("text-2xl font-bold font-mono", riskLevel > 0.6 ? "text-neon-red" : "text-neon-teal")}>
                        {Math.round(riskLevel * 100)}%
                    </div>
                </div>

                <NeonButton
                    onClick={handleCashOut}
                    disabled={isExploded || isCashedOut || pumps === 0}
                    variant="secondary"
                    className="w-48 h-14 text-lg font-bold tracking-wider"
                >
                    <Shield className="w-5 h-5 mr-2" />
                    SECURE ${currentValue}
                </NeonButton>
            </GlassCard>

            {isExploded && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-neon-red font-bold text-xl flex items-center gap-2"
                >
                    <AlertTriangle /> CORE MELTDOWN
                </motion.div>
            )}

            {isCashedOut && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-neon-green font-bold text-xl flex items-center gap-2"
                >
                    <Shield /> ENERGY SECURED
                </motion.div>
            )}
        </div>
    );
};
