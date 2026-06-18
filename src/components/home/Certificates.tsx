import { Flex, Heading } from '@/once-ui/components';
import Image from 'next/image';

const certificates = [
    { src: '/Certificates/Anurag Singh 9150861 24-12-2025.png', alt: 'Achievement Certificate' },
    { src: '/Certificates/JPEG image-468A-907D-FA-0.jpeg', alt: 'Award Certificate' },
    { src: '/Certificates/SilverAward_JubilantFoodWorks2024-05-09 105959 +0000.png', alt: 'Silver Award' },
    { src: '/Certificates/certificate_2025-04-14 070819 +0000.png', alt: 'Professional Certificate' },
    { src: '/Certificates/e57da49c4f.png', alt: 'Recognition Certificate' },
];

export function Certificates() {
    return (
        <Flex
            fillWidth gap="m" paddingY="l" direction="column">
            <Heading variant="display-strong-s">Achievements</Heading>
            <Flex
                fillWidth gap="m"
                style={{
                    overflowY: 'auto',
                    maxHeight: '600px',
                    paddingRight: '1rem',
                }}
                className="scrollable-certificates"
                direction="column">
                {certificates.map((cert, index) => (
                    <Flex key={index} fillWidth style={{ borderRadius: '16px', overflow: 'hidden', border: '1px solid var(--neutral-border-medium)' }}>
                        <Image
                            src={cert.src}
                            alt={cert.alt}
                            width={800}
                            height={600}
                            style={{ objectFit: 'cover', width: '100%', height: 'auto' }}
                        />
                    </Flex>
                ))}
            </Flex>
            <style dangerouslySetInnerHTML={{
                __html: `
                .scrollable-certificates::-webkit-scrollbar {
                    width: 6px;
                }
                .scrollable-certificates::-webkit-scrollbar-track {
                    background: transparent;
                }
                .scrollable-certificates::-webkit-scrollbar-thumb {
                    background: var(--neutral-border-medium);
                    border-radius: 4px;
                }
                `
            }} />
        </Flex>
    );
}
