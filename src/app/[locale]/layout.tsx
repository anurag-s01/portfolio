import "@/once-ui/styles/index.scss";
import "@/once-ui/tokens/index.scss";

import classNames from 'classnames';

import { Footer, Header, ScrollIndicator } from "@/components";
import { baseURL, effects, style } from '@/app/resources'

import { Schibsted_Grotesk } from 'next/font/google'
import { Source_Code_Pro } from 'next/font/google';

import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations, setRequestLocale } from 'next-intl/server';

import { routing } from "@/i18n/routing";
import { renderContent } from "@/app/resources";
import { Background, Flex } from "@/once-ui/components";
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Analytics } from '@vercel/analytics/next';
import { MotionProvider, ScrollProgress } from "@/components/motion/primitives";
import { PageBackdrop } from "@/components/backgrounds/PageBackdrop";
import { FloatingContact } from "@/components/FloatingContact";
import { themeScript } from "@/components/ThemeToggle";
import { Kbar, type KbarItem } from "@/components/Kbar";
import { getPosts } from "@/app/utils/utils";
import { routes } from "@/app/resources";

export async function generateMetadata(props: { params: Promise<{ locale: string }>}) {
    const params = await props.params;

    const {
        locale
    } = params;

    const t = await getTranslations();
    const { person, home } = renderContent(t);

    return {
		metadataBase: new URL(`https://${baseURL}`),
		title: home.title,
		description: home.description,
		openGraph: {
			title: `${person.firstName}'s Portfolio`,
			description: home.description,
			url: `https://${baseURL}`,
			siteName: `${person.firstName}'s Portfolio`,
			locale: 'en_US',
			type: 'website',
		},
		verification: { google: "AXDsPgbtyGwpGCIzNmoxQzG74GB2BQPss9zsoPDvzbU" },
		robots: {
			index: true,
			follow: true,
			googleBot: {
				index: true,
				follow: true,
				'max-video-preview': -1,
				'max-image-preview': 'large',
				'max-snippet': -1,
			},
		},
	}
};

// One family throughout: an editorial grotesk, chosen over the usual Inter/Geist defaults.
const primary = Schibsted_Grotesk({
	variable: '--font-primary',
	subsets: ['latin'],
	display: 'swap',
})

type FontConfig = {
    variable: string;
};

/*
	Replace with code for secondary and tertiary fonts
	from https://once-ui.com/customize
*/
const secondary: FontConfig | undefined = undefined;
const tertiary: FontConfig | undefined = undefined;
/*
*/

const code = Source_Code_Pro({
	variable: '--font-code',
	subsets: ['latin'],
	display: 'swap',
	preload: false, // only used in code blocks; don't make every page download it up front
});

interface RootLayoutProps {
	children: React.ReactNode;
	params: Promise<{locale: string}>;
}

export function generateStaticParams() {
	return routing.locales.map((locale) => ({locale}));
  }

export default async function RootLayout(props: RootLayoutProps) {
    const params = await props.params;

    const {
        locale
    } = params;

    const {
        children
    } = props;

    setRequestLocale(locale);
    const messages = await getMessages();

    // Command palette items: pages, every project (searchable by stack), and contact actions.
    const t = await getTranslations();
    const { social } = renderContent(t);
    const link = (name: string) => social.find((s) => s.name === name)?.link ?? '';
    const pages: [string, string][] = [['Home', '/'], ['About', '/about'], ['Work', '/work'], ['Gallery', '/gallery']];
    const kbarItems: KbarItem[] = [
        ...pages.filter(([, href]) => routes[href as keyof typeof routes]).map(([name, href]) => ({ id: `page-${name}`, name, section: 'Pages', href })),
        ...getPosts(['src', 'app', '[locale]', 'work', 'projects', locale])
            .sort((a, b) => new Date(b.metadata.publishedAt).getTime() - new Date(a.metadata.publishedAt).getTime())
            .map((p) => ({ id: `project-${p.slug}`, name: p.metadata.title, section: 'Projects', href: `/work/${p.slug}`, keywords: `${p.metadata.summary} ${p.metadata.stack.join(' ')}`, description: p.metadata.metrics[0]?.value })),
        { id: 'contact', name: 'Get in touch', section: 'Contact', href: '/#contact', keywords: 'contact hire email coffee table tennis' },
        { id: 'email', name: 'Email Anurag', section: 'Contact', href: link('Email'), keywords: 'mail write' },
        { id: 'linkedin', name: 'LinkedIn', section: 'Contact', href: link('LinkedIn') },
        { id: 'github', name: 'GitHub', section: 'Contact', href: link('GitHub') },
        { id: 'resume', name: 'Download resume', section: 'Contact', href: '/docs/Resume_Anurag.pdf', keywords: 'cv pdf' },
    ];
    return (
		<NextIntlClientProvider messages={messages}>
		<MotionProvider>
			<Flex
				as="html" lang="en"
				background="page"
				data-neutral={style.neutral} data-brand={style.brand} data-accent={style.accent}
				data-solid={style.solid} data-solid-style={style.solidStyle}
				data-theme={style.theme}
				suppressHydrationWarning
				data-border={style.border}
				data-surface={style.surface}
				data-transition={style.transition}
				className={classNames(
					primary.variable,
					secondary ? secondary.variable : '',
					tertiary ? tertiary.variable : '',
					code.variable)}>
				<head>
					{/* Sets data-theme before first paint (saved choice, else the OS setting). */}
					<script dangerouslySetInnerHTML={{ __html: themeScript }} />
				</head>
				<Flex style={{minHeight: '100vh'}}
					as="body"
					fillWidth margin="0" padding="0"
					direction="column">
					<ScrollProgress />
					<Background
						mask={effects.mask as any}
						gradient={effects.gradient as any}
						dots={effects.dots as any}
						lines={effects.lines as any}/>
					<PageBackdrop />
					<Flex
						fillWidth
						minHeight="16">
					</Flex>
					<Header/>
					<Flex
						zIndex={0}
						fillWidth paddingY="l" paddingX="l"
						justifyContent="center" flex={1}>
						<Flex
							justifyContent="center"
							fillWidth minHeight="0">
							{children}
							<ScrollIndicator />
						</Flex>
					</Flex>
					<Footer/>
					<FloatingContact />
					<Kbar items={kbarItems} />
					<SpeedInsights />
					<Analytics />
				</Flex>
			</Flex>
		</MotionProvider>
		</NextIntlClientProvider>
	);
}