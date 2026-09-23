/**
 * The card for a tool the agent ran during a reply, picked by tool name.
 * A tool with no card of its own falls back to its raw payload.
 */
import { BookingDisplay } from './BookingDisplay';
import { CadDrawingDisplay } from './CadDrawingDisplay';
import { GenericToolDisplay } from './GenericToolDisplay';
import { KnowledgeBaseDisplay } from './KnowledgeBaseDisplay';
import { LeadFormCard } from './LeadFormCard';
import type { ToolData } from './parts';
import { QuotationDisplay } from './QuotationDisplay';
import { RoiDisplay } from './RoiDisplay';
import { SubsidyDisplay } from './SubsidyDisplay';
import { SystemSizeDisplay } from './SystemSizeDisplay';

// Tools that run for the model's benefit only; their output is noise to the visitor.
const HIDDEN_TOOLS = ['collect_customer_info', 'scrape_website'];

export const hasToolCard = (tool: string | undefined): tool is string =>
  !!tool && !HIDDEN_TOOLS.includes(tool);

export function ToolResultDisplay({ tool, result }: { tool: string; result: ToolData }) {
  if (!result || !hasToolCard(tool)) return null;
  switch (tool) {
    case 'generate_quotation':
      return <QuotationDisplay data={result} />;
    case 'calculate_roi':
      return <RoiDisplay data={result} />;
    case 'book_site_visit':
      return <BookingDisplay data={result} />;
    case 'offer_lead_form':
      return <LeadFormCard data={result} />;
    case 'calculate_system_size':
      return <SystemSizeDisplay data={result} />;
    case 'check_subsidies':
      return <SubsidyDisplay data={result} />;
    case 'generate_cad_drawing':
      return <CadDrawingDisplay data={result} />;
    case 'search_knowledge_base':
      return <KnowledgeBaseDisplay data={result} />;
    default:
      return <GenericToolDisplay toolName={tool} data={result} />;
  }
}
