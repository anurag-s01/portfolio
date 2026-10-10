"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import React from "react";
import { GradientDots } from "./GradientDots";

// three.js is only downloaded on pages that show the wave.
const DottedSurface = dynamic(() => import("./DottedSurface"), { ssr: false });

// Wave of dots behind every page except home (liquid-metal hero) and gallery.
export function PageBackdrop() {
    const pathname = usePathname() ?? "/";
    const isHome = pathname === "/" || /^\/[a-z]{2}\/?$/.test(pathname);
    // Gallery runs its own 3D scene; a second WebGL canvas would only compete with it.
    return isHome || pathname.endsWith("/gallery") ? null : <DottedSurface />;
}

// Gradient dot band behind a page title, faded out at the edges.
export function TitleBand({ children, center }: { children: React.ReactNode; center?: boolean }) {
    const mask = `radial-gradient(ellipse 70% 70% at ${center ? 50 : 30}% 50%, black 30%, transparent 80%)`;
    return (
        // overflow-x: clip stops the dot band widening the page on phones; it still bleeds vertically.
        <div style={{ position: "relative", width: "100%", overflowX: "clip" }}>
            <div
                aria-hidden
                style={{
                    position: "absolute",
                    inset: "-48px -24px",
                    opacity: 0.85,
                    borderRadius: "var(--radius-xl)",
                    overflow: "hidden",
                    maskImage: mask,
                    WebkitMaskImage: mask,
                }}>
                <GradientDots duration={20} />
            </div>
            <div style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: center ? "center" : "stretch" }}>{children}</div>
        </div>
    );
}
