// HEXACO Personality Assessment - Rapid-response questionnaire
// Measures 6 personality dimensions with response latency tracking

export type HEXACODimension = 'honesty' | 'emotionality' | 'extraversion' | 'agreeableness' | 'conscientiousness' | 'openness';

export interface PersonalityQuestion {
    id: number;
    text: string;
    dimension: HEXACODimension;
    reversed: boolean; // True for reverse-coded items
}

// Comprehensive HEXACO question bank (5 questions per dimension)
export const HEXACO_QUESTIONS: PersonalityQuestion[] = [
    // Honesty-Humility
    { id: 1, text: 'I would never accept a bribe, even if it were very large', dimension: 'honesty', reversed: false },
    { id: 2, text: 'I would be tempted to buy stolen property if I were financially tight', dimension: 'honesty', reversed: true },
    { id: 3, text: 'I wouldn\'t use flattery to get a raise, even if I thought it would succeed', dimension: 'honesty', reversed: false },
    { id: 4, text: 'If I want something from a person, I will laugh at their worst jokes', dimension: 'honesty', reversed: true },
    { id: 5, text: 'I would never cheat on my taxes, even if I could avoid getting caught', dimension: 'honesty', reversed: false },

    // Emotionality
    { id: 6, text: 'I worry a lot less than most people', dimension: 'emotionality', reversed: true },
    { id: 7, text: 'I rarely feel fearful or anxious', dimension: 'emotionality', reversed: true },
    { id: 8, text: 'I feel strong emotions when someone close to me is going away for a long time', dimension: 'emotionality', reversed: false },
    { id: 9, text: 'I feel like crying when I see someone in distress', dimension: 'emotionality', reversed: false },
    { id: 10, text: 'I remain unemotional even in situations where most people get very sentimental', dimension: 'emotionality', reversed: true },

    // eXtraversion
    { id: 11, text: 'I feel reasonably satisfied with myself overall', dimension: 'extraversion', reversed: false },
    { id: 12, text: 'I rarely express my opinions in group meetings', dimension: 'extraversion', reversed: true },
    { id: 13, text: 'I enjoy being the center of attention at parties', dimension: 'extraversion', reversed: false },
    { id: 14, text: 'In social situations, I\'m usually the one who makes the first move', dimension: 'extraversion', reversed: false },
    { id: 15, text: 'I avoid making phone calls to people I don\'t know very well', dimension: 'extraversion', reversed: true },

    // Agreeableness
    { id: 16, text: 'I rarely hold a grudge, even against people who have badly wronged me', dimension: 'agreeableness', reversed: false },
    { id: 17, text: 'If someone has cheated me once, I will always feel suspicious of that person', dimension: 'agreeableness', reversed: true },
    { id: 18, text: 'I am usually quite flexible in my opinions when people disagree with me', dimension: 'agreeableness', reversed: false },
    { id: 19, text: 'I tend to be lenient in judging other people', dimension: 'agreeableness', reversed: false },
    { id: 20, text: 'When people tell me that I\'m wrong, my first reaction is to argue with them', dimension: 'agreeableness', reversed: true },

    // Conscientiousness
    { id: 21, text: 'I plan ahead and organize things, to avoid scrambling at the last minute', dimension: 'conscientiousness', reversed: false },
    { id: 22, text: 'I often push myself very hard when trying to achieve a goal', dimension: 'conscientiousness', reversed: false },
    { id: 23, text: 'I don\'t see any point in working hard if no one else cares', dimension: 'conscientiousness', reversed: true },
    { id: 24, text: 'I make decisions based on feelings rather than logic', dimension: 'conscientiousness', reversed: true },
    { id: 25, text: 'I always double-check things to avoid making mistakes', dimension: 'conscientiousness', reversed: false },

    // Openness to Experience
    { id: 26, text: 'I would enjoy creating a work of art, such as a novel or painting', dimension: 'openness', reversed: false },
    { id: 27, text: 'I\'m interested in learning about the history and politics of other countries', dimension: 'openness', reversed: false },
    { id: 28, text: 'I rarely spend time thinking about philosophical questions', dimension: 'openness', reversed: true },
    { id: 29, text: 'I would like a job that requires me to be creative and imaginative', dimension: 'openness', reversed: false },
    { id: 30, text: 'I\'ve never really enjoyed looking at art galleries or museums', dimension: 'openness', reversed: true },
];

// Get questions for a specific stage (5 questions per stage from different dimensions)
export function getQuestionsForStage(stage: number): PersonalityQuestion[] {
    // Stages 16-20 each get 5 questions, rotating through dimensions
    const startIndex = (stage - 16) * 5;
    return HEXACO_QUESTIONS.slice(startIndex, startIndex + 5);
}

// Score response (7-point Likert scale: 1 = Strongly Disagree, 7 = Strongly Agree)
export function scoreResponse(question: PersonalityQuestion, response: number): number {
    if (question.reversed) {
        return 8 - response; // Reverse scoring
    }
    return response;
}

// Calculate HEXACO dimension scores from all responses
export function calculateHEXACOScores(responses: { question: PersonalityQuestion; response: number; latency: number }[]): Record<HEXACODimension, number> {
    const scores: Record<HEXACODimension, number[]> = {
        honesty: [],
        emotionality: [],
        extraversion: [],
        agreeableness: [],
        conscientiousness: [],
        openness: [],
    };

    // Score each response
    responses.forEach(({ question, response }) => {
        const score = scoreResponse(question, response);
        scores[question.dimension].push(score);
    });

    // Calculate average for each dimension (convert to 0-100 scale)
    const dimensionScores: Record<HEXACODimension, number> = {
        honesty: calculateDimensionScore(scores.honesty),
        emotionality: calculateDimensionScore(scores.emotionality),
        extraversion: calculateDimensionScore(scores.extraversion),
        agreeableness: calculateDimensionScore(scores.agreeableness),
        conscientiousness: calculateDimensionScore(scores.conscientiousness),
        openness: calculateDimensionScore(scores.openness),
    };

    return dimensionScores;
}

// Calculate individual dimension score (0-100)
function calculateDimensionScore(scores: number[]): number {
    if (scores.length === 0) return 50;
    const avg = scores.reduce((sum, s) => sum + s, 0) / scores.length;
    // Convert from 1-7 scale to 0-100 scale
    return Math.round(((avg - 1) / 6) * 100);
}

// Detect unconsidered responses (too fast = not reading carefully)
export function isUnconsideredResponse(latency: number): boolean {
    // Responses faster than 800ms likely indicate not reading the question
    return latency < 800;
}

// Generate validity check (consistency between similar questions)
export function checkResponseValidity(responses: { question: PersonalityQuestion; response: number }[]): number {
    // Compare reversed vs. non-reversed items in same dimension
    let inconsistencies = 0;
    let comparisons = 0;

    const dimensions: HEXACODimension[] = ['honesty', 'emotionality', 'extraversion', 'agreeableness', 'conscientiousness', 'openness'];

    dimensions.forEach(dimension => {
        const dimResponses = responses.filter(r => r.question.dimension === dimension);
        const regularScores = dimResponses.filter(r => !r.question.reversed).map(r => r.response);
        const reversedScores = dimResponses.filter(r => r.question.reversed).map(r => 8 - r.response);

        if (regularScores.length > 0 && reversedScores.length > 0) {
            const regularAvg = regularScores.reduce((sum, s) => sum + s, 0) / regularScores.length;
            const reversedAvg = reversedScores.reduce((sum, s) => sum + s, 0) / reversedScores.length;

            // They should be similar; large difference indicates inconsistency
            if (Math.abs(regularAvg - reversedAvg) > 2) {
                inconsistencies++;
            }
            comparisons++;
        }
    });

    // Return validity score (0-100, higher = more consistent)
    return comparisons > 0 ? Math.round((1 - (inconsistencies / comparisons)) * 100) : 100;
}
