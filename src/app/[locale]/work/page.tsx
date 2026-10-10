import { use } from "react";
import { getPosts } from '@/app/utils/utils';
import { Flex, Heading, Text } from '@/once-ui/components';
import { Reveal } from '@/components/motion/primitives';
import { TitleBand } from '@/components/backgrounds/PageBackdrop';
import { Projects } from '@/components/work/Projects';
import { baseURL, renderContent } from '@/app/resources';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { useTranslations } from 'next-intl';

export async function generateMetadata(props: { params: Promise<{ locale: string }>}) {
    const params = await props.params;

    const {
        locale
    } = params;

    const t = await getTranslations();
    const { work } = renderContent(t);

    const title = work.title;
    const description = work.description;
    const ogImage = `https://${baseURL}/og?title=${encodeURIComponent(title)}`;

    return {
		title,
		description,
		alternates: { canonical: `https://${baseURL}/work` },
		openGraph: {
			title,
			description,
			type: 'website',
			url: `https://${baseURL}/work`,
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

export default function Work(props: { params: Promise<{ locale: string }>}) {
    const params = use(props.params);

    const {
        locale
    } = params;

    setRequestLocale(locale);
    let allProjects = getPosts(['src', 'app', '[locale]', 'work', 'projects', locale]);

    const t = useTranslations();
    const { person, work } = renderContent(t);

    return (
        <Flex
			fillWidth maxWidth="m"
			direction="column">
            <script
                type="application/ld+json"
                suppressHydrationWarning
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        '@context': 'https://schema.org',
                        '@type': 'CollectionPage',
                        headline: work.title,
                        description: work.description,
                        url: `https://${baseURL}/work`,
                        image: `https://${baseURL}/og?title=${encodeURIComponent(work.title)}`,
                        author: {
                            '@type': 'Person',
                            name: person.name,
                        },
                        hasPart: allProjects.map(project => ({
                            '@type': 'CreativeWork',
                            headline: project.metadata.title,
                            description: project.metadata.summary,
                            url: `https://${baseURL}/work/${project.slug}`,
                            image: `https://${baseURL}/og?title=${encodeURIComponent(project.metadata.title)}`,
                        })),
                    }),
                }}
            />
            <TitleBand>
            <Flex direction="column" gap="m" paddingX="l" paddingY="xl">
                <Reveal>
                    <Heading variant="display-strong-l">{work.title}</Heading>
                </Reveal>
                <Reveal delay={0.1}>
                    <Text variant="heading-default-xl" onBackground="neutral-weak" wrap="balance">
                        {allProjects.length} systems I've built, from campaign engines to real-time store operations. Each one animates what it actually does.
                    </Text>
                </Reveal>
            </Flex>
            </TitleBand>
            <Projects locale={locale}/>
        </Flex>
    );
}