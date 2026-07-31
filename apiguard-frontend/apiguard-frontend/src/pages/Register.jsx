import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, ArrowRight, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import AuthShowcase from '../components/layout/AuthShowcase';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', email: '', password: '', role: 'DEVELOPER' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(form);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Could not create your account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <AuthShowcase />

      <div className="flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm animate-fadeInUp">
          <div className="mb-8 flex items-center gap-2.5 lg:hidden">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-signal/10 text-signal ring-1 ring-signal/30">
              <ShieldCheck size={17} />
            </div>
            <p className="font-display text-lg font-bold">ApiGuard</p>
          </div>

          <h2 className="font-display text-2xl font-semibold">Create your account</h2>
          <p className="mt-1.5 text-sm text-text-muted">Start registering APIs and issuing keys in minutes.</p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            {error && (
              <div className="flex items-center gap-2 rounded-lg border border-danger/30 bg-danger/10 px-3.5 py-2.5 text-sm text-danger">
                <AlertCircle size={15} className="shrink-0" />
                {error}
              </div>
            )}

            <div>
              <label className="label-text">Username</label>
              <input name="username" value={form.username} onChange={handleChange} className="input-field" placeholder="e.g. jane_dev" required autoFocus />
            </div>

            <div>
              <label className="label-text">Email</label>
              <input type="email" name="email" value={form.email} onChange={handleChange} className="input-field" placeholder="jane@company.com" required />
            </div>

            <div>
              <label className="label-text">Password</label>
              <input type="password" name="password" value={form.password} onChange={handleChange} className="input-field" placeholder="At least 6 characters" required minLength={6} />
            </div>

            <div>
              <label className="label-text">Account type</label>
              <div className="grid grid-cols-2 gap-2">
                {['DEVELOPER', 'ADMIN'].map((role) => (
                  <button
                    type="button"
                    key={role}
                    onClick={() => setForm({ ...form, role })}
                    className={`rounded-lg border px-3 py-2.5 text-sm font-medium transition-colors ${
                      form.role === role
                        ? 'border-signal/50 bg-signal/10 text-signal'
                        : 'border-ink-border bg-ink text-text-muted hover:text-text-primary'
                    }`}
                  >
                    {role === 'DEVELOPER' ? 'Developer' : 'Admin'}
                  </button>
                ))}
              </div>
              <p className="mt-1.5 text-xs text-text-faint">
                Admins register APIs. Developers generate keys and call the gateway.
              </p>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? 'Creating account…' : 'Create account'}
              {!loading && <ArrowRight size={15} />}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-text-muted">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-signal hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
