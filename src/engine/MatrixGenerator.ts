// Matrix Generator Engine
// Generates progressive matrix puzzles with configurable rules and difficulty

import {
    Shape,
    ShapeType,
    FillType,
    ShapeSize,
    Position,
    MatrixCell,
    MatrixPuzzle,
    MatrixRule,
    MatrixCategory,
    MATRIX_COLORS,
    createShape,
    createCell,
    createEmptyCell,
} from '../types/matrix';

// ============================================================================
// GENERATOR CONFIGURATION
// ============================================================================

interface GeneratorConfig {
    difficulty: number;          // 1-10
    rules: MatrixRule[];         // Rules to apply
    shapeTypes?: ShapeType[];    // Available shapes (random if not specified)
    colors?: string[];           // Available colors
    gridSize?: 3;                // Always 3x3 for now
    optionCount?: number;        // Number of answer options (default 6)
}

// ============================================================================
// MATRIX GENERATOR CLASS
// ============================================================================

export class MatrixGenerator {
    private static idCounter = 0;

    /**
     * Generate a complete matrix puzzle based on configuration
     */
    static generate(config: GeneratorConfig): MatrixPuzzle {
        const {
            difficulty,
            rules,
            shapeTypes = ['circle', 'square', 'triangle'],
            colors = [MATRIX_COLORS.primary, MATRIX_COLORS.secondary, MATRIX_COLORS.accent],
            optionCount = 6,
        } = config;

        // Generate the 3x3 grid based on rules
        const grid = this.generateGrid(rules, shapeTypes, colors);

        // The correct answer is grid[2][2]
        const correctAnswer = grid[2][2];

        // Replace last cell with empty cell
        grid[2][2] = createEmptyCell();

        // Generate distractor options
        const distractors = this.generateDistractors(
            correctAnswer,
            rules,
            shapeTypes,
            colors,
            optionCount - 1
        );

        // Shuffle options and track correct index
        const options = this.shuffleWithCorrect(correctAnswer, distractors);
        const correctIndex = options.findIndex(opt => opt.id === correctAnswer.id);

        // Determine category from primary rule
        const category = this.categorizeRules(rules);

        // Generate explanation
        const explanation = this.generateExplanation(rules);

        return {
            id: `matrix_${++this.idCounter}`,
            grid,
            options,
            correctIndex,
            rules,
            difficulty,
            discrimination: 0.8 + (difficulty * 0.15), // Higher difficulty = higher discrimination
            explanation,
            category,
        };
    }

    /**
     * Generate the 3x3 grid based on rules
     */
    private static generateGrid(
        rules: MatrixRule[],
        shapeTypes: ShapeType[],
        colors: string[]
    ): MatrixCell[][] {
        const grid: MatrixCell[][] = [];

        // Initialize with base pattern
        for (let row = 0; row < 3; row++) {
            grid[row] = [];
            for (let col = 0; col < 3; col++) {
                grid[row][col] = createCell([]);
            }
        }

        // Apply each rule to build the pattern
        for (const rule of rules) {
            this.applyRule(grid, rule, shapeTypes, colors);
        }

        return grid;
    }

    /**
     * Apply a single rule to the grid
     */
    private static applyRule(
        grid: MatrixCell[][],
        rule: MatrixRule,
        shapeTypes: ShapeType[],
        colors: string[]
    ): void {
        switch (rule.type) {
            case 'progression':
                this.applyProgression(grid, rule, shapeTypes, colors);
                break;
            case 'rotation':
                this.applyRotation(grid, rule, shapeTypes, colors);
                break;
            case 'distribution':
                this.applyDistribution(grid, rule, shapeTypes, colors);
                break;
            case 'color_cycle':
                this.applyColorCycle(grid, rule);
                break;
            case 'size_cycle':
                this.applySizeCycle(grid, rule);
                break;
            case 'overlay':
                this.applyOverlay(grid, rule);
                break;
            case 'negation':
                this.applyNegation(grid, rule);
                break;
        }
    }

    /**
     * Progression rule: increase count/size/rotation across rows or columns
     */
    private static applyProgression(
        grid: MatrixCell[][],
        rule: MatrixRule & { type: 'progression' },
        shapeTypes: ShapeType[],
        colors: string[]
    ): void {
        const baseShape = shapeTypes[0];
        const baseColor = colors[0];

        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 3; col++) {
                const progressValue = rule.direction === 'row' ? col : row;

                switch (rule.property) {
                    case 'count':
                        // Add 1, 2, 3 shapes
                        const count = progressValue + 1;
                        const positions: Position[] = ['top-left', 'top-right', 'bottom-left', 'bottom-right', 'center'];
                        grid[row][col].shapes = Array.from({ length: count }, (_, i) =>
                            createShape(baseShape, {
                                color: baseColor,
                                size: 'sm',
                                position: positions[i] || 'center',
                            })
                        );
                        break;

                    case 'size':
                        const sizes: ShapeSize[] = ['sm', 'md', 'lg'];
                        grid[row][col].shapes = [
                            createShape(baseShape, {
                                color: baseColor,
                                size: sizes[progressValue],
                            })
                        ];
                        break;

                    case 'rotation':
                        const rotations = [0, 45 * rule.step, 90 * rule.step];
                        grid[row][col].shapes = [
                            createShape(baseShape, {
                                color: baseColor,
                                rotation: rotations[progressValue],
                            })
                        ];
                        break;

                    case 'opacity':
                        const opacities = [0.3, 0.6, 1.0];
                        grid[row][col].shapes = [
                            createShape(baseShape, {
                                color: baseColor,
                                opacity: opacities[progressValue],
                            })
                        ];
                        break;
                }
            }
        }
    }

    /**
     * Rotation rule: shapes rotate by fixed degrees across rows/cols
     */
    private static applyRotation(
        grid: MatrixCell[][],
        rule: MatrixRule & { type: 'rotation' },
        shapeTypes: ShapeType[],
        colors: string[]
    ): void {
        const baseShape: ShapeType = 'arrow'; // Arrows show rotation clearly
        const baseColor = colors[0];

        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 3; col++) {
                const step = rule.direction === 'row' ? col : row;
                const rotation = step * rule.degrees;

                grid[row][col].shapes = [
                    createShape(baseShape, {
                        color: baseColor,
                        rotation,
                        size: 'lg',
                    })
                ];
            }
        }
    }

    /**
     * Distribution rule: each row/col has each shape type exactly once
     */
    private static applyDistribution(
        grid: MatrixCell[][],
        rule: MatrixRule & { type: 'distribution' },
        shapeTypes: ShapeType[],
        colors: string[]
    ): void {
        const elements = rule.elements.length > 0
            ? rule.elements as ShapeType[]
            : shapeTypes.slice(0, 3);

        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 3; col++) {
                let shapeIndex: number;

                if (rule.scope === 'row') {
                    shapeIndex = col;
                } else if (rule.scope === 'col') {
                    shapeIndex = row;
                } else {
                    // Latin square pattern
                    shapeIndex = (row + col) % 3;
                }

                grid[row][col].shapes = [
                    createShape(elements[shapeIndex], {
                        color: colors[shapeIndex % colors.length],
                        size: 'md',
                    })
                ];
            }
        }
    }

    /**
     * Color cycle rule: colors rotate through a cycle
     */
    private static applyColorCycle(
        grid: MatrixCell[][],
        rule: MatrixRule & { type: 'color_cycle' }
    ): void {
        const { colors, direction } = rule;

        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 3; col++) {
                const step = direction === 'row' ? col : row;
                const colorIndex = step % colors.length;

                // Update existing shapes or create new ones
                if (grid[row][col].shapes.length === 0) {
                    grid[row][col].shapes = [createShape('circle', { size: 'md' })];
                }

                grid[row][col].shapes.forEach(shape => {
                    shape.color = colors[colorIndex];
                });
            }
        }
    }

    /**
     * Size cycle rule: sizes rotate through a cycle
     */
    private static applySizeCycle(
        grid: MatrixCell[][],
        rule: MatrixRule & { type: 'size_cycle' }
    ): void {
        const { sizes, direction } = rule;

        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 3; col++) {
                const step = direction === 'row' ? col : row;
                const sizeIndex = step % sizes.length;

                if (grid[row][col].shapes.length === 0) {
                    grid[row][col].shapes = [createShape('circle')];
                }

                grid[row][col].shapes.forEach(shape => {
                    shape.size = sizes[sizeIndex];
                });
            }
        }
    }

    /**
     * Overlay rule: A + B = C (combine shapes from two cells into third)
     */
    private static applyOverlay(
        grid: MatrixCell[][],
        rule: MatrixRule & { type: 'overlay' }
    ): void {
        if (rule.direction === 'row') {
            for (let row = 0; row < 3; row++) {
                // Cell 0 + Cell 1 = Cell 2
                const shapesA = grid[row][0].shapes;
                const shapesB = grid[row][1].shapes;

                if (rule.operation === 'add') {
                    grid[row][2].shapes = [...shapesA, ...shapesB];
                } else if (rule.operation === 'subtract') {
                    // Remove shapes from A that are in B
                    grid[row][2].shapes = shapesA.filter(
                        shapeA => !shapesB.some(shapeB => shapeB.type === shapeA.type)
                    );
                }
            }
        } else {
            for (let col = 0; col < 3; col++) {
                const shapesA = grid[0][col].shapes;
                const shapesB = grid[1][col].shapes;

                if (rule.operation === 'add') {
                    grid[2][col].shapes = [...shapesA, ...shapesB];
                }
            }
        }
    }

    /**
     * Negation rule: fill inverts (solid <-> outline)
     */
    private static applyNegation(
        grid: MatrixCell[][],
        rule: MatrixRule & { type: 'negation' }
    ): void {
        const fills: FillType[] = ['solid', 'outline', 'solid'];

        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 3; col++) {
                const step = rule.direction === 'row' ? col : row;

                grid[row][col].shapes.forEach(shape => {
                    shape.fill = fills[step];
                });
            }
        }
    }

    /**
     * Generate distractor options (wrong answers)
     */
    private static generateDistractors(
        correct: MatrixCell,
        rules: MatrixRule[],
        shapeTypes: ShapeType[],
        colors: string[],
        count: number
    ): MatrixCell[] {
        const distractors: MatrixCell[] = [];

        // Strategy 1: Near-miss (one property wrong)
        if (correct.shapes.length > 0) {
            // Wrong color
            const wrongColor = createCell(
                correct.shapes.map(s => ({
                    ...s,
                    id: `${s.id}_wc`,
                    color: colors.find(c => c !== s.color) || colors[0],
                }))
            );
            distractors.push(wrongColor);

            // Wrong shape type
            const wrongShape = createCell(
                correct.shapes.map(s => ({
                    ...s,
                    id: `${s.id}_ws`,
                    type: shapeTypes.find(t => t !== s.type) || shapeTypes[0],
                }))
            );
            distractors.push(wrongShape);

            // Wrong rotation (if applicable)
            const wrongRotation = createCell(
                correct.shapes.map(s => ({
                    ...s,
                    id: `${s.id}_wr`,
                    rotation: ((s.rotation || 0) + 90) % 360,
                }))
            );
            distractors.push(wrongRotation);

            // Wrong size
            const sizes: ShapeSize[] = ['sm', 'md', 'lg'];
            const wrongSize = createCell(
                correct.shapes.map(s => ({
                    ...s,
                    id: `${s.id}_wsz`,
                    size: sizes.find(sz => sz !== s.size) || sizes[0],
                }))
            );
            distractors.push(wrongSize);

            // Extra/missing element
            if (correct.shapes.length > 1) {
                const missing = createCell(correct.shapes.slice(0, -1).map(s => ({
                    ...s,
                    id: `${s.id}_miss`,
                })));
                distractors.push(missing);
            } else {
                const extra = createCell([
                    ...correct.shapes.map(s => ({ ...s, id: `${s.id}_ext` })),
                    createShape(shapeTypes[1] || 'dot', { size: 'sm', position: 'top-right' }),
                ]);
                distractors.push(extra);
            }
        }

        // Fill remaining with random variations
        while (distractors.length < count) {
            const randomCell = createCell([
                createShape(
                    shapeTypes[Math.floor(Math.random() * shapeTypes.length)],
                    {
                        color: colors[Math.floor(Math.random() * colors.length)],
                        size: ['sm', 'md', 'lg'][Math.floor(Math.random() * 3)] as ShapeSize,
                        rotation: [0, 45, 90, 180][Math.floor(Math.random() * 4)],
                    }
                ),
            ]);
            distractors.push(randomCell);
        }

        return distractors.slice(0, count);
    }

    /**
     * Shuffle options and include correct answer
     */
    private static shuffleWithCorrect(
        correct: MatrixCell,
        distractors: MatrixCell[]
    ): MatrixCell[] {
        const all = [correct, ...distractors];

        // Fisher-Yates shuffle
        for (let i = all.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [all[i], all[j]] = [all[j], all[i]];
        }

        return all;
    }

    /**
     * Categorize puzzle based on primary rule
     */
    private static categorizeRules(rules: MatrixRule[]): MatrixCategory {
        if (rules.length === 0) return 'progression';

        const primary = rules[0].type;

        if (rules.length > 1) return 'multi_rule';

        switch (primary) {
            case 'progression': return 'progression';
            case 'rotation': return 'rotation';
            case 'distribution': return 'distribution';
            case 'overlay': return 'overlay';
            case 'conditional': return 'conditional';
            default: return 'progression';
        }
    }

    /**
     * Generate human-readable explanation of the pattern
     */
    private static generateExplanation(rules: MatrixRule[]): string {
        if (rules.length === 0) return 'No specific pattern.';

        const explanations = rules.map(rule => {
            switch (rule.type) {
                case 'progression':
                    return `${rule.property.charAt(0).toUpperCase() + rule.property.slice(1)} increases by ${rule.step} across each ${rule.direction}.`;
                case 'rotation':
                    return `Shapes rotate ${rule.degrees}° clockwise across each ${rule.direction}.`;
                case 'distribution':
                    return `Each ${rule.scope} contains one of each shape type (distribution rule).`;
                case 'color_cycle':
                    return `Colors cycle through the pattern across each ${rule.direction}.`;
                case 'size_cycle':
                    return `Sizes cycle through small → medium → large across each ${rule.direction}.`;
                case 'overlay':
                    return `First two cells ${rule.operation === 'add' ? 'combine' : 'subtract'} to form the third cell.`;
                case 'negation':
                    return `Fill alternates between solid and outline across each ${rule.direction}.`;
                default:
                    return 'Complex pattern involving multiple rules.';
            }
        });

        return explanations.join(' ');
    }
}

export default MatrixGenerator;
