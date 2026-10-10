import { use } from "react";
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { CustomMDX } from '@/components/mdx'
import { getPosts } from '@/app/utils/utils'
import { Button, Flex, Heading, SmartImage, Tag, Text } from '@/once-ui/components'
import { ProjectVisual } from '@/components/motion/ProjectVisual';
import { Reveal } from '@/components/motion/primitives';
import { TitleBand } from '@/components/backgrounds/PageBackdrop';
import { baseURL, renderContent } from '@/app/resources';
import { routing } from '@/i18n/routing';
import { setRequestLocale } from 'next-intl/server';
import { useTranslations } from 'next-intl';

interface WorkParams {
    params: Promise<{
        slug: string;
		locale: string;
    }>;
}

export async function generateStaticParams() {
	const locales = routing.locales;
    
    // Create an array to store all posts from all locales
    const allPosts = [];

    // Fetch posts for each locale
    for (const locale of locales) {
        const posts = getPosts(['src', 'app', '[locale]', 'work', 'projects', locale]);
        allPosts.push(...posts.map(post => ({
            slug: post.slug,
            locale: locale,
        })));
    }

    return allPosts;
}

export async function generateMetadata(props: WorkParams) {
    const params = await props.params;

    const {
        slug,
        locale
    } = params;

    let post = getPosts(['src', 'app', '[locale]', 'work', 'projects', locale]).find((post) => post.slug === slug)

    if (!post) {
		return
	}

    let {
		title,
		publishedAt: publishedTime,
		summary: description,
		images,
		image,
		team,
	} = post.metadata
    let ogImage = image
		? `https://${baseURL}${image}`
		: `https://${baseURL}/og?title=${title}`;

    return {
		title,
		description,
		images,
		team,
		alternates: { canonical: `https://${baseURL}/work/${post.slug}` },
		openGraph: {
			title,
			description,
			type: 'article',
			publishedTime,
			url: `https://${baseURL}/work/${post.slug}`,
			images: [
				{
					url: ogImage,
				},
			],
		},
		twitter: {
			card: 'summary_large_image',
			title,
			description,
			images: [ogImage],
		},
	}
}

export default function Project(props: WorkParams) {
    const params = use(props.params);
    setRequestLocale(params.locale);
    const posts = getPosts(['src', 'app', '[locale]', 'work', 'projects', params.locale])
        .sort((a, b) => new Date(b.metadata.publishedAt).getTime() - new Date(a.metadata.publishedAt).getTime());
    const index = posts.findIndex((post) => post.slug === params.slug);
    const post = posts[index];

    if (!post) {
		notFound()
	}

    const next = posts[(index + 1) % posts.length];

    const t = useTranslations();
    const { person } = renderContent(t);

    return (
		<Flex as="section"
			fillWidth maxWidth="m"
			direction="column" alignItems="center"
			gap="l">
			<script
				type="application/ld+json"
				suppressHydrationWarning
				dangerouslySetInnerHTML={{
					__html: JSON.stringify({
						'@context': 'https://schema.org',
						'@type': 'BlogPosting',
						headline: post.metadata.title,
						datePublished: post.metadata.publishedAt,
						dateModified: post.metadata.publishedAt,
						description: post.metadata.summary,
						image: post.metadata.image
							? `https://${baseURL}${post.metadata.image}`
							: `https://${baseURL}/og?title=${post.metadata.title}`,
							url: `https://${baseURL}/work/${post.slug}`,
						author: {
							'@type': 'Person',
							name: person.name,
						},
					}),
				}}
			/>
			<TitleBand>
			<Flex
				fillWidth maxWidth="xs" gap="16"
				direction="column" style={{ margin: '0 auto' }}>
				<Button
					href={`/${params.locale}/work`}
					variant="tertiary"
					size="s"
					prefixIcon="chevronLeft">
					Projects
				</Button>
				{post.metadata.period && (
					<Text variant="label-default-s" onBackground="brand-weak">
						{post.metadata.period}
					</Text>
				)}
				<Heading
					variant="display-strong-s">
					{post.metadata.title}
				</Heading>
				<Text variant="body-default-l" onBackground="neutral-weak">
					{post.metadata.summary}
				</Text>
			</Flex>
			</TitleBand>
			<Reveal>
				{post.metadata.visual
					? <ProjectVisual visual={post.metadata.visual} />
					: post.metadata.images.length > 0 && (
						<SmartImage
							aspectRatio="16 / 9"
							radius="m"
							alt="image"
							src={post.metadata.images[0]}/>
					)}
			</Reveal>
			<Flex style={{margin: 'auto'}}
				as="article"
				maxWidth="xs" fillWidth
				direction="column">
				{post.metadata.metrics.length > 0 && (
					<Flex gap="32" wrap marginBottom="16">
						{post.metadata.metrics.map((m) => (
							<Flex key={m.label} direction="column">
								<Text variant="heading-strong-xl" onBackground="brand-medium">{m.value}</Text>
								<Text variant="body-default-s" onBackground="neutral-weak">{m.label}</Text>
							</Flex>
						))}
					</Flex>
				)}
				{post.metadata.stack.length > 0 && (
					<Flex gap="8" wrap marginBottom="24">
						{post.metadata.stack.map((item) => <Tag key={item} size="m">{item}</Tag>)}
					</Flex>
				)}
				<CustomMDX source={post.content} />
				<Reveal>
					<Link href={`/work/${next.slug}`} style={{ textDecoration: 'none', display: 'block', marginTop: 'var(--static-space-40)' }}>
					<Flex
						fillWidth direction="column" gap="4" padding="l" radius="l"
						border="neutral-medium" borderStyle="solid-1" background="surface">
						<Text variant="label-default-s" onBackground="neutral-weak">Next project</Text>
						<Text variant="heading-strong-l">{next.metadata.title}</Text>
						<Text variant="body-default-s" onBackground="neutral-weak">{next.metadata.summary}</Text>
					</Flex>
					</Link>
				</Reveal>
			</Flex>
		</Flex>
	)
}