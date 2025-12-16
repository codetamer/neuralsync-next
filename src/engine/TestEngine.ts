// Core Test Engine - Functional Helpers for State Management

import type { ResponseData, FinalScores } from '../utils/storage';
import { HEXACO_ITEMS, LOGIC_PUZZLES, VISUAL_PUZZLES, EQ_SCENARIOS, ATTENTION_CHECKS } from '../data/testContent';
import { MATRIX_PUZZLES } from '../data/matrixContent';
import { ValidationEngine } from './ValidationEngine';
import { BIAS_ITEMS } from '../data/biasContent';
import { VOCABULARY_ITEMS } from '../data/vocabularyContent';

export type StageType = 'matrix' | 'stroop' | 'bart' | 'personality' | 'intro' | 'scenario' | 'debug' | 'outro' | 'nback' | 'digitspan' | 'spatialspan' | 'symbolmatch' | 'reactiontime' | 'vocabulary' | 'trailmaking' | 'biasaudit' | 'emotion';
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

// --- RANKED FACTORY: Fixed, high-stakes session ---
export const createRankedSession = (): StageDefinition[] => {
    // Select 3 random hard matrix puzzles (Diff 6-10) for variety
    const matrixPool = MATRIX_PUZZLES.filter(p => p.difficulty >= 6);
    const selectedMatrices = selectRandomItems(matrixPool, 3);

    // Core Cognitive Tasks (to be shuffled)
    const coreTasks: StageDefinition[] = [
        // Processing Speed
        { stage: 0, type: 'symbolmatch', title: 'Pattern Velocity', difficulty: 6, description: 'High-speed pattern recognition.', contentId: 'rk-sym-1' },
        // Working Memory
        { stage: 0, type: 'nback', title: 'Working Memory', difficulty: 7, description: '2-Back memory challenge.', contentId: 'rk-nback-1' },
        // Executive Function
        { stage: 0, type: 'trailmaking', title: 'Executive Control', difficulty: 7, description: 'Rapid cognitive switching (Num/Alpha).', contentId: 'rk-tm-1' },
        // Visuospatial Memory
        { stage: 0, type: 'spatialspan', title: 'Spatial Recall', difficulty: 7, description: 'Memorize complex spatial sequences.', contentId: 'rk-ss-1' },
    ];

    // Shuffle Core Tasks
    const shuffledCore = coreTasks.sort(() => 0.5 - Math.random());

    // Construct final stage list
    const stages: StageDefinition[] = [
        { stage: 0, type: 'intro', title: 'Start Gauntlet', difficulty: 1, description: 'Competitive Mode: No Retries.' },

        // 1. Warmup - Reaction Time (Always First)
        { stage: 1, type: 'reactiontime', title: 'Neural Reflex', difficulty: 5, description: 'Measure your baseline reaction speed.', contentId: 'rk-rt-1' },

        // 2-5. Shuffled Core Tasks
        ...shuffledCore.map((task, idx) => ({ ...task, stage: 2 + idx })),

        // 6-8. Fluid Intelligence - The Boss Fight (Always Last)
        { stage: 6, type: 'matrix', title: 'Abstract Logic I', difficulty: (selectedMatrices[0]?.difficulty || 7) as DifficultyLevel, description: 'Advanced pattern recognition.', contentId: selectedMatrices[0]?.id || 'GF_010' },
        { stage: 7, type: 'matrix', title: 'Abstract Logic II', difficulty: (selectedMatrices[1]?.difficulty || 8) as DifficultyLevel, description: 'Complex logical deduction.', contentId: selectedMatrices[1]?.id || 'GF_015' },
        { stage: 8, type: 'matrix', title: 'Abstract Logic III', difficulty: (selectedMatrices[2]?.difficulty || 9) as DifficultyLevel, description: 'Elite-level reasoning challenge.', contentId: selectedMatrices[2]?.id || 'GF_020' },
    ];

    return stages;
};

// --- QUICK SCAN FACTORY: Ultra-fast ~4-5 minute assessment ---
// Provides core insights without exhaustive testing
export const createQuickSession = (): StageDefinition[] => {
    const stages: StageDefinition[] = [
        { stage: 0, type: 'intro', title: 'Quick Scan', difficulty: 1, description: 'Rapid cognitive snapshot - 4-5 minutes' }
    ];

    let stageCount = 1;

    // 1. REACTION TIME (Quick cognitive speed baseline)
    stages.push({
        stage: stageCount++,
        type: 'reactiontime',
        title: 'Neural Reflex',
        difficulty: 3,
        description: 'Test your reflexes and response speed.'
    });

    // 2. MATRIX (4 puzzles only - covers fluid IQ)
    const selectedMatrices = selectRandomItems(MATRIX_PUZZLES, 4);
    selectedMatrices.forEach((puzzle, index) => {
        stages.push({
            stage: stageCount++,
            type: 'matrix',
            title: `Pattern ${index + 1}`,
            difficulty: puzzle.difficulty as DifficultyLevel,
            description: 'Quick pattern analysis.',
            contentId: puzzle.id
        });
    });

    // 3. EQ SCENARIOS (4 quick scenarios)
    const selectedEQ = selectRandomItems(EQ_SCENARIOS, 4);
    selectedEQ.forEach((scenario, index) => {
        stages.push({
            stage: stageCount++,
            type: 'scenario',
            title: `Scenario ${index + 1}`,
            difficulty: 5,
            description: 'Quick social assessment.',
            contentId: scenario.id
        });
    });

    // 4. EMOTION RECOGNITION (Quick)
    stages.push({
        stage: stageCount++,
        type: 'emotion',
        title: 'Micro-Expression',
        difficulty: 5,
        description: 'Rapid emotion identification.'
    });

    // 5. BART (Risk assessment - engaging and fast)
    stages.push({
        stage: stageCount++,
        type: 'bart',
        title: 'Risk Profile',
        difficulty: 5,
        description: 'Quick risk tolerance check.'
    });

    // 5. PERSONALITY (2 items per trait = 12 items for Quick Scan)
    const hItems = selectRandomItems(HEXACO_ITEMS.filter(i => i.category === 'honesty'), 2);
    const eItems = selectRandomItems(HEXACO_ITEMS.filter(i => i.category === 'emotionality'), 2);
    const xItems = selectRandomItems(HEXACO_ITEMS.filter(i => i.category === 'extraversion'), 2);
    const aItems = selectRandomItems(HEXACO_ITEMS.filter(i => i.category === 'agreeableness'), 2);
    const cItems = selectRandomItems(HEXACO_ITEMS.filter(i => i.category === 'conscientiousness'), 2);
    const oItems = selectRandomItems(HEXACO_ITEMS.filter(i => i.category === 'openness'), 2);
    // Total 12 items
    const personalityMix = [
        ...hItems, ...eItems, ...xItems, ...aItems, ...cItems, ...oItems
    ].sort(() => 0.5 - Math.random());

    personalityMix.forEach((item, index) => {
        stages.push({
            stage: stageCount++,
            type: 'personality',
            title: `Quick Trait ${index + 1}`,
            difficulty: 3,
            description: 'Rapid self-assessment.',
            contentId: item.id
        });
    });

    return stages;
};

// --- FACTORY FUNCTION: Create a new unique test session ---
// OPTIMIZED: Reduced from 12-15 min to ~7-8 min while maintaining validity
export const createTestSession = (): StageDefinition[] => {
    // 0. Intro
    const stages: StageDefinition[] = [
        { stage: 0, type: 'intro', title: 'Welcome', difficulty: 1, description: 'Introduction to NeuralSync Evaluator' }
    ];

    let stageCount = 1;

    // 1. FLUID INTELLIGENCE BLOCK (8 Stages total - reduced from 15)
    // Use new MATRIX_PUZZLES as primary, supplement with logic puzzles
    const selectedMatrices = selectRandomItems(MATRIX_PUZZLES, 6); // Reduced from 10
    const selectedLogic = selectRandomItems(LOGIC_PUZZLES, 2);     // Reduced from 5

    // Interleave visual matrices with logic puzzles
    const iqMix: { id: string; difficulty: number; discrimination: number }[] = [];
    const maxLength = Math.max(selectedMatrices.length, selectedLogic.length);
    for (let i = 0; i < maxLength; i++) {
        if (i < selectedMatrices.length) iqMix.push(selectedMatrices[i]);
        if (i < selectedLogic.length) iqMix.push(selectedLogic[i]);
    }

    iqMix.forEach((puzzle, index) => {
        stages.push({
            stage: stageCount++,
            type: 'matrix',
            title: `Pattern Analysis ${index + 1}`,
            difficulty: puzzle.difficulty as DifficultyLevel,
            description: 'Analyze the pattern and deduce the correct solution.',
            contentId: puzzle.id
        });
    });

    // 2. WORKING MEMORY BLOCK (N-Back + Digit Span + Spatial Span)
    stages.push({
        stage: stageCount++,
        type: 'nback',
        title: 'N-Back Memory',
        difficulty: 6,
        description: 'Monitor the sequence and identify repeated patterns.'
    });

    stages.push({
        stage: stageCount++,
        type: 'digitspan',
        title: 'Digit Span',
        difficulty: 5,
        description: 'Remember and repeat sequences of digits.'
    });

    stages.push({
        stage: stageCount++,
        type: 'spatialspan',
        title: 'Spatial Memory',
        difficulty: 5,
        description: 'Remember the sequence of highlighted blocks.'
    });

    // 3. PROCESSING SPEED BLOCK
    stages.push({
        stage: stageCount++,
        type: 'symbolmatch',
        title: 'Symbol Matching',
        difficulty: 4,
        description: 'Find matching symbols as quickly as possible.'
    });

    stages.push({
        stage: stageCount++,
        type: 'reactiontime',
        title: 'Reaction Speed',
        difficulty: 3,
        description: 'Test your reflexes and response speed.'
    });

    // 4. CRYSTALLIZED INTELLIGENCE BLOCK
    stages.push({
        stage: stageCount++,
        type: 'vocabulary',
        title: 'Vocabulary',
        difficulty: 5,
        description: 'Test your knowledge of word meanings.'
    });

    // 5. EXECUTIVE FUNCTION BLOCK
    stages.push({
        stage: stageCount++,
        type: 'trailmaking',
        title: 'Trail Making',
        difficulty: 5,
        description: 'Connect the dots in sequence as quickly as possible.'
    });

    // 6. META-COGNITION BLOCK
    stages.push({
        stage: stageCount++,
        type: 'biasaudit',
        title: 'Cognitive Bias Audit',
        difficulty: 6,
        description: 'Identify and resist common decision-making biases.'
    });

    // 7. EQ BLOCK (6 items from 40 pool - reduced from 10)
    const selectedEQ = selectRandomItems(EQ_SCENARIOS, 6);
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

    // 8. EMOTION RECOGNITION (Full)
    stages.push({
        stage: stageCount++,
        type: 'emotion',
        title: 'Micro-Expression Analysis',
        difficulty: 7,
        description: 'Identify fleeting emotional cues.'
    });

    // 9. RISK BLOCK (BART)
    stages.push({
        stage: stageCount++,
        type: 'bart',
        title: 'Risk Assessment',
        difficulty: 5,
        description: 'Evaluate risk vs reward potential.'
    });

    // 9. PERSONALITY BLOCK (HEXACO-24: 4 per trait = 24 items + 1 check = 25 total)
    // Detailed analysis
    const hItems = selectRandomItems(HEXACO_ITEMS.filter(i => i.category === 'honesty'), 4);
    const eItems = selectRandomItems(HEXACO_ITEMS.filter(i => i.category === 'emotionality'), 4);
    const xItems = selectRandomItems(HEXACO_ITEMS.filter(i => i.category === 'extraversion'), 4);
    const aItems = selectRandomItems(HEXACO_ITEMS.filter(i => i.category === 'agreeableness'), 4);
    const cItems = selectRandomItems(HEXACO_ITEMS.filter(i => i.category === 'conscientiousness'), 4);
    const oItems = selectRandomItems(HEXACO_ITEMS.filter(i => i.category === 'openness'), 4);
    const checks = selectRandomItems(ATTENTION_CHECKS, 1); // Reduced from 2 to 1

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
    return Math.min(99, Math.round((z > 0 ? 1 - probability : probability) * 100));
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
        // Find puzzle in any collection (new visual matrices first, then legacy)
        const newMatrixPuzzle = MATRIX_PUZZLES.find(p => p.id === stageDef.contentId);
        const textPuzzle = LOGIC_PUZZLES.find(p => p.id === stageDef.contentId);
        const visualPuzzle = VISUAL_PUZZLES.find(p => p.id === stageDef.contentId);
        const puzzle = newMatrixPuzzle || textPuzzle || visualPuzzle;

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
    const eqResponses = responses.filter(r => {
        const type = stages[r.stage]?.type;
        return type === 'scenario' || type === 'emotion';
    });

    if (eqResponses.length === 0) return { score: 100, percentile: 50 };

    let totalPoints = 0;
    let maxPoints = 0;

    eqResponses.forEach(r => {
        const stageDef = stages[r.stage];

        if (stageDef.type === 'emotion') {
            // Emotion: 5 points for correct, 0 for incorrect
            if (r.accuracy) totalPoints += 5;
            maxPoints += 5;
        } else if (stageDef.type === 'scenario') {
            const scenario = EQ_SCENARIOS.find(s => s.id === stageDef.contentId);
            if (scenario) {
                const choiceIndex = Number(r.choice);
                if (scenario.options[choiceIndex]) {
                    totalPoints += scenario.options[choiceIndex].score;
                }
                maxPoints += 5;
            }
        }
    });

    const percentage = maxPoints > 0 ? totalPoints / maxPoints : 0.5;
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

// 5. Working Memory Scoring (N-Back, Digit Span, Spatial Span)
function calculateWorkingMemory(responses: ResponseData[], stages: StageDefinition[]): number {
    let nbackScore = 0;
    let digitScore = 0;
    let spatialScore = 0;

    // N-Back (d-prime based)
    const nbackResp = responses.find(r => stages[r.stage]?.type === 'nback');
    if (nbackResp && nbackResp.choice) {
        // choice contains d-prime (typically -1 to +4.5)
        // Map d' to 0-100 percentile-like score
        // d' = 0 (chance) -> 50
        // d' = 3 (excellent) -> 100
        // d' = -1 (terrible) -> 20
        const dPrime = Number(nbackResp.choice);
        nbackScore = Math.min(100, Math.max(0, (dPrime * 16.6) + 50));
    }

    // Digit Span (Span Length)
    const digitResp = responses.find(r => stages[r.stage]?.type === 'digitspan');
    if (digitResp) {
        // Choice stores max span (e.g. 7)
        // Range: 3 to 9+
        // 3 -> 0 (Baseline)
        // 5 -> 33
        // 7 -> 66
        // 9 -> 100
        const span = Number(digitResp.choice);
        digitScore = Math.min(100, Math.max(0, (span - 3) * 16.6));
    }

    // Spatial Span (Span Length)
    const spatialResp = responses.find(r => stages[r.stage]?.type === 'spatialspan');
    if (spatialResp) {
        const span = Number(spatialResp.choice);
        spatialScore = Math.min(100, Math.max(0, (span - 3) * 16.6));
    }

    return Math.round((nbackScore + digitScore + spatialScore) / 3);
}

// 6. Processing Speed Scoring (Symbol Match, Reaction Time)
function calculateProcessingSpeed(responses: ResponseData[], stages: StageDefinition[]): number {
    let symbolScore = 0;
    let reactionScore = 0;

    // Symbol Match (Items correct per minute)
    const symResp = responses.find(r => stages[r.stage]?.type === 'symbolmatch');
    if (symResp) {
        // Raw score is number of correct matches
        const matches = Number(symResp.choice);
        // Norm: 40 matches = 100, 20 matches = 50
        symbolScore = Math.min(100, matches * 2.5);
    }

    // Reaction Time (Milliseconds)
    const rtResp = responses.find(r => stages[r.stage]?.type === 'reactiontime');
    if (rtResp) {
        // Lower is better. 150ms = 100, 500ms = 50
        const rt = Number(rtResp.choice);
        // Determine using inverse curve
        if (rt > 0) {
            reactionScore = Math.max(0, Math.min(100, 120 - ((rt - 150) / 5)));
        }
    }

    // Weight Symbol Match higher as it involves decision speed vs pure reflex
    return Math.round((symbolScore * 0.6) + (reactionScore * 0.4));
}

// 7. Crystallized Intelligence (Vocabulary)
function calculateCrystallized(responses: ResponseData[], stages: StageDefinition[]): number {
    const vocabResponses = responses.filter(r => stages[r.stage]?.type === 'vocabulary');
    if (vocabResponses.length === 0) return 50;

    // Use the component's final reported score if available, or calculate manually
    // The VocabularyStage component reports final % score as a single response at the end usually
    // Or we track per-item. Let's assume we sum content-based item accuracy

    // Actually, TestEngine usually receives per-stage responses. 
    // If VocabularyStage emits one response per item:
    if (vocabResponses.length > 1) {
        let weightedScore = 0;
        let maxScore = 0;

        vocabResponses.forEach(r => {
            const stage = stages[r.stage];
            // Lookup item difficulty if possible, or assume 5
            const itemDiff = 5;
            const isCorrect = r.accuracy === true;

            weightedScore += isCorrect ? itemDiff : 0;
            maxScore += itemDiff;
        });

        return maxScore > 0 ? Math.round((weightedScore / maxScore) * 100) : 50;
    }

    // If it emits a summary score
    const summary = vocabResponses[0];
    return Number(summary.choice) || 50;
}

// 8. Executive Function (Trail Making)
function calculateExecutive(responses: ResponseData[], stages: StageDefinition[]): number {
    const trailResp = responses.find(r => stages[r.stage]?.type === 'trailmaking');
    if (!trailResp) return 50;

    // Score based on time (lower better) and errors
    // Assuming choice contains completion time in ms, or a composite score passed by component
    // If component passes a score 0-100 directly:
    return Number(trailResp.choice) || 50;
}

// 9. Meta-Cognition (Bias Audit)
function calculateMetaCoqnition(responses: ResponseData[], stages: StageDefinition[]): { biasResistance: number, confidenceCal: number } {
    const biasResp = responses.find(r => stages[r.stage]?.type === 'biasaudit');

    // Bias resistance 0-100
    const biasResistance = biasResp ? Number(biasResp.choice) : 50;

    // Confidence calibration: Difference between confidence rating and actual accuracy key
    // Currently we don't have explicit confidence sliders on every question, 
    // so we'll use a placeholder or derive from consistency for now.
    // Future: Add confidence slider to matrix/logic stages.

    return {
        biasResistance,
        confidenceCal: 75 // Placeholder for Phase 2
    };
}


// 4. Final Aggregator
export function calculateFinalScores(responses: ResponseData[], stages: StageDefinition[]): FinalScores {
    const iqResult = calculateIQ(responses, stages);
    const eqResult = calculateEQ(responses, stages);
    const hexaco = calculateHEXACO(responses, stages);

    // New Metrics
    const wmScore = calculateWorkingMemory(responses, stages);
    const speedScore = calculateProcessingSpeed(responses, stages);
    const gcScore = calculateCrystallized(responses, stages);
    const efScore = calculateExecutive(responses, stages);
    const metaResult = calculateMetaCoqnition(responses, stages);

    // Anti-Gaming Validation
    const validation = ValidationEngine.validateTestSession(responses, stages, ATTENTION_CHECKS.map(c => c.id));

    // BART / Risk
    const riskResponse = responses.find(r => stages[r.stage]?.type === 'bart');
    let riskTolerance = 50;
    if (riskResponse) {
        const pumps = Number(riskResponse.choice);
        const normalized = Math.min(1, pumps / 45);
        riskTolerance = Math.round(15 + (85 * Math.pow(normalized, 0.7)));
    }

    // Determine Apex Traits (Top 3 Percentiles)
    const traitList = [
        { trait: 'Fluid Intelligence', score: iqResult.percentile, description: 'Exceptional abstract reasoning ability.' },
        { trait: 'Cognitive Efficiency', score: iqResult.efficiency, description: 'Rapid information processing.' },
        { trait: 'Crystallized IQ', score: gcScore, description: 'Deep verbal knowledge and experience.' },
        { trait: 'Working Memory', score: wmScore, description: 'Superior mental workspace capacity.' },
        { trait: 'Executive Function', score: efScore, description: 'Elite cognitive control and flexibility.' },
        { trait: 'Emotional Intelligence', score: eqResult.percentile, description: 'High capacity for empathy and regulation.' },
        { trait: 'Bias Resistance', score: metaResult.biasResistance, description: 'Rational, objective decision making.' },
        { trait: 'Risk Tolerance', score: riskTolerance, description: 'Boldness in the face of uncertainty.' },
        { trait: 'Conscientiousness', score: hexaco.conscientiousness, description: 'Strong organization and diligence.' },
        { trait: 'Openness', score: hexaco.openness, description: 'Deep intellectual curiosity.' },
        { trait: 'Resilience', score: 100 - hexaco.emotionality, description: 'Calmness under pressure.' },
        { trait: 'Extraversion', score: hexaco.extraversion, description: 'High social energy.' }
    ];

    const apexTraits = traitList.sort((a, b) => b.score - a.score).slice(0, 3);

    return {
        iq: iqResult.score,
        iqPercentile: iqResult.percentile,
        eq: eqResult.score,
        eqPercentile: eqResult.percentile,
        riskTolerance,
        riskPercentile: riskTolerance,
        hexaco: hexaco,
        ocean: {
            openness: hexaco.openness,
            conscientiousness: hexaco.conscientiousness,
            extraversion: hexaco.extraversion,
            agreeableness: hexaco.agreeableness,
            neuroticism: hexaco.emotionality
        },
        // NEW GRANULAR DATA
        cognitive: {
            fluid: iqResult.percentile, // Using percentile for normalized view
            crystallized: gcScore,
            memory: wmScore,
            speed: speedScore,
            executive: efScore
        },
        meta: metaResult,
        antigaming: {
            flags: validation.flags.map(f => f.message),
            suspicionScore: 100 - validation.overallScore
        },
        apexTraits,
        validityScore: validation.overallScore,
        isFlagged: !validation.isValid,
        rawResponses: responses
    };
}

export const STAGE_DEFINITIONS: StageDefinition[] = []; // Deprecated, kept to avoid immediate build breaks before store update
