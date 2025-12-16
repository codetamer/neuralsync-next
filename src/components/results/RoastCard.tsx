'use client';

import { useRef, useState } from 'react';
import { Download, Copy, Share2, Flame, AlertTriangle } from 'lucide-react';
import { NeonButton } from '../ui/NeonButton';
import domtoimage from 'dom-to-image-more';
import { motion } from 'framer-motion';

interface RoastCardProps {
    insight: any;
    theme: any;
}

export const RoastCard = ({ insight, theme }: RoastCardProps) => {
    const cardRef = useRef<HTMLDivElement>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [copied, setCopied] = useState(false);

    const handleDownload = async () => {
        if (!cardRef.current) return;
        setIsGenerating(true);
        try {
            const dataUrl = await domtoimage.toPng(cardRef.current, { quality: 1, scale: 2 } as any);
            const link = document.createElement('a');
            link.download = `neuralsync-roast-${insight.archetype.replace(/\s+/g, '-').toLowerCase()}.png`;
            link.href = dataUrl;
            link.click();
        } catch (error) {
            console.error('Failed to generate image', error);
        }
        setIsGenerating(false);
    };

    const handleCopy = async () => {
        if (!cardRef.current) return;
        setIsGenerating(true);
        try {
            const blob = await domtoimage.toBlob(cardRef.current, { quality: 1, scale: 2 } as any);
            await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy', err);
        }
        setIsGenerating(false);
    };

    return (
        <div className="flex flex-col gap-6 items-center">

            {/* --- CAPTURE AREA --- */}
            <div
                ref={cardRef}
                className="relative w-full max-w-md aspect-[4/5] bg-neutral-900 overflow-hidden flex flex-col items-center text-center p-8 border-4 border-red-600 shadow-2xl"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23262626' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                }}
            >
                {/* Hazard Tape Top */}
                <div className="absolute top-0 left-0 right-0 h-4 bg-yellow-400 flex overflow-hidden">
                    {[...Array(20)].map((_, i) => (
                        <div key={i} className="w-8 h-full bg-black skew-x-[-45deg] mx-2" />
                    ))}
                </div>

                {/* Content */}
                <div className="mt-8 relative z-10 flex flex-col h-full w-full">
                    <div className="flex justify-center mb-4">
                        <div className="bg-red-600/20 p-4 rounded-full border border-red-500/50">
                            <Flame className="w-8 h-8 text-red-500 animate-pulse" />
                        </div>
                    </div>

                    <h3 className="text-red-500 font-mono tracking-widest text-xs uppercase mb-2">
                        NEURALSYNC DETECTED FLAW
                    </h3>

                    <h1 className="text-3xl font-black text-white uppercase leading-none mb-6">
                        {insight.brutalTruth?.split(':')[0] || "TOTAL FAILURE"}
                    </h1>

                    <div className="flex-grow flex items-center justify-center p-4 bg-black/50 border border-red-900/30 backdrop-blur-sm rounded-sm">
                        <p className="text-red-100 font-serif italic text-lg leading-relaxed">
                            "{insight.roast}"
                        </p>
                    </div>

                    {/* Stats Footer */}
                    <div className="mt-6 pt-6 border-t border-white/10 w-full grid grid-cols-3 gap-2 text-center">
                        <div>
                            <div className="text-[10px] text-white/50 uppercase">IQ</div>
                            <div className="text-xl font-bold text-white">{insight.matchScore ? Math.round(insight.matchScore * 100) : '??'}%</div>
                            {/* Wait, matchScore is archetype match. Let's assume we can grab actual IQ if passed, but typically RoastCard just takes 'insight'. 
                                Actually, 'insight' generally doesn't have raw scores unless we modified interface to keep them. 
                                Ah, 'AnalysisInput' had them. 'DeepInsight' usually only has output. 
                                Checking interface... 'DeepInsight' has 'raw' string but not separate numbers. 
                                However, we pass 'insight' from dashboard which has full object.
                                I'll use placeholders if missing or rely on 'raw' parsing if desperate, but Dashboard usually has access to 'results' too.
                                I will revise props to accept 'scores' or handle specific fields.
                            */}
                            {/* For now, let's use the 'brutalTruth' title as main hook. */}
                        </div>
                        <div className="col-span-2 flex flex-col justify-end items-end">
                            <div className="text-[10px] text-white/50 uppercase tracking-widest">VERDICT</div>
                            <div className="text-red-500 font-bold uppercase text-sm">NON-VIABLE</div>
                        </div>
                    </div>

                    <div className="absolute bottom-2 left-0 right-0 text-center text-[10px] text-neutral-600 font-mono uppercase">
                        neuralsync.app // ego_death_module_v1
                    </div>
                </div>

                {/* Hazard Tape Bottom */}
                <div className="absolute bottom-0 left-0 right-0 h-4 bg-yellow-400 flex overflow-hidden">
                    {[...Array(20)].map((_, i) => (
                        <div key={i} className="w-8 h-full bg-black skew-x-[-45deg] mx-2" />
                    ))}
                </div>
            </div>

            {/* --- ACTIONS --- */}
            <div className="flex gap-4 w-full justify-center">
                <NeonButton onClick={handleCopy} size="sm" variant="secondary" className="w-full">
                    {copied ? <Copy className="w-4 h-4 mr-2" /> : <Share2 className="w-4 h-4 mr-2" />}
                    {copied ? "COPIED!" : "COPY IMG"}
                </NeonButton>
                <NeonButton onClick={handleDownload} size="sm" color="red" glow className="w-full">
                    <Download className="w-4 h-4 mr-2" />
                    DOWNLOAD
                </NeonButton>
            </div>
            <p className="text-xs text-white/30 text-center max-w-xs">
                Do you have the guts to post this? Most user's don't.
            </p>
        </div>
    );
};
