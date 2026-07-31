import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard, Network, KeyRound, LineChart, ScrollText, Terminal, ShieldCheck,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const navItems = [
  { to: '/dashboard', label: 'Overview', icon: LayoutDashboard, adminOnly: false },
  { to: '/apis', label: 'Registered APIs', icon: Network, adminOnly: true },
  { to: '/keys', label: 'API Keys', icon: KeyRound, adminOnly: false },
  { to: '/analytics', label: 'Analytics', icon: LineChart, adminOnly: false },
  { to: '/logs', label: 'Request Logs', icon: ScrollText, adminOnly: false },
  { to: '/tester', label: 'API Tester', icon: Terminal, adminOnly: false },
];

export default function Sidebar() {
  const { isAdmin, user } = useAuth();
  const location = useLocation();

  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-white/[0.06] bg-ink-panel/50 backdrop-blur-2xl lg:flex">
      <div
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{ background: 'linear-gradient(180deg, rgba(168,85,247,0.06) 0%, transparent 30%, rgba(251,191,36,0.04) 100%)' }}
      />

      <div className="relative flex items-center gap-2.5 px-6 py-6">
        <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-signal-flux-soft text-signal ring-1 ring-signal/30">
          <span className="absolute inset-0 rounded-xl bg-signal-flux opacity-0 blur-md transition-opacity duration-500 hover:opacity-50" />
          <ShieldCheck size={18} className="relative" />
        </div>
        <div>
          <p className="font-display text-base font-bold leading-none text-gradient">ApiGuard</p>
          <p className="mt-0.5 text-[11px] font-medium uppercase tracking-wider text-text-faint">Control Plane</p>
        </div>
      </div>

      <nav className="relative flex-1 space-y-1 px-3">
        {navItems
          .filter((item) => !item.adminOnly || isAdmin)
          .map((item) => {
            const isActive = location.pathname === item.to;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={`nav-link relative ${isActive ? 'nav-link-active' : ''}`}
              >
                {isActive && (
                  <motion.span
                    layoutId="sidebar-active-pill"
                    className="absolute inset-0 rounded-lg border border-signal/25"
                    style={{ background: 'linear-gradient(115deg, rgba(168,85,247,0.22), rgba(251,191,36,0.12))' }}
                    transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                  />
                )}
                <item.icon size={17} strokeWidth={2} className="relative" />
                <span className="relative">{item.label}</span>
              </NavLink>
            );
          })}
      </nav>

      <div className="relative border-t border-white/[0.06] px-4 py-4">
        <div className="flex items-center gap-2.5 rounded-lg bg-white/[0.03] px-3 py-2.5 transition-colors hover:bg-white/[0.06]">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-signal-flux font-mono text-xs font-semibold text-ink">
            {user?.username?.[0]?.toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="truncate text-xs font-medium text-text-primary">{user?.username}</p>
            <p className="text-[10px] uppercase tracking-wider text-text-faint">{user?.role}</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
