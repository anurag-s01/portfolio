"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";

type Range = { start: number; end: number };

interface FadeSettings { fadeIn: Range; fadeOut: Range }
interface BlurSettings { blurIn: Range; blurOut: Range; maxBlur: number }

interface InfiniteGalleryProps {
    images: { src: string; alt?: string }[];
    speed?: number;
    visibleCount?: number;
    fadeSettings?: FadeSettings;
    blurSettings?: BlurSettings;
    /** Rendered instead of the canvas when WebGL is unavailable. */
    fallback?: React.ReactNode;
    style?: React.CSSProperties;
}

const DEPTH_RANGE = 50;
const MAX_OFFSET = 8;

const vertexShader = `
  uniform float scrollForce;
  uniform float time;
  uniform float isHovered;
  varying vec2 vUv;

  void main() {
    vUv = uv;
    vec3 pos = position;

    // Planes bend like cloth while scrolling.
    float curveIntensity = scrollForce * 0.3;
    float d = length(pos.xy);
    float curve = d * d * curveIntensity;
    float cloth = (sin(pos.x * 2.0 + scrollForce * 3.0) * 0.02 + sin(pos.y * 2.5 + scrollForce * 2.0) * 0.015) * abs(curveIntensity) * 2.0;

    // Flag wave from the left edge when hovered.
    float flag = 0.0;
    if (isHovered > 0.5) {
      float damp = smoothstep(-0.5, 0.5, pos.x);
      flag = sin(pos.x * 3.0 + time * 8.0) * 0.1 * damp + sin(pos.x * 5.0 + time * 12.0) * 0.03 * damp;
    }

    pos.z -= curve + cloth + flag;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

const fragmentShader = `
  uniform sampler2D map;
  uniform float opacity;
  uniform float blurAmount;
  uniform float scrollForce;
  varying vec2 vUv;

  void main() {
    vec4 color = texture2D(map, vUv);

    if (blurAmount > 0.0) {
      vec2 texel = 1.0 / vec2(textureSize(map, 0));
      vec4 blurred = vec4(0.0);
      float total = 0.0;
      for (float x = -2.0; x <= 2.0; x += 1.0) {
        for (float y = -2.0; y <= 2.0; y += 1.0) {
          float w = 1.0 / (1.0 + length(vec2(x, y)));
          blurred += texture2D(map, vUv + vec2(x, y) * texel * blurAmount) * w;
          total += w;
        }
      }
      color = blurred / total;
    }

    color.rgb += vec3(abs(scrollForce) * 0.005);
    gl_FragColor = vec4(color.rgb, color.a * opacity);
    #include <colorspace_fragment>
  }
`;

const createClothMaterial = () =>
    new THREE.ShaderMaterial({
        transparent: true,
        uniforms: {
            map: { value: null },
            opacity: { value: 0 },
            blurAmount: { value: 0 },
            scrollForce: { value: 0 },
            time: { value: 0 },
            isHovered: { value: 0 },
        },
        vertexShader,
        fragmentShader,
    });

// Maps a value through an "in" ramp (0→1) and an "out" ramp (1→0); outside both it is flat.
function ramp(t: number, inR: Range, outR: Range) {
    if (t < inR.start) return 0;
    if (t <= inR.end) return (t - inR.start) / (inR.end - inR.start);
    if (t < outR.start) return 1;
    if (t <= outR.end) return 1 - (t - outR.start) / (outR.end - outR.start);
    return 0;
}

function GalleryScene({
    images,
    speed = 1,
    visibleCount = 8,
    fadeSettings,
    blurSettings,
}: Required<Pick<InfiniteGalleryProps, "images" | "fadeSettings" | "blurSettings">> & Pick<InfiniteGalleryProps, "speed" | "visibleCount">) {
    const { gl } = useThree();
    const textures = useTexture(images.map((img) => img.src));
    useMemo(() => textures.forEach((t) => { t.colorSpace = THREE.SRGBColorSpace; }), [textures]);

    const materials = useMemo(() => Array.from({ length: visibleCount }, createClothMaterial), [visibleCount]);
    useEffect(() => () => materials.forEach((m) => m.dispose()), [materials]);

    // Golden-angle scatter so planes don't line up.
    const spots = useMemo(
        () =>
            Array.from({ length: visibleCount }, (_, i) => ({
                x: (Math.sin((i * 2.618) % (Math.PI * 2)) * (i % 3) * 1.2 * MAX_OFFSET) / 3,
                y: (Math.cos((i * 1.618 + Math.PI / 3) % (Math.PI * 2)) * ((i + 1) % 4) * 0.8 * MAX_OFFSET) / 4,
            })),
        [visibleCount],
    );

    const planes = useRef(
        Array.from({ length: visibleCount }, (_, i) => ({
            z: ((DEPTH_RANGE / visibleCount) * i) % DEPTH_RANGE,
            imageIndex: i % images.length,
        })),
    );
    const meshes = useRef<(THREE.Mesh | null)[]>([]);

    // Kept in refs: updating React state every frame would re-render the scene 60×/s.
    const velocity = useRef(0);
    const lastInteraction = useRef(0);
    const reduceMotion = useRef(false);

    useEffect(() => {
        reduceMotion.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        const canvas = gl.domElement;
        const nudge = (v: number) => {
            velocity.current += v * speed;
            lastInteraction.current = Date.now();
        };
        const onWheel = (e: WheelEvent) => {
            e.preventDefault();
            nudge(e.deltaY * 0.01);
        };
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "ArrowUp" || e.key === "ArrowLeft") nudge(-2);
            if (e.key === "ArrowDown" || e.key === "ArrowRight") nudge(2);
        };
        let touchY = 0;
        const onTouchStart = (e: TouchEvent) => { touchY = e.touches[0].clientY; };
        const onTouchMove = (e: TouchEvent) => {
            e.preventDefault();
            const y = e.touches[0].clientY;
            nudge((touchY - y) * 0.03);
            touchY = y;
        };
        canvas.addEventListener("wheel", onWheel, { passive: false });
        canvas.addEventListener("touchstart", onTouchStart, { passive: true });
        canvas.addEventListener("touchmove", onTouchMove, { passive: false });
        window.addEventListener("keydown", onKey);
        return () => {
            canvas.removeEventListener("wheel", onWheel);
            canvas.removeEventListener("touchstart", onTouchStart);
            canvas.removeEventListener("touchmove", onTouchMove);
            window.removeEventListener("keydown", onKey);
        };
    }, [gl, speed]);

    useFrame((state, delta) => {
        // Auto-play resumes 3s after the last interaction.
        if (!reduceMotion.current && Date.now() - lastInteraction.current > 3000) velocity.current += 0.3 * delta;
        velocity.current *= 0.95;

        const v = velocity.current;
        const time = state.clock.getElapsedTime();
        const total = images.length;
        const advance = visibleCount % total || total;

        planes.current.forEach((plane, i) => {
            let z = plane.z + v * delta * 10;
            if (z >= DEPTH_RANGE) {
                const wraps = Math.floor(z / DEPTH_RANGE);
                plane.imageIndex = (plane.imageIndex + wraps * advance) % total;
            } else if (z < 0) {
                const wraps = Math.ceil(-z / DEPTH_RANGE);
                plane.imageIndex = (((plane.imageIndex - wraps * advance) % total) + total) % total;
            }
            plane.z = ((z % DEPTH_RANGE) + DEPTH_RANGE) % DEPTH_RANGE;

            const t = plane.z / DEPTH_RANGE;
            const material = materials[i];
            const texture = textures[plane.imageIndex];
            material.uniforms.map.value = texture;
            material.uniforms.time.value = time;
            material.uniforms.scrollForce.value = v;
            material.uniforms.opacity.value = ramp(t, fadeSettings.fadeIn, fadeSettings.fadeOut);
            material.uniforms.blurAmount.value = blurSettings.maxBlur * (1 - ramp(t, blurSettings.blurIn, blurSettings.blurOut));

            const mesh = meshes.current[i];
            if (mesh) {
                const img = texture.image as { width: number; height: number } | undefined;
                const aspect = img ? img.width / img.height : 1;
                mesh.position.set(spots[i].x, spots[i].y, plane.z - DEPTH_RANGE / 2);
                mesh.scale.set(aspect > 1 ? 2 * aspect : 2, aspect > 1 ? 2 : 2 / aspect, 1);
            }
        });
    });

    return (
        <>
            {materials.map((material, i) => (
                <mesh
                    key={i}
                    ref={(m) => { meshes.current[i] = m; }}
                    material={material}
                    onPointerEnter={() => { material.uniforms.isHovered.value = 1; }}
                    onPointerLeave={() => { material.uniforms.isHovered.value = 0; }}>
                    <planeGeometry args={[1, 1, 32, 32]} />
                </mesh>
            ))}
        </>
    );
}

export default function InfiniteGallery({
    images,
    speed = 1.2,
    visibleCount = 12,
    fallback = null,
    style,
    fadeSettings = { fadeIn: { start: 0.05, end: 0.25 }, fadeOut: { start: 0.4, end: 0.43 } },
    blurSettings = { blurIn: { start: 0, end: 0.1 }, blurOut: { start: 0.4, end: 0.43 }, maxBlur: 8 },
}: InfiniteGalleryProps) {
    const [webgl, setWebgl] = useState(true);

    useEffect(() => {
        try {
            const canvas = document.createElement("canvas");
            if (!(canvas.getContext("webgl2") || canvas.getContext("webgl"))) setWebgl(false);
        } catch {
            setWebgl(false);
        }
    }, []);

    if (!webgl || images.length === 0) return <>{fallback}</>;

    return (
        <div style={style}>
            <Canvas camera={{ position: [0, 0, 0], fov: 55 }} gl={{ antialias: true, alpha: true }} dpr={[1, 2]}>
                <React.Suspense fallback={null}>
                    <GalleryScene
                        images={images}
                        speed={speed}
                        visibleCount={visibleCount}
                        fadeSettings={fadeSettings}
                        blurSettings={blurSettings}
                    />
                </React.Suspense>
            </Canvas>
        </div>
    );
}
