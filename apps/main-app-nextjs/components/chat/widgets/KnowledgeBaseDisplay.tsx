import { Badge, WidgetShell, type ToolData } from './parts';

export function KnowledgeBaseDisplay({ data }: { data: ToolData }) {
  const related: string[] = Array.isArray(data.related) ? data.related : [];
  return (
    <WidgetShell emoji="📚" title={data.title}>
      {/* Plain text, not markdown. */}
      <p className="text-sm break-words whitespace-pre-line">{data.content}</p>
      {related.length > 0 && (
        <div className="flex flex-col gap-xs">
          <p className="text-xs font-semibold text-ink-muted">Related topics</p>
          <div className="flex flex-wrap gap-xs">
            {related.map((topic) => (
              <Badge key={topic}>{topic}</Badge>
            ))}
          </div>
        </div>
      )}
    </WidgetShell>
  );
}
