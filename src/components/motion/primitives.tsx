"use client";

import React, { useEffect, useRef } from "react";
import {
    animate,
    motion,
    MotionConfig,
    useInView,
    useMotionTemplate,
    useMotionValue,
    useScroll,
    useSpring,
    useTransform,
} from "framer-motion";

const ease = [0.22, 1, 0.36, 1] as const;

// Respects the OS "reduce motion" setting for every motion component below.
export function MotionProvider({ children }: { children: React.ReactNode }) {
    return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}

export function ScrollProgress() {
    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });
    return (
        <motion.div
            aria-hidden
            style={{
                scaleX,
                transformOrigin: "0%",
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                height: 2,
                zIndex: 20,
                background: "linear-gradient(90deg, var(--accent-solid-strong), var(--brand-solid-strong))",
            }}
        />
    );
}

export function Reveal({
    children,
    delay = 0,
    y = 24,
    style,
}: {
    children: React.ReactNode;
    delay?: number;
    y?: number;
    style?: React.CSSProperties;
}) {
    return (
        <motion.div
            style={{ width: "100%", ...style }}
            initial={{ opacity: 0, y }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, delay, ease }}>
            {children}
        </motion.div>
    );
}

// Splits text into words that rise in one after another.
export function WordReveal({ text, delay = 0 }: { text: string; delay?: number }) {
    return (
        <span aria-label={text} style={{ display: "inline" }}>
            {text.split(" ").map((word, i) => (
                <span key={i} aria-hidden style={{ display: "inline-block", overflow: "hidden", verticalAlign: "top" }}>
                    <motion.span
                        style={{ display: "inline-block" }}
                        initial={{ y: "110%" }}
                        animate={{ y: 0 }}
                        transition={{ duration: 0.8, delay: delay + i * 0.06, ease }}>
                        {word}&nbsp;
                    </motion.span>
                </span>
            ))}
        </span>
    );
}

export function CountUp({ value, suffix = "", decimals = 0 }: { value: number; suffix?: string; decimals?: number }) {
    const ref = useRef<HTMLSpanElement>(null);
    const inView = useInView(ref, { once: true });

    useEffect(() => {
        if (!inView || !ref.current) return;
        const node = ref.current;
        const controls = animate(0, value, {
            duration: 1.6,
            ease,
            onUpdate: (v) => {
                node.textContent = v.toLocaleString("en-IN", { maximumFractionDigits: decimals, minimumFractionDigits: decimals }) + suffix;
            },
        });
        return () => controls.stop();
    }, [inView, value, suffix, decimals]);

    return <span ref={ref}>0{suffix}</span>;
}

// Card that tilts toward the cursor with a spotlight following it.
export function TiltCard({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
    const x = useMotionValue(0.5);
    const y = useMotionValue(0.5);
    const rotateX = useSpring(useTransform(y, [0, 1], [5, -5]), { stiffness: 200, damping: 20 });
    const rotateY = useSpring(useTransform(x, [0, 1], [-5, 5]), { stiffness: 200, damping: 20 });
    const px = useTransform(x, (v) => `${v * 100}%`);
    const py = useTransform(y, (v) => `${v * 100}%`);
    const spotlight = useMotionTemplate`radial-gradient(420px circle at ${px} ${py}, var(--brand-alpha-weak), transparent 60%)`;

    return (
        <motion.div
            onPointerMove={(e) => {
                if (e.pointerType !== "mouse") return;
                const r = e.currentTarget.getBoundingClientRect();
                x.set((e.clientX - r.left) / r.width);
                y.set((e.clientY - r.top) / r.height);
            }}
            onPointerLeave={() => {
                x.set(0.5);
                y.set(0.5);
            }}
            style={{ rotateX, rotateY, transformPerspective: 1000, position: "relative", width: "100%", ...style }}>
            <motion.div
                aria-hidden
                style={{ position: "absolute", inset: 0, borderRadius: "inherit", background: spotlight, pointerEvents: "none", zIndex: 1 }}
            />
            {children}
        </motion.div>
    );
}

// Vertical line that fills as the section scrolls past.
export function ScrollLine({ children }: { children: React.ReactNode }) {
    const ref = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({ target: ref, offset: ["start 70%", "end 60%"] });
    const scaleY = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

    return (
        <div ref={ref} style={{ position: "relative", paddingLeft: 28, width: "100%" }}>
            <div aria-hidden style={{ position: "absolute", left: 5, top: 8, bottom: 8, width: 2, background: "var(--neutral-alpha-weak)", borderRadius: 2 }} />
            <motion.div
                aria-hidden
                style={{
                    position: "absolute", left: 5, top: 8, bottom: 8, width: 2, borderRadius: 2,
                    scaleY, transformOrigin: "top",
                    background: "linear-gradient(var(--accent-solid-strong), var(--brand-solid-strong))",
                }}
            />
            {children}
        </div>
    );
}

export function TimelineDot() {
    return (
        <motion.span
            aria-hidden
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true, margin: "-120px" }}
            transition={{ type: "spring", stiffness: 300, damping: 18 }}
            style={{
                position: "absolute", left: -28, top: 6, width: 12, height: 12, borderRadius: "50%",
                background: "var(--accent-solid-strong)", boxShadow: "0 0 0 4px var(--brand-alpha-weak)",
            }}
        />
    );
}

// A hint that shows, then fades out after `seconds`. Replays only when it comes back into view
// (scrolling back to it) or the page is opened again, never on its own.
export function FadeHint({ children, seconds, style }: { children: React.ReactNode; seconds: number; style?: React.CSSProperties }) {
    const ref = useRef<HTMLDivElement>(null);
    const inView = useInView(ref, { amount: 0.6 });
    const [run, setRun] = React.useState(0);
    useEffect(() => {
        if (inView) setRun((n) => n + 1);
    }, [inView]);
    // The observer watches this stable wrapper; only the inner element is re-created to replay the fade.
    return (
        <div ref={ref} style={style}>
            <motion.div
                key={run}
                initial={{ opacity: run ? 1 : 0 }} // hidden until first seen, so the fade isn't spent off-screen
                animate={{ opacity: 0 }}
                transition={{ duration: 1, delay: Math.max(0, seconds - 1), ease: "easeOut" }}>
                {children}
            </motion.div>
        </div>
    );
}
