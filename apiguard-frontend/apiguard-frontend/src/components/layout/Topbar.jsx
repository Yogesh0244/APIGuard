import { LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Topbar({ title, subtitle }) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-30 border-b border-white/[0.06] bg-ink/70 backdrop-blur-2xl">
      <div className="flex items-center justify-between px-6 py-5 lg:px-8">
        <div>
          <h1 className="font-display text-xl font-semibold text-text-primary">{title}</h1>
          {subtitle && <p className="mt-0.5 text-sm text-text-muted">{subtitle}</p>}
        </div>
        <button onClick={handleLogout} className="btn-secondary">
          <LogOut size={15} />
          Sign out
        </button>
      </div>
      {/* hairline gradient accent under the topbar — echoes the brand gradient everywhere */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-signal/40 to-transparent" />
    </header>
  );
}
