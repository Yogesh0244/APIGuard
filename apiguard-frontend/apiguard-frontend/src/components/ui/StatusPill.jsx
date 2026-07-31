export default function StatusPill({ status }) {
  const map = {
    healthy: { label: 'Healthy', dot: 'bg-signal', text: 'text-signal', ring: 'ring-signal/20', glow: true },
    down: { label: 'Down', dot: 'bg-danger', text: 'text-danger', ring: 'ring-danger/20', glow: false },
    active: { label: 'Active', dot: 'bg-signal', text: 'text-signal', ring: 'ring-signal/20', glow: true },
    inactive: { label: 'Disabled', dot: 'bg-text-faint', text: 'text-text-muted', ring: 'ring-ink-border', glow: false },
    revoked: { label: 'Revoked', dot: 'bg-danger', text: 'text-danger', ring: 'ring-danger/20', glow: false },
  };
  const s = map[status] || map.inactive;

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full bg-ink px-2.5 py-1 text-xs font-medium ring-1 transition-colors ${s.text} ${s.ring}`}>
      <span className="relative flex h-1.5 w-1.5">
        {s.glow && <span className={`absolute inline-flex h-full w-full animate-ping rounded-full ${s.dot} opacity-60`} />}
        <span className={`relative inline-flex h-1.5 w-1.5 rounded-full ${s.dot}`} />
      </span>
      {s.label}
    </span>
  );
}
