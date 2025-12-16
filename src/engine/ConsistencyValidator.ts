/**
 * ConsistencyValidator.ts
 * 
 * CORE PRINCIPLE: Every insight must tell the same story.
 * This module validates that all generated insights, archetypes, weaknesses,
 * and career recommendations are internally consistent with measured scores.
 */

import type { AnalysisInput, DeepInsight } from './AnalysisEngine';

export interface ConsistencyCheck {
    field: string;
    expected: string;
    actual: string;
    passed: boolean;
    severity: 'warning' | 'error';
    fix?: string;
}

export interface ConsistencyReport {
    isConsistent: boolean;
    checks: ConsistencyCheck[];
    corrections: Partial<DeepInsight>;
}

// Thresholds for trait levels
const TRAIT_THRESHOLDS = {
    veryLow: 25,
    low: 40,
    average: 60,
    high: 75,
    veryHigh: 90
} as const;

type TraitLevel = 'Very Low' | 'Low' | 'Average' | 'High' | 'Very High';

function getTraitLevel(score: number): TraitLevel {
    if (score < TRAIT_THRESHOLDS.veryLow) return 'Very Low';
    if (score < TRAIT_THRESHOLDS.low) return 'Low';
    if (score < TRAIT_THRESHOLDS.average) return 'Average';
    if (score < TRAIT_THRESHOLDS.high) return 'High';
    return 'Very High';
}

function isLowScore(score: number): boolean {
    return score < TRAIT_THRESHOLDS.low;
}

function isHighScore(score: number): boolean {
    return score >= TRAIT_THRESHOLDS.high;
}

/**
 * Keywords that indicate certain traits - used to detect contradictions
 */
const TRAIT_KEYWORDS = {
    conscientiousness: {
        high: ['organized', 'diligent', 'disciplined', 'methodical', 'detail-oriented', 'meticulous', 'systematic', 'punctual', 'reliable'],
        low: ['chaotic', 'disorganized', 'impulsive', 'careless', 'scattered', 'unreliable', 'spontaneous']
    },
    extraversion: {
        high: ['outgoing', 'social', 'energetic', 'talkative', 'assertive', 'gregarious', 'bold'],
        low: ['introverted', 'reserved', 'quiet', 'solitary', 'withdrawn', 'private', 'invisible']
    },
    agreeableness: {
        high: ['cooperative', 'trusting', 'helpful', 'kind', 'forgiving', 'patient', 'empathetic'],
        low: ['competitive', 'skeptical', 'stubborn', 'critical', 'abrasive', 'confrontational']
    },
    openness: {
        high: ['creative', 'curious', 'imaginative', 'unconventional', 'artistic', 'intellectual'],
        low: ['conventional', 'traditional', 'practical', 'conservative', 'closed-minded']
    },
    emotionality: {
        high: ['sensitive', 'anxious', 'emotional', 'fearful', 'vulnerable', 'dependent'],
        low: ['calm', 'stoic', 'resilient', 'unshakeable', 'composed', 'detached']
    },
    honesty: {
        high: ['sincere', 'honest', 'ethical', 'principled', 'fair', 'modest', 'authentic'],
        low: ['manipulative', 'deceptive', 'shrewd', 'machiavellian', 'status-seeking']
    },
    iq: {
        high: ['intelligent', 'analytical', 'logical', 'strategic', 'quick-thinking', 'sharp', 'brilliant'],
        low: ['simple', 'concrete', 'practical']
    },
    eq: {
        high: ['empathetic', 'emotionally intelligent', 'perceptive', 'diplomatic', 'attuned'],
        low: ['cold', 'disconnected', 'oblivious', 'insensitive']
    },
    riskTolerance: {
        high: ['bold', 'risk-taking', 'daring', 'adventurous', 'fearless', 'gambler'],
        low: ['cautious', 'risk-averse', 'conservative', 'safe', 'careful', 'hesitant']
    }
};

/**
 * Check if a text contains keywords that contradict a measured score
 */
function findContradictoryKeywords(
    text: string,
    trait: keyof typeof TRAIT_KEYWORDS,
    score: number
): string[] {
    const lowerText = text.toLowerCase();
    const traitDef = TRAIT_KEYWORDS[trait];
    const contradictions: string[] = [];

    if (isLowScore(score)) {
        // Score is LOW, check for HIGH keywords (contradiction)
        traitDef.high.forEach(keyword => {
            if (lowerText.includes(keyword.toLowerCase())) {
                contradictions.push(keyword);
            }
        });
    } else if (isHighScore(score)) {
        // Score is HIGH, check for LOW keywords (contradiction)
        traitDef.low.forEach(keyword => {
            if (lowerText.includes(keyword.toLowerCase())) {
                contradictions.push(keyword);
            }
        });
    }

    return contradictions;
}

/**
 * Validate that archetype aligns with core trait scores
 */
function validateArchetypeConsistency(
    archetype: string,
    archetypeDesc: string,
    input: AnalysisInput
): ConsistencyCheck[] {
    const checks: ConsistencyCheck[] = [];
    const fullText = `${archetype} ${archetypeDesc}`.toLowerCase();

    // Check each trait dimension for contradictions
    const traitMappings: Array<{ trait: keyof typeof TRAIT_KEYWORDS; score: number; name: string }> = [
        { trait: 'conscientiousness', score: input.hexaco.conscientiousness, name: 'Conscientiousness' },
        { trait: 'extraversion', score: input.hexaco.extraversion, name: 'Extraversion' },
        { trait: 'agreeableness', score: input.hexaco.agreeableness, name: 'Agreeableness' },
        { trait: 'openness', score: input.hexaco.openness, name: 'Openness' },
        { trait: 'emotionality', score: input.hexaco.emotionality, name: 'Emotionality' },
        { trait: 'honesty', score: input.hexaco.honesty, name: 'Honesty' },
        { trait: 'iq', score: input.iq, name: 'IQ' },
        { trait: 'eq', score: input.eq, name: 'EQ' },
        { trait: 'riskTolerance', score: input.riskTolerance, name: 'Risk Tolerance' }
    ];

    traitMappings.forEach(({ trait, score, name }) => {
        const contradictions = findContradictoryKeywords(fullText, trait, score);
        if (contradictions.length > 0) {
            checks.push({
                field: 'archetype',
                expected: `${name}: ${getTraitLevel(score)} (${score})`,
                actual: `Description uses contradictory terms: ${contradictions.join(', ')}`,
                passed: false,
                severity: 'warning',
                fix: `Remove or replace terms: ${contradictions.join(', ')}`
            });
        }
    });

    return checks;
}

/**
 * Validate that weaknesses match actual LOW scores
 */
function validateWeaknessConsistency(
    weaknesses: Array<{ title: string; description: string; impact: string }>,
    input: AnalysisInput
): ConsistencyCheck[] {
    const checks: ConsistencyCheck[] = [];

    // Map weakness keywords to required low traits
    const weaknessRequirements: Record<string, { trait: string; mustBeLow?: boolean; mustBeHigh?: boolean; threshold?: number }> = {
        'execution entropy': { trait: 'conscientiousness', mustBeLow: true },
        'paralysis by analysis': { trait: 'conscientiousness', mustBeHigh: true },
        'social invisibility': { trait: 'extraversion', mustBeLow: true },
        'doormat syndrome': { trait: 'agreeableness', mustBeHigh: true },
        'abrasive interface': { trait: 'agreeableness', mustBeLow: true },
        'cognitive dissociation': { trait: 'eq', mustBeLow: true, threshold: 90 },
        'pathological accommodator': { trait: 'eq', mustBeHigh: true },
        'machiavellian': { trait: 'honesty', mustBeLow: true },
        'gambler\'s delusion': { trait: 'riskTolerance', mustBeHigh: true },
        'safety paralysis': { trait: 'riskTolerance', mustBeLow: true }
    };

    weaknesses.forEach(weakness => {
        const weaknessLower = weakness.title.toLowerCase();

        Object.entries(weaknessRequirements).forEach(([keyword, requirement]) => {
            if (weaknessLower.includes(keyword)) {
                let score: number;

                // Get the relevant score
                switch (requirement.trait) {
                    case 'conscientiousness':
                        score = input.hexaco.conscientiousness;
                        break;
                    case 'extraversion':
                        score = input.hexaco.extraversion;
                        break;
                    case 'agreeableness':
                        score = input.hexaco.agreeableness;
                        break;
                    case 'honesty':
                        score = input.hexaco.honesty;
                        break;
                    case 'eq':
                        score = input.eq;
                        break;
                    case 'riskTolerance':
                        score = input.riskTolerance;
                        break;
                    default:
                        return;
                }

                const threshold = requirement.threshold || (requirement.mustBeLow ? TRAIT_THRESHOLDS.low : TRAIT_THRESHOLDS.high);

                let isValid = true;
                if (requirement.mustBeLow && score >= threshold) {
                    isValid = false;
                } else if (requirement.mustBeHigh && score < threshold) {
                    isValid = false;
                }

                if (!isValid) {
                    checks.push({
                        field: 'weakness',
                        expected: `"${weakness.title}" requires ${requirement.trait} to be ${requirement.mustBeLow ? 'LOW' : 'HIGH'}`,
                        actual: `${requirement.trait} = ${score} (${getTraitLevel(score)})`,
                        passed: false,
                        severity: 'error',
                        fix: `Remove this weakness - it doesn\'t match user\'s actual scores`
                    });
                }
            }
        });
    });

    return checks;
}

/**
 * Validate that strengths match actual HIGH scores
 */
function validateStrengthConsistency(
    strengths: string[],
    input: AnalysisInput
): ConsistencyCheck[] {
    const checks: ConsistencyCheck[] = [];

    strengths.forEach(strength => {
        const strengthLower = strength.toLowerCase();

        // Check for IQ-related claims
        if (strengthLower.includes('elite cognitive') || strengthLower.includes('genius') || strengthLower.includes('brilliant')) {
            if (input.iq < 120) {
                checks.push({
                    field: 'strength',
                    expected: 'Elite cognitive claims require IQ >= 120',
                    actual: `IQ = ${input.iq}`,
                    passed: false,
                    severity: 'error',
                    fix: 'Use more modest cognitive descriptors'
                });
            }
        }

        // Check for EQ-related claims
        if (strengthLower.includes('radical empathy') || strengthLower.includes('exceptional eq')) {
            if (input.eq < 115) {
                checks.push({
                    field: 'strength',
                    expected: 'Exceptional EQ claims require EQ >= 115',
                    actual: `EQ = ${input.eq}`,
                    passed: false,
                    severity: 'error',
                    fix: 'Use more modest emotional intelligence descriptors'
                });
            }
        }
    });

    return checks;
}

/**
 * Validate career recommendations match profile
 */
function validateCareerConsistency(
    career: string,
    input: AnalysisInput
): ConsistencyCheck[] {
    const checks: ConsistencyCheck[] = [];
    const careerLower = career.toLowerCase();

    // High-IQ requiring careers
    const highIQCareers = ['scientist', 'researcher', 'architect', 'engineer', 'surgeon', 'analyst'];
    highIQCareers.forEach(c => {
        if (careerLower.includes(c) && input.iq < 110) {
            checks.push({
                field: 'career',
                expected: `"${c}" typically requires IQ >= 110`,
                actual: `IQ = ${input.iq}`,
                passed: false,
                severity: 'warning',
                fix: 'Consider alternative career recommendations'
            });
        }
    });

    // High-EQ requiring careers
    const highEQCareers = ['therapist', 'counselor', 'psychologist', 'negotiator', 'mediator'];
    highEQCareers.forEach(c => {
        if (careerLower.includes(c) && input.eq < 110) {
            checks.push({
                field: 'career',
                expected: `"${c}" typically requires EQ >= 110`,
                actual: `EQ = ${input.eq}`,
                passed: false,
                severity: 'warning',
                fix: 'Consider alternative career recommendations'
            });
        }
    });

    // High risk tolerance careers
    const highRiskCareers = ['venture', 'trader', 'entrepreneur', 'founder', 'startup'];
    highRiskCareers.forEach(c => {
        if (careerLower.includes(c) && input.riskTolerance < 60) {
            checks.push({
                field: 'career',
                expected: `"${c}" typically suits risk tolerance >= 60`,
                actual: `Risk Tolerance = ${input.riskTolerance}`,
                passed: false,
                severity: 'warning',
                fix: 'Consider more stable career paths'
            });
        }
    });

    return checks;
}

/**
 * Main validation function - validates entire DeepInsight output
 */
export function validateInsightConsistency(
    insight: DeepInsight,
    input: AnalysisInput
): ConsistencyReport {
    const allChecks: ConsistencyCheck[] = [];

    // 1. Validate archetype matches traits
    allChecks.push(...validateArchetypeConsistency(
        insight.archetype,
        insight.archetypeDesc,
        input
    ));

    // 2. Validate weaknesses match low scores
    allChecks.push(...validateWeaknessConsistency(
        insight.detailedWeaknesses,
        input
    ));

    // 3. Validate strengths match high scores
    allChecks.push(...validateStrengthConsistency(
        insight.strengths,
        input
    ));

    // 4. Validate career recommendations
    allChecks.push(...validateCareerConsistency(
        insight.career,
        input
    ));

    // Determine if we need corrections
    const failedChecks = allChecks.filter(c => !c.passed);
    const hasErrors = failedChecks.some(c => c.severity === 'error');

    // For now, we just report - Phase 2 will auto-correct
    const corrections: Partial<DeepInsight> = {};

    // Auto-filter weaknesses that failed validation
    if (failedChecks.some(c => c.field === 'weakness' && c.severity === 'error')) {
        const invalidWeaknessKeywords = failedChecks
            .filter(c => c.field === 'weakness')
            .map(c => c.expected.match(/"([^"]+)"/)?.[1]?.toLowerCase() || '');

        corrections.detailedWeaknesses = insight.detailedWeaknesses.filter(w =>
            !invalidWeaknessKeywords.some(keyword =>
                w.title.toLowerCase().includes(keyword)
            )
        );

        corrections.weaknesses = corrections.detailedWeaknesses.map(
            w => `${w.title}: ${w.description}`
        );
    }

    return {
        isConsistent: failedChecks.length === 0,
        checks: allChecks,
        corrections
    };
}

/**
 * Apply corrections to insight
 */
export function applyConsistencyCorrections(
    insight: DeepInsight,
    report: ConsistencyReport
): DeepInsight {
    if (report.isConsistent) return insight;

    return {
        ...insight,
        ...report.corrections
    };
}

/**
 * Helper to get a score summary for debugging
 */
export function getScoreSummary(input: AnalysisInput): string {
    return `IQ:${input.iq} EQ:${input.eq} Risk:${input.riskTolerance} ` +
        `H:${input.hexaco.honesty} E:${input.hexaco.emotionality} ` +
        `X:${input.hexaco.extraversion} A:${input.hexaco.agreeableness} ` +
        `C:${input.hexaco.conscientiousness} O:${input.hexaco.openness}`;
}

export const ConsistencyValidator = {
    validateInsightConsistency,
    applyConsistencyCorrections,
    getScoreSummary,
    getTraitLevel,
    isLowScore,
    isHighScore,
    TRAIT_THRESHOLDS
};
