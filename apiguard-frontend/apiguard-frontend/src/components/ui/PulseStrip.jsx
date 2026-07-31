import { useMemo } from 'react';
import { motion } from 'framer-motion';

/**
 * Signature visual element: a heartbeat-monitor style readout of the most
 * recent requests passing through the gateway. Each tick is one request,
 * colored by outcome, height driven by response time — the "checkpoint"
 * made visible, traffic pulsing through the gate in real time.
 */
export default function PulseStrip({ logs = [] }) {
  const ticks = useMemo(() => {
    const recent = [...logs].slice(0, 44).reverse();
    const maxTime = Math.max(...recent.map((l) => l.responseTimeMs || 1), 1);

    return recent.map((log) => {
      const heightPct = Math.max(18, Math.min(100, (log.responseTimeMs / maxTime) * 100));
      let color = 'bg-signal shadow-[0_0_10px_rgba(168,85,247,0.65)]';
      if (log.statusCode >= 500) color = 'bg-danger shadow-[0_0_10px_rgba(244,63,94,0.65)]';
      else if (log.statusCode >= 400) color = 'bg-alert shadow-[0_0_10px_rgba(251,146,60,0.65)]';

      return { id: log.id, heightPct, color, status: log.statusCode, ms: log.responseTimeMs };
    });
  }, [logs]);

  if (ticks.length === 0) {
    return (
      <div className="flex h-24 items-center justify-center rounded-xl border border-dashed border-white/10 bg-white/[0.02] text-sm text-text-faint">
        No traffic yet — call your gateway to see live pulses here
      </div>
    );
  }

  return (
    <div className="relative flex h-24 items-end gap-[3px] overflow-hidden rounded-xl border border-white/10 bg-black/20 px-4 py-3 backdrop-blur-sm">
      {/* faint grid backdrop for a "scope" feel */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
          backgroundSize: '24px 100%, 100% 50%',
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 animate-scan opacity-60"
        style={{
          backgroundImage: 'linear-gradient(90deg, transparent, rgba(168,85,247,0.2), rgba(251,191,36,0.14), transparent)',
          backgroundSize: '200% 100%',
        }}
      />
      {ticks.map((t, i) => (
        <motion.div
          key={t.id ?? i}
          title={`HTTP ${t.status} · ${t.ms}ms`}
          initial={{ scaleY: 0, opacity: 0 }}
          animate={{ scaleY: 1, opacity: 0.55 + (i / ticks.length) * 0.45 }}
          transition={{ delay: i * 0.012, duration: 0.35, ease: 'easeOut' }}
          className={`${t.color} relative w-1.5 shrink-0 origin-bottom cursor-default rounded-full transition-transform duration-150 hover:!scale-x-[2.2]`}
          style={{ height: `${t.heightPct}%` }}
        />
      ))}
    </div>
  );
}
