"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";

type GradientDotsProps = React.ComponentProps<typeof motion.div> & {
    dotSize?: number;
    spacing?: number;
    duration?: number;
    backgroundColor?: string;
};

// Hex dot grid with drifting colour blobs behind it, recoloured from rainbow to the site's brand/accent.
export function GradientDots({
    dotSize = 8,
    spacing = 10,
    duration = 30,
    backgroundColor = "var(--page-background)",
    style,
    ...props
}: GradientDotsProps) {
    const reduce = useReducedMotion();
    const hexSpacing = spacing * 1.732;
    const dot = `radial-gradient(circle at 50% 50%, transparent 1.5px, ${backgroundColor} 0 ${dotSize}px, transparent ${dotSize}px)`;

    return (
        <motion.div
            aria-hidden
            style={{
                position: "absolute",
                inset: 0,
                backgroundColor,
                backgroundImage: `
                    ${dot}, ${dot},
                    radial-gradient(circle at 50% 50%, var(--accent-solid-strong), transparent 60%),
                    radial-gradient(circle at 50% 50%, var(--brand-solid-strong), transparent 60%),
                    radial-gradient(circle at 50% 50%, var(--accent-solid-medium), transparent 60%),
                    radial-gradient(ellipse at 50% 50%, var(--brand-solid-medium), transparent 60%)`,
                backgroundSize: `${spacing}px ${hexSpacing}px, ${spacing}px ${hexSpacing}px, 200% 200%, 200% 200%, 200% 200%, 200% ${hexSpacing}px`,
                backgroundPosition: `0px 0px, ${spacing / 2}px ${hexSpacing / 2}px, 0% 0%, 0% 0%, 0% 0%, 0% 0px`,
                ...style,
            }}
            animate={reduce ? undefined : {
                backgroundPosition: [
                    `0px 0px, ${spacing / 2}px ${hexSpacing / 2}px, 800% 400%, 1000% -400%, -1200% -600%, 400% ${hexSpacing}px`,
                    `0px 0px, ${spacing / 2}px ${hexSpacing / 2}px, 0% 0%, 0% 0%, 0% 0%, 0% 0%`,
                ],
            }}
            transition={{ backgroundPosition: { duration, ease: "linear", repeat: Infinity } }}
            {...props}
        />
    );
}
