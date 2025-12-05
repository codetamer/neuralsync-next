import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import {
    calculateFinalScores,
    createTestSession,
    adaptStagePath,
    type StageDefinition
} from '../engine/TestEngine';
import type { FinalScores, ResponseData } from '../utils/storage';

interface TestState {
    currentStage: number;
    responses: ResponseData[];
    stages: StageDefinition[]; // Dynamic sequence of stages
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
            stages: createTestSession(), // Initialize with a unique random session
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
                const { currentStage, stages, responses } = get();

                if (currentStage < stages.length - 1) {
                    // --- CAT LOGIC INTEGRATION ---
                    // Before moving to next stage, we check if we should adapt the path
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
                    xp: 0,
                    currentSection: 'INTRO'
                });
            },

            returnToHome: () => {
                set({ currentStage: 0, isTestComplete: false });
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

            setSection: (section) => set({ currentSection: section }),
        }),
        {
            name: 'neuralsync-storage',
            storage: createJSONStorage(() => sessionStorage),
        }
    )
);

// Deprecated export proxy to prevent breaking other imports temporarily
export const STAGE_DEFINITIONS = []; 
