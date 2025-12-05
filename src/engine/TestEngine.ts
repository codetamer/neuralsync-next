// Core Test Engine - Functional Helpers for State Management

import type { ResponseData, FinalScores } from '../utils/storage';
import { HEXACO_ITEMS, LOGIC_PUZZLES, VISUAL_PUZZLES, EQ_SCENARIOS, ATTENTION_CHECKS } from '../data/testContent';

export type StageType = 'matrix' | 'stroop' | 'bart' | 'personality' | 'intro' | 'scenario';
export type DifficultyLevel = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

export interface StageDefinition {
    stage: number;
    type: StageType;
    title: string;
    difficulty: DifficultyLevel;
    description: string;
    contentId?: string;
}

// Helper for random selection
const selectRandomItems = <T>(pool: T[], count: number): T[] => {
    const shuffled = [...pool].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
};

// --- FACTORY FUNCTION: Create a new unique test session ---
export const createTestSession = (): StageDefinition[] => {
    // 0. Intro
    const stages: StageDefinition[] = [
        { stage: 0, type: 'intro', title: 'Welcome', difficulty: 1, description: 'Introduction to NeuralSync Evaluator' }
    ];

    let stageCount = 1;

    // 1. IQ BLOCK (15 Stages)
    const selectedLogic = selectRandomItems(LOGIC_PUZZLES, 7);
    const selectedVisual = selectRandomItems(VISUAL_PUZZLES, 8);

    const iqMix: (typeof selectedLogic[0] | typeof selectedVisual[0])[] = [];
    const maxLength = Math.max(selectedLogic.length, selectedVisual.length);
    for (let i = 0; i < maxLength; i++) {
        if (i < selectedLogic.length) iqMix.push(selectedLogic[i]);
        if (i < selectedVisual.length) iqMix.push(selectedVisual[i]);
    }

    iqMix.forEach((puzzle, index) => {
        stages.push({
            stage: stageCount++,
            type: 'matrix',
            title: `Cognitive Protocol ${index + 1}`,
            difficulty: puzzle.difficulty as DifficultyLevel,
            description: 'Analyze the pattern and deduce the correct solution.',
            contentId: puzzle.id
        });
    });

    // 2. EQ BLOCK (10 items)
    const selectedEQ = selectRandomItems(EQ_SCENARIOS, 10);
    selectedEQ.forEach((scenario, index) => {
        stages.push({
            stage: stageCount++,
            type: 'scenario',
            title: `Social Dynamics ${index + 1}`,
            difficulty: 5,
            description: 'Select the most effective response.',
            contentId: scenario.id
        });
    });

    // 3. RISK BLOCK
    stages.push({
        stage: stageCount++,
        type: 'bart',
        title: 'Risk Assessment',
        difficulty: 5,
        description: 'Evaluate risk vs reward potential.'
    });

    // 4. PERSONALITY BLOCK
    const hItems = selectRandomItems(HEXACO_ITEMS.filter(i => i.category === 'honesty'), 4);
    const eItems = selectRandomItems(HEXACO_ITEMS.filter(i => i.category === 'emotionality'), 4);
    const xItems = selectRandomItems(HEXACO_ITEMS.filter(i => i.category === 'extraversion'), 4);
    const aItems = selectRandomItems(HEXACO_ITEMS.filter(i => i.category === 'agreeableness'), 4);
    const cItems = selectRandomItems(HEXACO_ITEMS.filter(i => i.category === 'conscientiousness'), 4);
    const oItems = selectRandomItems(HEXACO_ITEMS.filter(i => i.category === 'openness'), 4);
    const checks = selectRandomItems(ATTENTION_CHECKS, 2);

    const personalityMix = [
        ...hItems, ...eItems, ...xItems, ...aItems, ...cItems, ...oItems, ...checks
    ].sort(() => 0.5 - Math.random());

    personalityMix.forEach((item, index) => {
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

// --- CAT HELPER: Calculate next stage content based on performance ---
export const adaptStagePath = (stages: StageDefinition[], currentIdx: number, wasCorrect: boolean): StageDefinition[] => {
    const newStages = [...stages];
    const nextIndex = currentIdx + 1;

    // Bounds check
    if (nextIndex >= newStages.length) return newStages;

    const currentDef = newStages[currentIdx];
    const nextDef = newStages[nextIndex];

    // Only adapt if transferring IQ -> IQ
    if (currentDef.type !== 'matrix' || nextDef.type !== 'matrix') return newStages;

    // 1. Determine Target Difficulty
    const currentDiff = currentDef.difficulty;
    let targetDiff = wasCorrect ? currentDiff + 1 : currentDiff - 1;
    targetDiff = Math.max(1, Math.min(10, targetDiff)); // Clamp

    // 2. Select optimized puzzle
    const nextContentId = nextDef.contentId;
    const isNextLogic = LOGIC_PUZZLES.some(p => p.id === nextContentId);
    const pool = isNextLogic ? LOGIC_PUZZLES : VISUAL_PUZZLES;

    const usedIds = new Set(newStages.map(s => s.contentId));

    // Find absolute best match
    const candidate = pool.find(p => p.difficulty === targetDiff && !usedIds.has(p.id));

    if (candidate) {
        newStages[nextIndex] = {
            ...nextDef,
            contentId: candidate.id,
            difficulty: candidate.difficulty as DifficultyLevel
        };
    } else {
        // Backup: Any unused close match
        const backup = pool.find(p => Math.abs(p.difficulty - targetDiff) <= 1 && !usedIds.has(p.id));
        if (backup) {
            newStages[nextIndex] = {
                ...nextDef,
                contentId: backup.id,
                difficulty: backup.difficulty as DifficultyLevel
            };
        }
    }

    return newStages;
}

// --- SCORING FUNCTIONS (Pure) ---

function scoreToPercentile(score: number, mean: number, sd: number): number {
    const z = (score - mean) / sd;
    const t = 1 / (1 + 0.2316419 * Math.abs(z));
    const d = 0.3989423 * Math.exp(-z * z / 2);
    const probability = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
    return Math.round((z > 0 ? 1 - probability : probability) * 100);
}

// 1. IQ Calculation (IRT-Proxy + Latency Efficiency)
function calculateIQ(responses: ResponseData[], stages: StageDefinition[]): { score: number, percentile: number, efficiency: number } {
    const iqResponses = responses.filter(r => {
        const stageDef = stages[r.stage];
        return stageDef && stageDef.type === 'matrix';
    });

    if (iqResponses.length === 0) return { score: 100, percentile: 50, efficiency: 50 };

    let totalWeightedScore = 0;
    let maxWeightedScore = 0;
    let totalEfficiency = 0;

    iqResponses.forEach(r => {
        const stageDef = stages[r.stage];
        // Find puzzle in either collection
        const textPuzzle = LOGIC_PUZZLES.find(p => p.id === stageDef.contentId);
        const visualPuzzle = VISUAL_PUZZLES.find(p => p.id === stageDef.contentId);
        const puzzle = textPuzzle || visualPuzzle;

        if (puzzle) {
            // IRT Parameters
            const b = puzzle.difficulty;       // 1-10
            const a = puzzle.discrimination;   // 0.5-2.0

            // Weight = Difficulty * Discrimination (Harder, clearer items worth more)
            const itemWeight = b * a;
            maxWeightedScore += itemWeight;

            // Check correctness - Auto-grade if accuracy exists, else deduce
            let isCorrect = r.accuracy;
            if (isCorrect === undefined) isCorrect = Number(r.choice) === puzzle.correctIndex;

            if (isCorrect) {
                totalWeightedScore += itemWeight;

                // Cognitive Efficiency Bonus (Latency Analysis)
                // Expected time: 5s + (Difficulty * 2s)
                const expectedTime = 5000 + (b * 2000);
                const actualTime = Math.max(1000, r.latency_ms);

                // Efficiency Ratio: >1.0 means fast & correct
                const ratio = expectedTime / actualTime;

                // Logarithmic Speed Bonus (Diminishing returns to prevent spam-clicking)
                // Math.log(ratio) grows slower than linear 'ratio'. 
                // e.g. Ratio 2.0 (2x speed) -> log(2) ~0.69 -> * 0.15 = ~0.10 (10% bonus)
                // Cap at 25% max bonus.
                const logBonus = Math.max(0, Math.log(ratio) * 0.15);
                const speedBonus = Math.min(0.25, logBonus) * itemWeight;

                totalWeightedScore += speedBonus;
                totalEfficiency += ratio;
            } else {
                // Incorrect: Penalize efficiency slightly if strictly tracking
                totalEfficiency += 0.5;
            }
        }
    });

    // Normalize
    const abilityIndex = totalWeightedScore / maxWeightedScore; // 0 to 1+ (with bonus)
    const rawIQ = 70 + (abilityIndex * 85); // Map to 70-155 range

    // Efficiency Score (0-100)
    const avgEfficiency = (totalEfficiency / iqResponses.length) * 50;

    return {
        score: Math.round(rawIQ),
        percentile: scoreToPercentile(rawIQ, 100, 15),
        efficiency: Math.min(100, Math.round(avgEfficiency))
    };
}

// 2. EQ Calculation
function calculateEQ(responses: ResponseData[], stages: StageDefinition[]): { score: number, percentile: number } {
    const eqResponses = responses.filter(r => stages[r.stage]?.type === 'scenario');

    if (eqResponses.length === 0) return { score: 100, percentile: 50 };

    let totalPoints = 0;
    let maxPoints = 0;

    eqResponses.forEach(r => {
        const stageDef = stages[r.stage];
        const scenario = EQ_SCENARIOS.find(s => s.id === stageDef.contentId);

        if (scenario) {
            const choiceIndex = Number(r.choice);
            if (scenario.options[choiceIndex]) {
                totalPoints += scenario.options[choiceIndex].score;
            }
            maxPoints += 5;
        }
    });

    const percentage = totalPoints / maxPoints;
    const rawEQ = 65 + (percentage * 80); // 65-145 range

    return {
        score: Math.round(rawEQ),
        percentile: scoreToPercentile(rawEQ, 100, 15)
    };
}

// 3. HEXACO Personality Calculation
function calculateHEXACO(responses: ResponseData[], stages: StageDefinition[]) {
    // Filter for personality but EXCLUDE validity checks
    const pResponses = responses.filter(r => {
        const stage = stages[r.stage];
        return stage?.type === 'personality' && !ATTENTION_CHECKS.some(c => c.id === stage.contentId);
    });

    // Initialize Accumulators
    const scores = {
        honesty: 0,
        emotionality: 0,
        extraversion: 0,
        agreeableness: 0,
        conscientiousness: 0,
        openness: 0
    };

    const maxScores = { ...scores };

    pResponses.forEach(r => {
        const stageDef = stages[r.stage];
        const item = HEXACO_ITEMS.find(i => i.id === stageDef.contentId);

        if (item) {
            let val = Number(r.choice); // 1-7 Scale
            // Reverse coding logic: 7 -> 1, 1 -> 7
            if (item.reverse) val = 8 - val;

            scores[item.category] += val;
            maxScores[item.category] += 7; // Max per item is 7
        }
    });

    // Normalize to 0-100
    const normalize = (val: number, max: number) => {
        if (max === 0) return 50;
        return Math.round((val / max) * 100);
    };

    return {
        honesty: normalize(scores.honesty, maxScores.honesty),
        emotionality: normalize(scores.emotionality, maxScores.emotionality),
        extraversion: normalize(scores.extraversion, maxScores.extraversion),
        agreeableness: normalize(scores.agreeableness, maxScores.agreeableness),
        conscientiousness: normalize(scores.conscientiousness, maxScores.conscientiousness),
        openness: normalize(scores.openness, maxScores.openness)
    };
}

// Validity Check Calculation
function calculateValidity(responses: ResponseData[], stages: StageDefinition[]): { score: number, flagged: boolean } {
    const checkResponses = responses.filter(r => {
        const stage = stages[r.stage];
        return stage && ATTENTION_CHECKS.some(c => c.id === stage.contentId);
    });

    if (checkResponses.length === 0) return { score: 100, flagged: false };

    let passed = 0;
    checkResponses.forEach(r => {
        const stage = stages[r.stage];
        const check = ATTENTION_CHECKS.find(c => c.id === stage.contentId);
        const val = Number(r.choice);

        // Logic based on ID
        if (check?.id === 'VAL1' && val <= 2) passed++; // "Strongly Disagree" (1 or 2 tolerant)
        else if (check?.id === 'VAL2' && (val >= 3 && val <= 5)) passed++; // "Neutral" (4, tol 3-5)
        else if (check?.id === 'VAL3' && val >= 6) passed++; // "Strongly Agree" (7, tol 6)
        else if (check?.id === 'VAL4' && val >= 6) passed++; // "Strongly Agree" (7, tol 6)
    });

    const score = Math.round((passed / checkResponses.length) * 100);
    return { score, flagged: score < 50 };
}

// 4. Final Aggregator
export function calculateFinalScores(responses: ResponseData[], stages: StageDefinition[]): FinalScores {
    const iqResult = calculateIQ(responses, stages);
    const eqResult = calculateEQ(responses, stages);
    const hexaco = calculateHEXACO(responses, stages);
    const validity = calculateValidity(responses, stages);

    // BART / Risk
    const riskResponse = responses.find(r => stages[r.stage]?.type === 'bart');
    let riskTolerance = 50;

    if (riskResponse) {
        // Logarithmic scaling for risk (diminishing returns)
        const pumps = Number(riskResponse.choice); // Average pumps
        const normalized = Math.min(1, pumps / 45); // Assuming max avg ~45
        riskTolerance = Math.round(15 + (85 * Math.pow(normalized, 0.7)));
    }

    // Determine Apex Traits (Top 3 Percentiles)
    const traitList = [
        { trait: 'Cognitive Efficiency', score: iqResult.efficiency, description: 'Rapid and accurate information processing.' },
        { trait: 'Fluid Intelligence', score: iqResult.percentile, description: 'Exceptional abstract reasoning ability.' },
        { trait: 'Emotional Intelligence', score: eqResult.percentile, description: 'High capacity for empathy and regulation.' },
        { trait: 'Honesty-Humility', score: hexaco.honesty, description: 'Sincere, fair, and unassuming nature.' },
        { trait: 'Risk Tolerance', score: riskTolerance, description: 'Boldness in the face of uncertainty.' },
        { trait: 'Conscientiousness', score: hexaco.conscientiousness, description: 'Strong organization and diligence.' },
        { trait: 'Extraversion', score: hexaco.extraversion, description: 'High social energy and assertiveness.' },
        { trait: 'Resilience (Inv. Emotionality)', score: 100 - hexaco.emotionality, description: 'Calmness under pressure.' },
        { trait: 'Openness', score: hexaco.openness, description: 'Deep intellectual curiosity.' },
        { trait: 'Agreeableness', score: hexaco.agreeableness, description: 'Cooperative and forgiving nature.' }
    ];

    const apexTraits = traitList.sort((a, b) => b.score - a.score).slice(0, 3);

    return {
        iq: iqResult.score,
        iqPercentile: iqResult.percentile,
        eq: eqResult.score,
        eqPercentile: eqResult.percentile,
        riskTolerance,
        riskPercentile: riskTolerance, // Proxy
        hexaco: hexaco,
        ocean: { // Legacy Mapping for compat if needed, or derived
            openness: hexaco.openness,
            conscientiousness: hexaco.conscientiousness,
            extraversion: hexaco.extraversion,
            agreeableness: hexaco.agreeableness,
            neuroticism: hexaco.emotionality
        },
        apexTraits,
        validityScore: validity.score,
        isFlagged: validity.flagged,
        rawResponses: responses
    };
}

export const STAGE_DEFINITIONS: StageDefinition[] = []; // Deprecated, kept to avoid immediate build breaks before store update
