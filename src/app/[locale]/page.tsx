import React, { use } from 'react';

import { Heading, Flex, Text, Button, Grid } from '@/once-ui/components';
import { CountUp, Reveal, WordReveal } from '@/components/motion/primitives';
import { Projects } from '@/components/work/Projects';

import { baseURL, routes, renderContent } from '@/app/resources';
import { Certificates } from '@/components/home/Certificates';
import { LiquidMetalHero } from '@/components/home/LiquidMetalHero';
import { OpenLane } from '@/components/home/OpenLane';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { useTranslations } from 'next-intl';

export async function generateMetadata(props: { params: Promise<{ locale: string }> }) {
    const params = await props.params;

    const {
        locale
    } = params;

    const t = await getTranslations();
    const { home } = renderContent(t);
    const title = home.title;
    const description = home.description;
    const ogImage = `https://${baseURL}/og?title=${encodeURIComponent(title)}`;

    return {
		title,
		description,
		alternates: { canonical: `https://${baseURL}` },
		openGraph: {
			title,
			description,
			type: 'website',
			url: `https://${baseURL}`,
			images: [
				{
					url: ogImage,
					alt: title,
				},
			],
		},
		twitter: {
			card: 'summary_large_image',
			title,
			description,
			images: [ogImage],
		},
	};
}

export default function Home(props: { params: Promise<{ locale: string }> }) {
    const params = use(props.params);

    const {
        locale
    } = params;

    setRequestLocale(locale);
    const t = useTranslations();
    const { home, person, social } = renderContent(t);
    return (
		<Flex
			maxWidth="m" fillWidth gap="xl"
			direction="column" alignItems="center">
			<script
				type="application/ld+json"
				suppressHydrationWarning
				dangerouslySetInnerHTML={{
					__html: JSON.stringify({
						'@context': 'https://schema.org',
						'@type': 'WebPage',
						name: home.title,
						description: home.description,
						url: `https://${baseURL}`,
						image: `https://${baseURL}/og?title=${encodeURIComponent(home.title)}`,
						publisher: {
							'@type': 'Person',
							name: person.name,
							image: {
								'@type': 'ImageObject',
								url: `https://${baseURL}${person.avatar}`,
							},
						},
					}),
				}}
			/>
			<LiquidMetalHero>
			<Flex
				fillWidth
				direction="column"
				paddingY="xl" gap="l">
				<Flex
					direction="column"
					fillWidth maxWidth="s" gap="m">
					<Reveal y={8}>
						<Flex
							gap="8" alignItems="center" paddingX="12" paddingY="4" radius="full"
							border="neutral-medium" borderStyle="solid-1" background="surface"
							style={{ width: 'fit-content' }}>
							<span className="pulse-dot" aria-hidden />
							<Text variant="label-default-s" onBackground="neutral-medium">{person.role} at Jubilant FoodWorks</Text>
						</Flex>
					</Reveal>
					<Heading
						wrap="balance"
						variant="display-strong-l">
						<WordReveal text={home.headline} delay={0.1} />
					</Heading>
					<Reveal y={12} delay={0.5}>
						<Text
							wrap="balance"
							onBackground="neutral-weak"
							variant="heading-default-xl">
							{home.subline}
						</Text>
					</Reveal>
					<Reveal y={12} delay={0.7}>
						<Flex fillWidth gap="s" wrap>
							{/* The floating "Get in touch" button docks here at the top of the page (see FloatingContact). */}
							<span data-cta-slot aria-hidden style={{ display: 'inline-block', width: 144, height: 44 }} />
							<Button
								data-border="rounded"
								href="/docs/Resume_Anurag.pdf"
								target="_blank"
								variant="tertiary"
								size="m">
								Download Resume
							</Button>
						</Flex>
					</Reveal>
				</Flex>
				<Grid
					columns="repeat(4, 1fr)" tabletColumns="2col" mobileColumns="2col"
					gap="m" fillWidth marginTop="l">
					{home.stats.map((stat, i) => (
						<Reveal key={stat.label} delay={0.8 + i * 0.1}>
							<Flex direction="column" gap="4">
								<Text variant="display-strong-s" onBackground="brand-medium">
									<CountUp value={stat.value} suffix={stat.suffix} />
								</Text>
								<Text variant="body-default-s" onBackground="neutral-weak">{stat.label}</Text>
							</Flex>
						</Reveal>
					))}
				</Grid>
			</Flex>
			</LiquidMetalHero>
			<Flex direction="column" fillWidth gap="l" style={{ position: 'relative', zIndex: 1 }}>
				<Reveal>
					<Flex fillWidth paddingX="l" justifyContent="space-between" alignItems="flex-end" gap="m" wrap>
						<Heading variant="display-strong-s">Selected work</Heading>
					</Flex>
				</Reveal>
				<Projects range={[1, 4]} locale={locale} />
				<Flex fillWidth justifyContent="center">
					<Button
						href={`/${locale}/work`}
						variant="tertiary"
						size="m"
						data-border="rounded"
						suffixIcon="chevronRight"
						style={{ backdropFilter: 'blur(10px)', background: 'var(--neutral-alpha-weak)', marginTop: '-1rem' }}>
						View all projects
					</Button>
				</Flex>
			</Flex>
			<Flex fillWidth style={{ position: 'relative', zIndex: 1 }}>
				<Certificates awards={home.awards} />
			</Flex>
			<Flex fillWidth style={{ position: 'relative', zIndex: 1 }}>
				<OpenLane
					email={social.find((s) => s.icon === 'email')!.link.replace('mailto:', '')}
					linkedin={social.find((s) => s.icon === 'linkedin')!.link} />
			</Flex>
		</Flex>
	);
}
