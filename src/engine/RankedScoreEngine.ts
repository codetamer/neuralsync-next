/**
 * RankedScoreEngine - Scoring logic for Ranked Gauntlet mode
 * 
 * Unlike the full test which uses IRT-proxy scoring, the ranked mode
 * uses a simpler weighted accuracy + time efficiency system.
 */

import type { ResponseData } from '../utils/storage';
import type { StageDefinition, DifficultyLevel } from './TestEngine';

export interface RankedStageScore {
    stage: number;
    type: string;
    title: string;
    accuracy: number;       // 0-100
    timeMs: number;         // Raw time in ms
    efficiency: number;     // 0-100 (time bonus)
    weightedScore: number;  // Final weighted score for this stage
    difficulty: number;     // Stage difficulty
}

export interface RankedScore {
    totalScore: number;         // 0-100 final score
    accuracy: number;           // 0-100 pure accuracy
    efficiency: number;         // 0-100 time efficiency
    stageScores: RankedStageScore[];
    eloInput: number;           // Normalized 0-100 for ELO calculation
    grade: 'S' | 'A' | 'B' | 'C' | 'D' | 'F';
}

// Expected time per stage type (in milliseconds)
const EXPECTED_TIMES: Record<string, number> = {
    'reactiontime': 15000,      // 15 seconds expected
    'nback': 60000,             // 60 seconds expected
    'matrix': 30000,            // 30 seconds per puzzle
    'vocabulary': 20000,        // 20 seconds per word
    'trailmaking': 45000,       // 45 seconds expected
    'default': 30000
};

// Difficulty weights (higher difficulty = more impact on score)
const DIFFICULTY_WEIGHTS: Record<DifficultyLevel, number> = {
    1: 0.5, 2: 0.6, 3: 0.7, 4: 0.8, 5: 1.0,
    6: 1.2, 7: 1.4, 8: 1.6, 9: 1.8, 10: 2.0
};

/**
 * Calculate comprehensive score for a ranked gauntlet session
 */
export function calculateRankedScore(
    responses: ResponseData[],
    stages: StageDefinition[]
): RankedScore {
    // Filter out intro stage
    const gameResponses = responses.filter(r => r.stage > 0);

    if (gameResponses.length === 0) {
        return {
            totalScore: 0,
            accuracy: 0,
            efficiency: 0,
            stageScores: [],
            eloInput: 0,
            grade: 'F'
        };
    }

    const stageScores: RankedStageScore[] = [];
    let totalWeightedAccuracy = 0;
    let totalWeightedEfficiency = 0;
    let totalWeight = 0;

    gameResponses.forEach(response => {
        const stageInfo = stages[response.stage];
        if (!stageInfo) return;

        const difficulty = stageInfo.difficulty;
        const weight = DIFFICULTY_WEIGHTS[difficulty] || 1.0;

        // --- ACCURACY ---
        // Convert boolean accuracy to 0-100
        let accuracy: number;
        if (typeof response.accuracy === 'boolean') {
            accuracy = response.accuracy ? 100 : 0;
        } else if (typeof response.accuracy === 'number') {
            accuracy = Math.min(100, Math.max(0, response.accuracy));
        } else {
            accuracy = 50; // Unknown
        }

        // --- TIME EFFICIENCY ---
        const expectedTime = EXPECTED_TIMES[stageInfo.type] || EXPECTED_TIMES.default;
        const actualTime = Math.max(1000, response.latency_ms || 0); // Min 1 second

        // Efficiency: 100% if at expected time, bonus for faster, penalty for slower
        // Using logarithmic scaling to prevent extreme values
        const timeRatio = expectedTime / actualTime;
        const efficiency = Math.min(150, Math.max(0,
            50 + (50 * Math.log2(timeRatio + 0.5))
        ));

        // --- WEIGHTED SCORE ---
        // 70% accuracy, 30% efficiency
        const weightedScore = (accuracy * 0.7) + (efficiency * 0.3);

        stageScores.push({
            stage: response.stage,
            type: stageInfo.type,
            title: stageInfo.title,
            accuracy,
            timeMs: actualTime,
            efficiency: Math.round(efficiency),
            weightedScore: Math.round(weightedScore),
            difficulty
        });

        totalWeightedAccuracy += accuracy * weight;
        totalWeightedEfficiency += efficiency * weight;
        totalWeight += weight;
    });

    // Calculate final scores
    const avgAccuracy = totalWeight > 0 ? totalWeightedAccuracy / totalWeight : 0;
    const avgEfficiency = totalWeight > 0 ? totalWeightedEfficiency / totalWeight : 0;
    const totalScore = (avgAccuracy * 0.7) + (avgEfficiency * 0.3);

    // Grade calculation
    const grade = getGrade(totalScore);

    // ELO input is the normalized total score (0-100)
    const eloInput = Math.round(Math.min(100, Math.max(0, totalScore)));

    return {
        totalScore: Math.round(totalScore),
        accuracy: Math.round(avgAccuracy),
        efficiency: Math.round(avgEfficiency),
        stageScores,
        eloInput,
        grade
    };
}

function getGrade(score: number): 'S' | 'A' | 'B' | 'C' | 'D' | 'F' {
    if (score >= 95) return 'S';
    if (score >= 85) return 'A';
    if (score >= 75) return 'B';
    if (score >= 60) return 'C';
    if (score >= 40) return 'D';
    return 'F';
}

/**
 * Get grade styling
 */
export function getGradeStyle(grade: 'S' | 'A' | 'B' | 'C' | 'D' | 'F') {
    switch (grade) {
        case 'S': return { color: 'text-yellow-400', bg: 'bg-yellow-500/20', glow: 'shadow-yellow-500/30' };
        case 'A': return { color: 'text-green-400', bg: 'bg-green-500/20', glow: 'shadow-green-500/30' };
        case 'B': return { color: 'text-blue-400', bg: 'bg-blue-500/20', glow: 'shadow-blue-500/30' };
        case 'C': return { color: 'text-orange-400', bg: 'bg-orange-500/20', glow: 'shadow-orange-500/30' };
        case 'D': return { color: 'text-red-400', bg: 'bg-red-500/20', glow: 'shadow-red-500/30' };
        case 'F': return { color: 'text-gray-400', bg: 'bg-gray-500/20', glow: 'shadow-gray-500/30' };
    }
}

/**
 * Placement match constants
 */
export const PLACEMENT_MATCHES = 5;

export function getPlacementProgress(matchesPlayed: number): {
    isPlacement: boolean;
    remaining: number;
    progress: number;
} {
    const remaining = Math.max(0, PLACEMENT_MATCHES - matchesPlayed);
    return {
        isPlacement: matchesPlayed < PLACEMENT_MATCHES,
        remaining,
        progress: Math.min(100, (matchesPlayed / PLACEMENT_MATCHES) * 100)
    };
}
