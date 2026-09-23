import { Download } from 'lucide-react';
import { Badge, BulletList, Panel, StatTile, WidgetShell, type ToolData } from './parts';

export function CadDrawingDisplay({ data }: { data: ToolData }) {
  const layout: ToolData = data.panel_layout ?? {};
  const recommendations: string[] = Array.isArray(data.recommendations) ? data.recommendations : [];
  const percent = parseFloat(data.utilization?.percent);
  const utilization = Number.isFinite(percent) ? Math.min(Math.max(percent, 0), 100) : 0;

  // The SVG is never put into the page, only handed over as a download, so
  // markup in it cannot run in our origin.
  const downloadSvg = () => {
    const url = URL.createObjectURL(new Blob([data.svg], { type: 'image/svg+xml' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = `${data.drawing_id ?? 'solar'}_layout.svg`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <WidgetShell
      emoji="🏗️"
      title="Solar Panel Layout"
      action={
        data.svg && (
          <button type="button" onClick={downloadSvg} className="btn btn-outline btn-sm">
            <Download className="size-4" aria-hidden="true" />
            Download SVG
          </button>
        )
      }
    >
      <div className="flex flex-wrap gap-xs">
        {data.drawing_id && <Badge>{data.drawing_id}</Badge>}
        {data.status && <Badge>{String(data.status).replace(/_/g, ' ')}</Badge>}
      </div>

      <div className="grid grid-cols-2 gap-xs">
        <StatTile label="System size" value={`${data.system_size_kw} kW`} accent />
        <StatTile label="Total panels" value={layout.total_panels} accent />
        <StatTile
          label="Layout"
          value={`${layout.rows} × ${layout.columns}${layout.orientation ? ` (${layout.orientation})` : ''}`}
        />
        <StatTile label="Roof type" value={data.roof_type} />
      </div>

      {data.utilization && (
        <Panel>
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold">Roof utilisation</span>
            <span className="text-base font-bold text-action">{data.utilization.percent}%</span>
          </div>
          <p className="text-xs text-ink-muted">
            Using {data.utilization.area_used}m² of {data.utilization.area_total}m² available
          </p>
          <progress
            className="progress progress-primary w-full"
            value={utilization}
            max={100}
            aria-label="Roof utilisation"
          />
        </Panel>
      )}

      {data.preview_url && (
        // A remote preview from the backend, not a site image, so not next/image.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={data.preview_url}
          alt="Solar panel layout preview"
          className="w-full rounded-md border border-line"
        />
      )}

      {recommendations.length > 0 && (
        <Panel
          title={
            <>
              <span aria-hidden="true">💡</span> Recommendations
            </>
          }
        >
          <BulletList items={recommendations} />
        </Panel>
      )}

      {data.note && <p className="text-xs text-ink-muted">📝 {data.note}</p>}
    </WidgetShell>
  );
}
