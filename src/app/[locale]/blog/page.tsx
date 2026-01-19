import { Flex, Heading, Text, Button, SparkleFx } from '@/once-ui/components';
import { baseURL } from '@/app/resources'
import { unstable_setRequestLocale } from 'next-intl/server';

export async function generateMetadata(
	{ params: { locale } }: { params: { locale: string } }
) {
	const title = "Blog - Coming Soon";
	const description = "Our blog is currently under construction. Stay tuned for updates.";
	const ogImage = `https://${baseURL}/og?title=${encodeURIComponent(title)}`;

	return {
		title,
		description,
		openGraph: {
			title,
			description,
			type: 'website',
			url: `https://${baseURL}/${locale}/blog`,
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

export default function Blog(
	{ params: { locale } }: { params: { locale: string } }
) {
	unstable_setRequestLocale(locale);

	return (
		<Flex
			fillWidth maxWidth="s"
			direction="column"
			alignItems="center"
			justifyContent="center"
			gap="l"
			paddingY="128">
			<SparkleFx speed="medium" count={30}>
				<Heading
					variant="display-strong-l"
					align="center">
					Coming Soon
				</Heading>
			</SparkleFx>
			<Text
				variant="body-default-l"
				onBackground="neutral-medium"
				align="center">
				We are crafting some amazing content for you. Stay tuned!
			</Text>
			<Button
				href={`/${locale}`}
				variant="secondary"
				size="m">
				Back to Home
			</Button>
		</Flex>
	);
}