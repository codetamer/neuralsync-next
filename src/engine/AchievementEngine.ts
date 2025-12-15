import { UserProfile } from '../services/UserService';

export interface Achievement {
    id: string;
    title: string;
    description: string;
    icon: string; // Lucide icon name or emoji
    condition: (stats: UserStats) => boolean;
}

export interface UserStats {
    elo: number;
    matchesPlayed: number;
    winRate: number; // 0-100
    streak: number;
    highestScore: number;
}

export const ACHIEVEMENTS: Achievement[] = [
    {
        id: 'first_blood',
        title: 'First Blood',
        description: 'Complete your first Ranked Match.',
        icon: '⚔️',
        condition: (s) => s.matchesPlayed >= 1
    },
    {
        id: 'hot_streak',
        title: 'On Fire',
        description: 'Maintain a 3-day streak.',
        icon: '🔥',
        condition: (s) => s.streak >= 3
    },
    {
        id: 'iron_mind',
        title: 'Iron Mind',
        description: 'Reach 1200 ELO (Bronze Tier).',
        icon: '🛡️',
        condition: (s) => s.elo >= 1200
    },
    {
        id: 'apex_predator',
        title: 'Apex Predator',
        description: 'Reach Gold Tier (1500 ELO).',
        icon: '👑',
        condition: (s) => s.elo >= 1500
    },
    {
        id: 'veteran',
        title: 'Battle Hardened',
        description: 'Play 50 Matches.',
        icon: '🎖️',
        condition: (s) => s.matchesPlayed >= 50
    },
    {
        id: 'speed_demon',
        title: 'Speed Demon',
        description: 'Score 90%+ Accuracy in a match.',
        icon: '⚡',
        condition: (s) => s.highestScore >= 90
    }
];

export const AchievementEngine = {
    evaluate: (currentStats: UserStats, unlockedIds: string[]) => {
        const newUnlocks: Achievement[] = [];

        ACHIEVEMENTS.forEach(ach => {
            if (!unlockedIds.includes(ach.id)) {
                if (ach.condition(currentStats)) {
                    newUnlocks.push(ach);
                }
            }
        });

        return newUnlocks;
    }
};
