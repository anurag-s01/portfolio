"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { cssVar, useResolvedTheme } from "@/components/ThemeToggle";

// The shader library loads after first paint, so it never delays the hero text.
const LiquidMetal = dynamic(() => import("@paper-design/shaders-react").then((m) => m.LiquidMetal), { ssr: false });

// Paper's "Backdrop" preset (liquidMetalPresets[2]), inlined so importing it doesn't pull the library in eagerly.
const BACKDROP = { fit: "contain", scale: 1, softness: 0.05, repetition: 1.5, distortion: 0.1, contour: 0.4, shape: "none", angle: 90 } as const;

// Full-screen liquid-metal shader behind the home hero, coloured from the theme tokens.
// Fades out over the first viewport of scroll and stops animating once invisible.
export function LiquidMetalHero({ children }: { children: React.ReactNode }) {
    const reduce = useReducedMotion();
    const { scrollY } = useScroll();
    const opacity = useTransform(scrollY, [0, 700], [1, 0]);
    const [visible, setVisible] = useState(true);
    useMotionValueEvent(opacity, "change", (v) => setVisible(v > 0.01));
    // The shader needs a literal colour, so read the themed page background whenever the theme flips.
    const theme = useResolvedTheme();
    const [colors, setColors] = useState({ back: "#000", tint: "#3b82f6" });
    useEffect(() => setColors({ back: cssVar("--page-background"), tint: cssVar("--accent-solid-strong", "#3b82f6") }), [theme]);

    return (
        <>
            <motion.div
                aria-hidden
                style={{ opacity, position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }}>
                <LiquidMetal
                    {...BACKDROP}
                    colorBack={colors.back}
                    colorTint={colors.tint}
                    shiftRed={0.08}
                    shiftBlue={0.02}
                    speed={reduce || !visible ? 0 : 0.6}
                    style={{ width: "100%", height: "100%", opacity: theme === "light" ? 0.6 : 0.45 }}
                />
                {/* Keeps the headline readable over the brightest metal. */}
                <div style={{
                    position: "absolute", inset: 0,
                    background: "linear-gradient(100deg, var(--page-background) 15%, transparent 70%), linear-gradient(to top, var(--page-background), transparent 40%)",
                }} />
            </motion.div>
            <div style={{ position: "relative", zIndex: 1, width: "100%" }}>{children}</div>
        </>
    );
}
