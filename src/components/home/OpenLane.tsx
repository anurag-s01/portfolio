"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { PiCoffee, PiPingPong, PiEnvelopeSimple, PiLinkedinLogo, PiCopy, PiCheck, PiArrowUpRight } from "react-icons/pi";
import styles from "./OpenLane.module.scss";
import { Lightbox } from "@/components/Lightbox";
import { cssVar, useResolvedTheme } from "@/components/ThemeToggle";

const LEVELS = [
    { name: "Bubbles", done: true, cert: "/images/off-hours/level-1.jpg" },
    { name: "Ripples", done: true, cert: "/images/off-hours/level-2.jpg" },
    { name: "Stream", current: true },
    { name: "Current" },
    { name: "Wave" },
] as { name: string; done?: boolean; current?: boolean; cert?: string }[];

const ease = [0.22, 1, 0.36, 1] as const;

// Closing invitation. "Open lane" is pool shorthand for "there's room for you";
// the water and lane ropes hint at the hobby, the level track confirms it for the curious.
export function OpenLane({ email, linkedin }: { email: string; linkedin: string }) {
    const [copied, setCopied] = useState(false);
    const [cert, setCert] = useState<string | null>(null);
    const mail = (subject: string) => `mailto:${email}?subject=${encodeURIComponent(subject)}`;
    // mailto: silently does nothing when no mail app is registered. If the page still has
    // focus shortly after the click, nothing opened, so fall back to Gmail's web composer.
    const onMail = (subject: string) => () => {
        setTimeout(() => {
            if (document.hasFocus()) window.open(`https://mail.google.com/mail/?view=cm&to=${email}&su=${encodeURIComponent(subject)}`, "_blank", "noopener");
        }, 700);
    };


    const copy = async () => {
        try {
            await navigator.clipboard.writeText(email);
            setCopied(true);
            setTimeout(() => setCopied(false), 1800);
        } catch {
            window.location.href = mail("Hello");
        }
    };

    const rise = (i: number) => ({
        initial: { opacity: 0, y: 24 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, margin: "-80px" },
        transition: { duration: 0.8, delay: i * 0.08, ease },
    });

    return (
        <section id="contact" className={styles.section} aria-labelledby="open-lane-title">
            <Ripples />
            <div className={styles.ropes} aria-hidden>
                <span /><span /><span />
            </div>

            <div className={styles.content}>
                <motion.h2 id="open-lane-title" className={styles.title} {...rise(1)}>
                    Open lane.
                    <span>There&apos;s room for one more.</span>
                </motion.h2>
                <motion.p className={styles.lede} {...rise(2)}>
                    Hiring, building something hard, or want to argue about Kafka partitions? My inbox is open,
                    and so is my calendar for coffee or a best-of-five.
                </motion.p>

                <motion.div className={styles.actions} {...rise(3)}>
                    <a className={styles.primary} href={mail("Hello, Anurag")} onClick={onMail("Hello, Anurag")}>
                        <PiEnvelopeSimple aria-hidden /> Write to me
                    </a>
                    <button type="button" className={styles.copy} onClick={copy} aria-label={copied ? "Email copied" : `Copy ${email}`}>
                        {copied ? <PiCheck aria-hidden /> : <PiCopy aria-hidden />}
                        <span className={styles.full}>{copied ? "Copied" : email}</span>
                        <span className={styles.short}>{copied ? "Copied" : "Copy email"}</span>
                    </button>
                    <a className={styles.secondary} href={linkedin} target="_blank" rel="noopener noreferrer">
                        <PiLinkedinLogo aria-hidden /> LinkedIn <PiArrowUpRight aria-hidden className={styles.arrow} />
                    </a>
                </motion.div>

                <div className={styles.tiles}>
                    <motion.a className={styles.tile} href={mail("Coffee?")} onClick={onMail("Coffee?")} {...rise(4)}>
                        <PiCoffee className={styles.tileIcon} aria-hidden />
                        <strong>Coffee</strong>
                        <span>Thirty minutes. Your questions, my order.</span>
                    </motion.a>
                    <motion.a className={styles.tile} href={mail("Table tennis?")} onClick={onMail("Table tennis?")} {...rise(5)}>
                        <PiPingPong className={styles.tileIcon} aria-hidden />
                        <strong>Table tennis</strong>
                        <span>Best of five. Loser buys the coffee.</span>
                    </motion.a>
                    <motion.div className={`${styles.tile} ${styles.lane}`} {...rise(6)}>
                        <div className={styles.laneHead}>
                            <strong>Off-hours</strong>
                            <span className={styles.laneCount}>Lane 3 of 5</span>
                        </div>
                        <ol className={styles.track}>
                            {LEVELS.map((level, i) => (
                                <li key={level.name} data-done={level.done || undefined} data-current={level.current || undefined}>
                                    {level.cert ? (
                                        <button type="button" onClick={() => setCert(level.cert!)} aria-label={`${level.name}: view level ${i + 1} certificate`}>
                                            <i />
                                        </button>
                                    ) : (
                                        <i />
                                    )}
                                    <span>{level.name}</span>
                                </li>
                            ))}
                        </ol>
                        <span className={styles.caption}>Learning to swim properly, one level at a time.</span>
                    </motion.div>
                </div>
            </div>

            <Lightbox src={cert} alt="Swim level completion certificate" onClose={() => setCert(null)} />
        </section>
    );
}

// Concentric ripples on a dark water surface: from the pointer, plus a slow ambient drip.
function Ripples() {
    const ref = useRef<HTMLCanvasElement>(null);
    const theme = useResolvedTheme();

    useEffect(() => {
        const canvas = ref.current;
        const ctx = canvas?.getContext("2d");
        if (!canvas || !ctx) return;
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

        const ripples: { x: number; y: number; t: number }[] = [];
        const color = cssVar("--accent-solid-strong", "#2d69fa"); // ripples in the theme's blue
        let raf = 0;
        let visible = false;
        let last = 0;

        const resize = () => {
            const dpr = Math.min(window.devicePixelRatio, 2);
            canvas.width = canvas.clientWidth * dpr;
            canvas.height = canvas.clientHeight * dpr;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        };
        const add = (x: number, y: number) => ripples.push({ x, y, t: performance.now() });

        const draw = (now: number) => {
            ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
            for (let i = ripples.length - 1; i >= 0; i--) {
                const age = (now - ripples[i].t) / 1000;
                const alpha = Math.max(0, 1 - age / 2.6);
                if (alpha <= 0) { ripples.splice(i, 1); continue; }
                for (let ring = 0; ring < 3; ring++) {
                    const r = age * 90 - ring * 14;
                    if (r <= 0) continue;
                    ctx.beginPath();
                    ctx.arc(ripples[i].x, ripples[i].y, r, 0, Math.PI * 2);
                    ctx.strokeStyle = color;
                    ctx.globalAlpha = alpha * (0.45 - ring * 0.12);
                    ctx.lineWidth = 1.2;
                    ctx.stroke();
                }
            }
            if (now - last > 2600) {
                last = now;
                add(Math.random() * canvas.clientWidth, Math.random() * canvas.clientHeight);
            }
            if (visible) raf = requestAnimationFrame(draw);
        };

        const section = canvas.parentElement!;
        let lastMove = 0;
        const onMove = (e: PointerEvent) => {
            const now = performance.now();
            if (now - lastMove < 90) return;
            lastMove = now;
            const r = canvas.getBoundingClientRect();
            add(e.clientX - r.left, e.clientY - r.top);
        };
        const io = new IntersectionObserver(([entry]) => {
            visible = entry.isIntersecting;
            cancelAnimationFrame(raf);
            if (visible) raf = requestAnimationFrame(draw);
        });
        const ro = new ResizeObserver(resize);

        resize();
        ro.observe(canvas);
        io.observe(canvas);
        section.addEventListener("pointermove", onMove);
        return () => {
            cancelAnimationFrame(raf);
            io.disconnect();
            ro.disconnect();
            section.removeEventListener("pointermove", onMove);
        };
    }, [theme]);

    return <canvas ref={ref} className={styles.water} aria-hidden />;
}
