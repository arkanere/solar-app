/**
 * The <main> of a page: its sections, stacked at the section rhythm, with the
 * page's own top and bottom space.
 *
 * This is the one place --spacing-section is applied. It is fluid
 * (clamp(3rem, 2rem + 5vw, 5rem)), so section spacing tightens on a phone and
 * opens on a desktop without any page knowing that happens.
 *
 * Children are expected to be <Section> elements. Nothing enforces that — it
 * would cost a runtime check to catch a mistake that is obvious on screen —
 * but a child that is not a Section gets the section gap above and below it
 * and no gutter, which reads wrong immediately.
 *
 * The top space is xl rather than a full section step: the first heading
 * should sit close enough to the site header to read as belonging to it.
 * The bottom is a full 3xl so the last section never collides with a footer.
 */
import { Stack } from './Stack';

export function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="pb-3xl pt-xl">
      <Stack as="main" gap="section">
        {children}
      </Stack>
    </div>
  );
}
