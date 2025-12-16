import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import {
    calculateFinalScores,
    createTestSession,
    createRankedSession,
    createQuickSession,
    adaptStagePath,
    type StageDefinition
} from '../engine/TestEngine';
import { EloEngine, type RankTier } from '../engine/EloEngine';
import type { FinalScores, ResponseData } from '../utils/storage';
import type { UserProfile } from '../services/UserService';

interface TestState {
    currentStage: number;
    responses: ResponseData[];
    stages: StageDefinition[]; // Dynamic sequence of stages
    isTestComplete: boolean;
    isPaused: boolean; // Track if test is paused
    isRanked: boolean;
    isDisqualified: boolean;
    xp: number;
    currentSection: 'INTRO' | 'IQ' | 'EQ' | 'RISK' | 'PERSONALITY';
    sessionMode: 'STANDARD' | 'RANKED' | 'QUICK';

    // Competitive Stats
    elo: number;
    matchesPlayed: number;
    rankTier: RankTier;

    // Actions
    recordResponse: (data: Omit<ResponseData, 'timestamp' | 'stage'>) => void;
    nextStage: () => void;
    resetTest: () => void;
    startRankedSession: () => void;
    startQuickSession: () => void;
    disqualify: () => void;
    returnToHome: () => void;
    resumeTest: () => void;
    getProgress: () => number;
    getResults: () => FinalScores;
    addXp: (amount: number) => void;
    updateElo: (performanceScore: number) => void;
    setSection: (section: 'INTRO' | 'IQ' | 'EQ' | 'RISK' | 'PERSONALITY') => void;
    setStage: (index: number) => void;
    syncWithRemote: (data: Partial<UserProfile>) => void;
}

export const useTestStore = create<TestState>()(
    persist(
        (set, get) => ({
            currentStage: 0,
            responses: [],
            stages: createTestSession(), // Initialize with a unique random session
            isTestComplete: false,
            isPaused: false,
            isRanked: false,
            isDisqualified: false,
            xp: 0,
            currentSection: 'INTRO',
            sessionMode: 'STANDARD',

            // Competitive Defaults
            elo: 1000,
            matchesPlayed: 0,
            rankTier: 'SILVER', // Start at Silver equivalent for baseline

            syncWithRemote: (data) => {
                set((state) => ({
                    elo: data.elo ?? state.elo,
                    matchesPlayed: data.matchesPlayed ?? state.matchesPlayed,
                    rankTier: data.tier ?? state.rankTier,
                    // We could also sync xp if that was part of the profile
                }));
            },

            recordResponse: (data) => {
                const { currentStage, responses } = get();
                const newResponse: ResponseData = {
                    ...data,
                    stage: currentStage,
                    timestamp: new Date().toISOString(),
                };
                set({ responses: [...responses, newResponse] });
            },

            nextStage: () => {
                const { currentStage, stages, responses } = get();

                if (currentStage < stages.length - 1) {
                    // --- CAT LOGIC INTEGRATION ---
                    // Before moving to next stage, we check if we should adapt the path
                    // We look at the LAST response to determine if we should adjust difficulty 
                    // We look at the LAST response to determine if we should adjust difficulty 
                    const lastResponse = responses[responses.length - 1]; // This is the response for currentStage

                    let newStages = stages;
                    if (lastResponse && lastResponse.stage === currentStage) {
                        // Assuming accuracy is calculated in UI or backend, but for CAT we infer or check
                        // For simplicity, let's assume accuracy is passed in recordResponse or derived
                        const wasCorrect = lastResponse.accuracy;

                        // Adapt the NEXT stage (currentSection + 1)
                        if (wasCorrect !== undefined) {
                            newStages = adaptStagePath(stages, currentStage, wasCorrect);
                        }
                    }

                    set({
                        stages: newStages,
                        currentStage: currentStage + 1
                    });
                } else {
                    set({ isTestComplete: true });
                }
            },

            resetTest: () => {
                set({
                    currentStage: 0,
                    responses: [],
                    stages: createTestSession(), // RE-ROLL the session content
                    isTestComplete: false,
                    isPaused: false,
                    isRanked: false,
                    isDisqualified: false,
                    xp: 0,
                    currentSection: 'INTRO',
                    sessionMode: 'STANDARD',
                    // Don't reset ELO on test reset? Or maybe we should? 
                    // Usually ELO is persistent across sessions.
                    // For now, let's KEEP ELO across resets. 
                    // user can manually reset profile if needed.
                });
            },

            startRankedSession: () => {
                set({
                    currentStage: 1, // Skip Intro (Stage 0) -> Go directly to first test (Stage 1)
                    responses: [],
                    stages: createRankedSession(),
                    isTestComplete: false,
                    isPaused: false,
                    isRanked: true,
                    isDisqualified: false,
                    currentSection: 'INTRO',
                    sessionMode: 'RANKED'
                });
            },

            startQuickSession: () => {
                set({
                    currentStage: 1, // Skip Intro (Stage 0) -> Go directly to first test (Stage 1)
                    responses: [],
                    stages: createQuickSession(),
                    isTestComplete: false,
                    isPaused: false,
                    isRanked: false,
                    isDisqualified: false,
                    xp: 0,
                    currentSection: 'INTRO',
                    sessionMode: 'QUICK'
                });
            },

            disqualify: () => {
                set({ isDisqualified: true, isTestComplete: true });
            },

            returnToHome: () => {
                set({ isPaused: true });
            },

            resumeTest: () => {
                set({ isPaused: false });
            },

            getProgress: () => {
                const { currentStage, stages } = get();
                const total = stages.length || 1;
                return Math.round((currentStage / total) * 100);
            },

            getResults: () => {
                const { responses, stages } = get();
                // We MUST pass the dynamic 'stages' array to the calculator
                // because the user's specific test content is unique to this session
                return calculateFinalScores(responses, stages);
            },

            addXp: (amount) => set((state) => ({ xp: state.xp + amount })),

            updateElo: (performanceScore) => {
                const { elo, matchesPlayed } = get();
                const newElo = EloEngine.calculateNewElo(elo, performanceScore, matchesPlayed);
                const newTier = EloEngine.getRankTier(newElo);

                set({
                    elo: newElo,
                    matchesPlayed: matchesPlayed + 1,
                    rankTier: newTier
                });
            },

            setSection: (section) => set({ currentSection: section }),

            // Dev Utils
            setStage: (index: number) => {
                const { stages } = get();
                if (index >= 0 && index < stages.length) {
                    set({ currentStage: index, isTestComplete: false });
                } else if (index >= stages.length) {
                    set({ isTestComplete: true });
                }
            },
        }),
        {
            name: 'neuralsync-storage',
            storage: createJSONStorage(() => localStorage),
        }
    )
);

// Deprecated export proxy to prevent breaking other imports temporarily
export const STAGE_DEFINITIONS = [];
