'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { UserService, UserProfile } from '../../services/UserService';
import { GlassCard } from '../../components/ui/GlassCard';
import { NeonButton } from '../../components/ui/NeonButton';
import { RankBadge } from '../../components/ui/RankBadge';
import { AppShell } from '../../components/layout/AppShell';
import { Trophy, Zap, Target, TrendingUp, Calendar, ArrowRight, Play, Flame, Brain } from 'lucide-react';
import { CognitiveRadar } from '../../components/dashboard/CognitiveRadar';
import { EloHistoryChart } from '../../components/dashboard/EloHistoryChart';
import { Leaderboard } from '../../components/Leaderboard';
import { DashboardSkeleton } from '../../components/skeletons/DashboardSkeleton';

export default function DashboardPage() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [results, setResults] = useState<any[]>([]);
    const [chartData, setChartData] = useState<{ radar: any[], history: any[] }>({ radar: [], history: [] });
    const [globalRank, setGlobalRank] = useState<number | null>(null);
    const [winRate, setWinRate] = useState<number>(0);
    const [topInsight, setTopInsight] = useState<string | null>(null);
    const [showLeaderboard, setShowLeaderboard] = useState(false);
    const [hasRankedData, setHasRankedData] = useState(false);
    const [hasProfileData, setHasProfileData] = useState(false);

    useEffect(() => {
        let isMounted = true;

        if (!loading && !user) {
            router.push('/');
        } else if (user) {
            // Load profile, results, and calculate rank
            Promise.all([
                UserService.getUserProfile(user.uid),
                UserService.getUserResults(user.uid, 50)
            ]).then(async ([p, r]) => {
                if (!isMounted) return;

                setProfile(p);
                setResults(r);

                const hasRanked = r && r.length > 0;
                const hasProfile = !!(p && p.traits);

                if (isMounted) {
                    setHasRankedData(hasRanked);
                    setHasProfileData(hasProfile);
                }

                if (p) {
                    // Fetch real rank
                    try {
                        const rank = await UserService.getUserRank(p.elo);
                        if (isMounted) setGlobalRank(rank);
                    } catch (e) {
                        console.warn("Rank fetch invalid:", e);
                    }
                }

                if (hasRanked) {
                    // 1. Calculate Win Rate (Grade B or higher / Total)
                    const wins = r.filter(match => ['S', 'A', 'B'].includes(match.grade)).length;
                    if (isMounted) setWinRate(Math.round((wins / r.length) * 100));

                    // 2. History Data
                    const history = [...r].reverse().map((match, idx) => ({
                        date: new Date(match.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
                        elo: match.newElo || 1000,
                        matchIndex: idx + 1
                    }));

                    // 3. Radar Data (Aggregates)
                    const categories: Record<string, { total: number, count: number }> = {
                        'Memory': { total: 0, count: 0 },
                        'Speed': { total: 0, count: 0 },
                        'Attention': { total: 0, count: 0 },
                        'Logic': { total: 0, count: 0 },
                        'Flexibility': { total: 0, count: 0 },
                    };

                    r.forEach(match => {
                        match.stageScores?.forEach((stage: any) => {
                            let category = 'Attention';
                            const type = stage.type.toLowerCase();

                            if (type.includes('nback') || type.includes('spatial') || type.includes('span')) category = 'Memory';
                            else if (type.includes('matrix')) category = 'Logic';
                            else if (type.includes('trail')) category = 'Flexibility';
                            else if (type.includes('reaction') || type.includes('symbol')) category = 'Speed';

                            if (categories[category]) {
                                // Use the stage 'accuracy' for Logic/Memory, 'efficiency' for Speed/Flexibility if avail, or weightedScore
                                // For simplicity and consistency with the previous radar, we use 'accuracy' mostly, but Speed really needs efficiency.
                                const score = stage.weightedScore || stage.accuracy || 0;
                                categories[category].total += score;
                                categories[category].count += 1;
                            }
                        });
                    });

                    const radar = Object.keys(categories).map(key => ({
                        subject: key,
                        A: categories[key].count > 0 ? Math.round(categories[key].total / categories[key].count) : 0,
                        fullMark: 100
                    }));

                    if (isMounted) setChartData({ history, radar });

                    // 4. Generate Insight
                    // PRIORITIZE: Deep Profile Archetype
                    if (p && p.archetype) {
                        if (isMounted) setTopInsight(p.archetype); // e.g. "Visionary Architect"
                    } else {
                        // Fallback: Calculated from recent matches
                        const topCat = radar.reduce((prev, current) => (prev.A > current.A) ? prev : current);
                        if (topCat.A > 0 && isMounted) {
                            setTopInsight(`${topCat.subject} Specialist`);
                        }
                    }
                } else if (hasProfile && p.traits) {
                    // Cold Start: No matches, but has Neural Profile
                    const radar = [
                        { subject: 'Memory', A: p.traits.memory || 0, fullMark: 100 },
                        { subject: 'Speed', A: p.traits.speed || 0, fullMark: 100 },
                        { subject: 'Attention', A: p.traits.conscientiousness || 0, fullMark: 100 },
                        { subject: 'Logic', A: p.traits.iq ? Math.min(100, (p.traits.iq - 70) * 2) : 0, fullMark: 100 }, // Approx mapping
                        { subject: 'Flexibility', A: p.traits.openness || 0, fullMark: 100 },
                    ];
                    if (isMounted) setChartData({ history: [], radar });

                    if (p.archetype && isMounted) setTopInsight(p.archetype);
                }
            }).catch(err => {
                // Ignore silent aborts or permission issues during dev hot-reloads
                if (err.message?.includes('aborted') || err.code === 'aborted') return;

                console.error("Dashboard Data Fetch Error:", err);
                if (err.code === 'permission-denied') {
                    // Fallback handled silently or via UI boundary
                }
            });
        }

        return () => {
            isMounted = false;
        };
    }, [user, loading, router]);

    if (loading || !profile) {
        return (
            <AppShell>
                <DashboardSkeleton />
            </AppShell>
        );
    }

    if (showLeaderboard) {
        return (
            <AppShell>
                <div className="max-w-4xl mx-auto py-8">
                    <Leaderboard onClose={() => setShowLeaderboard(false)} />
                </div>
            </AppShell>
        );
    }

    return (
        <AppShell>
            <div className="max-w-6xl mx-auto w-full space-y-8 pb-12">
                {/* Welcome Header */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-display font-bold text-white">
                            Welcome back, <span className="text-neon-teal">{profile.username}</span>
                        </h1>
                        <p className="text-white/50 mt-1">
                            {profile.archetype ?
                                `Your analytic profile suggests you are a ${profile.archetype}.` :
                                (hasRankedData ? 'Ranked data available, but Neural Archetype missing.' : 'Ready to analyze your neural performance?')
                            }
                        </p>
                    </div>
                    <div className="flex items-center gap-4">
                        <NeonButton
                            onClick={() => router.push('/')}
                            variant="secondary"
                            size="lg"
                        >
                            <ArrowRight className="w-5 h-5 mr-2 rotate-180" />
                            BACK TO HOME
                        </NeonButton>
                        <NeonButton
                            onClick={() => router.push('/?stage=intro')}
                            variant="primary"
                            size="lg"
                            glow
                        >
                            <Play className="w-5 h-5 mr-2" />
                            ENTER GAUNTLET
                        </NeonButton>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <button onClick={() => hasRankedData ? setShowLeaderboard(true) : router.push('/')} className="text-left transition-transform hover:scale-105 active:scale-95 focus:outline-none">
                        <GlassCard className={`p-4 flex items-center gap-4 border-l-4 ${hasRankedData ? 'border-l-amber-500' : 'border-l-white/10'} h-full cursor-pointer hover:bg-white/5`}>
                            <div className={`w-12 h-12 rounded-lg ${hasRankedData ? 'bg-amber-500/20 text-amber-500' : 'bg-white/5 text-white/30'} flex items-center justify-center`}>
                                <Trophy className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-xs text-white/50 uppercase font-mono">Global Rank</p>
                                <p className="text-2xl font-bold text-white">{hasRankedData && globalRank !== null ? `#${globalRank}` : 'Unranked'}</p>
                            </div>
                        </GlassCard>
                    </button>

                    <button onClick={() => hasRankedData ? setShowLeaderboard(true) : router.push('/')} className="text-left transition-transform hover:scale-105 active:scale-95 focus:outline-none">
                        <GlassCard className={`p-4 flex items-center gap-4 border-l-4 ${hasRankedData ? 'border-l-neon-blue' : 'border-l-white/10'} h-full cursor-pointer hover:bg-white/5`}>
                            <div className={`w-12 h-12 rounded-lg ${hasRankedData ? 'bg-neon-blue/20 text-neon-blue' : 'bg-white/5 text-white/30'} flex items-center justify-center`}>
                                <Zap className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-xs text-white/50 uppercase font-mono">ELO Rating</p>
                                <p className="text-2xl font-bold text-white cursor-pointer hover:text-neon-blue transition-colors">
                                    {hasRankedData ? profile.elo : (
                                        <span className="text-xs font-normal text-neon-blue flex items-center gap-1">PLAY RANKED <ArrowRight className="w-3 h-3" /></span>
                                    )}
                                </p>
                            </div>
                        </GlassCard>
                    </button>

                    <GlassCard className={`p-4 flex items-center gap-4 border-l-4 ${hasProfileData ? 'border-l-green-500' : 'border-l-white/10'}`}>
                        <div className={`w-12 h-12 rounded-lg ${hasProfileData ? 'bg-green-500/20 text-green-500' : 'bg-white/5 text-white/30'} flex items-center justify-center`}>
                            <Brain className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-xs text-white/50 uppercase font-mono">Rationality</p>
                            <p className="text-2xl font-bold text-white">
                                {hasProfileData ? (
                                    `${profile.traits?.iq ? Math.round(((profile.traits.iq - 70) * 1.5 + (profile.traits.conscientiousness || 50)) / 2) : 50}%`
                                ) : (
                                    <button onClick={() => router.push('/')} className="text-xs font-normal text-green-400 flex items-center gap-1 hover:underline">
                                        TAKE ANALYSIS <ArrowRight className="w-3 h-3" />
                                    </button>
                                )}
                            </p>
                        </div>
                    </GlassCard>

                    <GlassCard className="p-4 flex items-center gap-4 border-l-4 border-l-purple-500">
                        <div className={`w-12 h-12 rounded-lg ${profile.streak > 3 ? 'bg-orange-500/20 text-orange-500' : 'bg-purple-500/20 text-purple-500'} flex items-center justify-center`}>
                            <Flame className={`w-6 h-6 ${profile.streak > 0 ? 'animate-pulse' : ''} ${profile.streak > 7 ? 'text-red-500 drop-shadow-[0_0_10px_rgba(239,68,68,0.8)]' : ''}`} />
                        </div>
                        <div>
                            <p className="text-xs text-white/50 uppercase font-mono">Daily Streak</p>
                            <div className="flex items-end gap-2">
                                <p className="text-2xl font-bold text-white">{profile.streak || 0}</p>
                                <p className="text-xs text-white/50 mb-1">DAYS</p>
                            </div>
                        </div>
                    </GlassCard>
                </div>

                {/* Charts Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <CognitiveRadar
                        data={chartData.radar}
                        title={hasRankedData ? "Ranked Performance" : (hasProfileData ? "Neural Baseline" : "Brain Profile")}
                    />
                    <EloHistoryChart data={chartData.history} />
                </div>


                {/* Main Content Split */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left: Recent Activity & Suggestions */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-bold text-white">Match History</h3>
                                <button className="text-xs text-neon-teal hover:text-white transition-colors">View All</button>
                            </div>
                            <div className="space-y-2">
                                {results.length === 0 ? (
                                    <div className="text-center p-8 text-white/30 italic">No matches played yet. Enter the Gauntlet to build your profile!</div>
                                ) : (
                                    results.slice(0, 5).map((match) => (
                                        <div key={match.id} className="p-3 rounded-lg bg-neural-card border border-white/5 flex items-center justify-between hover:bg-white/5 transition-colors">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-2 h-2 rounded-full ${match.totalScore >= 80 ? 'bg-green-500' : 'bg-amber-500'}`}></div>
                                                <div>
                                                    <p className="text-sm font-bold text-white">Ranked Gauntlet</p>
                                                    <p className="text-xs text-white/30">
                                                        {new Date(match.timestamp).toLocaleString()}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="text-right flex items-center gap-6">
                                                <div className="text-right w-16">
                                                    <p className="text-sm font-bold text-white">{match.grade || 'C'}</p>
                                                    <p className="text-xs text-white/30">Grade</p>
                                                </div>
                                                <div className="text-right w-16">
                                                    <div className="flex items-center justify-end gap-1">
                                                        <span className="text-sm font-bold text-neon-blue">{match.newElo || 1000}</span>
                                                    </div>
                                                    <p className="text-xs text-white/30">ELO</p>
                                                </div>
                                                <div className="text-right w-16">
                                                    <p className="text-sm font-bold text-white">{match.totalScore}%</p>
                                                    <p className="text-xs text-white/30">Score</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right: Profile Card */}
                    <div className="space-y-6">
                        <GlassCard className="p-6 text-center space-y-4 relative overflow-hidden">
                            <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-neon-teal to-blue-600 p-1">
                                <div className="w-full h-full rounded-full bg-black overflow-hidden flex items-center justify-center">
                                    {profile.photoURL ? (
                                        <img src={profile.photoURL} alt={profile.username} className="w-full h-full object-cover" />
                                    ) : (
                                        <span className="text-2xl font-bold text-white">{profile.username?.charAt(0).toUpperCase()}</span>
                                    )}
                                </div>
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-white">{profile.username}</h2>
                                <div className="flex items-center justify-center gap-2 mt-1">
                                    <div className="w-5 h-5">
                                        <RankBadge tier={profile.tier} size="sm" />
                                    </div>
                                    <p className="text-sm text-neon-teal">{profile.tier} Division</p>
                                </div>
                            </div>
                            <div className="pt-4 border-t border-white/10 grid grid-cols-2 gap-4 text-center">
                                <div>
                                    <p className="text-2xl font-mono font-bold text-white">{profile.matchesPlayed}</p>
                                    <p className="text-[10px] uppercase text-white/30">Matches</p>
                                </div>
                                <div>
                                    <p className="text-2xl font-mono font-bold text-white">{results.length > 0 ? `${winRate}%` : '--'}</p>
                                    <p className="text-[10px] uppercase text-white/30">Win Rate (B+)</p>
                                </div>
                            </div>
                            <div className="pt-4 border-t border-white/10">
                                {profile.archetype ? (
                                    <div className="bg-neon-teal/10 rounded-lg p-2">
                                        <p className="text-xs text-neon-teal font-bold">{profile.archetype}</p>
                                        <p className="text-[10px] text-white/50">Neural Archetype</p>
                                    </div>
                                ) : (
                                    <button onClick={() => router.push('/')} className="w-full bg-white/5 hover:bg-white/10 rounded-lg p-2 transition-colors group">
                                        <p className="text-xs text-white group-hover:text-neon-teal font-bold flex items-center justify-center gap-1">
                                            DISCOVER ARCHETYPE <ArrowRight className="w-3 h-3" />
                                        </p>
                                    </button>
                                )}
                            </div>
                        </GlassCard>
                    </div>
                </div>
            </div>
        </AppShell>
    );
}
