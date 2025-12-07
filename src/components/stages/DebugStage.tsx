import { useTestStore } from '../../store/useTestStore';
import { GlassCard } from '../ui/GlassCard';
import { NeonButton } from '../ui/NeonButton';
import { RefreshCw, Bug, Home } from 'lucide-react';

export const DebugStage = () => {
    const { resetTest, returnToHome } = useTestStore();

    // Helper to open inspector logic (simulated by just resetting for now, usually user presses shortcut)
    // Actually, we can just reset to home or have a button that says "Press Ctrl+Shift+D"

    return (
        <div className="w-full max-w-2xl mx-auto flex flex-col gap-8 items-center justify-center min-h-[50vh]">
            <GlassCard className="p-12 flex flex-col gap-8 items-center text-center border-neon-teal/30">
                <div className="w-16 h-16 rounded-full bg-neon-teal/20 flex items-center justify-center text-neon-teal mb-4">
                    <Bug className="w-8 h-8" />
                </div>

                <div>
                    <h2 className="text-3xl font-display font-bold text-white mb-2">Debug Item Complete</h2>
                    <p className="text-neural-muted">The isolated stage inspection has finished.</p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 w-full">
                    <NeonButton
                        onClick={() => window.location.reload()} // Quickest way to "Replay" currently without complex state reset
                        variant="secondary"
                        className="flex-1"
                    >
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Replay Item
                    </NeonButton>

                    <NeonButton
                        onClick={returnToHome}
                        variant="primary"
                        className="flex-1"
                    >
                        <Home className="w-4 h-4 mr-2" />
                        Return Home
                    </NeonButton>
                </div>

                <div className="text-xs font-mono text-neural-muted mt-4 bg-black/40 p-2 rounded">
                    Press <span className="text-neon-teal">Ctrl + Shift + D</span> to inspect another item.
                </div>
            </GlassCard>
        </div>
    );
};
