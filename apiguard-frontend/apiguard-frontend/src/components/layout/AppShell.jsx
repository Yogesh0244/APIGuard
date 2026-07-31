import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

export default function AppShell({ title, subtitle, children }) {
  const location = useLocation();

  return (
    <div className="relative min-h-screen bg-ink">
      {/* Ambient gradient orbs — consistent atmosphere on every page, not just Dashboard/Auth */}
      <div className="ambient-orbs">
        <span className="left-[-10%] top-[-15%] h-[28rem] w-[28rem] animate-float bg-signal/[0.07]" />
        <span className="right-[-8%] top-[20%] h-[24rem] w-[24rem] animate-floatSlow bg-flux/[0.08]" />
        <span className="bottom-[-15%] left-[30%] h-[22rem] w-[22rem] animate-float bg-alert/[0.04]" style={{ animationDelay: '4s' }} />
      </div>

      <div className="relative z-10">
        <Sidebar />
        <div className="lg:pl-64">
          <Topbar title={title} subtitle={subtitle} />
          <motion.main
            key={location.pathname}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="px-6 py-8 lg:px-8"
          >
            {children}
          </motion.main>
        </div>
      </div>
    </div>
  );
}
