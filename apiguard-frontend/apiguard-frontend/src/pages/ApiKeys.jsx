import { useEffect, useState } from 'react';
import { Plus, Trash2, KeyRound } from 'lucide-react';
import AppShell from '../components/layout/AppShell';
import Modal from '../components/ui/Modal';
import Button from '../components/ui/Button';
import StatusPill from '../components/ui/StatusPill';
import CopyableKey from '../components/ui/CopyableKey';
import EmptyState from '../components/ui/EmptyState';
import Loader from '../components/ui/Loader';
import { useToast } from '../components/ui/Toast';
import { listMyKeys, generateKey, revokeKey } from '../api/keys';
import { timeAgo, formatNumber } from '../utils/formatters';

const PLAN_INFO = {
  FREE: { label: 'Free', limit: '100 req / day', className: 'border-ink-border' },
  PREMIUM: { label: 'Premium', limit: '10,000 req / day', className: 'border-signal/40' },
};

export default function ApiKeys() {
  const { showToast } = useToast();
  const [keys, setKeys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [planType, setPlanType] = useState('FREE');

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await listMyKeys();
      setKeys(data);
    } catch {
      showToast('Could not load API keys', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleGenerate = async () => {
    setSubmitting(true);
    try {
      await generateKey({ planType });
      showToast('New API key generated');
      setModalOpen(false);
      load();
    } catch (err) {
      showToast(err.response?.data?.message || 'Could not generate key', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleRevoke = async (id) => {
    if (!confirm('Revoke this API key? Any application using it will immediately lose access.')) return;
    try {
      await revokeKey(id);
      showToast('API key revoked');
      load();
    } catch {
      showToast('Could not revoke key', 'error');
    }
  };

  return (
    <AppShell title="API Keys" subtitle="Generate keys to authenticate requests through the gateway.">
      <div className="mb-5 flex justify-end">
        <Button onClick={() => setModalOpen(true)}>
          <Plus size={16} />
          Generate key
        </Button>
      </div>

      {loading ? (
        <div className="flex h-48 items-center justify-center">
          <Loader size={32} />
        </div>
      ) : keys.length === 0 ? (
        <EmptyState
          icon={KeyRound}
          title="No API keys yet"
          description="Generate a key to start calling registered APIs through the gateway."
          action={
            <Button onClick={() => setModalOpen(true)}>
              <Plus size={16} /> Generate your first key
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {keys.map((key) => {
            const plan = PLAN_INFO[key.planType] || PLAN_INFO.FREE;
            return (
              <div key={key.id} className={`panel-interactive border p-5 ${plan.className}`}>
                <div className="mb-3 flex items-start justify-between">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider text-text-muted">{plan.label} plan</p>
                    <p className="mt-0.5 text-xs text-text-faint">{plan.limit}</p>
                  </div>
                  <StatusPill status={key.active ? 'active' : 'revoked'} />
                </div>

                <CopyableKey value={key.keyValue} />

                <div className="mt-4 flex items-center justify-between border-t border-ink-border pt-3">
                  <p className="text-xs text-text-faint">Created {timeAgo(key.createdAt)}</p>
                  {key.active && (
                    <button
                      onClick={() => handleRevoke(key.id)}
                      className="flex items-center gap-1 text-xs font-medium text-danger hover:underline"
                    >
                      <Trash2 size={12} /> Revoke
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Generate a new API key">
        <div className="space-y-4">
          <div>
            <label className="label-text">Plan</label>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(PLAN_INFO).map(([key, info]) => (
                <button
                  key={key}
                  onClick={() => setPlanType(key)}
                  className={`rounded-lg border px-3 py-3 text-left transition-colors ${
                    planType === key ? 'border-signal/50 bg-signal/10' : 'border-ink-border bg-ink hover:border-ink-border'
                  }`}
                >
                  <p className={`text-sm font-semibold ${planType === key ? 'text-signal' : 'text-text-primary'}`}>{info.label}</p>
                  <p className="mt-0.5 text-xs text-text-faint">{info.limit}</p>
                </button>
              ))}
            </div>
          </div>
          <Button onClick={handleGenerate} disabled={submitting} className="w-full">
            {submitting ? 'Generating…' : 'Generate key'}
          </Button>
        </div>
      </Modal>
    </AppShell>
  );
}
