'use client';

import { useRef, useState } from 'react';
import { motion, Variants } from 'framer-motion';
import { NeonButton } from '../ui/NeonButton';
import { GlassCard } from '../ui/GlassCard';
import { RankBadge } from '../ui/RankBadge';
import { Leaderboard } from '../Leaderboard';
import { useTestStore } from '../../store/useTestStore';
import { useRankedLockout } from '../../hooks/useRankedLockout';
import { useAuth } from '../../context/AuthContext';
import { getPlacementProgress, PLACEMENT_MATCHES } from '../../engine/RankedScoreEngine';
import { Brain, Activity, Zap, ArrowRight, ShieldCheck, Trophy, Lock, Crown, X, Shield, User } from 'lucide-react';

interface IntroStageProps {
    isResumeMode?: boolean;
    onResumeHandled?: () => void;
}

export const IntroStage = ({ isResumeMode = false, onResumeHandled }: IntroStageProps) => {
    const { nextStage, resetTest, isTestComplete, startRankedSession, isRanked, elo, rankTier, matchesPlayed } = useTestStore();
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
        // setIsStarting(false); // No need to reset as component will unmount/transition
    };

    const handleRankedStart = async () => {
        if (isLocked) return;
        setIsStarting(true);
        await new Promise(resolve => setTimeout(resolve, 500));
        startRankedSession();
        nextStage();
    };

    const handleResume = () => {
        onResumeHandled?.();
    };

    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.3
            }
        }
    };

    const itemVariants: Variants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 100,
                damping: 10
            }
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-full py-4 px-4 overflow-y-auto">
            {/* Background Effects */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-neon-teal to-transparent opacity-50" />
                <div className="absolute -top-40 -right-40 w-96 h-96 bg-neon-blue/10 rounded-full blur-[100px]" />
                <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-neon-purple/10 rounded-full blur-[100px]" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-amber-500/5 rounded-full blur-[120px] opacity-20" />
            </div>

            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="relative z-10 w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch"
            >
                {/* --- CARD 1: NEURAL PROFILE --- */}
                <GlassCard className="flex flex-col p-8 relative overflow-hidden h-full border-neon-teal/20 hover:border-neon-teal/40 transition-colors duration-500">
                    {/* Decorative Elements */}
                    <div className="absolute top-0 right-0 p-4 opacity-5">
                        <Brain className="w-32 h-32" />
                    </div>

                    <motion.div variants={itemVariants} className="flex-1 flex flex-col items-center text-center space-y-6">
                        <div className="relative">
                            <div className="absolute inset-0 bg-neon-teal/20 blur-xl rounded-full animate-pulse" />
                            <Brain className="w-16 h-16 text-neon-teal relative z-10 drop-shadow-[0_0_15px_rgba(45,212,191,0.5)]" />
                        </div>

                        <div>
                            <h2 className="text-4xl font-display font-bold text-white tracking-tight mb-2">
                                NEURAL<span className="text-neon-teal">PROFILE</span>
                            </h2>
                            <div className="flex items-center justify-center gap-2 font-mono text-xs tracking-[0.3em] uppercase opacity-80">
                                {user ? (
                                    <>
                                        <span className="w-1.5 h-1.5 bg-neon-blue rounded-full animate-pulse" />
                                        <span className="text-neon-blue">SYSTEM ONLINE</span>
                                        <span className="w-1.5 h-1.5 bg-neon-blue rounded-full animate-pulse" />
                                    </>
                                ) : (
                                    <>
                                        <span className="w-1.5 h-1.5 bg-white/30 rounded-full" />
                                        <span className="text-white/50">GUEST MODE ACCESS</span>
                                        <span className="w-1.5 h-1.5 bg-white/30 rounded-full" />
                                    </>
                                )}
                            </div>
                        </div>

                        <div className="space-y-4 max-w-sm">
                            <h3 className="text-xl font-bold text-white">
                                Discover Your <span className="text-neon-teal">Cognitive Blueprint</span>
                            </h3>
                            <p className="text-sm text-white/60 leading-relaxed">
                                A comprehensive multi-dimensional assessment designed to map your unique cognitive signature across key domains.
                            </p>

                            <ul className="text-left space-y-3 mt-4">
                                <li className="flex items-start gap-3 text-sm text-white/80">
                                    <div className="mt-1 min-w-[16px]"><Zap className="w-4 h-4 text-neon-purple" /></div>
                                    <div>
                                        <span className="font-bold text-white block">Fluid Intelligence</span>
                                        <span className="text-xs text-white/50">Pattern recognition & complex problem solving</span>
                                    </div>
                                </li>
                                <li className="flex items-start gap-3 text-sm text-white/80">
                                    <div className="mt-1 min-w-[16px]"><Activity className="w-4 h-4 text-neon-green" /></div>
                                    <div>
                                        <span className="font-bold text-white block">Executive Function</span>
                                        <span className="text-xs text-white/50">Working memory, attention control & mental agility</span>
                                    </div>
                                </li>
                                <li className="flex items-start gap-3 text-sm text-white/80">
                                    <div className="mt-1 min-w-[16px]"><Brain className="w-4 h-4 text-neon-blue" /></div>
                                    <div>
                                        <span className="font-bold text-white block">Detailed Analytics</span>
                                        <span className="text-xs text-white/50">Get clinical-grade insights into your mind's architecture</span>
                                    </div>
                                </li>
                            </ul>
                        </div>

                        <div className="pt-6 w-full max-w-xs mt-auto">
                            {isResumeMode && !isRanked ? (
                                <div className="space-y-3">
                                    <NeonButton onClick={handleResume} size="lg" className="w-full group" glow>
                                        <span className="flex items-center justify-center gap-2">
                                            CONTINUE ASSESSMENT <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                        </span>
                                    </NeonButton>
                                    <button onClick={handleStartNew} disabled={isStarting} className="text-xs text-white/40 hover:text-white transition-colors underline decoration-white/20">
                                        {isStarting ? 'Initializing...' : 'Restart Session'}
                                    </button>
                                </div>
                            ) : (
                                <NeonButton onClick={handleStartNew} disabled={isStarting} size="lg" className="w-full group" glow>
                                    <span className="flex items-center justify-center gap-2">
                                        {isStarting ? (
                                            <>INITIALIZING <span className="animate-pulse">...</span></>
                                        ) : (
                                            <>INITIALIZE EVALUATION <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></>
                                        )}
                                    </span>
                                </NeonButton>
                            )}
                        </div>
                    </motion.div>
                </GlassCard>

                {/* --- CARD 2: RANKED GAUNTLET --- */}
                <GlassCard className="flex flex-col p-8 relative overflow-hidden h-full border-amber-500/20 hover:border-amber-500/40 transition-colors duration-500">
                    {/* Decorative Elements */}
                    <div className="absolute top-0 right-0 p-4 opacity-5">
                        <Trophy className="w-32 h-32" />
                    </div>

                    <motion.div variants={itemVariants} className="flex-1 flex flex-col items-center text-center space-y-6">
                        <div className="relative">
                            <div className="absolute inset-0 bg-amber-500/20 blur-xl rounded-full animate-pulse" />
                            <Trophy className="w-16 h-16 text-amber-500 relative z-10 drop-shadow-[0_0_15px_rgba(245,158,11,0.5)]" />
                        </div>

                        <div>
                            <h2 className="text-4xl font-display font-bold text-white tracking-tight mb-2">
                                RANKED<span className="text-amber-500">GAUNTLET</span>
                            </h2>
                            <div className="flex items-center justify-center gap-2 text-amber-500 font-mono text-xs tracking-[0.3em] uppercase opacity-90">
                                <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse" />
                                COMPETITIVE PROTOCOL ACTIVE
                                <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse" />
                            </div>
                        </div>

                        <div className="space-y-4 max-w-sm">
                            <h3 className="text-xl font-bold text-white">
                                Prove Your <span className="text-amber-500">Dominance</span>
                            </h3>
                            <p className="text-sm text-white/60 leading-relaxed">
                                The ultimate test of cognitive endurance. Compete against the global elite in a calibrated, high-stakes environment.
                            </p>

                            <ul className="text-left space-y-3 mt-4">
                                <li className="flex items-start gap-3 text-sm text-white/80">
                                    <div className="mt-1 min-w-[16px]"><Trophy className="w-4 h-4 text-amber-400" /></div>
                                    <div>
                                        <span className="font-bold text-white block">Global Leaderboard</span>
                                        <span className="text-xs text-white/50">Rank against thousands of other users worldwide</span>
                                    </div>
                                </li>
                                <li className="flex items-start gap-3 text-sm text-white/80">
                                    <div className="mt-1 min-w-[16px]"><ShieldCheck className="w-4 h-4 text-orange-400" /></div>
                                    <div>
                                        <span className="font-bold text-white block">Standardized Protocol</span>
                                        <span className="text-xs text-white/50">Strict rules ensure fair ELO skill rating</span>
                                    </div>
                                </li>
                            </ul>

                            <div className="text-xs text-red-200/80 leading-relaxed border border-red-500/30 bg-red-900/20 p-3 rounded-lg text-left mt-4">
                                <div className="flex items-center gap-2 mb-1 text-red-400 font-bold uppercase tracking-wider text-[10px]">
                                    <Shield className="w-3 h-3" /> Warning: Hardcore Mode
                                </div>
                                <span className="opacity-80">Focus loss = Disqualification. No retries.</span>
                            </div>
                        </div>

                        {/* Ranked Stats Preview (if active) */}
                        {matchesPlayed > 0 && (
                            <div className="grid grid-cols-2 gap-3 w-full max-w-xs bg-black/20 rounded-lg p-3 border border-white/5">
                                <div>
                                    <p className="text-[10px] text-white/30 font-mono uppercase">Current ELO Rating</p>
                                    <p className="text-xl font-display font-bold text-amber-500">{elo}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] text-white/30 font-mono uppercase">Matches</p>
                                    <p className="text-xl font-display font-bold text-white">{matchesPlayed}</p>
                                </div>
                            </div>
                        )}

                        <div className="pt-6 w-full max-w-xs mt-auto">
                            {isResumeMode && isRanked ? (
                                <div className="space-y-3">
                                    <button
                                        onClick={handleResume}
                                        className="w-full py-4 px-6 rounded-lg flex items-center justify-center gap-2 font-mono text-sm font-bold tracking-wider bg-gradient-to-r from-amber-600/20 to-orange-600/20 border border-amber-500/50 text-amber-100 hover:bg-amber-600/30 hover:border-amber-500 hover:shadow-[0_0_20px_rgba(245,158,11,0.3)] transition-all relative overflow-hidden group"
                                    >
                                        <Zap className="w-4 h-4 group-hover:fill-current" />
                                        REJOIN GAUNTLET
                                    </button>
                                    <button onClick={handleRankedStart} disabled={isStarting} className="text-xs text-white/40 hover:text-white transition-colors underline decoration-white/20 w-full text-center block">
                                        {isStarting ? 'Initializing...' : 'Forfeit & Restart'}
                                    </button>
                                </div>
                            ) : (
                                <button
                                    onClick={handleRankedStart}
                                    disabled={isLocked || isStarting}
                                    className={`
                                    w-full py-4 px-6 rounded-lg flex items-center justify-center gap-2 font-mono text-sm font-bold tracking-wider transition-all relative overflow-hidden group
                                    ${isLocked || isStarting
                                            ? 'bg-neutral-900/50 text-neutral-500 cursor-not-allowed border border-white/5'
                                            : 'bg-gradient-to-r from-amber-600/20 to-orange-600/20 border border-amber-500/50 text-amber-100 hover:bg-amber-600/30 hover:border-amber-500 hover:shadow-[0_0_20px_rgba(245,158,11,0.3)]'
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
                                            <Zap className="w-4 h-4 animate-pulse" />
                                            INITIALIZING...
                                        </>
                                    ) : (
                                        <>
                                            <Zap className="w-4 h-4 group-hover:fill-current" />
                                            INITIATE GAUNTLET
                                        </>
                                    )}
                                </button>
                            )}
                        </div>
                    </motion.div>
                </GlassCard>
            </motion.div>

            <p className="mt-8 text-[10px] text-white/20 font-mono text-center">
                SESSION ESTIMATE: 12-15 MINUTES • QUIET ENVIRONMENT REQUIRED
            </p>

            {/* Leaderboard Toggle */}
            <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onClick={() => setShowLeaderboard(true)}
                className="fixed bottom-4 right-4 p-3 rounded-full bg-white/5 border border-white/10 text-white/50 hover:text-white hover:bg-white/10 transition-colors backdrop-blur-md z-50 flex items-center gap-2"
                title="View Leaderboard"
            >
                <Crown className="w-5 h-5" />
                <span className="hidden md:inline text-xs font-bold pr-1">LEADERBOARD</span>
            </motion.button>

            {/* Leaderboard Modal */}
            {showLeaderboard && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="w-full max-w-xl relative my-auto"
                    >
                        <Leaderboard onClose={() => setShowLeaderboard(false)} />
                    </motion.div>
                </div>
            )}
        </div>
    );
};
