'use client';

import { useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useTestStore } from '../../store/useTestStore';
import { EloEngine } from '../../engine/EloEngine';
import { calculateRankedScore, getGradeStyle, getPlacementProgress, PLACEMENT_MATCHES } from '../../engine/RankedScoreEngine';
import { RankBadge } from '../ui/RankBadge';
import { NeonButton } from '../ui/NeonButton';
import { GlassCard } from '../ui/GlassCard';
import { Leaderboard } from '../Leaderboard';
import {
    Trophy, TrendingUp, TrendingDown, Minus, Clock, Target, Zap, Home, RotateCcw,
    Crown, Activity, Brain, Crosshair, Shield, Share2, Award
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { UserService } from '../../services/UserService';
import {
    Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip
} from 'recharts';
import { AchievementEngine, ACHIEVEMENTS, Achievement } from '../../engine/AchievementEngine';
import { AnimatePresence } from 'framer-motion';

export const RankedResultsDashboard = () => {
    const {
        elo,
        rankTier,
        matchesPlayed,
        responses,
        stages,
        resetTest,
        startRankedSession,
        updateElo,
        isTestComplete
    } = useTestStore();

    const [previousElo, setPreviousElo] = useState(elo);
    const [eloUpdated, setEloUpdated] = useState(false);
    const [showLeaderboard, setShowLeaderboard] = useState(false);
    const [newAchievements, setNewAchievements] = useState<Achievement[]>([]);
    const [showRankUp, setShowRankUp] = useState<{ old: string, new: string } | null>(null);

    // Calculate performance
    const rankedScore = useMemo(() => {
        return calculateRankedScore(responses, stages);
    }, [responses, stages]);

    const gradeStyle = getGradeStyle(rankedScore.grade);
    const placement = getPlacementProgress(matchesPlayed);
    const { user } = useAuth();

    // Derived Metrics
    const cognitiveAPM = useMemo(() => {
        const reactionStages = rankedScore.stageScores.filter(s => s.type === 'reactiontime' || s.type === 'symbolmatch');
        if (!reactionStages.length) return 0;
        // Simplified APM: (60s / avg latency in sec) * weight
        const avgLat = reactionStages.reduce((acc, s) => acc + s.timeMs, 0) / reactionStages.length;
        return Math.round((60000 / Math.max(100, avgLat)) * 1.5);
    }, [rankedScore]);

    const consistencyScore = useMemo(() => {
        // Variance in efficiency across stages
        const efficiencies = rankedScore.stageScores.map(s => s.efficiency);
        if (efficiencies.length < 2) return 0; // Need at least 2 points for consistency
        const mean = efficiencies.reduce((a, b) => a + b, 0) / efficiencies.length;
        const variance = efficiencies.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / efficiencies.length;
        const stdDev = Math.sqrt(variance);
        // Lower deviation = higher consistency score (100 - stdDev)
        return Math.max(0, Math.round(100 - stdDev));
    }, [rankedScore]);

    // Radar Data
    const radarData = useMemo(() => [
        { subject: 'Logic', A: rankedScore.stageScores.filter(s => s.type === 'matrix').reduce((acc, s) => acc + s.accuracy, 0) / 3 || 0, fullMark: 100 },
        { subject: 'Memory', A: rankedScore.stageScores.filter(s => s.type === 'nback' || s.type === 'spatialspan').reduce((acc, s) => acc + s.accuracy, 0) / 2 || 0, fullMark: 100 },
        { subject: 'Speed', A: rankedScore.stageScores.filter(s => s.type === 'symbolmatch' || s.type === 'reactiontime').reduce((acc, s) => acc + s.efficiency, 0) / 2 || 0, fullMark: 100 },
        { subject: 'Focus', A: consistencyScore || 0, fullMark: 100 },
        { subject: 'Exec', A: rankedScore.stageScores.find(s => s.type === 'trailmaking')?.accuracy || 0, fullMark: 100 },
    ], [rankedScore, consistencyScore]);

    // Update ELO
    useEffect(() => {
        if (!eloUpdated && rankedScore.eloInput > 0) {
            setPreviousElo(elo);
            updateElo(rankedScore.eloInput);
            setEloUpdated(true);

            const oldTier = EloEngine.getRankTier(elo);
            const newTier = EloEngine.getRankTier(elo + rankedScore.eloInput);

            if (newTier !== oldTier && rankedScore.eloInput > 0) {
                setShowRankUp({ old: oldTier, new: newTier });
            }

            if (user) {
                // 1. Save Result
                UserService.saveMatchResult(user.uid, {
                    ...rankedScore,
                    matchesPlayed: matchesPlayed + 1,
                    newElo: elo + rankedScore.eloInput,
                    newTier: newTier,
                    timestamp: new Date()
                }).then(async () => {
                    // 2. Check Achievements
                    const profile = await UserService.getUserProfile(user.uid);
                    if (profile) {
                        const currentStats = {
                            elo: profile.elo,
                            matchesPlayed: profile.matchesPlayed,
                            winRate: 50, // Todo: calculate real winrate
                            streak: profile.streak,
                            highestScore: rankedScore.accuracy // proximate
                        };

                        const newUnlocks = AchievementEngine.evaluate(currentStats, profile.achievements || []);

                        if (newUnlocks.length > 0) {
                            setNewAchievements(newUnlocks);
                            // Persist unlocks
                            newUnlocks.forEach(ach => UserService.unlockAchievement(user.uid, ach.id));
                        }
                    }
                }).catch(console.error);
            }
        }
    }, [eloUpdated, elo, rankedScore, updateElo, user, matchesPlayed]);

    const eloDelta = elo - previousElo;
    const newTier = EloEngine.getRankTier(elo);

    if (!isTestComplete) return null;

    if (showLeaderboard) {
        return (
            <div className="w-full min-h-screen p-6">
                <div className="max-w-4xl mx-auto">
                    <Leaderboard onClose={() => setShowLeaderboard(false)} />
                </div>
            </div>
        );
    }

    // Rank Up Modal
    if (showRankUp) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4">
                <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="max-w-md w-full text-center"
                >
                    <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-neon-blue via-neon-purple to-neon-pink blur-[100px] opacity-50" />
                        <GlassCard className="p-10 relative border-neon-blue shadow-[0_0_50px_rgba(34,211,238,0.4)]">
                            <div className="mb-4 text-neon-blue font-bold tracking-[0.5em] text-sm uppercase">Rank Promoted</div>
                            <div className="text-6xl mb-6 flex justify-center">
                                <Crown className="w-24 h-24 text-yellow-400 drop-shadow-[0_0_15px_rgba(250,204,21,0.8)] animate-pulse" />
                            </div>
                            <h2 className="text-4xl font-bold text-white mb-2">{showRankUp.new}</h2>
                            <p className="text-white/50 mb-8">You have ascended from {showRankUp.old}.</p>

                            <NeonButton onClick={() => setShowRankUp(null)} fullWidth glow>
                                CONTINUE
                            </NeonButton>
                        </GlassCard>
                    </div>
                </motion.div>
            </div>
        );
    }

    // Achievement Unlock Modal
    if (newAchievements.length > 0) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="max-w-md w-full"
                >
                    <GlassCard className="p-8 text-center border-neon-cyan/50 shadow-[0_0_50px_rgba(34,211,238,0.2)]">
                        <div className="mx-auto w-20 h-20 rounded-full bg-neon-cyan/20 flex items-center justify-center mb-6 animate-bounce">
                            <Award className="w-10 h-10 text-neon-cyan" />
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-2">ACHIEVEMENT UNLOCKED!</h2>
                        <div className="space-y-4 mb-8">
                            {newAchievements.map(ach => (
                                <div key={ach.id} className="p-4 rounded-lg bg-white/5 border border-white/10">
                                    <div className="text-3xl mb-2">{ach.icon}</div>
                                    <div className="font-bold text-neon-teal">{ach.title}</div>
                                    <div className="text-sm text-white/50">{ach.description}</div>
                                </div>
                            ))}
                        </div>
                        <NeonButton onClick={() => setNewAchievements([])} fullWidth glow>
                            AWESOME
                        </NeonButton>
                    </GlassCard>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="w-full min-h-screen p-4 md:p-8 overflow-auto bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-[#0a0a0a] to-black">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="max-w-6xl mx-auto space-y-6"
            >
                {/* HERO SECTION */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* LEFT: Grade & Rank */}
                    <GlassCard className="lg:col-span-4 p-8 flex flex-col items-center justify-center relative overflow-hidden group">
                        <div className={`absolute inset-0 opacity-10 blur-3xl ${gradeStyle.bg}`} />
                        <h3 className="text-neural-muted font-mono tracking-widest text-sm mb-4">MATCH GRADE</h3>
                        <motion.div
                            initial={{ scale: 3, opacity: 0, rotate: -10 }}
                            animate={{ scale: 1, opacity: 1, rotate: 0 }}
                            transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.2 }}
                            className={`text-9xl font-display font-bold ${gradeStyle.color} drop-shadow-[0_0_50px_rgba(255,255,255,0.4)]`}
                        >
                            {rankedScore.grade}
                        </motion.div>
                        <RankBadge tier={newTier} size="lg" className="mt-6 scale-110" />
                        <div className="mt-2 text-2xl font-bold text-white">{elo} <span className="text-sm font-normal text-white/50">RP</span></div>
                    </GlassCard>

                    {/* CENTER: Radar & Stats */}
                    <GlassCard className="lg:col-span-8 p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Radar Chart */}
                        <div className="h-[300px] w-full relative">
                            <h3 className="absolute top-0 left-0 text-neural-muted font-mono text-xs">COGNITIVE PROFILE</h3>
                            <ResponsiveContainer width="100%" height="100%">
                                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                                    <PolarGrid stroke="#ffffff20" />
                                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                                    <Radar
                                        name="Performance"
                                        dataKey="A"
                                        stroke="#22d3ee"
                                        strokeWidth={2}
                                        fill="#22d3ee"
                                        fillOpacity={0.3}
                                    />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#000000dd', border: '1px solid #333', color: '#fff' }}
                                        itemStyle={{ color: '#22d3ee' }}
                                    />
                                </RadarChart>
                            </ResponsiveContainer>
                        </div>

                        {/* Micro Stats */}
                        <motion.div
                            initial="hidden"
                            animate="visible"
                            variants={{
                                hidden: { opacity: 0 },
                                visible: {
                                    opacity: 1,
                                    transition: { staggerChildren: 0.1, delayChildren: 0.5 }
                                }
                            }}
                            className="space-y-6 flex flex-col justify-center"
                        >
                            <div className="grid grid-cols-2 gap-4">
                                <motion.div
                                    variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                                    className="bg-white/5 p-4 rounded-xl border border-white/10"
                                >
                                    <div className="flex items-center gap-2 text-neon-cyan mb-1">
                                        <Zap className="w-4 h-4" />
                                        <span className="text-xs font-bold">APM</span>
                                    </div>
                                    <div className="text-3xl font-mono text-white">{cognitiveAPM}</div>
                                    <div className="text-xs text-white/40">Actions / Min</div>
                                </motion.div>
                                <motion.div
                                    variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                                    className="bg-white/5 p-4 rounded-xl border border-white/10"
                                >
                                    <div className="flex items-center gap-2 text-purple-400 mb-1">
                                        <Crosshair className="w-4 h-4" />
                                        <span className="text-xs font-bold">ACCURACY</span>
                                    </div>
                                    <div className="text-3xl font-mono text-white">{rankedScore.accuracy}%</div>
                                    <div className="text-xs text-white/40">Precision Rating</div>
                                </motion.div>
                                <motion.div
                                    variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                                    className="bg-white/5 p-4 rounded-xl border border-white/10"
                                >
                                    <div className="flex items-center gap-2 text-amber-400 mb-1">
                                        <Activity className="w-4 h-4" />
                                        <span className="text-xs font-bold">CONSISTENCY</span>
                                    </div>
                                    <div className="text-3xl font-mono text-white">{consistencyScore}%</div>
                                    <div className="text-xs text-white/40">Mental Stability</div>
                                </motion.div>
                                <motion.div
                                    variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                                    className="bg-white/5 p-4 rounded-xl border border-white/10"
                                >
                                    <div className="flex items-center gap-2 text-green-400 mb-1">
                                        <TrendingUp className="w-4 h-4" />
                                        <span className="text-xs font-bold">ELO CHANGE</span>
                                    </div>
                                    <div className={`text-3xl font-mono ${eloDelta > 0 ? 'text-green-400' : 'text-red-400'}`}>
                                        {eloDelta > 0 ? '+' : ''}{eloDelta}
                                    </div>
                                    <div className="text-xs text-white/40">Rank Points</div>
                                </motion.div>
                            </div>
                        </motion.div>
                    </GlassCard>
                </div>

                {/* PLACEMENT BAR */}
                {placement.isPlacement && (
                    <GlassCard className="p-4 flex items-center gap-4">
                        <Shield className="w-8 h-8 text-amber-500 animate-pulse" />
                        <div className="flex-1">
                            <div className="flex justify-between text-sm mb-2">
                                <span className="text-white font-bold">PLACEMENT SERIES</span>
                                <span className="text-amber-400">{matchesPlayed} / {PLACEMENT_MATCHES} MATCHES</span>
                            </div>
                            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${placement.progress}%` }}
                                    className="h-full bg-gradient-to-r from-amber-600 to-amber-400"
                                />
                            </div>
                        </div>
                    </GlassCard>
                )}

                {/* MATCH TIMELINE */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-4">
                        <h3 className="text-xl font-bold text-white flex items-center gap-2">
                            <Brain className="w-5 h-5 text-neon-cyan" />
                            Match Timeline
                        </h3>
                        <div className="space-y-2">
                            {rankedScore.stageScores.map((stage, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.1 * idx }}
                                    className="p-4 rounded-lg bg-white/5 border border-white/10 flex items-center justify-between hover:bg-white/10 transition-colors"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="flex flex-col items-center justify-center w-12 h-12 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-white/50">
                                            {idx + 1}
                                        </div>
                                        <div>
                                            <div className="text-white font-bold">{stage.title}</div>
                                            <div className="text-xs text-white/40 uppercase tracking-wider">{stage.type}</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-8 text-right">
                                        <div>
                                            <div className="text-xs text-white/40">TIME</div>
                                            <div className="font-mono text-white">{Math.round(stage.timeMs / 1000)}s</div>
                                        </div>
                                        <div>
                                            <div className="text-xs text-white/40">ACCURACY</div>
                                            <div className={`font-mono font-bold ${stage.accuracy >= 80 ? 'text-green-400' : stage.accuracy >= 50 ? 'text-amber-400' : 'text-red-400'}`}>
                                                {stage.accuracy}%
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* ACTIONS */}
                    <div className="space-y-4">
                        <h3 className="text-xl font-bold text-white flex items-center gap-2">
                            <Target className="w-5 h-5 text-neon-pink" />
                            Next Steps
                        </h3>
                        <GlassCard className="p-6 space-y-4">
                            <NeonButton onClick={() => setShowLeaderboard(true)} fullWidth color="amber" glow>
                                <Crown className="w-4 h-4 mr-2" /> LEADERBOARD
                            </NeonButton>
                            <NeonButton onClick={startRankedSession} fullWidth variant="secondary">
                                <RotateCcw className="w-4 h-4 mr-2" /> PLAY AGAIN
                            </NeonButton>
                            <NeonButton onClick={resetTest} fullWidth variant="ghost">
                                <Home className="w-4 h-4 mr-2" /> MAIN MENU
                            </NeonButton>
                        </GlassCard>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};
