// BART (Balloon Analogue Risk Task) - HEXACO Risk Assessment
// Measures risk tolerance through reward vs. burst probability tradeoff

import type { DifficultyLevel } from './TestEngine';

export interface BalloonState {
    pumps: number;
    currentValue: number;
    burstProbability: number;
    hasBurst: boolean;
    cashedOut: boolean;
    finalValue: number;
    maxPumps: number;
}

export class BalloonAnalogueRiskTask {
    private state: BalloonState;
    private baseReward: number;
    // private difficulty: DifficultyLevel;

    constructor(difficulty: DifficultyLevel) {
        // this.difficulty = difficulty;
        this.baseReward = 10;

        // Max pumps before guaranteed burst varies by difficulty
        const maxPumps = difficulty <= 3 ? 15 : difficulty <= 6 ? 12 : 10;

        this.state = {
            pumps: 0,
            currentValue: 0,
            burstProbability: 0,
            hasBurst: false,
            cashedOut: false,
            finalValue: 0,
            maxPumps,
        };
    }

    // Pump the balloon
    pumpBalloon(): BalloonState {
        if (this.state.hasBurst || this.state.cashedOut) {
            return this.state;
        }

        this.state.pumps++;

        // Calculate burst probability (exponential growth)
        this.state.burstProbability = Math.min(
            0.95,
            Math.pow(this.state.pumps / this.state.maxPumps, 2)
        );

        // Check if balloon bursts
        if (Math.random() < this.state.burstProbability) {
            this.state.hasBurst = true;
            this.state.finalValue = 0;
            return this.state;
        }

        // Increase value
        this.state.currentValue = this.baseReward * this.state.pumps;

        return this.state;
    }

    // Cash out decision
    cashOut(): BalloonState {
        if (!this.state.hasBurst && !this.state.cashedOut) {
            this.state.cashedOut = true;
            this.state.finalValue = this.state.currentValue;
        }
        return this.state;
    }

    // Get current state
    getState(): BalloonState {
        return { ...this.state };
    }

    // Calculate risk tolerance score
    calculateRiskTolerance(): number {
        // Higher pumps before cashout = higher risk tolerance
        // Burst = extreme risk taking (penalized slightly)
        if (this.state.hasBurst) {
            return Math.min(100, this.state.pumps * 8);
        }
        return Math.min(100, this.state.pumps * 10);
    }

    // Check if balloon is still active
    isActive(): boolean {
        return !this.state.hasBurst && !this.state.cashedOut;
    }
}

// Render BART to canvas
export function renderBARTToCanvas(
    ctx: CanvasRenderingContext2D,
    state: BalloonState,
    canvasWidth: number,
    canvasHeight: number
): void {
    // Clear canvas
    ctx.fillStyle = '#0a0f1e';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    // Calculate balloon size based on pumps
    const baseSize = 80;
    const maxSize = 240;
    const currentSize = baseSize + (state.pumps / state.maxPumps) * (maxSize - baseSize);

    const centerX = canvasWidth / 2;
    const centerY = canvasHeight / 2 - 50;

    if (state.hasBurst) {
        // Show burst animation
        drawBurstEffect(ctx, centerX, centerY);

        // Display "BURST!" message
        ctx.font = 'bold 48px Inter, sans-serif';
        ctx.fillStyle = '#ef4444';
        ctx.textAlign = 'center';
        ctx.fillText('BURST!', centerX, centerY + 100);

        ctx.font = '24px Inter, sans-serif';
        ctx.fillStyle = '#9ca3af';
        ctx.fillText('You earned: $0', centerX, centerY + 140);
    } else if (state.cashedOut) {
        // Show cash out success
        ctx.font = 'bold 48px Inter, sans-serif';
        ctx.fillStyle = '#10b981';
        ctx.textAlign = 'center';
        ctx.fillText('CASHED OUT!', centerX, centerY);

        ctx.font = '32px Inter, sans-serif';
        ctx.fillStyle = '#22d3ee';
        ctx.fillText(`You earned: $${state.finalValue}`, centerX, centerY + 60);
    } else {
        // Draw balloon
        drawBalloon(ctx, centerX, centerY, currentSize, state.burstProbability);

        // Display current value
        ctx.font = 'bold 28px Inter, sans-serif';
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.fillText(`$${state.currentValue}`, centerX, centerY);
    }

    // Display statistics
    const statsY = canvasHeight - 120;
    ctx.font = '18px Inter, sans-serif';
    ctx.fillStyle = '#9ca3af';
    ctx.textAlign = 'left';

    ctx.fillText(`Pumps: ${state.pumps}/${state.maxPumps}`, 40, statsY);
    ctx.fillText(`Risk Level: ${Math.round(state.burstProbability * 100)}%`, 40, statsY + 30);
    ctx.fillText(`Current Value: $${state.currentValue}`, 40, statsY + 60);

    // Draw action buttons if balloon is active
    if (!state.hasBurst && !state.cashedOut) {
        drawActionButtons(ctx, canvasWidth, canvasHeight);
    }
}

// Draw balloon shape
function drawBalloon(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, risk: number): void {
    // Balloon color changes with risk (cyan -> yellow -> red)
    const hue = 180 - risk * 180; // 180 (cyan) -> 0 (red)
    ctx.fillStyle = `hsl(${hue}, 70%, 55%)`;

    // Draw balloon body (ellipse)
    ctx.beginPath();
    ctx.ellipse(x, y, size / 2, size / 1.6, 0, 0, Math.PI * 2);
    ctx.fill();

    // Draw balloon tie
    ctx.strokeStyle = ctx.fillStyle;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(x, y + size / 1.6);
    ctx.lineTo(x, y + size / 1.6 + 20);
    ctx.stroke();

    // Draw shine effect
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.beginPath();
    ctx.ellipse(x - size / 6, y - size / 6, size / 8, size / 12, -Math.PI / 4, 0, Math.PI * 2);
    ctx.fill();
}

// Draw burst effect
function drawBurstEffect(ctx: CanvasRenderingContext2D, x: number, y: number): void {
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 4;

    // Draw burst lines radiating outward
    for (let i = 0; i < 12; i++) {
        const angle = (i / 12) * Math.PI * 2;
        const length = 60 + Math.random() * 40;

        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(
            x + Math.cos(angle) * length,
            y + Math.sin(angle) * length
        );
        ctx.stroke();
    }
}

// Draw action buttons
function drawActionButtons(ctx: CanvasRenderingContext2D, canvasWidth: number, canvasHeight: number): void {
    const buttonY = canvasHeight - 60;
    const buttonWidth = 140;
    const buttonHeight = 45;

    // Pump button (left)
    const pumpX = canvasWidth / 2 - buttonWidth - 20;
    ctx.fillStyle = '#22d3ee';
    ctx.fillRect(pumpX, buttonY, buttonWidth, buttonHeight);
    ctx.font = 'bold 18px Inter, sans-serif';
    ctx.fillStyle = '#0a0f1e';
    ctx.textAlign = 'center';
    ctx.fillText('PUMP', pumpX + buttonWidth / 2, buttonY + buttonHeight / 2 + 6);

    // Cash out button (right)
    const cashOutX = canvasWidth / 2 + 20;
    ctx.fillStyle = '#10b981';
    ctx.fillRect(cashOutX, buttonY, buttonWidth, buttonHeight);
    ctx.fillStyle = '#0a0f1e';
    ctx.fillText('CASH OUT', cashOutX + buttonWidth / 2, buttonY + buttonHeight / 2 + 6);
}

// Detect button clicks
export function detectBARTClick(
    clickX: number,
    clickY: number,
    canvasWidth: number,
    canvasHeight: number
): 'pump' | 'cashout' | null {
    const buttonY = canvasHeight - 60;
    const buttonWidth = 140;
    const buttonHeight = 45;

    // Check pump button
    const pumpX = canvasWidth / 2 - buttonWidth - 20;
    if (
        clickX >= pumpX &&
        clickX <= pumpX + buttonWidth &&
        clickY >= buttonY &&
        clickY <= buttonY + buttonHeight
    ) {
        return 'pump';
    }

    // Check cash out button
    const cashOutX = canvasWidth / 2 + 20;
    if (
        clickX >= cashOutX &&
        clickX <= cashOutX + buttonWidth &&
        clickY >= buttonY &&
        clickY <= buttonY + buttonHeight
    ) {
        return 'cashout';
    }

    return null;
}

// Calculate overall risk metrics from multiple trials
export function calculateRiskMetrics(trials: BalloonState[]): {
    averagePumps: number;
    burstRate: number;
    riskTolerance: number;
} {
    const totalPumps = trials.reduce((sum, t) => sum + t.pumps, 0);
    const averagePumps = totalPumps / trials.length;

    const bursts = trials.filter(t => t.hasBurst).length;
    const burstRate = bursts / trials.length;

    // Risk tolerance: higher pumps = higher risk tolerance
    const riskTolerance = Math.min(100, averagePumps * 8);

    return {
        averagePumps,
        burstRate,
        riskTolerance,
    };
}
