/**
 * The lead-forms surface: the pages a visitor or a business fills in.
 *
 * One component, and it is a client leaf — a signup form is controlled state
 * by definition. The pages around it are server components and the copy above
 * each form belongs to them, which is why nothing here takes a heading.
 *
 * The customer-side lead form is not here: it lives in
 * `components/directory/LeadForm.tsx`, because it is a section of the district
 * and leaf pages first and a standalone form second.
 */
export { BusinessForm } from './BusinessForm';
