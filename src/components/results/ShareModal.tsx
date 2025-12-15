import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toPng, toBlob } from 'html-to-image';
import { X, Download, Copy, Share2, Check, Brain, Heart, Zap, TrendingUp, Smartphone, Layout, Award } from 'lucide-react';
import { NeonButton } from '../ui/NeonButton';
import { useTestStore } from '../../store/useTestStore';
import { RankBadge } from '../ui/RankBadge';

interface ShareModalProps {
    isOpen: boolean;
    onClose: () => void;
    scores: {
        iq: number;
        iqPercentile: number;
        eq: number;
        eqPercentile: number;
        riskTolerance: number;
        hexaco: {
            honesty: number;
            emotionality: number;
            extraversion: number;
            agreeableness: number;
            conscientiousness: number;
            openness: number;
        };
        apexTrait: { trait: string; score: number; description: string };
    };
    archetype?: string;
}

export const ShareModal = ({ isOpen, onClose, scores, archetype = "Adaptive Generalist" }: ShareModalProps) => {
    const [copied, setCopied] = useState(false);
    const [isCapturing, setIsCapturing] = useState(false);
    const [shareMode, setShareMode] = useState<'classic' | 'story'>('classic');
    const { elo, rankTier } = useTestStore();
    const cardRef = useRef<HTMLDivElement>(null);

    const handleDownload = async () => {
        if (!cardRef.current) return;
        setIsCapturing(true);

        try {
            await new Promise(resolve => setTimeout(resolve, 500));

            const dataUrl = await toPng(cardRef.current, {
                cacheBust: true,
                pixelRatio: 3,
                quality: 0.95,
                backgroundColor: '#050505',
                style: { margin: '0' }
            });

            const link = document.createElement('a');
            link.href = dataUrl;
            link.download = `neuralsync-${shareMode}-${Date.now()}.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error('Download failed:', error);
            alert('Failed to generate image. Please try again.');
        } finally {
            setIsCapturing(false);
        }
    };

    const handleCopyImage = async () => {
        if (!cardRef.current) return;
        setIsCapturing(true);

        try {
            await new Promise(resolve => setTimeout(resolve, 500));
            const blob = await toBlob(cardRef.current, {
                cacheBust: true,
                pixelRatio: 3,
                quality: 0.95,
                backgroundColor: '#050505',
                style: { margin: '0' }
            });

            if (blob) {
                await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            }
        } catch (error) {
            console.error('Copy failed:', error);
            alert('Failed to copy. Please try downloading instead.');
        } finally {
            setIsCapturing(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neural-bg/80 backdrop-blur-sm">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="bg-neural-bg border border-white/10 rounded-2xl max-w-4xl w-full max-h-[95vh] flex flex-col shadow-2xl overflow-hidden"
                    >
                        <div className="p-4 border-b border-white/10 flex justify-between items-center bg-neural-bg z-10">
                            <h3 className="text-lg md:text-xl font-display font-bold text-white flex items-center gap-2">
                                <Share2 className="w-4 h-4 md:w-5 md:h-5 text-neon-teal" />
                                SHARE RANKING
                            </h3>
                            <button onClick={onClose} className="text-white/50 hover:text-white transition-colors">
                                <X className="w-5 h-5 md:w-6 md:h-6" />
                            </button>
                        </div>

                        {/* Mode Selector */}
                        <div className="flex justify-center p-4 bg-white/5 border-b border-white/5 z-10">
                            <div className="bg-neural-card border border-white/10 rounded-lg p-1 flex gap-1">
                                <button
                                    onClick={() => setShareMode('classic')}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-md text-xs font-bold transition-all ${shareMode === 'classic'
                                        ? 'bg-neon-teal text-neural-bg shadow-sm'
                                        : 'text-white/50 hover:text-white hover:bg-white/5'
                                        }`}
                                >
                                    <Layout className="w-3.5 h-3.5" />
                                    CLASSIC CARD
                                </button>
                                <button
                                    onClick={() => setShareMode('story')}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-md text-xs font-bold transition-all ${shareMode === 'story'
                                        ? 'bg-neon-teal text-neural-bg shadow-sm'
                                        : 'text-white/50 hover:text-white hover:bg-white/5'
                                        }`}
                                >
                                    <Smartphone className="w-3.5 h-3.5" />
                                    STORY MODE
                                </button>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4 md:p-6 flex flex-col items-center justify-start bg-grid-white/[0.02]">

                            {/* RENDER CARD CONTAINER */}
                            <div
                                ref={cardRef}
                                className={`
                                    bg-gradient-to-br from-neural-bg via-slate-900 to-neural-bg 
                                    border border-white/20 shadow-2xl relative overflow-hidden my-auto
                                    ${shareMode === 'story'
                                        ? 'aspect-[9/16] w-[360px] p-6 flex flex-col justify-between shrink-0'
                                        : 'w-full max-w-[500px] p-6 rounded-2xl shrink-0'
                                    }
                                `}
                            >
                                {/* Background Patterns */}
                                <div className="absolute inset-0 z-0 opacity-20 bg-[radial-gradient(circle_at_50%_0%,rgba(45,212,191,0.2),transparent_70%)]" />

                                <div className="relative z-10">
                                    {/* Header */}
                                    <div className="flex items-center justify-between mb-6">
                                        <div className="flex items-center gap-2">
                                            <Brain className="w-5 h-5 text-neon-teal" />
                                            <span className="font-display font-bold text-white tracking-widest text-sm">NEURAL<span className="text-neon-teal">SYNC</span></span>
                                        </div>
                                        <div className="px-2 py-1 bg-white/5 rounded text-[10px] font-mono text-white/50 border border-white/5">
                                            VERIFIED
                                        </div>
                                    </div>

                                    {shareMode === 'story' ? (
                                        // --- STORY LAYOUT ---
                                        <div className="flex flex-col items-center gap-6 mt-4">
                                            <div className="relative">
                                                <div className="absolute inset-0 bg-neon-teal/20 blur-3xl rounded-full" />
                                                <RankBadge tier={rankTier} size="xl" showLabel />
                                            </div>

                                            <div className="text-center space-y-2">
                                                <h1 className="text-4xl font-display font-bold text-white tracking-tight">{elo}</h1>
                                                <p className="text-neon-blue font-mono text-xs tracking-widest uppercase">Global Rank: {rankTier}</p>
                                            </div>

                                            <div className="w-full space-y-3 mt-4">
                                                <div className="bg-white/5 border border-white/10 rounded-xl p-3 flex justify-between items-center">
                                                    <span className="text-xs text-white/70 font-mono">Archetype</span>
                                                    <span className="text-sm font-bold text-neon-purple">{archetype}</span>
                                                </div>
                                                <div className="bg-white/5 border border-white/10 rounded-xl p-3 flex justify-between items-center">
                                                    <span className="text-xs text-white/70 font-mono">Top Trait</span>
                                                    <span className="text-sm font-bold text-neon-green">{scores.apexTrait.trait}</span>
                                                </div>
                                                <div className="bg-white/5 border border-white/10 rounded-xl p-3 flex justify-between items-center">
                                                    <span className="text-xs text-white/70 font-mono">IQ Percentile</span>
                                                    <span className="text-sm font-bold text-neon-blue">Top {Math.max(1, 100 - scores.iqPercentile)}%</span>
                                                </div>
                                            </div>

                                            <div className="mt-8 text-center text-white/30 text-[10px] font-mono">
                                                Beat my score at neuralsync.ai
                                            </div>
                                        </div>
                                    ) : (
                                        // --- CLASSIC LAYOUT ---
                                        <>
                                            <div className="text-center mb-4">
                                                <h2 className="text-2xl font-display font-bold text-white mb-1">Neural Profile</h2>
                                                <p className="text-[10px] text-white/60 font-mono">Multidimensional Psychometric Analysis</p>
                                            </div>

                                            {/* Archetype Banner */}
                                            <div className="mb-4 p-3 bg-gradient-to-r from-neon-purple/10 to-neon-blue/10 border border-neon-purple/30 rounded-xl text-center">
                                                <p className="text-[10px] text-white/60 mb-1 font-mono">ARCHETYPE</p>
                                                <p className="text-lg font-display font-bold bg-gradient-to-r from-neon-purple to-neon-blue bg-clip-text text-transparent">{archetype}</p>
                                            </div>

                                            {/* Core Metrics - 2x2 Grid */}
                                            <div className="grid grid-cols-2 gap-2 mb-4">
                                                <div className="bg-white/5 border border-white/10 rounded-lg p-2.5">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <Brain className="w-3.5 h-3.5 text-neon-blue" />
                                                        <span className="text-[10px] text-white/50 font-mono">COGNITIVE</span>
                                                    </div>
                                                    <p className="text-2xl font-bold text-white font-mono">{scores.iq}</p>
                                                    <p className="text-[9px] text-neon-blue mt-0.5">Top {Math.max(1, 100 - scores.iqPercentile)}% globally</p>
                                                </div>
                                                <div className="bg-white/5 border border-white/10 rounded-lg p-2.5">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <Heart className="w-3.5 h-3.5 text-pink-400" />
                                                        <span className="text-[10px] text-white/50 font-mono">EMOTIONAL</span>
                                                    </div>
                                                    <p className="text-2xl font-bold text-white font-mono">{scores.eq}</p>
                                                    <p className="text-[9px] text-pink-400 mt-0.5">Top {Math.max(1, 100 - scores.eqPercentile)}% empathy</p>
                                                </div>
                                                <div className="bg-white/5 border border-white/10 rounded-lg p-2.5">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <Award className="w-3.5 h-3.5 text-amber-400" />
                                                        <span className="text-[10px] text-white/50 font-mono">RANK</span>
                                                    </div>
                                                    <p className="text-2xl font-bold text-white font-mono">{elo}</p>
                                                    <p className="text-[9px] text-amber-400 mt-0.5">{rankTier} tier</p>
                                                </div>
                                                <div className="bg-white/5 border border-white/10 rounded-lg p-2.5">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <Zap className="w-3.5 h-3.5 text-orange-400" />
                                                        <span className="text-[10px] text-white/50 font-mono">RISK</span>
                                                    </div>
                                                    <p className="text-2xl font-bold text-white font-mono">{scores.riskTolerance}%</p>
                                                    <p className="text-[9px] text-orange-400 mt-0.5">{scores.riskTolerance > 70 ? 'Bold' : scores.riskTolerance > 40 ? 'Balanced' : 'Cautious'}</p>
                                                </div>
                                            </div>

                                            {/* Apex Trait Highlight */}
                                            <div className="mb-4 p-3 bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-xl">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <TrendingUp className="w-4 h-4 text-green-400" />
                                                    <span className="text-[10px] text-white/60 font-mono">APEX STRENGTH</span>
                                                </div>
                                                <p className="text-sm font-bold text-green-400">{scores.apexTrait.trait}</p>
                                                <p className="text-[10px] text-white/50 mt-1 leading-tight">{scores.apexTrait.description}</p>
                                            </div>

                                            {/* HEXACO Personality Bars */}
                                            <div className="space-y-1.5">
                                                <p className="text-[9px] text-white/40 font-mono mb-1">HEXACO PERSONALITY MODEL</p>
                                                {[
                                                    { name: 'Honesty', value: scores.hexaco.honesty, color: 'bg-cyan-500' },
                                                    { name: 'Emotionality', value: scores.hexaco.emotionality, color: 'bg-rose-500' },
                                                    { name: 'Extraversion', value: scores.hexaco.extraversion, color: 'bg-yellow-500' },
                                                    { name: 'Agreeableness', value: scores.hexaco.agreeableness, color: 'bg-green-500' },
                                                    { name: 'Conscientiousness', value: scores.hexaco.conscientiousness, color: 'bg-blue-500' },
                                                    { name: 'Openness', value: scores.hexaco.openness, color: 'bg-purple-500' },
                                                ].map((trait, i) => (
                                                    <div key={i} className="flex items-center gap-2">
                                                        <p className="text-[9px] text-white/60 w-20 font-mono truncate">{trait.name}</p>
                                                        <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                                                            <div className={`h-full ${trait.color} rounded-full`} style={{ width: `${trait.value}%` }} />
                                                        </div>
                                                        <p className="text-[9px] text-white/40 w-8 text-right font-mono">{trait.value}</p>
                                                    </div>
                                                ))}
                                            </div>

                                            {/* Footer */}
                                            <div className="mt-4 pt-3 border-t border-white/10 text-center">
                                                <p className="text-[9px] text-white/30 font-mono">Discover your cognitive profile at neuralsync.ai</p>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>

                            <p className="text-xs text-white/50 mt-4 text-center">
                                {shareMode === 'story' ? 'Perfect for Stories & TikTok' : 'Detailed Report Card'}
                            </p>
                        </div>

                        <div className="p-4 md:p-6 border-t border-white/10 flex flex-col gap-4 bg-neural-bg">
                            <div className="flex flex-wrap gap-3 justify-center">
                                <NeonButton onClick={handleDownload} disabled={isCapturing} className="text-sm">
                                    <Download className="w-4 h-4 mr-2" />
                                    {isCapturing ? 'CAPTURING...' : 'DOWNLOAD IMAGE'}
                                </NeonButton>
                                <NeonButton onClick={handleCopyImage} variant="secondary" disabled={isCapturing} className="text-sm">
                                    {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                                    {copied ? 'COPIED!' : 'COPY TO CLIPBOARD'}
                                </NeonButton>
                            </div>

                            <div className="flex items-center justify-center gap-3 pt-3 border-t border-white/5">
                                <p className="text-xs text-white/50 font-mono uppercase tracking-wider">Share:</p>
                                <div className="flex gap-2">
                                    <button onClick={() => window.open(`https://twitter.com/intent/tweet?text=I%20just%20completed%20my%20neural%20assessment%20on%20NeuralSync!%20%F0%9F%A7%A0%20Archetype%3A%20${encodeURIComponent(archetype)}&url=${encodeURIComponent(window.location.href)}`, '_blank')} className="p-2 bg-[#1DA1F2]/20 hover:bg-[#1DA1F2]/40 text-[#1DA1F2] rounded-lg transition-colors" title="Share on Twitter">
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.84 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" /></svg>
                                    </button>
                                    <button onClick={() => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`, '_blank')} className="p-2 bg-[#0A66C2]/20 hover:bg-[#0A66C2]/40 text-[#0A66C2] rounded-lg transition-colors" title="Share on LinkedIn">
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>
                                    </button>
                                    <button onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank')} className="p-2 bg-[#1877F2]/20 hover:bg-[#1877F2]/40 text-[#1877F2] rounded-lg transition-colors" title="Share on Facebook">
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.791-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
