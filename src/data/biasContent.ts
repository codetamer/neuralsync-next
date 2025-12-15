// Cognitive Bias Content for Meta-Cognition Assessment
// Tests user awareness and resistance to common cognitive biases

export interface BiasItem {
    id: string;
    type: 'anchoring' | 'confirmation' | 'sunk_cost' | 'availability' | 'framing' | 'bandwagon' | 'hindsight';
    scenario: string;
    options: { text: string; score: number; biased: boolean }[];
    explanation: string;
    difficulty: number;
}

export const BIAS_ITEMS: BiasItem[] = [
    // ========================================================================
    // ANCHORING BIAS
    // ========================================================================
    {
        id: 'BIAS_ANCHOR_01',
        type: 'anchoring',
        scenario: 'A used car dealer initially prices a car at $25,000, then offers a "discount" to $18,000. Independent research shows the car\'s market value is $15,000. What is a fair price to pay?',
        options: [
            { text: '$17,000 - The discount makes it a good deal', score: 1, biased: true },
            { text: '$15,000 - Market value regardless of asking price', score: 5, biased: false },
            { text: '$16,000 - Split the difference', score: 2, biased: true },
            { text: '$18,000 - Take the offered discount', score: 1, biased: true }
        ],
        explanation: 'Anchoring bias: The initial $25,000 price serves as an anchor, making $18,000 feel like a bargain even though it exceeds market value.',
        difficulty: 5
    },
    {
        id: 'BIAS_ANCHOR_02',
        type: 'anchoring',
        scenario: 'A recruiter mentions their previous candidate expected $150,000 salary. You were planning to ask for $95,000 based on your research. What should you do?',
        options: [
            { text: 'Ask for $120,000 since that\'s between both numbers', score: 2, biased: true },
            { text: 'Stick with your researched $95,000 request', score: 5, biased: false },
            { text: 'Ask for $140,000 to stay close to the anchor', score: 1, biased: true },
            { text: 'Feel inadequate and ask for $85,000', score: 1, biased: true }
        ],
        explanation: 'The recruiter\'s mention of $150K is an anchor designed to influence your expectations. Your research-based figure is more relevant.',
        difficulty: 6
    },

    // ========================================================================
    // SUNK COST FALLACY
    // ========================================================================
    {
        id: 'BIAS_SUNK_01',
        type: 'sunk_cost',
        scenario: 'You\'ve spent $100 on a non-refundable concert ticket. On the day of the concert, you feel sick and there\'s a blizzard. What should factor into your decision to attend?',
        options: [
            { text: 'The $100 already spent - I should get my money\'s worth', score: 1, biased: true },
            { text: 'Only current factors: my health and travel safety', score: 5, biased: false },
            { text: 'How much I was looking forward to it', score: 3, biased: false },
            { text: 'What others would think if I didn\'t go', score: 2, biased: true }
        ],
        explanation: 'Sunk cost fallacy: The $100 is gone regardless of attendance. Rational decision-making considers only future costs and benefits.',
        difficulty: 4
    },
    {
        id: 'BIAS_SUNK_02',
        type: 'sunk_cost',
        scenario: 'Your company has invested $2 million into a project that\'s clearly failing. Another $1 million could complete it, but the market has shifted and success is unlikely. What\'s the best approach?',
        options: [
            { text: 'Complete it - we\'ve already invested $2 million', score: 1, biased: true },
            { text: 'Cut losses now and reallocate resources', score: 5, biased: false },
            { text: 'Invest more to "protect" the initial investment', score: 1, biased: true },
            { text: 'Delay the decision hoping things change', score: 2, biased: true }
        ],
        explanation: 'The $2M is a sunk cost. Spending another $1M on a likely-to-fail project just because of past investment is irrational.',
        difficulty: 5
    },

    // ========================================================================
    // CONFIRMATION BIAS
    // ========================================================================
    {
        id: 'BIAS_CONFIRM_01',
        type: 'confirmation',
        scenario: 'You believe a new diet works. To verify, you should:',
        options: [
            { text: 'Read success stories from people who tried it', score: 1, biased: true },
            { text: 'Look at controlled studies showing both successes and failures', score: 5, biased: false },
            { text: 'Ask friends who are also on the diet', score: 1, biased: true },
            { text: 'Try it yourself and see if you lose weight', score: 3, biased: false }
        ],
        explanation: 'Confirmation bias: Seeking only supporting evidence. Controlled studies with both outcomes give a more accurate picture.',
        difficulty: 4
    },
    {
        id: 'BIAS_CONFIRM_02',
        type: 'confirmation',
        scenario: 'You suspect an employee is underperforming. To evaluate fairly, you should:',
        options: [
            { text: 'Look for examples of their poor work to confirm your suspicion', score: 1, biased: true },
            { text: 'Review both their successes and failures objectively', score: 5, biased: false },
            { text: 'Ask colleagues who share your concerns', score: 1, biased: true },
            { text: 'Trust your instinct - first impressions are usually right', score: 1, biased: true }
        ],
        explanation: 'Actively looking for confirming evidence while ignoring contradicting data leads to unfair and inaccurate assessments.',
        difficulty: 5
    },

    // ========================================================================
    // AVAILABILITY HEURISTIC
    // ========================================================================
    {
        id: 'BIAS_AVAIL_01',
        type: 'availability',
        scenario: 'After seeing news about a plane crash, you\'re about to book a flight. Which is the most rational response?',
        options: [
            { text: 'Drive instead - planes seem dangerous right now', score: 1, biased: true },
            { text: 'Check airline safety statistics before deciding', score: 5, biased: false },
            { text: 'Book the flight - crashes are statistically rare', score: 4, biased: false },
            { text: 'Postpone your trip until the news dies down', score: 2, biased: true }
        ],
        explanation: 'Availability bias: Recent, vivid events (crashes) seem more likely. Statistically, flying remains far safer than driving.',
        difficulty: 4
    },
    {
        id: 'BIAS_AVAIL_02',
        type: 'availability',
        scenario: 'A friend won the lottery. This makes you feel:',
        options: [
            { text: 'More likely to win if I play too', score: 1, biased: true },
            { text: 'Happy for them, but my odds are still 1 in millions', score: 5, biased: false },
            { text: 'That luck is "going around" right now', score: 1, biased: true },
            { text: 'I should buy tickets at the same store', score: 1, biased: true }
        ],
        explanation: 'Knowing a winner makes winning feel more likely (availability). In reality, your odds remain unchanged.',
        difficulty: 3
    },

    // ========================================================================
    // FRAMING EFFECT
    // ========================================================================
    {
        id: 'BIAS_FRAME_01',
        type: 'framing',
        scenario: 'A medical treatment has a "90% survival rate" or a "10% mortality rate." These statements are:',
        options: [
            { text: 'Different - survival sounds better, so it must be safer', score: 1, biased: true },
            { text: 'Exactly the same - just framed differently', score: 5, biased: false },
            { text: 'The survival framing is more accurate', score: 1, biased: true },
            { text: 'Different procedures with different outcomes', score: 1, biased: true }
        ],
        explanation: 'Framing effect: The same information presented differently affects perception. 90% survival = 10% mortality.',
        difficulty: 3
    },
    {
        id: 'BIAS_FRAME_02',
        type: 'framing',
        scenario: 'A product is "95% fat-free" vs "contains 5% fat." Which should you choose?',
        options: [
            { text: 'The 95% fat-free one sounds healthier', score: 1, biased: true },
            { text: 'They\'re identical - compare other factors', score: 5, biased: false },
            { text: 'The 5% fat is more honest, so that company is trustworthy', score: 2, biased: true },
            { text: 'Need more information about the actual fat content', score: 3, biased: false }
        ],
        explanation: 'Same product, different framing. Decision should be based on actual nutritional content, not wording.',
        difficulty: 3
    },

    // ========================================================================
    // BANDWAGON EFFECT
    // ========================================================================
    {
        id: 'BIAS_BAND_01',
        type: 'bandwagon',
        scenario: 'A cryptocurrency has gained 500% because "everyone is buying it." You should:',
        options: [
            { text: 'Buy now before you miss out on more gains', score: 1, biased: true },
            { text: 'Research fundamentals before investing', score: 5, biased: false },
            { text: 'Follow the crowd - they must know something', score: 1, biased: true },
            { text: 'Wait for even more people to buy, then join', score: 1, biased: true }
        ],
        explanation: 'Bandwagon effect: Assuming something is good because many people do it. Popularity ≠ value.',
        difficulty: 4
    },
    {
        id: 'BIAS_BAND_02',
        type: 'bandwagon',
        scenario: 'Everyone in your office uses a particular app for productivity. You find a different app that works better for you. What should you do?',
        options: [
            { text: 'Switch to what everyone else uses to fit in', score: 1, biased: true },
            { text: 'Use what works best for your needs', score: 5, biased: false },
            { text: 'Use both to avoid conflict', score: 2, biased: true },
            { text: 'Assume the popular one must be better', score: 1, biased: true }
        ],
        explanation: 'The best tool depends on your specific needs, not what\'s popular. Conformity isn\'t always optimal.',
        difficulty: 3
    },

    // ========================================================================
    // HINDSIGHT BIAS
    // ========================================================================
    {
        id: 'BIAS_HIND_01',
        type: 'hindsight',
        scenario: 'A startup that everyone initially dismissed becomes a billion-dollar company. Many now claim "I always knew they would succeed." This is:',
        options: [
            { text: 'Probably true - some people have good instincts', score: 1, biased: true },
            { text: 'Likely hindsight bias - outcomes seem obvious after they happen', score: 5, biased: false },
            { text: 'A sign those people should become investors', score: 1, biased: true },
            { text: 'Proof that success is predictable', score: 1, biased: true }
        ],
        explanation: 'Hindsight bias: After an outcome, people believe they "knew it all along." Prediction is actually much harder than it seems.',
        difficulty: 5
    },
    {
        id: 'BIAS_HIND_02',
        type: 'hindsight',
        scenario: 'After a project fails, a colleague says "I told you from the start this wouldn\'t work" - but they never voiced concerns. What\'s happening?',
        options: [
            { text: 'They were too afraid to speak up earlier', score: 2, biased: false },
            { text: 'Hindsight is revising their memory of their predictions', score: 5, biased: false },
            { text: 'They must have seen something others missed', score: 1, biased: true },
            { text: 'You should trust their judgment more in the future', score: 1, biased: true }
        ],
        explanation: 'Hindsight bias often makes us misremember our past predictions to align with known outcomes.',
        difficulty: 5
    },

    // ========================================================================
    // EXPANSION SET: Additional Bias Items (7 new items, one per type)
    // ========================================================================

    // ANCHORING - New
    {
        id: 'BIAS_ANCHOR_03',
        type: 'anchoring',
        scenario: 'A store lists a jacket at $400 with a "50% off" sticker showing $200. A similar jacket elsewhere costs $180. Which is the better deal?',
        options: [
            { text: 'The $200 jacket - I\'m saving 50%', score: 1, biased: true },
            { text: 'The $180 jacket - actual lower price', score: 5, biased: false },
            { text: 'The $200 jacket - higher original price means higher quality', score: 1, biased: true },
            { text: 'They\'re about the same', score: 2, biased: true }
        ],
        explanation: 'The $400 "original price" is an anchor. The actual cost matters more than the perceived discount.',
        difficulty: 4
    },

    // SUNK COST - New
    {
        id: 'BIAS_SUNK_03',
        type: 'sunk_cost',
        scenario: 'You\'ve been in a relationship for 5 years but are deeply unhappy. When considering leaving, what should matter most?',
        options: [
            { text: 'The 5 years I\'ve already invested', score: 1, biased: true },
            { text: 'My future happiness and wellbeing', score: 5, biased: false },
            { text: 'What friends and family will think', score: 2, biased: true },
            { text: 'Whether things might eventually improve', score: 3, biased: false }
        ],
        explanation: 'Time already spent cannot be recovered. Decisions should focus on future outcomes, not past investments.',
        difficulty: 6
    },

    // CONFIRMATION - New
    {
        id: 'BIAS_CONFIRM_03',
        type: 'confirmation',
        scenario: 'You\'ve formed an opinion about a political issue. To be intellectually honest, you should:',
        options: [
            { text: 'Read articles from news sources that share my view', score: 1, biased: true },
            { text: 'Actively seek out and consider opposing viewpoints', score: 5, biased: false },
            { text: 'Discuss with friends who agree with me to strengthen my argument', score: 1, biased: true },
            { text: 'Avoid the topic to prevent conflict', score: 2, biased: true }
        ],
        explanation: 'Confirmation bias is strongest on emotionally charged topics. Intellectual honesty requires engaging with opposing views.',
        difficulty: 5
    },

    // AVAILABILITY - New
    {
        id: 'BIAS_AVAIL_03',
        type: 'availability',
        scenario: 'You can think of several friends who became successful entrepreneurs. This makes you feel:',
        options: [
            { text: 'Starting a business is fairly easy and likely to succeed', score: 1, biased: true },
            { text: 'I should check actual success rates for new businesses', score: 5, biased: false },
            { text: 'I\'m surrounded by talented people, so I must be talented too', score: 2, biased: true },
            { text: 'Now is a great time to start a business', score: 1, biased: true }
        ],
        explanation: 'We remember successes more than failures (survivorship bias). Most businesses fail; easy recall of successes distorts perception.',
        difficulty: 5
    },

    // FRAMING - New
    {
        id: 'BIAS_FRAME_03',
        type: 'framing',
        scenario: 'A manager describes layoffs as "rightsizing for efficiency." An employee calls it "cutting jobs to boost profits." These are:',
        options: [
            { text: 'Different situations - one sounds positive, one negative', score: 1, biased: true },
            { text: 'The same event framed from different perspectives', score: 5, biased: false },
            { text: 'The manager is more accurate because they have more information', score: 1, biased: true },
            { text: 'The employee is more honest', score: 2, biased: false }
        ],
        explanation: 'Both describe the same action. The framing changes emotional response but not the underlying reality.',
        difficulty: 4
    },

    // BANDWAGON - New
    {
        id: 'BIAS_BAND_03',
        type: 'bandwagon',
        scenario: 'A restaurant has a long line while the one next door is empty. You should:',
        options: [
            { text: 'Join the line - so many people can\'t be wrong', score: 2, biased: true },
            { text: 'Check reviews for both and decide based on your preferences', score: 5, biased: false },
            { text: 'The empty one must have something wrong with it', score: 1, biased: true },
            { text: 'Go to the popular one - crowds indicate quality', score: 2, biased: true }
        ],
        explanation: 'Crowds can form for many reasons (timing, viral post, one good review). Your own research is more reliable.',
        difficulty: 4
    },

    // HINDSIGHT - New
    {
        id: 'BIAS_HIND_03',
        type: 'hindsight',
        scenario: 'A stock you considered buying tripled in value. Looking back, you think:',
        options: [
            { text: 'I knew it would go up - I should have trusted my instincts', score: 1, biased: true },
            { text: 'Success wasn\'t predictable; I made a reasonable decision with the info I had', score: 5, biased: false },
            { text: 'I\'ll definitely act on my hunches next time', score: 1, biased: true },
            { text: 'Missing this proves I\'m bad at investing', score: 2, biased: true }
        ],
        explanation: 'After outcomes are known, we overestimate our ability to have predicted them. Past uncertainty felt real at the time.',
        difficulty: 6
    }
];

// Utility function to select random bias items
export const selectRandomBiasItems = (count: number): BiasItem[] => {
    const shuffled = [...BIAS_ITEMS].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
};

// Get items by bias type
export const getBiasByType = (type: BiasItem['type']): BiasItem[] => {
    return BIAS_ITEMS.filter(item => item.type === type);
};
