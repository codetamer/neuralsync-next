export type RankTier = 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM' | 'DIAMOND' | 'LEGEND';

interface EloConfig {
    baseK: number;
    placementMatches: number;
    volatilityWeight: number;
}

const CONFIG: EloConfig = {
    baseK: 32,
    placementMatches: 5,
    volatilityWeight: 0.5,
};

export class EloEngine {
    /**
     * Calculates the new ELO rating based on performance.
     * 
     * @param currentElo Current rating
     * @param performanceScore 0-100 score from the test (normalized)
     * @param matchesPlayed Total matches played
     * @param averageElo Average ELO of the test difficulty (default 1000)
     */
    public static calculateNewElo(
        currentElo: number,
        performanceScore: number,
        matchesPlayed: number,
        averageElo: number = 1000
    ): number {
        // 1. Determine K-Factor (Volatility)
        // High volatility for placement matches, stabilizes over time
        let K = CONFIG.baseK;
        if (matchesPlayed < CONFIG.placementMatches) {
            K = 64; // Placement matches swing harder
        } else if (currentElo > 2000) {
            K = 16; // Harder to climb at the top
        }

        // 2. Expected Score (Probability of winning against the test)
        // Similar to winning against a 1000 ELO opponent
        const expectedScore = 1 / (1 + Math.pow(10, (averageElo - currentElo) / 400));

        // 3. Actual Score (Normalized 0-1)
        // We treat a 100% test score as a "Win", 50% as a "Draw", etc.
        const actualScore = Math.max(0, Math.min(1, performanceScore / 100));

        // 4. Calculate Delta
        const delta = K * (actualScore - expectedScore);

        // 5. Return new ELO (rounded)
        return Math.round(currentElo + delta);
    }

    public static getRankTier(elo: number): RankTier {
        if (elo < 800) return 'BRONZE';
        if (elo < 1200) return 'SILVER';
        if (elo < 1600) return 'GOLD';
        if (elo < 2000) return 'PLATINUM';
        if (elo < 2400) return 'DIAMOND';
        return 'LEGEND';
    }

    public static getRankColor(tier: RankTier): string {
        switch (tier) {
            case 'BRONZE': return '#CD7F32';
            case 'SILVER': return '#C0C0C0';
            case 'GOLD': return '#FFD700';
            case 'PLATINUM': return '#00FFFF';
            case 'DIAMOND': return '#B9F2FF';
            case 'LEGEND': return '#FF00FF';
        }
    }
}
