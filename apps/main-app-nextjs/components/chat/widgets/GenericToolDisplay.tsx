import { humanizeToolName } from '@/lib/chat/format';
import { WidgetShell, type ToolData } from './parts';

/** Fallback for a tool with no card of its own: the raw payload. */
export function GenericToolDisplay({ toolName, data }: { toolName: string; data: ToolData }) {
  let pretty: string;
  try {
    pretty = JSON.stringify(data, null, 2);
  } catch {
    pretty = String(data);
  }
  return (
    <WidgetShell emoji="🔧" title={humanizeToolName(toolName)}>
      <pre className="overflow-x-auto rounded-md border border-line bg-surface p-xs text-xs">
        <code>{pretty}</code>
      </pre>
    </WidgetShell>
  );
}
