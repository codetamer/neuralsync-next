// Matrix and Shape type definitions for NeuralSync cognitive assessment
// Based on Raven's Progressive Matrices methodology

// ============================================================================
// SHAPE PRIMITIVES
// ============================================================================

export type ShapeType =
    | 'circle'
    | 'square'
    | 'triangle'
    | 'diamond'
    | 'hexagon'
    | 'pentagon'
    | 'star'
    | 'cross'
    | 'line'
    | 'arrow'
    | 'dot';

export type FillType = 'solid' | 'outline' | 'striped' | 'dotted' | 'gradient';

export type ShapeSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export type Position =
    | 'center'
    | 'top'
    | 'bottom'
    | 'left'
    | 'right'
    | 'top-left'
    | 'top-right'
    | 'bottom-left'
    | 'bottom-right';

export interface Shape {
    id: string;
    type: ShapeType;
    fill: FillType;
    color: string;
    size: ShapeSize;
    rotation?: number;          // degrees (0-360)
    position?: Position;        // where in the cell
    opacity?: number;           // 0-1
    strokeWidth?: number;       // for outlines
    innerShape?: Shape;         // nested shapes
}

// ============================================================================
// MATRIX CELL
// ============================================================================

export interface MatrixCell {
    id: string;
    shapes: Shape[];
    background?: string;
    isEmpty?: boolean;          // true for the "?" cell
}

// ============================================================================
// MATRIX RULES - The logic patterns users must deduce
// ============================================================================

export type RuleType =
    | 'progression'      // +1 element, +1 size, etc.
    | 'rotation'         // shapes rotate by fixed degrees
    | 'distribution'     // each row/col has each variant once
    | 'overlay'          // A + B = C (shapes combined)
    | 'subtraction'      // A - B = C (shapes removed)
    | 'color_cycle'      // colors rotate through cycle
    | 'size_cycle'       // sizes rotate through cycle
    | 'negation'         // fill inverts (solid <-> outline)
    | 'conditional';     // if X then Y, else Z

export interface ProgressionRule {
    type: 'progression';
    property: 'count' | 'size' | 'rotation' | 'opacity';
    direction: 'row' | 'col' | 'diagonal';
    step: number;        // +1, +2, etc.
}

export interface RotationRule {
    type: 'rotation';
    degrees: number;     // 45, 90, 180
    direction: 'row' | 'col';
}

export interface DistributionRule {
    type: 'distribution';
    elements: string[];  // ['circle', 'square', 'triangle']
    scope: 'row' | 'col' | 'both';
}

export interface OverlayRule {
    type: 'overlay';
    operation: 'add' | 'subtract' | 'xor';
    direction: 'row' | 'col';
}

export interface ColorCycleRule {
    type: 'color_cycle';
    colors: string[];
    direction: 'row' | 'col';
}

export interface SizeCycleRule {
    type: 'size_cycle';
    sizes: ShapeSize[];
    direction: 'row' | 'col';
}

export interface NegationRule {
    type: 'negation';
    direction: 'row' | 'col';
}

export interface ConditionalRule {
    type: 'conditional';
    condition: { property: string; value: any };
    thenApply: MatrixRule;
    elseApply: MatrixRule;
}

export type MatrixRule =
    | ProgressionRule
    | RotationRule
    | DistributionRule
    | OverlayRule
    | ColorCycleRule
    | SizeCycleRule
    | NegationRule
    | ConditionalRule;

// ============================================================================
// MATRIX PUZZLE
// ============================================================================

export interface MatrixPuzzle {
    id: string;
    grid: MatrixCell[][];       // 3x3 grid (last cell is question)
    options: MatrixCell[];      // 4-6 answer choices
    correctIndex: number;       // index of correct option
    rules: MatrixRule[];        // rules applied (for learning/explanation)
    difficulty: number;         // 1-10
    discrimination: number;     // IRT parameter (0.5-2.5)
    explanation: string;        // shown after answer
    category: MatrixCategory;
    timeLimit?: number;         // optional time limit in seconds
}

export type MatrixCategory =
    | 'progression'
    | 'rotation'
    | 'distribution'
    | 'overlay'
    | 'multi_rule'
    | 'conditional';

// ============================================================================
// COLOR PALETTE
// ============================================================================

export const MATRIX_COLORS = {
    primary: '#22d3ee',    // cyan
    secondary: '#a855f7',  // purple
    accent: '#f97316',     // orange
    success: '#22c55e',    // green
    danger: '#ef4444',     // red
    neutral: '#64748b',    // slate
    white: '#ffffff',
    black: '#000000',
} as const;

export const COLOR_CYCLES = {
    primary: ['#22d3ee', '#a855f7', '#f97316'],
    warm: ['#ef4444', '#f97316', '#eab308'],
    cool: ['#22d3ee', '#3b82f6', '#8b5cf6'],
    grayscale: ['#000000', '#64748b', '#ffffff'],
} as const;

// ============================================================================
// SIZE MAPPINGS (for SVG rendering)
// ============================================================================

export const SIZE_MAP: Record<ShapeSize, number> = {
    xs: 10,
    sm: 20,
    md: 35,
    lg: 50,
    xl: 70,
};

export const POSITION_MAP: Record<Position, { x: number; y: number }> = {
    'center': { x: 50, y: 50 },
    'top': { x: 50, y: 20 },
    'bottom': { x: 50, y: 80 },
    'left': { x: 20, y: 50 },
    'right': { x: 80, y: 50 },
    'top-left': { x: 25, y: 25 },
    'top-right': { x: 75, y: 25 },
    'bottom-left': { x: 25, y: 75 },
    'bottom-right': { x: 75, y: 75 },
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

export function createShape(
    type: ShapeType,
    overrides: Partial<Shape> = {}
): Shape {
    return {
        id: `shape_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        type,
        fill: 'solid',
        color: MATRIX_COLORS.primary,
        size: 'md',
        rotation: 0,
        position: 'center',
        opacity: 1,
        strokeWidth: 2,
        ...overrides,
    };
}

export function createCell(
    shapes: Shape[] = [],
    overrides: Partial<MatrixCell> = {}
): MatrixCell {
    return {
        id: `cell_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        shapes,
        isEmpty: false,
        ...overrides,
    };
}

export function createEmptyCell(): MatrixCell {
    return createCell([], { isEmpty: true });
}
