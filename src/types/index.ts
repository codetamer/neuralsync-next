import { RankTier } from '../engine/EloEngine';

export interface MatchResult {
    id?: string;
    totalScore: number;
    grade: string;
    accuracy: number;
    speed: number;
    efficiency: number;
    stageScores: any[]; // Can be further typed if needed
    eloInput: number;
    newElo: number;
    newTier: RankTier;
    timestamp: any; // Firestore Timestamp
    matchesPlayed: number;
}

export interface TrendData {
    date: string;
    elo: number;
    matchIndex: number;
}
