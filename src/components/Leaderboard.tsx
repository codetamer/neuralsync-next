'use client';

import { useMemo, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { RankBadge } from './ui/RankBadge';
import { RankTier, EloEngine } from '../engine/EloEngine';
import { useTestStore } from '../store/useTestStore';
import { X, ChevronDown, ChevronUp, Info, Loader2 } from 'lucide-react';
import { UserService, UserProfile } from '../services/UserService';
import { useAuth } from '../context/AuthContext';

interface LeaderboardProps {
    onClose?: () => void;
}

interface LeaderboardEntry {
    rank: number;
    username: string;
    elo: number;
    tier: RankTier;
    isUser?: boolean;
    uid: string;
}

// Rank tier info for legend
const RANK_TIERS: { tier: RankTier; name: string; elo: string; color: string }[] = [
    { tier: 'LEGEND', name: 'Legend', elo: '2400+', color: 'text-fuchsia-400' },
    { tier: 'DIAMOND', name: 'Diamond', elo: '2000-2399', color: 'text-sky-300' },
    { tier: 'PLATINUM', name: 'Platinum', elo: '1600-1999', color: 'text-cyan-400' },
    { tier: 'GOLD', name: 'Gold', elo: '1200-1599', color: 'text-yellow-400' },
    { tier: 'SILVER', name: 'Silver', elo: '800-1199', color: 'text-gray-300' },
    { tier: 'BRONZE', name: 'Bronze', elo: '<800', color: 'text-orange-700' },
];

export const Leaderboard = ({ onClose }: LeaderboardProps) => {
    const { elo } = useTestStore();
    const { user } = useAuth();
    const [showTierInfo, setShowTierInfo] = useState(false);
    const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;

        const fetchLeaderboard = async () => {
            setLoading(true);
            try {
                // Fetch top 50 players
                const profiles = await UserService.getLeaderboard(50);

                if (!isMounted) return;

                const mappedEntries: LeaderboardEntry[] = profiles.map((profile, index) => ({
                    rank: index + 1,
                    username: profile.username || 'Anonymous',
                    elo: profile.elo,
                    tier: profile.tier,
                    isUser: user ? profile.uid === user.uid : false,
                    uid: profile.uid
                }));

                setEntries(mappedEntries);
            } catch (error) {
                if (isMounted) console.error("Failed to fetch leaderboard:", error);
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        fetchLeaderboard();

        return () => {
            isMounted = false;
        };
    }, [user]); // Re-fetch if user auth state changes (to highlight correctly)


    // Determine if we need to append the user manually (if they are not in the top 50)
    const displayEntries = useMemo(() => {
        if (loading || !user) return entries;

        const userInTop = entries.find(e => e.uid === user.uid);
        if (!userInTop) {
            // User is not in top 50, fetch their profile or just use current session store
            // Ideally we use the real profile from DB but store is fresh enough for now
            const currentUserEntry: LeaderboardEntry = {
                rank: 999, // Unknown / Unranked relative to top
                username: user.displayName || 'YOU',
                elo: elo,
                tier: EloEngine.getRankTier(elo),
                isUser: true,
                uid: user.uid
            };
            return [...entries, currentUserEntry];
        }
        return entries;
    }, [entries, loading, user, elo]);

    return (
        <div className="w-full max-w-md bg-neural-card/50 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
            <div className="p-4 border-b border-white/5 bg-white/5 flex justify-between items-center">
                <h3 className="font-display font-bold tracking-wider text-neon-teal">GLOBAL RANKING</h3>
                <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-neural-muted">SEASON 1</span>
                    {onClose && (
                        <button
                            onClick={onClose}
                            className="p-1 rounded-lg hover:bg-white/10 text-white/60 hover:text-white transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    )}
                </div>
            </div>

            <div className="max-h-[60vh] overflow-y-auto divide-y divide-white/5 custom-scrollbar">
                {loading ? (
                    <div className="p-8 flex justify-center items-center text-neural-muted">
                        <Loader2 className="w-6 h-6 animate-spin mr-2" />
                        <span>Loading rankings...</span>
                    </div>
                ) : displayEntries.length === 0 ? (
                    <div className="p-8 text-center text-neural-muted">
                        <span>No ranked players yet. Be the first!</span>
                    </div>
                ) : (
                    displayEntries.map((entry, index) => {
                        // Check if this is the appended user entry
                        const isAppended = entry.rank === 999;
                        const showSeparator = isAppended;

                        return (
                            <motion.div
                                key={`${entry.rank}-${entry.uid}`}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                            >
                                {showSeparator && (
                                    <div className="py-2 text-center text-neural-muted text-xs font-mono bg-black/20">
                                        • • •
                                    </div>
                                )}
                                <div className={`flex items-center p-3 gap-3 ${entry.isUser ? 'bg-neon-teal/10 border-l-2 border-neon-teal' : 'hover:bg-white/5'}`}>
                                    <div className={`font-mono font-bold w-10 text-center ${entry.rank <= 3 ? 'text-amber-400 drop-shadow-glow' : 'text-neural-muted'}`}>
                                        {isAppended ? '-' : `#${entry.rank}`}
                                    </div>

                                    <div className="flex-1 overflow-hidden">
                                        <div className={`font-bold text-sm truncate ${entry.isUser ? 'text-neon-teal' : 'text-white'}`}>
                                            {entry.username}
                                        </div>
                                        <div className="text-[10px] text-neural-muted flex items-center gap-1">
                                            {entry.tier}
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <span className="font-mono font-bold text-neon-blue">{entry.elo}</span>
                                        <div className="w-6 h-6 shrink-0">
                                            <RankBadge tier={entry.tier} size="sm" />
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })
                )}
            </div>

            {/* Rank Tier Legend */}
            <div className="border-t border-white/5 bg-black/20">
                <button
                    onClick={() => setShowTierInfo(!showTierInfo)}
                    className="w-full p-3 flex items-center justify-between text-xs text-neural-muted hover:text-white transition-colors"
                >
                    <div className="flex items-center gap-2">
                        <Info className="w-3.5 h-3.5" />
                        <span>How Ranking Works</span>
                    </div>
                    {showTierInfo ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>

                {showTierInfo && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        className="px-4 pb-4 space-y-3"
                    >
                        <p className="text-[10px] text-white/50 leading-relaxed">
                            Your ELO rating changes based on your Ranked Gauntlet performance.
                            Win against tough challenges to climb higher!
                        </p>

                        <div className="space-y-1.5">
                            <p className="text-[9px] text-white/40 font-mono">TIER THRESHOLDS</p>
                            {RANK_TIERS.map((tier) => (
                                <div key={tier.tier} className="flex items-center gap-2 text-[10px]">
                                    <div className="w-5 h-5">
                                        <RankBadge tier={tier.tier} size="sm" />
                                    </div>
                                    <span className={`${tier.color} font-bold flex-1`}>{tier.name}</span>
                                    <span className="text-white/40 font-mono">{tier.elo}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
};
