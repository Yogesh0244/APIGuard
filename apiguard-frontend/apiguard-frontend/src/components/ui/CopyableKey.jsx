import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

export default function CopyableKey({ value }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <button
      onClick={handleCopy}
      className="group inline-flex max-w-full items-center gap-2 rounded-lg border border-ink-border bg-ink px-3 py-1.5 font-mono text-xs text-text-primary transition-colors hover:border-signal/40"
      title="Click to copy"
    >
      <span className="truncate">{value}</span>
      {copied ? (
        <Check size={13} className="shrink-0 text-signal" />
      ) : (
        <Copy size={13} className="shrink-0 text-text-faint group-hover:text-signal" />
      )}
    </button>
  );
}
