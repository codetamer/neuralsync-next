'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { MatrixPuzzle, MatrixCell } from '../../types/matrix';
import { MultiShapeRenderer } from './ShapeRenderer';
import { cn } from '../../lib/utils';
import { HelpCircle } from 'lucide-react';

interface MatrixRendererProps {
    puzzle: MatrixPuzzle;
    selectedIndex: number | null;
    onSelect: (index: number) => void;
    showFeedback?: boolean;
    isCorrect?: boolean;
}

/**
 * Renders a complete matrix puzzle with grid and answer options
 */
export const MatrixRenderer: React.FC<MatrixRendererProps> = ({
    puzzle,
    selectedIndex,
    onSelect,
    showFeedback = false,
    isCorrect = false,
}) => {
    return (
        <div className="matrix-puzzle w-full max-w-2xl mx-auto">
            {/* 3x3 Matrix Grid */}
            <div className="matrix-grid bg-neural-card/50 backdrop-blur-sm p-3 rounded-2xl border border-white/10">
                <div className="grid grid-cols-3 gap-2">
                    {puzzle.grid.flat().map((cell, idx) => (
                        <MatrixCellRenderer
                            key={cell.id || idx}
                            cell={cell}
                            isQuestionCell={idx === 8}
                        />
                    ))}
                </div>
            </div>

            {/* Answer Options */}
            <div className="mt-4">
                <p className="text-neural-muted text-xs mb-2 text-center font-mono">
                    SELECT THE MISSING PIECE
                </p>
                <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                    {puzzle.options.map((option, idx) => (
                        <motion.button
                            key={option.id || idx}
                            onClick={() => onSelect(idx)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className={cn(
                                "aspect-square rounded-xl border-2 p-2 transition-all duration-200",
                                "bg-neural-card/30 backdrop-blur-sm",
                                selectedIndex === idx && !showFeedback &&
                                "border-neon-cyan shadow-[0_0_20px_rgba(34,211,238,0.3)]",
                                selectedIndex !== idx && !showFeedback &&
                                "border-white/10 hover:border-white/30",
                                showFeedback && idx === puzzle.correctIndex &&
                                "border-neon-green shadow-[0_0_20px_rgba(34,197,94,0.5)]",
                                showFeedback && selectedIndex === idx && idx !== puzzle.correctIndex &&
                                "border-neon-red shadow-[0_0_20px_rgba(239,68,68,0.5)]",
                            )}
                            disabled={showFeedback}
                        >
                            <svg viewBox="0 0 100 100" className="w-full h-full">
                                <MultiShapeRenderer shapes={option.shapes} />
                            </svg>
                        </motion.button>
                    ))}
                </div>
            </div>

            {/* Feedback */}
            {showFeedback && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={cn(
                        "mt-6 p-4 rounded-xl text-center",
                        isCorrect
                            ? "bg-neon-green/10 border border-neon-green/30"
                            : "bg-neon-red/10 border border-neon-red/30"
                    )}
                >
                    <p className={cn(
                        "font-bold text-lg mb-2",
                        isCorrect ? "text-neon-green" : "text-neon-red"
                    )}>
                        {isCorrect ? "CORRECT" : "INCORRECT"}
                    </p>
                    <p className="text-neural-muted text-sm">
                        {puzzle.explanation}
                    </p>
                </motion.div>
            )}
        </div>
    );
};

/**
 * Renders a single cell in the matrix grid
 */
interface MatrixCellRendererProps {
    cell: MatrixCell;
    isQuestionCell?: boolean;
}

const MatrixCellRenderer: React.FC<MatrixCellRendererProps> = ({
    cell,
    isQuestionCell = false
}) => {
    return (
        <div
            className={cn(
                "aspect-square rounded-lg border p-2 flex items-center justify-center",
                "bg-gradient-to-br from-white/5 to-white/0",
                isQuestionCell
                    ? "border-neon-cyan/50 bg-neon-cyan/5"
                    : "border-white/10"
            )}
            style={{ backgroundColor: cell.background }}
        >
            {isQuestionCell || cell.isEmpty ? (
                <div className="flex items-center justify-center w-full h-full">
                    <HelpCircle className="w-8 h-8 text-neon-cyan/50" />
                </div>
            ) : (
                <svg viewBox="0 0 100 100" className="w-full h-full">
                    <MultiShapeRenderer shapes={cell.shapes} />
                </svg>
            )}
        </div>
    );
};

export default MatrixRenderer;
