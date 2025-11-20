'use client';

import { useEffect, useRef, useCallback } from 'react';

interface AmbientSoundProps {
    muted: boolean;
    volume?: number;
}

export const AmbientSound = ({ muted, volume = 0.15 }: AmbientSoundProps) => {
    const audioContextRef = useRef<AudioContext | null>(null);
    const oscillatorsRef = useRef<OscillatorNode[]>([]);
    const gainNodeRef = useRef<GainNode | null>(null);
    const isInitialized = useRef(false);

    // Initialize Audio Context
    const initAudio = useCallback(() => {
        if (isInitialized.current || typeof window === 'undefined') return;

        const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
        audioContextRef.current = new AudioContext();

        // Master Gain
        const masterGain = audioContextRef.current.createGain();
        masterGain.gain.value = muted ? 0 : volume;
        masterGain.connect(audioContextRef.current.destination);
        gainNodeRef.current = masterGain;

        // Drone Oscillators (Sci-Fi Ambiance)
        const freqs = [55, 110, 110.5, 165]; // A1, A2, detuned A2, E3

        freqs.forEach((freq, i) => {
            if (!audioContextRef.current) return;

            const osc = audioContextRef.current.createOscillator();
            const oscGain = audioContextRef.current.createGain();

            osc.type = i % 2 === 0 ? 'sine' : 'triangle';
            osc.frequency.value = freq;

            // LFO for movement
            const lfo = audioContextRef.current.createOscillator();
            lfo.type = 'sine';
            lfo.frequency.value = 0.1 + (Math.random() * 0.1); // Slow modulation

            const lfoGain = audioContextRef.current.createGain();
            lfoGain.gain.value = 20; // Modulation depth

            lfo.connect(lfoGain);
            lfoGain.connect(osc.frequency);
            lfo.start();

            oscGain.gain.value = 0.1 / freqs.length;

            osc.connect(oscGain);
            oscGain.connect(masterGain);
            osc.start();

            oscillatorsRef.current.push(osc);
        });

        isInitialized.current = true;
    }, [muted, volume]);

    // Handle Mute/Volume changes
    useEffect(() => {
        if (gainNodeRef.current && audioContextRef.current) {
            const targetVolume = muted ? 0 : volume;
            gainNodeRef.current.gain.setTargetAtTime(
                targetVolume,
                audioContextRef.current.currentTime,
                0.1
            );

            if (!muted && audioContextRef.current.state === 'suspended') {
                audioContextRef.current.resume();
            }
        }
    }, [muted, volume]);

    // Start on first interaction if needed
    useEffect(() => {
        const handleInteraction = () => {
            if (!isInitialized.current) {
                initAudio();
            } else if (audioContextRef.current?.state === 'suspended') {
                audioContextRef.current.resume();
            }
        };

        window.addEventListener('click', handleInteraction);
        window.addEventListener('keydown', handleInteraction);

        return () => {
            window.removeEventListener('click', handleInteraction);
            window.removeEventListener('keydown', handleInteraction);
        };
    }, [initAudio]);

    // Cleanup
    useEffect(() => {
        return () => {
            oscillatorsRef.current.forEach(osc => osc.stop());
            audioContextRef.current?.close();
        };
    }, []);

    return null; // Invisible component
};

// SFX Utilities (Exported for use in other components)
export const playSFX = (type: 'click' | 'success' | 'error' | 'levelUp') => {
    if (typeof window === 'undefined') return;

    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    const now = ctx.currentTime;

    switch (type) {
        case 'click':
            osc.type = 'sine';
            osc.frequency.setValueAtTime(800, now);
            osc.frequency.exponentialRampToValueAtTime(1200, now + 0.05);
            gain.gain.setValueAtTime(0.1, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
            osc.start(now);
            osc.stop(now + 0.05);
            break;

        case 'success':
            osc.type = 'sine';
            osc.frequency.setValueAtTime(440, now);
            osc.frequency.setValueAtTime(554, now + 0.1); // C#
            osc.frequency.setValueAtTime(659, now + 0.2); // E
            gain.gain.setValueAtTime(0.1, now);
            gain.gain.linearRampToValueAtTime(0, now + 0.4);
            osc.start(now);
            osc.stop(now + 0.4);
            break;

        case 'error':
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(150, now);
            osc.frequency.linearRampToValueAtTime(100, now + 0.2);
            gain.gain.setValueAtTime(0.1, now);
            gain.gain.linearRampToValueAtTime(0, now + 0.2);
            osc.start(now);
            osc.stop(now + 0.2);
            break;

        case 'levelUp':
            osc.type = 'triangle';
            // Arpeggio
            [440, 554, 659, 880].forEach((freq, i) => {
                const t = now + i * 0.1;
                const o = ctx.createOscillator();
                const g = ctx.createGain();
                o.connect(g);
                g.connect(ctx.destination);
                o.frequency.value = freq;
                g.gain.setValueAtTime(0.1, t);
                g.gain.exponentialRampToValueAtTime(0.01, t + 0.3);
                o.start(t);
                o.stop(t + 0.3);
            });
            break;
    }
};
