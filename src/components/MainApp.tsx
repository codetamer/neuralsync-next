'use client';

import { useState, useEffect } from 'react';
import { AppShell } from './layout/AppShell';
import { StageController } from './StageController';
import { AdSlotB } from './ads/AdSlotB';
import { AdSlotD } from './ads/AdSlotD';
import { ResultsCertificate } from './ResultsCertificate';
import { useTestStore } from '../store/useTestStore';
import { AnimatePresence } from 'framer-motion';

export default function MainApp() {
    const { currentStage, isTestComplete } = useTestStore();
    const [showInterstitial, setShowInterstitial] = useState(false);
    const [showGatedAd, setShowGatedAd] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const [lastTriggeredStage, setLastTriggeredStage] = useState(0);

    // Trigger Interstitials at logical section breaks
    // 15: End of Fluid IQ
    // 25: End of Cognitive Battery
    // 35: Start of Personality
    // 48: Mid-Personality
    // 60: Late-Personality
    useEffect(() => {
        const interstitialStages = [15, 25, 35, 48, 60];
        if (interstitialStages.includes(currentStage) && currentStage !== lastTriggeredStage) {
            setShowInterstitial(true);
            setLastTriggeredStage(currentStage);
        }
    }, [currentStage, lastTriggeredStage]);

    // Trigger Gated Ad on completion
    useEffect(() => {
        if (isTestComplete && !showResults) {
            setShowGatedAd(true);
        }
    }, [isTestComplete, showResults]);

    const handleInterstitialComplete = () => {
        setShowInterstitial(false);
    };

    const handleGatedAdComplete = () => {
        setShowGatedAd(false);
        setShowResults(true);
    };

    return (
        <AppShell>
            <AnimatePresence mode="wait">
                {showInterstitial && (
                    <AdSlotB key="ad-b" onComplete={handleInterstitialComplete} />
                )}

                {showGatedAd && (
                    <AdSlotD key="ad-d" onComplete={handleGatedAdComplete} />
                )}

                {showResults && (
                    <ResultsCertificate key="results" />
                )}

                {!showInterstitial && !showGatedAd && !showResults && (
                    <StageController />
                )}
            </AnimatePresence>
        </AppShell>
    );
}
