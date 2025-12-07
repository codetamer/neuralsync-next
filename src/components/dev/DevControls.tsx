'use client';

import { useState } from 'react';
import { useTestStore } from '../../store/useTestStore';
import { ChevronRight, ChevronLeft, FastForward, RotateCcw, Monitor } from 'lucide-react';
import { cn } from '../../lib/utils';
import { NeonButton } from '../ui/NeonButton';

export const DevControls = () => {
    const {
        currentStage,
        stages,
        nextStage,
        setStage,
        resetTest,
        isTestComplete
    } = useTestStore();

    const [isOpen, setIsOpen] = useState(false);
    const [targetStage, setTargetStage] = useState('');

    // Safety check just in case types mismatch
    const totalStages = stages?.length || 0;

    const handleJump = () => {
        const idx = parseInt(targetStage);
        if (!isNaN(idx)) {
            setStage(idx);
        }
    };

    const handleEnd = () => {
        setStage(totalStages + 1); // Force complete
    };

    if (!stages) return null;

    return (
        <div className="fixed bottom-4 right-4 z-[9999] font-mono">
            {/* Toggle Button */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="bg-black/80 border border-neon-cyan/50 text-neon-cyan p-2 rounded-lg hover:bg-neon-cyan/20 transition-colors shadow-[0_0_15px_rgba(34,211,238,0.3)]"
                    title="Open Dev Controls"
                >
                    <Monitor className="w-6 h-6" />
                </button>
            )}

            {/* Controls Panel */}
            {isOpen && (
                <div className="bg-black/95 border border-white/20 p-4 rounded-xl shadow-2xl backdrop-blur-md w-64 space-y-4">
                    <div className="flex justify-between items-center border-b border-white/10 pb-2 mb-2">
                        <span className="text-neon-cyan font-bold text-sm">DEV_CONTROLS</span>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="text-white/50 hover:text-white text-xs"
                        >
                            [CLOSE]
                        </button>
                    </div>

                    {/* Info */}
                    <div className="text-xs text-white/70 space-y-1">
                        <div className="flex justify-between">
                            <span>Status:</span>
                            <span className={isTestComplete ? "text-neon-green" : "text-neon-yellow"}>
                                {isTestComplete ? "COMPLETE" : "ACTIVE"}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span>Stage:</span>
                            <span className="text-white">
                                {currentStage + 1} <span className="text-white/40">/ {totalStages}</span>
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span>Type:</span>
                            <span className="text-neon-purple truncate max-w-[100px]">
                                {stages[currentStage]?.type || 'N/A'}
                            </span>
                        </div>
                    </div>

                    {/* Navigation */}
                    <div className="grid grid-cols-2 gap-2">
                        <button
                            onClick={() => setStage(Math.max(0, currentStage - 1))}
                            disabled={currentStage <= 0 || isTestComplete}
                            className="px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-md text-white text-xs flex items-center justify-center gap-1 disabled:opacity-30"
                        >
                            <ChevronLeft className="w-3 h-3" /> PREV
                        </button>
                        <button
                            onClick={nextStage}
                            disabled={isTestComplete}
                            className="px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-md text-white text-xs flex items-center justify-center gap-1 disabled:opacity-30"
                        >
                            NEXT <ChevronRight className="w-3 h-3" />
                        </button>
                    </div>

                    {/* Jump To */}
                    <div className="flex gap-2">
                        <input
                            type="number"
                            placeholder="#"
                            value={targetStage}
                            onChange={(e) => setTargetStage(e.target.value)}
                            className="w-full bg-black border border-white/20 text-white text-xs px-2 py-1 rounded focus:border-neon-cyan focus:outline-none"
                        />
                        <button
                            onClick={handleJump}
                            className="px-3 py-1 bg-neon-cyan/20 text-neon-cyan border border-neon-cyan/50 rounded-md text-xs hover:bg-neon-cyan/30"
                        >
                            JUMP
                        </button>
                    </div>

                    {/* Macros */}
                    <div className="space-y-2 pt-2 border-t border-white/10">
                        <button
                            onClick={handleEnd}
                            className="w-full px-3 py-2 bg-neon-green/10 text-neon-green border border-neon-green/30 rounded-md text-xs hover:bg-neon-green/20 flex items-center justify-center gap-2"
                        >
                            <FastForward className="w-3 h-3" /> FORCE COMPLETE
                        </button>
                        <button
                            onClick={resetTest}
                            className="w-full px-3 py-2 bg-neon-red/10 text-neon-red border border-neon-red/30 rounded-md text-xs hover:bg-neon-red/20 flex items-center justify-center gap-2"
                        >
                            <RotateCcw className="w-3 h-3" /> HARD RESET
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
