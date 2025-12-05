import React from 'react';
import { cn } from '../../lib/utils';
import {
    Triangle, Circle, Square, Diamond,
    ArrowUp, ArrowRight, ArrowDown, ArrowLeft,
    Plus, X, Minus, Hexagon
} from 'lucide-react';

interface VisualPatternProps {
    type: 'grid' | 'sequence' | 'rotation' | 'odd-one-out';
    shapes: string[];
}

// Helper to render shape icon based on string ID
const renderShape = (shapeId: string, className?: string) => {
    const baseClasses = "w-full h-full text-neon-teal transition-all duration-300";

    // Size Modifiers
    let sizeClass = "w-full h-full";
    if (shapeId.includes('-sm')) sizeClass = "w-1/2 h-1/2";
    if (shapeId.includes('-md')) sizeClass = "w-3/4 h-3/4";
    if (shapeId.includes('-lg')) sizeClass = "w-full h-full";

    // Wrapper for sizing if needed
    const withSize = (content: React.ReactNode) => {
        if (shapeId.includes('-sm') || shapeId.includes('-md') || shapeId.includes('-lg')) {
            return <div className="w-full h-full flex items-center justify-center"><div className={sizeClass}>{content}</div></div>;
        }
        return content;
    };

    // Basic Shapes
    if (shapeId.includes('square')) {
        if (shapeId.includes('outline')) return withSize(<div className={cn("border-4 border-neon-teal w-full h-full", className)} />);
        if (shapeId.includes('dot')) return withSize(<div className={cn("border-4 border-neon-teal w-full h-full flex items-center justify-center", className)}><div className="w-2 h-2 bg-neon-teal rounded-full" /></div>);
        if (shapeId.includes('cross')) return withSize(<div className={cn("border-4 border-neon-teal w-full h-full flex items-center justify-center", className)}><X className="w-6 h-6 text-neon-teal" /></div>);
        return withSize(<div className={cn("bg-neon-teal w-full h-full", className)} />);
    }
    if (shapeId.includes('circle')) {
        if (shapeId.includes('outline')) return withSize(<div className={cn("border-4 border-neon-teal rounded-full w-full h-full", className)} />);
        if (shapeId.includes('dot')) return withSize(<div className={cn("border-4 border-neon-teal rounded-full w-full h-full flex items-center justify-center", className)}><div className="w-2 h-2 bg-neon-teal rounded-full" /></div>);
        if (shapeId.includes('cross')) return withSize(<div className={cn("border-4 border-neon-teal rounded-full w-full h-full flex items-center justify-center", className)}><X className="w-6 h-6 text-neon-teal" /></div>);
        return withSize(<div className={cn("bg-neon-teal rounded-full w-full h-full", className)} />);
    }
    if (shapeId.includes('triangle')) {
        if (shapeId.includes('outline')) return withSize(<Triangle className={cn(baseClasses, className)} strokeWidth={3} />);
        if (shapeId.includes('dot')) return withSize(<div className="relative w-full h-full"><Triangle className={cn(baseClasses, className)} strokeWidth={3} /><div className="absolute inset-0 flex items-center justify-center pt-2"><div className="w-2 h-2 bg-neon-teal rounded-full" /></div></div>);
        return withSize(<Triangle className={cn("fill-neon-teal", baseClasses, className)} />);
    }
    if (shapeId.includes('diamond')) {
        return withSize(<Diamond className={cn(baseClasses, className)} strokeWidth={shapeId.includes('lg') ? 3 : 2} />);
    }

    // Arrows
    if (shapeId === 'arrow-up') return <ArrowUp className={cn(baseClasses, className)} />;
    if (shapeId === 'arrow-right') return <ArrowRight className={cn(baseClasses, className)} />;
    if (shapeId === 'arrow-down') return <ArrowDown className={cn(baseClasses, className)} />;
    if (shapeId === 'arrow-left') return <ArrowLeft className={cn(baseClasses, className)} />;

    // Lines & Math
    if (shapeId === 'plus') return <Plus className={cn(baseClasses, className)} />;
    if (shapeId === 'line-h') return <Minus className={cn(baseClasses, className)} />;
    if (shapeId === 'line-v') return <div className={cn("w-1 h-full bg-neon-teal mx-auto", className)} />;

    // Dots/Bars
    if (shapeId.includes('dot') && !shapeId.includes('circle') && !shapeId.includes('square')) {
        const count = parseInt(shapeId.split('-')[0]) || 1;
        return (
            <div className="flex gap-1 flex-wrap justify-center content-center w-full h-full">
                {Array.from({ length: count }).map((_, i) => (
                    <div key={i} className="w-3 h-3 bg-neon-teal rounded-full" />
                ))}
            </div>
        );
    }
    if (shapeId.includes('bar')) {
        const count = parseInt(shapeId.split('-')[1]) || 1;
        return (
            <div className="flex flex-col gap-1 justify-center w-full h-full">
                {Array.from({ length: count }).map((_, i) => (
                    <div key={i} className="w-full h-2 bg-neon-teal rounded-full" />
                ))}
            </div>
        );
    }

    // Clock
    if (shapeId.includes('clock')) {
        const timeStr = shapeId.split('-')[1];
        const time = parseInt(timeStr) || 12;
        const rotation = (time / 12) * 360;

        return (
            <div className="relative w-full h-full border-4 border-neon-teal rounded-full">
                <div
                    className="absolute top-1/2 left-1/2 w-1/2 h-1 bg-neon-teal origin-left -translate-y-1/2"
                    style={{ transform: `rotate(${rotation - 90}deg)` }}
                />
            </div>
        );
    }

    // --- NEW SHAPES IMPLEMENTATION ---

    // Spirals
    if (shapeId.includes('spiral')) {
        const isCCW = shapeId.includes('ccw');
        const isRotated = shapeId.includes('rot');
        const isDistorted = shapeId.includes('distorted');

        return (
            <svg viewBox="0 0 24 24" className={cn(
                "w-full h-full text-neon-teal transition-all",
                isRotated && "rotate-90",
                isDistorted && "skew-x-12 scale-x-75",
                isCCW && "-scale-x-100"
            )}>
                <path
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    d="M12 12c0-3 2.5-5.5 5.5-5.5S23 9 23 12s-2.5 5.5-5.5 5.5S12 15 12 12zm0 0c0 3-2.5 5.5-5.5 5.5S1 15 1 12s2.5-5.5 5.5-5.5S12 9 12 12z"
                    className="opacity-80"
                />
                <path
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    d="M12 12m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0"
                />
            </svg>
        );
    }

    // L-Shapes & F-Shapes (Block letters)
    if (shapeId.includes('L-shape') || shapeId.includes('Z-shape')) {
        if (shapeId === 'Z-shape') {
            return (
                <div className="w-full h-full flex flex-col justify-center items-center">
                    <div className="flex">
                        <div className="w-6 h-6 bg-neon-teal" />
                        <div className="w-6 h-6 bg-neon-teal" />
                    </div>
                    <div className="flex translate-x-6">
                        <div className="w-6 h-6 bg-neon-teal" />
                        <div className="w-6 h-6 bg-neon-teal" />
                    </div>
                </div>
            );
        }
        // L-Shape variants
        const isFlip = shapeId.includes('flip');
        const isRot90 = shapeId.includes('90');
        const isDistorted = shapeId.includes('distorted');

        return (
            <div className={cn(
                "w-full h-full flex items-center justify-center transition-all",
                isFlip && "-scale-x-100",
                isRot90 && "rotate-90",
                isDistorted && "skew-y-12"
            )}>
                <div className="relative w-12 h-16">
                    <div className="absolute left-0 top-0 w-4 h-16 bg-neon-teal" />
                    <div className="absolute left-0 bottom-0 w-12 h-4 bg-neon-teal" />
                </div>
            </div>
        );
    }

    if (shapeId.includes('F-shape') || shapeId.includes('E-shape') || shapeId.includes('T-shape')) {
        if (shapeId === 'E-shape') return <div className="text-6xl font-black text-neon-teal font-mono">E</div>;
        if (shapeId === 'T-shape') return <div className="text-6xl font-black text-neon-teal font-mono">T</div>;

        const is180 = shapeId.includes('180');
        const isMirror = shapeId.includes('mirror');

        return (
            <div className={cn(
                "w-full h-full flex items-center justify-center transition-all",
                is180 && "rotate-180",
                isMirror && "-scale-x-100"
            )}>
                <div className="relative w-12 h-16">
                    <div className="absolute left-0 top-0 w-4 h-16 bg-neon-teal" />
                    <div className="absolute left-0 top-0 w-12 h-4 bg-neon-teal" />
                    <div className="absolute left-0 top-6 w-8 h-4 bg-neon-teal" />
                </div>
            </div>
        );
    }

    // Cube Patterns
    if (shapeId.includes('cube-pattern')) {
        const type = shapeId.split('-')[2]; // A, B, C, D
        const isRot = shapeId.includes('rot');

        return (
            <div className={cn("w-full h-full flex items-center justify-center", isRot && "rotate-90")}>
                <div className="w-16 h-16 border-4 border-neon-teal relative bg-neural-bg/50">
                    {type === 'A' && <div className="absolute inset-0 bg-neon-teal/20" />}
                    {type === 'B' && <div className="absolute inset-2 border-2 border-neon-teal" />}
                    {type === 'C' && <div className="absolute inset-0 flex items-center justify-center"><div className="w-8 h-8 bg-neon-teal rounded-full" /></div>}
                    {type === 'D' && <div className="absolute inset-0 flex items-center justify-center"><X className="w-12 h-12 text-neon-teal" /></div>}
                </div>
            </div>
        );
    }

    // Polygons
    if (shapeId.includes('poly')) {
        const sides = parseInt(shapeId.split('-')[1]) || 3;

        // Triangle/Square/Hexagon optimization (Keep existing icons if desired, or use dynamic for all)
        if (sides === 3) return <Triangle className={cn(baseClasses, className)} />;
        if (sides === 4) return <Square className={cn(baseClasses, className)} />;
        if (sides === 6) return <Hexagon className={cn(baseClasses, className)} />;

        // Dynamic Polygon Generation for 5, 7, 8, etc.
        const radius = 10;
        const center = 12;
        const points = Array.from({ length: sides }).map((_, i) => {
            const angle = (i * 2 * Math.PI / sides) - (Math.PI / 2); // Start at top
            const x = center + radius * Math.cos(angle);
            const y = center + radius * Math.sin(angle);
            return `${x},${y}`;
        }).join(' ');

        return (
            <svg viewBox="0 0 24 24" className={cn(baseClasses, className)} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polygon points={points} />
            </svg>
        );
    }

    // Moons
    if (shapeId.includes('moon') || shapeId === 'sun') {
        if (shapeId === 'sun') return <div className="w-full h-full flex items-center justify-center"><div className="w-12 h-12 bg-neon-teal rounded-full shadow-[0_0_20px_currentColor]" /></div>;

        const phase = shapeId.split('-')[1];
        return (
            <div className="w-full h-full flex items-center justify-center">
                <div className="w-12 h-12 rounded-full border-2 border-neon-teal relative overflow-hidden">
                    {phase === 'full' && <div className="absolute inset-0 bg-neon-teal" />}
                    {phase === 'new' && <div className="absolute inset-0 bg-neural-bg" />}
                    {phase === 'half' && <div className="absolute inset-0 bg-neon-teal w-1/2" />}
                    {phase === 'crescent' && <div className="absolute inset-0 bg-neon-teal rounded-full -translate-x-4" />}
                    {phase === 'gibbous' && <div className="absolute inset-0 bg-neon-teal rounded-full translate-x-2" />}
                </div>
            </div>
        );
    }

    // Grids (Dot movement)
    if (shapeId.includes('grid-')) {
        const pos = shapeId.split('-')[1]; // tl, tr, br, bl, center
        return (
            <div className="w-full h-full grid grid-cols-2 gap-1 p-2 border-2 border-neon-teal/50 rounded-lg">
                <div className={cn("rounded-sm transition-colors", pos === 'tl' ? "bg-neon-teal" : "bg-white/10")} />
                <div className={cn("rounded-sm transition-colors", pos === 'tr' ? "bg-neon-teal" : "bg-white/10")} />
                <div className={cn("rounded-sm transition-colors", pos === 'bl' ? "bg-neon-teal" : "bg-white/10")} />
                <div className={cn("rounded-sm transition-colors", pos === 'br' ? "bg-neon-teal" : "bg-white/10")} />
            </div>
        );
    }

    // Odd One Out Shapes
    if (shapeId === 'oval') return <div className="w-full h-12 rounded-[50%] border-4 border-neon-teal my-auto" />;
    if (shapeId === 'ellipse') return <div className="w-full h-16 rounded-[50%] border-4 border-neon-teal my-auto rotate-45" />;

    if (shapeId.includes('parallel')) {
        const type = shapeId.split('-')[1];
        return (
            <div className={cn("w-full h-full flex gap-2 justify-center items-center", type === 'v' && "flex-row", type === 'h' && "flex-col", type === 'd' && "rotate-45 flex-col")}>
                <div className={cn("bg-neon-teal rounded-full", type === 'h' || type === 'd' ? "w-16 h-2" : "w-2 h-16")} />
                <div className={cn("bg-neon-teal rounded-full", type === 'h' || type === 'd' ? "w-16 h-2" : "w-2 h-16")} />
            </div>
        );
    }
    if (shapeId === 'intersecting') return <Plus className={cn(baseClasses, className)} />;

    if (shapeId.includes('3D')) {
        if (shapeId.includes('cube')) return <div className="w-12 h-12 border-4 border-neon-teal transform rotate-12 skew-x-12 bg-neon-teal/20" />;
        if (shapeId.includes('sphere')) return <div className="w-12 h-12 rounded-full border-4 border-neon-teal bg-gradient-to-br from-neon-teal/50 to-black" />;
        if (shapeId.includes('pyramid')) return <Triangle className={cn(baseClasses, className)} />;
        if (shapeId.includes('2D')) return <div className="w-12 h-12 border-4 border-neon-teal" />;
    }

    if (shapeId.includes('fill')) {
        const amount = parseInt(shapeId.split('-')[1]) || 0;
        return (
            <div className="w-12 h-12 border-4 border-neon-teal relative overflow-hidden">
                <div className="absolute bottom-0 left-0 right-0 bg-neon-teal transition-all" style={{ height: `${amount}%` }} />
            </div>
        );
    }
    if (shapeId === 'outline') return <div className="w-12 h-12 border-4 border-neon-teal" />;

    if (shapeId.includes('sym') || shapeId === 'asym') {
        return (
            <div className="w-full h-full flex items-center justify-center">
                <div className={cn(
                    "w-12 h-12 border-2 border-neon-teal relative",
                    shapeId === 'sym-x' && "rounded-t-full",
                    shapeId === 'sym-y' && "rounded-l-full",
                    shapeId === 'sym-xy' && "rounded-full",
                    shapeId === 'asym' && "rounded-tl-[30px] rounded-br-[10px]"
                )} />
            </div>
        );
    }

    if (shapeId.includes('triangle-asym')) {
        const isMirror = shapeId.includes('mirror');
        const isRot = shapeId.includes('rot');
        return (
            <svg viewBox="0 0 24 24" className={cn("w-full h-full text-neon-teal", isMirror && "-scale-x-100", isRot && "rotate-90")}>
                <path fill="currentColor" d="M2 22 L22 22 L10 2 Z" />
            </svg>
        );
    }
    if (shapeId === 'triangle-equi') return <Triangle className={cn(baseClasses, className)} />;
    if (shapeId === 'triangle-iso') return <Triangle className={cn(baseClasses, "scale-x-50", className)} />;

    // Fallback text
    return <div className="w-full h-full flex items-center justify-center text-xs font-mono text-neon-teal/50">{shapeId}</div>;
};

export const VisualPattern = ({ type, shapes }: VisualPatternProps) => {
    if (type === 'grid') {
        return (
            <div className="grid grid-cols-3 gap-4 w-full max-w-md aspect-square p-4 bg-neural-card rounded-xl border border-white/10">
                {shapes.map((shape, i) => (
                    <div key={i} className="aspect-square bg-white/5 rounded-lg flex items-center justify-center p-4 border border-white/5 overflow-hidden">
                        {shape === '?' ? <span className="text-4xl text-neon-teal font-bold animate-pulse">?</span> : renderShape(shape)}
                    </div>
                ))}
            </div>
        );
    }

    if (type === 'sequence') {
        return (
            <div className="flex gap-4 w-full max-w-3xl justify-center items-center p-8 bg-neural-card rounded-xl border border-white/10 overflow-x-auto">
                {shapes.map((shape, i) => (
                    <div key={i} className="w-24 h-24 flex-shrink-0 bg-white/5 rounded-lg flex items-center justify-center p-4 border border-white/5">
                        {shape === '?' ? <span className="text-4xl text-neon-teal font-bold animate-pulse">?</span> : renderShape(shape)}
                    </div>
                ))}
            </div>
        );
    }

    if (type === 'rotation') {
        return (
            <div className="flex justify-center items-center p-12 bg-neural-card rounded-xl border border-white/10">
                <div className="w-40 h-40 bg-white/5 rounded-lg flex items-center justify-center p-8 border border-white/5 shadow-[0_0_30px_rgba(34,211,238,0.1)]">
                    {renderShape(shapes[0])}
                </div>
            </div>
        );
    }

    if (type === 'odd-one-out') {
        return (
            <div className="grid grid-cols-4 gap-4 w-full max-w-3xl p-6 bg-neural-card rounded-xl border border-white/10">
                {shapes.map((shape, i) => (
                    <div key={i} className="aspect-square bg-white/5 rounded-lg flex items-center justify-center p-4 border border-white/5">
                        {renderShape(shape)}
                    </div>
                ))}
            </div>
        );
    }

    return null;
};

// Export helper for use in options
export { renderShape };
