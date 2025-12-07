'use client';

import { useState, useEffect } from 'react';
import { useTestStore } from '../../store/useTestStore';
import { LOGIC_PUZZLES, VISUAL_PUZZLES, EQ_SCENARIOS, HEXACO_ITEMS } from '../../data/testContent';
import { StageType } from '../../engine/TestEngine';
import { Bug, X, Play, RefreshCw, ChevronRight, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../lib/utils';
import { NeonButton } from '../ui/NeonButton';

export const ContentInspector = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { stages, currentStage, resetTest } = useTestStore();
    const [expandedSection, setExpandedSection] = useState<string | null>('visual');

    // Shortcuts to toggle
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.ctrlKey && e.shiftKey && e.key === 'D') {
                setIsOpen(prev => !prev);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    const loadContent = (type: StageType, contentId?: string) => {
        // Direct store manipulation to force-load a stage
        // We create a temporary 1-stage session with this content
        useTestStore.setState({
            stages: [
                {
                    stage: 0,
                    type: type,
                    title: 'DEBUG INSPECTION',
                    difficulty: 5,
                    description: `Inspecting ${contentId || type}`,
                    contentId: contentId
                },
                {
                    stage: 1,
                    type: 'debug', // New handled type
                    title: 'DEBUG COMPLETE',
                    difficulty: 1,
                    description: 'End of inspection'
                }
            ],
            currentStage: 0,
            isTestComplete: false,
            responses: [],
            currentSection: type === 'bart' ? 'RISK' : 'IQ' // Approximate mapping
        });
        setIsOpen(false);
    };

    const sections = [
        {
            id: 'generic',
            title: 'Generic Stages (Test Types)',
            items: [
                { id: 'INTRO_TEST', label: 'Intro Screen', type: 'intro' as StageType },
                { id: 'OUTRO_TEST', label: 'Results / Certificate', type: 'outro' as StageType },
                { id: 'MATRIX_GEN', label: 'Matrix Stage (Random)', type: 'matrix' as StageType },
            ]
        },
        {
            id: 'visual',
            title: 'Visual Matrices',
            items: VISUAL_PUZZLES.map(p => ({ id: p.id, label: p.id, type: 'matrix' as StageType }))
        },
        {
            id: 'logic',
            title: 'Logic Puzzles',
            items: LOGIC_PUZZLES.map(p => ({ id: p.id, label: p.id, type: 'matrix' as StageType }))
        },
        {
            id: 'risk',
            title: 'Risk (BART)',
            items: [{ id: 'BART_DEMO', label: 'Standard BART Stage', type: 'bart' as StageType }]
        },
        {
            id: 'eq',
            title: 'EQ Scenarios',
            items: EQ_SCENARIOS.map(s => ({ id: s.id, label: s.id, type: 'scenario' as StageType }))
        },
        {
            id: 'personality',
            title: 'Personality',
            items: HEXACO_ITEMS.slice(0, 10).map(i => ({ id: i.id, label: `${i.id} (Sample)`, type: 'personality' as StageType }))
        }
    ];

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-4 right-4 z-[100] p-2 bg-black/80 text-neon-teal border border-neon-teal/30 rounded-full hover:bg-neon-teal/20 transition-all opacity-50 hover:opacity-100"
                title="Open Content Inspector (Ctrl+Shift+D)"
            >
                <Bug className="w-5 h-5" />
            </button>
        );
    }

    return (
        <AnimatePresence>
            <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                className="fixed inset-y-0 right-0 z-[100] w-96 bg-black/95 border-l border-neon-teal/30 shadow-2xl overflow-hidden flex flex-col backdrop-blur-md"
            >
                {/* Header */}
                <div className="p-4 border-b border-white/10 flex justify-between items-center bg-neural-card">
                    <div className="flex items-center gap-2 text-neon-teal">
                        <Bug className="w-5 h-5" />
                        <span className="font-display font-bold">CONTENT INSPECTOR</span>
                    </div>
                    <button onClick={() => setIsOpen(false)} className="text-white/50 hover:text-white">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content List */}
                <div className="flex-1 overflow-y-auto p-4 space-y-2">
                    <div className="text-xs text-neural-muted mb-4 p-2 bg-yellow-500/10 border border-yellow-500/20 rounded">
                        WARNING: Selecting an item will reset the current test session to specific debug content.
                    </div>

                    {sections.map(section => (
                        <div key={section.id} className="border border-white/10 rounded-lg overflow-hidden">
                            <button
                                onClick={() => setExpandedSection(expandedSection === section.id ? null : section.id)}
                                className="w-full p-3 flex justify-between items-center bg-white/5 hover:bg-white/10 transition-colors"
                            >
                                <span className={cn("font-mono text-sm", expandedSection === section.id ? "text-neon-teal" : "text-white")}>
                                    {section.title}
                                </span>
                                {expandedSection === section.id ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                            </button>

                            {expandedSection === section.id && (
                                <div className="bg-black/50 p-2 space-y-1">
                                    {section.items.map(item => (
                                        <button
                                            key={item.id}
                                            onClick={() => loadContent(item.type, item.id)}
                                            className="w-full text-left p-2 text-xs font-mono text-white/70 hover:text-neon-teal hover:bg-neon-teal/10 rounded flex items-center gap-2 group transition-all"
                                        >
                                            <Play className="w-3 h-3 opacity-0 group-hover:opacity-100" />
                                            {item.label}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Footer Controls */}
                <div className="p-4 border-t border-white/10 bg-neural-card">
                    <NeonButton onClick={resetTest} variant="secondary" size="sm" className="w-full">
                        <RefreshCw className="w-4 h-4 mr-2" />
                        RESET FULL TEST
                    </NeonButton>
                </div>
            </motion.div>
        </AnimatePresence>
    );
};
