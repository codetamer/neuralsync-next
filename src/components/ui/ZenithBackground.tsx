import React from 'react';

const ZenithBackground = () => {
    return (
        <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none bg-neural-bg">
            {/* Deep Space Base */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--color-neural-bg)_0%,_#000000_100%)] opacity-90" />

            {/* Drifting Aurora Orbs - Increased Opacity */}
            <div
                className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-neon-purple/30 blur-[100px] animate-[drift_25s_linear_infinite]"
                style={{ animationDelay: '0s' }}
            />
            <div
                className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-neon-teal/20 blur-[120px] animate-[drift_30s_linear_infinite_reverse]"
                style={{ animationDelay: '-5s' }}
            />
            <div
                className="absolute top-[40%] left-[60%] w-[40vw] h-[40vw] rounded-full bg-neon-blue/25 blur-[90px] animate-[float_15s_ease-in-out_infinite]"
                style={{ animationDelay: '-10s' }}
            />

            {/* Star Field (Static + Twinkle) - Increased Opacity */}
            <div className="absolute inset-0 opacity-60">
                <div className="absolute top-[10%] left-[20%] w-1 h-1 bg-white rounded-full animate-twinkle" style={{ animationDelay: '1s' }} />
                <div className="absolute top-[30%] left-[80%] w-1 h-1 bg-white rounded-full animate-twinkle" style={{ animationDelay: '3s' }} />
                <div className="absolute top-[70%] left-[40%] w-1 h-1 bg-white rounded-full animate-twinkle" style={{ animationDelay: '5s' }} />
                <div className="absolute top-[15%] left-[60%] w-[2px] h-[2px] bg-white rounded-full animate-twinkle" style={{ animationDelay: '0.5s' }} />
                <div className="absolute bottom-[20%] right-[30%] w-[2px] h-[2px] bg-white rounded-full animate-twinkle" style={{ animationDelay: '2.5s' }} />
                <div className="absolute top-[50%] left-[10%] w-[2px] h-[2px] bg-white rounded-full animate-twinkle" style={{ animationDelay: '4s' }} />
                {/* Add more static stars for texture */}
                <div className="absolute top-[5%] left-[90%] w-[1px] h-[1px] bg-white rounded-full opacity-70" />
                <div className="absolute top-[25%] left-[15%] w-[1px] h-[1px] bg-white rounded-full opacity-70" />
                <div className="absolute bottom-[10%] left-[50%] w-[1px] h-[1px] bg-white rounded-full opacity-70" />
                <div className="absolute top-[80%] right-[10%] w-[1px] h-[1px] bg-white rounded-full opacity-70" />
            </div>

            {/* Mesh Gradient Overlay */}
            <div className="absolute inset-0 bg-[image:var(--background-image-mesh-gradient)] opacity-50 mix-blend-screen" />

            {/* Noise Texture (Optional, for grain) */}
            <div className="absolute inset-0 opacity-[0.05] mix-blend-overlay"
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
            />
        </div>
    );
};

export default ZenithBackground;
