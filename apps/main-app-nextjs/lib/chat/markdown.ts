/**
 * Assistant replies arrive as markdown. `html: false` escapes any raw HTML in
 * them: the output goes into the page as HTML, and a model reply is not
 * trusted input. SvelteKit had it on for its HTML welcome message; loadMessages
 * converts that one saved message instead.
 */
import MarkdownIt from 'markdown-it';

const md = new MarkdownIt({ html: false, linkify: true, breaks: true });

export const renderMarkdown = (content: string) => md.render(content);
