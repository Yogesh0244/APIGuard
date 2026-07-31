import { motion } from 'framer-motion';
import { ShieldCheck, Activity, Zap, Lock } from 'lucide-react';

/**
 * Left-hand visual panel shown on the auth screens. Mirrors the
 * dashboard's "pulse" motif so the brand identity is consistent from
 * the very first screen a user sees. Floating gradient orbs give it
 * depth without competing with the copy.
 */
export default function AuthShowcase() {
  const bars = [40, 65, 30, 80, 50, 95, 45, 60, 35, 75, 55, 90, 40, 70];

  return (
    <div className="relative hidden overflow-hidden border-r border-ink-border bg-ink-panel/40 lg:flex lg:flex-col lg:justify-between lg:p-12">
      {/* Ambient floating gradient orbs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-24 -top-24 h-96 w-96 animate-float rounded-full bg-signal/10 blur-3xl" />
        <div className="absolute -bottom-32 -right-16 h-[28rem] w-[28rem] animate-floatSlow rounded-full bg-flux/10 blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              'linear-gradient(#9B93B0 1px, transparent 1px), linear-gradient(90deg, #9B93B0 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative flex items-center gap-2.5"
      >
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-signal-flux-soft text-signal ring-1 ring-signal/30">
          <ShieldCheck size={19} />
        </div>
        <p className="font-display text-lg font-bold text-gradient">ApiGuard</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
        className="relative"
      >
        <p className="font-display text-3xl font-semibold leading-tight text-text-primary">
          Every request,<br />
          <span className="text-gradient">verified at the gate.</span>
        </p>
        <p className="mt-3 max-w-sm text-sm leading-relaxed text-text-muted">
          Register your services, issue scoped keys, and watch traffic pulse
          through your gateway in real time — with rate limits enforced
          before a bad actor ever reaches your backend.
        </p>

        <div className="mt-8 flex h-16 items-end gap-1.5">
          {bars.map((h, i) => (
            <div
              key={i}
              className="w-2 rounded-full bg-gradient-to-t from-signal to-flux shadow-[0_0_10px_rgba(168,85,247,0.4)]"
              style={{
                height: `${h}%`,
                animation: `pulseTick 1.8s ease-in-out ${i * 0.08}s infinite`,
              }}
            />
          ))}
        </div>

        <div className="mt-8 grid grid-cols-3 gap-4">
          <Feature icon={Activity} label="Live analytics" />
          <Feature icon={Zap} label="Rate limiting" />
          <Feature icon={Lock} label="Scoped keys" />
        </div>
      </motion.div>

      <p className="relative text-xs text-text-faint">Built with Spring Boot, PostgreSQL & Redis.</p>
    </div>
  );
}

function Feature({ icon: Icon, label }) {
  return (
    <div className="group flex items-center gap-2 text-xs text-text-muted transition-colors hover:text-signal">
      <Icon size={14} className="text-signal transition-transform duration-200 group-hover:scale-110" />
      {label}
    </div>
  );
}
