import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { calculateFinalScores, STAGE_DEFINITIONS } from '../engine/TestEngine';
export { STAGE_DEFINITIONS };
import type { FinalScores } from '../utils/storage';

export type StageType = 'matrix' | 'stroop' | 'bart' | 'personality' | 'intro' | 'scenario';

export interface StageDefinition {
    stage: number;
    type: StageType;
    title: string;
    description: string;
    contentId?: string;
}

export interface ResponseData {
    stage: number;
    choice: string | number;
    latency_ms: number;
    timestamp: string;
    accuracy: boolean;
}

interface TestState {
    currentStage: number;
    responses: ResponseData[];
    isTestComplete: boolean;
    xp: number;
    currentSection: 'INTRO' | 'IQ' | 'EQ' | 'RISK' | 'PERSONALITY';

    // Actions
    recordResponse: (data: Omit<ResponseData, 'timestamp' | 'stage'>) => void;
    nextStage: () => void;
    resetTest: () => void;
    returnToHome: () => void;
    getProgress: () => number;
    getResults: () => FinalScores;
    addXp: (amount: number) => void;
    setSection: (section: 'INTRO' | 'IQ' | 'EQ' | 'RISK' | 'PERSONALITY') => void;
}

export const useTestStore = create<TestState>()(
    persist(
        (set, get) => ({
            currentStage: 0,
            responses: [],
            isTestComplete: false,
            xp: 0,
            currentSection: 'INTRO',

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
                const { currentStage } = get();
                if (currentStage < STAGE_DEFINITIONS.length - 1) {
                    set({ currentStage: currentStage + 1 });
                } else {
                    set({ isTestComplete: true });
                }
            },

            resetTest: () => {
                set({
                    currentStage: 0,
                    responses: [],
                    isTestComplete: false,
                    xp: 0,
                    currentSection: 'INTRO'
                });
            },

            returnToHome: () => {
                set({ currentStage: 0, isTestComplete: false });
            },

            getProgress: () => {
                const { currentStage } = get();
                return Math.round((currentStage / STAGE_DEFINITIONS.length) * 100);
            },

            getResults: () => {
                const { responses } = get();
                return calculateFinalScores(responses);
            },

            addXp: (amount) => set((state) => ({ xp: state.xp + amount })),

            setSection: (section) => set({ currentSection: section }),
        }),
        {
            name: 'neuralsync-storage',
            storage: createJSONStorage(() => sessionStorage),
        }
    )
);
