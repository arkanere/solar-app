/**
 * Assistant replies arrive as markdown. `html: false` escapes any raw HTML in
 * them: the output goes into the page as HTML, and a model reply is not
 * trusted input. SvelteKit had it on for its HTML welcome message; loadMessages
 * converts that one saved message instead.
 */
import MarkdownIt from 'markdown-it';

const md = new MarkdownIt({ html: false, linkify: true, breaks: true });

export const renderMarkdown = (content: string) => md.render(content);

/**
 * Markdown flattened to something worth reading aloud. Text-to-speech will
 * pronounce "##" and "**" if they are handed over.
 */
export function stripMarkdown(text: string): string {
  return text
    .replace(/<[^>]+>/g, ' ')
    .replace(/```[\s\S]*?```/g, ' code block ')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '') // images have nothing to say
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1') // links: keep the label, drop the URL
    .replace(/^\s{0,3}#{1,6}\s+/gm, '')
    .replace(/(\*\*|__)(.*?)\1/g, '$2')
    .replace(/(\*|_)(.*?)\1/g, '$2')
    .replace(/^\s{0,3}>\s?/gm, '')
    .replace(/^\s*[-*+]\s+/gm, '')
    .replace(/^\s*\d+\.\s+/gm, '')
    .replace(/\n{2,}/g, '. ') // paragraph breaks become a spoken pause
    .replace(/\s+/g, ' ')
    .trim();
}
