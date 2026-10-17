/**
 * Font fallback configuration.
 *
 * Avoids fetching Google Font metadata during the production build, which can
 * fail inside next/font/google when the upstream response cannot be parsed.
 * The CSS variables preserve the existing font-family hooks used by Tailwind
 * and the site's typography styles.
 */
export const fontVariables = 'font-fallbacks'
