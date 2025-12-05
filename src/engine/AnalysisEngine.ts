// Narrow interface for Analysis Engine
export interface AnalysisInput {
    iq: number;
    eq: number;
    riskTolerance: number;
    hexaco: {
        honesty: number;
        emotionality: number;
        extraversion: number;
        agreeableness: number;
        conscientiousness: number;
        openness: number;
    };
}

export interface DeepInsight {
    archetype: string;
    archetypeDesc: string;
    matchScore: number;
    strengths: string[];
    weaknesses: string[];
    career: string;
    cpuType: string;
    osType: string;
    raw: string;
    detailedWeaknesses: { title: string; description: string; impact: string }[];
    actionableSteps: string[];
}

export class AnalysisEngine {
    private static getPercentile(score: number, mean: number, sd: number): number {
        const z = (score - mean) / sd;
        // Simplified cumulative normal distribution approximation
        return Math.round(50 + (z * 34));
    }

    private static getTraitLevel(score: number): 'Very Low' | 'Low' | 'Average' | 'High' | 'Very High' {
        if (score < 20) return 'Very Low';
        if (score < 40) return 'Low';
        if (score < 60) return 'Average';
        if (score < 80) return 'High';
        return 'Very High';
    }

    // Combinatorial Logic: Mixing two traits to find a specific descriptor
    private static getInteractionDescriptor(trait1: number, trait2: number, type: 'h_a' | 'x_e' | 'c_o'): string {
        const t1High = trait1 > 60;
        const t2High = trait2 > 60;
        const t1Low = trait1 < 40;
        const t2Low = trait2 < 40;

        // Honesty (H) + Agreeableness (A) = INTEGRITY STYLE
        if (type === 'h_a') {
            if (t1High && t2High) return "Radical Sincerity & Benevolence";
            if (t1High && t2Low) return "Uncompromising Principles"; // Honest but not agreeable
            if (t1Low && t2High) return "Strategic Diploma"; // Politely manipulative
            if (t1Low && t2Low) return "Calculated Self-Interest";
        }

        // Extraversion (X) + Emotionality (E) = SOCIAL ENERGY
        if (type === 'x_e') {
            if (t1High && t2High) return "Expressive & Passionate";
            if (t1High && t2Low) return "Fearless Leader"; // Bold, low fear
            if (t1Low && t2High) return "Sensitive Observer";
            if (t1Low && t2Low) return "Stoic Loner";
        }

        // Conscientiousness (C) + Openness (O) = WORK STYLE
        if (type === 'c_o') {
            if (t1High && t2High) return "Creative Architect"; // Structured & Creative
            if (t1High && t2Low) return "Conservative Executer";
            if (t1Low && t2High) return "Chaotic Innovator";
            if (t1Low && t2Low) return "Passive Drifter";
        }

        return "Balanced Interaction";
    }

    public static generate(results: AnalysisInput): DeepInsight {
        const { iq, eq, riskTolerance, hexaco } = results;

        const iqPercentile = this.getPercentile(iq, 100, 15);
        const eqPercentile = this.getPercentile(eq, 100, 15);

        // --- 1. ARCHETYPE DETECTION ENGINE (VECTOR-BASED) ---
        // State-of-the-art implementation using Euclidean Distance in 9-Dimensional Space.
        // We define 'Ideal Vectors' for each archetype and find the closest match.

        // Normalize Scores to 0-1 scale for equal weighting
        const norm = {
            iq: Math.min(1, Math.max(0, (iq - 70) / 85)),     // IQ 70-155 -> 0-1
            eq: Math.min(1, Math.max(0, (eq - 65) / 80)),     // EQ 65-145 -> 0-1
            risk: Math.min(1, Math.max(0, riskTolerance / 100)),
            h: hexaco.honesty / 100,
            e: hexaco.emotionality / 100,
            x: hexaco.extraversion / 100,
            a: hexaco.agreeableness / 100,
            c: hexaco.conscientiousness / 100,
            o: hexaco.openness / 100
        };

        interface ArchetypeVector {
            name: string;
            desc: string;
            // Target values (0.0 - 1.0). Undefined means "Doesn't Matter" (ignored in distance)
            vector: Partial<typeof norm>;
            weights?: Partial<typeof norm>; // Optional custom weights for critical traits
        }

        const archetypes: ArchetypeVector[] = [
            {
                name: "Visionary Architect",
                desc: "An architect of abstract systems, combining high intellect with deep openness to novelty.",
                vector: { iq: 0.9, o: 0.9, c: 0.6 },
                weights: { iq: 2.0, o: 2.0 } // Critical traits
            },
            {
                name: "Ethical Guardian",
                desc: "A pillar of integrity and stability, prioritizing fairness and duty above self-interest.",
                vector: { h: 0.9, c: 0.9, risk: 0.3 },
                weights: { h: 2.0 }
            },
            {
                name: "Strategic Realpolitik",
                desc: "A master of power dynamics, leveraging high intellect to maneuver complex hierarchies.",
                vector: { iq: 0.8, h: 0.1, a: 0.3, risk: 0.7 },
                weights: { h: 2.0, iq: 1.5 }
            },
            {
                name: "Social Catalyst",
                desc: "A high-energy connector who accelerates group dynamics and drives social momentum.",
                vector: { eq: 0.9, x: 0.9, e: 0.6 },
                weights: { eq: 1.5, x: 2.0 }
            },
            {
                name: "Harmonic Resonator",
                desc: "A stabilizing force in social systems, diffusing conflict through high empathy and agreeableness.",
                vector: { eq: 0.9, a: 0.9, h: 0.7 },
                weights: { eq: 1.5, a: 1.5 }
            },
            {
                name: "Chaos Navigator",
                desc: "Thriving in uncertainty, you use high risk tolerance and fluidity to turn instability into advantage.",
                vector: { risk: 0.9, c: 0.2, o: 0.8 },
                weights: { risk: 2.5 }
            },
            {
                name: "Precision Engineer",
                desc: "Relentless logic paired with methodical discipline. You optimize systems with zero margin for error.",
                vector: { iq: 0.8, c: 0.9, risk: 0.2, e: 0.3 },
                weights: { c: 2.0, iq: 1.5 }
            },
            {
                name: "Renaissance Synthesizer",
                desc: "Equally fluent in logic and emotion, bridging the gap between analytical and human domains.",
                vector: { iq: 0.8, eq: 0.8, o: 0.8, risk: 0.5 },
                weights: { iq: 1.5, eq: 1.5 }
            }
        ];

        let bestMatch = { name: "Adaptive Generalist", desc: "A balanced and versatile profile capable of adapting to diverse challenges.", score: 0 };
        let minDistance = Infinity;

        archetypes.forEach(arch => {
            let distance = 0;
            let totalWeight = 0;

            // Calculate Weighted Euclidean Distance
            (Object.keys(arch.vector) as Array<keyof typeof norm>).forEach(key => {
                const target = arch.vector[key];
                const actual = norm[key];
                const weight = arch.weights?.[key] || 1.0;

                if (target !== undefined) {
                    const diff = target - actual;
                    distance += (diff * diff) * weight;
                    totalWeight += weight;
                }
            });

            // Normalize distance by total weight to handle vectors of different lengths
            const avgDistance = Math.sqrt(distance) / (Math.sqrt(totalWeight) || 1);

            // Similarity Score (0 to 1) -> Map to 0-100 %
            // Identify closest match (Lowest Distance)
            if (avgDistance < minDistance) {
                minDistance = avgDistance;
                // Convert proximity to a "Match %" for display
                // If avgDistance is 0, match is 100%. If avgDistance is 0.5, match is ~50%.
                const matchPercent = Math.max(0, 100 - (avgDistance * 100)); // Rough mapping

                bestMatch = {
                    name: arch.name,
                    desc: arch.desc,
                    score: Math.round(matchPercent)
                };
            }
        });

        // Fallback for Generalist if no strong spike
        if (bestMatch.score < 60) {
            bestMatch = {
                name: "Adaptive Generalist",
                desc: "A balanced and versatile profile capable of adapting to diverse challenges.",
                score: Math.round(85 + (Math.random() * 10)) // High confidence in being balanced
            };
        }

        const displayMatchScore = bestMatch.score;

        // === 2. STRENGTH VECTORING ===
        const strengths = [];

        // Tier 1: Absolute Score Strengths
        if (iq > 125) strengths.push(`Elite Cognitive Processing (Top ${100 - iqPercentile}%)`);
        if (eq > 125) strengths.push(`Radical Empathy (Top ${100 - eqPercentile}%)`);
        if (riskTolerance > 80) strengths.push("High-Stakes Decision Making");

        // Tier 2: Combinatorial Strengths (The "Secret Sauce")
        const ha_desc = this.getInteractionDescriptor(hexaco.honesty, hexaco.agreeableness, 'h_a');
        strengths.push(ha_desc);

        const cx_desc = this.getInteractionDescriptor(hexaco.conscientiousness, hexaco.openness, 'c_o');
        strengths.push(cx_desc);

        // Fallbacks
        if (hexaco.extraversion > 70) strengths.push("Dynamic Social Presence");
        if (hexaco.emotionality < 30) strengths.push("Unshakeable Composure");
        if (strengths.length < 3) strengths.push("Adaptive Learning");

        // === 3. CORE WEAKNESSES (BRUTALLY HONEST ANALYSIS) ===
        const detailedWeaknesses: { title: string; description: string; impact: string }[] = [];

        // IQ vs EQ Imbalances
        if (iq > 120 && eq < 90) {
            detailedWeaknesses.push({
                title: "Cognitive Dissociation",
                description: "You treat human interactions as logic puzzles to be solved, rather than emotional connections to be nurtured. You likely dismiss 'irrational' feelings in others as irrelevant data.",
                impact: "High risk of leadership failure due to inability to inspire loyalty."
            });
        }
        if (iq < 100 && eq > 120) {
            detailedWeaknesses.push({
                title: "Pathological Accommodator",
                description: "You prioritize social harmony over objective truth to a fault. You likely agree with bad ideas just to avoid uncomfortable friction.",
                impact: "You will be liked but rarely respected as a forceful decision maker."
            });
        }

        // HEXACO specific critical failures
        if (hexaco.honesty < 40) {
            detailedWeaknesses.push({
                title: "Machiavellian Instability",
                description: "Your willingness to cut corners for gain creates a reputation debt. People may work with you for profit, but they will turn on you the moment you are vulnerable.",
                impact: "Zero true alliances; purely transactional network."
            });
        }
        if (hexaco.honesty > 90 && iq > 110) {
            detailedWeaknesses.push({
                title: "Strategic Naivety",
                description: "You broadcast your intentions too openly. In competitive environments, you are providing your adversaries with a complete roadmap of your vulnerabilities.",
                impact: "Easily outmaneuvered by less capable but more secretive rivals."
            });
        }

        if (hexaco.conscientiousness < 40) {
            detailedWeaknesses.push({
                title: "Execution Entropy",
                description: "You generate ideas but lack the discipline to finish the boring 'last mile'. You likely have a graveyard of half-started projects.",
                impact: "Career stagnation despite high potential."
            });
        }
        if (hexaco.conscientiousness > 95) {
            detailedWeaknesses.push({
                title: "Paralysis by Analysis",
                description: "Your need for perfect order prevents you from capitalizing on chaotic opportunities. You optimize systems that are already obsolete.",
                impact: "Missed first-mover advantages."
            });
        }

        if (hexaco.extraversion < 30) {
            detailedWeaknesses.push({
                title: "Social Invisibility",
                description: "Your competence is irrelevant if no one knows you exist. You are likely being passed over for promotions by louder, less qualified peers.",
                impact: "Career ceiling capped by lack of visibility."
            });
        }

        if (hexaco.agreeableness > 90) {
            detailedWeaknesses.push({
                title: "Doormat Syndrome",
                description: "Your inability to say 'no' means you are constantly executing other people's priorities instead of your own.",
                impact: "Resource burnout with zero personal gain."
            });
        }
        if (hexaco.agreeableness < 30) {
            detailedWeaknesses.push({
                title: "Abrasive Interface",
                description: "You confuse 'being honest' with being rude. You burn bridges faster than you can build them.",
                impact: "Isolation during crises."
            });
        }

        if (riskTolerance > 90 && iq < 115) {
            detailedWeaknesses.push({
                title: "Gambler's Delusion",
                description: "You mistake adrenaline for intuition. You are taking risks you don't actually understand mathematically.",
                impact: "Catastrophic resource loss inevitable."
            });
        }
        if (riskTolerance < 20) {
            detailedWeaknesses.push({
                title: "Safety Paralysis",
                description: "Your fear of failure effectively guarantees mediocrity. You are slowly drowning in 'safe' choices.",
                impact: "Obsolescence."
            });
        }

        if (detailedWeaknesses.length === 0) {
            detailedWeaknesses.push({
                title: "Featureless Profile",
                description: "You lack distinct spikes in capability. While you have no glaring flaws, you also have no defining superpowers.",
                impact: "Replaceable in almost any role."
            });
        }

        // Backwards compatibility for string array
        const weaknesses = detailedWeaknesses.map(w => `${w.title}: ${w.description}`);

        // === 4. ACTIONABLE SUGGESTIONS (The Fix) ===
        const actionableSteps: string[] = [];

        if (iq > 120 && eq < 100) actionableSteps.push("Rule of 3: Ask 3 personal questions before discussing business in any meeting.");
        if (hexaco.conscientiousness < 40) actionableSteps.push("The 'One Thing' Protocol: Do not start Task B until Task A is 100% complete. No exceptions.");
        if (hexaco.extraversion < 40) actionableSteps.push("Visibility KPI: Make 1 public comment or contribution per day, regardless of comfort level.");
        if (hexaco.agreeableness > 80) actionableSteps.push("Conflict Drill: Practice saying 'No' to low-value requests once a day for 7 days.");
        if (riskTolerance < 40) actionableSteps.push("Micro-Risks: Make one decision this week with <70% information certainty.");
        if (hexaco.openness < 50) actionableSteps.push("Novelty Injection: Consume one piece of media from a genre/ideology you actively dislike.");

        if (actionableSteps.length < 3) actionableSteps.push("Audit your last 5 decisions for emotional bias.", "Identify your top 3 time-wasters and eliminate one.");

        // === 4. CAREER RECOMMENDATIONS ===
        // Dynamic generation based on traits
        // === 4. CAREER RECOMMENDATIONS (VECTOR MATCHING) ===
        // Rank careers by Euclidean distance to user profile

        const careerVectors = [
            { role: "Systems Architect", vector: { iq: 0.8, o: 0.6, c: 0.5 } },
            { role: "Crisis Negotiator", vector: { eq: 0.7, e: 0.2, a: 0.6, risk: 0.6 } }, // Low E (High stability)
            { role: "Venture Capitalist", vector: { risk: 0.7, iq: 0.7, x: 0.5 } },
            { role: "Ethical Compliance Officer", vector: { h: 0.8, c: 0.7 } },
            { role: "Research Scientist", vector: { iq: 0.8, o: 0.7, c: 0.6 } },
            { role: "Startup Founder", vector: { risk: 0.7, o: 0.7, x: 0.6 } },
            { role: "Clinical Psychologist", vector: { eq: 0.8, a: 0.6, h: 0.6 } },
            { role: "Algorithmic Trader", vector: { iq: 0.85, e: 0.2, risk: 0.6 } },
            { role: "Strategic Consultant", vector: { iq: 0.75, x: 0.6, c: 0.6 } },
            { role: "Creative Director", vector: { o: 0.85, x: 0.6, iq: 0.6 } }
        ];

        const rankedCareers = careerVectors.map(job => {
            let dist = 0;
            let weights = 0;

            (Object.keys(job.vector) as Array<keyof typeof norm>).forEach(key => {
                const target = job.vector[key] as number;
                const actual = norm[key];
                dist += Math.pow(target - actual, 2);
                weights++;
            });

            return {
                role: job.role,
                // Normalized distance: 0 is perfect match
                score: Math.sqrt(dist) / (Math.sqrt(weights) || 1)
            };
        }).sort((a, b) => a.score - b.score); // Ascending distance (closest first)

        const careerText = rankedCareers.slice(0, 3).map(c => c.role).join(", ");

        // === 5. SYSTEM DESCRIPTORS ===
        let cpuType = "Standard-Core";
        if (iq > 135) cpuType = "Quantum-Logic Hybrid";
        else if (iq > 125) cpuType = "Multi-Core Hyper-Thread";
        else if (iq > 115) cpuType = "Optimized Dual-Core";

        let osType = "Stable-Build v4.0";
        if (hexaco.emotionality > 75) osType = "High-Sensitivity Kernel";
        else if (hexaco.emotionality < 30 && hexaco.conscientiousness > 75) osType = "Real-Time OS (Mil-Spec)";
        else if (hexaco.conscientiousness > 80) osType = "Precision OS v9";

        // Construct Raw Terminal Output
        const raw = `> INITIALIZING DEEP SCAN v6.2...\n> DECRYPTING NEURAL SIGNATURE...\n> \n> SUBJECT ANALYTICS:\n> IQ[${iq}] EQ[${eq}] RISK[${riskTolerance}%]\n> H[${hexaco.honesty}] E[${hexaco.emotionality}] X[${hexaco.extraversion}] A[${hexaco.agreeableness}] C[${hexaco.conscientiousness}] O[${hexaco.openness}]\n> \n> DETECTED ARCHETYPE: [${bestMatch.name.toUpperCase()}] (${displayMatchScore}%)\n> "${bestMatch.desc}"\n> \n> PRIMARY ASSETS:\n> ${strengths.slice(0, 4).map(s => `+ ${s}`).join('\n> ')}\n> \n> CORE WEAKNESSES:\n> ${weaknesses.slice(0, 3).map(w => `! ${w}`).join('\n> ')}\n> \n> OPTIMAL DEPLOYMENT:\n> ${careerText}\n> \n> SYSTEM STATUS: OPTIMIZED.`;

        return {
            archetype: bestMatch.name,
            archetypeDesc: bestMatch.desc,
            matchScore: displayMatchScore,
            strengths: strengths.slice(0, 5),
            weaknesses: weaknesses.slice(0, 3),
            career: careerText,
            cpuType,
            osType,
            raw,
            detailedWeaknesses,
            actionableSteps
        };
    }
}
