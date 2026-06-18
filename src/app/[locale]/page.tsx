import React, { use } from 'react';

import { Heading, Flex, Text, Button, Avatar, RevealFx, Arrow } from '@/once-ui/components';
import { Projects } from '@/components/work/Projects';

import { baseURL, routes, renderContent } from '@/app/resources';
import { Mailchimp } from '@/components';
import { Posts } from '@/components/blog/Posts';
import { Certificates } from '@/components/home/Certificates';
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
		openGraph: {
			title,
			description,
			type: 'website',
			url: `https://${baseURL}/${locale}`,
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
    const { home, about, person, newsletter } = renderContent(t);
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
						image: `${baseURL}/og?title=${encodeURIComponent(home.title)}`,
						publisher: {
							'@type': 'Person',
							name: person.name,
							image: {
								'@type': 'ImageObject',
								url: `${baseURL}${person.avatar}`,
							},
						},
					}),
				}}
			/>
			<Flex
				fillWidth
				direction="column"
				paddingY="l" gap="m">
				<Flex
					direction="column"
					fillWidth maxWidth="s" gap="m">
					<RevealFx
						translateY="4">
						<Heading
							wrap="balance"
							variant="display-strong-l">
							{home.headline}
						</Heading>
					</RevealFx>
					<RevealFx
						translateY="8" delay={0.2}>
						<Flex fillWidth>
							<Text
								wrap="balance"
								onBackground="neutral-weak"
								variant="heading-default-xl">
								{home.subline}
							</Text>
						</Flex>
					</RevealFx>
					<RevealFx translateY="12" delay={0.4}>
						<Flex fillWidth gap="s">
							<Button
								id="about"
								data-border="rounded"
								href={`/${locale}/about`}
								variant="tertiary"
								size="m">
								<Flex
									gap="8"
									alignItems="center">
									{about.avatar.display && (
										<Avatar
											style={{ marginLeft: '-0.75rem', marginRight: '0.25rem' }}
											src={person.avatar}
											size="m" />
									)}
									{t("about.title")}
									<Arrow trigger="#about" />
								</Flex>
							</Button>
							<Button
								id="resume"
								data-border="rounded"
								href="/docs/Resume_Anurag.pdf"
								target="_blank"
								variant="primary"
								size="m">
								Download Resume
							</Button>
						</Flex>
					</RevealFx>
				</Flex>

			</Flex>
			<RevealFx translateY="32" delay={0.2}>
				<Flex direction="column" fillWidth alignItems="center" gap="m">
					<Projects range={[1, 2]} locale={locale} />
					<Button 
						href={`/${locale}/work`} 
						variant="tertiary" 
						size="m" 
						data-border="rounded"
						style={{ backdropFilter: 'blur(10px)', background: 'var(--neutral-alpha-weak)', marginTop: '-1rem' }}>
						Explore Curated Work
					</Button>
				</Flex>
			</RevealFx>
			
			<RevealFx translateY="32" delay={0.4}>
				<Certificates />
			</RevealFx>
			{newsletter.display &&
				<Mailchimp newsletter={newsletter} />
			}
		</Flex>
	);
}
