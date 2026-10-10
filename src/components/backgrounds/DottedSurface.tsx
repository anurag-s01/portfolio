"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { cssVar, useResolvedTheme } from "@/components/ThemeToggle";

const SEPARATION = 150;
const AMOUNTX = 40;
const AMOUNTY = 60;

// Animated wave of dots (three.js), tinted from the theme's brand to accent colour.
export function DottedSurface({ size = 8, opacity = 0.5 }: { size?: number; opacity?: number }) {
    const containerRef = useRef<HTMLDivElement>(null);
    const theme = useResolvedTheme();

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;
        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        const scene = new THREE.Scene();
        // Distant dots fade into the themed page colour.
        scene.fog = new THREE.Fog(new THREE.Color(cssVar("--page-background")), 2000, 10000);

        const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 10000);
        camera.position.set(0, 355, 1220);

        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setClearColor(0x000000, 0);
        container.appendChild(renderer.domElement);

        const from = new THREE.Color(cssVar("--accent-solid-strong", "#3b82f6"));
        const to = new THREE.Color(cssVar("--brand-solid-strong", "#6366f1"));
        const positions: number[] = [];
        const colors: number[] = [];
        for (let ix = 0; ix < AMOUNTX; ix++) {
            const c = from.clone().lerp(to, ix / (AMOUNTX - 1));
            for (let iy = 0; iy < AMOUNTY; iy++) {
                positions.push(ix * SEPARATION - (AMOUNTX * SEPARATION) / 2, 0, iy * SEPARATION - (AMOUNTY * SEPARATION) / 2);
                colors.push(c.r, c.g, c.b);
            }
        }

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
        geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
        const material = new THREE.PointsMaterial({ size, vertexColors: true, transparent: true, opacity, sizeAttenuation: true });
        scene.add(new THREE.Points(geometry, material));

        let count = 0;
        let animationId = 0;
        const frame = () => {
            const pos = geometry.attributes.position.array as Float32Array;
            let i = 0;
            for (let ix = 0; ix < AMOUNTX; ix++) {
                for (let iy = 0; iy < AMOUNTY; iy++) {
                    pos[i * 3 + 1] = Math.sin((ix + count) * 0.3) * 50 + Math.sin((iy + count) * 0.5) * 50;
                    i++;
                }
            }
            geometry.attributes.position.needsUpdate = true;
            renderer.render(scene, camera);
            count += 0.05;
            if (!reduce) animationId = requestAnimationFrame(frame);
        };
        frame();

        const handleResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
            if (reduce) renderer.render(scene, camera);
        };
        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
            cancelAnimationFrame(animationId);
            geometry.dispose();
            material.dispose();
            renderer.dispose();
            container.removeChild(renderer.domElement);
        };
    }, [size, opacity, theme]);

    return <div ref={containerRef} aria-hidden style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }} />;
}

export default DottedSurface;
