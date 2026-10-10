const baseURL = 'anuragsinghdev.vercel.app'

// Enable localization
const i18n = false;

// Manage localized content in the messages folder
const i18nOptions = {
    locales: ['en'],            // A list of all locales that are supported, e.g. ['en','id']
    defaultLocale: 'en'         // Locale used by default and as a fallback
}

const routes = {
    '/': true,
    '/about': true,
    '/work': true,
    '/gallery': true,
}

const effects = {
    mask: 'cursor',             // none | cursor | topLeft | topRight | bottomLeft | bottomRight
    gradient: {
        display: true,
        opacity: 0.5        // 0 - 1
    },
    dots: {
        display: true,
        opacity: 0.4,           // 0 - 1
        size: '24'              // 2 | 4 | 8 | 12 | 16 | 20 | 24 | 32 | 40 | 48 | 56 | 634
    },
    lines: {
        display: true,
    },
}

const style = {
    theme: 'dark',         // dark | light
    neutral: 'gray',         // sand | gray | slate
    brand: 'blue',        // blue | indigo | violet | magenta | pink | red | orange | yellow | moss | green | emerald | aqua | cyan
    accent: 'blue',          // blue | indigo | violet | magenta | pink | red | orange | yellow | moss | green | emerald | aqua | cyan
    solid: 'contrast',  // color | contrast — contrast gives ivory/ink primary buttons
    solidStyle: 'flat',         // flat | plastic
    border: 'playful',      // rounded | playful | conservative
    surface: 'translucent',  // filled | translucent
    transition: 'all'           // all | micro | macro
}

const display = {
    location: true,
    time: true
}

export { routes, effects, style, display, baseURL, i18n, i18nOptions };