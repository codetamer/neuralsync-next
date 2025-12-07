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

// --- 2. LOGIC PUZZLES (Pool Expansion + IRT - 30 Items) ---
export const LOGIC_PUZZLES: LogicPuzzle[] = [
    // ========================================================================
    // COGNITIVE REFLECTION (4 items)
    // ========================================================================
    {
        id: 'IQ_CRT_1',
        question: 'A bat and a ball cost $1.10 in total. The bat costs $1.00 more than the ball. How much does the ball cost?',
        options: ['$0.05', '$0.10', '$0.01', '$0.15'],
        correctIndex: 0,
        explanation: 'x + (x + 1.00) = 1.10 => 2x = 0.10 => x = 0.05. Cognitive Reflection Test item.',
        difficulty: 6,
        discrimination: 1.5
    },
    {
        id: 'IQ_CRT_2',
        question: 'If it takes 5 machines 5 minutes to make 5 widgets, how long would it take 100 machines to make 100 widgets?',
        options: ['100 minutes', '5 minutes', '500 minutes', '1 minute'],
        correctIndex: 1,
        explanation: 'Each machine makes 1 widget in 5 minutes. 100 machines working in parallel still take 5 minutes.',
        difficulty: 6,
        discrimination: 1.6
    },
    {
        id: 'IQ_CRT_3',
        question: 'In a lake, there is a patch of lily pads. Every day, the patch doubles in size. If it takes 48 days to cover the entire lake, how long would it take to cover half the lake?',
        options: ['24 days', '47 days', '12 days', '36 days'],
        correctIndex: 1,
        explanation: 'Exponential growth backwards. One day before full (48) is half (47).',
        difficulty: 6,
        discrimination: 1.5
    },
    {
        id: 'IQ_CRT_4',
        question: 'Emily\'s father has three daughters: April, May, and ___?',
        options: ['June', 'Emily', 'July', 'March'],
        correctIndex: 1,
        explanation: 'The question says "Emily\'s father" so the third daughter is Emily.',
        difficulty: 4,
        discrimination: 1.2
    },

    // ========================================================================
    // SYLLOGISMS (6 items)
    // ========================================================================
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
        id: 'IQ_SYLLOGISM_2',
        question: 'No A are B. All C are A. Therefore:',
        options: ['No C are B', 'Some C are B', 'All B are C', 'All A are C'],
        correctIndex: 0,
        explanation: 'Transitive exclusion. If C is inside A, and A is outside B, then C cannot touch B.',
        difficulty: 6,
        discrimination: 1.7
    },
    {
        id: 'IQ_SYLLOGISM_3',
        question: 'All mammals are warm-blooded. Whales are mammals. Therefore:',
        options: ['Whales are cold-blooded', 'Whales are warm-blooded', 'Some whales are warm-blooded', 'Whales might be warm-blooded'],
        correctIndex: 1,
        explanation: 'Valid syllogism: All A are B, C is A, therefore C is B.',
        difficulty: 3,
        discrimination: 0.9
    },
    {
        id: 'IQ_SYLLOGISM_4',
        question: 'Some doctors are athletes. All athletes are healthy. Therefore:',
        options: ['All doctors are healthy', 'Some doctors are healthy', 'No doctors are healthy', 'All healthy people are doctors'],
        correctIndex: 1,
        explanation: 'Some doctors (the athlete ones) must be healthy.',
        difficulty: 5,
        discrimination: 1.3
    },
    {
        id: 'IQ_SYLLOGISM_5',
        question: 'If it rains, the ground gets wet. The ground is wet. Therefore:',
        options: ['It rained', 'It might have rained', 'It did not rain', 'The ground is always wet'],
        correctIndex: 1,
        explanation: 'Affirming the consequent fallacy. Wet ground could have other causes.',
        difficulty: 7,
        discrimination: 1.6
    },
    {
        id: 'IQ_SYLLOGISM_6',
        question: 'No reptiles have fur. All snakes are reptiles. Therefore:',
        options: ['Some snakes have fur', 'All snakes have scales', 'No snakes have fur', 'Snakes might have fur'],
        correctIndex: 2,
        explanation: 'Valid syllogism: No A have B, C are A, therefore no C have B.',
        difficulty: 4,
        discrimination: 1.1
    },

    // ========================================================================
    // NUMERICAL SEQUENCES (8 items)
    // ========================================================================
    {
        id: 'IQ_SEQ_1',
        question: 'Sequence: 2, 3, 5, 9, 17, ...',
        options: ['34', '33', '26', '35'],
        correctIndex: 1,
        explanation: 'Difference powers of 2. +1, +2, +4, +8, next +16. 17+16=33.',
        difficulty: 5,
        discrimination: 1.2
    },
    {
        id: 'IQ_SEQ_2',
        question: 'Sequence: 1, 4, 27, 256, ...',
        options: ['1024', '3125', '625', '512'],
        correctIndex: 1,
        explanation: 'n^n sequence. 1^1, 2^2, 3^3, 4^4. Next is 5^5 = 3125.',
        difficulty: 9,
        discrimination: 2.0
    },
    {
        id: 'IQ_SEQ_3',
        question: 'Sequence: 2, 6, 12, 20, 30, ...',
        options: ['40', '42', '44', '36'],
        correctIndex: 1,
        explanation: 'n(n+1) sequence: 1×2, 2×3, 3×4, 4×5, 5×6. Next is 6×7 = 42.',
        difficulty: 6,
        discrimination: 1.4
    },
    {
        id: 'IQ_SEQ_4',
        question: 'Sequence: 1, 1, 2, 3, 5, 8, ...',
        options: ['11', '12', '13', '10'],
        correctIndex: 2,
        explanation: 'Fibonacci sequence. Each number is sum of previous two: 5+8=13.',
        difficulty: 4,
        discrimination: 1.0
    },
    {
        id: 'IQ_SEQ_5',
        question: 'Sequence: 3, 6, 11, 18, 27, ...',
        options: ['36', '38', '39', '35'],
        correctIndex: 1,
        explanation: 'Differences increase by 2: +3, +5, +7, +9, +11. 27+11=38.',
        difficulty: 5,
        discrimination: 1.3
    },
    {
        id: 'IQ_SEQ_6',
        question: 'Sequence: 1, 2, 6, 24, 120, ...',
        options: ['600', '720', '480', '840'],
        correctIndex: 1,
        explanation: 'Factorial sequence: 1!, 2!, 3!, 4!, 5!. Next is 6! = 720.',
        difficulty: 7,
        discrimination: 1.5
    },
    {
        id: 'IQ_SEQ_7',
        question: 'Sequence: 2, 5, 10, 17, 26, ...',
        options: ['35', '36', '37', '34'],
        correctIndex: 2,
        explanation: 'n² + 1 sequence: 1+1, 4+1, 9+1, 16+1, 25+1. Next is 36+1 = 37.',
        difficulty: 6,
        discrimination: 1.4
    },
    {
        id: 'IQ_SEQ_8',
        question: 'Sequence: 0, 1, 1, 2, 4, 7, 13, ...',
        options: ['20', '24', '22', '21'],
        correctIndex: 1,
        explanation: 'Tribonacci: each is sum of previous three. 4+7+13=24.',
        difficulty: 8,
        discrimination: 1.8
    },

    // ========================================================================
    // VERBAL ANALOGIES (6 items)
    // ========================================================================
    {
        id: 'IQ_ANALOGY_1',
        question: 'CRYPTOGRAPHY is to SECRECY as EPISTEMOLOGY is to:',
        options: ['KNOWLEDGE', 'WRITING', 'HISTORY', 'BIOLOGY'],
        correctIndex: 0,
        explanation: 'Cryptography is the study of secrecy. Epistemology is the study of knowledge.',
        difficulty: 8,
        discrimination: 1.4
    },
    {
        id: 'IQ_ANALOGY_2',
        question: 'ARCHITECT is to BUILDING as COMPOSER is to:',
        options: ['PIANO', 'SYMPHONY', 'SINGER', 'CONDUCTOR'],
        correctIndex: 1,
        explanation: 'An architect creates buildings. A composer creates symphonies.',
        difficulty: 4,
        discrimination: 1.0
    },
    {
        id: 'IQ_ANALOGY_3',
        question: 'FISH is to SCHOOL as WOLF is to:',
        options: ['DEN', 'PACK', 'HERD', 'FLOCK'],
        correctIndex: 1,
        explanation: 'A group of fish is a school. A group of wolves is a pack.',
        difficulty: 3,
        discrimination: 0.9
    },
    {
        id: 'IQ_ANALOGY_4',
        question: 'MITIGATION is to SEVERITY as AMPLIFICATION is to:',
        options: ['VOLUME', 'REDUCTION', 'SILENCE', 'INTENSITY'],
        correctIndex: 3,
        explanation: 'Mitigation reduces severity. Amplification increases intensity.',
        difficulty: 7,
        discrimination: 1.5
    },
    {
        id: 'IQ_ANALOGY_5',
        question: 'CANVAS is to PAINTER as MARBLE is to:',
        options: ['SCULPTOR', 'ARCHITECT', 'MASON', 'CARVER'],
        correctIndex: 0,
        explanation: 'Painters work with canvas. Sculptors work with marble.',
        difficulty: 4,
        discrimination: 1.1
    },
    {
        id: 'IQ_ANALOGY_6',
        question: 'BIBLIOPHILE is to BOOKS as OENOPHILE is to:',
        options: ['MUSIC', 'WINE', 'ART', 'FOOD'],
        correctIndex: 1,
        explanation: 'A bibliophile loves books. An oenophile loves wine.',
        difficulty: 8,
        discrimination: 1.6
    },

    // ========================================================================
    // PATTERN RECOGNITION (6 items)
    // ========================================================================
    {
        id: 'IQ_PATTERN_1',
        question: 'Which word is the odd one out?',
        options: ['Nun', 'Level', 'Madam', 'River'],
        correctIndex: 3,
        explanation: 'Others are palindromes. River is not.',
        difficulty: 4,
        discrimination: 1.0
    },
    {
        id: 'IQ_PATTERN_2',
        question: 'If 72 × 96 = 6927, 58 × 87 = 7885, then 79 × 86 = ?',
        options: ['6897', '7689', '8976', '9768'],
        correctIndex: 0,
        explanation: 'Mirror logic: The digits are reversed. 79×86 -> 6897.',
        difficulty: 5,
        discrimination: 1.1
    },
    {
        id: 'IQ_PATTERN_3',
        question: 'Which number does not belong: 2, 5, 10, 17, 26, 35?',
        options: ['5', '17', '35', '26'],
        correctIndex: 2,
        explanation: 'Pattern is n² + 1: 1, 4, 9, 16, 25, 36 +1 = 2, 5, 10, 17, 26, 37. 35 breaks pattern.',
        difficulty: 7,
        discrimination: 1.6
    },
    {
        id: 'IQ_PATTERN_4',
        question: 'Complete: RED, ORANGE, YELLOW, GREEN, ___',
        options: ['PURPLE', 'BLUE', 'PINK', 'INDIGO'],
        correctIndex: 1,
        explanation: 'Rainbow order: ROYGBIV. Blue comes after Green.',
        difficulty: 2,
        discrimination: 0.7
    },
    {
        id: 'IQ_PATTERN_5',
        question: 'If APPLE = 50, BANANA = 42, then CHERRY = ?',
        options: ['49', '54', '63', '56'],
        correctIndex: 2,
        explanation: 'Sum of letters (A=1, B=2...) × number of letters. CHERRY: (3+8+5+18+18+25) = 63.',
        difficulty: 8,
        discrimination: 1.7
    },
    {
        id: 'IQ_PATTERN_6',
        question: 'Which number comes next: 7, 13, 31, 85, ?',
        options: ['247', '169', '127', '211'],
        correctIndex: 0,
        explanation: '×3+(-8,-8,-8,-8): No, it\'s ×3-8, ×3-8: 7×3-8=13, 13×3-8=31, 31×3-8=85, 85×3-8=247.',
        difficulty: 9,
        discrimination: 1.9
    }
];

// --- 3. VISUAL PUZZLES (Pool Expansion + IRT) ---
// --- 3. VISUAL PUZZLES (Raven's Progressive Matrices Style) ---
export const VISUAL_PUZZLES: VisualPuzzle[] = [
    // 1. Pattern Completion (Simple)
    {
        id: 'VIS_MATRIX_1',
        type: 'grid',
        question: 'Identify the missing component based on the pattern trend.',
        shapes: ['1-dot', '2-dots', '3-dots', '2-dots', '3-dots', '4-dots', '3-dots', '4-dots', '?'],
        options: ['1-bar', '5-dots', '6-dots', 'square-solid'],
        correctIndex: 1, // 5-dots
        explanation: 'Arithmetic Progression: Each cell increases quantity by 1 moving horizontally or vertically.',
        difficulty: 3,
        discrimination: 0.8
    },
    // 2. Rotation Logic (Clockwise)
    {
        id: 'VIS_MATRIX_2',
        type: 'grid',
        question: 'Determine the rotation rule and select the final state.',
        shapes: ['arrow-up', 'arrow-right', 'arrow-down', 'arrow-right', 'arrow-down', 'arrow-left', 'arrow-down', 'arrow-left', '?'],
        options: ['arrow-right', 'arrow-up', 'circle-outline', 'arrow-down'],
        correctIndex: 1, // arrow-up
        explanation: 'Rotation: Each step rotates 90 degrees clockwise.',
        difficulty: 4,
        discrimination: 1.0
    },
    // 3. Distribution Logic (Sudoku-style uniqueness)
    {
        id: 'VIS_MATRIX_3',
        type: 'grid',
        question: 'Complete the matrix logic.',
        shapes: ['square-solid', 'circle-solid', 'triangle-solid', 'circle-solid', 'triangle-solid', 'square-solid', 'triangle-solid', 'square-solid', '?'],
        options: ['triangle-outline', 'circle-solid', 'diamond-solid', 'square-dot'],
        correctIndex: 1, // circle-solid
        explanation: 'Distribution Rule: Each row must contain exactly one Square, one Circle, and one Triangle.',
        difficulty: 4,
        discrimination: 1.1
    },
    // 4. Superposition / Arithmetic Logic (A + B = C)
    {
        id: 'VIS_MATRIX_4',
        type: 'grid',
        question: 'Apply the superposition rule.',
        shapes: ['line-v', 'line-h', 'plus', 'line-h', 'plus', 'line-v', 'plus', 'line-v', '?'],
        options: ['line-h', 'plus', 'circle', 'square'],
        correctIndex: 0, // line-h
        explanation: 'Cyclic Arithmetic: V + H = Plus. If A+B=C, and we see Plus + V, the missing part is H.',
        difficulty: 6,
        discrimination: 1.4
    },
    // 5. Polygon Progression
    {
        id: 'VIS_MATRIX_5',
        type: 'grid',
        question: 'Predict the geometric evolution.',
        shapes: ['poly-3', 'poly-4', 'poly-5', 'poly-4', 'poly-5', 'poly-6', 'poly-5', 'poly-6', '?'],
        options: ['poly-8', 'poly-7', 'circle', 'poly-3'],
        correctIndex: 1, // poly-7
        explanation: 'Side Count Increase: Triangle(3) -> Square(4) -> Pentagon(5). Last row starts 5 -> 6 -> ?(7).',
        difficulty: 5,
        discrimination: 1.2
    },
    // 6. Phase Logic (Moons)
    {
        id: 'VIS_SEQ_MOON',
        type: 'sequence',
        question: 'Select the next phase in the cycle.',
        shapes: ['moon-new', 'moon-crescent', 'moon-half', 'moon-gibbous', '?'],
        options: ['moon-new', 'moon-full', 'sun', 'moon-crescent'],
        correctIndex: 1, // moon-full
        explanation: 'Lunar Cycle: New -> Crescent -> Half -> Gibbous -> Full.',
        difficulty: 4,
        discrimination: 0.9
    },
    // 7. Clock Arithmetic
    {
        id: 'VIS_SEQ_CLOCK',
        type: 'sequence',
        question: 'Calculate the next time state.',
        shapes: ['clock-12', 'clock-3', 'clock-6', 'clock-9', '?'],
        options: ['clock-1', 'clock-10', 'clock-12', 'clock-6'],
        correctIndex: 2, // clock-12
        explanation: 'Modules 12 Arithmetic: +3 hours per step.',
        difficulty: 3,
        discrimination: 0.8
    },
    // 8. 3D Mental Rotation (Hard)
    {
        id: 'VIS_ROT_CUBE',
        type: 'rotation',
        question: 'Identify the matching 3D block after 90° rotation.',
        shapes: ['cube-pattern-E-rot'], // Rotated 90
        options: ['cube-pattern-B', 'cube-pattern-E', 'cube-pattern-C', 'cube-pattern-D'],
        correctIndex: 1, // cube-pattern-E (The original unrotated, or compatible state)
        explanation: 'Spatial Reasoning: The bar on top rotates with the cube.',
        difficulty: 8,
        discrimination: 1.8
    },
    // 9. Exclusion Logic
    {
        id: 'VIS_ODD_1',
        type: 'odd-one-out',
        question: 'Which element does not belong to the set?',
        shapes: ['circle-outline', 'square-outline', 'triangle-outline', 'circle-solid'],
        options: ['circle-solid', 'triangle-outline', 'square-outline', 'circle-outline'],
        correctIndex: 0, // circle-solid
        explanation: 'Consistency Check: All others are outlines; this one is solid/filled.',
        difficulty: 3,
        discrimination: 0.9
    },
    // 10. Complex Matrix (Color/Fill/Shape)
    {
        id: 'VIS_MATRIX_ADV',
        type: 'grid',
        question: 'Analyze the transformation matrix.',
        shapes: ['square-outline', 'square-dot', 'square-cross', 'circle-outline', 'circle-dot', 'circle-cross', 'triangle-outline', 'triangle-dot', '?'],
        options: ['triangle-solid', 'triangle-cross', 'square-cross', 'circle-dot'],
        correctIndex: 1, // triangle-cross
        explanation: 'Grid Logic: Rows define Shape (Square, Circle, Triangle). Columns define Fill (Outline, Dot, Cross).',
        difficulty: 7,
        discrimination: 1.6
    }
];

// --- 4. EQ SCENARIOS (Expanded Pool: 40 Items) ---
export const EQ_SCENARIOS: ScenarioItem[] = [
    // ========================================================================
    // WORKPLACE / PROFESSIONAL (15 items)
    // ========================================================================
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
    {
        id: 'EQ_WORK_1',
        scenario: 'Your manager asks you to do something that conflicts with your values but isn\'t illegal.',
        options: [
            { text: 'Refuse outright and lecture them on ethics.', score: 1 },
            { text: 'Do it without question to avoid conflict.', score: 2 },
            { text: 'Express your concern professionally and propose an alternative approach.', score: 5 },
            { text: 'Agree but secretly sabotage the task.', score: 1 }
        ]
    },
    {
        id: 'EQ_WORK_2',
        scenario: 'A junior colleague makes a mistake that affects your project deadline.',
        options: [
            { text: 'Publicly criticize them to set an example.', score: 1 },
            { text: 'Fix it yourself and never mention it.', score: 3 },
            { text: 'Help them fix it while explaining what went wrong as a learning moment.', score: 5 },
            { text: 'Report them directly to management.', score: 2 }
        ]
    },
    {
        id: 'EQ_WORK_3',
        scenario: 'You overhear colleagues gossiping negatively about another team member.',
        options: [
            { text: 'Join in to fit in with the group.', score: 1 },
            { text: 'Walk away silently.', score: 3 },
            { text: 'Redirect the conversation or gently point out the person\'s positive qualities.', score: 5 },
            { text: 'Report them to HR immediately.', score: 2 }
        ]
    },
    {
        id: 'EQ_WORK_4',
        scenario: 'You disagree with a decision made by senior leadership.',
        options: [
            { text: 'Publicly voice your disagreement in an all-hands meeting.', score: 2 },
            { text: 'Comply while openly complaining to coworkers.', score: 1 },
            { text: 'Follow the decision while seeking an appropriate channel to share your perspective.', score: 5 },
            { text: 'Ignore the decision and do what you think is right.', score: 1 }
        ]
    },
    {
        id: 'EQ_WORK_5',
        scenario: 'A coworker consistently arrives late to meetings, disrupting the flow.',
        options: [
            { text: 'Call them out publicly in the next meeting.', score: 1 },
            { text: 'Adjust meeting times to accommodate them.', score: 2 },
            { text: 'Speak with them privately to understand and address the issue.', score: 5 },
            { text: 'Start without them and let them figure it out.', score: 3 }
        ]
    },
    {
        id: 'EQ_WORK_6',
        scenario: 'You are passed over for a promotion you expected to get.',
        options: [
            { text: 'Confront your manager angrily.', score: 1 },
            { text: 'Start looking for a new job immediately.', score: 2 },
            { text: 'Request feedback on what you can improve for next time.', score: 5 },
            { text: 'Become disengaged and do the minimum work.', score: 1 }
        ]
    },
    {
        id: 'EQ_WORK_7',
        scenario: 'You notice a colleague struggling with their workload but haven\'t asked for help.',
        options: [
            { text: 'Wait for them to ask you directly.', score: 3 },
            { text: 'Tell others they can\'t handle their job.', score: 1 },
            { text: 'Offer assistance proactively without making them feel incompetent.', score: 5 },
            { text: 'Report to manager that they\'re overwhelmed.', score: 2 }
        ]
    },
    {
        id: 'EQ_WORK_8',
        scenario: 'During a team brainstorm, a colleague dismisses your suggestion rudely.',
        options: [
            { text: 'Attack their idea in retaliation.', score: 1 },
            { text: 'Stop contributing to the discussion.', score: 2 },
            { text: 'Calmly ask them to elaborate on their concerns and build on the discussion.', score: 5 },
            { text: 'Complain to the team lead after the meeting.', score: 2 }
        ]
    },
    {
        id: 'EQ_WORK_9',
        scenario: 'You realize you\'ve been cc\'d on an email chain where others are criticizing your work.',
        options: [
            { text: 'Reply-all defensively.', score: 1 },
            { text: 'Forward it to your manager to handle.', score: 2 },
            { text: 'Address it privately with the sender, seeking to understand and clarify.', score: 5 },
            { text: 'Pretend you didn\'t see it.', score: 3 }
        ]
    },
    {
        id: 'EQ_WORK_10',
        scenario: 'A new hire is struggling to adapt to team culture and seems isolated.',
        options: [
            { text: 'Leave them alone to figure it out.', score: 2 },
            { text: 'Gossip about their awkwardness with others.', score: 1 },
            { text: 'Invite them to lunch and introduce them to team members.', score: 5 },
            { text: 'Tell HR they\'re not fitting in.', score: 2 }
        ]
    },
    {
        id: 'EQ_WORK_11',
        scenario: 'You\'re asked to mentor someone you don\'t particularly like.',
        options: [
            { text: 'Decline and request someone else.', score: 2 },
            { text: 'Accept but give minimal effort.', score: 1 },
            { text: 'Accept and approach it professionally, focusing on their development.', score: 5 },
            { text: 'Accept but constantly criticize them.', score: 1 }
        ]
    },

    // ========================================================================
    // SOCIAL / INTERPERSONAL (12 items)
    // ========================================================================
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
            { text: 'Walk past quickly to respect their privacy.', score: 3 },
            { text: 'Stare at them curiously.', score: 1 },
            { text: 'Sit near them quietly, offering a tissue if you have one, without forcing conversation.', score: 5 },
            { text: 'Immediately ask them "What is wrong?" loudly.', score: 2 }
        ]
    },
    {
        id: 'EQ_SOC_1',
        scenario: 'A family member constantly gives unsolicited advice about your life choices.',
        options: [
            { text: 'Cut them off completely.', score: 1 },
            { text: 'Smile and agree but do what you want.', score: 3 },
            { text: 'Set a kind but firm boundary about your decision-making.', score: 5 },
            { text: 'Argue with them every time.', score: 1 }
        ]
    },
    {
        id: 'EQ_SOC_2',
        scenario: 'Your roommate has been playing loud music late at night.',
        options: [
            { text: 'Play louder music to retaliate.', score: 1 },
            { text: 'Post passive-aggressive notes.', score: 1 },
            { text: 'Have a respectful conversation about quiet hours.', score: 5 },
            { text: 'Move out without saying anything.', score: 2 }
        ]
    },
    {
        id: 'EQ_SOC_3',
        scenario: 'A close friend confides something personal and asks you to keep it secret, but it affects another friend.',
        options: [
            { text: 'Tell the other friend immediately.', score: 1 },
            { text: 'Keep the secret no matter what.', score: 3 },
            { text: 'Encourage the first friend to share it themselves, offering support.', score: 5 },
            { text: 'Post about it vaguely on social media.', score: 1 }
        ]
    },
    {
        id: 'EQ_SOC_4',
        scenario: 'At a party, you notice someone standing alone looking uncomfortable.',
        options: [
            { text: 'Ignore them and enjoy the party.', score: 2 },
            { text: 'Point them out to your friends.', score: 1 },
            { text: 'Approach them and start a friendly conversation.', score: 5 },
            { text: 'Ask the host to deal with them.', score: 2 }
        ]
    },
    {
        id: 'EQ_SOC_5',
        scenario: 'You accidentally hurt a friend\'s feelings with an insensitive comment.',
        options: [
            { text: 'Defend your comment as "just a joke."', score: 1 },
            { text: 'Avoid them until it blows over.', score: 2 },
            { text: 'Apologize sincerely and ask how you can make it right.', score: 5 },
            { text: 'Blame them for being too sensitive.', score: 1 }
        ]
    },
    {
        id: 'EQ_SOC_6',
        scenario: 'Two of your friends are in conflict and each wants you to take their side.',
        options: [
            { text: 'Pick the friend you like more.', score: 2 },
            { text: 'Avoid both until it\'s resolved.', score: 2 },
            { text: 'Listen to both without taking sides and encourage direct communication.', score: 5 },
            { text: 'Spread information between them to fix it.', score: 1 }
        ]
    },
    {
        id: 'EQ_SOC_7',
        scenario: 'You need to decline attending a wedding for financial reasons.',
        options: [
            { text: 'Make up an elaborate excuse.', score: 2 },
            { text: 'Just don\'t respond to the invitation.', score: 1 },
            { text: 'Politely decline with honesty and send congratulations.', score: 5 },
            { text: 'Complain about how expensive weddings are.', score: 1 }
        ]
    },
    {
        id: 'EQ_SOC_8',
        scenario: 'Your partner is venting about a problem but you know the solution.',
        options: [
            { text: 'Interrupt to share your solution immediately.', score: 2 },
            { text: 'Zone out because you\'ve heard it before.', score: 1 },
            { text: 'Listen actively first and ask if they want advice or just support.', score: 5 },
            { text: 'Tell them to stop complaining.', score: 1 }
        ]
    },
    {
        id: 'EQ_SOC_9',
        scenario: 'A friend has achieved something you secretly wanted for yourself.',
        options: [
            { text: 'Downplay their achievement.', score: 1 },
            { text: 'Act happy but feel bitter inside.', score: 2 },
            { text: 'Genuinely congratulate them while processing your own feelings privately.', score: 5 },
            { text: 'Cut off contact out of envy.', score: 1 }
        ]
    },

    // ========================================================================
    // MICRO-EXPRESSION / NON-VERBAL DECODING (5 items)
    // ========================================================================
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
            { text: 'They are likely feeling discomfort or being deceptive.', score: 5 },
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
    {
        id: 'EQ_MICRO_1',
        scenario: 'During an interview, the candidate frequently touches their face when answering about their last job.',
        options: [
            { text: 'They have an itch.', score: 2 },
            { text: 'They may be uncomfortable or withholding information.', score: 5 },
            { text: 'They are very confident.', score: 1 },
            { text: 'It\'s just a nervous habit and means nothing.', score: 3 }
        ]
    },
    {
        id: 'EQ_MICRO_2',
        scenario: 'When asked about their weekend, a colleague\'s eyebrows briefly rise before they answer.',
        options: [
            { text: 'They are trying to remember.', score: 3 },
            { text: 'They may have been surprised by the question or are about to share something unexpected.', score: 5 },
            { text: 'They are bored.', score: 1 },
            { text: 'They are angry.', score: 1 }
        ]
    },

    // ========================================================================
    // COMPLEX DILEMMAS / SELF-REGULATION (8 items)
    // ========================================================================
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
    },
    {
        id: 'EQ_DILEMMA_1',
        scenario: 'You witness a senior leader behaving unethically, but reporting could jeopardize your career.',
        options: [
            { text: 'Stay quiet to protect yourself.', score: 2 },
            { text: 'Confront them publicly.', score: 1 },
            { text: 'Document the behavior and report through proper channels.', score: 5 },
            { text: 'Spread rumors to undermine them.', score: 1 }
        ]
    },
    {
        id: 'EQ_DILEMMA_2',
        scenario: 'Your best friend\'s partner flirts with you when your friend isn\'t around.',
        options: [
            { text: 'Flirt back—it\'s harmless.', score: 1 },
            { text: 'Ignore it and hope it stops.', score: 2 },
            { text: 'Set a clear boundary and consider telling your friend.', score: 5 },
            { text: 'Avoid your friend to avoid the situation.', score: 2 }
        ]
    },
    {
        id: 'EQ_DILEMMA_3',
        scenario: 'You\'re exhausted and a friend asks for help moving on your only day off.',
        options: [
            { text: 'Say yes but resent them the whole time.', score: 2 },
            { text: 'Make up an excuse.', score: 2 },
            { text: 'Honestly explain you need rest but offer an alternative way to help.', score: 5 },
            { text: 'Ghost their message.', score: 1 }
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
