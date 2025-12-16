'use client';

import { useRef, useState } from 'react';
import { motion, Variants } from 'framer-motion';
import { NeonButton } from '../ui/NeonButton';


import { RankBadge } from '../ui/RankBadge';
import { Leaderboard } from '../Leaderboard';
import { useTestStore } from '../../store/useTestStore';
import { useRankedLockout } from '../../hooks/useRankedLockout';
import { useAuth } from '../../context/AuthContext';
import { getPlacementProgress, PLACEMENT_MATCHES } from '../../engine/RankedScoreEngine';
import { Brain, Activity, Zap, ArrowRight, ShieldCheck, Trophy, Lock, Crown, X, Shield, User, ScanLine, Flame } from 'lucide-react';

interface IntroStageProps {
    isResumeMode?: boolean;
    onResumeHandled?: () => void;
}

export const IntroStage = ({ isResumeMode = false, onResumeHandled }: IntroStageProps) => {
    const { nextStage, resetTest, isTestComplete, startRankedSession, startQuickSession, isRanked, elo, rankTier, matchesPlayed } = useTestStore();
    const { isLocked, timeRemaining } = useRankedLockout();
    const { user } = useAuth();
    const [showLeaderboard, setShowLeaderboard] = useState(false);
    const [isStarting, setIsStarting] = useState(false);

    const handleStartNew = async () => {
        setIsStarting(true);
        // Small delay to ensure UI updates and transition feels deliberate
        await new Promise(resolve => setTimeout(resolve, 500));
        resetTest();
        nextStage();
        onResumeHandled?.();
    };

    const handleReset = async () => {
        setIsStarting(true);
        await new Promise(resolve => setTimeout(resolve, 500));
        resetTest();
        setIsStarting(false); // Fix: Ensure we exit the loading state
        // Resetting returns to empty state (no nextStage call)
        onResumeHandled?.();
    };

    const handleRankedStart = async () => {
        if (isLocked) return;
        setIsStarting(true);
        await new Promise(resolve => setTimeout(resolve, 500));
        startRankedSession();
    };

    const handleResume = () => {
        onResumeHandled?.();
    };

    const handleQuickStart = async () => {
        setIsStarting(true);
        await new Promise(resolve => setTimeout(resolve, 500));
        startQuickSession();
        onResumeHandled?.();
    };

    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15,
                delayChildren: 0.2
            }
        }
    };

    const itemVariants: Variants = {
        hidden: { y: 30, opacity: 0, scale: 0.95 },
        visible: {
            y: 0,
            opacity: 1,
            scale: 1,
            transition: {
                type: "spring",
                stiffness: 120,
                damping: 20
            }
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen py-12 px-4 overflow-x-hidden relative">
            {/* Cinematic Background */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-0 left-0 w-full h-full bg-grid-pattern opacity-[0.05]" />
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent opacity-50" />

                {/* Ambient Orbs - Toned down for clarity */}
                <motion.div
                    animate={{ scale: [1, 1.1, 1], opacity: [0.1, 0.15, 0.1] }}
                    transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                    className="absolute -top-[10%] -right-[5%] w-[600px] h-[600px] bg-cyan-900/10 rounded-full blur-[100px]"
                />
                <motion.div
                    animate={{ scale: [1, 1.2, 1], opacity: [0.05, 0.1, 0.05] }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear", delay: 5 }}
                    className="absolute bottom-[0%] -left-[10%] w-[500px] h-[500px] bg-purple-900/10 rounded-full blur-[100px]"
                />
            </div>

            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="relative z-10 w-full max-w-7xl mx-auto flex flex-col items-center gap-12"
            >
                {/* --- HEADER SECTION --- */}
                <motion.div variants={itemVariants} className="text-center space-y-4 max-w-3xl px-4">


                    {/* Tagline Only - Sleek Look */}
                    {/* Tagline Only - Sleek Look */}
                    <div className="py-4">
                        <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-light text-white leading-tight max-w-4xl mx-auto">
                            The <span className="font-medium text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-400">advanced cognitive benchmarking suite.</span>
                            <br className="hidden md:block" />
                            <span className="text-white/60 text-xl md:text-2xl mt-4 block">Map your neural architecture and compete in the global ranked gauntlet.</span>
                        </h1>
                    </div>
                </motion.div>

                {/* --- CARDS GRID --- */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 w-full items-stretch">
                    {/* --- CARD 1: NEURAL PROFILE --- */}
                    <motion.div variants={itemVariants} className="h-full flex flex-col">
                        <div className="glass-card h-full flex flex-col p-8 lg:p-10 relative overflow-hidden group border-white/10 hover:border-cyan-500/30 transition-all duration-500 rounded-3xl hover:shadow-[0_0_30px_rgba(34,211,238,0.1)]">
                            {/* Hover Glow */}
                            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                            <div className="relative z-10 flex flex-col h-full">
                                {/* Icon Header */}
                                <div className="flex items-center justify-between mb-8">
                                    <div className="p-3 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 box-border border border-cyan-500/30 group-hover:scale-110 transition-transform duration-500">
                                        <Brain className="w-8 h-8 text-cyan-400" />
                                    </div>
                                    <div className="text-xs font-mono text-cyan-300/50 uppercase tracking-widest bg-cyan-950/30 px-3 py-1 rounded-full border border-cyan-500/10">
                                        Standard Protocol
                                    </div>
                                </div>

                                {/* Title */}
                                <div className="mb-6">
                                    <h2 className="text-4xl lg:text-5xl font-display font-bold text-white tracking-tighter mb-2 group-hover:translate-x-1 transition-transform">
                                        NEURAL<span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">PROFILE</span>
                                    </h2>
                                    <p className="text-cyan-100/60 font-mono text-xs tracking-wider uppercase flex items-center gap-2">
                                        {user ? <span className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse" /> : <span className="w-2 h-2 bg-white/20 rounded-full" />}
                                        {user ? "System Online // Ready for Sync" : "Guest Access // Preview Mode"}
                                    </p>
                                </div>

                                {/* Feature List */}
                                <div className="space-y-4 mb-8 flex-1">
                                    <p className="text-white/70 leading-relaxed text-sm lg:text-base border-l-2 border-cyan-500/30 pl-4 py-1">
                                        Comprehensive analysis of Fluid IQ, Executive Function, and Mental Agility.
                                    </p>

                                    <div className="grid grid-cols-1 gap-3 mt-6">
                                        {[
                                            { title: "Fluid Intelligence", desc: "Pattern recognition & logic", icon: <Zap className="w-4 h-4 text-purple-400" /> },
                                            { title: "Executive Function", desc: "Working memory & focus", icon: <Activity className="w-4 h-4 text-emerald-400" /> },
                                            { title: "Neural Signature", desc: "Detailed breakdown", icon: <ScanLine className="w-4 h-4 text-cyan-400" /> }
                                        ].map((feature, i) => (
                                            <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors border border-white/5 group/item">
                                                <div className="p-2 rounded-md bg-black/20 group-hover/item:bg-black/40 transition-colors">{feature.icon}</div>
                                                <div>
                                                    <div className="text-sm font-bold text-white">{feature.title}</div>
                                                    <div className="text-[10px] text-white/40 uppercase tracking-wide group-hover/item:text-white/60 transition-colors">{feature.desc}</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Buttons */}
                                <div className="space-y-3 mt-auto relative z-20">
                                    {isResumeMode && !isRanked ? (
                                        <>
                                            <NeonButton onClick={handleResume} size="lg" className="w-full group rounded-xl" variant="primary" glow>
                                                <span className="flex items-center justify-center gap-2">
                                                    RESUME SYNC <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                                </span>
                                            </NeonButton>
                                            <button onClick={handleReset} className="text-xs text-white/30 hover:text-white transition-colors w-full text-center hover:underline">
                                                CLEAR PROGRESS
                                            </button>
                                        </>
                                    ) : (
                                        <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-3">
                                            <NeonButton onClick={handleStartNew} disabled={isStarting} size="lg" className="w-full group rounded-xl" variant="primary" glow>
                                                <span className="flex items-center justify-center gap-2">
                                                    {isStarting ? "INITIALIZING..." : <>FULL EVALUATION <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></>}
                                                </span>
                                            </NeonButton>

                                            <button
                                                onClick={handleQuickStart}
                                                disabled={isStarting}
                                                className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-cyan-500/10 hover:border-cyan-500/50 text-white/60 hover:text-cyan-400 transition-all flex flex-col items-center justify-center gap-1 min-w-[100px] group/quick"
                                                title="Quick Scan Mode"
                                            >
                                                <Zap className="w-4 h-4 group-hover/quick:scale-110 transition-transform" />
                                                <span className="text-[10px] font-bold uppercase">Quick Scan</span>
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* --- CARD 2: RANKED GAUNTLET --- */}
                    <motion.div variants={itemVariants} className="h-full flex flex-col">
                        <div className="glass-card h-full flex flex-col p-8 lg:p-10 relative overflow-hidden group border-white/10 hover:border-amber-500/30 transition-all duration-500 rounded-3xl hover:shadow-[0_0_30px_rgba(245,158,11,0.1)]">
                            {/* Hover Glow */}
                            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                            <div className="relative z-10 flex flex-col h-full">
                                {/* Icon Header */}
                                <div className="flex items-center justify-between mb-8">
                                    <div className="p-3 rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-600/20 box-border border border-amber-500/30 group-hover:scale-110 transition-transform duration-500">
                                        <Trophy className="w-8 h-8 text-amber-400" />
                                    </div>
                                    <div className="flex items-center gap-2 text-xs font-mono text-amber-300/50 uppercase tracking-widest bg-amber-950/30 px-3 py-1 rounded-full border border-amber-500/10">
                                        <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse"></span>
                                        Competitive
                                    </div>
                                </div>

                                {/* Title */}
                                <div className="mb-6">
                                    <h2 className="text-4xl lg:text-5xl font-display font-bold text-white tracking-tighter mb-2 group-hover:translate-x-1 transition-transform">
                                        RANKED<span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-600">GAUNTLET</span>
                                    </h2>
                                    <p className="text-amber-100/60 font-mono text-xs tracking-wider uppercase flex items-center gap-2">
                                        Prove Your Dominance // Season 1 Active
                                    </p>
                                </div>

                                {/* Feature List */}
                                <div className="space-y-4 mb-8 flex-1">
                                    <p className="text-white/70 leading-relaxed text-sm lg:text-base border-l-2 border-amber-500/30 pl-4 py-1">
                                        High-stakes competitive protocol. Normalized scoring for fair global comparison.
                                    </p>

                                    <div className="grid grid-cols-1 gap-3 mt-6">
                                        {[
                                            { title: "Global Leaderboard", desc: "Compete worldwide", icon: <Crown className="w-4 h-4 text-yellow-400" /> },
                                            { title: "Standardized Protocol", desc: "Fair ELO Rating", icon: <ShieldCheck className="w-4 h-4 text-orange-400" /> },
                                            { title: "Hardcore Rules", desc: "One shot. No retries.", icon: <Flame className="w-4 h-4 text-red-500" /> }
                                        ].map((feature, i) => (
                                            <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors border border-white/5 group/item">
                                                <div className="p-2 rounded-md bg-black/20 group-hover/item:bg-black/40 transition-colors">{feature.icon}</div>
                                                <div>
                                                    <div className="text-sm font-bold text-white">{feature.title}</div>
                                                    <div className="text-[10px] text-white/40 uppercase tracking-wide group-hover/item:text-white/60 transition-colors">{feature.desc}</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Ranked Stats Mini-Dash */}
                                    {matchesPlayed > 0 && (
                                        <div className="mt-4 p-4 rounded-xl bg-gradient-to-r from-amber-950/40 to-black border border-amber-500/20 flex items-center justify-between">
                                            <div>
                                                <p className="text-[10px] text-amber-500/60 font-bold uppercase">Current Rating</p>
                                                <p className="text-2xl font-mono font-bold text-amber-400">{elo}</p>
                                            </div>
                                            <div className="h-8 w-px bg-white/10" />
                                            <div>
                                                <p className="text-[10px] text-white/30 font-bold uppercase">Matches</p>
                                                <p className="text-xl font-mono font-bold text-white">{matchesPlayed}</p>
                                            </div>
                                            <div className="h-8 w-px bg-white/10" />
                                            <div>
                                                <RankBadge tier={rankTier} size="sm" />
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Actions */}
                                <div className="space-y-3 mt-auto relative z-20">
                                    {isResumeMode && isRanked ? (
                                        <div className="space-y-3">
                                            <NeonButton onClick={handleResume} size="lg" className="w-full rounded-xl" color="amber" glow>
                                                REJOIN MATCH
                                            </NeonButton>
                                            <button onClick={handleRankedStart} disabled={isStarting} className="text-xs text-red-400/50 hover:text-red-400 transition-colors w-full text-center">
                                                FORFEIT & RESTART
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col gap-3">
                                            <button
                                                onClick={handleRankedStart}
                                                disabled={isLocked || isStarting}
                                                className={`
                                                        w-full py-4 px-6 rounded-xl flex items-center justify-center gap-3 font-mono text-sm font-bold tracking-wider transition-all relative overflow-hidden group
                                                        ${isLocked || isStarting
                                                        ? 'bg-neutral-900/50 text-neutral-500 cursor-not-allowed border border-white/5'
                                                        : 'bg-gradient-to-r from-amber-600/20 to-orange-600/20 border border-amber-500/50 text-amber-100 hover:bg-amber-600/30 hover:border-amber-500 hover:shadow-[0_0_30px_rgba(245,158,11,0.2)]'
                                                    }
                                                    `}
                                            >
                                                {isLocked ? (
                                                    <>
                                                        <Lock className="w-4 h-4" />
                                                        LOCKED: {timeRemaining}
                                                    </>
                                                ) : isStarting ? (
                                                    <>
                                                        <Zap className="w-4 h-4 animate-spin" />
                                                        INITIALIZING...
                                                    </>
                                                ) : (
                                                    <>
                                                        <Trophy className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                                        INITIATE GAUNTLET
                                                    </>
                                                )}
                                            </button>

                                            <button
                                                onClick={() => setShowLeaderboard(true)}
                                                className="w-full py-3 px-6 rounded-xl border border-white/5 bg-white/5 text-xs font-mono font-bold tracking-wider text-white/40 uppercase hover:bg-white/10 hover:text-amber-400 hover:border-amber-500/30 transition-all flex items-center justify-center gap-2 group/leaderboard"
                                            >
                                                <Crown className="w-3 h-3 group-hover/leaderboard:text-amber-400 transition-colors" />
                                                View Global Standings
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* --- FOOTER / INFO --- */}
                <motion.div
                    variants={itemVariants}
                    className="flex flex-col items-center gap-4 mt-8 pb-8"
                >
                    <p className="text-[10px] text-white/20 font-mono tracking-[0.2em] uppercase text-center">
                        NeuralSync v2.1 // Cognitive Enhancement Suite
                    </p>
                </motion.div>
            </motion.div>

            {/* Leaderboard Modal */}
            {showLeaderboard && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 overflow-y-auto">
                    <div className="absolute inset-0 bg-grid-pattern opacity-[0.05]" />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        className="w-full max-w-4xl relative my-auto z-10 flex justify-center"
                    >

                        <Leaderboard onClose={() => setShowLeaderboard(false)} />
                    </motion.div>
                </div>
            )}
        </div>
    );
};
