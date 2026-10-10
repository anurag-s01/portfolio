"use client";

import React, { useRef, useState } from "react";
import { AnimatePresence, motion, MotionStyle, MotionValue, useInView, useScroll, useSpring, useTransform } from "framer-motion";
import { FadeHint } from "@/components/motion/primitives";
import { iconLibrary } from "@/once-ui/icons";
import styles from "./SkillOrbit.module.scss";

type Skill = { title: string; icon: string };

// Ring of liquid-glass orbs around a centre readout. The ring turns with scroll (half a
// revolution while the section scrolls into view); orbs stay upright. Hovering, focusing or
// tapping an orb swaps the centre title for that skill's name.
export function SkillOrbit({ skills, title, hint }: { skills: Skill[]; title: string; hint: string }) {
    const ref = useRef<HTMLDivElement>(null);
    const [active, setActive] = useState<string | null>(null);
    // Pop-in is driven by the whole ring, so a fast scroll can't leave single orbs hidden.
    const inView = useInView(ref, { once: true, amount: 0.2 });

    const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end end"] });
    const progress = useSpring(scrollYProgress, { stiffness: 80, damping: 20 });
    const rotate = useTransform(progress, [0, 1], [-90, 90]);

    // Sizes and positions are pure CSS (see the module), so the ring fits from the first paint.
    return (
        <div ref={ref} className={styles.stage}>
            {/* Title and skill name share one grid cell at the exact centre, so neither shifts the other. */}
            <div className={styles.center} aria-live="polite">
                <motion.h2 id={title} className={styles.title} animate={{ opacity: active ? 0 : 1 }} transition={{ duration: 0.25 }}>
                    {title}
                </motion.h2>
                <AnimatePresence>
                    {active && (
                        <motion.span
                            key={active}
                            className={styles.title}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }}
                            transition={{ duration: 0.25 }}>
                            {active}
                        </motion.span>
                    )}
                </AnimatePresence>
            </div>
            <FadeHint seconds={3} style={{ position: "absolute", left: 0, right: 0, top: "calc(50% + min(5.5cqi, 28px))", textAlign: "center", pointerEvents: "none", zIndex: 1 }}>
                <span className={styles.hint}>{hint}</span>
            </FadeHint>
            <motion.div className={styles.ring} style={{ rotate }}>
                {skills.map((skill, i) => {
                    const angle = (i / skills.length) * Math.PI * 2 - Math.PI / 2;
                    return (
                        <Orb
                            key={skill.title}
                            skill={skill}
                            index={i}
                            cx={Math.cos(angle)}
                            cy={Math.sin(angle)}
                            ringRotate={rotate}
                            visible={inView}
                            onActive={setActive}
                        />
                    );
                })}
            </motion.div>
        </div>
    );
}

function Orb({
    skill, index, cx, cy, ringRotate, visible, onActive,
}: {
    skill: Skill; index: number; cx: number; cy: number;
    ringRotate: MotionValue<number>; visible: boolean; onActive: (name: string | null) => void;
}) {
    const counter = useTransform(ringRotate, (r) => -r);
    const Icon = iconLibrary[skill.icon];

    return (
        <motion.div
            className={styles.slot}
            style={{ "--cx": cx.toFixed(4), "--cy": cy.toFixed(4), rotate: counter } as unknown as MotionStyle}
            initial={{ scale: 0, opacity: 0 }}
            animate={visible ? { scale: 1, opacity: 1 } : undefined}
            transition={{ type: "spring", stiffness: 260, damping: 18, delay: index * 0.05 }}>
            <motion.div
                className={styles.orb}
                whileHover={{ scale: 1.15 }}
                transition={{ type: "spring", stiffness: 300, damping: 15 }}
                tabIndex={0}
                aria-label={skill.title}
                onMouseEnter={() => onActive(skill.title)}
                onMouseLeave={() => onActive(null)}
                onFocus={() => onActive(skill.title)}
                onBlur={() => onActive(null)}>
                {Icon && <Icon aria-hidden />}
            </motion.div>
        </motion.div>
    );
}
