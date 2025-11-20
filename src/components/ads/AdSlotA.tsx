

export const AdSlotA = () => {
    return (
        <div className="w-full h-[50px] bg-neural-card border-b border-white/5 backdrop-blur-md flex items-center justify-center overflow-hidden relative z-50">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-neon-teal/5 to-transparent animate-pulse-slow" />

            <div className="container mx-auto px-4 flex items-center justify-between text-xs font-mono text-neural-muted">
                <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-neon-green animate-pulse" />
                    SYSTEM SPONSOR
                </div>

                {/* Placeholder for Ad Network Script */}
                <div className="flex-1 mx-8 h-[40px] flex items-center justify-center opacity-50 hover:opacity-100 transition-opacity">
                    <span className="tracking-widest">ADVERTISEMENT_SLOT_A_HEADER</span>
                </div>
            </div>
        </div>
    );
};
