"use client";

import React, { useRef } from "react";
import { motion, MotionStyle, MotionValue, useInView, useScroll, useSpring, useTransform } from "framer-motion";
import { iconLibrary } from "@/once-ui/icons";
import styles from "./SkillOrbit.module.scss";

type Skill = { title: string; icon: string };

// Ring of liquid-metal orbs around a centre label. The ring turns with scroll
// (half a revolution while the section scrolls into view); orbs stay upright.
export function SkillOrbit({ skills, children }: { skills: Skill[]; children: React.ReactNode }) {
    const ref = useRef<HTMLDivElement>(null);
    // Pop-in is driven by the whole ring, so a fast scroll can't leave single orbs hidden.
    const inView = useInView(ref, { once: true, amount: 0.2 });

    const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end end"] });
    const progress = useSpring(scrollYProgress, { stiffness: 80, damping: 20 });
    const rotate = useTransform(progress, [0, 1], [-90, 90]);

    // Sizes and positions are pure CSS (see the module), so the ring fits from the first paint.
    return (
        <div ref={ref} className={styles.stage}>
            <div className={styles.center}>{children}</div>
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
                        />
                    );
                })}
            </motion.div>
        </div>
    );
}

function Orb({
    skill, index, cx, cy, ringRotate, visible,
}: {
    skill: Skill; index: number; cx: number; cy: number;
    ringRotate: MotionValue<number>; visible: boolean;
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
                aria-label={skill.title}>
                {Icon && <Icon />}
                <span className={styles.label}>{skill.title}</span>
            </motion.div>
        </motion.div>
    );
}
