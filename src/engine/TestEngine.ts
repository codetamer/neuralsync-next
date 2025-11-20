// Core Test Engine - Orchestrates 51-stage assessment flow

import type { ResponseData, FinalScores } from '../utils/storage';
import { PERSONALITY_ITEMS, LOGIC_PUZZLES, EQ_SCENARIOS } from '../data/testContent';

export type StageType = 'matrix' | 'stroop' | 'bart' | 'personality' | 'intro' | 'scenario';
export type DifficultyLevel = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

export interface StageDefinition {
    stage: number;
    type: StageType;
    title: string;
    difficulty: DifficultyLevel;
    description: string;
    contentId?: string; // ID to link to specific content item
}

// Dynamically generate stages based on content
const generateStages = (): StageDefinition[] => {
    const stages: StageDefinition[] = [
        { stage: 0, type: 'intro', title: 'Welcome', difficulty: 1, description: 'Introduction to NeuralSync Evaluator' }
    ];

    let stageCount = 1;

    // Block 1: IQ - Logic Puzzles (10 Stages)
    LOGIC_PUZZLES.forEach((puzzle, index) => {
        stages.push({
            stage: stageCount++,
            type: 'matrix', // Reusing matrix type for logic puzzles
            title: `Logic Protocol ${index + 1}`,
            difficulty: Math.min(10, index + 2) as DifficultyLevel,
            description: 'Analyze the pattern and deduce the correct output.',
            contentId: puzzle.id
        });
    });

    // Block 2: EQ - Situational Scenarios (10 Stages)
    EQ_SCENARIOS.forEach((scenario, index) => {
        stages.push({
            stage: stageCount++,
            type: 'scenario',
            title: `Social Dynamics ${index + 1}`,
            difficulty: 5,
            description: 'Select the most effective response.',
            contentId: scenario.id
        });
    });

    // Block 3: Risk - BART (1 Stage - kept for interactivity)
    stages.push({
        stage: stageCount++,
        type: 'bart',
        title: 'Risk Assessment',
        difficulty: 5,
        description: 'Evaluate risk vs reward potential.'
    });

    // Block 4: Personality - IPIP-NEO (30 Stages)
    PERSONALITY_ITEMS.forEach((item, index) => {
        stages.push({
            stage: stageCount++,
            type: 'personality',
            title: `Trait Analysis ${index + 1}`,
            difficulty: 3,
            description: 'Self-report assessment.',
            contentId: item.id
        });
    });

    return stages;
};

export const STAGE_DEFINITIONS: StageDefinition[] = generateStages();

// --- Standalone Calculation Functions ---

function scoreToPercentile(score: number, mean: number, sd: number): number {
    const z = (score - mean) / sd;
    const t = 1 / (1 + 0.2316419 * Math.abs(z));
    const d = 0.3989423 * Math.exp(-z * z / 2);
    const probability = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
    return Math.round((z > 0 ? 1 - probability : probability) * 100);
}

function calculateIQ(responses: ResponseData[]): { score: number, percentile: number } {
    // Filter for IQ stages (logic puzzles)
    // In our new structure, stages 1-10 are IQ
    const iqResponses = responses.filter(r => r.stage >= 1 && r.stage <= 10);

    if (iqResponses.length === 0) return { score: 100, percentile: 50 };

    let rawScore = 0;

    iqResponses.forEach(r => {
        // Find the puzzle to check correct answer
        const stageDef = STAGE_DEFINITIONS[r.stage];
        const puzzle = LOGIC_PUZZLES.find(p => p.id === stageDef.contentId);

        if (puzzle) {
            // Check if user choice matches correct index
            // Assuming choice is stored as string index "0", "1", etc. or number
            if (Number(r.choice) === puzzle.correctIndex) {
                rawScore += 1;

                // Speed bonus for correct answers under 10s
                if (r.latency_ms < 10000) rawScore += 0.2;
            }
        }
    });

    // Normalize to IQ scale (Mean 100, SD 15)
    // Max raw score is ~12 (10 correct + bonuses)
    // Let's map 0-12 to 70-145 range roughly
    const standardizedScore = 70 + (rawScore / 12) * 75;

    return {
        score: Math.round(standardizedScore),
        percentile: scoreToPercentile(standardizedScore, 100, 15)
    };
}

function calculateEQ(responses: ResponseData[]): { score: number, percentile: number } {
    // EQ Stages are 11-20
    const eqResponses = responses.filter(r => r.stage >= 11 && r.stage <= 20);

    if (eqResponses.length === 0) return { score: 100, percentile: 50 };

    let totalPoints = 0;
    let maxPoints = 0;

    eqResponses.forEach(r => {
        const stageDef = STAGE_DEFINITIONS[r.stage];
        const scenario = EQ_SCENARIOS.find(s => s.id === stageDef.contentId);

        if (scenario) {
            const choiceIndex = Number(r.choice);
            if (scenario.options[choiceIndex]) {
                totalPoints += scenario.options[choiceIndex].score;
            }
            maxPoints += 5; // Max score per scenario is 5
        }
    });

    // Normalize
    const percentage = totalPoints / maxPoints; // 0 to 1
    const standardizedScore = 70 + (percentage * 70); // Map to 70-140 range

    return {
        score: Math.round(standardizedScore),
        percentile: scoreToPercentile(standardizedScore, 100, 15)
    };
}

function calculatePersonality(responses: ResponseData[]) {
    // Personality Stages are 22-51 (Stage 21 is Risk)
    const pResponses = responses.filter(r => r.stage >= 22);

    const scores = {
        openness: 0,
        conscientiousness: 0,
        extraversion: 0,
        agreeableness: 0,
        neuroticism: 0
    };

    const counts = { ...scores };

    pResponses.forEach(r => {
        const stageDef = STAGE_DEFINITIONS[r.stage];
        const item = PERSONALITY_ITEMS.find(i => i.id === stageDef.contentId);

        if (item) {
            let val = Number(r.choice); // 1-5 scale

            // Reverse coding
            if (item.reverse) {
                val = 6 - val;
            }

            // Latency Weighting (Certainty)
            // Fast responses (but not too fast) imply higher certainty
            let certainty = 1.0;
            if (r.latency_ms < 3000 && r.latency_ms > 800) certainty = 1.2;
            if (r.latency_ms > 8000) certainty = 0.8;

            // We add the weighted value, but track count to average later
            // Actually, standard scoring usually sums. Let's just sum raw values for now
            // and use certainty to slightly boost/dampen the *impact* of this item?
            // Let's stick to standard scoring for reliability, maybe just use certainty for tie-breaking or "intensity"

            scores[item.category] += val;
            counts[item.category]++;
        }
    });

    // Convert to percentages (max score per trait is 6 items * 5 = 30)
    const normalize = (val: number, count: number) => {
        if (count === 0) return 50;
        const max = count * 5;
        const min = count * 1;
        // Map min-max to 0-100
        return Math.round(((val - min) / (max - min)) * 100);
    };

    return {
        openness: normalize(scores.openness, counts.openness),
        conscientiousness: normalize(scores.conscientiousness, counts.conscientiousness),
        extraversion: normalize(scores.extraversion, counts.extraversion),
        agreeableness: normalize(scores.agreeableness, counts.agreeableness),
        neuroticism: normalize(scores.neuroticism, counts.neuroticism)
    };
}

export function calculateFinalScores(responses: ResponseData[]): FinalScores {
    const iqResult = calculateIQ(responses);
    const eqResult = calculateEQ(responses);
    const ocean = calculatePersonality(responses);

    // Risk (Stage 21)
    const riskResponse = responses.find(r => r.stage === 21);
    let riskTolerance = 50;
    if (riskResponse) {
        // BART choice is usually pumps. Let's assume max 30 pumps.
        const pumps = Number(riskResponse.choice);
        riskTolerance = Math.min(99, Math.max(1, pumps * 3));
    }
    const riskPercentile = Math.round(riskTolerance); // Simplified

    // HEXACO mapping from OCEAN (Approximation)
    const hexaco = {
        honesty: ocean.agreeableness, // Proxy
        emotionality: ocean.neuroticism,
        extraversion: ocean.extraversion,
        agreeableness: ocean.agreeableness,
        conscientiousness: ocean.conscientiousness,
        openness: ocean.openness
    };

    // Apex Traits
    const traits = [
        { trait: 'Fluid Intelligence', score: iqResult.percentile, description: 'Exceptional pattern recognition and problem-solving ability.' },
        { trait: 'Emotional Resonance', score: eqResult.percentile, description: 'High capacity for emotional regulation and empathy.' },
        { trait: 'Risk Tolerance', score: riskPercentile, description: 'Bold decision-making under uncertainty.' },
        { trait: 'Openness', score: ocean.openness, description: 'Deep curiosity and appreciation for novelty.' },
        { trait: 'Conscientiousness', score: ocean.conscientiousness, description: 'Strong discipline and reliability.' },
        { trait: 'Extraversion', score: ocean.extraversion, description: 'High social energy and assertiveness.' },
        { trait: 'Agreeableness', score: ocean.agreeableness, description: 'Cooperative and compassionate nature.' },
        { trait: 'Neuroticism', score: ocean.neuroticism, description: 'Sensitivity to emotional stimuli.' }
    ];

    const apexTraits = traits.sort((a, b) => b.score - a.score).slice(0, 3);

    return {
        iq: iqResult.score,
        iqPercentile: iqResult.percentile,
        eq: eqResult.score,
        eqPercentile: eqResult.percentile,
        riskTolerance,
        riskPercentile,
        hexaco,
        ocean,
        apexTraits
    };
}

export class TestEngine {
    private currentStage: number = 0;
    private responses: ResponseData[] = [];
    private startTime: number = 0;

    constructor() {
        this.startTime = performance.now();
    }

    getCurrentStage(): StageDefinition {
        return STAGE_DEFINITIONS[this.currentStage];
    }

    getCurrentStageNumber(): number {
        return this.currentStage;
    }

    nextStage(): void {
        if (this.currentStage < STAGE_DEFINITIONS.length - 1) {
            this.currentStage++;
        }
    }

    recordResponse(choice: string | number, accuracy: boolean = false): ResponseData {
        const latency = performance.now() - this.startTime;

        const response: ResponseData = {
            stage: this.currentStage,
            choice,
            latency_ms: Math.round(latency),
            timestamp: new Date().toISOString(),
            accuracy,
        };

        this.responses.push(response);
        this.startTime = performance.now();

        return response;
    }

    getAllResponses(): ResponseData[] {
        return this.responses;
    }

    isComplete(): boolean {
        return this.currentStage >= STAGE_DEFINITIONS.length - 1;
    }

    getProgress(): number {
        return Math.round((this.currentStage / (STAGE_DEFINITIONS.length - 1)) * 100);
    }
}
