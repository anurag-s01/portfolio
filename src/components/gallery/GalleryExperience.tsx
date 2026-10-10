"use client";

import dynamic from "next/dynamic";
import React from "react";
import { Flex, Heading, Text } from "@/once-ui/components";
import { WordReveal, Reveal, FadeHint } from "@/components/motion/primitives";

// three.js + react-three only load on this page.
const InfiniteGallery = dynamic(() => import("./InfiniteGallery"), { ssr: false });

// Originals are 2–4MB; textures go through Next's image optimizer at 1200px.
const optimized = (src: string) => `/_next/image?url=${encodeURIComponent(src)}&w=1200&q=75`;

export function GalleryExperience({
    images,
    title,
    description,
    fallback,
}: {
    images: { src: string; alt: string }[];
    title: string;
    description: string;
    fallback: React.ReactNode;
}) {
    return (
        <>
            <InfiniteGallery
                images={images.map((img) => ({ src: optimized(img.src), alt: img.alt }))}
                fallback={fallback}
                style={{ position: "fixed", inset: 0, zIndex: 0 }}
            />
            {/* Vignette into the page colour, with a warm brand glow at the centre. */}
            <div
                aria-hidden
                style={{
                    position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none",
                    background: `
                        radial-gradient(ellipse 60% 50% at 50% 50%, var(--brand-alpha-weak), transparent 70%),
                        radial-gradient(ellipse 120% 90% at 50% 50%, transparent 55%, var(--page-background) 100%)`,
                }}
            />
            <Flex
                fillWidth direction="column" alignItems="center" justifyContent="center" gap="m"
                style={{ position: "relative", zIndex: 1, minHeight: "calc(100vh - 220px)", pointerEvents: "none", textAlign: "center" }}>
                <Heading variant="display-strong-xl" style={{ mixBlendMode: "difference", fontStyle: "italic", letterSpacing: "-0.03em" }}>
                    <WordReveal text={title} />
                </Heading>
                <Reveal delay={0.4} style={{ width: "auto" }}>
                    <Text variant="body-default-l" onBackground="neutral-medium" wrap="balance" style={{ textShadow: "0 2px 12px var(--page-background)" }}>{description}</Text>
                </Reveal>
                <FadeHint seconds={5} style={{ marginTop: "var(--static-space-64)" }}>
                    <Flex direction="column" alignItems="center" gap="4" style={{ textShadow: "0 2px 8px var(--page-background)" }}>
                        <Text variant="label-default-xs" onBackground="neutral-medium">
                            Scroll, use the arrow keys or swipe to move through the photos
                        </Text>
                        <Text variant="label-default-xs" onBackground="neutral-weak">
                            Hover a photo to make it wave
                        </Text>
                    </Flex>
                </FadeHint>
            </Flex>
        </>
    );
}
