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
    const { currentStage, isTestComplete, currentSection } = useTestStore();
    const [showInterstitial, setShowInterstitial] = useState(false);
    const [showGatedAd, setShowGatedAd] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const [lastTriggeredStage, setLastTriggeredStage] = useState(0);

    // Trigger Interstitials at Section Breaks (Context-Aware)
    const [prevSection, setPrevSection] = useState(currentSection);

    useEffect(() => {
        // If section changes (and it's not the initial mount or Intro), trigger ad
        if (currentSection !== prevSection && prevSection !== 'INTRO' && currentSection !== 'INTRO') {
            setShowInterstitial(true);
            setPrevSection(currentSection);
        } else if (currentSection !== prevSection) {
            // Just update tracker for non-ad transitions (e.g. Intro -> Section 1)
            setPrevSection(currentSection);
        }
    }, [currentSection, prevSection]);

    // Trigger Gated Ad on completion
    useEffect(() => {
        if (isTestComplete && !showResults) {
            setShowGatedAd(true);
        } else if (!isTestComplete) {
            // Reset view when test is reset/restarted
            setShowResults(false);
            setShowGatedAd(false);
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
            {/* Overlays */}
            <AnimatePresence>
                {showInterstitial && (
                    <AdSlotB key="ad-b" onComplete={handleInterstitialComplete} nextSection={currentSection} />
                )}

                {showGatedAd && (
                    <AdSlotD key="ad-d" onComplete={handleGatedAdComplete} />
                )}
            </AnimatePresence>

            {/* Main Content */}
            <AnimatePresence mode="wait">
                {showResults ? (
                    <ResultsCertificate key="results" />
                ) : (
                    <StageController key="stage-controller" />
                )}
            </AnimatePresence>
        </AppShell>
    );
}
