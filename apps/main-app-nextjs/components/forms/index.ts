/**
 * The lead-forms surface: the pages a visitor or a business fills in.
 *
 * Both are client leaves — a form is controlled state by definition. The pages
 * around them are server components and the copy above each form belongs to
 * them, which is why neither takes a heading.
 *
 * `DataRequestForm` is not a signup: it is the two DPDP compliance requests,
 * shared by `/data-access` and `/data-deletion`. It is here rather than beside
 * those pages for the same reason `BusinessForm` is — two pages render it.
 *
 * `UnsubscribeForm` is not a form anyone fills in — it is the confirm button
 * on `/unsubscribe`. It is here because it is the third thing in this app that
 * posts to an endpoint and swaps itself for a receipt, and keeping the three
 * together is what stopped them drifting apart in SvelteKit.
 *
 * The customer-side lead form is not here: it lives in
 * `components/directory/LeadForm.tsx`, because it is a section of the district
 * and leaf pages first and a standalone form second.
 */
export { BusinessForm } from './BusinessForm';
export { DataRequestForm } from './DataRequestForm';
export { UnsubscribeForm } from './UnsubscribeForm';
