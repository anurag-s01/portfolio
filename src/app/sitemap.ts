import { getPosts } from '@/app/utils/utils'
import { baseURL, routes as enabledRoutes } from '@/app/resources'
import { routing } from '@/i18n/routing'

export default async function sitemap() {

    const locales = routing.locales;

    let works = locales.flatMap((locale) => 
        getPosts(['src', 'app', '[locale]', 'work', 'projects', locale]).map((post) => ({
            url: `https://${baseURL}/work/${post.slug}`,
            lastModified: post.metadata.publishedAt,
        }))
    );

    // Only routes switched on in config.js, so disabled pages (e.g. blog) stay out of search.
    let routes = locales.flatMap((locale)=> 
        Object.entries(enabledRoutes).filter(([, on]) => on).map(([route]) => ({
            url: `https://${baseURL}${route === '/' ? '' : route}`,
            lastModified: new Date().toISOString().split('T')[0],
        }))
    );

    return [...routes, ...works]
}
