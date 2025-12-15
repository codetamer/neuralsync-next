// Vocabulary Content for Crystallized Intelligence (Gc) Assessment
// Based on word frequency data and difficulty calibration

export interface VocabularyItem {
    id: string;
    word: string;
    definition: string;        // Correct definition
    distractors: string[];     // 3 wrong definitions
    difficulty: number;        // 1-10 based on word frequency
    discrimination: number;    // IRT discrimination parameter
}

export const VOCABULARY_ITEMS: VocabularyItem[] = [
    // ========================================================================
    // EASY (Difficulty 1-3)
    // ========================================================================
    {
        id: 'VOC_001',
        word: 'Abundant',
        definition: 'Existing in large quantities; plentiful',
        distractors: [
            'Extremely rare or scarce',
            'Moving quickly from place to place',
            'Related to water or aquatic life'
        ],
        difficulty: 1,
        discrimination: 0.8
    },
    {
        id: 'VOC_002',
        word: 'Candid',
        definition: 'Truthful and straightforward; frank',
        distractors: [
            'Secretly planning something harmful',
            'Sweet and sugary in taste',
            'Relating to photographic lighting'
        ],
        difficulty: 2,
        discrimination: 0.9
    },
    {
        id: 'VOC_003',
        word: 'Diligent',
        definition: 'Showing careful and persistent effort',
        distractors: [
            'Careless and inattentive',
            'Related to legal proceedings',
            'Having a pleasant smell'
        ],
        difficulty: 2,
        discrimination: 0.9
    },
    {
        id: 'VOC_004',
        word: 'Elated',
        definition: 'Extremely happy and excited',
        distractors: [
            'Slightly annoyed',
            'Extended or stretched out',
            'Related to electricity'
        ],
        difficulty: 2,
        discrimination: 0.8
    },
    {
        id: 'VOC_005',
        word: 'Frugal',
        definition: 'Sparing or economical with money or resources',
        distractors: [
            'Generous and extravagant',
            'Relating to fruit',
            'Fragile and easily broken'
        ],
        difficulty: 3,
        discrimination: 1.0
    },

    // ========================================================================
    // MEDIUM (Difficulty 4-6)
    // ========================================================================
    {
        id: 'VOC_006',
        word: 'Ephemeral',
        definition: 'Lasting for a very short time',
        distractors: [
            'Related to the study of insects',
            'Extremely beautiful or ethereal',
            'Causing drowsiness'
        ],
        difficulty: 5,
        discrimination: 1.2
    },
    {
        id: 'VOC_007',
        word: 'Ambiguous',
        definition: 'Open to more than one interpretation; unclear',
        distractors: [
            'Able to use both hands equally well',
            'Having strong goals and determination',
            'Walking slowly without purpose'
        ],
        difficulty: 4,
        discrimination: 1.1
    },
    {
        id: 'VOC_008',
        word: 'Pragmatic',
        definition: 'Dealing with things sensibly and realistically',
        distractors: [
            'Related to dramatic theater',
            'Extremely idealistic',
            'Automatic and mechanical'
        ],
        difficulty: 5,
        discrimination: 1.3
    },
    {
        id: 'VOC_009',
        word: 'Tenacious',
        definition: 'Holding firmly to something; persistent',
        distractors: [
            'Easily giving up',
            'Related to living in tents',
            'Having multiple tentacles'
        ],
        difficulty: 5,
        discrimination: 1.2
    },
    {
        id: 'VOC_010',
        word: 'Benevolent',
        definition: 'Well-meaning and kindly',
        distractors: [
            'Evil or malicious',
            'Related to volcanic activity',
            'Financially successful'
        ],
        difficulty: 4,
        discrimination: 1.0
    },
    {
        id: 'VOC_011',
        word: 'Ubiquitous',
        definition: 'Present, appearing, or found everywhere',
        distractors: [
            'Extremely rare and unique',
            'Related to university education',
            'Having a single purpose'
        ],
        difficulty: 6,
        discrimination: 1.4
    },
    {
        id: 'VOC_012',
        word: 'Conundrum',
        definition: 'A confusing and difficult problem or question',
        distractors: [
            'A type of musical instrument',
            'A large gathering of people',
            'A mathematical formula'
        ],
        difficulty: 5,
        discrimination: 1.2
    },
    {
        id: 'VOC_013',
        word: 'Disparate',
        definition: 'Essentially different in kind; not comparable',
        distractors: [
            'Sad and hopeless',
            'Separated by distance',
            'Showing disrespect'
        ],
        difficulty: 6,
        discrimination: 1.3
    },
    {
        id: 'VOC_014',
        word: 'Meticulous',
        definition: 'Showing great attention to detail; very careful',
        distractors: [
            'Relating to measurements',
            'Excessively strict about rules',
            'Having a metallic quality'
        ],
        difficulty: 5,
        discrimination: 1.1
    },
    {
        id: 'VOC_015',
        word: 'Quintessential',
        definition: 'Representing the most perfect example of something',
        distractors: [
            'Having five parts or elements',
            'Related to questioning',
            'Essential for survival'
        ],
        difficulty: 6,
        discrimination: 1.4
    },

    // ========================================================================
    // HARD (Difficulty 7-8)
    // ========================================================================
    {
        id: 'VOC_016',
        word: 'Sycophant',
        definition: 'A person who flatters someone important for personal gain',
        distractors: [
            'A type of musical instrument',
            'A person who studies ancient languages',
            'A harmful parasite'
        ],
        difficulty: 7,
        discrimination: 1.5
    },
    {
        id: 'VOC_017',
        word: 'Obsequious',
        definition: 'Obedient or attentive to an excessive degree',
        distractors: [
            'Following in a sequence',
            'Related to funeral ceremonies',
            'Frequently asking questions'
        ],
        difficulty: 8,
        discrimination: 1.6
    },
    {
        id: 'VOC_018',
        word: 'Perfunctory',
        definition: 'Carried out with minimum effort; routine',
        distractors: [
            'Perfect in every way',
            'Relating to perfume manufacturing',
            'Fully functional and working'
        ],
        difficulty: 7,
        discrimination: 1.5
    },
    {
        id: 'VOC_019',
        word: 'Vicarious',
        definition: 'Experienced through imaginative participation in another person\'s experience',
        distractors: [
            'Evil or wicked',
            'Related to a vicar or clergy',
            'Changing frequently'
        ],
        difficulty: 7,
        discrimination: 1.4
    },
    {
        id: 'VOC_020',
        word: 'Enervate',
        definition: 'To cause someone to feel drained of energy',
        distractors: [
            'To energize or invigorate',
            'To supply with nerves',
            'To irritate or annoy'
        ],
        difficulty: 8,
        discrimination: 1.7
    },
    {
        id: 'VOC_021',
        word: 'Laconic',
        definition: 'Using very few words; brief and to the point',
        distractors: [
            'Related to lakes or bodies of water',
            'Lacking energy or enthusiasm',
            'Sarcastic or ironic'
        ],
        difficulty: 7,
        discrimination: 1.5
    },
    {
        id: 'VOC_022',
        word: 'Pernicious',
        definition: 'Having a harmful effect, especially gradually',
        distractors: [
            'Extremely precise or accurate',
            'Relating to permanence',
            'Overly particular about details'
        ],
        difficulty: 8,
        discrimination: 1.6
    },
    {
        id: 'VOC_023',
        word: 'Sanguine',
        definition: 'Optimistic and positive, especially in a bad situation',
        distractors: [
            'Related to blood or bloodshed',
            'Having a sandy texture',
            'Wise and experienced'
        ],
        difficulty: 7,
        discrimination: 1.5
    },

    // ========================================================================
    // EXPERT (Difficulty 9-10)
    // ========================================================================
    {
        id: 'VOC_024',
        word: 'Sesquipedalian',
        definition: 'Characterized by long words; long-winded',
        distractors: [
            'Related to 150-year anniversaries',
            'Moving on two feet',
            'Having six equal parts'
        ],
        difficulty: 9,
        discrimination: 1.8
    },
    {
        id: 'VOC_025',
        word: 'Perspicacious',
        definition: 'Having keen mental perception and understanding',
        distractors: [
            'Excessively sweating',
            'Clearly visible or obvious',
            'Persistently continuing'
        ],
        difficulty: 9,
        discrimination: 1.8
    },
    {
        id: 'VOC_026',
        word: 'Pusillanimous',
        definition: 'Showing a lack of courage; timid',
        distractors: [
            'Full of pus or infection',
            'Having many small parts',
            'Relating to cats'
        ],
        difficulty: 9,
        discrimination: 1.7
    },
    {
        id: 'VOC_027',
        word: 'Loquacious',
        definition: 'Tending to talk a great deal; talkative',
        distractors: [
            'Located in a specific place',
            'Moving slowly and carefully',
            'Related to logical reasoning'
        ],
        difficulty: 7,
        discrimination: 1.4
    },
    {
        id: 'VOC_028',
        word: 'Ostentatious',
        definition: 'Characterized by vulgar or pretentious display',
        distractors: [
            'Related to bone structure',
            'Causing tension or discomfort',
            'Preliminary or tentative'
        ],
        difficulty: 7,
        discrimination: 1.5
    },
    {
        id: 'VOC_029',
        word: 'Recalcitrant',
        definition: 'Stubbornly resistant to authority or control',
        distractors: [
            'Able to be calculated',
            'Repeatedly calling out',
            'Related to calcium'
        ],
        difficulty: 8,
        discrimination: 1.6
    },
    {
        id: 'VOC_030',
        word: 'Supercilious',
        definition: 'Behaving as if one is superior to others',
        distractors: [
            'Located above the ceiling',
            'Extremely silly or foolish',
            'Related to eyebrows'
        ],
        difficulty: 8,
        discrimination: 1.6
    },

    // ========================================================================
    // EXPANSION SET: 20 Additional Vocabulary Items (VOC_031-VOC_050)
    // ========================================================================

    // EASY (Difficulty 1-3) - 5 new items
    {
        id: 'VOC_031',
        word: 'Resilient',
        definition: 'Able to recover quickly from difficulties',
        distractors: [
            'Easily broken or damaged',
            'Related to silence or quietness',
            'Having a pleasant smell'
        ],
        difficulty: 2,
        discrimination: 0.9
    },
    {
        id: 'VOC_032',
        word: 'Mundane',
        definition: 'Lacking interest or excitement; ordinary',
        distractors: [
            'Related to the moon',
            'Clean and tidy',
            'Worldly in a sophisticated way'
        ],
        difficulty: 3,
        discrimination: 1.0
    },
    {
        id: 'VOC_033',
        word: 'Verbose',
        definition: 'Using more words than necessary',
        distractors: [
            'Related to verbs in grammar',
            'Spoken aloud rather than written',
            'Extremely brief'
        ],
        difficulty: 3,
        discrimination: 1.0
    },
    {
        id: 'VOC_034',
        word: 'Prudent',
        definition: 'Acting with or showing care for the future',
        distractors: [
            'Excessively proud',
            'Related to pruning plants',
            'Overly cautious to a fault'
        ],
        difficulty: 3,
        discrimination: 1.0
    },
    {
        id: 'VOC_035',
        word: 'Lucid',
        definition: 'Clear and easy to understand',
        distractors: [
            'Related to luck or fortune',
            'Shining brightly',
            'Occurring during sleep'
        ],
        difficulty: 3,
        discrimination: 0.9
    },

    // MEDIUM (Difficulty 4-6) - 7 new items
    {
        id: 'VOC_036',
        word: 'Fastidious',
        definition: 'Attentive to detail; very concerned about accuracy',
        distractors: [
            'Moving quickly',
            'Relating to fasting or hunger',
            'Easily disgusted'
        ],
        difficulty: 6,
        discrimination: 1.3
    },
    {
        id: 'VOC_037',
        word: 'Capricious',
        definition: 'Given to sudden changes of mood or behavior',
        distractors: [
            'Related to goats',
            'Extremely cautious',
            'Having a large capacity'
        ],
        difficulty: 6,
        discrimination: 1.4
    },
    {
        id: 'VOC_038',
        word: 'Prolific',
        definition: 'Producing great quantities or results',
        distractors: [
            'Against something',
            'Professional in manner',
            'Slow and methodical'
        ],
        difficulty: 4,
        discrimination: 1.1
    },
    {
        id: 'VOC_039',
        word: 'Innocuous',
        definition: 'Not harmful or offensive',
        distractors: [
            'Lacking knowledge',
            'Not able to be occupied',
            'Extremely dangerous'
        ],
        difficulty: 5,
        discrimination: 1.2
    },
    {
        id: 'VOC_040',
        word: 'Penchant',
        definition: 'A strong liking or tendency',
        distractors: [
            'A type of pendant jewelry',
            'A fence or enclosure',
            'A pencil case'
        ],
        difficulty: 5,
        discrimination: 1.2
    },
    {
        id: 'VOC_041',
        word: 'Nonchalant',
        definition: 'Appearing casually calm and relaxed',
        distractors: [
            'Not challenging or difficult',
            'Refusing to comply',
            'Having no charge or cost'
        ],
        difficulty: 4,
        discrimination: 1.1
    },
    {
        id: 'VOC_042',
        word: 'Altruistic',
        definition: 'Showing selfless concern for others',
        distractors: [
            'Related to high altitude',
            'Focused on alternative solutions',
            'Extremely artistic'
        ],
        difficulty: 5,
        discrimination: 1.2
    },

    // HARD (Difficulty 7-8) - 5 new items
    {
        id: 'VOC_043',
        word: 'Insidious',
        definition: 'Proceeding harmfully in a subtle way',
        distractors: [
            'Located on the inside',
            'Having insight or wisdom',
            'Lacking in sincerity'
        ],
        difficulty: 7,
        discrimination: 1.5
    },
    {
        id: 'VOC_044',
        word: 'Egregious',
        definition: 'Outstandingly bad; shocking',
        distractors: [
            'Related to eagles',
            'Living in a group',
            'Extremely eager'
        ],
        difficulty: 7,
        discrimination: 1.5
    },
    {
        id: 'VOC_045',
        word: 'Magnanimous',
        definition: 'Generous or forgiving, especially toward rivals',
        distractors: [
            'Related to magnets',
            'Very large in size',
            'Possessing great wealth'
        ],
        difficulty: 7,
        discrimination: 1.4
    },
    {
        id: 'VOC_046',
        word: 'Surreptitious',
        definition: 'Kept secret, especially because improper',
        distractors: [
            'Related to surrender',
            'Extremely repetitive',
            'Having surplus resources'
        ],
        difficulty: 8,
        discrimination: 1.6
    },
    {
        id: 'VOC_047',
        word: 'Desultory',
        definition: 'Lacking a plan, purpose, or enthusiasm',
        distractors: [
            'Related to desserts',
            'Insulting or offensive',
            'Resulting from something'
        ],
        difficulty: 8,
        discrimination: 1.6
    },

    // EXPERT (Difficulty 9-10) - 3 new items
    {
        id: 'VOC_048',
        word: 'Ineffable',
        definition: 'Too great or extreme to be expressed in words',
        distractors: [
            'Not able to fail',
            'Lacking in effect',
            'Impossible to achieve'
        ],
        difficulty: 9,
        discrimination: 1.8
    },
    {
        id: 'VOC_049',
        word: 'Solipsistic',
        definition: 'Characterized by extreme self-centeredness',
        distractors: [
            'Related to solar energy',
            'Seeking solitude',
            'Moving in a circular pattern'
        ],
        difficulty: 10,
        discrimination: 2.0
    },
    {
        id: 'VOC_050',
        word: 'Otiose',
        definition: 'Serving no practical purpose; pointless',
        distractors: [
            'Related to the ear',
            'Extremely active and busy',
            'Having eight parts'
        ],
        difficulty: 10,
        discrimination: 2.0
    }
];

// Utility function to get items by difficulty range
export const getVocabularyByDifficulty = (minDiff: number, maxDiff: number): VocabularyItem[] => {
    return VOCABULARY_ITEMS.filter(item => item.difficulty >= minDiff && item.difficulty <= maxDiff);
};
