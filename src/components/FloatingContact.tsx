"use client";

import React, { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { motion, useAnimationFrame, useMotionValue, useReducedMotion } from "framer-motion";
import { PiEnvelopeSimple, PiHandTap } from "react-icons/pi";
import styles from "./FloatingContact.module.scss";

const EDGE = 12;
const NAV_CLEARANCE = 110; // keeps clear of the bottom nav on phones
const SLOT = "[data-cta-slot]"; // placeholder in the home hero, beside "Download Resume"
const DOCK_SCROLL = 60;        // px of scroll before it pops out of the hero
const IDLE_SPEED = 0.07;       // wave clock speed at rest: a slow drift
const MAX_SPEED = 0.7;          // cap so fast scrolling can't fling it around
// Visibility cycle while roaming (ms): shown, fading out, hidden, fading back in. Then it repeats.
const SHOWN = 10_000, FADE_OUT = 10_000, HIDDEN = 30_000, FADE_IN = 3_000;
const CYCLE = SHOWN + FADE_OUT + HIDDEN + FADE_IN;
const cycleOpacity = (t: number) => {
    const c = t % CYCLE;
    if (c < SHOWN) return 1;
    if (c < SHOWN + FADE_OUT) return 1 - (c - SHOWN) / FADE_OUT;
    if (c < SHOWN + FADE_OUT + HIDDEN) return 0;
    return (c - SHOWN - FADE_OUT - HIDDEN) / FADE_IN;
};
// Nav order, used to tell which way a page change went (left/right).
const ORDER = ["/", "/about", "/work", "/gallery"];
const pageIndex = (p: string) => ORDER.reduce((best, r, i) => (r === "/" ? p === "/" : p.startsWith(r)) ? i : best, 0);

// Floating "Get in touch" pill that lives in the root layout, so it persists across pages.
// At the top of the home page it sits docked in the hero slot like a normal button; once the
// visitor scrolls, drags it or changes page it pops out and roams on layered sine waves (phase
// pushed by scroll), swooping to a new spot on every page change. Scrolling back to the top of
// home re-docks it. A click (not a drag) goes to the contact section.
export function FloatingContact() {
    const router = useRouter();
    const pathname = usePathname();
    const reduce = useReducedMotion();
    const ref = useRef<HTMLButtonElement>(null);
    const x = useMotionValue(-200);
    const y = useMotionValue(-200);
    const fade = useMotionValue(0);
    const awayRef = useRef(true); // mirrors `away` below for the animation loop
    const [hidden, setHidden] = useState(true);

    // Mutable state for the animation loop (kept out of React to avoid re-rendering every frame).
    const s = useRef({
        anchor: { x: 0, y: 0 },       // where it currently drifts around
        target: { x: 0, y: 0 },       // where the anchor is gliding to
        pos: { x: 0, y: 0 },
        ready: false,
        drag: null as null | { id: number; dx: number; dy: number; moved: number },
        nextWander: 0,
        now: 0,                       // animation-loop clock (ms)
        boost: 0,                     // 1 right after a page change, decays to 0: a quicker swoop
        docked: false,
        released: false,              // dragged out of the hero: stays out until the next page change
        phase: 0,                     // wave clock; advances faster while the visitor scrolls
        vel: 0,                       // smoothed scroll speed (px/ms)
        lastScroll: 0,
        lastTime: 0,
        transit: null as null | { dir: 1 | -1; stage: "exit" | "enter" },
        page: -1,
        cycleStart: 0,                // when the current visibility cycle began (loop clock)
    });
    const [docked, setDocked] = useState(false);

    const zone = () => {
        const w = window.innerWidth;
        const h = window.innerHeight;
        const el = ref.current;
        const bw = el?.offsetWidth ?? 160;
        const bh = el?.offsetHeight ?? 52;
        const phone = w < 768;
        return {
            minX: EDGE, maxX: w - bw - EDGE,
            minY: 90, maxY: h - bh - (phone ? NAV_CLEARANCE : 28),
            // Default wandering band: right side, lower two thirds, so it never sits on the reading column.
            bandX: [w * (phone ? 0.45 : 0.68), w - bw - 24] as const,
            bandY: [h * 0.35, h - bh - (phone ? NAV_CLEARANCE + 10 : 60)] as const,
        };
    };
    const rand = (a: number, b: number) => a + Math.random() * Math.max(0, b - a);
    const pickTarget = () => {
        const z = zone();
        s.current.target = { x: rand(z.bandX[0], z.bandX[1]), y: rand(z.bandY[0], z.bandY[1]) };
    };

    // Place it once on mount: in the hero slot if there is one (visible at once), else fade in.
    useEffect(() => {
        const z = zone();
        const slot = document.querySelector<HTMLElement>(SLOT)?.getBoundingClientRect();
        const start = slot && window.scrollY < DOCK_SCROLL ? { x: slot.left, y: slot.top } : { x: z.bandX[1], y: z.bandY[1] };
        Object.assign(s.current, { anchor: { ...start }, target: { ...start }, pos: { ...start }, ready: true });
        x.set(start.x);
        y.set(start.y);
        const t = setTimeout(() => setHidden(false), slot ? 0 : 1200);
        return () => clearTimeout(t);
    }, []);

    // Follow the visitor to every page: dive off the edge in the direction they went, re-enter from the other side.
    useEffect(() => {
        const st = s.current;
        st.released = false;
        st.cycleStart = st.now; // new page: start the visibility cycle over (fully visible again)
        const idx = pageIndex(pathname ?? "/");
        if (st.ready && st.page >= 0) {
            pickTarget();
            st.boost = 1;
            if (!reduce && idx !== st.page) st.transit = { dir: idx > st.page ? 1 : -1, stage: "exit" };
        }
        st.page = idx;
    }, [pathname]);

    // Step aside while the contact section itself is on screen.
    const [contactVisible, setContactVisible] = useState(false);
    useEffect(() => {
        const check = () => {
            const el = document.getElementById("contact");
            if (!el) return setContactVisible(false);
            const r = el.getBoundingClientRect();
            setContactVisible(r.top < window.innerHeight * 0.7 && r.bottom > window.innerHeight * 0.3);
        };
        check();
        const id = setInterval(check, 400);
        return () => clearInterval(id);
    }, [pathname]);

    useAnimationFrame((time) => {
        const st = s.current;
        st.now = time;
        const dt = Math.min(64, time - (st.lastTime || time));
        st.lastTime = time;
        // Smoothed scroll speed drives how fast it drifts.
        const sy = window.scrollY;
        const v = dt > 0 ? Math.abs(sy - st.lastScroll) / dt : 0;
        st.lastScroll = sy;
        st.vel += (Math.min(v, 4) - st.vel) * 0.08;
        const speed = Math.min(MAX_SPEED, IDLE_SPEED + st.vel * 0.35);
        st.phase += (dt / 1000) * speed;
        // Fade cycle only while roaming; docked in the hero it's a normal, always-visible button.
        const o = awayRef.current ? 0 : st.docked || st.drag ? 1 : cycleOpacity(time - st.cycleStart);
        fade.set(fade.get() + (o - fade.get()) * 0.1);
        if (ref.current) ref.current.style.visibility = fade.get() < 0.02 ? "hidden" : "visible"; // hidden: not clickable or tabbable
        if (!st.ready || st.drag) return;

        // Page change: shoot out of one edge, come back in from the other.
        if (st.transit) {
            const w = window.innerWidth;
            const bw = ref.current?.offsetWidth ?? 52;
            const out = st.transit.dir > 0 ? w + 24 : -bw - 24;
            if (st.transit.stage === "exit") {
                st.pos.x += (out - st.pos.x) * 0.22;
                if (Math.abs(out - st.pos.x) < 6) {
                    st.transit.stage = "enter";
                    st.pos.x = st.transit.dir > 0 ? -bw - 24 : w + 24;
                    st.anchor = { ...st.target };
                }
                x.set(st.pos.x);
                y.set(st.pos.y);
                return;
            }
            // Entering: hand over once it's back on screen (to the dock, or to normal drifting).
            if (st.pos.x > 0 && st.pos.x < w - bw) st.transit = null;
        }

        // Docked: sit exactly in the hero slot (same fixed size as the docked pill, see the stylesheet).
        const slot = document.querySelector<HTMLElement>(SLOT);
        const wantDock = !!slot && !st.released && window.scrollY < DOCK_SCROLL;
        if (wantDock !== st.docked) {
            st.docked = wantDock;
            setDocked(wantDock);
            if (!wantDock) {
                st.cycleStart = time;
                // Pop out: roam from where it was, with a quick first swoop.
                st.anchor = { ...st.pos };
                pickTarget();
                st.boost = 1;
            }
        }
        if (st.docked && slot) {
            st.transit = null;
            const r = slot.getBoundingClientRect();
            st.pos.x += (r.left - st.pos.x) * 0.2;
            st.pos.y += (r.top - st.pos.y) * 0.2;
            x.set(st.pos.x);
            y.set(st.pos.y);
            return;
        }
        const z = zone();

        if (!reduce) {
            if (time > st.nextWander) {
                st.nextWander = time + 9000 + Math.random() * 6000;
                pickTarget();
            }
            // Anchor glides toward its target (slowly at rest, quicker while scrolling);
            // together with the waves below this traces curves, not lines.
            const k = 0.0015 + 0.0035 * Math.min(1, st.vel) + 0.035 * st.boost;
            st.boost *= 0.985;
            st.anchor.x += (st.target.x - st.anchor.x) * k;
            st.anchor.y += (st.target.y - st.anchor.y) * k;
        }

        const p = st.phase;
        const wave = reduce ? { x: 0, y: 0 } : {
            x: 46 * Math.sin(p * 1.9) + 18 * Math.sin(p * 4.3 + 2.1),
            y: 58 * Math.sin(p * 1.4 + 1.0) + 16 * Math.cos(p * 3.7),
        };
        const goal = {
            x: Math.min(z.maxX, Math.max(z.minX, st.anchor.x + wave.x)),
            y: Math.min(z.maxY, Math.max(z.minY, st.anchor.y + wave.y)),
        };
        // Final easing smooths any jitter (clamping at edges, resize); faster while re-entering.
        const ease = st.transit ? 0.14 : 0.03;
        st.pos.x += (goal.x - st.pos.x) * ease;
        st.pos.y += (goal.y - st.pos.y) * ease;
        x.set(st.pos.x);
        y.set(st.pos.y);
    });

    const onPointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
        try { e.currentTarget.setPointerCapture(e.pointerId); } catch { /* capture is best-effort */ }
        s.current.drag = { id: e.pointerId, dx: e.clientX - s.current.pos.x, dy: e.clientY - s.current.pos.y, moved: 0 };
        s.current.cycleStart = s.current.now; // touched: start the visibility cycle over
    };
    const onPointerMove = (e: React.PointerEvent<HTMLButtonElement>) => {
        const d = s.current.drag;
        if (!d || d.id !== e.pointerId) return;
        const z = zone();
        const nx = Math.min(z.maxX, Math.max(z.minX, e.clientX - d.dx));
        const ny = Math.min(z.maxY, Math.max(z.minY, e.clientY - d.dy));
        d.moved += Math.abs(nx - s.current.pos.x) + Math.abs(ny - s.current.pos.y);
        s.current.pos = { x: nx, y: ny };
        x.set(nx);
        y.set(ny);
    };
    const onPointerUp = (e: React.PointerEvent<HTMLButtonElement>) => {
        const d = s.current.drag;
        if (!d || d.id !== e.pointerId) return;
        s.current.drag = null;
        if (d.moved < 6) return go();
        // Dropped: keep drifting from here instead of snapping back (or into the hero slot).
        s.current.released = true;
        s.current.anchor = { ...s.current.pos };
        s.current.target = { ...s.current.pos };
        s.current.nextWander = s.current.now + 9000;
    };

    const go = () => {
        if (pathname === "/") document.getElementById("contact")?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
        else router.push("/#contact");
    };

    // Out of the way on Gallery (photos need a clear view) and while the contact section is on screen.
    const away = hidden || contactVisible || !!pathname?.endsWith("/gallery");
    awayRef.current = away;

    return (
        <motion.button
            ref={ref}
            type="button"
            className={styles.pill}
            data-docked={docked || undefined}
            style={{ x, y, opacity: fade }}
            animate={{ scale: away ? 0.6 : 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 22 }}
            aria-hidden={away || undefined}
            tabIndex={away ? -1 : 0}
            aria-label="Get in touch"
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={() => { s.current.drag = null; }}
            onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); go(); } }}>
            <span className={styles.ring} aria-hidden />
            <PiEnvelopeSimple className={`${styles.icon} ${styles.wide}`} aria-hidden />
            <PiHandTap className={`${styles.icon} ${styles.narrow}`} aria-hidden />
            <span className={styles.label}>Get in touch</span>
        </motion.button>
    );
}
