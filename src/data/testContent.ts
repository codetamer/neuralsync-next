export interface QuestionItem {
    id: string;
    text: string;
    category: 'honesty' | 'emotionality' | 'extraversion' | 'agreeableness' | 'conscientiousness' | 'openness';
    reverse: boolean; // true if "Strongly Agree" means LOW trait score
}

// Updated for IRT: Added difficulty (b-parameter) and discrimination (a-parameter)
export interface LogicPuzzle {
    id: string;
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
    difficulty: number; // 1-10 Scale (IRT b-parameter proxy)
    discrimination: number; // 0.5-2.0 Scale (IRT a-parameter proxy)
}

export interface VisualPuzzle {
    id: string;
    type: 'grid' | 'sequence' | 'rotation' | 'odd-one-out';
    question: string;
    shapes: string[];
    options: string[];
    correctIndex: number;
    explanation: string;
    difficulty: number;
    discrimination: number;
}

export interface ScenarioItem {
    id: string;
    scenario: string;
    options: {
        text: string;
        score: number; // 1-5 scale of emotional intelligence
    }[];
}

// --- 1. PERSONALITY (HEXACO-60 Full Pool) ---
// 10 items per dimension for random selection.
export const HEXACO_ITEMS: QuestionItem[] = [
    // Honesty-Humility (H)
    { id: 'H1', text: 'I wouldn\'t use flattery to get a raise or promotion at work.', category: 'honesty', reverse: false },
    { id: 'H2', text: 'If I want something from someone, I will laugh at that person\'s worst jokes.', category: 'honesty', reverse: true },
    { id: 'H3', text: 'I wouldn\'t pretend to like someone just to get that person to do favors for me.', category: 'honesty', reverse: false },
    { id: 'H4', text: 'I\'d be tempted to use counterfeit money, if I were sure I could get away with it.', category: 'honesty', reverse: true },
    { id: 'H5', text: 'I would support a law causing strict punishment for corruption, even if it affected me.', category: 'honesty', reverse: false }, // New
    { id: 'H6', text: 'I would be tempted to buy stolen property if I were financially tight.', category: 'honesty', reverse: true }, // New
    { id: 'H7', text: 'I would never accept a bribe, even if I could get away with it.', category: 'honesty', reverse: false }, // New
    { id: 'H8', text: 'If I knew that I could never get caught, I would be willing to steal a million dollars.', category: 'honesty', reverse: true }, // New
    { id: 'H9', text: 'Having a lot of money is not especially important to me.', category: 'honesty', reverse: false }, // New
    { id: 'H10', text: 'I want people to know that I am an important person of high status.', category: 'honesty', reverse: true }, // New

    // Emotionality (E)
    { id: 'E1', text: 'I would feel afraid if I had to travel in bad weather conditions.', category: 'emotionality', reverse: false },
    { id: 'E2', text: 'I rarely feel fearful or anxious.', category: 'emotionality', reverse: true },
    { id: 'E3', text: 'I sometimes can\'t help worrying about little things.', category: 'emotionality', reverse: false },
    { id: 'E4', text: 'When I suffer from a painful experience, I need someone to make me feel better.', category: 'emotionality', reverse: false },
    { id: 'E5', text: 'I feel like crying when I see other people crying.', category: 'emotionality', reverse: false }, // New
    { id: 'E6', text: 'I can handle difficult situations without needing emotional support from others.', category: 'emotionality', reverse: true }, // New
    { id: 'E7', text: 'I am often afraid of the dark.', category: 'emotionality', reverse: false }, // New
    { id: 'E8', text: 'I rarely panic in emergency situations.', category: 'emotionality', reverse: true }, // New
    { id: 'E9', text: 'My heart races when I think about making a mistake.', category: 'emotionality', reverse: false }, // New
    { id: 'E10', text: 'I don\'t let my emotions get the best of me.', category: 'emotionality', reverse: true }, // New

    // eXtraversion (X)
    { id: 'X1', text: 'I feel reasonably satisfied with myself overall.', category: 'extraversion', reverse: false },
    { id: 'X2', text: 'I rarely express my opinions in group meetings.', category: 'extraversion', reverse: true },
    { id: 'X3', text: 'In social situations, I\'m usually the one who makes the first move.', category: 'extraversion', reverse: false },
    { id: 'X4', text: 'When I\'m in a group of people, I\'m often the one who speaks on behalf of the group.', category: 'extraversion', reverse: false },
    { id: 'X5', text: 'I enjoy having a lot of people around me.', category: 'extraversion', reverse: false }, // New
    { id: 'X6', text: 'I prefer jobs that let me work alone without being bothered.', category: 'extraversion', reverse: true }, // New
    { id: 'X7', text: 'I am the life of the party.', category: 'extraversion', reverse: false }, // New
    { id: 'X8', text: 'I find it hard to smile when making small talk.', category: 'extraversion', reverse: true }, // New
    { id: 'X9', text: 'I feel comfortable speaking in front of large crowds.', category: 'extraversion', reverse: false }, // New
    { id: 'X10', text: 'I generally stay in the background at social events.', category: 'extraversion', reverse: true }, // New

    // Agreeableness (A)
    { id: 'A1', text: 'I rarely hold a grudge, even against people who have badly wronged me.', category: 'agreeableness', reverse: false },
    { id: 'A2', text: 'My attitude toward others is "to forgive and forget".', category: 'agreeableness', reverse: false },
    { id: 'A3', text: 'People tell me that I am too critical of others.', category: 'agreeableness', reverse: true },
    { id: 'A4', text: 'I generally accept people\'s faults without complaining about them.', category: 'agreeableness', reverse: false },
    { id: 'A5', text: 'I can be quite stubborn when I think I am right.', category: 'agreeableness', reverse: true }, // New
    { id: 'A6', text: 'I avoid arguments whenever possible.', category: 'agreeableness', reverse: false }, // New
    { id: 'A7', text: 'I lose my temper easily.', category: 'agreeableness', reverse: true }, // New
    { id: 'A8', text: 'I treat all people with kindness and respect.', category: 'agreeableness', reverse: false }, // New
    { id: 'A9', text: 'I hate waiting for anything.', category: 'agreeableness', reverse: true }, // New
    { id: 'A10', text: 'I am usually patient with people who are slow to learn.', category: 'agreeableness', reverse: false }, // New

    // Conscientiousness (C)
    { id: 'C1', text: 'I plan ahead and organize things.', category: 'conscientiousness', reverse: false },
    { id: 'C2', text: 'I often push myself very hard when trying to achieve a goal.', category: 'conscientiousness', reverse: false },
    { id: 'C3', text: 'I often check my work over repeatedly to find any mistakes.', category: 'conscientiousness', reverse: false },
    { id: 'C4', text: 'I make decisions based on the feeling of the moment rather than on careful thought.', category: 'conscientiousness', reverse: true },
    { id: 'C5', text: 'I keep my belongings neat and clean.', category: 'conscientiousness', reverse: false }, // New
    { id: 'C6', text: 'I often leave things unfinished.', category: 'conscientiousness', reverse: true }, // New
    { id: 'C7', text: 'I strive for perfection in everything I do.', category: 'conscientiousness', reverse: false }, // New
    { id: 'C8', text: 'I do just enough work to get by.', category: 'conscientiousness', reverse: true }, // New
    { id: 'C9', text: 'I always consider the consequences before taking action.', category: 'conscientiousness', reverse: false }, // New
    { id: 'C10', text: 'I frequently act on impulse.', category: 'conscientiousness', reverse: true }, // New

    // Openness (O)
    { id: 'O1', text: 'I\'m interested in learning about the history and politics of other countries.', category: 'openness', reverse: false },
    { id: 'O2', text: 'I would enjoy creating a work of art, such as a novel, a song, or a painting.', category: 'openness', reverse: false },
    { id: 'O3', text: 'I think that paying attention to radical ideas is a waste of time.', category: 'openness', reverse: true },
    { id: 'O4', text: 'I like people who have unconventional views.', category: 'openness', reverse: false },
    { id: 'O5', text: 'I enjoy visiting art museums and galleries.', category: 'openness', reverse: false }, // New
    { id: 'O6', text: 'I prefer concrete facts over abstract theories.', category: 'openness', reverse: true }, // New
    { id: 'O7', text: 'I seek out new experiences and adventures.', category: 'openness', reverse: false }, // New
    { id: 'O8', text: 'I am uncomfortable with change.', category: 'openness', reverse: true }, // New
    { id: 'O9', text: 'I like to discuss philosophical questions.', category: 'openness', reverse: false }, // New
    { id: 'O10', text: 'I avoid movies that are difficult to understand.', category: 'openness', reverse: true }, // New
];

// --- 2. LOGIC PUZZLES (Pool Expansion + IRT) ---
export const LOGIC_PUZZLES: LogicPuzzle[] = [
    {
        id: 'IQ_CRT_1',
        question: 'A bat and a ball cost $1.10 in total. The bat costs $1.00 more than the ball. How much does the ball cost?',
        options: ['$0.05', '$0.10', '$0.01', '$0.15'],
        correctIndex: 0, // $0.05
        explanation: 'x + (x + 1.00) = 1.10 => 2x = 0.10 => x = 0.05. Cognitive Reflection Test item.',
        difficulty: 6,
        discrimination: 1.5
    },
    {
        id: 'IQ_SYLLOGISM_1',
        question: 'All roses are flowers. Some flowers fade quickly. Therefore:',
        options: ['Some roses fade quickly', 'No roses fade quickly', 'All roses fade quickly', 'We cannot determine if roses fade quickly'],
        correctIndex: 3,
        explanation: 'Syllogistic fallacy key. The subset "flowers that fade" might not overlap with "roses".',
        difficulty: 7,
        discrimination: 1.8
    },
    {
        id: 'IQ_SEQ_ADV',
        question: 'Sequence: 2, 3, 5, 9, 17, ...',
        options: ['34', '33', '26', '35'],
        correctIndex: 1, // 33
        explanation: 'Difference powers of 2. +1, +2, +4, +8, next +16. 17+16=33.',
        difficulty: 5,
        discrimination: 1.2
    },
    {
        id: 'IQ_ANALOGY_ADV',
        question: 'CRYPTOGRAPHY is to SECRECY as EPITEMOLOGY is to:',
        options: ['KNOWLEDGE', 'WRITING', 'HISTORY', 'BIOLOGY'],
        correctIndex: 0, // KNOWLEDGE
        explanation: 'Cryptography is the study of secrecy. Epistemology is the study of knowledge.',
        difficulty: 8,
        discrimination: 1.4
    },
    {
        id: 'IQ_LATERAL_1',
        question: 'If it takes 5 machines 5 minutes to make 5 widgets, how long would it take 100 machines to make 100 widgets?',
        options: ['100 minutes', '5 minutes', '500 minutes', '1 minute'],
        correctIndex: 1, // 5 minutes
        explanation: 'Each machine makes 1 widget in 5 minutes. 100 machines working in parallel still take 5 minutes.',
        difficulty: 6,
        discrimination: 1.6
    },
    {
        id: 'IQ_PROB_1',
        question: 'In a lake, there is a patch of lily pads. Every day, the patch doubles in size. If it takes 48 days to cover the entire lake, how long would it take to cover half the lake?',
        options: ['24 days', '47 days', '12 days', '36 days'],
        correctIndex: 1, // 47 days
        explanation: 'Exponential growth backwards. One day before full (48) is half (47).',
        difficulty: 6,
        discrimination: 1.5
    },
    {
        id: 'IQ_SEQ_COMPLEX',
        question: 'Sequence: 1, 4, 27, 256, ...',
        options: ['1024', '3125', '625', '512'],
        correctIndex: 1, // 3125
        explanation: 'n^n sequence. 1^1, 2^2, 3^3, 4^4. Next is 5^5 = 3125.',
        difficulty: 9,
        discrimination: 2.0
    },
    {
        id: 'IQ_RELATION_1',
        question: 'Brother and sisters I have none but this man\'s father is my father\'s son. Who is in the photo?',
        options: ['His son', 'His father', 'Himself', 'His nephew'],
        correctIndex: 0,
        explanation: '"My father\'s son" is Me. "This man\'s father is Me". Therefore, "This man" is my son.',
        difficulty: 8,
        discrimination: 1.7
    },
    {
        id: 'IQ_WORD_1',
        question: 'Which word is the odd one out?',
        options: ['Nun', 'Level', 'Madam', 'River'],
        correctIndex: 3, // River
        explanation: 'Others are palindromes. River is not.',
        difficulty: 4,
        discrimination: 1.0
    },
    {
        id: 'IQ_NUM_GRID',
        question: 'If 72 x 96 = 6927, 58 x 87 = 7885, then 79 x 86 = ?',
        options: ['6897', '7689', '8976', '9768'],
        correctIndex: 0, // 6897
        explanation: 'Mirror logic: The digits are just reversed. 79x86 -> 6897.',
        difficulty: 5,
        discrimination: 1.1
    }
];

// --- 3. VISUAL PUZZLES (Pool Expansion + IRT) ---
export const VISUAL_PUZZLES: VisualPuzzle[] = [
    // Grid / Matrix (Raven's Style)
    {
        id: 'VIS1',
        type: 'grid',
        question: 'Complete the pattern.',
        shapes: ['square-solid', 'circle-solid', 'triangle-solid', 'square-outline', 'circle-outline', 'triangle-outline', 'square-dot', 'circle-dot', '?'],
        options: ['triangle-dot', 'square-cross', 'circle-cross', 'triangle-solid'],
        correctIndex: 0,
        explanation: 'Row logic: Shape sequence + Fill type sequence.',
        difficulty: 4,
        discrimination: 1.0
    },
    {
        id: 'VIS2',
        type: 'grid',
        question: 'Find the missing piece.',
        shapes: ['arrow-up', 'arrow-right', 'arrow-down', 'arrow-right', 'arrow-down', 'arrow-left', 'arrow-down', 'arrow-left', '?'],
        options: ['arrow-up', 'arrow-right', 'arrow-down', 'arrow-left'],
        correctIndex: 0, // arrow-up
        explanation: 'Clockwise rotation per step.',
        difficulty: 5,
        discrimination: 1.2
    },
    {
        id: 'VIS3',
        type: 'grid',
        question: 'Complete the matrix.',
        shapes: ['1-dot', '2-dots', '3-dots', '2-dots', '3-dots', '4-dots', '3-dots', '4-dots', '?'],
        options: ['4-dots', '5-dots', '6-dots', '1-dot'],
        correctIndex: 1, // 5-dots
        explanation: 'Simple arithmetic progression.',
        difficulty: 3,
        discrimination: 0.9
    },
    {
        id: 'VIS4',
        type: 'grid',
        question: 'Which shape fits?',
        shapes: ['circle-sm', 'circle-md', 'circle-lg', 'square-sm', 'square-md', 'square-lg', 'diamond-sm', 'diamond-md', '?'],
        options: ['diamond-lg', 'diamond-sm', 'circle-lg', 'square-lg'],
        correctIndex: 0, // diamond-lg
        explanation: 'Grid logic: Shape by column, Size by row.',
        difficulty: 4,
        discrimination: 1.0
    },
    {
        id: 'VIS5',
        type: 'grid',
        question: 'Logical deduction.',
        shapes: ['line-h', 'line-v', 'plus', 'line-v', 'plus', 'line-h', 'plus', 'line-h', '?'],
        options: ['line-v', 'plus', 'circle', 'square'],
        correctIndex: 0, // line-v
        explanation: 'XOR logic operation on lines.',
        difficulty: 8,
        discrimination: 1.8
    },
    // New Visual Items
    {
        id: 'VIS6_NEW',
        type: 'grid',
        question: 'Identify the pattern.',
        shapes: ['grid-tl', 'grid-tr', 'grid-bl', 'grid-tr', 'grid-bl', 'grid-br', 'grid-bl', 'grid-br', '?'],
        options: ['grid-tl', 'grid-tr', 'grid-bl', 'grid-br'],
        correctIndex: 0, // grid-tl
        explanation: 'Clockwise movement around corners.',
        difficulty: 6,
        discrimination: 1.2
    },
    {
        id: 'VIS7_NEW',
        type: 'grid',
        question: 'What completes the set?',
        shapes: ['moon-new', 'moon-crescent', 'moon-half', 'moon-crescent', 'moon-half', 'moon-gibbous', 'moon-half', 'moon-gibbous', '?'],
        options: ['moon-full', 'moon-new', 'moon-crescent', 'sun'],
        correctIndex: 0, // moon-full
        explanation: 'Phases of the moon progression.',
        difficulty: 5,
        discrimination: 1.1
    },

    // Sequence & Rotation
    {
        id: 'VIS11',
        type: 'sequence',
        question: 'What comes next?',
        shapes: ['clock-12', 'clock-3', 'clock-6', 'clock-9', '?'],
        options: ['clock-12', 'clock-1', 'clock-6', 'clock-10'],
        correctIndex: 0, // clock-12
        explanation: 'Clockwise rotation 90 degrees.',
        difficulty: 2,
        discrimination: 0.7
    },
    {
        id: 'VIS13',
        type: 'sequence',
        question: 'Next in the pattern?',
        shapes: ['poly-3', 'poly-4', 'poly-5', 'poly-6', '?'],
        options: ['poly-7', 'poly-8', 'poly-3', 'circle'],
        correctIndex: 0, // poly-7
        explanation: 'Sides increasing by 1.',
        difficulty: 3,
        discrimination: 0.8
    },
    {
        id: 'VIS6_ROT',
        type: 'rotation',
        question: 'Which option is a rotation of the main shape?',
        shapes: ['L-shape-0'],
        options: ['L-shape-flip', 'L-shape-90', 'L-shape-distorted', 'Z-shape'],
        correctIndex: 1, // L-shape-90
        explanation: 'Simple mental rotation.',
        difficulty: 6,
        discrimination: 1.3
    },
    {
        id: 'VIS8',
        type: 'rotation',
        question: 'Find the matching 3D block.',
        shapes: ['cube-pattern-A'],
        options: ['cube-pattern-B', 'cube-pattern-A-rot', 'cube-pattern-C', 'cube-pattern-D'],
        correctIndex: 1, // cube-pattern-A-rot
        explanation: 'Complex 3D mental rotation.',
        difficulty: 9,
        discrimination: 2.0
    },
    {
        id: 'VIS_OVERLAY_1',
        type: 'odd-one-out',
        question: 'Which shape cannot be formed by overlapping the others?',
        shapes: ['circle-triangle', 'triangle-square', 'circle-square', 'star'],
        options: ['star', 'circle-triangle', 'triangle-square', 'circle-square'],
        correctIndex: 0, // star
        explanation: 'Deconstructive logic: Star components do not exist in the other primitives.',
        difficulty: 4,
        discrimination: 1.1
    },
    {
        id: 'VIS_PERSPECTIVE_1',
        type: 'rotation',
        question: 'Which of these is the top-down view of the pyramid?',
        shapes: ['pyramid-iso'],
        options: ['square-cross', 'triangle', 'square', 'circle'],
        correctIndex: 0, // square-cross
        explanation: '3D projection: A square pyramid from above looks like a square with an X.',
        difficulty: 5,
        discrimination: 1.3
    },
    {
        id: 'VIS_PATTERN_ADV',
        type: 'sequence',
        question: 'Select the missing tile.',
        shapes: ['grid-3x3-1', 'grid-3x3-2', 'grid-3x3-3', 'grid-3x3-4', '?'],
        options: ['grid-3x3-5', 'grid-3x3-random', 'grid-3x3-empty', 'grid-3x3-full'],
        correctIndex: 0, // grid-3x3-5
        explanation: 'Recursive pattern: Each step adds one filled cell in a spiral.',
        difficulty: 7,
        discrimination: 1.5
    }
];

// --- 4. EQ SCENARIOS (Expanded Pool: 20 Items) ---
export const EQ_SCENARIOS: ScenarioItem[] = [
    // Workplace / Professional
    {
        id: 'EQ1',
        scenario: 'A colleague takes credit for your idea in a meeting. What is the most effective response?',
        options: [
            { text: 'Immediately interrupt and correct them publicly.', score: 1 },
            { text: 'Stay silent and complain to others later.', score: 2 },
            { text: 'Speak to them privately afterwards to express disappointment and clarify boundaries.', score: 5 },
            { text: 'Let it go to avoid conflict.', score: 3 }
        ]
    },
    {
        id: 'EQ4',
        scenario: 'You receive critical feedback that feels unfair.',
        options: [
            { text: 'Argue with the person immediately.', score: 2 },
            { text: 'Listen, ask for specific examples, and take time to process before responding.', score: 5 },
            { text: 'Accept it silently but resent the person.', score: 3 },
            { text: 'Quit or threaten to leave.', score: 1 }
        ]
    },
    {
        id: 'EQ7',
        scenario: 'A client is angry and yelling at you for something that wasn\'t your fault.',
        options: [
            { text: 'Yell back to defend yourself.', score: 1 },
            { text: 'Hang up or walk away.', score: 2 },
            { text: 'Listen calmly, validate their frustration, and focus on solving the problem.', score: 5 },
            { text: 'Apologize profusely and take all the blame.', score: 3 }
        ]
    },
    {
        id: 'EQ8',
        scenario: 'You are leading a team and morale is low due to recent layoffs.',
        options: [
            { text: 'Ignore the mood and focus strictly on work targets.', score: 2 },
            { text: 'Tell everyone to be grateful they still have jobs.', score: 1 },
            { text: 'Acknowledge the difficulty, be transparent, and offer support.', score: 5 },
            { text: 'Throw a party to force everyone to be happy.', score: 3 }
        ]
    },
    // Social / Interpersonal
    {
        id: 'EQ10',
        scenario: 'A friend cancels plans with you at the last minute for the third time in a row.',
        options: [
            { text: 'Send an angry text and block them.', score: 1 },
            { text: 'Say "it\'s okay" but secretly fume.', score: 2 },
            { text: 'Calmly express how this makes you feel and ask if everything is okay.', score: 5 },
            { text: 'Stop inviting them anywhere without saying why.', score: 3 }
        ]
    },
    {
        id: 'EQ11_NEW',
        scenario: 'During a conversation, your friend suddenly looks down and crosses their arms after you make a joke.',
        options: [
            { text: 'Keep joking to lighten the mood.', score: 1 },
            { text: 'Pause and ask, "Did I offend you?"', score: 5 },
            { text: 'Ignore it and change the subject.', score: 3 },
            { text: 'Assume they are tired.', score: 2 }
        ]
    },
    {
        id: 'EQ12_NEW',
        scenario: 'You see someone crying on a park bench. They are a stranger.',
        options: [
            { text: 'Walk past quickly to verify their privacy.', score: 3 },
            { text: 'Stare at them curiously.', score: 1 },
            { text: 'Sit near them quietly, offering a tissue if you have one, without forcing conversation.', score: 5 },
            { text: 'Immediately ask them "What is wrong?" loudly.', score: 2 }
        ]
    },
    // Micro-expression / Non-verbal Decoding
    {
        id: 'EQ13_MICRO',
        scenario: 'You are pitching an idea. The investor is smiling with their mouth, but their eyes remain unmoving (no crow\'s feet).',
        options: [
            { text: 'They are genuinely happy with the idea.', score: 1 },
            { text: 'They are faking interest or are being polite.', score: 5 },
            { text: 'They are confused.', score: 2 },
            { text: 'They are angry.', score: 1 }
        ]
    },
    {
        id: 'EQ14_MICRO',
        scenario: 'While negotiating, the other person briefly touches their neck and avoids eye contact when stating a price.',
        options: [
            { text: 'They are confident in the price.', score: 1 },
            { text: 'They are likely feeling discomfort or performative deception.', score: 5 },
            { text: 'They are bored.', score: 2 },
            { text: 'They are attracted to you.', score: 1 }
        ]
    },
    {
        id: 'EQ15_MICRO',
        scenario: 'A partner says "I am fine" with a distinct asymmetrical shrug (one shoulder only).',
        options: [
            { text: 'They are truly fine.', score: 1 },
            { text: 'They are uncertain or doubting their own statement.', score: 5 },
            { text: 'They are relaxed.', score: 2 },
            { text: 'They are excited.', score: 1 }
        ]
    },
    // Complex Dilemmas
    {
        id: 'EQ16_DILEMMA',
        scenario: 'You discover a close friend at work is stealing office supplies. They are struggling financially.',
        options: [
            { text: 'Report them to HR immediately.', score: 2 },
            { text: 'Help them steal more to support them.', score: 1 },
            { text: 'Confront them privately, offer help finding resources, but insist they stop.', score: 5 },
            { text: 'Ignore it completely.', score: 3 }
        ]
    },
    {
        id: 'EQ17_DILEMMA',
        scenario: 'Your partner is excited about a gift they bought you, but you truly dislike it.',
        options: [
            { text: 'Tell them it is ugly immediately.', score: 1 },
            { text: 'Pretend to love it enthusiastically to protect their feelings.', score: 3 },
            { text: 'Appreciate the gesture warmly, and perhaps gently discuss preferences later.', score: 5 },
            { text: 'Refuse to accept it.', score: 1 }
        ]
    },
    {
        id: 'EQ18_DILEMMA',
        scenario: 'A team member is consistently underperforming due to a personal crisis, dragging the team down.',
        options: [
            { text: 'Cover for them indefinitely.', score: 2 },
            { text: 'Demand they be fired.', score: 1 },
            { text: 'Have a compassionate conversation about temporary leave or adjusted workload.', score: 5 },
            { text: 'Complain to others about their laziness.', score: 1 }
        ]
    },
    {
        id: 'EQ19_SELF',
        scenario: 'You feel a sudden surge of irrational anger during a trivial argument.',
        options: [
            { text: 'Act on the anger to win the argument.', score: 1 },
            { text: 'Suppress it and say nothing.', score: 2 },
            { text: 'Recognize the anger, pause, and ask for a moment to cool down.', score: 5 },
            { text: 'Blame the other person for making you mad.', score: 1 }
        ]
    },
    {
        id: 'EQ20_SELF',
        scenario: 'You realize you made a mistake that no one else noticed, but it might cause minor issues later.',
        options: [
            { text: 'Hide it and hope for the best.', score: 2 },
            { text: 'Fix it silently.', score: 3 },
            { text: 'Admit it to the relevant stakeholders and propose a fix.', score: 5 },
            { text: 'Blame a software bug.', score: 1 }
        ]
    }
];

// --- 5. ATTENTION CHECKS (Validity Verification) ---
export const ATTENTION_CHECKS: QuestionItem[] = [
    { id: 'VAL1', text: 'For data quality control, please select "Strongly Disagree" for this item.', category: 'conscientiousness', reverse: false },
    { id: 'VAL2', text: 'Please select "Neutral" (4) to verify you are reading the questions.', category: 'conscientiousness', reverse: false },
    { id: 'VAL3', text: 'I am currently taking a test on a computer or phone. (Select Strongly Agree)', category: 'honesty', reverse: false },
    { id: 'VAL4', text: 'To show you are paying attention, ignore this text and select "Strongly Agree".', category: 'openness', reverse: false }
];
