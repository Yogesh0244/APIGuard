import { useEffect, useState } from 'react';
import { Plus, Power, Trash2, Network, ExternalLink } from 'lucide-react';
import AppShell from '../components/layout/AppShell';
import Modal from '../components/ui/Modal';
import Button from '../components/ui/Button';
import StatusPill from '../components/ui/StatusPill';
import EmptyState from '../components/ui/EmptyState';
import Loader from '../components/ui/Loader';
import { useToast } from '../components/ui/Toast';
import { listApis, registerApi, toggleApi, deleteApi } from '../api/apis';
import { timeAgo } from '../utils/formatters';

export default function ApiManagement() {
  const { showToast } = useToast();
  const [apis, setApis] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ name: '', baseUrl: '', description: '' });

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await listApis();
      setApis(data);
    } catch {
      showToast('Could not load registered APIs', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await registerApi(form);
      showToast(`"${form.name}" registered successfully`);
      setModalOpen(false);
      setForm({ name: '', baseUrl: '', description: '' });
      load();
    } catch (err) {
      showToast(err.response?.data?.message || 'Could not register API', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggle = async (id) => {
    try {
      await toggleApi(id);
      load();
    } catch {
      showToast('Could not update API status', 'error');
    }
  };

  const handleDelete = async (id, name) => {
    if (!confirm(`Remove "${name}" from the platform? This cannot be undone.`)) return;
    try {
      await deleteApi(id);
      showToast(`"${name}" removed`);
      load();
    } catch {
      showToast('Could not remove API', 'error');
    }
  };

  return (
    <AppShell title="Registered APIs" subtitle="Add backend services and control which ones are live on the gateway.">
      <div className="mb-5 flex justify-end">
        <Button onClick={() => setModalOpen(true)}>
          <Plus size={16} />
          Register API
        </Button>
      </div>

      {loading ? (
        <div className="flex h-48 items-center justify-center">
          <Loader size={32} />
        </div>
      ) : apis.length === 0 ? (
        <EmptyState
          icon={Network}
          title="No APIs registered yet"
          description="Register your first backend service — like a User Service or Payment Service — to start routing traffic through the gateway."
          action={
            <Button onClick={() => setModalOpen(true)}>
              <Plus size={16} /> Register your first API
            </Button>
          }
        />
      ) : (
        <div className="panel-interactive overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-ink-border text-left text-xs uppercase tracking-wider text-text-faint">
                <th className="px-5 py-3.5 font-medium">Name</th>
                <th className="px-5 py-3.5 font-medium">Base URL</th>
                <th className="px-5 py-3.5 font-medium">Status</th>
                <th className="px-5 py-3.5 font-medium">Health</th>
                <th className="px-5 py-3.5 font-medium">Last checked</th>
                <th className="px-5 py-3.5 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {apis.map((api) => (
                <tr key={api.id} className="border-b border-ink-border/60 last:border-0 transition-colors duration-150 hover:bg-ink-raised/50">
                  <td className="px-5 py-4">
                    <p className="font-medium text-text-primary">{api.name}</p>
                    {api.description && <p className="mt-0.5 text-xs text-text-faint">{api.description}</p>}
                  </td>
                  <td className="px-5 py-4">
                    <a
                      href={api.baseUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1 font-mono text-xs text-text-muted hover:text-signal"
                    >
                      {api.baseUrl} <ExternalLink size={11} />
                    </a>
                  </td>
                  <td className="px-5 py-4">
                    <StatusPill status={api.active ? 'active' : 'inactive'} />
                  </td>
                  <td className="px-5 py-4">
                    <StatusPill status={api.healthy ? 'healthy' : 'down'} />
                  </td>
                  <td className="px-5 py-4 text-xs text-text-faint">{timeAgo(api.lastCheckedAt)}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleToggle(api.id)}
                        title={api.active ? 'Disable' : 'Enable'}
                        className="rounded-lg p-2 text-text-muted transition-all duration-150 hover:scale-110 hover:bg-ink-raised hover:text-alert"
                      >
                        <Power size={15} />
                      </button>
                      <button
                        onClick={() => handleDelete(api.id, api.name)}
                        title="Remove"
                        className="rounded-lg p-2 text-text-muted transition-all duration-150 hover:scale-110 hover:bg-ink-raised hover:text-danger"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Register a new API">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label-text">Name</label>
            <input
              className="input-field"
              placeholder="e.g. payment-service"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
              autoFocus
            />
          </div>
          <div>
            <label className="label-text">Base URL</label>
            <input
              className="input-field font-mono text-xs"
              placeholder="https://payments.internal.company.com"
              value={form.baseUrl}
              onChange={(e) => setForm({ ...form, baseUrl: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="label-text">Description (optional)</label>
            <input
              className="input-field"
              placeholder="Handles checkout and refunds"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>
          <Button type="submit" disabled={submitting} className="w-full">
            {submitting ? 'Registering…' : 'Register API'}
          </Button>
        </form>
      </Modal>
    </AppShell>
  );
}
