/**
 * One page section: a <section> whose content sits in a Container.
 *
 * The geo-listing archetype is seventeen numbered sections stacked down a
 * page (archetype/geo-listing.md §5), and archetypes 1 and 3 are the same
 * shape. Every one of them wants the same two things — the right measure and
 * the page gutter — so pairing the semantic element with the Container here
 * means a page never writes either by hand.
 *
 * Note what it does NOT do: no vertical padding and no margin. The space
 * between sections belongs to the parent as a single gap, and PageShell owns
 * it. If a section set its own padding, the gap between any two sections
 * would be the sum of three numbers from two files.
 *
 * `width` is per-section, not per-page, because a page mixes measures: an
 * article's body is prose while its listing block is content.
 */
import { Container, type ContainerWidth } from './Container';

export function Section({
  id,
  width = 'content',
  children
}: {
  /** Anchor target. Also what an in-page nav or a skip link points at. */
  id?: string;
  width?: ContainerWidth;
  children: React.ReactNode;
}) {
  return (
    <section id={id}>
      <Container width={width}>{children}</Container>
    </section>
  );
}
