<script lang="ts">
  import QuotationDisplay from "./QuotationDisplay.svelte";
  import RoiDisplay from "./RoiDisplay.svelte";
  import BookingDisplay from "./BookingDisplay.svelte";
  import SystemSizeDisplay from "./SystemSizeDisplay.svelte";
  import SubsidyDisplay from "./SubsidyDisplay.svelte";
  import CadDrawingDisplay from "./CadDrawingDisplay.svelte";
  import KnowledgeBaseDisplay from "./KnowledgeBaseDisplay.svelte";
  import LeadFormCard from "./LeadFormCard.svelte";
  import GenericToolDisplay from "./GenericToolDisplay.svelte";

  let { toolExecuted, toolResult }: { toolExecuted: string; toolResult: any } = $props();

  // Tools that run purely for the model's benefit — rendering their raw output
  // would just be noise for the user.
  const INTERNAL_TOOLS = ["collect_customer_info", "scrape_website"];
</script>

{#if toolResult && !INTERNAL_TOOLS.includes(toolExecuted)}
  {#if toolExecuted === "generate_quotation"}
    <QuotationDisplay data={toolResult} />
  {:else if toolExecuted === "calculate_roi"}
    <RoiDisplay data={toolResult} />
  {:else if toolExecuted === "book_site_visit"}
    <BookingDisplay data={toolResult} type="site_visit" />
  {:else if toolExecuted === "offer_lead_form"}
    <LeadFormCard data={toolResult} />
  {:else if toolExecuted === "calculate_system_size"}
    <SystemSizeDisplay data={toolResult} />
  {:else if toolExecuted === "check_subsidies"}
    <SubsidyDisplay data={toolResult} />
  {:else if toolExecuted === "generate_cad_drawing"}
    <CadDrawingDisplay data={toolResult} />
  {:else if toolExecuted === "search_knowledge_base"}
    <KnowledgeBaseDisplay data={toolResult} />
  {:else}
    <GenericToolDisplay toolName={toolExecuted} data={toolResult} />
  {/if}
{/if}
