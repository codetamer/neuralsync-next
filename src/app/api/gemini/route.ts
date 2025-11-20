import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const { scores } = await req.json();

        // Placeholder for Gemini API call
        // In a real implementation, you would use the Google Generative AI SDK
        // const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        // const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        // Simulating API latency
        await new Promise(resolve => setTimeout(resolve, 1000));

        const prompt = `
            Based on these psychometric scores, generate 4 short, witty, and scientific "Fun Facts" about the user's brain.
            Style: Cyberpunk, futuristic, slightly edgy.
            Scores:
            IQ: ${scores.iq} (Percentile: ${scores.iqPercentile})
            EQ: ${scores.eq} (Percentile: ${scores.eqPercentile})
            Risk Tolerance: ${scores.riskTolerance} (Percentile: ${scores.riskPercentile})
            OCEAN: ${JSON.stringify(scores.ocean)}
        `;

        // Mock response for now as requested
        const mockFacts = [
            "Your neural pathways fire 12% faster than the average human when processing abstract patterns.",
            "You possess a rare 'Risk-Calculated' amygdala response, allowing for high-stakes decision making without cortisol spikes.",
            "Your emotional regulation circuitry shows advanced dampening of negative stimuli, typical of elite crisis negotiators.",
            "High Openness coupled with your IQ suggests a brain architecture optimized for rapid skill acquisition and lateral thinking."
        ];

        return NextResponse.json({ facts: mockFacts });

    } catch (error) {
        console.error('Gemini API Error:', error);
        return NextResponse.json({ error: 'Failed to generate insights' }, { status: 500 });
    }
}
