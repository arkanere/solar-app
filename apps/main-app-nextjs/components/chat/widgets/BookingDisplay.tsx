import { Badge, BulletList, Panel, StatRow, WidgetShell, type ToolData } from './parts';

// The payload uses "To be confirmed" as a placeholder rather than omitting the field.
const isConfirmed = (value: unknown) => Boolean(value) && value !== 'To be confirmed';

export function BookingDisplay({ data }: { data: ToolData }) {
  const phone = data.phone_number || data.phone;
  return (
    <WidgetShell emoji="📅" title="Site Visit Scheduled" action={<Badge>✓ Confirmed</Badge>}>
      {data.booking_id && (
        <Panel>
          <p className="text-xs text-ink-muted">Booking ID</p>
          <p className="font-mono text-base font-bold">{data.booking_id}</p>
        </Panel>
      )}
      <div className="flex flex-col gap-xs">
        <StatRow label="Name" value={data.customer_name} />
        {phone && <StatRow label="Phone" value={phone} />}
        {data.location && <StatRow label="Location" value={data.location} />}
        {isConfirmed(data.preferred_date) && <StatRow label="Date" value={data.preferred_date} />}
        {isConfirmed(data.preferred_time) && <StatRow label="Time" value={data.preferred_time} />}
      </div>
      <Panel
        title={
          <>
            <span aria-hidden="true">📞</span> Next steps
          </>
        }
      >
        <BulletList
          items={[
            'Our team will contact you within 24 hours',
            'The site survey will be scheduled at your convenience'
          ]}
        />
      </Panel>
    </WidgetShell>
  );
}
