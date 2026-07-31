import { motion } from 'framer-motion';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';
import { useCountUp } from '../../utils/useCountUp';

const ACCENT_HEX = {
  signal: '#A855F7',
  flux: '#FBBF24',
  alert: '#FB923C',
  danger: '#F43F5E',
};

/**
 * Numeric value animates in with an ease-out count-up. Pass `trend`
 * (an array of numbers) to render a small embedded sparkline — turns a
 * flat stat tile into a mini chart, which is a big part of what makes a
 * dashboard feel "alive" instead of like a static template.
 */
export default function StatCard({ label, value, sublabel, icon: Icon, accent = 'signal', delay = 0, trend }) {
  const numeric = typeof value === 'number' || (typeof value === 'string' && /^-?\d+(\.\d+)?$/.test(value.replace(/,/g, '')));
  const target = numeric ? Number(String(value).replace(/,/g, '')) : 0;
  const animated = useCountUp(target);

  const accentClasses = {
    signal: 'text-signal bg-signal/10',
    flux: 'text-flux bg-flux/10',
    alert: 'text-alert bg-alert/10',
    danger: 'text-danger bg-danger/10',
  };

  const hex = ACCENT_HEX[accent] || ACCENT_HEX.signal;
  const sparkData = trend && trend.length > 1 ? trend.map((v, i) => ({ i, v })) : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: delay / 1000, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -4 }}
      className="group panel-interactive gradient-border relative overflow-hidden p-5"
    >
      <div className="card-glow-ring" />
      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-text-muted">{label}</p>
          <p className="mt-2 font-display text-3xl font-semibold text-text-primary tabular-nums">
            {numeric ? Math.round(animated).toLocaleString('en-US') : value}
          </p>
          {sublabel && <p className="mt-1 text-xs text-text-faint">{sublabel}</p>}
        </div>
        {Icon && (
          <div className={`rounded-lg p-2.5 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3 ${accentClasses[accent]}`}>
            <Icon size={18} strokeWidth={2} />
          </div>
        )}
      </div>

      {sparkData && (
        <div className="relative -mx-1 -mb-1 mt-3 h-10 opacity-90">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={sparkData} margin={{ top: 2, right: 0, bottom: 0, left: 0 }}>
              <defs>
                <linearGradient id={`spark-${accent}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={hex} stopOpacity={0.5} />
                  <stop offset="100%" stopColor={hex} stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area type="monotone" dataKey="v" stroke={hex} strokeWidth={1.75} fill={`url(#spark-${accent})`} isAnimationActive={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </motion.div>
  );
}
