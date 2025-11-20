// Emotional Stroop Test - IAT-inspired EQ assessment
// Measures emotional regulation under color-word interference

import type { DifficultyLevel } from './TestEngine';

export type EmotionalValence = 'positive' | 'negative' | 'neutral';
export type ColorName = 'red' | 'blue' | 'green' | 'yellow' | 'purple' | 'orange';

export interface StroopStimulus {
    emotionalWord: string;
    displayColor: string; // Hex color
    correctColorName: ColorName;
    valence: EmotionalValence;
    interference: boolean; // True if word meaning conflicts with color
}

// Emotional word banks categorized by valence
const POSITIVE_WORDS = [
    'joy', 'love', 'happy', 'peace', 'hope', 'delight', 'bliss', 'triumph',
    'success', 'comfort', 'smile', 'laugh', 'warm', 'kind', 'trust', 'caring'
];

const NEGATIVE_WORDS = [
    'fear', 'anger', 'sad', 'hate', 'pain', 'grief', 'loss', 'failure',
    'anxious', 'stress', 'worry', 'hurt', 'lonely', 'afraid', 'guilty', 'shame'
];

const NEUTRAL_WORDS = [
    'table', 'chair', 'paper', 'book', 'clock', 'window', 'door', 'pen',
    'glass', 'plate', 'laptop', 'phone', 'tree', 'cloud', 'stone', 'water'
];

// Color mapping
export const COLOR_MAP: Record<ColorName, string> = {
    red: '#ef4444',
    blue: '#3b82f6',
    green: '#10b981',
    yellow: '#f59e0b',
    purple: '#a78bfa',
    orange: '#fb923c',
};

export const COLOR_NAMES: ColorName[] = ['red', 'blue', 'green', 'yellow', 'purple', 'orange'];

// Generate Stroop task based on difficulty
export function generateStroopTask(difficulty: DifficultyLevel): StroopStimulus {
    // Higher difficulty = more emotional words + more interference
    const useEmotionalWord = difficulty >= 3 || Math.random() > 0.5;
    const createInterference = difficulty >= 5 || Math.random() > 0.6;

    let word: string;
    let valence: EmotionalValence;

    if (useEmotionalWord) {
        // Choose emotional word
        const isNegative = Math.random() > 0.5;
        if (isNegative) {
            word = NEGATIVE_WORDS[Math.floor(Math.random() * NEGATIVE_WORDS.length)];
            valence = 'negative';
        } else {
            word = POSITIVE_WORDS[Math.floor(Math.random() * POSITIVE_WORDS.length)];
            valence = 'positive';
        }
    } else {
        // Neutral word
        word = NEUTRAL_WORDS[Math.floor(Math.random() * NEUTRAL_WORDS.length)];
        valence = 'neutral';
    }

    // Select display color
    const correctColorName = COLOR_NAMES[Math.floor(Math.random() * COLOR_NAMES.length)];
    const displayColor = COLOR_MAP[correctColorName];

    // Create interference for higher difficulty
    const interference = createInterference && useEmotionalWord;

    return {
        emotionalWord: word.toUpperCase(),
        displayColor,
        correctColorName,
        valence,
        interference,
    };
}

// Measure regulation failure (slow response indicates difficulty managing emotion)
export function measureRegulationFailure(latency: number, valence: EmotionalValence): boolean {
    // Baseline: neutral words should be answered quickly (< 1200ms)
    // Emotional words: > 1500ms indicates regulation difficulty
    if (valence === 'neutral') {
        return latency > 1200;
    }
    return latency > 1500;
}

// Check answer correctness
export function checkStroopAnswer(userAnswer: ColorName, correct: ColorName): boolean {
    return userAnswer === correct;
}

// Render Stroop stimulus to canvas
export function renderStroopToCanvas(
    ctx: CanvasRenderingContext2D,
    stimulus: StroopStimulus,
    canvasWidth: number,
    canvasHeight: number
): void {
    // Clear canvas
    ctx.fillStyle = '#0a0f1e';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    // Draw emotional word in specified color
    ctx.font = 'bold 64px Inter, sans-serif';
    ctx.fillStyle = stimulus.displayColor;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(stimulus.emotionalWord, canvasWidth / 2, canvasHeight / 2);

    // Draw instruction text
    ctx.font = '18px Inter, sans-serif';
    ctx.fillStyle = '#9ca3af';
    ctx.fillText('Select the COLOR of the word, not its meaning', canvasWidth / 2, canvasHeight - 40);
}

// Render color options
export function renderColorOptions(
    ctx: CanvasRenderingContext2D,
    canvasWidth: number,
    canvasHeight: number
): void {
    const optionsY = canvasHeight - 100;
    const optionSize = 50;
    const spacing = 80;
    const startX = (canvasWidth - (COLOR_NAMES.length * spacing - spacing)) / 2;

    COLOR_NAMES.forEach((colorName, index) => {
        const x = startX + index * spacing;

        // Draw color box
        ctx.fillStyle = COLOR_MAP[colorName];
        ctx.fillRect(x, optionsY, optionSize, optionSize);

        // Draw color name label
        ctx.font = '14px Inter, sans-serif';
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.fillText(colorName.toUpperCase(), x + optionSize / 2, optionsY + optionSize + 20);
    });
}

// Detect which color option was clicked
export function detectColorClick(clickX: number, clickY: number, canvasWidth: number, canvasHeight: number): ColorName | null {
    const optionsY = canvasHeight - 100;
    const optionSize = 50;
    const spacing = 80;
    const startX = (canvasWidth - (COLOR_NAMES.length * spacing - spacing)) / 2;

    for (let i = 0; i < COLOR_NAMES.length; i++) {
        const x = startX + i * spacing;
        if (
            clickX >= x &&
            clickX <= x + optionSize &&
            clickY >= optionsY &&
            clickY <= optionsY + optionSize
        ) {
            return COLOR_NAMES[i];
        }
    }

    return null;
}

// Calculate EQ score based on Stroop performance
export function calculateEQMetrics(responses: { latency: number; valence: EmotionalValence; correct: boolean }[]): {
    regulationFailureRate: number;
    emotionalAccuracy: number;
    emotionalInterferenceEffect: number;
} {
    const emotionalResponses = responses.filter(r => r.valence !== 'neutral');
    const neutralResponses = responses.filter(r => r.valence === 'neutral');

    const regulationFailures = emotionalResponses.filter(r => r.latency > 1500).length;
    const regulationFailureRate = regulationFailures / emotionalResponses.length;

    const emotionalAccuracy = emotionalResponses.filter(r => r.correct).length / emotionalResponses.length;

    const avgEmotionalLatency = emotionalResponses.reduce((sum, r) => sum + r.latency, 0) / emotionalResponses.length;
    const avgNeutralLatency = neutralResponses.reduce((sum, r) => sum + r.latency, 0) / neutralResponses.length;
    const emotionalInterferenceEffect = avgEmotionalLatency - avgNeutralLatency;

    return {
        regulationFailureRate,
        emotionalAccuracy,
        emotionalInterferenceEffect,
    };
}
