import { useEffect, useState } from 'react';
import { BarChart3, Activity, AlertTriangle, Gauge } from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, Cell,
} from 'recharts';
import AppShell from '../components/layout/AppShell';
import StatCard from '../components/ui/StatCard';
import EmptyState from '../components/ui/EmptyState';
import Loader from '../components/ui/Loader';
import { useToast } from '../components/ui/Toast';
import { getAnalyticsSummary } from '../api/analytics';
import { formatMs, formatNumber, formatPercent } from '../utils/formatters';

const RANGE_OPTIONS = [
  { label: '7 days', value: 7 },
  { label: '14 days', value: 14 },
  { label: '30 days', value: 30 },
];

const BAR_COLORS = ['#A855F7', '#FBBF24', '#FB923C', '#F43F5E', '#2DD4BF'];

export default function Analytics() {
  const { showToast } = useToast();
  const [range, setRange] = useState(7);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    getAnalyticsSummary(range)
      .then(({ data }) => mounted && setSummary(data))
      .catch(() => showToast('Could not load analytics', 'error'))
      .finally(() => mounted && setLoading(false));
    return () => {
      mounted = false;
    };
  }, [range]);

  const timeSeries = summary
    ? Object.entries(summary.requestsOverTime || {}).map(([date, count]) => ({ date: date.slice(5), count }))
    : [];

  const perApi = summary
    ? Object.entries(summary.requestsPerApi || {}).map(([name, count]) => ({ name, count }))
    : [];

  return (
    <AppShell title="Analytics" subtitle="Traffic patterns and performance across every registered API.">
      <div className="mb-6 flex justify-end">
        <div className="inline-flex rounded-lg border border-ink-border bg-ink-panel p-1">
          {RANGE_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setRange(opt.value)}
              className={`rounded-md px-3.5 py-1.5 text-xs font-medium transition-all duration-200 ${
                range === opt.value ? 'bg-signal-flux text-ink shadow-glow' : 'text-text-muted hover:text-text-primary'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <Loader size={32} />
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <StatCard
              label="Total requests"
              value={formatNumber(summary?.totalRequests)}
              icon={Activity}
              accent="signal"
              trend={timeSeries.map((d) => d.count)}
            />
            <StatCard
              label="Failure rate"
              value={formatPercent(summary?.failedRequests, summary?.totalRequests)}
              sublabel={`${formatNumber(summary?.failedRequests)} failed`}
              icon={AlertTriangle}
              accent="danger"
            />
            <StatCard label="Avg response time" value={formatMs(summary?.averageResponseTimeMs)} icon={Gauge} accent="alert" />
          </div>

          <div className="panel-interactive gradient-border p-5">
            <h3 className="mb-4 text-sm font-semibold text-text-primary">Request volume</h3>
            {timeSeries.length > 0 ? (
              <ResponsiveContainer width="100%" height={260}>
                <AreaChart data={timeSeries}>
                  <defs>
                    <linearGradient id="analyticsFlow" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#FBBF24" stopOpacity={0.5} />
                      <stop offset="100%" stopColor="#FBBF24" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="analyticsStroke" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#A855F7" />
                      <stop offset="100%" stopColor="#FBBF24" />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="#2E2843" strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="date" stroke="#635C78" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#635C78" fontSize={12} tickLine={false} axisLine={false} width={36} />
                  <Tooltip
                    contentStyle={{ background: '#16131F', border: '1px solid #2E2843', borderRadius: 10, fontSize: 12, boxShadow: '0 8px 24px rgba(0,0,0,0.4)' }}
                    cursor={{ stroke: '#FBBF24', strokeWidth: 1, strokeDasharray: '4 4' }}
                  />
                  <Area
                    type="monotone"
                    dataKey="count"
                    stroke="url(#analyticsStroke)"
                    strokeWidth={2.5}
                    fill="url(#analyticsFlow)"
                    animationDuration={900}
                    dot={{ r: 3, fill: '#A855F7', strokeWidth: 0 }}
                    activeDot={{ r: 6, fill: '#FBBF24', stroke: '#0B0A14', strokeWidth: 2 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <EmptyState icon={BarChart3} title="Not enough data" description="Traffic trends will appear once requests start flowing." />
            )}
          </div>

          <div className="panel-interactive gradient-border p-5">
            <h3 className="mb-4 text-sm font-semibold text-text-primary">Requests by API</h3>
            {perApi.length > 0 ? (
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={perApi}>
                  <defs>
                    {perApi.map((_, i) => (
                      <linearGradient key={i} id={`barGradient${i}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={BAR_COLORS[i % BAR_COLORS.length]} stopOpacity={1} />
                        <stop offset="100%" stopColor={BAR_COLORS[i % BAR_COLORS.length]} stopOpacity={0.35} />
                      </linearGradient>
                    ))}
                  </defs>
                  <CartesianGrid stroke="#2E2843" strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" stroke="#635C78" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#635C78" fontSize={12} tickLine={false} axisLine={false} width={36} />
                  <Tooltip
                    contentStyle={{ background: '#16131F', border: '1px solid #2E2843', borderRadius: 10, fontSize: 12, boxShadow: '0 8px 24px rgba(0,0,0,0.4)' }}
                    cursor={{ fill: 'rgba(255,255,255,0.03)' }}
                  />
                  <Bar dataKey="count" radius={[6, 6, 0, 0]} animationDuration={800}>
                    {perApi.map((_, i) => (
                      <Cell key={i} fill={`url(#barGradient${i})`} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <EmptyState icon={BarChart3} title="No API usage yet" description="Breakdown by API will appear here once the gateway sees traffic." />
            )}
          </div>
        </div>
      )}
    </AppShell>
  );
}
