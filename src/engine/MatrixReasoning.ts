// Matrix Reasoning Test Engine - CHC Theory (Gf/Gv) - IQ Assessment
// Implements Raven's-style progressive matrices with adaptive difficulty

import type { DifficultyLevel } from './TestEngine';

export interface MatrixCell {
    shape: 'circle' | 'square' | 'triangle' | 'diamond' | 'star';
    color: string;
    size: number;
    rotation: number;
}

export interface MatrixPattern {
    grid: (MatrixCell | null)[][]; // 3x3 grid with one missing cell
    missingRow: number;
    missingCol: number;
    correctAnswer: MatrixCell;
    options: MatrixCell[]; // 6 answer choices
    rule: string; // For debugging/explanation
}

// Color palette for matrix elements
const COLORS = ['#22d3ee', '#10b981', '#f59e0b', '#ef4444', '#a78bfa', '#ec4899'];
const SHAPES: MatrixCell['shape'][] = ['circle', 'square', 'triangle', 'diamond', 'star'];

// Generate matrix problem based on difficulty
export function generateMatrixProblem(difficulty: DifficultyLevel): MatrixPattern {
    const gridSize = 3;

    if (difficulty <= 3) {
        // Simple: Single transformation (rotation or color change)
        return generateSimplePattern(gridSize);
    } else if (difficulty <= 6) {
        // Medium: Dual transformations (rotation + size change)
        return generateMediumPattern(gridSize);
    } else {
        // Hard: Complex sequences (3+ rules: shape + color + rotation)
        return generateComplexPattern(gridSize);
    }
}

// Simple Pattern: Single rule (rotation progression)
function generateSimplePattern(size: number): MatrixPattern {
    const baseShape = SHAPES[Math.floor(Math.random() * SHAPES.length)];
    const baseColor = COLORS[Math.floor(Math.random() * COLORS.length)];
    const baseSize = 40;

    const grid: (MatrixCell | null)[][] = [];
    let missingRow = Math.floor(Math.random() * size);
    let missingCol = Math.floor(Math.random() * size);

    // Generate grid with rotation progression
    for (let row = 0; row < size; row++) {
        grid[row] = [];
        for (let col = 0; col < size; col++) {
            if (row === missingRow && col === missingCol) {
                grid[row][col] = null;
            } else {
                grid[row][col] = {
                    shape: baseShape,
                    color: baseColor,
                    size: baseSize,
                    rotation: (row * size + col) * 45, // Progressive rotation
                };
            }
        }
    }

    // Correct answer follows the pattern
    const correctAnswer: MatrixCell = {
        shape: baseShape,
        color: baseColor,
        size: baseSize,
        rotation: (missingRow * size + missingCol) * 45,
    };

    // Generate distractor options
    const options = generateOptions(correctAnswer, 'simple');

    return {
        grid,
        missingRow,
        missingCol,
        correctAnswer,
        options,
        rule: 'Rotation progression: +45° per cell',
    };
}

// Medium Pattern: Dual transformations
function generateMediumPattern(size: number): MatrixPattern {
    const grid: (MatrixCell | null)[][] = [];
    let missingRow = 1; // Middle row for better pattern visibility
    let missingCol = 2; // Last column

    const baseShape = SHAPES[Math.floor(Math.random() * SHAPES.length)];
    // const baseColor = '#22d3ee'; // Unused

    // Pattern: Size increases by row, color changes by column
    for (let row = 0; row < size; row++) {
        grid[row] = [];
        for (let col = 0; col < size; col++) {
            if (row === missingRow && col === missingCol) {
                grid[row][col] = null;
            } else {
                grid[row][col] = {
                    shape: baseShape,
                    color: COLORS[col % COLORS.length],
                    size: 30 + row * 15,
                    rotation: 0,
                };
            }
        }
    }

    const correctAnswer: MatrixCell = {
        shape: baseShape,
        color: COLORS[missingCol % COLORS.length],
        size: 30 + missingRow * 15,
        rotation: 0,
    };

    const options = generateOptions(correctAnswer, 'medium');

    return {
        grid,
        missingRow,
        missingCol,
        correctAnswer,
        options,
        rule: 'Size increases by row, color changes by column',
    };
}

// Complex Pattern: Multiple rules
function generateComplexPattern(size: number): MatrixPattern {
    const grid: (MatrixCell | null)[][] = [];
    let missingRow = 2;
    let missingCol = 2;

    // Pattern: Shape changes by row, color by column, rotation increases
    for (let row = 0; row < size; row++) {
        grid[row] = [];
        for (let col = 0; col < size; col++) {
            if (row === missingRow && col === missingCol) {
                grid[row][col] = null;
            } else {
                grid[row][col] = {
                    shape: SHAPES[row % SHAPES.length],
                    color: COLORS[col % COLORS.length],
                    size: 40,
                    rotation: (row + col) * 30,
                };
            }
        }
    }

    const correctAnswer: MatrixCell = {
        shape: SHAPES[missingRow % SHAPES.length],
        color: COLORS[missingCol % COLORS.length],
        size: 40,
        rotation: (missingRow + missingCol) * 30,
    };

    const options = generateOptions(correctAnswer, 'complex');

    return {
        grid,
        missingRow,
        missingCol,
        correctAnswer,
        options,
        rule: 'Shape by row, color by column, rotation = (row+col)×30°',
    };
}

// Generate answer options (5 distractors + 1 correct)
function generateOptions(correct: MatrixCell, difficulty: string): MatrixCell[] {
    const options: MatrixCell[] = [correct];

    // Generate 5 plausible distractors
    for (let i = 0; i < 5; i++) {
        const distractor: MatrixCell = { ...correct };

        if (difficulty === 'simple') {
            // Change just rotation
            distractor.rotation = (correct.rotation + (i + 1) * 45) % 360;
        } else if (difficulty === 'medium') {
            // Change color or size
            if (i % 2 === 0) {
                distractor.color = COLORS[(COLORS.indexOf(correct.color) + i + 1) % COLORS.length];
            } else {
                distractor.size = correct.size + (i - 2) * 10;
            }
        } else {
            // Change multiple attributes
            distractor.shape = SHAPES[(SHAPES.indexOf(correct.shape) + i) % SHAPES.length];
            if (i > 2) distractor.color = COLORS[(COLORS.indexOf(correct.color) + i) % COLORS.length];
            if (i === 4) distractor.rotation = (correct.rotation + 90) % 360;
        }

        options.push(distractor);
    }

    // Shuffle options
    return options.sort(() => Math.random() - 0.5);
}

// Render matrix cell to canvas
export function renderMatrixCell(
    ctx: CanvasRenderingContext2D,
    cell: MatrixCell,
    x: number,
    y: number,
    cellSize: number
): void {
    ctx.save();
    ctx.translate(x + cellSize / 2, y + cellSize / 2);
    ctx.rotate((cell.rotation * Math.PI) / 180);

    ctx.fillStyle = cell.color;
    ctx.strokeStyle = cell.color;
    ctx.lineWidth = 2;

    const halfSize = cell.size / 2;

    switch (cell.shape) {
        case 'circle':
            ctx.beginPath();
            ctx.arc(0, 0, halfSize, 0, Math.PI * 2);
            ctx.fill();
            break;

        case 'square':
            ctx.fillRect(-halfSize, -halfSize, cell.size, cell.size);
            break;

        case 'triangle':
            ctx.beginPath();
            ctx.moveTo(0, -halfSize);
            ctx.lineTo(halfSize, halfSize);
            ctx.lineTo(-halfSize, halfSize);
            ctx.closePath();
            ctx.fill();
            break;

        case 'diamond':
            ctx.beginPath();
            ctx.moveTo(0, -halfSize);
            ctx.lineTo(halfSize, 0);
            ctx.lineTo(0, halfSize);
            ctx.lineTo(-halfSize, 0);
            ctx.closePath();
            ctx.fill();
            break;

        case 'star':
            drawStar(ctx, 0, 0, 5, halfSize, halfSize / 2);
            ctx.fill();
            break;
    }

    ctx.restore();
}

// Helper to draw star shape
function drawStar(ctx: CanvasRenderingContext2D, cx: number, cy: number, spikes: number, outerRadius: number, innerRadius: number): void {
    let rot = (Math.PI / 2) * 3;
    let x = cx;
    let y = cy;
    const step = Math.PI / spikes;

    ctx.beginPath();
    ctx.moveTo(cx, cy - outerRadius);

    for (let i = 0; i < spikes; i++) {
        x = cx + Math.cos(rot) * outerRadius;
        y = cy + Math.sin(rot) * outerRadius;
        ctx.lineTo(x, y);
        rot += step;

        x = cx + Math.cos(rot) * innerRadius;
        y = cy + Math.sin(rot) * innerRadius;
        ctx.lineTo(x, y);
        rot += step;
    }

    ctx.lineTo(cx, cy - outerRadius);
    ctx.closePath();
}

// Check if user's answer is correct
export function checkMatrixAnswer(userChoice: MatrixCell, correctAnswer: MatrixCell): boolean {
    return (
        userChoice.shape === correctAnswer.shape &&
        userChoice.color === correctAnswer.color &&
        Math.abs(userChoice.size - correctAnswer.size) < 5 &&
        Math.abs(userChoice.rotation - correctAnswer.rotation) < 5
    );
}
