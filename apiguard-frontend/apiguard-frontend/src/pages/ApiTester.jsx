import { useState } from 'react';
import { Send, Terminal, Clock } from 'lucide-react';
import AppShell from '../components/layout/AppShell';
import Button from '../components/ui/Button';
import StatusCode from '../components/ui/StatusCode';
import { callGateway } from '../api/gateway';

const METHODS = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'];

export default function ApiTester() {
  const [apiName, setApiName] = useState('');
  const [path, setPath] = useState('/');
  const [method, setMethod] = useState('GET');
  const [apiKey, setApiKey] = useState('');
  const [body, setBody] = useState('');
  const [sending, setSending] = useState(false);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState('');

  const handleSend = async (e) => {
    e.preventDefault();
    setError('');
    setSending(true);
    setResponse(null);

    const startedAt = performance.now();
    try {
      let parsedBody;
      if (body.trim() && method !== 'GET') {
        try {
          parsedBody = JSON.parse(body);
        } catch {
          setError('Request body is not valid JSON');
          setSending(false);
          return;
        }
      }

      const res = await callGateway({ apiName, path, method, apiKey, body: parsedBody });
      const elapsed = Math.round(performance.now() - startedAt);
      setResponse({ status: res.status, data: res.data, elapsed });
    } catch (err) {
      setError('Request failed — check the console and that your gateway URL is reachable.');
    } finally {
      setSending(false);
    }
  };

  return (
    <AppShell title="API Tester" subtitle="Send a request through the gateway using one of your API keys.">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Request builder */}
        <div className="panel-interactive gradient-border p-5">
          <div className="mb-4 flex items-center gap-2">
            <Terminal size={16} className="text-signal" />
            <h3 className="text-sm font-semibold text-text-primary">Request</h3>
          </div>

          <form onSubmit={handleSend} className="space-y-4">
            <div className="flex gap-2">
              <select
                value={method}
                onChange={(e) => setMethod(e.target.value)}
                className="input-field w-28 font-mono font-semibold"
              >
                {METHODS.map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
              <input
                className="input-field font-mono text-xs"
                placeholder="registered-api-name"
                value={apiName}
                onChange={(e) => setApiName(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="label-text">Path</label>
              <input
                className="input-field font-mono text-xs"
                placeholder="/users/42"
                value={path}
                onChange={(e) => setPath(e.target.value)}
              />
            </div>

            <div>
              <label className="label-text">X-API-KEY</label>
              <input
                className="input-field font-mono text-xs"
                placeholder="ak_xxxxxxxxxxxxxxxxxxxx"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                required
              />
            </div>

            {method !== 'GET' && (
              <div>
                <label className="label-text">Body (JSON)</label>
                <textarea
                  className="input-field h-32 resize-none font-mono text-xs"
                  placeholder={'{\n  "key": "value"\n}'}
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                />
              </div>
            )}

            {error && <p className="text-xs text-danger">{error}</p>}

            <Button type="submit" disabled={sending} className="w-full">
              {sending ? 'Sending…' : 'Send request'}
              {!sending && <Send size={14} />}
            </Button>
          </form>
        </div>

        {/* Response viewer */}
        <div className="panel-interactive gradient-border p-5">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-text-primary">Response</h3>
            {response && (
              <div className="flex items-center gap-3">
                <StatusCode code={response.status} />
                <span className="flex items-center gap-1 text-xs text-text-faint">
                  <Clock size={12} /> {response.elapsed}ms
                </span>
              </div>
            )}
          </div>

          {response ? (
            <pre className="max-h-[420px] overflow-auto rounded-lg bg-ink p-4 font-mono text-xs leading-relaxed text-text-primary">
              {typeof response.data === 'string' ? response.data : JSON.stringify(response.data, null, 2)}
            </pre>
          ) : (
            <div className="flex h-64 flex-col items-center justify-center text-center text-text-faint">
              <Terminal size={22} className="mb-3" />
              <p className="text-sm">Send a request to see the response here</p>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
