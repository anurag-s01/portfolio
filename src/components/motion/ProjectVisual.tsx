"use client";

import React, { useEffect, useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import s from "./ProjectVisual.module.scss";

const W = 640;
const H = 360;

type BoxProps = { x: number; y: number; w: number; h: number; label: string; sub?: string; variant?: "brand" | "accent" };

function Box({ x, y, w, h, label, sub, variant }: BoxProps) {
    const cls = variant === "brand" ? s.nodeBrand : variant === "accent" ? s.nodeAccent : s.node;
    const cy = y + h / 2;
    return (
        <g>
            <rect x={x} y={y} width={w} height={h} rx={10} className={cls} />
            <text x={x + w / 2} y={sub ? cy - 2 : cy + 4} textAnchor="middle" className={s.text}>{label}</text>
            {sub && <text x={x + w / 2} y={cy + 14} textAnchor="middle" className={s.small}>{sub}</text>}
        </g>
    );
}

// A dot travelling along an SVG path, forever. Negative begin = already mid-flight on first paint.
function Packet({ d, dur = 2.4, offset = 0, accent }: { d: string; dur?: number; offset?: number; accent?: boolean }) {
    if (useReducedMotion()) return null;
    return (
        <circle r={3.5} className={accent ? s.packetAccent : s.packet}>
            <animateMotion path={d} dur={`${dur}s`} begin={`-${offset}s`} repeatCount="indefinite" />
        </circle>
    );
}

function Wire({ d }: { d: string }) {
    return <path d={d} className={s.wire} />;
}

function Frame({ label, children }: { label: string; children: React.ReactNode }) {
    const ref = useRef<SVGSVGElement>(null);
    const inView = useInView(ref);

    // Pause SMIL + CSS animations while off-screen.
    useEffect(() => {
        const svg = ref.current;
        if (!svg) return;
        if (inView) svg.unpauseAnimations();
        else svg.pauseAnimations();
        svg.classList.toggle(s.paused, !inView);
    }, [inView]);

    return (
        <svg ref={ref} viewBox={`0 0 ${W} ${H}`} className={s.frame} role="img" aria-label={label}>
            <defs>
                <pattern id="pv-grid" width="32" height="32" patternUnits="userSpaceOnUse">
                    <path d="M32 0H0V32" fill="none" className={s.grid} />
                </pattern>
            </defs>
            <rect width={W} height={H} fill="url(#pv-grid)" opacity={0.6} />
            {children}
        </svg>
    );
}

function Notifications() {
    const channels = ["SMS", "Push", "Email", "WhatsApp", "Live Activity"];
    const ys = channels.map((_, i) => 57 + i * 65);
    return (
        <Frame label="JFL brands call the notification platform, which publishes through Kafka to five channels">
            <Wire d="M150 180H190" />
            <Wire d="M330 180H370" />
            {ys.map((y) => <Wire key={y} d={`M460 180C480 180 480 ${y} 500 ${y}`} />)}
            {ys.map((y, i) => (
                <Packet key={y} d={`M150 180H460C480 180 480 ${y} 500 ${y}`} dur={2.6} offset={i * 0.52} accent={i % 2 === 1} />
            ))}
            <Box x={20} y={145} w={130} h={70} label="5 JFL brands" sub="order · promo · OTP" />
            <Box x={190} y={120} w={140} h={120} label="Notify Platform" sub="templates · fallback" variant="brand" />
            <text x={260} y={222} textAnchor="middle" className={s.small}>134K req/min peak</text>
            <Box x={370} y={155} w={90} h={50} label="Kafka" variant="accent" />
            {channels.map((c, i) => <Box key={c} x={500} y={ys[i] - 17} w={120} h={34} label={c} />)}
        </Frame>
    );
}

function Campaign() {
    const rules = ["new_user == true", "city ∈ cohort[BLR, DEL]", "cart_value ≥ ₹499", "time ∈ 18:00–23:00", "priority → 1"];
    return (
        <Frame label="Campaign rule engine evaluating cart conditions with zero deployments">
            <Wire d="M144 180H180" />
            <Wire d="M440 180H476" />
            <Packet d="M144 180H180" dur={1.2} />
            <Packet d="M440 180H476" dur={1.2} offset={0.6} />
            <Box x={24} y={140} w={120} h={80} label="Cart" sub="user · city · items" />
            <rect x={180} y={50} width={260} height={260} rx={12} className={s.node} />
            <text x={198} y={76} className={s.small}>rule-evaluation core</text>
            {rules.map((r, i) => (
                <g key={r}>
                    <motion.rect
                        x={192} y={92 + i * 40} width={236} height={30} rx={6}
                        className={s.nodeBrand}
                        initial={{ opacity: 0.15 }}
                        animate={{ opacity: [0.15, 1, 1, 0.15] }}
                        transition={{ duration: 4.5, times: [0, 0.1, 0.75, 1], delay: i * 0.35, repeat: Infinity, repeatDelay: 0.5 }}
                    />
                    <text x={204} y={112 + i * 40} className={s.text} style={{ fontSize: 12 }}>{r}</text>
                    <motion.text
                        x={414} y={112 + i * 40} textAnchor="end" className={s.brandText}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: [0, 1, 1, 0] }}
                        transition={{ duration: 4.5, times: [0, 0.1, 0.75, 1], delay: i * 0.35 + 0.15, repeat: Infinity, repeatDelay: 0.5 }}>
                        ✓
                    </motion.text>
                </g>
            ))}
            <Box x={476} y={140} w={140} h={80} label="Campaign live" sub="packaging · COD fee" variant="brand" />
            <text x={W / 2} y={340} textAnchor="middle" className={s.small}>0 deployments · 100+ campaign changes / quarter</text>
        </Frame>
    );
}

function StoreLoad() {
    const cols = 20;
    const rows = 14;
    const cells = Array.from({ length: cols * rows }, (_, i) => i);
    return (
        <Frame label="Real-time load scoring across 2,500+ stores">
            <Wire d="M99 86V122" />
            <Wire d="M99 166V200" />
            <Wire d="M99 256V290" />
            <Packet d="M99 86V122" dur={1} />
            <Packet d="M99 166V200" dur={1} offset={0.4} accent />
            <Packet d="M99 256V290" dur={1} offset={0.8} />
            <Box x={24} y={30} w={150} h={56} label="Live events" sub="customer · rider · order" />
            <Box x={24} y={122} w={150} h={44} label="Kafka" variant="accent" />
            <Box x={24} y={200} w={150} h={56} label="Load model" sub="per-store score" variant="brand" />
            <Box x={24} y={290} w={150} h={50} label="RabbitMQ" sub="graduated mitigation" />
            {cells.map((i) => (
                <rect
                    key={i}
                    x={212 + (i % cols) * 20.3}
                    y={30 + Math.floor(i / cols) * 21.5}
                    width={12} height={12} rx={3}
                    className={s.store}
                    style={{ animationDelay: `-${((i * 37) % 97) / 97 * 6}s`, animationDuration: `${5 + ((i * 13) % 7) * 0.5}s` }}
                />
            ))}
            <text x={616} y={352} textAnchor="end" className={s.small}>2,500+ stores · scored in real time</text>
        </Frame>
    );
}

function series(before: number, after: number, wobble: number) {
    const toY = (v: number) => 300 - (v / 40) * 250;
    const pts: string[] = [];
    for (let i = 0; i <= 54; i++) {
        const x = 60 + i * 10;
        const t = Math.min(1, Math.max(0, (x - 330) / 24));
        const v = before + (after - before) * t + Math.sin(i * 1.7) * wobble * (1 - t * 0.7);
        pts.push(`${i ? "L" : "M"}${x} ${toY(v).toFixed(1)}`);
    }
    return pts.join(" ");
}

function Latency() {
    const draw = { duration: 3, ease: "easeInOut" as const, repeat: Infinity, repeatDelay: 2.5 };
    return (
        <Frame label="p99 latency dropping from 29.4ms to 5.8ms">
            {[0, 15, 30].map((v) => (
                <g key={v}>
                    <line x1={60} x2={600} y1={300 - (v / 40) * 250} y2={300 - (v / 40) * 250} className={s.grid} />
                    <text x={50} y={304 - (v / 40) * 250} textAnchor="end" className={s.small}>{v}ms</text>
                </g>
            ))}
            <line x1={340} x2={340} y1={40} y2={300} className={s.lineMuted} />
            <text x={348} y={56} className={s.small}>N+1 removed · in-memory cache</text>
            <motion.path d={series(14.6, 2.6, 1)} className={s.lineMuted} style={{ strokeDasharray: "none", stroke: "var(--brand-solid-medium)" }}
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={draw} />
            <motion.path d={series(29.4, 5.8, 1.8)} className={s.line}
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={draw} />
            <text x={70} y={52} className={s.text}>p99 29.4ms → 5.8ms</text>
            <text x={70} y={70} className={s.small} style={{ fill: "var(--accent-on-background-strong)" }}>avg 14.6ms → 2.6ms</text>
            <text x={600} y={140} textAnchor="end" className={s.big} style={{ fill: "var(--brand-on-background-strong)" }}>−80%</text>
            <text x={600} y={160} textAnchor="end" className={s.small}>at 155K req/min</text>
        </Frame>
    );
}

function Payments() {
    // Left: where orders come from (Swiggy Toing is the new ordering partner).
    // Right: how they're paid (TWID points and eVoucher are the new methods).
    const methods: [string, string?][] = [["Cash"], ["Card"], ["UPI"], ["Wallet"], ["TWID points", "new"], ["eVoucher", "new"]];
    const inPath = (y: number) => `M174 ${y}C200 ${y} 205 180 230 180`;
    const outPath = (y: number) => `M380 180C430 180 440 ${y} 480 ${y}`;
    const ys = methods.map((_, i) => 47 + i * 50);
    return (
        <Frame label="Orders from the Domino's app and the new Swiggy Toing partner integration flow into checkout, which now also accepts TWID reward points and eVouchers alongside cash, card, UPI and wallet">
            {[110, 230].map((y, i) => (
                <g key={y}>
                    <Wire d={inPath(y)} />
                    <Packet d={inPath(y)} dur={1.6} offset={i * 0.8} accent={i === 1} />
                </g>
            ))}
            {ys.map((y, i) => (
                <g key={y}>
                    <Wire d={outPath(y)} />
                    {methods[i][1] && <Packet d={outPath(y)} dur={1.8} offset={i * 0.4} accent />}
                </g>
            ))}
            <text x={24} y={62} className={s.small}>order channels</text>
            <Box x={24} y={86} w={150} h={48} label="Domino's app & web" />
            <Box x={24} y={202} w={150} h={56} label="Swiggy Toing" sub="new ordering partner" variant="accent" />
            <Box x={230} y={135} w={150} h={90} label="Checkout" sub="ordering backend" variant="brand" />
            {methods.map(([m, isNew], i) => (
                <Box key={m} x={480} y={ys[i] - 17} w={136} h={34} label={m} variant={isNew ? "accent" : undefined} />
            ))}
        </Frame>
    );
}

function Corporate() {
    const items = ["Margherita", "Farmhouse", "Garlic Bread", "Choco Lava", "Peppy Paneer", "Pepsi 500ml", "Taco Mexicana", "Veg Extravaganza"];
    const rows = Array.from({ length: 16 }, (_, i) => `SKU-${String(i * 61 + 7).padStart(4, "0")}  ${items[i % items.length].padEnd(16)} ×${(i * 7) % 40 + 5}`);
    return (
        <Frame label="Self-serve corporate orders of up to 1,000 unique items">
            <defs>
                <clipPath id="pv-sheet"><rect x={200} y={78} width={240} height={226} /></clipPath>
            </defs>
            <Wire d="M164 180H200" />
            <Wire d="M440 180H480" />
            <Packet d="M164 180H200" dur={1.2} />
            <Packet d="M440 180H480" dur={1.2} offset={0.6} accent />
            <Box x={24} y={140} w={140} h={80} label="Corporate client" sub="self-serve portal" />
            <rect x={200} y={40} width={240} height={270} rx={12} className={s.node} />
            <text x={214} y={64} className={s.text}>bulk order</text>
            <text x={426} y={64} textAnchor="end" className={s.brandText}>≤ 1,000 SKUs</text>
            <g clipPath="url(#pv-sheet)">
                <motion.g animate={{ y: [0, -16 * 24] }} transition={{ duration: 14, ease: "linear", repeat: Infinity }}>
                    {[...rows, ...rows].map((r, i) => (
                        <text key={i} x={214} y={96 + i * 24} className={s.small} style={{ whiteSpace: "pre" }}>{r}</text>
                    ))}
                </motion.g>
            </g>
            <Box x={480} y={130} w={136} h={70} label="Store systems" sub="no added load" variant="brand" />
            <path d="M488 240H608" className={s.line} />
            <text x={548} y={260} textAnchor="middle" className={s.small}>store load: flat</text>
        </Frame>
    );
}

function Train() {
    const stations: [number, number, string][] = [[40, 280, "NDLS"], [180, 228, "KOTA"], [320, 275, "RTM"], [460, 215, "BRC"], [600, 248, "BCT"]];
    const track = "M" + stations.map(([x, y]) => `${x} ${y}`).join(" L");
    const reduce = useReducedMotion();
    return (
        <Frame label="Zomato train orders flow through a template engine into Domino's, and the order management service was re-integrated with NXG cart, with deliveries at stations along the route">
            {/* 1. Zomato train orders, template-driven */}
            <Wire d="M190 52H230" />
            <Wire d="M410 52H450" />
            <Packet d="M150 52H490" dur={2.4} />
            <Box x={30} y={30} w={160} h={44} label="Zomato" sub="train orders" />
            <Box x={230} y={30} w={180} h={44} label="Template engine" variant="brand" />
            <Box x={450} y={30} w={160} h={44} label="Domino's orders" />
            {/* 2. Order management ⇄ NXG cart, revamped integration */}
            <Wire d="M290 130H350" />
            <Packet d="M290 124H350" dur={1.4} />
            <Packet d="M350 136H290" dur={1.4} offset={0.7} accent />
            <Box x={130} y={108} w={160} h={44} label="NXG cart" />
            <Box x={350} y={102} w={180} h={56} label="Order management" sub="revamped integration" variant="accent" />
            <path d={track} className={s.lineMuted} style={{ strokeDasharray: "none", strokeWidth: 3 }} />
            {stations.map(([x, y, name], i) => (
                <g key={name}>
                    <circle cx={x} cy={y} r={6} className={s.nodeAccent} />
                    <text x={x} y={y + 26} textAnchor="middle" className={s.small}>{name}</text>
                    <motion.circle
                        cx={x} cy={y - 20} r={5} className={s.packet}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: [0, 1, 1, 0], scale: [0, 1.2, 1, 0] }}
                        transition={{ duration: 2, times: [0, 0.15, 0.7, 1], delay: i * 2, repeat: Infinity, repeatDelay: 8 }}
                    />
                </g>
            ))}
            {!reduce && (
                <rect x={-12} y={-6} width={24} height={12} rx={4} className={s.nodeBrand} style={{ fill: "var(--accent-solid-strong)" }}>
                    <animateMotion path={track} dur="10s" rotate="auto" repeatCount="indefinite" />
                </rect>
            )}
            <text x={W / 2} y={345} textAnchor="middle" className={s.small}>+230 bps flow conversion · +25% train orders</text>
        </Frame>
    );
}

function FlatPrice() {
    const toggles = ["time window", "region", "segment"];
    const base = 300;
    return (
        <Frame label="Flat-price menu A/B test driving up to 49% more campaign conversions">
            {toggles.map((t, i) => (
                <g key={t} transform={`translate(${60 + i * 180} 40)`}>
                    <rect width={160} height={36} rx={18} className={s.node} />
                    <text x={18} y={23} className={s.small}>{t}</text>
                    <rect x={112} y={10} width={34} height={16} rx={8} className={s.nodeBrand} />
                    <motion.circle
                        cy={18} r={6} style={{ fill: "var(--accent-solid-strong)" }}
                        initial={{ cx: 120 }}
                        animate={{ cx: [120, 138, 138, 120] }}
                        transition={{ duration: 4, times: [0, 0.15, 0.85, 1], delay: i * 0.3, repeat: Infinity, repeatDelay: 1 }}
                    />
                </g>
            ))}
            <line x1={120} x2={520} y1={base} y2={base} className={s.lineMuted} style={{ strokeDasharray: "none" }} />
            {[{ x: 190, h: 110, label: "control", cls: s.node }, { x: 350, h: 164, label: "flat price", cls: s.nodeBrand }].map((b, i) => (
                <g key={b.label}>
                    <motion.rect
                        x={b.x} width={100} rx={8} className={b.cls}
                        initial={{ height: 0, y: base }}
                        animate={{ height: [0, b.h, b.h, 0], y: [base, base - b.h, base - b.h, base] }}
                        transition={{ duration: 5, times: [0, 0.3, 0.85, 1], delay: i * 0.2, repeat: Infinity, ease: "easeOut" }}
                    />
                    <text x={b.x + 50} y={base + 22} textAnchor="middle" className={s.small}>{b.label}</text>
                </g>
            ))}
            <motion.text
                x={400} y={base - 178} textAnchor="middle" className={s.big} style={{ fill: "var(--brand-on-background-strong)" }}
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0, 1, 1, 0] }}
                transition={{ duration: 5, times: [0, 0.25, 0.35, 0.85, 1], repeat: Infinity }}>
                +49%
            </motion.text>
            <text x={W / 2} y={345} textAnchor="middle" className={s.small}>campaign-driven conversions vs control</text>
        </Frame>
    );
}

// Real BFS (Dijkstra with unit weights) on a small grid, precomputed once.
const GC = 24, GR = 13, PITCH = 24, OX = 32, OY = 22;
const START = [2, 6], END = [21, 6];
const WALLS = new Set<number>();
for (let r = 0; r < GR; r++) {
    if (r !== 2) WALLS.add(r * GC + 7);
    if (r !== 10) WALLS.add(r * GC + 12);
    if (r !== 1 && r !== 11) WALLS.add(r * GC + 17);
}
const { order, path } = (() => {
    const start = START[1] * GC + START[0];
    const end = END[1] * GC + END[0];
    const prev = new Map<number, number>([[start, -1]]);
    const order: number[] = [];
    const queue = [start];
    while (queue.length) {
        const cur = queue.shift()!;
        order.push(cur);
        if (cur === end) break;
        const c = cur % GC, r = Math.floor(cur / GC);
        for (const [dc, dr] of [[1, 0], [0, 1], [-1, 0], [0, -1]]) {
            const nc = c + dc, nr = r + dr, n = nr * GC + nc;
            if (nc < 0 || nr < 0 || nc >= GC || nr >= GR || WALLS.has(n) || prev.has(n)) continue;
            prev.set(n, cur);
            queue.push(n);
        }
    }
    const path: number[] = [];
    for (let n = end; n !== -1; n = prev.get(n)!) path.unshift(n);
    return { order, path };
})();

function Pathfinding() {
    const step = 4.8 / order.length;
    const cell = (i: number) => ({ x: OX + (i % GC) * PITCH + 2, y: OY + Math.floor(i / GC) * PITCH + 2, width: PITCH - 4, height: PITCH - 4, rx: 4 });
    return (
        <Frame label="Hurdler 2.0 running Dijkstra's shortest path around walls">
            {Array.from({ length: GC * GR }, (_, i) => (
                <rect key={i} {...cell(i)} className={WALLS.has(i) ? s.wall : s.cell} />
            ))}
            {order.map((i, k) => <rect key={`v${i}`} {...cell(i)} className={s.visit} style={{ animationDelay: `${k * step}s` }} />)}
            {path.map((i, k) => <rect key={`p${i}`} {...cell(i)} className={s.path} style={{ animationDelay: `${5 + k * 0.03}s` }} />)}
            {[START, END].map(([c, r], i) => (
                <circle key={i} cx={OX + c * PITCH + PITCH / 2} cy={OY + r * PITCH + PITCH / 2} r={7} className={i ? s.packetAccent : s.packet} />
            ))}
        </Frame>
    );
}

const visuals: Record<string, () => React.ReactElement> = {
    notifications: Notifications,
    campaign: Campaign,
    "store-load": StoreLoad,
    latency: Latency,
    payments: Payments,
    corporate: Corporate,
    train: Train,
    "flat-price": FlatPrice,
    pathfinding: Pathfinding,
};

export function ProjectVisual({ visual }: { visual: string }) {
    const Visual = visuals[visual];
    return Visual ? <Visual /> : null;
}
