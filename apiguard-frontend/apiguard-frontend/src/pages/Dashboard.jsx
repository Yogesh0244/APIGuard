import { useEffect, useState } from 'react';
import { Activity, AlertTriangle, Gauge, Network, ArrowUpRight, Radio } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from 'recharts';
import AppShell from '../components/layout/AppShell';
import StatCard from '../components/ui/StatCard';
import PulseStrip from '../components/ui/PulseStrip';
import StatusPill from '../components/ui/StatusPill';
import EmptyState from '../components/ui/EmptyState';
import Loader from '../components/ui/Loader';
import { useAuth } from '../context/AuthContext';
import { getAnalyticsSummary } from '../api/analytics';
import { listLogs } from '../api/logs';
import { listApis } from '../api/apis';
import { formatMs, formatNumber, formatPercent, timeAgo } from '../utils/formatters';

export default function Dashboard() {
  const { user, isAdmin } = useAuth();
  const [summary, setSummary] = useState(null);
  const [logs, setLogs] = useState([]);
  const [apis, setApis] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        const calls = [getAnalyticsSummary(7), listLogs()];
        if (isAdmin) calls.push(listApis());

        const results = await Promise.allSettled(calls);
        if (!mounted) return;

        if (results[0].status === 'fulfilled') setSummary(results[0].value.data);
        if (results[1].status === 'fulfilled') setLogs(results[1].value.data);
        if (isAdmin && results[2]?.status === 'fulfilled') setApis(results[2].value.data);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();
    const interval = setInterval(load, 15000); // light polling for a "live" feel
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, [isAdmin]);

  const chartData = summary
    ? Object.entries(summary.requestsOverTime || {}).map(([date, count]) => ({ date: date.slice(5), count }))
    : [];

  const requestTrend = chartData.map((d) => d.count);

  const topApis = summary
    ? Object.entries(summary.requestsPerApi || {}).sort((a, b) => b[1] - a[1]).slice(0, 5)
    : [];
  const topApiMax = topApis.length > 0 ? Math.max(...topApis.map(([, c]) => c)) : 1;

  return (
    <AppShell title="Overview" subtitle="Everything moving through your gateway, at a glance.">
      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <Loader size={32} />
        </div>
      ) : (
        <div className="space-y-6">
          {/* ---- Hero: welcome + live pulse, on a mesh-gradient glass panel ---- */}
          <div className="panel-glass relative overflow-hidden p-6 lg:p-7">
            <div className="pointer-events-none absolute inset-0 animate-meshMove bg-mesh-hero opacity-90" />
            <div className="relative">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-text-faint">
                    <Radio size={12} className="text-signal" />
                    Control plane · live
                  </p>
                  <h2 className="mt-2 font-display text-2xl font-semibold text-text-primary lg:text-3xl">
                    Welcome back, <span className="text-gradient">{user?.username}</span>
                  </h2>
                  <p className="mt-1 text-sm text-text-muted">
                    {formatNumber(summary?.totalRequests)} requests handled in the last 7 days.
                  </p>
                </div>
                <span className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs text-text-faint">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-signal shadow-[0_0_6px_rgba(168,85,247,0.8)]" />
                  Auto-refreshing every 15s
                </span>
              </div>

              <div className="mt-5">
                <PulseStrip logs={logs} />
              </div>
            </div>
          </div>

          {/* ---- Stat row ---- */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              label="Total requests"
              value={formatNumber(summary?.totalRequests)}
              sublabel="last 7 days"
              icon={Activity}
              accent="signal"
              delay={0}
              trend={requestTrend}
            />
            <StatCard
              label="Failed requests"
              value={formatNumber(summary?.failedRequests)}
              sublabel={formatPercent(summary?.failedRequests, summary?.totalRequests) + ' failure rate'}
              icon={AlertTriangle}
              accent="danger"
              delay={60}
            />
            <StatCard
              label="Avg response time"
              value={formatMs(summary?.averageResponseTimeMs)}
              sublabel="across all APIs"
              icon={Gauge}
              accent="alert"
              delay={120}
            />
            <StatCard
              label="Registered APIs"
              value={formatNumber(isAdmin ? apis.length : Object.keys(summary?.requestsPerApi || {}).length)}
              sublabel={isAdmin ? `${apis.filter((a) => a.healthy).length} healthy` : 'in use'}
              icon={Network}
              accent="flux"
              delay={180}
            />
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Chart */}
            <div className="panel-interactive gradient-border p-5 lg:col-span-2">
              <h3 className="mb-4 text-sm font-semibold text-text-primary">Requests over time</h3>
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={220}>
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="dashboardFlow" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#A855F7" stopOpacity={0.45} />
                        <stop offset="100%" stopColor="#A855F7" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="dashboardStroke" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#A855F7" />
                        <stop offset="100%" stopColor="#FBBF24" />
                      </linearGradient>
                    </defs>
                    <CartesianGrid stroke="#2E2843" strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="date" stroke="#635C78" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#635C78" fontSize={12} tickLine={false} axisLine={false} width={32} />
                    <Tooltip
                      contentStyle={{ background: '#16131F', border: '1px solid #2E2843', borderRadius: 10, fontSize: 12, boxShadow: '0 8px 24px rgba(0,0,0,0.4)' }}
                      labelStyle={{ color: '#9B93B0' }}
                      cursor={{ stroke: '#A855F7', strokeWidth: 1, strokeDasharray: '4 4' }}
                    />
                    <Area
                      type="monotone"
                      dataKey="count"
                      stroke="url(#dashboardStroke)"
                      strokeWidth={2.5}
                      fill="url(#dashboardFlow)"
                      animationDuration={900}
                      animationEasing="ease-out"
                      dot={false}
                      activeDot={{ r: 5, fill: '#A855F7', stroke: '#0B0A14', strokeWidth: 2 }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <EmptyState icon={Activity} title="No traffic yet" description="Requests through the gateway will appear here." />
              )}
            </div>

            {/* Top APIs */}
            <div className="panel-interactive gradient-border p-5">
              <h3 className="mb-4 text-sm font-semibold text-text-primary">Most-used APIs</h3>
              {topApis.length > 0 ? (
                <ul className="space-y-4">
                  {topApis.map(([name, count], i) => (
                    <li key={name}>
                      <div className="mb-1.5 flex items-center justify-between">
                        <span className="truncate text-sm text-text-primary">{name}</span>
                        <span className="font-mono text-xs text-text-muted">{formatNumber(count)}</span>
                      </div>
                      <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/5">
                        <div
                          className="h-full rounded-full bg-signal-flux transition-all duration-700 ease-out"
                          style={{ width: `${Math.max(6, (count / topApiMax) * 100)}%`, transitionDelay: `${i * 60}ms` }}
                        />
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-text-faint">No API usage recorded yet.</p>
              )}
            </div>
          </div>

          {/* Health grid (admin only) */}
          {isAdmin && (
            <div className="panel-interactive gradient-border p-5">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-text-primary">API health</h3>
                <a href="/apis" className="flex items-center gap-1 text-xs font-medium text-signal transition-colors hover:text-flux">
                  Manage APIs <ArrowUpRight size={12} />
                </a>
              </div>
              {apis.length > 0 ? (
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {apis.map((api) => (
                    <div
                      key={api.id}
                      className="flex items-center justify-between rounded-lg border border-white/[0.06] bg-white/[0.02] px-4 py-3 transition-colors duration-200 hover:border-signal/30 hover:bg-white/[0.04]"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-text-primary">{api.name}</p>
                        <p className="mt-0.5 text-xs text-text-faint">{timeAgo(api.lastCheckedAt)}</p>
                      </div>
                      <StatusPill status={api.healthy ? 'healthy' : 'down'} />
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState icon={Network} title="No APIs registered" description="Register your first backend service to start monitoring it." />
              )}
            </div>
          )}
        </div>
      )}
    </AppShell>
  );
}
