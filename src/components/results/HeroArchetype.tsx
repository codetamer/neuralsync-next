'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Sparkles, Activity, Zap } from 'lucide-react';

interface HeroArchetypeProps {
    archetype: string;
    description: string;
    matchScore: number;
    colorTheme?: string;
}

export const HeroArchetype = ({ archetype, description, matchScore, colorTheme = 'text-neon-cyan' }: HeroArchetypeProps) => {
    const [reveal, setReveal] = useState(false);
    const [glitchText, setGlitchText] = useState("ANALYZING...");

    // Glitch Effect Setup
    useEffect(() => {
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()";
        const targetText = archetype.toUpperCase();
        let iterations = 0;

        const interval = setInterval(() => {
            setGlitchText(targetText.split("")
                .map((char, index) => {
                    if (index < iterations) return char;
                    return chars[Math.floor(Math.random() * chars.length)];
                })
                .join("")
            );

            if (iterations >= targetText.length) {
                clearInterval(interval);
                setReveal(true);
            }
            iterations += 1 / 3; // Speed of decode
        }, 30);

        return () => clearInterval(interval);
    }, [archetype]);

    return (
        <div className="relative w-full min-h-[400px] flex flex-col items-center justify-center text-center overflow-hidden mb-12">

            {/* Background Grid & Particles */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-black to-black z-0" />
            <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px] z-0 pointer-events-none" />

            {/* Main Content */}
            <div className="relative z-10 max-w-4xl px-6">

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6 flex justify-center"
                >
                    <div className="bg-white/5 border border-white/10 px-4 py-1.5 rounded-full backdrop-blur-md flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        <span className={`text-xs font-mono tracking-widest ${colorTheme}`}>NEURAL SIGNATURE CONFIRMED</span>
                    </div>
                </motion.div>

                <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-white/50 mb-6 drop-shadow-[0_0_30px_rgba(255,255,255,0.2)]">
                    {glitchText}
                </h1>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: reveal ? 1 : 0 }}
                    transition={{ duration: 1, delay: 0.5 }}
                >
                    <p className="text-xl md:text-2xl text-white/70 font-light max-w-2xl mx-auto leading-relaxed italic">
                        "{description}"
                    </p>
                </motion.div>

                {/* Match Score Badge */}
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: reveal ? 1 : 0 }}
                    transition={{ type: "spring", stiffness: 260, damping: 20, delay: 1 }}
                    className="mt-12 inline-flex flex-col items-center gap-2"
                >
                    <div className="relative">
                        <svg className="w-24 h-24 transform -rotate-90">
                            <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-white/10" />
                            <motion.circle
                                cx="48" cy="48" r="40"
                                stroke="currentColor"
                                strokeWidth="4"
                                fill="transparent"
                                className={`${colorTheme} drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]`}
                                initial={{ strokeDasharray: "251 251", strokeDashoffset: 251 }}
                                animate={{ strokeDashoffset: 251 - (251 * matchScore) / 100 }}
                                transition={{ duration: 2, delay: 1.5 }}
                            />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center flex-col">
                            <span className="text-2xl font-bold text-white">{matchScore}%</span>
                            <span className="text-[10px] text-white/50 uppercase">Match</span>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Decorative Orbs */}
            <motion.div
                animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.1, 0.3, 0.1]
                }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[100px] pointer-events-none"
            />
            <motion.div
                animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.1, 0.2, 0.1]
                }}
                transition={{ duration: 5, repeat: Infinity, delay: 2 }}
                className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[100px] pointer-events-none"
            />

        </div>
    );
};
