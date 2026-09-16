/**
 * Layout primitives. The four things that own measure and rhythm:
 *
 *   PageShell  the <main>, and the space between sections
 *   Section    one section, at a measure, with the page gutter
 *   Container  measure + gutter, for anything that is not a whole section
 *   Stack      vertical rhythm from the spacing scale
 *
 * Two lint rules in eslint.config.mjs keep pages from re-implementing these
 * by hand: no `mx-auto max-w-*` outside this directory, and no numeric
 * Tailwind spacing anywhere.
 */
export { PageShell } from './PageShell';
export { Section } from './Section';
export { Container, type ContainerWidth } from './Container';
export { Stack, type StackGap } from './Stack';
