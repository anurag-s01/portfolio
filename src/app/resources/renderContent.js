import { person, social, home, about, work, gallery } from './content';

// `t` is kept in the signature for the next-intl call sites; content comes from content.js.
const renderContent = (_t) => ({ person, social, home, about, work, gallery });

export { renderContent };
