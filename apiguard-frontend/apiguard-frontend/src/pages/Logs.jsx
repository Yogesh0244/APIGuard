import { useEffect, useMemo, useState } from 'react';
import { Search, ScrollText } from 'lucide-react';
import AppShell from '../components/layout/AppShell';
import StatusCode from '../components/ui/StatusCode';
import EmptyState from '../components/ui/EmptyState';
import Loader from '../components/ui/Loader';
import { useToast } from '../components/ui/Toast';
import { listLogs } from '../api/logs';
import { formatMs } from '../utils/formatters';

const STATUS_FILTERS = [
  { label: 'All', value: 'all' },
  { label: 'Success', value: 'success' },
  { label: 'Failed', value: 'failed' },
];

export default function Logs() {
  const { showToast } = useToast();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    listLogs()
      .then(({ data }) => setLogs(data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))))
      .catch(() => showToast('Could not load request logs', 'error'))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    return logs.filter((log) => {
      const matchesSearch =
        !search ||
        log.endpoint?.toLowerCase().includes(search.toLowerCase()) ||
        log.apiResource?.name?.toLowerCase().includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'success' && log.statusCode < 400) ||
        (statusFilter === 'failed' && log.statusCode >= 400);

      return matchesSearch && matchesStatus;
    });
  }, [logs, search, statusFilter]);

  return (
    <AppShell title="Request Logs" subtitle="Every request that has passed through the gateway.">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-faint" />
          <input
            className="input-field pl-9"
            placeholder="Search endpoint or API…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="inline-flex rounded-lg border border-ink-border bg-ink-panel p-1">
          {STATUS_FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setStatusFilter(f.value)}
              className={`rounded-md px-3.5 py-1.5 text-xs font-medium transition-all duration-200 ${
                statusFilter === f.value ? 'bg-signal-flux text-ink shadow-glow' : 'text-text-muted hover:text-text-primary'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex h-48 items-center justify-center">
          <Loader size={32} />
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState icon={ScrollText} title="No logs found" description="Try adjusting your search or filters, or make a gateway request." />
      ) : (
        <div className="panel-interactive overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-ink-border text-left text-xs uppercase tracking-wider text-text-faint">
                <th className="px-5 py-3.5 font-medium">Timestamp</th>
                <th className="px-5 py-3.5 font-medium">API</th>
                <th className="px-5 py-3.5 font-medium">Endpoint</th>
                <th className="px-5 py-3.5 font-medium">Method</th>
                <th className="px-5 py-3.5 font-medium">Status</th>
                <th className="px-5 py-3.5 font-medium text-right">Latency</th>
              </tr>
            </thead>
            <tbody className="font-mono">
              {filtered.slice(0, 200).map((log) => (
                <tr key={log.id} className="border-b border-ink-border/60 last:border-0 transition-colors duration-150 hover:bg-ink-raised/50">
                  <td className="px-5 py-3.5 text-xs text-text-muted">{new Date(log.timestamp).toLocaleString()}</td>
                  <td className="px-5 py-3.5 text-xs text-text-primary">{log.apiResource?.name || '—'}</td>
                  <td className="px-5 py-3.5 text-xs text-text-muted">{log.endpoint}</td>
                  <td className="px-5 py-3.5 text-xs text-text-muted">{log.httpMethod}</td>
                  <td className="px-5 py-3.5">
                    <StatusCode code={log.statusCode} />
                  </td>
                  <td className="px-5 py-3.5 text-right text-xs text-text-muted">{formatMs(log.responseTimeMs)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AppShell>
  );
}
