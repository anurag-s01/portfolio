import { use } from "react";
import { Flex } from "@/once-ui/components";
import MasonryGrid from "@/components/gallery/MasonryGrid";
import { GalleryExperience } from "@/components/gallery/GalleryExperience";
import { baseURL, renderContent } from "@/app/resources";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { useTranslations } from "next-intl";

export async function generateMetadata(props: { params: Promise<{ locale: string }>}) {
    const params = await props.params;

    const {
        locale
    } = params;

    const t = await getTranslations();
    const { gallery } = renderContent(t);

    const title = gallery.title;
    const description = gallery.description;
    const ogImage = `https://${baseURL}/og?title=${encodeURIComponent(title)}`;

    return {
		title,
		description,
		alternates: { canonical: `https://${baseURL}/gallery` },
		openGraph: {
			title,
			description,
			type: 'website',
			url: `https://${baseURL}/gallery`,
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

export default function Gallery(props: { params: Promise<{ locale: string }>}) {
    const params = use(props.params);

    const {
        locale
    } = params;

    setRequestLocale(locale);
    const t = useTranslations();
    const { gallery, person } = renderContent(t);
    return (
        <Flex fillWidth>
            <script
				type="application/ld+json"
				suppressHydrationWarning
				dangerouslySetInnerHTML={{
					__html: JSON.stringify({
						'@context': 'https://schema.org',
						'@type': 'ImageGallery',
						name: gallery.title,
						description: gallery.description,
						url: `https://${baseURL}/gallery`,
						image: gallery.images.map((image) => ({
                            '@type': 'ImageObject',
                            url: `https://${baseURL}${image.src}`,
                            description: image.alt,
                        })),
						author: {
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
            <GalleryExperience
                images={gallery.images.map((image) => ({ src: image.src, alt: image.alt }))}
                title="Moments"
                description="Places and frames I keep coming back to."
                fallback={<MasonryGrid/>}/>
        </Flex>
    );
}