"use client";

import { useState } from 'react';
import { Flex, Grid, Heading, Text } from '@/once-ui/components';
import { Lightbox } from '@/components/Lightbox';
import Image from 'next/image';
import { Reveal } from '@/components/motion/primitives';
import styles from './Certificates.module.scss';

// Newest/highest first. Images are the originals linked from the resume (Google Drive).
const certificates = [
    { src: '/images/awards/chairpersons-nomination-2025.jpg', title: "Chairpersons' Awards 2025", detail: 'Nominee, Best Market Maker of the Year' },
    { src: '/images/awards/star-employee-2025.jpg', title: 'Star Employee', detail: 'NG Notification, IRCTC, Apr 2025' },
    { src: '/images/awards/silver-twid-rewards-2026.jpg', title: 'Silver Award', detail: 'TWID pay-by-rewards, Sep 2026' },
    { src: '/images/awards/silver-packaging-charges-2026.jpg', title: 'Silver Award', detail: 'Personalized packaging charges, Jul 2026' },
    { src: '/images/awards/silver-multitenancy-2025.jpg', title: 'Silver Award', detail: 'Multi-tenancy platform, Dec 2025' },
    { src: '/images/awards/silver-zomato-irctc-2025.jpg', title: 'Silver Award', detail: 'Zomato IRCTC ordering, Jun 2025' },
    { src: '/images/awards/silver-ng-notifications-2024.jpg', title: 'Silver Award', detail: 'Next-gen notifications, May 2024' },
];

export function Certificates({ awards }: { awards: { title: string; description: string }[] }) {
    const [open, setOpen] = useState<(typeof certificates)[number] | null>(null);
    return (
        <Flex fillWidth gap="l" paddingY="l" direction="column">
            <Reveal>
                <Heading variant="display-strong-s">Recognition</Heading>
            </Reveal>
            <Grid columns="repeat(3, 1fr)" tabletColumns="1col" mobileColumns="1col" gap="l" fillWidth>
                {awards.map((award) => (
                    <Flex key={award.title} direction="column" gap="8">
                        <Text variant="heading-strong-m">{award.title}</Text>
                        <Text variant="body-default-s" onBackground="neutral-weak">{award.description}</Text>
                    </Flex>
                ))}
            </Grid>
            <div className={styles.marquee}>
                <div className={styles.track}>
                    {[...certificates, ...certificates].map((cert, index) => (
                        <button
                            type="button"
                            key={index}
                            onClick={() => setOpen(cert)}
                            className={styles.item}
                            aria-hidden={index >= certificates.length}
                            tabIndex={index >= certificates.length ? -1 : undefined}>
                            <Image
                                src={cert.src}
                                alt={`${cert.title}: ${cert.detail}`}
                                width={800}
                                height={566}
                                sizes="320px"
                                style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                            />
                            <span className={styles.caption}>
                                <strong>{cert.title}</strong>
                                <span>{cert.detail}</span>
                            </span>
                        </button>
                    ))}
                </div>
            </div>
            <Lightbox src={open?.src ?? null} alt={open ? `${open.title}: ${open.detail}` : ''} onClose={() => setOpen(null)} />
        </Flex>
    );
}
