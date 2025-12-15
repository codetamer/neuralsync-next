// Pre-built Matrix Puzzles Library
// Hand-crafted puzzles with validated difficulty levels

import {
    MatrixPuzzle,
    MatrixCell,
    Shape,
    MATRIX_COLORS,
    createShape,
    createCell,
    createEmptyCell,
} from '../types/matrix';

// ============================================================================
// HELPER FUNCTIONS FOR PUZZLE CREATION
// ============================================================================

const c = MATRIX_COLORS; // Shorthand

function makeCell(shapes: Partial<Shape>[]): MatrixCell {
    return createCell(shapes.map((s, i) => createShape(s.type || 'circle', s)));
}

function empty(): MatrixCell {
    return createEmptyCell();
}

// ============================================================================
// LEVEL 1-3: BASIC PROGRESSION PUZZLES
// ============================================================================

export const MATRIX_PUZZLES: MatrixPuzzle[] = [
    // PUZZLE 1: Dot Count Progression (Very Easy)
    {
        id: 'GF_001',
        category: 'progression',
        difficulty: 1,
        discrimination: 0.8,
        explanation: 'The number of dots increases by 1 across each row: 1 → 2 → 3.',
        rules: [{ type: 'progression', property: 'count', direction: 'row', step: 1 }],
        grid: [
            [
                makeCell([{ type: 'dot', color: c.primary, position: 'center', size: 'md' }]),
                makeCell([
                    { type: 'dot', color: c.primary, position: 'left', size: 'md' },
                    { type: 'dot', color: c.primary, position: 'right', size: 'md' },
                ]),
                makeCell([
                    { type: 'dot', color: c.primary, position: 'top', size: 'md' },
                    { type: 'dot', color: c.primary, position: 'bottom-left', size: 'md' },
                    { type: 'dot', color: c.primary, position: 'bottom-right', size: 'md' },
                ]),
            ],
            [
                makeCell([{ type: 'dot', color: c.secondary, position: 'center', size: 'md' }]),
                makeCell([
                    { type: 'dot', color: c.secondary, position: 'left', size: 'md' },
                    { type: 'dot', color: c.secondary, position: 'right', size: 'md' },
                ]),
                makeCell([
                    { type: 'dot', color: c.secondary, position: 'top', size: 'md' },
                    { type: 'dot', color: c.secondary, position: 'bottom-left', size: 'md' },
                    { type: 'dot', color: c.secondary, position: 'bottom-right', size: 'md' },
                ]),
            ],
            [
                makeCell([{ type: 'dot', color: c.accent, position: 'center', size: 'md' }]),
                makeCell([
                    { type: 'dot', color: c.accent, position: 'left', size: 'md' },
                    { type: 'dot', color: c.accent, position: 'right', size: 'md' },
                ]),
                empty(), // Question cell
            ],
        ],
        options: [
            // Correct: 3 dots
            makeCell([
                { type: 'dot', color: c.accent, position: 'top', size: 'md' },
                { type: 'dot', color: c.accent, position: 'bottom-left', size: 'md' },
                { type: 'dot', color: c.accent, position: 'bottom-right', size: 'md' },
            ]),
            // Wrong: 4 dots
            makeCell([
                { type: 'dot', color: c.accent, position: 'top-left', size: 'md' },
                { type: 'dot', color: c.accent, position: 'top-right', size: 'md' },
                { type: 'dot', color: c.accent, position: 'bottom-left', size: 'md' },
                { type: 'dot', color: c.accent, position: 'bottom-right', size: 'md' },
            ]),
            // Wrong: 2 dots
            makeCell([
                { type: 'dot', color: c.accent, position: 'left', size: 'md' },
                { type: 'dot', color: c.accent, position: 'right', size: 'md' },
            ]),
            // Wrong: 1 dot
            makeCell([{ type: 'dot', color: c.accent, position: 'center', size: 'md' }]),
            // Wrong: wrong color
            makeCell([
                { type: 'dot', color: c.primary, position: 'top', size: 'md' },
                { type: 'dot', color: c.primary, position: 'bottom-left', size: 'md' },
                { type: 'dot', color: c.primary, position: 'bottom-right', size: 'md' },
            ]),
            // Wrong: squares instead
            makeCell([
                { type: 'square', color: c.accent, position: 'top', size: 'sm' },
                { type: 'square', color: c.accent, position: 'bottom-left', size: 'sm' },
                { type: 'square', color: c.accent, position: 'bottom-right', size: 'sm' },
            ]),
        ],
        correctIndex: 0,
    },

    // PUZZLE 2: Size Progression (Easy)
    {
        id: 'GF_002',
        category: 'progression',
        difficulty: 2,
        discrimination: 0.9,
        explanation: 'Circle size increases across each row: small → medium → large.',
        rules: [{ type: 'progression', property: 'size', direction: 'row', step: 1 }],
        grid: [
            [
                makeCell([{ type: 'circle', color: c.primary, size: 'sm', fill: 'solid' }]),
                makeCell([{ type: 'circle', color: c.primary, size: 'md', fill: 'solid' }]),
                makeCell([{ type: 'circle', color: c.primary, size: 'lg', fill: 'solid' }]),
            ],
            [
                makeCell([{ type: 'square', color: c.secondary, size: 'sm', fill: 'solid' }]),
                makeCell([{ type: 'square', color: c.secondary, size: 'md', fill: 'solid' }]),
                makeCell([{ type: 'square', color: c.secondary, size: 'lg', fill: 'solid' }]),
            ],
            [
                makeCell([{ type: 'triangle', color: c.accent, size: 'sm', fill: 'solid' }]),
                makeCell([{ type: 'triangle', color: c.accent, size: 'md', fill: 'solid' }]),
                empty(),
            ],
        ],
        options: [
            makeCell([{ type: 'triangle', color: c.accent, size: 'lg', fill: 'solid' }]), // Correct
            makeCell([{ type: 'triangle', color: c.accent, size: 'sm', fill: 'solid' }]),
            makeCell([{ type: 'triangle', color: c.accent, size: 'md', fill: 'solid' }]),
            makeCell([{ type: 'circle', color: c.accent, size: 'lg', fill: 'solid' }]),
            makeCell([{ type: 'triangle', color: c.primary, size: 'lg', fill: 'solid' }]),
            makeCell([{ type: 'triangle', color: c.accent, size: 'lg', fill: 'outline' }]),
        ],
        correctIndex: 0,
    },

    // PUZZLE 3: Rotation (Easy-Medium)
    {
        id: 'GF_003',
        category: 'rotation',
        difficulty: 3,
        discrimination: 1.0,
        explanation: 'Arrow rotates 90° clockwise across each row.',
        rules: [{ type: 'rotation', degrees: 90, direction: 'row' }],
        grid: [
            [
                makeCell([{ type: 'arrow', color: c.primary, size: 'lg', rotation: 0 }]),   // Up
                makeCell([{ type: 'arrow', color: c.primary, size: 'lg', rotation: 90 }]),  // Right
                makeCell([{ type: 'arrow', color: c.primary, size: 'lg', rotation: 180 }]), // Down
            ],
            [
                makeCell([{ type: 'arrow', color: c.secondary, size: 'lg', rotation: 90 }]),  // Right
                makeCell([{ type: 'arrow', color: c.secondary, size: 'lg', rotation: 180 }]), // Down
                makeCell([{ type: 'arrow', color: c.secondary, size: 'lg', rotation: 270 }]), // Left
            ],
            [
                makeCell([{ type: 'arrow', color: c.accent, size: 'lg', rotation: 180 }]), // Down
                makeCell([{ type: 'arrow', color: c.accent, size: 'lg', rotation: 270 }]), // Left
                empty(),
            ],
        ],
        options: [
            makeCell([{ type: 'arrow', color: c.accent, size: 'lg', rotation: 0 }]),   // Correct: Up (360 = 0)
            makeCell([{ type: 'arrow', color: c.accent, size: 'lg', rotation: 90 }]),  // Right
            makeCell([{ type: 'arrow', color: c.accent, size: 'lg', rotation: 180 }]), // Down
            makeCell([{ type: 'arrow', color: c.accent, size: 'lg', rotation: 270 }]), // Left
            makeCell([{ type: 'arrow', color: c.primary, size: 'lg', rotation: 0 }]),  // Wrong color
            makeCell([{ type: 'line', color: c.accent, size: 'lg', rotation: 0 }]),    // Wrong shape
        ],
        correctIndex: 0,
    },

    // PUZZLE 4: Distribution / Latin Square (Medium)
    {
        id: 'GF_004',
        category: 'distribution',
        difficulty: 4,
        discrimination: 1.1,
        explanation: 'Each row and column contains exactly one circle, one square, and one triangle.',
        rules: [{ type: 'distribution', elements: ['circle', 'square', 'triangle'], scope: 'both' }],
        grid: [
            [
                makeCell([{ type: 'circle', color: c.primary, size: 'md', fill: 'solid' }]),
                makeCell([{ type: 'square', color: c.secondary, size: 'md', fill: 'solid' }]),
                makeCell([{ type: 'triangle', color: c.accent, size: 'md', fill: 'solid' }]),
            ],
            [
                makeCell([{ type: 'triangle', color: c.accent, size: 'md', fill: 'solid' }]),
                makeCell([{ type: 'circle', color: c.primary, size: 'md', fill: 'solid' }]),
                makeCell([{ type: 'square', color: c.secondary, size: 'md', fill: 'solid' }]),
            ],
            [
                makeCell([{ type: 'square', color: c.secondary, size: 'md', fill: 'solid' }]),
                makeCell([{ type: 'triangle', color: c.accent, size: 'md', fill: 'solid' }]),
                empty(),
            ],
        ],
        options: [
            makeCell([{ type: 'circle', color: c.primary, size: 'md', fill: 'solid' }]),   // Correct
            makeCell([{ type: 'square', color: c.secondary, size: 'md', fill: 'solid' }]),
            makeCell([{ type: 'triangle', color: c.accent, size: 'md', fill: 'solid' }]),
            makeCell([{ type: 'diamond', color: c.primary, size: 'md', fill: 'solid' }]),
            makeCell([{ type: 'circle', color: c.secondary, size: 'md', fill: 'solid' }]), // Wrong color
            makeCell([{ type: 'circle', color: c.primary, size: 'sm', fill: 'solid' }]),   // Wrong size
        ],
        correctIndex: 0,
    },

    // PUZZLE 5: Fill Alternation (Medium)
    {
        id: 'GF_005',
        category: 'progression',
        difficulty: 5,
        discrimination: 1.2,
        explanation: 'Fill alternates: solid → outline → solid across each row.',
        rules: [{ type: 'negation', direction: 'row' }],
        grid: [
            [
                makeCell([{ type: 'circle', color: c.primary, size: 'md', fill: 'solid' }]),
                makeCell([{ type: 'circle', color: c.primary, size: 'md', fill: 'outline' }]),
                makeCell([{ type: 'circle', color: c.primary, size: 'md', fill: 'solid' }]),
            ],
            [
                makeCell([{ type: 'square', color: c.secondary, size: 'md', fill: 'solid' }]),
                makeCell([{ type: 'square', color: c.secondary, size: 'md', fill: 'outline' }]),
                makeCell([{ type: 'square', color: c.secondary, size: 'md', fill: 'solid' }]),
            ],
            [
                makeCell([{ type: 'triangle', color: c.accent, size: 'md', fill: 'solid' }]),
                makeCell([{ type: 'triangle', color: c.accent, size: 'md', fill: 'outline' }]),
                empty(),
            ],
        ],
        options: [
            makeCell([{ type: 'triangle', color: c.accent, size: 'md', fill: 'solid' }]),   // Correct
            makeCell([{ type: 'triangle', color: c.accent, size: 'md', fill: 'outline' }]),
            makeCell([{ type: 'triangle', color: c.accent, size: 'md', fill: 'striped' }]),
            makeCell([{ type: 'circle', color: c.accent, size: 'md', fill: 'solid' }]),
            makeCell([{ type: 'triangle', color: c.primary, size: 'md', fill: 'solid' }]),
            makeCell([{ type: 'triangle', color: c.accent, size: 'lg', fill: 'solid' }]),
        ],
        correctIndex: 0,
    },

    // PUZZLE 6: Overlay Addition (Medium-Hard)
    {
        id: 'GF_006',
        category: 'overlay',
        difficulty: 6,
        discrimination: 1.4,
        explanation: 'First cell + Second cell = Third cell. Shapes combine in the third column.',
        rules: [{ type: 'overlay', operation: 'add', direction: 'row' }],
        grid: [
            [
                makeCell([{ type: 'line', color: c.primary, size: 'lg', rotation: 90 }]),   // Vertical
                makeCell([{ type: 'line', color: c.primary, size: 'lg', rotation: 0 }]),    // Horizontal
                makeCell([{ type: 'cross', color: c.primary, size: 'lg' }]),                 // Cross (V + H)
            ],
            [
                makeCell([{ type: 'circle', color: c.secondary, size: 'md', fill: 'outline' }]),
                makeCell([{ type: 'dot', color: c.secondary, size: 'sm' }]),
                makeCell([
                    { type: 'circle', color: c.secondary, size: 'md', fill: 'outline' },
                    { type: 'dot', color: c.secondary, size: 'sm' },
                ]),
            ],
            [
                makeCell([{ type: 'square', color: c.accent, size: 'md', fill: 'outline' }]),
                makeCell([{ type: 'triangle', color: c.accent, size: 'sm', position: 'center' }]),
                empty(),
            ],
        ],
        options: [
            // Correct: Square outline + Triangle inside
            makeCell([
                { type: 'square', color: c.accent, size: 'md', fill: 'outline' },
                { type: 'triangle', color: c.accent, size: 'sm', position: 'center' },
            ]),
            // Wrong: Just square
            makeCell([{ type: 'square', color: c.accent, size: 'md', fill: 'outline' }]),
            // Wrong: Just triangle
            makeCell([{ type: 'triangle', color: c.accent, size: 'sm' }]),
            // Wrong: Filled square + triangle
            makeCell([
                { type: 'square', color: c.accent, size: 'md', fill: 'solid' },
                { type: 'triangle', color: c.accent, size: 'sm' },
            ]),
            // Wrong: Circle instead
            makeCell([
                { type: 'circle', color: c.accent, size: 'md', fill: 'outline' },
                { type: 'triangle', color: c.accent, size: 'sm' },
            ]),
            // Wrong: Wrong color
            makeCell([
                { type: 'square', color: c.primary, size: 'md', fill: 'outline' },
                { type: 'triangle', color: c.primary, size: 'sm' },
            ]),
        ],
        correctIndex: 0,
    },

    // PUZZLE 7: Multi-Rule - Rotation + Color (Hard)
    {
        id: 'GF_007',
        category: 'multi_rule',
        difficulty: 7,
        discrimination: 1.6,
        explanation: 'Arrow rotates 90° clockwise AND color changes (cyan → purple → orange) across each row.',
        rules: [
            { type: 'rotation', degrees: 90, direction: 'row' },
            { type: 'color_cycle', colors: [c.primary, c.secondary, c.accent], direction: 'row' },
        ],
        grid: [
            [
                makeCell([{ type: 'arrow', color: c.primary, size: 'lg', rotation: 0 }]),
                makeCell([{ type: 'arrow', color: c.secondary, size: 'lg', rotation: 90 }]),
                makeCell([{ type: 'arrow', color: c.accent, size: 'lg', rotation: 180 }]),
            ],
            [
                makeCell([{ type: 'arrow', color: c.primary, size: 'lg', rotation: 45 }]),
                makeCell([{ type: 'arrow', color: c.secondary, size: 'lg', rotation: 135 }]),
                makeCell([{ type: 'arrow', color: c.accent, size: 'lg', rotation: 225 }]),
            ],
            [
                makeCell([{ type: 'arrow', color: c.primary, size: 'lg', rotation: 90 }]),
                makeCell([{ type: 'arrow', color: c.secondary, size: 'lg', rotation: 180 }]),
                empty(),
            ],
        ],
        options: [
            makeCell([{ type: 'arrow', color: c.accent, size: 'lg', rotation: 270 }]),    // Correct
            makeCell([{ type: 'arrow', color: c.accent, size: 'lg', rotation: 180 }]),    // Wrong rotation
            makeCell([{ type: 'arrow', color: c.secondary, size: 'lg', rotation: 270 }]), // Wrong color
            makeCell([{ type: 'arrow', color: c.accent, size: 'lg', rotation: 0 }]),      // Wrong rotation
            makeCell([{ type: 'arrow', color: c.primary, size: 'lg', rotation: 270 }]),   // Wrong color
            makeCell([{ type: 'line', color: c.accent, size: 'lg', rotation: 270 }]),     // Wrong shape
        ],
        correctIndex: 0,
    },

    // PUZZLE 8: Complex Distribution with Multiple Properties (Hard)
    {
        id: 'GF_008',
        category: 'multi_rule',
        difficulty: 8,
        discrimination: 1.8,
        explanation: 'Each row has: circle/square/triangle AND small/medium/large AND solid/outline/striped. All unique combinations.',
        rules: [
            { type: 'distribution', elements: ['circle', 'square', 'triangle'], scope: 'row' },
        ],
        grid: [
            [
                makeCell([{ type: 'circle', color: c.primary, size: 'sm', fill: 'solid' }]),
                makeCell([{ type: 'square', color: c.primary, size: 'md', fill: 'outline' }]),
                makeCell([{ type: 'triangle', color: c.primary, size: 'lg', fill: 'striped' }]),
            ],
            [
                makeCell([{ type: 'square', color: c.secondary, size: 'lg', fill: 'solid' }]),
                makeCell([{ type: 'triangle', color: c.secondary, size: 'sm', fill: 'outline' }]),
                makeCell([{ type: 'circle', color: c.secondary, size: 'md', fill: 'striped' }]),
            ],
            [
                makeCell([{ type: 'triangle', color: c.accent, size: 'md', fill: 'solid' }]),
                makeCell([{ type: 'circle', color: c.accent, size: 'lg', fill: 'outline' }]),
                empty(),
            ],
        ],
        options: [
            makeCell([{ type: 'square', color: c.accent, size: 'sm', fill: 'striped' }]),  // Correct
            makeCell([{ type: 'square', color: c.accent, size: 'md', fill: 'striped' }]),  // Wrong size
            makeCell([{ type: 'square', color: c.accent, size: 'sm', fill: 'solid' }]),    // Wrong fill
            makeCell([{ type: 'circle', color: c.accent, size: 'sm', fill: 'striped' }]),  // Wrong shape
            makeCell([{ type: 'square', color: c.primary, size: 'sm', fill: 'striped' }]), // Wrong color
            makeCell([{ type: 'triangle', color: c.accent, size: 'sm', fill: 'striped' }]),// Wrong shape
        ],
        correctIndex: 0,
    },

    // PUZZLE 9: Nested Shapes (Very Hard)
    {
        id: 'GF_009',
        category: 'multi_rule',
        difficulty: 9,
        discrimination: 2.0,
        explanation: 'Outer shape progresses (circle → square → triangle), inner shape is always a dot. Size of outer shape increases, dot position changes.',
        rules: [
            { type: 'progression', property: 'count', direction: 'row', step: 1 },
        ],
        grid: [
            [
                makeCell([
                    { type: 'circle', color: c.primary, size: 'md', fill: 'outline' },
                    { type: 'dot', color: c.primary, size: 'xs', position: 'top-left' },
                ]),
                makeCell([
                    { type: 'circle', color: c.primary, size: 'md', fill: 'outline' },
                    { type: 'dot', color: c.primary, size: 'xs', position: 'top-left' },
                    { type: 'dot', color: c.primary, size: 'xs', position: 'top-right' },
                ]),
                makeCell([
                    { type: 'circle', color: c.primary, size: 'md', fill: 'outline' },
                    { type: 'dot', color: c.primary, size: 'xs', position: 'top-left' },
                    { type: 'dot', color: c.primary, size: 'xs', position: 'top-right' },
                    { type: 'dot', color: c.primary, size: 'xs', position: 'bottom-left' },
                ]),
            ],
            [
                makeCell([
                    { type: 'square', color: c.secondary, size: 'md', fill: 'outline' },
                    { type: 'dot', color: c.secondary, size: 'xs', position: 'top-left' },
                ]),
                makeCell([
                    { type: 'square', color: c.secondary, size: 'md', fill: 'outline' },
                    { type: 'dot', color: c.secondary, size: 'xs', position: 'top-left' },
                    { type: 'dot', color: c.secondary, size: 'xs', position: 'top-right' },
                ]),
                makeCell([
                    { type: 'square', color: c.secondary, size: 'md', fill: 'outline' },
                    { type: 'dot', color: c.secondary, size: 'xs', position: 'top-left' },
                    { type: 'dot', color: c.secondary, size: 'xs', position: 'top-right' },
                    { type: 'dot', color: c.secondary, size: 'xs', position: 'bottom-left' },
                ]),
            ],
            [
                makeCell([
                    { type: 'triangle', color: c.accent, size: 'md', fill: 'outline' },
                    { type: 'dot', color: c.accent, size: 'xs', position: 'top-left' },
                ]),
                makeCell([
                    { type: 'triangle', color: c.accent, size: 'md', fill: 'outline' },
                    { type: 'dot', color: c.accent, size: 'xs', position: 'top-left' },
                    { type: 'dot', color: c.accent, size: 'xs', position: 'top-right' },
                ]),
                empty(),
            ],
        ],
        options: [
            // Correct: Triangle with 3 dots
            makeCell([
                { type: 'triangle', color: c.accent, size: 'md', fill: 'outline' },
                { type: 'dot', color: c.accent, size: 'xs', position: 'top-left' },
                { type: 'dot', color: c.accent, size: 'xs', position: 'top-right' },
                { type: 'dot', color: c.accent, size: 'xs', position: 'bottom-left' },
            ]),
            // Wrong: Only 2 dots
            makeCell([
                { type: 'triangle', color: c.accent, size: 'md', fill: 'outline' },
                { type: 'dot', color: c.accent, size: 'xs', position: 'top-left' },
                { type: 'dot', color: c.accent, size: 'xs', position: 'top-right' },
            ]),
            // Wrong: 4 dots
            makeCell([
                { type: 'triangle', color: c.accent, size: 'md', fill: 'outline' },
                { type: 'dot', color: c.accent, size: 'xs', position: 'top-left' },
                { type: 'dot', color: c.accent, size: 'xs', position: 'top-right' },
                { type: 'dot', color: c.accent, size: 'xs', position: 'bottom-left' },
                { type: 'dot', color: c.accent, size: 'xs', position: 'bottom-right' },
            ]),
            // Wrong: Square instead
            makeCell([
                { type: 'square', color: c.accent, size: 'md', fill: 'outline' },
                { type: 'dot', color: c.accent, size: 'xs', position: 'top-left' },
                { type: 'dot', color: c.accent, size: 'xs', position: 'top-right' },
                { type: 'dot', color: c.accent, size: 'xs', position: 'bottom-left' },
            ]),
            // Wrong: Filled triangle
            makeCell([
                { type: 'triangle', color: c.accent, size: 'md', fill: 'solid' },
                { type: 'dot', color: c.white, size: 'xs', position: 'top-left' },
                { type: 'dot', color: c.white, size: 'xs', position: 'top-right' },
                { type: 'dot', color: c.white, size: 'xs', position: 'bottom-left' },
            ]),
            // Wrong: Wrong color
            makeCell([
                { type: 'triangle', color: c.primary, size: 'md', fill: 'outline' },
                { type: 'dot', color: c.primary, size: 'xs', position: 'top-left' },
                { type: 'dot', color: c.primary, size: 'xs', position: 'top-right' },
                { type: 'dot', color: c.primary, size: 'xs', position: 'bottom-left' },
            ]),
        ],
        correctIndex: 0,
    },

    // PUZZLE 10: Ultimate Challenge (Expert)
    {
        id: 'GF_010',
        category: 'conditional',
        difficulty: 10,
        discrimination: 2.2,
        explanation: 'Three rules combine: Shape type cycles (●→■→▲), fill cycles (solid→outline→dotted), AND size increases within each row.',
        rules: [
            { type: 'distribution', elements: ['circle', 'square', 'triangle'], scope: 'row' },
            { type: 'progression', property: 'size', direction: 'row', step: 1 },
        ],
        grid: [
            [
                makeCell([{ type: 'circle', color: c.primary, size: 'sm', fill: 'solid' }]),
                makeCell([{ type: 'square', color: c.primary, size: 'md', fill: 'outline' }]),
                makeCell([{ type: 'triangle', color: c.primary, size: 'lg', fill: 'dotted' }]),
            ],
            [
                makeCell([{ type: 'square', color: c.secondary, size: 'sm', fill: 'solid' }]),
                makeCell([{ type: 'triangle', color: c.secondary, size: 'md', fill: 'outline' }]),
                makeCell([{ type: 'circle', color: c.secondary, size: 'lg', fill: 'dotted' }]),
            ],
            [
                makeCell([{ type: 'triangle', color: c.accent, size: 'sm', fill: 'solid' }]),
                makeCell([{ type: 'circle', color: c.accent, size: 'md', fill: 'outline' }]),
                empty(),
            ],
        ],
        options: [
            makeCell([{ type: 'square', color: c.accent, size: 'lg', fill: 'dotted' }]),   // Correct
            makeCell([{ type: 'square', color: c.accent, size: 'lg', fill: 'solid' }]),    // Wrong fill
            makeCell([{ type: 'square', color: c.accent, size: 'md', fill: 'dotted' }]),   // Wrong size
            makeCell([{ type: 'triangle', color: c.accent, size: 'lg', fill: 'dotted' }]), // Wrong shape
            makeCell([{ type: 'square', color: c.primary, size: 'lg', fill: 'dotted' }]),  // Wrong color
            makeCell([{ type: 'circle', color: c.accent, size: 'lg', fill: 'dotted' }]),   // Wrong shape
        ],
        correctIndex: 0,
    },

    // ============================================================================
    // PUZZLES 11-20: ADDITIONAL VARIETY
    // ============================================================================

    // PUZZLE 11: Column-based progression (Easy-Medium)
    {
        id: 'GF_011',
        category: 'progression',
        difficulty: 3,
        discrimination: 1.0,
        explanation: 'The number of shapes increases going down each column: 1 → 2 → 3.',
        rules: [{ type: 'progression', property: 'count', direction: 'col', step: 1 }],
        grid: [
            [
                makeCell([{ type: 'star', color: c.primary, size: 'md' }]),
                makeCell([{ type: 'hexagon', color: c.secondary, size: 'md' }]),
                makeCell([{ type: 'diamond', color: c.accent, size: 'md' }]),
            ],
            [
                makeCell([
                    { type: 'star', color: c.primary, size: 'sm', position: 'left' },
                    { type: 'star', color: c.primary, size: 'sm', position: 'right' },
                ]),
                makeCell([
                    { type: 'hexagon', color: c.secondary, size: 'sm', position: 'left' },
                    { type: 'hexagon', color: c.secondary, size: 'sm', position: 'right' },
                ]),
                makeCell([
                    { type: 'diamond', color: c.accent, size: 'sm', position: 'left' },
                    { type: 'diamond', color: c.accent, size: 'sm', position: 'right' },
                ]),
            ],
            [
                makeCell([
                    { type: 'star', color: c.primary, size: 'sm', position: 'top' },
                    { type: 'star', color: c.primary, size: 'sm', position: 'bottom-left' },
                    { type: 'star', color: c.primary, size: 'sm', position: 'bottom-right' },
                ]),
                makeCell([
                    { type: 'hexagon', color: c.secondary, size: 'sm', position: 'top' },
                    { type: 'hexagon', color: c.secondary, size: 'sm', position: 'bottom-left' },
                    { type: 'hexagon', color: c.secondary, size: 'sm', position: 'bottom-right' },
                ]),
                empty(),
            ],
        ],
        options: [
            makeCell([
                { type: 'diamond', color: c.accent, size: 'sm', position: 'top' },
                { type: 'diamond', color: c.accent, size: 'sm', position: 'bottom-left' },
                { type: 'diamond', color: c.accent, size: 'sm', position: 'bottom-right' },
            ]),
            makeCell([
                { type: 'diamond', color: c.accent, size: 'sm', position: 'left' },
                { type: 'diamond', color: c.accent, size: 'sm', position: 'right' },
            ]),
            makeCell([{ type: 'diamond', color: c.accent, size: 'md' }]),
            makeCell([
                { type: 'star', color: c.accent, size: 'sm', position: 'top' },
                { type: 'star', color: c.accent, size: 'sm', position: 'bottom-left' },
                { type: 'star', color: c.accent, size: 'sm', position: 'bottom-right' },
            ]),
            makeCell([
                { type: 'diamond', color: c.primary, size: 'sm', position: 'top' },
                { type: 'diamond', color: c.primary, size: 'sm', position: 'bottom-left' },
                { type: 'diamond', color: c.primary, size: 'sm', position: 'bottom-right' },
            ]),
            makeCell([
                { type: 'diamond', color: c.accent, size: 'sm', position: 'top-left' },
                { type: 'diamond', color: c.accent, size: 'sm', position: 'top-right' },
                { type: 'diamond', color: c.accent, size: 'sm', position: 'bottom-left' },
                { type: 'diamond', color: c.accent, size: 'sm', position: 'bottom-right' },
            ]),
        ],
        correctIndex: 0,
    },

    // PUZZLE 12: 45-degree rotation (Medium)
    {
        id: 'GF_012',
        category: 'rotation',
        difficulty: 4,
        discrimination: 1.1,
        explanation: 'Line rotates 45° clockwise across each row.',
        rules: [{ type: 'rotation', degrees: 45, direction: 'row' }],
        grid: [
            [
                makeCell([{ type: 'line', color: c.primary, size: 'lg', rotation: 0 }]),
                makeCell([{ type: 'line', color: c.primary, size: 'lg', rotation: 45 }]),
                makeCell([{ type: 'line', color: c.primary, size: 'lg', rotation: 90 }]),
            ],
            [
                makeCell([{ type: 'line', color: c.secondary, size: 'lg', rotation: 45 }]),
                makeCell([{ type: 'line', color: c.secondary, size: 'lg', rotation: 90 }]),
                makeCell([{ type: 'line', color: c.secondary, size: 'lg', rotation: 135 }]),
            ],
            [
                makeCell([{ type: 'line', color: c.accent, size: 'lg', rotation: 90 }]),
                makeCell([{ type: 'line', color: c.accent, size: 'lg', rotation: 135 }]),
                empty(),
            ],
        ],
        options: [
            makeCell([{ type: 'line', color: c.accent, size: 'lg', rotation: 180 }]),
            makeCell([{ type: 'line', color: c.accent, size: 'lg', rotation: 135 }]),
            makeCell([{ type: 'line', color: c.accent, size: 'lg', rotation: 90 }]),
            makeCell([{ type: 'line', color: c.accent, size: 'lg', rotation: 45 }]),
            makeCell([{ type: 'line', color: c.primary, size: 'lg', rotation: 180 }]),
            makeCell([{ type: 'arrow', color: c.accent, size: 'lg', rotation: 180 }]),
        ],
        correctIndex: 0,
    },

    // PUZZLE 13: Shape and color distribution (Medium)
    {
        id: 'GF_013',
        category: 'distribution',
        difficulty: 5,
        discrimination: 1.2,
        explanation: 'Each shape appears once per row. Each color appears once per column.',
        rules: [{ type: 'distribution', elements: ['circle', 'square', 'triangle'], scope: 'both' }],
        grid: [
            [
                makeCell([{ type: 'circle', color: c.primary, size: 'md', fill: 'solid' }]),
                makeCell([{ type: 'triangle', color: c.secondary, size: 'md', fill: 'solid' }]),
                makeCell([{ type: 'square', color: c.accent, size: 'md', fill: 'solid' }]),
            ],
            [
                makeCell([{ type: 'square', color: c.secondary, size: 'md', fill: 'solid' }]),
                makeCell([{ type: 'circle', color: c.accent, size: 'md', fill: 'solid' }]),
                makeCell([{ type: 'triangle', color: c.primary, size: 'md', fill: 'solid' }]),
            ],
            [
                makeCell([{ type: 'triangle', color: c.accent, size: 'md', fill: 'solid' }]),
                makeCell([{ type: 'square', color: c.primary, size: 'md', fill: 'solid' }]),
                empty(),
            ],
        ],
        options: [
            makeCell([{ type: 'circle', color: c.secondary, size: 'md', fill: 'solid' }]),
            makeCell([{ type: 'circle', color: c.primary, size: 'md', fill: 'solid' }]),
            makeCell([{ type: 'circle', color: c.accent, size: 'md', fill: 'solid' }]),
            makeCell([{ type: 'square', color: c.secondary, size: 'md', fill: 'solid' }]),
            makeCell([{ type: 'triangle', color: c.secondary, size: 'md', fill: 'solid' }]),
            makeCell([{ type: 'circle', color: c.secondary, size: 'md', fill: 'outline' }]),
        ],
        correctIndex: 0,
    },

    // PUZZLE 14: Decreasing opacity (Easy)
    {
        id: 'GF_014',
        category: 'progression',
        difficulty: 2,
        discrimination: 0.9,
        explanation: 'Opacity decreases from left to right: 100% → 60% → 30%.',
        rules: [{ type: 'progression', property: 'opacity', direction: 'row', step: -1 }],
        grid: [
            [
                makeCell([{ type: 'circle', color: c.primary, size: 'lg', opacity: 1.0 }]),
                makeCell([{ type: 'circle', color: c.primary, size: 'lg', opacity: 0.6 }]),
                makeCell([{ type: 'circle', color: c.primary, size: 'lg', opacity: 0.3 }]),
            ],
            [
                makeCell([{ type: 'square', color: c.secondary, size: 'lg', opacity: 1.0 }]),
                makeCell([{ type: 'square', color: c.secondary, size: 'lg', opacity: 0.6 }]),
                makeCell([{ type: 'square', color: c.secondary, size: 'lg', opacity: 0.3 }]),
            ],
            [
                makeCell([{ type: 'diamond', color: c.accent, size: 'lg', opacity: 1.0 }]),
                makeCell([{ type: 'diamond', color: c.accent, size: 'lg', opacity: 0.6 }]),
                empty(),
            ],
        ],
        options: [
            makeCell([{ type: 'diamond', color: c.accent, size: 'lg', opacity: 0.3 }]),
            makeCell([{ type: 'diamond', color: c.accent, size: 'lg', opacity: 1.0 }]),
            makeCell([{ type: 'diamond', color: c.accent, size: 'lg', opacity: 0.6 }]),
            makeCell([{ type: 'circle', color: c.accent, size: 'lg', opacity: 0.3 }]),
            makeCell([{ type: 'diamond', color: c.primary, size: 'lg', opacity: 0.3 }]),
            makeCell([{ type: 'diamond', color: c.accent, size: 'sm', opacity: 0.3 }]),
        ],
        correctIndex: 0,
    },

    // PUZZLE 15: Pentagon rotation cycle (Medium)
    {
        id: 'GF_015',
        category: 'rotation',
        difficulty: 5,
        discrimination: 1.3,
        explanation: 'Pentagon rotates 72° (360°/5) clockwise each step.',
        rules: [{ type: 'rotation', degrees: 72, direction: 'row' }],
        grid: [
            [
                makeCell([{ type: 'pentagon', color: c.primary, size: 'lg', rotation: 0 }]),
                makeCell([{ type: 'pentagon', color: c.primary, size: 'lg', rotation: 72 }]),
                makeCell([{ type: 'pentagon', color: c.primary, size: 'lg', rotation: 144 }]),
            ],
            [
                makeCell([{ type: 'pentagon', color: c.secondary, size: 'lg', rotation: 72 }]),
                makeCell([{ type: 'pentagon', color: c.secondary, size: 'lg', rotation: 144 }]),
                makeCell([{ type: 'pentagon', color: c.secondary, size: 'lg', rotation: 216 }]),
            ],
            [
                makeCell([{ type: 'pentagon', color: c.accent, size: 'lg', rotation: 144 }]),
                makeCell([{ type: 'pentagon', color: c.accent, size: 'lg', rotation: 216 }]),
                empty(),
            ],
        ],
        options: [
            makeCell([{ type: 'pentagon', color: c.accent, size: 'lg', rotation: 288 }]),
            makeCell([{ type: 'pentagon', color: c.accent, size: 'lg', rotation: 0 }]),
            makeCell([{ type: 'pentagon', color: c.accent, size: 'lg', rotation: 216 }]),
            makeCell([{ type: 'pentagon', color: c.accent, size: 'lg', rotation: 144 }]),
            makeCell([{ type: 'hexagon', color: c.accent, size: 'lg', rotation: 288 }]),
            makeCell([{ type: 'pentagon', color: c.primary, size: 'lg', rotation: 288 }]),
        ],
        correctIndex: 0,
    },

    // PUZZLE 16: Fill type cycle (Medium)
    {
        id: 'GF_016',
        category: 'progression',
        difficulty: 4,
        discrimination: 1.1,
        explanation: 'Fill type cycles: outline → solid → striped across each row.',
        rules: [{ type: 'negation', direction: 'row' }],
        grid: [
            [
                makeCell([{ type: 'hexagon', color: c.primary, size: 'md', fill: 'outline' }]),
                makeCell([{ type: 'hexagon', color: c.primary, size: 'md', fill: 'solid' }]),
                makeCell([{ type: 'hexagon', color: c.primary, size: 'md', fill: 'striped' }]),
            ],
            [
                makeCell([{ type: 'hexagon', color: c.secondary, size: 'md', fill: 'outline' }]),
                makeCell([{ type: 'hexagon', color: c.secondary, size: 'md', fill: 'solid' }]),
                makeCell([{ type: 'hexagon', color: c.secondary, size: 'md', fill: 'striped' }]),
            ],
            [
                makeCell([{ type: 'hexagon', color: c.accent, size: 'md', fill: 'outline' }]),
                makeCell([{ type: 'hexagon', color: c.accent, size: 'md', fill: 'solid' }]),
                empty(),
            ],
        ],
        options: [
            makeCell([{ type: 'hexagon', color: c.accent, size: 'md', fill: 'striped' }]),
            makeCell([{ type: 'hexagon', color: c.accent, size: 'md', fill: 'outline' }]),
            makeCell([{ type: 'hexagon', color: c.accent, size: 'md', fill: 'solid' }]),
            makeCell([{ type: 'hexagon', color: c.accent, size: 'md', fill: 'dotted' }]),
            makeCell([{ type: 'pentagon', color: c.accent, size: 'md', fill: 'striped' }]),
            makeCell([{ type: 'hexagon', color: c.primary, size: 'md', fill: 'striped' }]),
        ],
        correctIndex: 0,
    },

    // PUZZLE 17: XOR overlay (Hard)
    {
        id: 'GF_017',
        category: 'overlay',
        difficulty: 7,
        discrimination: 1.5,
        explanation: 'Elements in first two cells XOR to produce third: overlapping parts disappear.',
        rules: [{ type: 'overlay', operation: 'xor', direction: 'row' }],
        grid: [
            [
                makeCell([
                    { type: 'line', color: c.primary, size: 'lg', rotation: 0 },
                    { type: 'line', color: c.primary, size: 'lg', rotation: 90 },
                ]),
                makeCell([{ type: 'line', color: c.primary, size: 'lg', rotation: 90 }]),
                makeCell([{ type: 'line', color: c.primary, size: 'lg', rotation: 0 }]),
            ],
            [
                makeCell([
                    { type: 'circle', color: c.secondary, size: 'md', fill: 'outline' },
                    { type: 'dot', color: c.secondary, size: 'sm' },
                ]),
                makeCell([{ type: 'dot', color: c.secondary, size: 'sm' }]),
                makeCell([{ type: 'circle', color: c.secondary, size: 'md', fill: 'outline' }]),
            ],
            [
                makeCell([
                    { type: 'square', color: c.accent, size: 'md', fill: 'outline' },
                    { type: 'triangle', color: c.accent, size: 'sm' },
                ]),
                makeCell([{ type: 'square', color: c.accent, size: 'md', fill: 'outline' }]),
                empty(),
            ],
        ],
        options: [
            makeCell([{ type: 'triangle', color: c.accent, size: 'sm' }]),
            makeCell([{ type: 'square', color: c.accent, size: 'md', fill: 'outline' }]),
            makeCell([
                { type: 'square', color: c.accent, size: 'md', fill: 'outline' },
                { type: 'triangle', color: c.accent, size: 'sm' },
            ]),
            makeCell([{ type: 'triangle', color: c.accent, size: 'md' }]),
            makeCell([{ type: 'triangle', color: c.primary, size: 'sm' }]),
            makeCell([{ type: 'diamond', color: c.accent, size: 'sm' }]),
        ],
        correctIndex: 0,
    },

    // PUZZLE 18: Dual progression (Hard)
    {
        id: 'GF_018',
        category: 'multi_rule',
        difficulty: 6,
        discrimination: 1.4,
        explanation: 'Size increases across rows (S→M→L) AND count increases down columns (1→2→3).',
        rules: [
            { type: 'progression', property: 'size', direction: 'row', step: 1 },
            { type: 'progression', property: 'count', direction: 'col', step: 1 },
        ],
        grid: [
            [
                makeCell([{ type: 'star', color: c.primary, size: 'sm' }]),
                makeCell([{ type: 'star', color: c.primary, size: 'md' }]),
                makeCell([{ type: 'star', color: c.primary, size: 'lg' }]),
            ],
            [
                makeCell([
                    { type: 'star', color: c.secondary, size: 'sm', position: 'left' },
                    { type: 'star', color: c.secondary, size: 'sm', position: 'right' },
                ]),
                makeCell([
                    { type: 'star', color: c.secondary, size: 'md', position: 'left' },
                    { type: 'star', color: c.secondary, size: 'md', position: 'right' },
                ]),
                makeCell([
                    { type: 'star', color: c.secondary, size: 'lg', position: 'left' },
                    { type: 'star', color: c.secondary, size: 'lg', position: 'right' },
                ]),
            ],
            [
                makeCell([
                    { type: 'star', color: c.accent, size: 'sm', position: 'top' },
                    { type: 'star', color: c.accent, size: 'sm', position: 'bottom-left' },
                    { type: 'star', color: c.accent, size: 'sm', position: 'bottom-right' },
                ]),
                makeCell([
                    { type: 'star', color: c.accent, size: 'md', position: 'top' },
                    { type: 'star', color: c.accent, size: 'md', position: 'bottom-left' },
                    { type: 'star', color: c.accent, size: 'md', position: 'bottom-right' },
                ]),
                empty(),
            ],
        ],
        options: [
            makeCell([
                { type: 'star', color: c.accent, size: 'lg', position: 'top' },
                { type: 'star', color: c.accent, size: 'lg', position: 'bottom-left' },
                { type: 'star', color: c.accent, size: 'lg', position: 'bottom-right' },
            ]),
            makeCell([
                { type: 'star', color: c.accent, size: 'md', position: 'top' },
                { type: 'star', color: c.accent, size: 'md', position: 'bottom-left' },
                { type: 'star', color: c.accent, size: 'md', position: 'bottom-right' },
            ]),
            makeCell([
                { type: 'star', color: c.accent, size: 'lg', position: 'left' },
                { type: 'star', color: c.accent, size: 'lg', position: 'right' },
            ]),
            makeCell([{ type: 'star', color: c.accent, size: 'lg' }]),
            makeCell([
                { type: 'star', color: c.primary, size: 'lg', position: 'top' },
                { type: 'star', color: c.primary, size: 'lg', position: 'bottom-left' },
                { type: 'star', color: c.primary, size: 'lg', position: 'bottom-right' },
            ]),
            makeCell([
                { type: 'hexagon', color: c.accent, size: 'lg', position: 'top' },
                { type: 'hexagon', color: c.accent, size: 'lg', position: 'bottom-left' },
                { type: 'hexagon', color: c.accent, size: 'lg', position: 'bottom-right' },
            ]),
        ],
        correctIndex: 0,
    },

    // PUZZLE 19: Mirror symmetry (Hard)
    {
        id: 'GF_019',
        category: 'multi_rule',
        difficulty: 8,
        discrimination: 1.7,
        explanation: 'Row 3 is a horizontal mirror of Row 1. The shape flips horizontally.',
        rules: [{ type: 'rotation', degrees: 180, direction: 'col' }],
        grid: [
            [
                makeCell([{ type: 'arrow', color: c.primary, size: 'lg', rotation: 45 }]),
                makeCell([{ type: 'arrow', color: c.primary, size: 'lg', rotation: 0 }]),
                makeCell([{ type: 'arrow', color: c.primary, size: 'lg', rotation: 315 }]),
            ],
            [
                makeCell([{ type: 'arrow', color: c.secondary, size: 'lg', rotation: 90 }]),
                makeCell([{ type: 'dot', color: c.secondary, size: 'lg' }]),
                makeCell([{ type: 'arrow', color: c.secondary, size: 'lg', rotation: 270 }]),
            ],
            [
                makeCell([{ type: 'arrow', color: c.accent, size: 'lg', rotation: 135 }]),
                makeCell([{ type: 'arrow', color: c.accent, size: 'lg', rotation: 180 }]),
                empty(),
            ],
        ],
        options: [
            makeCell([{ type: 'arrow', color: c.accent, size: 'lg', rotation: 225 }]),
            makeCell([{ type: 'arrow', color: c.accent, size: 'lg', rotation: 315 }]),
            makeCell([{ type: 'arrow', color: c.accent, size: 'lg', rotation: 180 }]),
            makeCell([{ type: 'arrow', color: c.accent, size: 'lg', rotation: 135 }]),
            makeCell([{ type: 'arrow', color: c.primary, size: 'lg', rotation: 225 }]),
            makeCell([{ type: 'arrow', color: c.accent, size: 'lg', rotation: 270 }]),
        ],
        correctIndex: 0,
    },

    // PUZZLE 20: Alternating shapes per diagonal (Very Hard)
    {
        id: 'GF_020',
        category: 'conditional',
        difficulty: 9,
        discrimination: 1.9,
        explanation: 'Main diagonal: circles. Anti-diagonal: triangles. Others: squares. Colors follow row order.',
        rules: [{ type: 'conditional', condition: { property: 'position', value: 'diagonal' }, thenApply: { type: 'distribution', elements: ['circle'], scope: 'row' }, elseApply: { type: 'distribution', elements: ['square'], scope: 'row' } }],
        grid: [
            [
                makeCell([{ type: 'circle', color: c.primary, size: 'md', fill: 'solid' }]),
                makeCell([{ type: 'square', color: c.primary, size: 'md', fill: 'solid' }]),
                makeCell([{ type: 'triangle', color: c.primary, size: 'md', fill: 'solid' }]),
            ],
            [
                makeCell([{ type: 'square', color: c.secondary, size: 'md', fill: 'solid' }]),
                makeCell([{ type: 'circle', color: c.secondary, size: 'md', fill: 'solid' }]),
                makeCell([{ type: 'square', color: c.secondary, size: 'md', fill: 'solid' }]),
            ],
            [
                makeCell([{ type: 'triangle', color: c.accent, size: 'md', fill: 'solid' }]),
                makeCell([{ type: 'square', color: c.accent, size: 'md', fill: 'solid' }]),
                empty(),
            ],
        ],
        options: [
            makeCell([{ type: 'circle', color: c.accent, size: 'md', fill: 'solid' }]),
            makeCell([{ type: 'triangle', color: c.accent, size: 'md', fill: 'solid' }]),
            makeCell([{ type: 'square', color: c.accent, size: 'md', fill: 'solid' }]),
            makeCell([{ type: 'diamond', color: c.accent, size: 'md', fill: 'solid' }]),
            makeCell([{ type: 'circle', color: c.primary, size: 'md', fill: 'solid' }]),
            makeCell([{ type: 'circle', color: c.accent, size: 'md', fill: 'outline' }]),
        ],
        correctIndex: 0,
    },

    // ============================================================================
    // PUZZLES 21-30: ADVANCED PATTERNS
    // ============================================================================

    // PUZZLE 21: Shape morphing (Easy)
    {
        id: 'GF_021',
        category: 'progression',
        difficulty: 2,
        discrimination: 0.9,
        explanation: 'Shapes progress: circle → square → triangle across each row.',
        rules: [{ type: 'distribution', elements: ['circle', 'square', 'triangle'], scope: 'row' }],
        grid: [
            [
                makeCell([{ type: 'circle', color: c.primary, size: 'md', fill: 'solid' }]),
                makeCell([{ type: 'square', color: c.primary, size: 'md', fill: 'solid' }]),
                makeCell([{ type: 'triangle', color: c.primary, size: 'md', fill: 'solid' }]),
            ],
            [
                makeCell([{ type: 'circle', color: c.secondary, size: 'md', fill: 'solid' }]),
                makeCell([{ type: 'square', color: c.secondary, size: 'md', fill: 'solid' }]),
                makeCell([{ type: 'triangle', color: c.secondary, size: 'md', fill: 'solid' }]),
            ],
            [
                makeCell([{ type: 'circle', color: c.accent, size: 'md', fill: 'solid' }]),
                makeCell([{ type: 'square', color: c.accent, size: 'md', fill: 'solid' }]),
                empty(),
            ],
        ],
        options: [
            makeCell([{ type: 'triangle', color: c.accent, size: 'md', fill: 'solid' }]),
            makeCell([{ type: 'circle', color: c.accent, size: 'md', fill: 'solid' }]),
            makeCell([{ type: 'square', color: c.accent, size: 'md', fill: 'solid' }]),
            makeCell([{ type: 'diamond', color: c.accent, size: 'md', fill: 'solid' }]),
            makeCell([{ type: 'triangle', color: c.primary, size: 'md', fill: 'solid' }]),
            makeCell([{ type: 'triangle', color: c.accent, size: 'md', fill: 'outline' }]),
        ],
        correctIndex: 0,
    },

    // PUZZLE 22: Concentric shapes (Medium)
    {
        id: 'GF_022',
        category: 'overlay',
        difficulty: 5,
        discrimination: 1.3,
        explanation: 'Number of concentric rings increases: 1 → 2 → 3.',
        rules: [{ type: 'progression', property: 'count', direction: 'row', step: 1 }],
        grid: [
            [
                makeCell([{ type: 'circle', color: c.primary, size: 'lg', fill: 'outline' }]),
                makeCell([
                    { type: 'circle', color: c.primary, size: 'lg', fill: 'outline' },
                    { type: 'circle', color: c.primary, size: 'md', fill: 'outline' },
                ]),
                makeCell([
                    { type: 'circle', color: c.primary, size: 'lg', fill: 'outline' },
                    { type: 'circle', color: c.primary, size: 'md', fill: 'outline' },
                    { type: 'circle', color: c.primary, size: 'sm', fill: 'outline' },
                ]),
            ],
            [
                makeCell([{ type: 'square', color: c.secondary, size: 'lg', fill: 'outline' }]),
                makeCell([
                    { type: 'square', color: c.secondary, size: 'lg', fill: 'outline' },
                    { type: 'square', color: c.secondary, size: 'md', fill: 'outline' },
                ]),
                makeCell([
                    { type: 'square', color: c.secondary, size: 'lg', fill: 'outline' },
                    { type: 'square', color: c.secondary, size: 'md', fill: 'outline' },
                    { type: 'square', color: c.secondary, size: 'sm', fill: 'outline' },
                ]),
            ],
            [
                makeCell([{ type: 'triangle', color: c.accent, size: 'lg', fill: 'outline' }]),
                makeCell([
                    { type: 'triangle', color: c.accent, size: 'lg', fill: 'outline' },
                    { type: 'triangle', color: c.accent, size: 'md', fill: 'outline' },
                ]),
                empty(),
            ],
        ],
        options: [
            makeCell([
                { type: 'triangle', color: c.accent, size: 'lg', fill: 'outline' },
                { type: 'triangle', color: c.accent, size: 'md', fill: 'outline' },
                { type: 'triangle', color: c.accent, size: 'sm', fill: 'outline' },
            ]),
            makeCell([
                { type: 'triangle', color: c.accent, size: 'lg', fill: 'outline' },
                { type: 'triangle', color: c.accent, size: 'md', fill: 'outline' },
            ]),
            makeCell([{ type: 'triangle', color: c.accent, size: 'lg', fill: 'outline' }]),
            makeCell([
                { type: 'circle', color: c.accent, size: 'lg', fill: 'outline' },
                { type: 'circle', color: c.accent, size: 'md', fill: 'outline' },
                { type: 'circle', color: c.accent, size: 'sm', fill: 'outline' },
            ]),
            makeCell([
                { type: 'triangle', color: c.primary, size: 'lg', fill: 'outline' },
                { type: 'triangle', color: c.primary, size: 'md', fill: 'outline' },
                { type: 'triangle', color: c.primary, size: 'sm', fill: 'outline' },
            ]),
            makeCell([
                { type: 'triangle', color: c.accent, size: 'lg', fill: 'solid' },
                { type: 'triangle', color: c.accent, size: 'md', fill: 'solid' },
                { type: 'triangle', color: c.accent, size: 'sm', fill: 'solid' },
            ]),
        ],
        correctIndex: 0,
    },

    // PUZZLE 23: 180-degree rotation (Easy-Medium)
    {
        id: 'GF_023',
        category: 'rotation',
        difficulty: 3,
        discrimination: 1.0,
        explanation: 'Arrow alternates between up (0°) and down (180°) across each row.',
        rules: [{ type: 'rotation', degrees: 180, direction: 'row' }],
        grid: [
            [
                makeCell([{ type: 'arrow', color: c.primary, size: 'lg', rotation: 0 }]),
                makeCell([{ type: 'arrow', color: c.primary, size: 'lg', rotation: 180 }]),
                makeCell([{ type: 'arrow', color: c.primary, size: 'lg', rotation: 0 }]),
            ],
            [
                makeCell([{ type: 'arrow', color: c.secondary, size: 'lg', rotation: 90 }]),
                makeCell([{ type: 'arrow', color: c.secondary, size: 'lg', rotation: 270 }]),
                makeCell([{ type: 'arrow', color: c.secondary, size: 'lg', rotation: 90 }]),
            ],
            [
                makeCell([{ type: 'arrow', color: c.accent, size: 'lg', rotation: 45 }]),
                makeCell([{ type: 'arrow', color: c.accent, size: 'lg', rotation: 225 }]),
                empty(),
            ],
        ],
        options: [
            makeCell([{ type: 'arrow', color: c.accent, size: 'lg', rotation: 45 }]),
            makeCell([{ type: 'arrow', color: c.accent, size: 'lg', rotation: 225 }]),
            makeCell([{ type: 'arrow', color: c.accent, size: 'lg', rotation: 0 }]),
            makeCell([{ type: 'arrow', color: c.accent, size: 'lg', rotation: 180 }]),
            makeCell([{ type: 'arrow', color: c.primary, size: 'lg', rotation: 45 }]),
            makeCell([{ type: 'line', color: c.accent, size: 'lg', rotation: 45 }]),
        ],
        correctIndex: 0,
    },

    // PUZZLE 24: Size + fill combination (Medium-Hard)
    {
        id: 'GF_024',
        category: 'multi_rule',
        difficulty: 6,
        discrimination: 1.4,
        explanation: 'Size increases left-to-right. Fill cycles: solid → outline → striped down columns.',
        rules: [
            { type: 'progression', property: 'size', direction: 'row', step: 1 },
            { type: 'negation', direction: 'col' },
        ],
        grid: [
            [
                makeCell([{ type: 'circle', color: c.primary, size: 'sm', fill: 'solid' }]),
                makeCell([{ type: 'circle', color: c.primary, size: 'md', fill: 'solid' }]),
                makeCell([{ type: 'circle', color: c.primary, size: 'lg', fill: 'solid' }]),
            ],
            [
                makeCell([{ type: 'circle', color: c.secondary, size: 'sm', fill: 'outline' }]),
                makeCell([{ type: 'circle', color: c.secondary, size: 'md', fill: 'outline' }]),
                makeCell([{ type: 'circle', color: c.secondary, size: 'lg', fill: 'outline' }]),
            ],
            [
                makeCell([{ type: 'circle', color: c.accent, size: 'sm', fill: 'striped' }]),
                makeCell([{ type: 'circle', color: c.accent, size: 'md', fill: 'striped' }]),
                empty(),
            ],
        ],
        options: [
            makeCell([{ type: 'circle', color: c.accent, size: 'lg', fill: 'striped' }]),
            makeCell([{ type: 'circle', color: c.accent, size: 'lg', fill: 'solid' }]),
            makeCell([{ type: 'circle', color: c.accent, size: 'lg', fill: 'outline' }]),
            makeCell([{ type: 'circle', color: c.accent, size: 'md', fill: 'striped' }]),
            makeCell([{ type: 'square', color: c.accent, size: 'lg', fill: 'striped' }]),
            makeCell([{ type: 'circle', color: c.primary, size: 'lg', fill: 'striped' }]),
        ],
        correctIndex: 0,
    },

    // PUZZLE 25: Subtraction overlay (Hard)
    {
        id: 'GF_025',
        category: 'overlay',
        difficulty: 7,
        discrimination: 1.6,
        explanation: 'Third cell = First cell minus Second cell (remove common elements).',
        rules: [{ type: 'overlay', operation: 'subtract', direction: 'row' }],
        grid: [
            [
                makeCell([
                    { type: 'circle', color: c.primary, size: 'md', fill: 'outline' },
                    { type: 'dot', color: c.primary, size: 'sm' },
                    { type: 'cross', color: c.primary, size: 'xs', position: 'top-right' },
                ]),
                makeCell([{ type: 'dot', color: c.primary, size: 'sm' }]),
                makeCell([
                    { type: 'circle', color: c.primary, size: 'md', fill: 'outline' },
                    { type: 'cross', color: c.primary, size: 'xs', position: 'top-right' },
                ]),
            ],
            [
                makeCell([
                    { type: 'square', color: c.secondary, size: 'md', fill: 'outline' },
                    { type: 'triangle', color: c.secondary, size: 'sm' },
                ]),
                makeCell([{ type: 'square', color: c.secondary, size: 'md', fill: 'outline' }]),
                makeCell([{ type: 'triangle', color: c.secondary, size: 'sm' }]),
            ],
            [
                makeCell([
                    { type: 'hexagon', color: c.accent, size: 'md', fill: 'outline' },
                    { type: 'star', color: c.accent, size: 'sm' },
                    { type: 'dot', color: c.accent, size: 'xs', position: 'top-left' },
                ]),
                makeCell([
                    { type: 'star', color: c.accent, size: 'sm' },
                    { type: 'dot', color: c.accent, size: 'xs', position: 'top-left' },
                ]),
                empty(),
            ],
        ],
        options: [
            makeCell([{ type: 'hexagon', color: c.accent, size: 'md', fill: 'outline' }]),
            makeCell([{ type: 'star', color: c.accent, size: 'sm' }]),
            makeCell([{ type: 'dot', color: c.accent, size: 'xs' }]),
            makeCell([
                { type: 'hexagon', color: c.accent, size: 'md', fill: 'outline' },
                { type: 'star', color: c.accent, size: 'sm' },
            ]),
            makeCell([{ type: 'hexagon', color: c.primary, size: 'md', fill: 'outline' }]),
            makeCell([{ type: 'hexagon', color: c.accent, size: 'md', fill: 'solid' }]),
        ],
        correctIndex: 0,
    },

    // PUZZLE 26: Three properties cycling independently (Very Hard)
    {
        id: 'GF_026',
        category: 'multi_rule',
        difficulty: 9,
        discrimination: 2.0,
        explanation: 'Shape cycles by row (●■▲), size cycles by column (S M L), color cycles diagonally.',
        rules: [
            { type: 'distribution', elements: ['circle', 'square', 'triangle'], scope: 'row' },
            { type: 'size_cycle', sizes: ['sm', 'md', 'lg'], direction: 'col' },
        ],
        grid: [
            [
                makeCell([{ type: 'circle', color: c.primary, size: 'sm', fill: 'solid' }]),
                makeCell([{ type: 'circle', color: c.secondary, size: 'md', fill: 'solid' }]),
                makeCell([{ type: 'circle', color: c.accent, size: 'lg', fill: 'solid' }]),
            ],
            [
                makeCell([{ type: 'square', color: c.secondary, size: 'sm', fill: 'solid' }]),
                makeCell([{ type: 'square', color: c.accent, size: 'md', fill: 'solid' }]),
                makeCell([{ type: 'square', color: c.primary, size: 'lg', fill: 'solid' }]),
            ],
            [
                makeCell([{ type: 'triangle', color: c.accent, size: 'sm', fill: 'solid' }]),
                makeCell([{ type: 'triangle', color: c.primary, size: 'md', fill: 'solid' }]),
                empty(),
            ],
        ],
        options: [
            makeCell([{ type: 'triangle', color: c.secondary, size: 'lg', fill: 'solid' }]),
            makeCell([{ type: 'triangle', color: c.primary, size: 'lg', fill: 'solid' }]),
            makeCell([{ type: 'triangle', color: c.accent, size: 'lg', fill: 'solid' }]),
            makeCell([{ type: 'circle', color: c.secondary, size: 'lg', fill: 'solid' }]),
            makeCell([{ type: 'triangle', color: c.secondary, size: 'md', fill: 'solid' }]),
            makeCell([{ type: 'triangle', color: c.secondary, size: 'lg', fill: 'outline' }]),
        ],
        correctIndex: 0,
    },

    // PUZZLE 27: Diagonal pattern (Medium)
    {
        id: 'GF_027',
        category: 'progression',
        difficulty: 5,
        discrimination: 1.3,
        explanation: 'Diagonal elements share the same shape. Each diagonal has a different shape.',
        rules: [{ type: 'distribution', elements: ['circle', 'square', 'triangle'], scope: 'both' }],
        grid: [
            [
                makeCell([{ type: 'circle', color: c.primary, size: 'md', fill: 'solid' }]),
                makeCell([{ type: 'triangle', color: c.primary, size: 'md', fill: 'solid' }]),
                makeCell([{ type: 'square', color: c.primary, size: 'md', fill: 'solid' }]),
            ],
            [
                makeCell([{ type: 'triangle', color: c.secondary, size: 'md', fill: 'solid' }]),
                makeCell([{ type: 'circle', color: c.secondary, size: 'md', fill: 'solid' }]),
                makeCell([{ type: 'triangle', color: c.secondary, size: 'md', fill: 'solid' }]),
            ],
            [
                makeCell([{ type: 'square', color: c.accent, size: 'md', fill: 'solid' }]),
                makeCell([{ type: 'triangle', color: c.accent, size: 'md', fill: 'solid' }]),
                empty(),
            ],
        ],
        options: [
            makeCell([{ type: 'circle', color: c.accent, size: 'md', fill: 'solid' }]),
            makeCell([{ type: 'square', color: c.accent, size: 'md', fill: 'solid' }]),
            makeCell([{ type: 'triangle', color: c.accent, size: 'md', fill: 'solid' }]),
            makeCell([{ type: 'diamond', color: c.accent, size: 'md', fill: 'solid' }]),
            makeCell([{ type: 'circle', color: c.primary, size: 'md', fill: 'solid' }]),
            makeCell([{ type: 'circle', color: c.accent, size: 'md', fill: 'outline' }]),
        ],
        correctIndex: 0,
    },

    // PUZZLE 28: Inverse relationship (Hard)
    {
        id: 'GF_028',
        category: 'multi_rule',
        difficulty: 7,
        discrimination: 1.5,
        explanation: 'As size increases, opacity decreases. Small=full, Medium=half, Large=faint.',
        rules: [
            { type: 'progression', property: 'size', direction: 'row', step: 1 },
            { type: 'progression', property: 'opacity', direction: 'row', step: -1 },
        ],
        grid: [
            [
                makeCell([{ type: 'circle', color: c.primary, size: 'sm', opacity: 1.0 }]),
                makeCell([{ type: 'circle', color: c.primary, size: 'md', opacity: 0.6 }]),
                makeCell([{ type: 'circle', color: c.primary, size: 'lg', opacity: 0.3 }]),
            ],
            [
                makeCell([{ type: 'square', color: c.secondary, size: 'sm', opacity: 1.0 }]),
                makeCell([{ type: 'square', color: c.secondary, size: 'md', opacity: 0.6 }]),
                makeCell([{ type: 'square', color: c.secondary, size: 'lg', opacity: 0.3 }]),
            ],
            [
                makeCell([{ type: 'triangle', color: c.accent, size: 'sm', opacity: 1.0 }]),
                makeCell([{ type: 'triangle', color: c.accent, size: 'md', opacity: 0.6 }]),
                empty(),
            ],
        ],
        options: [
            makeCell([{ type: 'triangle', color: c.accent, size: 'lg', opacity: 0.3 }]),
            makeCell([{ type: 'triangle', color: c.accent, size: 'lg', opacity: 1.0 }]),
            makeCell([{ type: 'triangle', color: c.accent, size: 'lg', opacity: 0.6 }]),
            makeCell([{ type: 'triangle', color: c.accent, size: 'md', opacity: 0.3 }]),
            makeCell([{ type: 'circle', color: c.accent, size: 'lg', opacity: 0.3 }]),
            makeCell([{ type: 'triangle', color: c.primary, size: 'lg', opacity: 0.3 }]),
        ],
        correctIndex: 0,
    },

    // PUZZLE 29: Four corners pattern (Very Hard)
    {
        id: 'GF_029',
        category: 'conditional',
        difficulty: 9,
        discrimination: 1.9,
        explanation: 'Corners of the 3x3 grid are circles. Edges (non-corner) are squares. Center is triangle.',
        rules: [{ type: 'conditional', condition: { property: 'position', value: 'corner' }, thenApply: { type: 'distribution', elements: ['circle'], scope: 'row' }, elseApply: { type: 'distribution', elements: ['square'], scope: 'row' } }],
        grid: [
            [
                makeCell([{ type: 'circle', color: c.primary, size: 'md', fill: 'solid' }]),
                makeCell([{ type: 'square', color: c.primary, size: 'md', fill: 'solid' }]),
                makeCell([{ type: 'circle', color: c.primary, size: 'md', fill: 'solid' }]),
            ],
            [
                makeCell([{ type: 'square', color: c.secondary, size: 'md', fill: 'solid' }]),
                makeCell([{ type: 'triangle', color: c.secondary, size: 'md', fill: 'solid' }]),
                makeCell([{ type: 'square', color: c.secondary, size: 'md', fill: 'solid' }]),
            ],
            [
                makeCell([{ type: 'circle', color: c.accent, size: 'md', fill: 'solid' }]),
                makeCell([{ type: 'square', color: c.accent, size: 'md', fill: 'solid' }]),
                empty(),
            ],
        ],
        options: [
            makeCell([{ type: 'circle', color: c.accent, size: 'md', fill: 'solid' }]),
            makeCell([{ type: 'square', color: c.accent, size: 'md', fill: 'solid' }]),
            makeCell([{ type: 'triangle', color: c.accent, size: 'md', fill: 'solid' }]),
            makeCell([{ type: 'diamond', color: c.accent, size: 'md', fill: 'solid' }]),
            makeCell([{ type: 'circle', color: c.primary, size: 'md', fill: 'solid' }]),
            makeCell([{ type: 'circle', color: c.accent, size: 'md', fill: 'outline' }]),
        ],
        correctIndex: 0,
    },

    // PUZZLE 30: Ultimate multi-rule (Expert)
    {
        id: 'GF_030',
        category: 'conditional',
        difficulty: 10,
        discrimination: 2.2,
        explanation: 'Four rules: Shape cycles row-wise, Size cycles col-wise, Fill alternates, Color follows (R=1, R=2, R=3).',
        rules: [
            { type: 'distribution', elements: ['circle', 'square', 'triangle'], scope: 'row' },
            { type: 'size_cycle', sizes: ['sm', 'md', 'lg'], direction: 'col' },
            { type: 'negation', direction: 'row' },
        ],
        grid: [
            [
                makeCell([{ type: 'circle', color: c.primary, size: 'sm', fill: 'solid' }]),
                makeCell([{ type: 'square', color: c.primary, size: 'md', fill: 'outline' }]),
                makeCell([{ type: 'triangle', color: c.primary, size: 'lg', fill: 'solid' }]),
            ],
            [
                makeCell([{ type: 'triangle', color: c.secondary, size: 'sm', fill: 'outline' }]),
                makeCell([{ type: 'circle', color: c.secondary, size: 'md', fill: 'solid' }]),
                makeCell([{ type: 'square', color: c.secondary, size: 'lg', fill: 'outline' }]),
            ],
            [
                makeCell([{ type: 'square', color: c.accent, size: 'sm', fill: 'solid' }]),
                makeCell([{ type: 'triangle', color: c.accent, size: 'md', fill: 'outline' }]),
                empty(),
            ],
        ],
        options: [
            makeCell([{ type: 'circle', color: c.accent, size: 'lg', fill: 'solid' }]),
            makeCell([{ type: 'circle', color: c.accent, size: 'lg', fill: 'outline' }]),
            makeCell([{ type: 'triangle', color: c.accent, size: 'lg', fill: 'solid' }]),
            makeCell([{ type: 'square', color: c.accent, size: 'lg', fill: 'solid' }]),
            makeCell([{ type: 'circle', color: c.primary, size: 'lg', fill: 'solid' }]),
            makeCell([{ type: 'circle', color: c.accent, size: 'md', fill: 'solid' }]),
        ],
        correctIndex: 0,
    },

    // ============================================================================
    // EXPANSION SET: PUZZLES 31-50 (Added for CAT precision)
    // ============================================================================

    // PUZZLE 31: Simple Color Pattern (Easy)
    {
        id: 'GF_031',
        category: 'distribution',
        difficulty: 2,
        discrimination: 0.9,
        explanation: 'Each row contains one item of each color. Missing: accent color.',
        rules: [{ type: 'distribution', elements: ['primary', 'secondary', 'accent'], scope: 'row' }],
        grid: [
            [
                makeCell([{ type: 'circle', color: c.primary, size: 'md', fill: 'solid' }]),
                makeCell([{ type: 'circle', color: c.secondary, size: 'md', fill: 'solid' }]),
                makeCell([{ type: 'circle', color: c.accent, size: 'md', fill: 'solid' }]),
            ],
            [
                makeCell([{ type: 'circle', color: c.secondary, size: 'md', fill: 'solid' }]),
                makeCell([{ type: 'circle', color: c.accent, size: 'md', fill: 'solid' }]),
                makeCell([{ type: 'circle', color: c.primary, size: 'md', fill: 'solid' }]),
            ],
            [
                makeCell([{ type: 'circle', color: c.accent, size: 'md', fill: 'solid' }]),
                makeCell([{ type: 'circle', color: c.primary, size: 'md', fill: 'solid' }]),
                empty(),
            ],
        ],
        options: [
            makeCell([{ type: 'circle', color: c.secondary, size: 'md', fill: 'solid' }]),
            makeCell([{ type: 'circle', color: c.primary, size: 'md', fill: 'solid' }]),
            makeCell([{ type: 'circle', color: c.accent, size: 'md', fill: 'solid' }]),
            makeCell([{ type: 'square', color: c.secondary, size: 'md', fill: 'solid' }]),
            makeCell([{ type: 'circle', color: c.secondary, size: 'lg', fill: 'solid' }]),
            makeCell([{ type: 'circle', color: c.secondary, size: 'md', fill: 'outline' }]),
        ],
        correctIndex: 0,
    },

    // PUZZLE 32: Diagonal Mirror (Medium)
    {
        id: 'GF_032',
        category: 'symmetry',
        difficulty: 4,
        discrimination: 1.2,
        explanation: 'The grid has diagonal symmetry. Top-left mirrors bottom-right.',
        rules: [{ type: 'symmetry', axis: 'diagonal' }],
        grid: [
            [
                makeCell([{ type: 'triangle', color: c.primary, size: 'md', rotation: 0 }]),
                makeCell([{ type: 'circle', color: c.secondary, size: 'md' }]),
                makeCell([{ type: 'square', color: c.accent, size: 'md' }]),
            ],
            [
                makeCell([{ type: 'circle', color: c.secondary, size: 'md' }]),
                makeCell([{ type: 'dot', color: c.primary, size: 'md', position: 'center' }]),
                makeCell([{ type: 'circle', color: c.secondary, size: 'md' }]),
            ],
            [
                makeCell([{ type: 'square', color: c.accent, size: 'md' }]),
                makeCell([{ type: 'circle', color: c.secondary, size: 'md' }]),
                empty(),
            ],
        ],
        options: [
            makeCell([{ type: 'triangle', color: c.primary, size: 'md', rotation: 0 }]),
            makeCell([{ type: 'triangle', color: c.primary, size: 'md', rotation: 180 }]),
            makeCell([{ type: 'square', color: c.primary, size: 'md' }]),
            makeCell([{ type: 'circle', color: c.primary, size: 'md' }]),
            makeCell([{ type: 'triangle', color: c.accent, size: 'md', rotation: 0 }]),
            makeCell([{ type: 'triangle', color: c.secondary, size: 'md', rotation: 0 }]),
        ],
        correctIndex: 0,
    },

    // PUZZLE 33: Shape Subtraction (Medium)
    {
        id: 'GF_033',
        category: 'operation',
        difficulty: 5,
        discrimination: 1.3,
        explanation: 'Third cell = First cell minus Second cell shapes. 3 shapes - 1 shape = 2 shapes.',
        rules: [{ type: 'operation', operation: 'subtraction', direction: 'row' }],
        grid: [
            [
                makeCell([
                    { type: 'dot', color: c.primary, size: 'sm', position: 'top-left' },
                    { type: 'dot', color: c.primary, size: 'sm', position: 'top-right' },
                    { type: 'dot', color: c.primary, size: 'sm', position: 'bottom-left' },
                ]),
                makeCell([{ type: 'dot', color: c.primary, size: 'sm', position: 'top-right' }]),
                makeCell([
                    { type: 'dot', color: c.primary, size: 'sm', position: 'top-left' },
                    { type: 'dot', color: c.primary, size: 'sm', position: 'bottom-left' },
                ]),
            ],
            [
                makeCell([
                    { type: 'dot', color: c.secondary, size: 'sm', position: 'center' },
                    { type: 'dot', color: c.secondary, size: 'sm', position: 'left' },
                    { type: 'dot', color: c.secondary, size: 'sm', position: 'right' },
                    { type: 'dot', color: c.secondary, size: 'sm', position: 'top' },
                ]),
                makeCell([
                    { type: 'dot', color: c.secondary, size: 'sm', position: 'center' },
                    { type: 'dot', color: c.secondary, size: 'sm', position: 'top' },
                ]),
                makeCell([
                    { type: 'dot', color: c.secondary, size: 'sm', position: 'left' },
                    { type: 'dot', color: c.secondary, size: 'sm', position: 'right' },
                ]),
            ],
            [
                makeCell([
                    { type: 'dot', color: c.accent, size: 'sm', position: 'top-left' },
                    { type: 'dot', color: c.accent, size: 'sm', position: 'top-right' },
                    { type: 'dot', color: c.accent, size: 'sm', position: 'bottom-left' },
                    { type: 'dot', color: c.accent, size: 'sm', position: 'bottom-right' },
                ]),
                makeCell([
                    { type: 'dot', color: c.accent, size: 'sm', position: 'top-left' },
                ]),
                empty(),
            ],
        ],
        options: [
            makeCell([
                { type: 'dot', color: c.accent, size: 'sm', position: 'top-right' },
                { type: 'dot', color: c.accent, size: 'sm', position: 'bottom-left' },
                { type: 'dot', color: c.accent, size: 'sm', position: 'bottom-right' },
            ]),
            makeCell([
                { type: 'dot', color: c.accent, size: 'sm', position: 'top-left' },
                { type: 'dot', color: c.accent, size: 'sm', position: 'bottom-right' },
            ]),
            makeCell([
                { type: 'dot', color: c.accent, size: 'sm', position: 'bottom-left' },
                { type: 'dot', color: c.accent, size: 'sm', position: 'bottom-right' },
            ]),
            makeCell([
                { type: 'dot', color: c.accent, size: 'sm', position: 'center' },
            ]),
            makeCell([
                { type: 'dot', color: c.primary, size: 'sm', position: 'top-right' },
                { type: 'dot', color: c.primary, size: 'sm', position: 'bottom-left' },
                { type: 'dot', color: c.primary, size: 'sm', position: 'bottom-right' },
            ]),
            makeCell([
                { type: 'square', color: c.accent, size: 'sm', position: 'center' },
            ]),
        ],
        correctIndex: 0,
    },

    // PUZZLE 34: Rotation 45° (Easy-Medium)
    {
        id: 'GF_034',
        category: 'rotation',
        difficulty: 3,
        discrimination: 1.0,
        explanation: 'Square rotates 45° each step across rows, alternating between square and diamond orientation.',
        rules: [{ type: 'rotation', degrees: 45, direction: 'row' }],
        grid: [
            [
                makeCell([{ type: 'square', color: c.primary, size: 'md', rotation: 0 }]),
                makeCell([{ type: 'square', color: c.primary, size: 'md', rotation: 45 }]),
                makeCell([{ type: 'square', color: c.primary, size: 'md', rotation: 0 }]),
            ],
            [
                makeCell([{ type: 'square', color: c.secondary, size: 'md', rotation: 45 }]),
                makeCell([{ type: 'square', color: c.secondary, size: 'md', rotation: 0 }]),
                makeCell([{ type: 'square', color: c.secondary, size: 'md', rotation: 45 }]),
            ],
            [
                makeCell([{ type: 'square', color: c.accent, size: 'md', rotation: 0 }]),
                makeCell([{ type: 'square', color: c.accent, size: 'md', rotation: 45 }]),
                empty(),
            ],
        ],
        options: [
            makeCell([{ type: 'square', color: c.accent, size: 'md', rotation: 0 }]),
            makeCell([{ type: 'square', color: c.accent, size: 'md', rotation: 45 }]),
            makeCell([{ type: 'square', color: c.accent, size: 'md', rotation: 90 }]),
            makeCell([{ type: 'circle', color: c.accent, size: 'md' }]),
            makeCell([{ type: 'square', color: c.primary, size: 'md', rotation: 0 }]),
            makeCell([{ type: 'square', color: c.accent, size: 'lg', rotation: 0 }]),
        ],
        correctIndex: 0,
    },

    // PUZZLE 35: Fill Pattern Progression (Easy)
    {
        id: 'GF_035',
        category: 'progression',
        difficulty: 2,
        discrimination: 0.8,
        explanation: 'Fill alternates: solid → outline → solid across each row.',
        rules: [{ type: 'fill_cycle', pattern: ['solid', 'outline', 'solid'], direction: 'row' }],
        grid: [
            [
                makeCell([{ type: 'circle', color: c.primary, size: 'md', fill: 'solid' }]),
                makeCell([{ type: 'circle', color: c.primary, size: 'md', fill: 'outline' }]),
                makeCell([{ type: 'circle', color: c.primary, size: 'md', fill: 'solid' }]),
            ],
            [
                makeCell([{ type: 'square', color: c.secondary, size: 'md', fill: 'solid' }]),
                makeCell([{ type: 'square', color: c.secondary, size: 'md', fill: 'outline' }]),
                makeCell([{ type: 'square', color: c.secondary, size: 'md', fill: 'solid' }]),
            ],
            [
                makeCell([{ type: 'triangle', color: c.accent, size: 'md', fill: 'solid' }]),
                makeCell([{ type: 'triangle', color: c.accent, size: 'md', fill: 'outline' }]),
                empty(),
            ],
        ],
        options: [
            makeCell([{ type: 'triangle', color: c.accent, size: 'md', fill: 'solid' }]),
            makeCell([{ type: 'triangle', color: c.accent, size: 'md', fill: 'outline' }]),
            makeCell([{ type: 'triangle', color: c.primary, size: 'md', fill: 'solid' }]),
            makeCell([{ type: 'circle', color: c.accent, size: 'md', fill: 'solid' }]),
            makeCell([{ type: 'triangle', color: c.accent, size: 'lg', fill: 'solid' }]),
            makeCell([{ type: 'square', color: c.accent, size: 'md', fill: 'solid' }]),
        ],
        correctIndex: 0,
    },

    // PUZZLE 36: Nested Shapes (Hard)
    {
        id: 'GF_036',
        category: 'nested',
        difficulty: 7,
        discrimination: 1.6,
        explanation: 'Each cell has nested shapes. Outer shape follows row pattern, inner shape follows column pattern.',
        rules: [
            { type: 'distribution', elements: ['circle', 'square', 'triangle'], scope: 'row' },
            { type: 'distribution', elements: ['circle', 'square', 'triangle'], scope: 'col' },
        ],
        grid: [
            [
                makeCell([
                    { type: 'circle', color: c.primary, size: 'lg', fill: 'outline' },
                    { type: 'circle', color: c.primary, size: 'sm', fill: 'solid' },
                ]),
                makeCell([
                    { type: 'square', color: c.primary, size: 'lg', fill: 'outline' },
                    { type: 'square', color: c.primary, size: 'sm', fill: 'solid' },
                ]),
                makeCell([
                    { type: 'triangle', color: c.primary, size: 'lg', fill: 'outline' },
                    { type: 'triangle', color: c.primary, size: 'sm', fill: 'solid' },
                ]),
            ],
            [
                makeCell([
                    { type: 'square', color: c.secondary, size: 'lg', fill: 'outline' },
                    { type: 'circle', color: c.secondary, size: 'sm', fill: 'solid' },
                ]),
                makeCell([
                    { type: 'triangle', color: c.secondary, size: 'lg', fill: 'outline' },
                    { type: 'square', color: c.secondary, size: 'sm', fill: 'solid' },
                ]),
                makeCell([
                    { type: 'circle', color: c.secondary, size: 'lg', fill: 'outline' },
                    { type: 'triangle', color: c.secondary, size: 'sm', fill: 'solid' },
                ]),
            ],
            [
                makeCell([
                    { type: 'triangle', color: c.accent, size: 'lg', fill: 'outline' },
                    { type: 'circle', color: c.accent, size: 'sm', fill: 'solid' },
                ]),
                makeCell([
                    { type: 'circle', color: c.accent, size: 'lg', fill: 'outline' },
                    { type: 'square', color: c.accent, size: 'sm', fill: 'solid' },
                ]),
                empty(),
            ],
        ],
        options: [
            makeCell([
                { type: 'square', color: c.accent, size: 'lg', fill: 'outline' },
                { type: 'triangle', color: c.accent, size: 'sm', fill: 'solid' },
            ]),
            makeCell([
                { type: 'triangle', color: c.accent, size: 'lg', fill: 'outline' },
                { type: 'triangle', color: c.accent, size: 'sm', fill: 'solid' },
            ]),
            makeCell([
                { type: 'circle', color: c.accent, size: 'lg', fill: 'outline' },
                { type: 'triangle', color: c.accent, size: 'sm', fill: 'solid' },
            ]),
            makeCell([
                { type: 'square', color: c.accent, size: 'lg', fill: 'outline' },
                { type: 'circle', color: c.accent, size: 'sm', fill: 'solid' },
            ]),
            makeCell([
                { type: 'square', color: c.primary, size: 'lg', fill: 'outline' },
                { type: 'triangle', color: c.primary, size: 'sm', fill: 'solid' },
            ]),
            makeCell([
                { type: 'square', color: c.accent, size: 'lg', fill: 'solid' },
                { type: 'triangle', color: c.accent, size: 'sm', fill: 'outline' },
            ]),
        ],
        correctIndex: 0,
    },

    // PUZZLE 37: XOR Pattern (Hard)
    {
        id: 'GF_037',
        category: 'operation',
        difficulty: 8,
        discrimination: 1.8,
        explanation: 'Third cell = XOR of first two cells. Shapes present in exactly one of the first two appear in the third.',
        rules: [{ type: 'operation', operation: 'xor', direction: 'row' }],
        grid: [
            [
                makeCell([
                    { type: 'circle', color: c.primary, size: 'sm', position: 'top' },
                    { type: 'square', color: c.primary, size: 'sm', position: 'bottom' },
                ]),
                makeCell([
                    { type: 'circle', color: c.primary, size: 'sm', position: 'top' },
                    { type: 'triangle', color: c.primary, size: 'sm', position: 'center' },
                ]),
                makeCell([
                    { type: 'square', color: c.primary, size: 'sm', position: 'bottom' },
                    { type: 'triangle', color: c.primary, size: 'sm', position: 'center' },
                ]),
            ],
            [
                makeCell([
                    { type: 'dot', color: c.secondary, size: 'sm', position: 'left' },
                    { type: 'dot', color: c.secondary, size: 'sm', position: 'right' },
                ]),
                makeCell([
                    { type: 'dot', color: c.secondary, size: 'sm', position: 'right' },
                    { type: 'dot', color: c.secondary, size: 'sm', position: 'center' },
                ]),
                makeCell([
                    { type: 'dot', color: c.secondary, size: 'sm', position: 'left' },
                    { type: 'dot', color: c.secondary, size: 'sm', position: 'center' },
                ]),
            ],
            [
                makeCell([
                    { type: 'circle', color: c.accent, size: 'sm', position: 'top-left' },
                    { type: 'circle', color: c.accent, size: 'sm', position: 'bottom-right' },
                ]),
                makeCell([
                    { type: 'circle', color: c.accent, size: 'sm', position: 'top-right' },
                    { type: 'circle', color: c.accent, size: 'sm', position: 'bottom-right' },
                ]),
                empty(),
            ],
        ],
        options: [
            makeCell([
                { type: 'circle', color: c.accent, size: 'sm', position: 'top-left' },
                { type: 'circle', color: c.accent, size: 'sm', position: 'top-right' },
            ]),
            makeCell([
                { type: 'circle', color: c.accent, size: 'sm', position: 'bottom-right' },
            ]),
            makeCell([
                { type: 'circle', color: c.accent, size: 'sm', position: 'top-left' },
                { type: 'circle', color: c.accent, size: 'sm', position: 'bottom-left' },
            ]),
            makeCell([
                { type: 'circle', color: c.accent, size: 'sm', position: 'top-left' },
                { type: 'circle', color: c.accent, size: 'sm', position: 'bottom-right' },
            ]),
            makeCell([
                { type: 'circle', color: c.primary, size: 'sm', position: 'top-left' },
                { type: 'circle', color: c.primary, size: 'sm', position: 'top-right' },
            ]),
            makeCell([
                { type: 'square', color: c.accent, size: 'sm', position: 'top-left' },
                { type: 'square', color: c.accent, size: 'sm', position: 'top-right' },
            ]),
        ],
        correctIndex: 0,
    },

    // PUZZLE 38: Count Modulo (Medium)
    {
        id: 'GF_038',
        category: 'progression',
        difficulty: 5,
        discrimination: 1.3,
        explanation: 'Dot count = (row + col) mod 3 + 1. For row 3, col 3: (3+3) mod 3 + 1 = 1.',
        rules: [{ type: 'formula', formula: '(row + col) % 3 + 1', property: 'count' }],
        grid: [
            [
                makeCell([
                    { type: 'dot', color: c.primary, size: 'sm', position: 'center' },
                    { type: 'dot', color: c.primary, size: 'sm', position: 'top' },
                ]),
                makeCell([
                    { type: 'dot', color: c.primary, size: 'sm', position: 'center' },
                    { type: 'dot', color: c.primary, size: 'sm', position: 'top' },
                    { type: 'dot', color: c.primary, size: 'sm', position: 'bottom' },
                ]),
                makeCell([{ type: 'dot', color: c.primary, size: 'sm', position: 'center' }]),
            ],
            [
                makeCell([
                    { type: 'dot', color: c.secondary, size: 'sm', position: 'center' },
                    { type: 'dot', color: c.secondary, size: 'sm', position: 'top' },
                    { type: 'dot', color: c.secondary, size: 'sm', position: 'bottom' },
                ]),
                makeCell([{ type: 'dot', color: c.secondary, size: 'sm', position: 'center' }]),
                makeCell([
                    { type: 'dot', color: c.secondary, size: 'sm', position: 'center' },
                    { type: 'dot', color: c.secondary, size: 'sm', position: 'top' },
                ]),
            ],
            [
                makeCell([{ type: 'dot', color: c.accent, size: 'sm', position: 'center' }]),
                makeCell([
                    { type: 'dot', color: c.accent, size: 'sm', position: 'center' },
                    { type: 'dot', color: c.accent, size: 'sm', position: 'top' },
                ]),
                empty(),
            ],
        ],
        options: [
            makeCell([
                { type: 'dot', color: c.accent, size: 'sm', position: 'center' },
                { type: 'dot', color: c.accent, size: 'sm', position: 'top' },
                { type: 'dot', color: c.accent, size: 'sm', position: 'bottom' },
            ]),
            makeCell([{ type: 'dot', color: c.accent, size: 'sm', position: 'center' }]),
            makeCell([
                { type: 'dot', color: c.accent, size: 'sm', position: 'center' },
                { type: 'dot', color: c.accent, size: 'sm', position: 'top' },
            ]),
            makeCell([
                { type: 'dot', color: c.accent, size: 'sm', position: 'top-left' },
                { type: 'dot', color: c.accent, size: 'sm', position: 'top-right' },
                { type: 'dot', color: c.accent, size: 'sm', position: 'bottom' },
            ]),
            makeCell([
                { type: 'dot', color: c.primary, size: 'sm', position: 'center' },
                { type: 'dot', color: c.primary, size: 'sm', position: 'top' },
                { type: 'dot', color: c.primary, size: 'sm', position: 'bottom' },
            ]),
            makeCell([
                { type: 'square', color: c.accent, size: 'sm', position: 'center' },
            ]),
        ],
        correctIndex: 0,
    },

    // PUZZLE 39: Arrow Direction Cycle (Medium)
    {
        id: 'GF_039',
        category: 'rotation',
        difficulty: 4,
        discrimination: 1.1,
        explanation: 'Arrow direction cycles: Up → Right → Down → Left (90° clockwise per cell).',
        rules: [{ type: 'rotation', degrees: 90, direction: 'sequential' }],
        grid: [
            [
                makeCell([{ type: 'arrow', color: c.primary, size: 'md', rotation: 0 }]),
                makeCell([{ type: 'arrow', color: c.primary, size: 'md', rotation: 90 }]),
                makeCell([{ type: 'arrow', color: c.primary, size: 'md', rotation: 180 }]),
            ],
            [
                makeCell([{ type: 'arrow', color: c.secondary, size: 'md', rotation: 270 }]),
                makeCell([{ type: 'arrow', color: c.secondary, size: 'md', rotation: 0 }]),
                makeCell([{ type: 'arrow', color: c.secondary, size: 'md', rotation: 90 }]),
            ],
            [
                makeCell([{ type: 'arrow', color: c.accent, size: 'md', rotation: 180 }]),
                makeCell([{ type: 'arrow', color: c.accent, size: 'md', rotation: 270 }]),
                empty(),
            ],
        ],
        options: [
            makeCell([{ type: 'arrow', color: c.accent, size: 'md', rotation: 0 }]),
            makeCell([{ type: 'arrow', color: c.accent, size: 'md', rotation: 90 }]),
            makeCell([{ type: 'arrow', color: c.accent, size: 'md', rotation: 180 }]),
            makeCell([{ type: 'arrow', color: c.accent, size: 'md', rotation: 270 }]),
            makeCell([{ type: 'arrow', color: c.primary, size: 'md', rotation: 0 }]),
            makeCell([{ type: 'line', color: c.accent, size: 'md', rotation: 0 }]),
        ],
        correctIndex: 0,
    },

    // PUZZLE 40: Shape AND Color Distribution (Hard)
    {
        id: 'GF_040',
        category: 'distribution',
        difficulty: 6,
        discrimination: 1.5,
        explanation: 'Each row has all 3 shapes AND each column has all 3 colors. Latin square condition.',
        rules: [
            { type: 'distribution', elements: ['circle', 'square', 'triangle'], scope: 'row' },
            { type: 'distribution', elements: ['primary', 'secondary', 'accent'], scope: 'col' },
        ],
        grid: [
            [
                makeCell([{ type: 'circle', color: c.primary, size: 'md', fill: 'solid' }]),
                makeCell([{ type: 'square', color: c.secondary, size: 'md', fill: 'solid' }]),
                makeCell([{ type: 'triangle', color: c.accent, size: 'md', fill: 'solid' }]),
            ],
            [
                makeCell([{ type: 'triangle', color: c.primary, size: 'md', fill: 'solid' }]),
                makeCell([{ type: 'circle', color: c.secondary, size: 'md', fill: 'solid' }]),
                makeCell([{ type: 'square', color: c.accent, size: 'md', fill: 'solid' }]),
            ],
            [
                makeCell([{ type: 'square', color: c.primary, size: 'md', fill: 'solid' }]),
                makeCell([{ type: 'triangle', color: c.secondary, size: 'md', fill: 'solid' }]),
                empty(),
            ],
        ],
        options: [
            makeCell([{ type: 'circle', color: c.accent, size: 'md', fill: 'solid' }]),
            makeCell([{ type: 'triangle', color: c.accent, size: 'md', fill: 'solid' }]),
            makeCell([{ type: 'square', color: c.accent, size: 'md', fill: 'solid' }]),
            makeCell([{ type: 'circle', color: c.primary, size: 'md', fill: 'solid' }]),
            makeCell([{ type: 'circle', color: c.secondary, size: 'md', fill: 'solid' }]),
            makeCell([{ type: 'circle', color: c.accent, size: 'md', fill: 'outline' }]),
        ],
        correctIndex: 0,
    },

    // PUZZLE 41: Size Decrease (Easy)
    {
        id: 'GF_041',
        category: 'progression',
        difficulty: 1,
        discrimination: 0.7,
        explanation: 'Size decreases across each row: large → medium → small.',
        rules: [{ type: 'progression', property: 'size', direction: 'row', step: -1 }],
        grid: [
            [
                makeCell([{ type: 'circle', color: c.primary, size: 'lg', fill: 'solid' }]),
                makeCell([{ type: 'circle', color: c.primary, size: 'md', fill: 'solid' }]),
                makeCell([{ type: 'circle', color: c.primary, size: 'sm', fill: 'solid' }]),
            ],
            [
                makeCell([{ type: 'square', color: c.secondary, size: 'lg', fill: 'solid' }]),
                makeCell([{ type: 'square', color: c.secondary, size: 'md', fill: 'solid' }]),
                makeCell([{ type: 'square', color: c.secondary, size: 'sm', fill: 'solid' }]),
            ],
            [
                makeCell([{ type: 'triangle', color: c.accent, size: 'lg', fill: 'solid' }]),
                makeCell([{ type: 'triangle', color: c.accent, size: 'md', fill: 'solid' }]),
                empty(),
            ],
        ],
        options: [
            makeCell([{ type: 'triangle', color: c.accent, size: 'sm', fill: 'solid' }]),
            makeCell([{ type: 'triangle', color: c.accent, size: 'lg', fill: 'solid' }]),
            makeCell([{ type: 'triangle', color: c.accent, size: 'md', fill: 'solid' }]),
            makeCell([{ type: 'circle', color: c.accent, size: 'sm', fill: 'solid' }]),
            makeCell([{ type: 'triangle', color: c.primary, size: 'sm', fill: 'solid' }]),
            makeCell([{ type: 'triangle', color: c.accent, size: 'sm', fill: 'outline' }]),
        ],
        correctIndex: 0,
    },

    // PUZZLE 42: Row Sum Constant (Very Hard)
    {
        id: 'GF_042',
        category: 'operation',
        difficulty: 9,
        discrimination: 1.9,
        explanation: 'Each row sums to 6 dots. Row 3 has 2 + ? = 6, so ? = 4 dots.',
        rules: [{ type: 'sum', target: 6, property: 'count', scope: 'row' }],
        grid: [
            [
                makeCell([
                    { type: 'dot', color: c.primary, size: 'sm', position: 'top-left' },
                    { type: 'dot', color: c.primary, size: 'sm', position: 'top-right' },
                ]),
                makeCell([
                    { type: 'dot', color: c.primary, size: 'sm', position: 'center' },
                ]),
                makeCell([
                    { type: 'dot', color: c.primary, size: 'sm', position: 'top-left' },
                    { type: 'dot', color: c.primary, size: 'sm', position: 'top-right' },
                    { type: 'dot', color: c.primary, size: 'sm', position: 'bottom' },
                ]),
            ],
            [
                makeCell([
                    { type: 'dot', color: c.secondary, size: 'sm', position: 'top-left' },
                    { type: 'dot', color: c.secondary, size: 'sm', position: 'top-right' },
                    { type: 'dot', color: c.secondary, size: 'sm', position: 'bottom-left' },
                ]),
                makeCell([
                    { type: 'dot', color: c.secondary, size: 'sm', position: 'top' },
                    { type: 'dot', color: c.secondary, size: 'sm', position: 'bottom' },
                ]),
                makeCell([
                    { type: 'dot', color: c.secondary, size: 'sm', position: 'center' },
                ]),
            ],
            [
                makeCell([
                    { type: 'dot', color: c.accent, size: 'sm', position: 'left' },
                    { type: 'dot', color: c.accent, size: 'sm', position: 'right' },
                ]),
                empty(),
                makeCell([]),
            ],
        ],
        options: [
            makeCell([
                { type: 'dot', color: c.accent, size: 'sm', position: 'top-left' },
                { type: 'dot', color: c.accent, size: 'sm', position: 'top-right' },
                { type: 'dot', color: c.accent, size: 'sm', position: 'bottom-left' },
                { type: 'dot', color: c.accent, size: 'sm', position: 'bottom-right' },
            ]),
            makeCell([
                { type: 'dot', color: c.accent, size: 'sm', position: 'top' },
                { type: 'dot', color: c.accent, size: 'sm', position: 'bottom' },
            ]),
            makeCell([
                { type: 'dot', color: c.accent, size: 'sm', position: 'center' },
                { type: 'dot', color: c.accent, size: 'sm', position: 'top' },
                { type: 'dot', color: c.accent, size: 'sm', position: 'bottom' },
            ]),
            makeCell([
                { type: 'dot', color: c.accent, size: 'sm', position: 'top-left' },
                { type: 'dot', color: c.accent, size: 'sm', position: 'top-right' },
                { type: 'dot', color: c.accent, size: 'sm', position: 'center' },
                { type: 'dot', color: c.accent, size: 'sm', position: 'bottom-left' },
                { type: 'dot', color: c.accent, size: 'sm', position: 'bottom-right' },
            ]),
            makeCell([
                { type: 'dot', color: c.primary, size: 'sm', position: 'top-left' },
                { type: 'dot', color: c.primary, size: 'sm', position: 'top-right' },
                { type: 'dot', color: c.primary, size: 'sm', position: 'bottom-left' },
                { type: 'dot', color: c.primary, size: 'sm', position: 'bottom-right' },
            ]),
            makeCell([
                { type: 'square', color: c.accent, size: 'sm', position: 'center' },
            ]),
        ],
        correctIndex: 0,
    },

    // PUZZLE 43: Conditional Color (Expert)
    {
        id: 'GF_043',
        category: 'conditional',
        difficulty: 10,
        discrimination: 2.1,
        explanation: 'If shape is circle → primary color. If square → secondary. If triangle → accent. Shape determined by distribution rule.',
        rules: [
            { type: 'distribution', elements: ['circle', 'square', 'triangle'], scope: 'row' },
            { type: 'conditional', condition: { property: 'shape', value: 'circle' }, thenApply: { type: 'color_cycle', colors: ['#22d3ee'], direction: 'row' }, elseApply: { type: 'color_cycle', colors: ['#a855f7'], direction: 'row' } },
        ],
        grid: [
            [
                makeCell([{ type: 'circle', color: c.primary, size: 'md', fill: 'solid' }]),
                makeCell([{ type: 'square', color: c.secondary, size: 'md', fill: 'solid' }]),
                makeCell([{ type: 'triangle', color: c.accent, size: 'md', fill: 'solid' }]),
            ],
            [
                makeCell([{ type: 'square', color: c.secondary, size: 'md', fill: 'solid' }]),
                makeCell([{ type: 'triangle', color: c.accent, size: 'md', fill: 'solid' }]),
                makeCell([{ type: 'circle', color: c.primary, size: 'md', fill: 'solid' }]),
            ],
            [
                makeCell([{ type: 'triangle', color: c.accent, size: 'md', fill: 'solid' }]),
                makeCell([{ type: 'circle', color: c.primary, size: 'md', fill: 'solid' }]),
                empty(),
            ],
        ],
        options: [
            makeCell([{ type: 'square', color: c.secondary, size: 'md', fill: 'solid' }]),
            makeCell([{ type: 'square', color: c.primary, size: 'md', fill: 'solid' }]),
            makeCell([{ type: 'square', color: c.accent, size: 'md', fill: 'solid' }]),
            makeCell([{ type: 'circle', color: c.secondary, size: 'md', fill: 'solid' }]),
            makeCell([{ type: 'triangle', color: c.secondary, size: 'md', fill: 'solid' }]),
            makeCell([{ type: 'square', color: c.secondary, size: 'md', fill: 'outline' }]),
        ],
        correctIndex: 0,
    },

    // PUZZLE 44: Alternating Rows (Easy-Medium)
    {
        id: 'GF_044',
        category: 'progression',
        difficulty: 3,
        discrimination: 1.0,
        explanation: 'Odd rows have circles, even rows have squares. Row 3 (odd) should have circles.',
        rules: [{ type: 'alternating', pattern: ['circle', 'square'], scope: 'row' }],
        grid: [
            [
                makeCell([{ type: 'circle', color: c.primary, size: 'md', fill: 'solid' }]),
                makeCell([{ type: 'circle', color: c.primary, size: 'md', fill: 'solid' }]),
                makeCell([{ type: 'circle', color: c.primary, size: 'md', fill: 'solid' }]),
            ],
            [
                makeCell([{ type: 'square', color: c.secondary, size: 'md', fill: 'solid' }]),
                makeCell([{ type: 'square', color: c.secondary, size: 'md', fill: 'solid' }]),
                makeCell([{ type: 'square', color: c.secondary, size: 'md', fill: 'solid' }]),
            ],
            [
                makeCell([{ type: 'circle', color: c.accent, size: 'md', fill: 'solid' }]),
                makeCell([{ type: 'circle', color: c.accent, size: 'md', fill: 'solid' }]),
                empty(),
            ],
        ],
        options: [
            makeCell([{ type: 'circle', color: c.accent, size: 'md', fill: 'solid' }]),
            makeCell([{ type: 'square', color: c.accent, size: 'md', fill: 'solid' }]),
            makeCell([{ type: 'triangle', color: c.accent, size: 'md', fill: 'solid' }]),
            makeCell([{ type: 'circle', color: c.primary, size: 'md', fill: 'solid' }]),
            makeCell([{ type: 'circle', color: c.secondary, size: 'md', fill: 'solid' }]),
            makeCell([{ type: 'circle', color: c.accent, size: 'md', fill: 'outline' }]),
        ],
        correctIndex: 0,
    },

    // PUZZLE 45: Shape Shift Columns (Hard)
    {
        id: 'GF_045',
        category: 'progression',
        difficulty: 7,
        discrimination: 1.6,
        explanation: 'Each column shifts shapes down: circle→square→triangle→circle.',
        rules: [{ type: 'shift', direction: 'col', cycle: ['circle', 'square', 'triangle'] }],
        grid: [
            [
                makeCell([{ type: 'circle', color: c.primary, size: 'md', fill: 'solid' }]),
                makeCell([{ type: 'square', color: c.primary, size: 'md', fill: 'solid' }]),
                makeCell([{ type: 'triangle', color: c.primary, size: 'md', fill: 'solid' }]),
            ],
            [
                makeCell([{ type: 'square', color: c.secondary, size: 'md', fill: 'solid' }]),
                makeCell([{ type: 'triangle', color: c.secondary, size: 'md', fill: 'solid' }]),
                makeCell([{ type: 'circle', color: c.secondary, size: 'md', fill: 'solid' }]),
            ],
            [
                makeCell([{ type: 'triangle', color: c.accent, size: 'md', fill: 'solid' }]),
                makeCell([{ type: 'circle', color: c.accent, size: 'md', fill: 'solid' }]),
                empty(),
            ],
        ],
        options: [
            makeCell([{ type: 'square', color: c.accent, size: 'md', fill: 'solid' }]),
            makeCell([{ type: 'circle', color: c.accent, size: 'md', fill: 'solid' }]),
            makeCell([{ type: 'triangle', color: c.accent, size: 'md', fill: 'solid' }]),
            makeCell([{ type: 'square', color: c.primary, size: 'md', fill: 'solid' }]),
            makeCell([{ type: 'square', color: c.secondary, size: 'md', fill: 'solid' }]),
            makeCell([{ type: 'square', color: c.accent, size: 'md', fill: 'outline' }]),
        ],
        correctIndex: 0,
    },

    // PUZZLE 46: Double Dots (Easy)
    {
        id: 'GF_046',
        category: 'progression',
        difficulty: 2,
        discrimination: 0.9,
        explanation: 'Dots double each step across columns: 1 → 2 → 4.',
        rules: [{ type: 'progression', property: 'count', direction: 'col', step: 2 }],
        grid: [
            [
                makeCell([{ type: 'dot', color: c.primary, size: 'md', position: 'center' }]),
                makeCell([{ type: 'dot', color: c.secondary, size: 'md', position: 'center' }]),
                makeCell([{ type: 'dot', color: c.accent, size: 'md', position: 'center' }]),
            ],
            [
                makeCell([
                    { type: 'dot', color: c.primary, size: 'sm', position: 'left' },
                    { type: 'dot', color: c.primary, size: 'sm', position: 'right' },
                ]),
                makeCell([
                    { type: 'dot', color: c.secondary, size: 'sm', position: 'left' },
                    { type: 'dot', color: c.secondary, size: 'sm', position: 'right' },
                ]),
                makeCell([
                    { type: 'dot', color: c.accent, size: 'sm', position: 'left' },
                    { type: 'dot', color: c.accent, size: 'sm', position: 'right' },
                ]),
            ],
            [
                makeCell([
                    { type: 'dot', color: c.primary, size: 'sm', position: 'top-left' },
                    { type: 'dot', color: c.primary, size: 'sm', position: 'top-right' },
                    { type: 'dot', color: c.primary, size: 'sm', position: 'bottom-left' },
                    { type: 'dot', color: c.primary, size: 'sm', position: 'bottom-right' },
                ]),
                makeCell([
                    { type: 'dot', color: c.secondary, size: 'sm', position: 'top-left' },
                    { type: 'dot', color: c.secondary, size: 'sm', position: 'top-right' },
                    { type: 'dot', color: c.secondary, size: 'sm', position: 'bottom-left' },
                    { type: 'dot', color: c.secondary, size: 'sm', position: 'bottom-right' },
                ]),
                empty(),
            ],
        ],
        options: [
            makeCell([
                { type: 'dot', color: c.accent, size: 'sm', position: 'top-left' },
                { type: 'dot', color: c.accent, size: 'sm', position: 'top-right' },
                { type: 'dot', color: c.accent, size: 'sm', position: 'bottom-left' },
                { type: 'dot', color: c.accent, size: 'sm', position: 'bottom-right' },
            ]),
            makeCell([
                { type: 'dot', color: c.accent, size: 'sm', position: 'left' },
                { type: 'dot', color: c.accent, size: 'sm', position: 'right' },
            ]),
            makeCell([
                { type: 'dot', color: c.accent, size: 'sm', position: 'top-left' },
                { type: 'dot', color: c.accent, size: 'sm', position: 'top-right' },
                { type: 'dot', color: c.accent, size: 'sm', position: 'bottom-left' },
                { type: 'dot', color: c.accent, size: 'sm', position: 'bottom-right' },
                { type: 'dot', color: c.accent, size: 'sm', position: 'center' },
                { type: 'dot', color: c.accent, size: 'sm', position: 'top' },
                { type: 'dot', color: c.accent, size: 'sm', position: 'bottom' },
                { type: 'dot', color: c.accent, size: 'sm', position: 'left' },
            ]),
            makeCell([
                { type: 'dot', color: c.primary, size: 'sm', position: 'top-left' },
                { type: 'dot', color: c.primary, size: 'sm', position: 'top-right' },
                { type: 'dot', color: c.primary, size: 'sm', position: 'bottom-left' },
                { type: 'dot', color: c.primary, size: 'sm', position: 'bottom-right' },
            ]),
            makeCell([
                { type: 'dot', color: c.accent, size: 'md', position: 'top-left' },
                { type: 'dot', color: c.accent, size: 'md', position: 'top-right' },
                { type: 'dot', color: c.accent, size: 'md', position: 'bottom-left' },
                { type: 'dot', color: c.accent, size: 'md', position: 'bottom-right' },
            ]),
            makeCell([
                { type: 'square', color: c.accent, size: 'sm', position: 'center' },
            ]),
        ],
        correctIndex: 0,
    },

    // PUZZLE 47: Diagonal Shift (Hard)
    {
        id: 'GF_047',
        category: 'operation',
        difficulty: 8,
        discrimination: 1.7,
        explanation: 'Each diagonal (top-left to bottom-right) has the same shape type.',
        rules: [{ type: 'identity', scope: 'diagonal' }],
        grid: [
            [
                makeCell([{ type: 'circle', color: c.primary, size: 'md', fill: 'solid' }]),
                makeCell([{ type: 'square', color: c.primary, size: 'md', fill: 'solid' }]),
                makeCell([{ type: 'triangle', color: c.primary, size: 'md', fill: 'solid' }]),
            ],
            [
                makeCell([{ type: 'triangle', color: c.secondary, size: 'md', fill: 'solid' }]),
                makeCell([{ type: 'circle', color: c.secondary, size: 'md', fill: 'solid' }]),
                makeCell([{ type: 'square', color: c.secondary, size: 'md', fill: 'solid' }]),
            ],
            [
                makeCell([{ type: 'square', color: c.accent, size: 'md', fill: 'solid' }]),
                makeCell([{ type: 'triangle', color: c.accent, size: 'md', fill: 'solid' }]),
                empty(),
            ],
        ],
        options: [
            makeCell([{ type: 'circle', color: c.accent, size: 'md', fill: 'solid' }]),
            makeCell([{ type: 'square', color: c.accent, size: 'md', fill: 'solid' }]),
            makeCell([{ type: 'triangle', color: c.accent, size: 'md', fill: 'solid' }]),
            makeCell([{ type: 'circle', color: c.primary, size: 'md', fill: 'solid' }]),
            makeCell([{ type: 'circle', color: c.secondary, size: 'md', fill: 'solid' }]),
            makeCell([{ type: 'circle', color: c.accent, size: 'md', fill: 'outline' }]),
        ],
        correctIndex: 0,
    },

    // PUZZLE 48: Three Rules Combined (Expert)
    {
        id: 'GF_048',
        category: 'conditional',
        difficulty: 10,
        discrimination: 2.3,
        explanation: 'Shape cycles rows (C→S→T), Color cycles cols (P→S→A), Size alternates (lg-sm-lg / sm-lg-sm / lg-sm-lg).',
        rules: [
            { type: 'distribution', elements: ['circle', 'square', 'triangle'], scope: 'row' },
            { type: 'distribution', elements: ['primary', 'secondary', 'accent'], scope: 'col' },
            { type: 'alternating', property: 'size', pattern: ['lg', 'sm'], scope: 'row' },
        ],
        grid: [
            [
                makeCell([{ type: 'circle', color: c.primary, size: 'lg', fill: 'solid' }]),
                makeCell([{ type: 'square', color: c.secondary, size: 'sm', fill: 'solid' }]),
                makeCell([{ type: 'triangle', color: c.accent, size: 'lg', fill: 'solid' }]),
            ],
            [
                makeCell([{ type: 'square', color: c.primary, size: 'sm', fill: 'solid' }]),
                makeCell([{ type: 'triangle', color: c.secondary, size: 'lg', fill: 'solid' }]),
                makeCell([{ type: 'circle', color: c.accent, size: 'sm', fill: 'solid' }]),
            ],
            [
                makeCell([{ type: 'triangle', color: c.primary, size: 'lg', fill: 'solid' }]),
                makeCell([{ type: 'circle', color: c.secondary, size: 'sm', fill: 'solid' }]),
                empty(),
            ],
        ],
        options: [
            makeCell([{ type: 'square', color: c.accent, size: 'lg', fill: 'solid' }]),
            makeCell([{ type: 'square', color: c.accent, size: 'sm', fill: 'solid' }]),
            makeCell([{ type: 'circle', color: c.accent, size: 'lg', fill: 'solid' }]),
            makeCell([{ type: 'triangle', color: c.accent, size: 'lg', fill: 'solid' }]),
            makeCell([{ type: 'square', color: c.primary, size: 'lg', fill: 'solid' }]),
            makeCell([{ type: 'square', color: c.secondary, size: 'lg', fill: 'solid' }]),
        ],
        correctIndex: 0,
    },

    // PUZZLE 49: Inverse Fill (Medium)
    {
        id: 'GF_049',
        category: 'negation',
        difficulty: 5,
        discrimination: 1.4,
        explanation: 'Third cell has inverse fill of first two combined. If first two are solid, third is outline.',
        rules: [{ type: 'negation', property: 'fill', direction: 'row' }],
        grid: [
            [
                makeCell([{ type: 'circle', color: c.primary, size: 'md', fill: 'solid' }]),
                makeCell([{ type: 'circle', color: c.primary, size: 'md', fill: 'solid' }]),
                makeCell([{ type: 'circle', color: c.primary, size: 'md', fill: 'outline' }]),
            ],
            [
                makeCell([{ type: 'square', color: c.secondary, size: 'md', fill: 'outline' }]),
                makeCell([{ type: 'square', color: c.secondary, size: 'md', fill: 'outline' }]),
                makeCell([{ type: 'square', color: c.secondary, size: 'md', fill: 'solid' }]),
            ],
            [
                makeCell([{ type: 'triangle', color: c.accent, size: 'md', fill: 'solid' }]),
                makeCell([{ type: 'triangle', color: c.accent, size: 'md', fill: 'outline' }]),
                empty(),
            ],
        ],
        options: [
            makeCell([{ type: 'triangle', color: c.accent, size: 'md', fill: 'solid' }]),
            makeCell([{ type: 'triangle', color: c.accent, size: 'md', fill: 'outline' }]),
            makeCell([{ type: 'circle', color: c.accent, size: 'md', fill: 'solid' }]),
            makeCell([{ type: 'square', color: c.accent, size: 'md', fill: 'solid' }]),
            makeCell([{ type: 'triangle', color: c.primary, size: 'md', fill: 'solid' }]),
            makeCell([{ type: 'triangle', color: c.accent, size: 'lg', fill: 'solid' }]),
        ],
        correctIndex: 0,
    },

    // PUZZLE 50: Complete Triple Rule (Very Hard)
    {
        id: 'GF_050',
        category: 'conditional',
        difficulty: 9,
        discrimination: 2.0,
        explanation: 'Each row/col has unique shape+color+size combo. Latin 3D cube constraint.',
        rules: [
            { type: 'latin_square', dimensions: ['shape', 'color', 'size'] },
        ],
        grid: [
            [
                makeCell([{ type: 'circle', color: c.primary, size: 'lg', fill: 'solid' }]),
                makeCell([{ type: 'square', color: c.secondary, size: 'md', fill: 'solid' }]),
                makeCell([{ type: 'triangle', color: c.accent, size: 'sm', fill: 'solid' }]),
            ],
            [
                makeCell([{ type: 'triangle', color: c.secondary, size: 'lg', fill: 'solid' }]),
                makeCell([{ type: 'circle', color: c.accent, size: 'md', fill: 'solid' }]),
                makeCell([{ type: 'square', color: c.primary, size: 'sm', fill: 'solid' }]),
            ],
            [
                makeCell([{ type: 'square', color: c.accent, size: 'lg', fill: 'solid' }]),
                makeCell([{ type: 'triangle', color: c.primary, size: 'md', fill: 'solid' }]),
                empty(),
            ],
        ],
        options: [
            makeCell([{ type: 'circle', color: c.secondary, size: 'sm', fill: 'solid' }]),
            makeCell([{ type: 'circle', color: c.accent, size: 'sm', fill: 'solid' }]),
            makeCell([{ type: 'circle', color: c.primary, size: 'sm', fill: 'solid' }]),
            makeCell([{ type: 'triangle', color: c.secondary, size: 'sm', fill: 'solid' }]),
            makeCell([{ type: 'square', color: c.secondary, size: 'sm', fill: 'solid' }]),
            makeCell([{ type: 'circle', color: c.secondary, size: 'lg', fill: 'solid' }]),
        ],
        correctIndex: 0,
    },
];

export default MATRIX_PUZZLES;
