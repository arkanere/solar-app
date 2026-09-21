/**
 * Archetype 4 — the editorial surface. 117 pages, one page shape, one table.
 *
 * Two pieces only. `EditorialArticle` is the page; `BodySection` is the part
 * of it that renders database HTML, and is separate because the table
 * treatment inside it is the design problem of the archetype
 * (archetype/editorial.md §5) and deserves to be read on its own.
 *
 * Both are server components. Nothing on an editorial page needs JavaScript.
 */
export { EditorialArticle } from './EditorialArticle';
export { BodySection } from './ArticleBody';
