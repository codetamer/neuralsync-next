export interface ArchetypeTheme {
    primary: string;    // Text color class (e.g., text-neon-blue)
    glow: string;       // Shadow/Glow color (e.g., shadow-neon-blue)
    gradient: string;   // Gradient from class (e.g., from-blue-500)
    accent: string;     // Accent color hex for inline styles (e.g., #3b82f6)
}

export const getArchetypeTheme = (archetype: string): ArchetypeTheme => {
    switch (archetype) {
        case "Visionary Architect":
            return {
                primary: "text-blue-400",
                glow: "shadow-blue-500/50",
                gradient: "from-blue-500",
                accent: "#60a5fa"
            };
        case "Ethical Guardian":
            return {
                primary: "text-yellow-400",
                glow: "shadow-yellow-500/50",
                gradient: "from-yellow-500",
                accent: "#facc15"
            };
        case "Strategic Realpolitik":
            return {
                primary: "text-red-500",
                glow: "shadow-red-500/50",
                gradient: "from-red-600",
                accent: "#ef4444"
            };
        case "Social Catalyst":
            return {
                primary: "text-pink-500",
                glow: "shadow-pink-500/50",
                gradient: "from-pink-500",
                accent: "#ec4899"
            };
        case "Harmonic Resonator":
            return {
                primary: "text-teal-400",
                glow: "shadow-teal-500/50",
                gradient: "from-teal-500",
                accent: "#2dd4bf"
            };
        case "Chaos Navigator":
            return {
                primary: "text-orange-500",
                glow: "shadow-orange-500/50",
                gradient: "from-orange-500",
                accent: "#f97316"
            };
        case "Precision Engineer":
            return {
                primary: "text-cyan-300",
                glow: "shadow-cyan-400/50",
                gradient: "from-cyan-400",
                accent: "#67e8f9"
            };
        case "Renaissance Synthesizer":
            return {
                primary: "text-purple-400",
                glow: "shadow-purple-500/50",
                gradient: "from-purple-500",
                accent: "#c084fc"
            };
        default: // Adaptive Generalist
            return {
                primary: "text-white",
                glow: "shadow-white/50",
                gradient: "from-gray-400",
                accent: "#ffffff"
            };
    }
};
