<script lang="ts">
  import { Badge } from "$lib/components/ui/badge";

  let { intent }: { intent: any } = $props();

  const INTENT_LABELS: Record<string, string> = {
    general_inquiry: "General Question",
    how_solar_works: "How It Works",
    benefits_inquiry: "Benefits",
    pricing_inquiry: "Pricing",
    system_sizing: "System Sizing",
    roi_calculation: "ROI Calculator",
    subsidy_inquiry: "Subsidies",
    technical_question: "Technical",
    comparison_request: "Comparison",
    request_quotation: "Quotation Request",
    book_site_visit: "Site Visit",
    financing_inquiry: "Financing",
    eligibility_check: "Eligibility",
    request_cad_drawing: "CAD Drawing",
    installation_timeline: "Timeline",
    document_request: "Documents",
    maintenance_inquiry: "Maintenance",
    troubleshooting: "Troubleshooting",
    contact_request: "Contact Request",
    other: "Other",
  };

  const JOURNEY_STAGES: Record<string, { label: string; emoji: string }> = {
    awareness: { label: "Awareness", emoji: "💡" },
    consideration: { label: "Considering", emoji: "🤔" },
    decision: { label: "Ready to Buy", emoji: "✅" },
    installation: { label: "Installation", emoji: "🔧" },
    support: { label: "Support", emoji: "🆘" },
  };

  let stage = $derived(JOURNEY_STAGES[intent?.journeyStage] ?? JOURNEY_STAGES.awareness);
  let label = $derived(INTENT_LABELS[intent?.intent] ?? intent?.intent ?? "");
  let confidence = $derived(Number(intent?.confidence));
</script>

<div class="flex flex-wrap items-center gap-[theme(--form-element-field-gap)] mt-[theme(--form-element-field-gap)]">
  <Badge variant="outline"><span aria-hidden="true" class="mr-[0.25rem]">{stage.emoji}</span>{stage.label}</Badge>
  {#if label}
    <Badge variant="outline">{label}</Badge>
  {/if}
  {#if Number.isFinite(confidence) && confidence > 0.8}
    <Badge variant="outline">{Math.round(confidence * 100)}% confident</Badge>
  {/if}
</div>
