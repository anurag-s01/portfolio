"use client";

import { Flex, Heading, SmartImage, SmartLink, Tag, Text } from "@/once-ui/components";
import { useTranslations } from 'next-intl';
import Link from "next/link";
import { ProjectVisual } from "@/components/motion/ProjectVisual";
import { Reveal, TiltCard } from "@/components/motion/primitives";

interface ProjectCardProps {
    href: string;
    images: string[];
    title: string;
    content: string;
    description: string;
    visual?: string;
    period?: string;
    metrics?: { value: string; label: string }[];
    stack?: string[];
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
    href,
    images = [],
    title,
    content,
    description,
    visual,
    period,
    metrics = [],
    stack = [],
}) => {
    const t = useTranslations();

    return (
        <Reveal>
            <Flex fillWidth gap="m" direction="column">
                <Link href={href} aria-label={title} style={{ display: 'block', width: '100%' }}>
                    <TiltCard style={{ borderRadius: 'var(--radius-l)' }}>
                        {visual
                            ? <ProjectVisual visual={visual} />
                            : images[0] && (
                                <SmartImage
                                    radius="l"
                                    alt={title}
                                    aspectRatio="16 / 9"
                                    src={images[0]}
                                    style={{ border: '1px solid var(--neutral-alpha-weak)' }}/>
                            )}
                    </TiltCard>
                </Link>
                <Flex
                    direction="column"
                    fillWidth paddingX="s" paddingTop="12" paddingBottom="24" gap="m">
                    <Flex direction="column" gap="8">
                        {period && (
                            <Text variant="label-default-s" onBackground="brand-weak">{period}</Text>
                        )}
                        <Heading as="h2" wrap="balance" variant="heading-strong-xl">
                            {title}
                        </Heading>
                    </Flex>
                    <Flex direction="column" gap="16">
                        {metrics.length > 0 && (
                            <Flex gap="24" wrap>
                                {metrics.map((m) => (
                                    <Flex key={m.label} direction="column">
                                        <Text variant="heading-strong-l">{m.value}</Text>
                                        <Text variant="body-default-xs" onBackground="neutral-weak">{m.label}</Text>
                                    </Flex>
                                ))}
                            </Flex>
                        )}
                        {description?.trim() && (
                            <Text wrap="balance" variant="body-default-s" onBackground="neutral-weak">
                                {description}
                            </Text>
                        )}
                        {stack.length > 0 && (
                            <Flex gap="8" wrap>
                                {stack.map((s) => <Tag key={s} size="s" variant="neutral">{s}</Tag>)}
                            </Flex>
                        )}
                        {content?.trim() && (
                            <SmartLink
                                suffixIcon="chevronRight"
                                style={{margin: '0', width: 'fit-content'}}
                                href={href}>
                                <Text variant="body-default-s">
                                    {t("projectCard.label")}
                                </Text>
                            </SmartLink>
                        )}
                    </Flex>
                </Flex>
            </Flex>
        </Reveal>
    );
};
