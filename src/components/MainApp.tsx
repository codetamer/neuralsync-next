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

    // Trigger Interstitials at start of blocks (Stages 6, 11, 16)
    useEffect(() => {
        const interstitialStages = [6, 11, 16];
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
