import { useThemeStore } from '@/store/useThemeStore';

class AudioEngine {
    private ctx: AudioContext | null = null;
    private masterGain: GainNode | null = null;
    private isMuted: boolean = false;
    private initialized: boolean = false;

    public initialize() {
        if (this.initialized) return;
        try {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const AudioContextClass = (window.AudioContext || (window as any).webkitAudioContext);
            this.ctx = new AudioContextClass();
            this.masterGain = this.ctx.createGain();
            this.masterGain.gain.value = this.isMuted ? 0 : 0.3;
            this.masterGain.connect(this.ctx.destination);
            this.initialized = true;
        } catch (e) {
            console.error("Audio initialization failed:", e);
        }
    }

    public setMuted(muted: boolean) {
        this.isMuted = muted;
        if (this.masterGain && this.ctx) {
            const target = muted ? 0 : 0.3;
            this.masterGain.gain.setTargetAtTime(target, this.ctx.currentTime, 0.1);

            if (!muted) {
                if (this.ctx.state === 'suspended') this.ctx.resume();
            }
        }
    }

    private getTheme() {
        return useThemeStore.getState().theme;
    }

    public playHover() {
        if (!this.ctx || !this.masterGain || this.isMuted) return;
        if (this.ctx.state === 'suspended') this.ctx.resume();

        const theme = this.getTheme();
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const now = this.ctx.currentTime;

        if (theme === 'zenith') {
            // Soft Chime
            osc.type = 'sine';
            osc.frequency.setValueAtTime(880, now);
            osc.frequency.exponentialRampToValueAtTime(1760, now + 0.1);

            gain.gain.setValueAtTime(0.05, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
        } else {
            // Digital Blip
            osc.type = 'square';
            osc.frequency.setValueAtTime(880, now);

            gain.gain.setValueAtTime(0.02, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
        }

        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start();
        osc.stop(now + 0.3);
    }

    public playClick() {
        if (!this.initialized) this.initialize();
        if (!this.ctx || !this.masterGain || this.isMuted) return;
        if (this.ctx.state === 'suspended') this.ctx.resume();

        const theme = this.getTheme();
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const now = this.ctx.currentTime;

        if (theme === 'zenith') {
            // Water Drop
            osc.type = 'sine';
            osc.frequency.setValueAtTime(600, now);
            osc.frequency.linearRampToValueAtTime(300, now + 0.1);

            gain.gain.setValueAtTime(0.1, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
        } else {
            // Mechanical Click
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(1200, now);
            osc.frequency.exponentialRampToValueAtTime(50, now + 0.05);

            gain.gain.setValueAtTime(0.1, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
        }

        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start();
        osc.stop(now + 0.2);
    }

    public playSuccess() {
        if (!this.initialized) this.initialize();
        if (!this.ctx || !this.masterGain || this.isMuted) return;
        const theme = this.getTheme();
        const now = this.ctx.currentTime;

        if (theme === 'zenith') {
            // Ethereal Chord
            [440, 554.37, 659.25, 880].forEach((freq, i) => {
                const osc = this.ctx!.createOscillator();
                const gain = this.ctx!.createGain();

                osc.type = 'sine';
                osc.frequency.value = freq;

                gain.gain.setValueAtTime(0, now);
                gain.gain.linearRampToValueAtTime(0.05, now + 0.1 + (i * 0.05));
                gain.gain.exponentialRampToValueAtTime(0.001, now + 1.5);

                osc.connect(gain);
                gain.connect(this.masterGain!);
                osc.start();
                osc.stop(now + 1.5);
            });
        } else {
            // 8-bit Power Up
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = 'square';
            osc.frequency.setValueAtTime(440, now);
            osc.frequency.setValueAtTime(554, now + 0.1);
            osc.frequency.setValueAtTime(659, now + 0.2);
            osc.frequency.setValueAtTime(880, now + 0.3);

            gain.gain.setValueAtTime(0.05, now);
            gain.gain.setValueAtTime(0.05, now + 0.3);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

            osc.connect(gain);
            gain.connect(this.masterGain);
            osc.start();
            osc.stop(now + 0.6);
        }
    }

    public playError() {
        if (!this.initialized) this.initialize();
        if (!this.ctx || !this.masterGain || this.isMuted) return;
        const theme = this.getTheme();
        const now = this.ctx.currentTime;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        if (theme === 'zenith') {
            // Low Dissonance
            osc.type = 'sine';
            osc.frequency.setValueAtTime(100, now);
            osc.detune.setValueAtTime(100, now); // Dissonant

            gain.gain.setValueAtTime(0.1, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
        } else {
            // Buzzer
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(110, now);
            osc.frequency.linearRampToValueAtTime(55, now + 0.3);

            gain.gain.setValueAtTime(0.1, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
        }

        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start();
        osc.stop(now + 0.5);
    }
}

export const audio = new AudioEngine();
