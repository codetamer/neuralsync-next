'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Fingerprint, Scan, Lock, Unlock, Zap, Activity, Shield } from 'lucide-react';

interface ArchetypeRevealProps {
    onComplete: () => void;
    archetypeTitle: string;
    traits: string[]; // e.g. ["High IQ", "Risk Taker", "Stoic"]
}

export const ArchetypeReveal = ({ onComplete, archetypeTitle, traits = [] }: ArchetypeRevealProps) => {
    const [step, setStep] = useState<'scan' | 'analyze' | 'decrypt' | 'unlock'>('scan');
    const [scanProgress, setScanProgress] = useState(0);
    const [currentTrait, setCurrentTrait] = useState(0);

    // --- STEP 1: NEURAL SCAN ---
    useEffect(() => {
        if (step === 'scan') {
            const interval = setInterval(() => {
                setScanProgress(prev => {
                    if (prev >= 100) {
                        clearInterval(interval);
                        setStep('analyze');
                        return 100;
                    }
                    return prev + 2; // Fast scan
                });
            }, 30);
            return () => clearInterval(interval);
        }
    }, [step]);

    // --- STEP 2: TRAIT ANALYSIS ---
    useEffect(() => {
        if (step === 'analyze') {
            const interval = setInterval(() => {
                setCurrentTrait(prev => {
                    if (prev >= traits.length * 2) { // Cycle through traits twice
                        clearInterval(interval);
                        setStep('decrypt');
                        return prev;
                    }
                    return prev + 1;
                });
            }, 400); // 400ms per trait flash
            return () => clearInterval(interval);
        }
    }, [step, traits.length]);

    // --- STEP 3: DECRYPTION & UNLOCK ---
    useEffect(() => {
        if (step === 'decrypt') {
            const timer = setTimeout(() => {
                setStep('unlock');
            }, 2000); // 2s of "Decrypting..." tension
            return () => clearTimeout(timer);
        }
    }, [step]);

    // --- STEP 4: COMPLETE ---
    useEffect(() => {
        if (step === 'unlock') {
            // Wait for unlock animation then finish
            const timer = setTimeout(() => {
                onComplete();
            }, 1500);
            return () => clearTimeout(timer);
        }
    }, [step, onComplete]);

    return (
        <div className="fixed inset-0 z-[2000] bg-black flex flex-col items-center justify-center overflow-hidden">
            {/* Ambient Background */}
            <div className="absolute inset-0 bg-grid-pattern opacity-[0.05]" />
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/20 via-black to-purple-900/20" />

            <AnimatePresence mode="wait">
                {/* --- PHASE 1: SCANNING --- */}
                {step === 'scan' && (
                    <motion.div
                        key="scan"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, scale: 2, filter: "blur(10px)" }}
                        className="flex flex-col items-center gap-8 w-full max-w-md px-4"
                    >
                        <div className="relative">
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                            >
                                <Scan className="w-24 h-24 text-cyan-500/50" />
                            </motion.div>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <Fingerprint className="w-12 h-12 text-cyan-400 animate-pulse" />
                            </div>
                        </div>

                        <div className="w-full space-y-2">
                            <div className="flex justify-between text-xs font-mono text-cyan-400">
                                <span>INITIALIZING NEURAL LINK...</span>
                                <span>{scanProgress}%</span>
                            </div>
                            <div className="h-2 w-full bg-cyan-900/30 rounded-full overflow-hidden border border-cyan-500/30">
                                <motion.div
                                    className="h-full bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.8)]"
                                    style={{ width: `${scanProgress}%` }}
                                />
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* --- PHASE 2: RAPID TRAIT FIRE --- */}
                {step === 'analyze' && (
                    <motion.div
                        key="analyze"
                        className="flex flex-col items-center justify-center h-full w-full"
                    >
                        <motion.div
                            key={currentTrait}
                            initial={{ scale: 0.5, opacity: 0, y: 50 }}
                            animate={{ scale: [1, 1.2], opacity: [0, 1, 0], y: 0 }}
                            transition={{ duration: 0.4 }}
                            className="text-4xl md:text-6xl font-display font-black text-white text-center tracking-tighter uppercase"
                        >
                            <span className="text-transparent bg-clip-text bg-gradient-to-br from-white to-white/50">
                                {traits[currentTrait % traits.length] || "ANALYZING..."}
                            </span>
                        </motion.div>
                        <div className="absolute bottom-20 flex gap-4 opacity-50">
                            <Activity className="w-6 h-6 text-purple-500 animate-bounce" />
                            <Zap className="w-6 h-6 text-yellow-500 animate-bounce delay-75" />
                            <Brain className="w-6 h-6 text-pink-500 animate-bounce delay-150" />
                        </div>
                    </motion.div>
                )}

                {/* --- PHASE 3: DECRYPTING --- */}
                {step === 'decrypt' && (
                    <motion.div
                        key="decrypt"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex flex-col items-center gap-6"
                    >
                        <motion.div
                            animate={{ scale: [1, 1.05, 1] }}
                            transition={{ repeat: Infinity, duration: 0.2 }}
                            className="text-red-500 font-mono text-xl tracking-[0.5em]"
                        >
                            ACCESSING CORE KERNEL
                        </motion.div>
                        <div className="font-mono text-xs text-red-500/60">
                            DECRYPTING ARCHETYPE DATA...
                        </div>
                        <div className="grid grid-cols-4 gap-1 p-4 bg-black/50 border border-red-900/30 rounded-sm">
                            {[...Array(16)].map((_, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0.1 }}
                                    animate={{ opacity: [0.1, 1, 0.1] }}
                                    transition={{ duration: 0.5, delay: i * 0.05, repeat: Infinity }}
                                    className="w-4 h-4 bg-red-500/50"
                                />
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* --- PHASE 4: UNLOCK --- */}
                {step === 'unlock' && (
                    <motion.div
                        key="unlock"
                        className="relative z-10 flex flex-col items-center"
                    >
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: [0, 1.2, 1] }}
                            transition={{ duration: 0.5, type: "spring" }}
                        >
                            <Unlock className="w-32 h-32 text-emerald-400 drop-shadow-[0_0_30px_rgba(52,211,153,0.6)]" />
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="mt-8 text-center space-y-2"
                        >
                            <h2 className="text-3xl font-display font-medium text-white">ARCHETYPE IDENTIFIED</h2>
                            <p className="text-emerald-400/80 font-mono tracking-widest text-sm">
                                {archetypeTitle.toUpperCase()}
                            </p>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
