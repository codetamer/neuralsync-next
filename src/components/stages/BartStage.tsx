'use client';

import { useState } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { useTestStore } from '../../store/useTestStore';
import { NeonButton } from '../ui/NeonButton';
import { GlassCard } from '../ui/GlassCard';
import { cn } from '../../lib/utils';
import { Zap, Shield, AlertTriangle, Info } from 'lucide-react';
import { playSFX } from '../audio/AmbientSound';

export const BartStage = () => {
    const { recordResponse, nextStage, currentStage, addXp } = useTestStore();
    const controls = useAnimation();

    // Game State
    const [pumps, setPumps] = useState(0);
    const [currentValue, setCurrentValue] = useState(0);
    const [isExploded, setIsExploded] = useState(false);
    const [isCashedOut, setIsCashedOut] = useState(false);
    const [riskLevel, setRiskLevel] = useState(0); // 0 to 1
    const [showBrief, setShowBrief] = useState(true);
    const [startTime] = useState(Date.now());

    // Constants based on difficulty (Stage 11-15)
    const difficulty = ((currentStage - 10) % 5) + 1;
    const maxPumps = difficulty <= 2 ? 15 : difficulty <= 4 ? 12 : 10;
    const baseReward = 10;

    const handlePump = async () => {
        if (isExploded || isCashedOut) return;

        playSFX('click');
        const newPumps = pumps + 1;

        // Calculate burst probability (exponential)
        const burstProb = Math.min(0.95, Math.pow(newPumps / maxPumps, 2));

        // Check burst
        if (Math.random() < burstProb) {
            setIsExploded(true);
            playSFX('error');
            controls.start({
                scale: [1, 1.5, 0],
                opacity: [1, 0.8, 0],
                filter: ["blur(0px)", "blur(20px)"],
                transition: { duration: 0.2 }
            });

            setTimeout(() => {
                recordResponse({
                    choice: newPumps,
                    latency_ms: Date.now() - startTime,
                    accuracy: false // Burst = "incorrect" in this context
                });
                nextStage();
            }, 1500);
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
        playSFX('success');
        addXp(pumps * 10); // Award XP

        setTimeout(() => {
            recordResponse({
                choice: pumps,
                latency_ms: Date.now() - startTime,
                accuracy: true
            });
            nextStage();
        }, 1000);
    };

    // Color interpolation based on risk
    const getCoreColor = () => {
        // Interpolate from Teal (#22d3ee) to Red (#ef4444) based on riskLevel
        // Simple step function for now, but could be smooth lerp
        if (riskLevel < 0.2) return '#22d3ee'; // Teal (Safe)
        if (riskLevel < 0.4) return '#4ade80'; // Green (Low Risk)
        if (riskLevel < 0.6) return '#facc15'; // Yellow (Caution)
        if (riskLevel < 0.8) return '#f97316'; // Orange (Danger)
        return '#ef4444'; // Red (Critical)
    };

    // Shake intensity based on risk
    const getShakeParams = () => {
        const intensity = riskLevel * 10;
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
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
                    >
                        <GlassCard className="max-w-md w-full p-8 text-center space-y-6 border-neon-teal/30">
                            <Info className="w-12 h-12 text-neon-teal mx-auto" />
                            <h2 className="text-2xl font-display font-bold text-white">MISSION BRIEFING</h2>
                            <div className="text-neural-muted space-y-4 text-left bg-black/20 p-4 rounded-lg">
                                <p>1. <span className="text-white font-bold">CHARGE</span> the core to increase potential energy ($).</p>
                                <p>2. <span className="text-white font-bold">STABILIZE</span> to bank your earnings before critical mass.</p>
                                <p>3. <span className="text-neon-red font-bold">WARNING:</span> Higher charge = Higher risk of meltdown.</p>
                            </div>
                            <NeonButton onClick={() => setShowBrief(false)} className="w-full">
                                ACKNOWLEDGE
                            </NeonButton>
                        </GlassCard>
                    </motion.div>
                )}
            </AnimatePresence>
            <div className="text-center space-y-2">
                <h2 className="text-3xl font-display font-bold text-white">Core Stability</h2>
                <p className="text-neural-muted">Charge the energy core. Stabilize before critical mass.</p>
            </div>

            <div className="relative w-full max-w-md aspect-square flex items-center justify-center">
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
                                className="w-32 h-32 rounded-full blur-md opacity-80"
                            />
                            <motion.div
                                animate={{
                                    scale: [1, 1.05 + riskLevel * 0.2, 1],
                                }}
                                transition={{ duration: 2 - riskLevel * 1.5, repeat: Infinity }}
                                className="absolute inset-0 rounded-full bg-white mix-blend-overlay"
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

                {/* Stats Overlay */}
                <div className="absolute top-0 right-0 p-4 text-right">
                    <div className="text-sm text-neural-muted">POTENTIAL ENERGY</div>
                    <div className="text-2xl font-mono text-neon-teal">${currentValue}</div>
                </div>

                <div className="absolute top-0 left-0 p-4">
                    <div className="text-sm text-neural-muted">INSTABILITY</div>
                    <div className={cn("text-2xl font-mono", riskLevel > 0.5 ? "text-neon-red" : "text-neon-blue")}>
                        {Math.round(riskLevel * 100)}%
                    </div>
                </div>
            </div>

            {/* Controls */}
            <GlassCard className="flex gap-6 p-6 items-center">
                <NeonButton
                    onClick={handlePump}
                    disabled={isExploded || isCashedOut}
                    className="w-40 h-16 text-lg"
                    variant={riskLevel > 0.6 ? 'danger' : 'primary'}
                >
                    <Zap className="w-5 h-5 mr-2" />
                    CHARGE
                </NeonButton>

                <div className="h-12 w-[1px] bg-white/10" />

                <NeonButton
                    onClick={handleCashOut}
                    disabled={isExploded || isCashedOut || pumps === 0}
                    variant="secondary"
                    className="w-40 h-16 text-lg"
                >
                    <Shield className="w-5 h-5 mr-2" />
                    STABILIZE
                </NeonButton>
            </GlassCard>

            {isExploded && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-neon-red font-bold text-xl flex items-center gap-2"
                >
                    <AlertTriangle /> CRITICAL FAILURE - CORE MELTDOWN
                </motion.div>
            )}

            {isCashedOut && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-neon-green font-bold text-xl flex items-center gap-2"
                >
                    <Shield /> CORE STABILIZED - ENERGY SECURED
                </motion.div>
            )}
        </div>
    );
};
