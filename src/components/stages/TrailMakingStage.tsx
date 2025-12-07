'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTestStore } from '../../store/useTestStore';
import { NeonButton } from '../ui/NeonButton';
import { GlassCard } from '../ui/GlassCard';
import { audio } from '../../engine/AudioEngine';
import { Route, ArrowRight, Timer } from 'lucide-react';

type TrailMode = 'A' | 'B';

interface TrailNode {
    id: string;
    label: string;
    x: number;
    y: number;
    visited: boolean;
}

// Generate random but non-overlapping positions
const generatePositions = (count: number): { x: number; y: number }[] => {
    const positions: { x: number; y: number }[] = [];
    const minDistance = 15; // Minimum distance between nodes (percentage)

    for (let i = 0; i < count; i++) {
        let attempts = 0;
        let pos: { x: number; y: number };

        do {
            pos = {
                x: 10 + Math.random() * 80, // 10-90% range
                y: 10 + Math.random() * 80
            };
            attempts++;
        } while (
            attempts < 50 &&
            positions.some(p =>
                Math.sqrt(Math.pow(p.x - pos.x, 2) + Math.pow(p.y - pos.y, 2)) < minDistance
            )
        );

        positions.push(pos);
    }

    return positions;
};

interface TrailMakingStageProps {
    mode?: TrailMode;
}

export const TrailMakingStage = ({ mode = 'A' }: TrailMakingStageProps) => {
    const { recordResponse, nextStage } = useTestStore();

    // Game state
    const [phase, setPhase] = useState<'instructions' | 'playing' | 'complete'>('instructions');
    const [nodes, setNodes] = useState<TrailNode[]>([]);
    const [currentTarget, setCurrentTarget] = useState(0);
    const [visitedPath, setVisitedPath] = useState<TrailNode[]>([]);
    const [errors, setErrors] = useState(0);
    const [startTime, setStartTime] = useState<number>(0);
    const [elapsedTime, setElapsedTime] = useState(0);
    const [errorFlash, setErrorFlash] = useState<string | null>(null);

    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const NODE_COUNT = mode === 'A' ? 12 : 12; // 12 nodes for both modes

    // Generate trail nodes
    const generateNodes = useCallback((): TrailNode[] => {
        const positions = generatePositions(NODE_COUNT);
        const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

        if (mode === 'A') {
            // Trail A: Just numbers 1-12
            return positions.map((pos, idx) => ({
                id: `node-${idx}`,
                label: String(idx + 1),
                x: pos.x,
                y: pos.y,
                visited: false
            }));
        } else {
            // Trail B: Alternating 1-A-2-B-3-C...
            return positions.map((pos, idx) => ({
                id: `node-${idx}`,
                label: idx % 2 === 0 ? String(Math.floor(idx / 2) + 1) : letters[Math.floor(idx / 2)],
                x: pos.x,
                y: pos.y,
                visited: false
            }));
        }
    }, [mode, NODE_COUNT]);

    // Get correct sequence
    const getCorrectSequence = (): string[] => {
        if (mode === 'A') {
            return Array.from({ length: NODE_COUNT }, (_, i) => String(i + 1));
        } else {
            const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
            const seq: string[] = [];
            for (let i = 0; i < NODE_COUNT / 2; i++) {
                seq.push(String(i + 1));
                seq.push(letters[i]);
            }
            return seq;
        }
    };

    // Start game
    const startGame = () => {
        const newNodes = generateNodes();
        setNodes(newNodes);
        setCurrentTarget(0);
        setVisitedPath([]);
        setErrors(0);
        setStartTime(Date.now());
        setElapsedTime(0);
        setPhase('playing');

        // Start timer
        timerRef.current = setInterval(() => {
            setElapsedTime(Date.now() - Date.now() + (Date.now() - startTime));
        }, 100);
    };

    // Update timer
    useEffect(() => {
        if (phase !== 'playing') return;

        timerRef.current = setInterval(() => {
            setElapsedTime(Date.now() - startTime);
        }, 100);

        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [phase, startTime]);

    // Handle node click
    const handleNodeClick = (node: TrailNode) => {
        if (phase !== 'playing' || node.visited) return;

        const correctSequence = getCorrectSequence();
        const expectedLabel = correctSequence[currentTarget];

        if (node.label === expectedLabel) {
            // Correct!
            audio.playClick();
            const updatedNodes = nodes.map(n =>
                n.id === node.id ? { ...n, visited: true } : n
            );
            setNodes(updatedNodes);
            setVisitedPath(prev => [...prev, node]);
            setCurrentTarget(prev => prev + 1);

            // Check if complete
            if (currentTarget + 1 >= NODE_COUNT) {
                finishTask();
            }
        } else {
            // Error!
            audio.playError();
            setErrors(prev => prev + 1);
            setErrorFlash(node.id);
            setTimeout(() => setErrorFlash(null), 300);
        }
    };

    // Finish task
    const finishTask = () => {
        if (timerRef.current) clearInterval(timerRef.current);

        // Ensure startTime is valid to avoid "millions of seconds" bug (Date.now() - 0)
        const completionTime = startTime > 0 ? Date.now() - startTime : 0;
        setElapsedTime(completionTime);
        setPhase('complete');

        // Score: penalize for errors (add 1 second per error)
        const adjustedTime = completionTime + (errors * 1000);

        recordResponse({
            choice: Math.round(adjustedTime / 1000), // Store time in seconds
            latency_ms: completionTime,
            accuracy: errors <= 2 // Good if 2 or fewer errors
        });

        setTimeout(nextStage, 2500);
    };

    // Format time
    const formatTime = (ms: number) => {
        const seconds = Math.floor(ms / 1000);
        const tenths = Math.floor((ms % 1000) / 100);
        return `${seconds}.${tenths}s`;
    };

    // Cleanup
    useEffect(() => {
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, []);

    return (
        <GlassCard className="max-w-2xl mx-auto p-8">
            <AnimatePresence mode="wait">
                {/* Instructions */}
                {phase === 'instructions' && (
                    <motion.div
                        key="instructions"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="text-center space-y-6"
                    >
                        <div className="w-16 h-16 mx-auto bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-2xl flex items-center justify-center">
                            <Route className="w-8 h-8 text-orange-400" />
                        </div>

                        <h2 className="text-2xl font-bold text-white">
                            Trail Making {mode}
                        </h2>

                        <div className="text-white/70 space-y-4 text-left max-w-md mx-auto">
                            {mode === 'A' ? (
                                <>
                                    <p>Click the circles in <span className="text-neon-cyan font-semibold">numerical order</span>:</p>
                                    <p className="text-center text-xl text-white">1 → 2 → 3 → 4 → ...</p>
                                </>
                            ) : (
                                <>
                                    <p>Click the circles <span className="text-neon-cyan font-semibold">alternating between numbers and letters</span>:</p>
                                    <p className="text-center text-xl text-white">1 → A → 2 → B → 3 → C → ...</p>
                                </>
                            )}
                            <p>Complete the trail as <span className="text-orange-400 font-semibold">quickly</span> as possible with minimal errors.</p>
                        </div>

                        <div className="flex justify-center">
                            <NeonButton onClick={startGame}>
                                Start <ArrowRight className="w-4 h-4 ml-2" />
                            </NeonButton>
                        </div>
                    </motion.div>
                )}

                {/* Playing */}
                {phase === 'playing' && (
                    <motion.div
                        key="playing"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="space-y-4"
                    >
                        {/* Header */}
                        <div className="flex justify-between items-center">
                            <div className="text-white/50">
                                Next: <span className="text-neon-cyan font-bold">{getCorrectSequence()[currentTarget]}</span>
                            </div>
                            <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full">
                                <Timer className="w-4 h-4 text-orange-400" />
                                <span className="font-mono text-white">{formatTime(elapsedTime)}</span>
                            </div>
                            <div className="text-red-400">
                                Errors: {errors}
                            </div>
                        </div>

                        {/* Trail area */}
                        <div className="relative w-full aspect-square bg-white/5 rounded-2xl border border-white/10 overflow-hidden">
                            {/* Connection lines */}
                            <svg className="absolute inset-0 w-full h-full pointer-events-none">
                                {visitedPath.length > 1 && visitedPath.slice(0, -1).map((node, idx) => {
                                    const nextNode = visitedPath[idx + 1];
                                    return (
                                        <line
                                            key={`line-${idx}`}
                                            x1={`${node.x}%`}
                                            y1={`${node.y}%`}
                                            x2={`${nextNode.x}%`}
                                            y2={`${nextNode.y}%`}
                                            stroke="#22d3ee"
                                            strokeWidth="2"
                                            className="drop-shadow-[0_0_5px_rgba(34,211,238,0.5)]"
                                        />
                                    );
                                })}
                            </svg>

                            {/* Nodes */}
                            {nodes.map(node => (
                                <button
                                    key={node.id}
                                    onClick={() => handleNodeClick(node)}
                                    style={{
                                        position: 'absolute',
                                        left: `${node.x}%`,
                                        top: `${node.y}%`
                                    }}
                                    className={`
                                        absolute transform -translate-x-1/2 -translate-y-1/2
                                        w-10 h-10 md:w-14 md:h-14 rounded-full 
                                        flex items-center justify-center text-lg md:text-xl font-bold 
                                        transition-all duration-200 
                                        hover:scale-110 active:scale-95 hover:z-10
                                        ${node.visited
                                            ? 'bg-neon-cyan text-black shadow-[0_0_20px_rgba(34,211,238,0.6)] border-none scale-100'
                                            : errorFlash === node.id
                                                ? 'bg-red-500 text-white shadow-[0_0_20px_rgba(239,68,68,0.6)] animate-pulse border-none'
                                                : 'bg-white/10 text-white backdrop-blur-md border border-white/20 hover:bg-white/20 hover:border-neon-cyan/50 hover:shadow-[0_0_15px_rgba(34,211,238,0.3)]'
                                        }
                                    `}
                                >
                                    {node.label}
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* Complete */}
                {phase === 'complete' && (
                    <motion.div
                        key="complete"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center space-y-6"
                    >
                        <div className="w-20 h-20 mx-auto bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-full flex items-center justify-center">
                            <Route className="w-10 h-10 text-orange-400" />
                        </div>

                        <div>
                            <div className="text-2xl font-bold text-white">Trail Complete!</div>
                            <div className="text-orange-400 text-lg mt-2 font-mono">
                                Time: {formatTime(elapsedTime)}
                            </div>
                            <div className="text-white/50 mt-1">
                                Errors: {errors}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </GlassCard>
    );
};
