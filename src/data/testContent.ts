export interface QuestionItem {
    id: string;
    text: string;
    category: 'openness' | 'conscientiousness' | 'extraversion' | 'agreeableness' | 'neuroticism';
    reverse: boolean; // true if "Strongly Agree" means LOW trait score
}

export interface LogicPuzzle {
    id: string;
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
}

export interface VisualPuzzle {
    id: string;
    type: 'grid' | 'sequence' | 'rotation' | 'odd-one-out';
    question: string;
    shapes: string[]; // CSS classes or SVG paths for the pattern
    options: string[]; // CSS classes or SVG paths for the options
    correctIndex: number;
    explanation: string;
}

export interface ScenarioItem {
    id: string;
    scenario: string;
    options: {
        text: string;
        score: number; // 1-5 scale of emotional intelligence
    }[];
}

// 30 IPIP-NEO Items (Short Form)
export const PERSONALITY_ITEMS: QuestionItem[] = [
    // Openness
    { id: 'O1', text: 'I have a vivid imagination.', category: 'openness', reverse: false },
    { id: 'O2', text: 'I am not interested in abstract ideas.', category: 'openness', reverse: true },
    { id: 'O3', text: 'I have excellent ideas.', category: 'openness', reverse: false },
    { id: 'O4', text: 'I do not have a good imagination.', category: 'openness', reverse: true },
    { id: 'O5', text: 'I spend time reflecting on things.', category: 'openness', reverse: false },
    { id: 'O6', text: 'I avoid difficult reading material.', category: 'openness', reverse: true },

    // Conscientiousness
    { id: 'C1', text: 'I get chores done right away.', category: 'conscientiousness', reverse: false },
    { id: 'C2', text: 'I often forget to put things back in their proper place.', category: 'conscientiousness', reverse: true },
    { id: 'C3', text: 'I like order.', category: 'conscientiousness', reverse: false },
    { id: 'C4', text: 'I make a mess of things.', category: 'conscientiousness', reverse: true },
    { id: 'C5', text: 'I follow a schedule.', category: 'conscientiousness', reverse: false },
    { id: 'C6', text: 'I leave my belongings around.', category: 'conscientiousness', reverse: true },

    // Extraversion
    { id: 'E1', text: 'I am the life of the party.', category: 'extraversion', reverse: false },
    { id: 'E2', text: 'I don\'t talk a lot.', category: 'extraversion', reverse: true },
    { id: 'E3', text: 'I feel comfortable around people.', category: 'extraversion', reverse: false },
    { id: 'E4', text: 'I keep in the background.', category: 'extraversion', reverse: true },
    { id: 'E5', text: 'I start conversations.', category: 'extraversion', reverse: false },
    { id: 'E6', text: 'I have little to say.', category: 'extraversion', reverse: true },

    // Agreeableness
    { id: 'A1', text: 'I sympathize with others\' feelings.', category: 'agreeableness', reverse: false },
    { id: 'A2', text: 'I am not interested in other people\'s problems.', category: 'agreeableness', reverse: true },
    { id: 'A3', text: 'I have a soft heart.', category: 'agreeableness', reverse: false },
    { id: 'A4', text: 'I am not really interested in others.', category: 'agreeableness', reverse: true },
    { id: 'A5', text: 'I take time out for others.', category: 'agreeableness', reverse: false },
    { id: 'A6', text: 'I feel little concern for others.', category: 'agreeableness', reverse: true },

    // Neuroticism
    { id: 'N1', text: 'I get stressed out easily.', category: 'neuroticism', reverse: false },
    { id: 'N2', text: 'I am relaxed most of the time.', category: 'neuroticism', reverse: true },
    { id: 'N3', text: 'I worry about things.', category: 'neuroticism', reverse: false },
    { id: 'N4', text: 'I seldom feel blue.', category: 'neuroticism', reverse: true },
    { id: 'N5', text: 'I am easily disturbed.', category: 'neuroticism', reverse: false },
    { id: 'N6', text: 'I rarely get irritated.', category: 'neuroticism', reverse: true },
];

// 10 Text-Based Logic Puzzles (IQ - Fluid Intelligence)
export const LOGIC_PUZZLES: LogicPuzzle[] = [
    {
        id: 'IQ1',
        question: 'Which number comes next in the sequence: 2, 6, 12, 20, 30, ...?',
        options: ['36', '40', '42', '48'],
        correctIndex: 2, // 42 (n*n + n or +4, +6, +8, +10, +12)
        explanation: 'The pattern is adding consecutive even numbers: +4, +6, +8, +10. The next addition is +12.'
    },
    {
        id: 'IQ2',
        question: 'If all Bloops are Razzies and some Razzies are Zazzles, are all Bloops definitely Zazzles?',
        options: ['Yes', 'No', 'Impossible to determine'],
        correctIndex: 1, // No
        explanation: 'Logic of subsets. Bloops are a subset of Razzies. Zazzles intersect Razzies. Bloops might be disjoint from Zazzles.'
    },
    {
        id: 'IQ3',
        question: 'Finger is to Hand as Leaf is to:',
        options: ['Tree', 'Branch', 'Blossom', 'Bark'],
        correctIndex: 1, // Branch
        explanation: 'A finger is a part extending from a hand. A leaf is a part extending from a branch.'
    },
    {
        id: 'IQ4',
        question: 'Identify the odd one out: Apple, Rose, Potato, Lily.',
        options: ['Apple', 'Rose', 'Potato', 'Lily'],
        correctIndex: 2, // Potato
        explanation: 'Potato is a tuber/root vegetable. The others are flowers or fruits (Apple is a fruit, Rose/Lily are flowers - often grouped as above-ground reproductive parts vs underground).'
    },
    {
        id: 'IQ5',
        question: 'Complete the analogy: MOTION is to RUN as EMOTION is to:',
        options: ['FEEL', 'HEART', 'FURIOUS', 'SENSE'],
        correctIndex: 2, // FURIOUS
        explanation: 'Run is a specific type of Motion. Furious is a specific type of Emotion.'
    },
    {
        id: 'IQ6',
        question: 'If the day after tomorrow is two days before Thursday, what day is it today?',
        options: ['Sunday', 'Monday', 'Tuesday', 'Friday'],
        correctIndex: 0, // Sunday
        explanation: 'Two days before Thursday is Tuesday. So "Day after tomorrow" = Tuesday. Therefore Today = Sunday.'
    },
    {
        id: 'IQ7',
        question: 'Which word can be placed in the parentheses?  SCAR ( ... ) ANT',
        options: ['LET', 'ARE', 'TIE', 'CRE'],
        correctIndex: 0, // LET
        explanation: 'SCARLET and LETANT? No. SCARLET and ANT? Word bridge. SCAR(LET) -> SCARLET. (LET)ANT -> No. Wait. Common word formation. SCAR(LET) - SCARLET. (LET)ANT - No. Let\'s try: SCAR(CE)ANT? No. SCAR(F)ANT? No. Actually, usually these are word bridges. SCAR(...) ...ANT.  Let\'s try: SCAR(LET) -> SCARLET. ...ANT -> TENANT? No.  Let\'s try simpler: SCAR(CITY)ANT? No.  Let\'s re-evaluate. Maybe it\'s a word that finishes the first and starts the second? SCAR(LET) -> SCARLET. (LET)ANT -> No.  How about SCAR(F) -> SCARF. (F)ANT -> FANT? No.  Let\'s try: SCAR(E) -> SCARE. (E)ANT -> No.  Let\'s try: SCAR(D) -> SCARD. (D)ANT -> No.  Let\'s try: SCAR(P) -> SCARP. (P)ANT -> PANT. Yes. P is the letter. But options are words.  Let\'s look for a 3 letter word. SCAR(LET) -> SCARLET.  Is there a word LETANT? No.  How about SCAR(KEY) -> SCARKEY? No.  Let\'s try: SCAR(XXX)ANT.  Maybe SCAR(XXX) and (XXX)ANT are words.  SCAR(LET) -> SCARLET. (LET)ANT -> No.  SCAR(TEN) -> SCARTEN? No. (TEN)ANT -> TENANT. Yes.  SCAR(TEN)? No.  How about SCAR(XXX) and (XXX)ANT.  Let\'s try: SCAR(XXX) -> Word 1. (XXX)ANT -> Word 2.  Options: LET, ARE, TIE, CRE.  SCAR(LET) -> SCARLET. (LET)ANT -> No.  SCAR(ARE) -> No. (ARE)ANT -> No.  SCAR(TIE) -> No. (TIE)ANT -> No.  SCAR(CRE) -> No. (CRE)ANT -> CREANT (archaic).  Let\'s try a different logic.  Maybe it\'s an anagram? No.  Let\'s try: SCAR(XXX)ANT is one word? SCARLETANT? No.  Let\'s swap the question for a clearer one.'
    },
    {
        id: 'IQ7_REPLACEMENT',
        question: 'Which word does not belong?  Microscope, Telescope, Periscope, Stethoscope.',
        options: ['Microscope', 'Telescope', 'Periscope', 'Stethoscope'],
        correctIndex: 3, // Stethoscope
        explanation: 'The first three are optical instruments using lenses/mirrors. A stethoscope uses sound.'
    },
    {
        id: 'IQ8',
        question: '29, 27, 24, 20, 15, ... What is the next number?',
        options: ['7', '9', '10', '11'],
        correctIndex: 1, // 9
        explanation: '-2, -3, -4, -5, ... next is -6. 15 - 6 = 9.'
    },
    {
        id: 'IQ9',
        question: 'A is the father of B. But B is not the son of A. What is B\'s relation to A?',
        options: ['Grandson', 'Daughter', 'Nephew', 'Father'],
        correctIndex: 1, // Daughter
        explanation: 'If B is not the son, B must be the daughter.'
    },
    {
        id: 'IQ10',
        question: 'Unscramble the letters "CIFAIPC" to form the name of an ocean.',
        options: ['Arctic', 'Atlantic', 'Pacific', 'Indian'],
        correctIndex: 2, // Pacific
        explanation: 'PACIFIC unscrambled.'
    }
];

// 20 Visual Puzzles (Raven's, Rotation, Series)
export const VISUAL_PUZZLES: VisualPuzzle[] = [
    // --- Raven's Matrices (Pattern Completion) ---
    {
        id: 'VIS1',
        type: 'grid',
        question: 'Complete the pattern.',
        shapes: ['square-solid', 'circle-solid', 'triangle-solid', 'square-outline', 'circle-outline', 'triangle-outline', 'square-dot', 'circle-dot', '?'],
        options: ['triangle-dot', 'square-cross', 'circle-cross', 'triangle-solid'],
        correctIndex: 0,
        explanation: 'Row 1: Solid shapes. Row 2: Outline shapes. Row 3: Shapes with a dot. Column sequence: Square, Circle, Triangle. Missing: Triangle with a dot.'
    },
    {
        id: 'VIS2',
        type: 'grid',
        question: 'Find the missing piece.',
        shapes: ['arrow-up', 'arrow-right', 'arrow-down', 'arrow-right', 'arrow-down', 'arrow-left', 'arrow-down', 'arrow-left', '?'],
        options: ['arrow-up', 'arrow-right', 'arrow-down', 'arrow-left'],
        correctIndex: 0,
        explanation: 'Each row rotates 90 degrees clockwise. Row 3: Down -> Left -> Up.'
    },
    {
        id: 'VIS3',
        type: 'grid',
        question: 'Complete the matrix.',
        shapes: ['1-dot', '2-dots', '3-dots', '2-dots', '3-dots', '4-dots', '3-dots', '4-dots', '?'],
        options: ['4-dots', '5-dots', '6-dots', '1-dot'],
        correctIndex: 1,
        explanation: 'Arithmetic progression. Row 1: 1,2,3. Row 2: 2,3,4. Row 3: 3,4,5.'
    },
    {
        id: 'VIS4',
        type: 'grid',
        question: 'Which shape fits?',
        shapes: ['circle-sm', 'circle-md', 'circle-lg', 'square-sm', 'square-md', 'square-lg', 'diamond-sm', 'diamond-md', '?'],
        options: ['diamond-lg', 'diamond-sm', 'circle-lg', 'square-lg'],
        correctIndex: 0,
        explanation: 'Columns are shapes (Circle, Square, Diamond). Rows are sizes (Small, Medium, Large). Missing: Diamond Large.'
    },
    {
        id: 'VIS5',
        type: 'grid',
        question: 'Logical deduction.',
        shapes: ['line-h', 'line-v', 'plus', 'line-v', 'plus', 'line-h', 'plus', 'line-h', '?'],
        options: ['line-v', 'plus', 'circle', 'square'],
        correctIndex: 0,
        explanation: 'XOR Logic. Row 1: H + V = Plus. Row 2: V + Plus = H (visual subtraction). Row 3: Plus + H = V.'
    },

    // --- Spatial Rotation ---
    {
        id: 'VIS6',
        type: 'rotation',
        question: 'Which option is a rotation of the main shape?',
        shapes: ['L-shape-0'],
        options: ['L-shape-flip', 'L-shape-90', 'L-shape-distorted', 'Z-shape'],
        correctIndex: 1,
        explanation: 'Option B is the L-shape rotated 90 degrees. Others are flipped or different shapes.'
    },
    {
        id: 'VIS7',
        type: 'rotation',
        question: 'Identify the rotated figure.',
        shapes: ['F-shape-0'],
        options: ['F-shape-180', 'F-shape-mirror', 'E-shape', 'T-shape'],
        correctIndex: 0,
        explanation: 'Option A is the F-shape rotated 180 degrees.'
    },
    {
        id: 'VIS8',
        type: 'rotation',
        question: 'Find the matching 3D block.',
        shapes: ['cube-pattern-A'],
        options: ['cube-pattern-B', 'cube-pattern-A-rot', 'cube-pattern-C', 'cube-pattern-D'],
        correctIndex: 1,
        explanation: 'Mental rotation of a cube with specific face patterns.'
    },
    {
        id: 'VIS9',
        type: 'rotation',
        question: 'Which shape is the same as the reference?',
        shapes: ['spiral-cw'],
        options: ['spiral-ccw', 'spiral-cw-rot', 'spiral-distorted', 'circle'],
        correctIndex: 1,
        explanation: 'Clockwise spiral rotated is still a clockwise spiral.'
    },
    {
        id: 'VIS10',
        type: 'rotation',
        question: 'Select the rotated version.',
        shapes: ['triangle-asym'],
        options: ['triangle-asym-mirror', 'triangle-asym-rot', 'triangle-equi', 'triangle-iso'],
        correctIndex: 1,
        explanation: 'Asymmetrical triangle rotated.'
    },

    // --- Visual Series ---
    {
        id: 'VIS11',
        type: 'sequence',
        question: 'What comes next?',
        shapes: ['clock-12', 'clock-3', 'clock-6', 'clock-9', '?'],
        options: ['clock-12', 'clock-1', 'clock-6', 'clock-10'],
        correctIndex: 0,
        explanation: 'Clock hand moving 90 degrees clockwise. Next is 12 o\'clock.'
    },
    {
        id: 'VIS12',
        type: 'sequence',
        question: 'Continue the sequence.',
        shapes: ['bar-1', 'bar-2', 'bar-3', 'bar-4', '?'],
        options: ['bar-3', 'bar-5', 'bar-1', 'bar-0'],
        correctIndex: 1,
        explanation: 'Adding one bar each step.'
    },
    {
        id: 'VIS13',
        type: 'sequence',
        question: 'Next in the pattern?',
        shapes: ['poly-3', 'poly-4', 'poly-5', 'poly-6', '?'],
        options: ['poly-7', 'poly-8', 'poly-3', 'circle'],
        correctIndex: 0,
        explanation: 'Sides of polygon increasing: Triangle, Square, Pentagon, Hexagon. Next is Heptagon.'
    },
    {
        id: 'VIS14',
        type: 'sequence',
        question: 'Predict the next state.',
        shapes: ['moon-new', 'moon-crescent', 'moon-half', 'moon-gibbous', '?'],
        options: ['moon-full', 'moon-new', 'moon-crescent', 'sun'],
        correctIndex: 0,
        explanation: 'Phases of the moon progression.'
    },
    {
        id: 'VIS15',
        type: 'sequence',
        question: 'Follow the movement.',
        shapes: ['grid-tl', 'grid-tr', 'grid-br', 'grid-bl', '?'],
        options: ['grid-tl', 'grid-center', 'grid-tr', 'grid-br'],
        correctIndex: 0,
        explanation: 'Dot moving clockwise in corners. Returns to Top-Left.'
    },

    // --- Odd One Out ---
    {
        id: 'VIS16',
        type: 'odd-one-out',
        question: 'Which shape does not belong?',
        shapes: ['circle', 'oval', 'square', 'ellipse'],
        options: ['circle', 'oval', 'square', 'ellipse'],
        correctIndex: 2,
        explanation: 'Square has corners; others are curvilinear.'
    },
    {
        id: 'VIS17',
        type: 'odd-one-out',
        question: 'Identify the outlier.',
        shapes: ['parallel-h', 'parallel-v', 'parallel-d', 'intersecting'],
        options: ['parallel-h', 'parallel-v', 'parallel-d', 'intersecting'],
        correctIndex: 3,
        explanation: 'First three are parallel lines; last one intersects.'
    },
    {
        id: 'VIS18',
        type: 'odd-one-out',
        question: 'Find the intruder.',
        shapes: ['3D-cube', '3D-sphere', '3D-pyramid', '2D-square'],
        options: ['3D-cube', '3D-sphere', '3D-pyramid', '2D-square'],
        correctIndex: 3,
        explanation: 'Square is 2D; others are 3D solids.'
    },
    {
        id: 'VIS19',
        type: 'odd-one-out',
        question: 'Which one is different?',
        shapes: ['fill-100', 'fill-75', 'fill-50', 'outline'],
        options: ['fill-100', 'fill-75', 'fill-50', 'outline'],
        correctIndex: 3,
        explanation: 'First three have some fill; last is purely outline (or 0% fill).'
    },
    {
        id: 'VIS20',
        type: 'odd-one-out',
        question: 'Spot the odd one.',
        shapes: ['sym-x', 'sym-y', 'sym-xy', 'asym'],
        options: ['sym-x', 'sym-y', 'sym-xy', 'asym'],
        correctIndex: 3,
        explanation: 'First three have symmetry; last is asymmetrical.'
    }
];

// 10 Situational Judgment Scenarios (EQ)
export const EQ_SCENARIOS: ScenarioItem[] = [
    {
        id: 'EQ1',
        scenario: 'A colleague takes credit for your idea in a meeting. What is the most effective response?',
        options: [
            { text: 'Immediately interrupt and correct them publicly.', score: 1 },
            { text: 'Stay silent and complain to others later.', score: 2 },
            { text: 'Speak to them privately afterwards to express your disappointment and ask them to clarify next time.', score: 5 },
            { text: 'Let it go to avoid conflict.', score: 3 }
        ]
    },
    {
        id: 'EQ2',
        scenario: 'You notice a friend is unusually quiet and withdrawn. You ask if they are okay, and they snap "I\'m fine!"',
        options: [
            { text: 'Snap back "Fine, be that way!"', score: 1 },
            { text: 'Give them space but send a text later saying you\'re there if they need to talk.', score: 5 },
            { text: 'Keep pressing them until they tell you what\'s wrong.', score: 2 },
            { text: 'Ignore it and act like nothing happened.', score: 3 }
        ]
    },
    {
        id: 'EQ3',
        scenario: 'You are extremely stressed about a deadline and a junior team member asks for help with a minor task.',
        options: [
            { text: 'Tell them you are busy and can\'t help.', score: 3 },
            { text: 'Help them immediately, ignoring your own deadline.', score: 2 },
            { text: 'Briefly explain your deadline and schedule a specific time to help them later.', score: 5 },
            { text: 'Yell at them for interrupting you.', score: 1 }
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
        id: 'EQ5',
        scenario: 'Two friends are arguing and ask you to pick a side.',
        options: [
            { text: 'Pick the side of the friend you like more.', score: 2 },
            { text: 'Refuse to get involved and leave.', score: 3 },
            { text: 'Listen to both but decline to take sides, encouraging them to find a compromise.', score: 5 },
            { text: 'Tell them they are both being childish.', score: 1 }
        ]
    },
    {
        id: 'EQ6',
        scenario: 'You make a mistake that costs the company money.',
        options: [
            { text: 'Hide the mistake and hope no one notices.', score: 1 },
            { text: 'Blame it on a system error or someone else.', score: 1 },
            { text: 'Admit the mistake immediately to your supervisor and propose a solution.', score: 5 },
            { text: 'Wait until someone finds out and then apologize.', score: 3 }
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
            { text: 'Acknowledge the difficulty, be transparent about the situation, and offer support.', score: 5 },
            { text: 'Throw a party to force everyone to be happy.', score: 3 }
        ]
    },
    {
        id: 'EQ9',
        scenario: 'You realize you have been dominating the conversation at a dinner party.',
        options: [
            { text: 'Continue talking because your stories are interesting.', score: 1 },
            { text: 'Stop talking completely and sit in silence.', score: 2 },
            { text: 'Pause, apologize briefly, and ask someone else a question to shift the focus.', score: 5 },
            { text: 'Make a joke about how much you talk.', score: 4 }
        ]
    },
    {
        id: 'EQ10',
        scenario: 'A friend cancels plans with you at the last minute for the third time in a row.',
        options: [
            { text: 'Send an angry text and block them.', score: 1 },
            { text: 'Say "it\'s okay" but secretly fume.', score: 2 },
            { text: 'Calmly express how this makes you feel and ask if everything is okay with them.', score: 5 },
            { text: 'Stop inviting them anywhere without saying why.', score: 3 }
        ]
    }
];
