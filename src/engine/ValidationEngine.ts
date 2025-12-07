// Anti-Gaming Validation Engine
// Detects suspicious response patterns and validates test integrity

import type { ResponseData } from '../utils/storage';
import type { StageDefinition } from './TestEngine';

export interface ValidationResult {
    isValid: boolean;
    overallScore: number;  // 0-100, higher = more valid
    flags: ValidationFlag[];
    details: {
        speedScore: number;
        patternScore: number;
        consistencyScore: number;
        attentionScore: number;
    };
}

export interface ValidationFlag {
    type: 'warning' | 'critical';
    code: string;
    message: string;
}

// Minimum response times by stage type (milliseconds)
const MINIMUM_RESPONSE_TIMES: Record<string, number> = {
    matrix: 3000,      // 3s to actually analyze a pattern
    vocabulary: 2000,  // 2s to read word and options
    scenario: 3000,    // 3s to read scenario
    personality: 1000, // 1s to read statement
    nback: 500,        // 0.5s per stimulus
    digitspan: 500,
    spatialspan: 500,
    symbolmatch: 300,
    reactiontime: 100, // Very fast by design
    trailmaking: 500,
    bias: 3000,        // 3s to read bias scenario
    bart: 200          // Fast clicks expected
};

// Speed-based validation
export function validateResponseSpeed(
    responses: ResponseData[],
    stages: StageDefinition[]
): { score: number; violations: number } {
    let violations = 0;
    let totalChecked = 0;

    responses.forEach(r => {
        const stageDef = stages[r.stage];
        if (!stageDef) return;

        const minTime = MINIMUM_RESPONSE_TIMES[stageDef.type] || 1000;
        totalChecked++;

        if (r.latency_ms < minTime) {
            violations++;
        }
    });

    if (totalChecked === 0) return { score: 100, violations: 0 };

    const violationRate = violations / totalChecked;
    const score = Math.max(0, Math.round((1 - violationRate) * 100));

    return { score, violations };
}

// Pattern-based validation (detecting same answer spam, alternating patterns)
export function validateResponsePatterns(
    responses: ResponseData[]
): { score: number; patternDetected: string | null } {
    if (responses.length < 5) return { score: 100, patternDetected: null };

    const choices = responses.map(r => r.choice);

    // Check for all-same answers
    const uniqueChoices = new Set(choices);
    if (uniqueChoices.size === 1 && responses.length > 10) {
        return { score: 20, patternDetected: 'all_same' };
    }

    // Check for simple alternating pattern (A-B-A-B)
    let alternatingCount = 0;
    for (let i = 2; i < choices.length; i++) {
        if (choices[i] === choices[i - 2] && choices[i] !== choices[i - 1]) {
            alternatingCount++;
        }
    }

    const alternatingRate = alternatingCount / (choices.length - 2);
    if (alternatingRate > 0.8) {
        return { score: 30, patternDetected: 'alternating' };
    }

    // Check for sequential pattern (1-2-3-4-1-2-3-4)
    let sequentialMatches = 0;
    const cycleLength = 4;
    for (let i = cycleLength; i < choices.length; i++) {
        if (choices[i] === choices[i - cycleLength]) {
            sequentialMatches++;
        }
    }

    const sequentialRate = sequentialMatches / (choices.length - cycleLength);
    if (sequentialRate > 0.9) {
        return { score: 25, patternDetected: 'sequential' };
    }

    return { score: 100, patternDetected: null };
}

// Consistency validation (for duplicate/similar items)
export function validateConsistency(
    responses: ResponseData[],
    stages: StageDefinition[]
): { score: number; inconsistencies: number } {
    // Find responses to same contentId
    const responsesByContent: Record<string, ResponseData[]> = {};

    responses.forEach(r => {
        const stageDef = stages[r.stage];
        if (stageDef?.contentId) {
            if (!responsesByContent[stageDef.contentId]) {
                responsesByContent[stageDef.contentId] = [];
            }
            responsesByContent[stageDef.contentId].push(r);
        }
    });

    let inconsistencies = 0;
    let duplicateChecks = 0;

    Object.values(responsesByContent).forEach(resps => {
        if (resps.length > 1) {
            duplicateChecks++;
            const firstChoice = resps[0].choice;
            if (!resps.every(r => r.choice === firstChoice)) {
                inconsistencies++;
            }
        }
    });

    if (duplicateChecks === 0) return { score: 100, inconsistencies: 0 };

    const consistencyRate = (duplicateChecks - inconsistencies) / duplicateChecks;
    return { score: Math.round(consistencyRate * 100), inconsistencies };
}

// Attention check validation
export function validateAttentionChecks(
    responses: ResponseData[],
    stages: StageDefinition[],
    attentionCheckIds: string[]
): { score: number; failed: number; total: number } {
    let passed = 0;
    let total = 0;

    responses.forEach(r => {
        const stageDef = stages[r.stage];
        if (stageDef?.contentId && attentionCheckIds.includes(stageDef.contentId)) {
            total++;
            // Attention checks should have accuracy = true when passed
            if (r.accuracy === true) {
                passed++;
            }
        }
    });

    if (total === 0) return { score: 100, failed: 0, total: 0 };

    return {
        score: Math.round((passed / total) * 100),
        failed: total - passed,
        total
    };
}

// Main validation function
export function validateTestSession(
    responses: ResponseData[],
    stages: StageDefinition[],
    attentionCheckIds: string[] = []
): ValidationResult {
    const flags: ValidationFlag[] = [];

    // Speed validation
    const speedResult = validateResponseSpeed(responses, stages);
    if (speedResult.violations > responses.length * 0.2) {
        flags.push({
            type: speedResult.violations > responses.length * 0.5 ? 'critical' : 'warning',
            code: 'SPEED_VIOLATION',
            message: `${speedResult.violations} responses were too fast`
        });
    }

    // Pattern validation
    const patternResult = validateResponsePatterns(responses);
    if (patternResult.patternDetected) {
        flags.push({
            type: 'critical',
            code: 'PATTERN_DETECTED',
            message: `Suspicious pattern: ${patternResult.patternDetected}`
        });
    }

    // Consistency validation
    const consistencyResult = validateConsistency(responses, stages);
    if (consistencyResult.inconsistencies > 2) {
        flags.push({
            type: 'warning',
            code: 'INCONSISTENT_RESPONSES',
            message: `${consistencyResult.inconsistencies} inconsistent responses to duplicate items`
        });
    }

    // Attention check validation
    const attentionResult = validateAttentionChecks(responses, stages, attentionCheckIds);
    if (attentionResult.failed > 0) {
        flags.push({
            type: attentionResult.failed > 1 ? 'critical' : 'warning',
            code: 'ATTENTION_FAILED',
            message: `Failed ${attentionResult.failed}/${attentionResult.total} attention checks`
        });
    }

    // Calculate overall score (weighted average)
    const weights = {
        speed: 0.25,
        pattern: 0.30,
        consistency: 0.20,
        attention: 0.25
    };

    const overallScore = Math.round(
        speedResult.score * weights.speed +
        patternResult.score * weights.pattern +
        consistencyResult.score * weights.consistency +
        attentionResult.score * weights.attention
    );

    const hasCriticalFlag = flags.some(f => f.type === 'critical');

    return {
        isValid: overallScore >= 60 && !hasCriticalFlag,
        overallScore,
        flags,
        details: {
            speedScore: speedResult.score,
            patternScore: patternResult.score,
            consistencyScore: consistencyResult.score,
            attentionScore: attentionResult.score
        }
    };
}

// Export for use in scoring
export const ValidationEngine = {
    validateTestSession,
    validateResponseSpeed,
    validateResponsePatterns,
    validateConsistency,
    validateAttentionChecks
};
