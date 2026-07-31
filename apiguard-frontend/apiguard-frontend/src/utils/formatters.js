export function formatNumber(n) {
  if (n === null || n === undefined) return '0';
  return new Intl.NumberFormat('en-US').format(n);
}

export function formatMs(ms) {
  if (!ms && ms !== 0) return '—';
  return `${Math.round(ms)} ms`;
}

export function formatPercent(part, total) {
  if (!total) return '0%';
  return `${((part / total) * 100).toFixed(1)}%`;
}

export function timeAgo(dateString) {
  if (!dateString) return '—';
  const date = new Date(dateString);
  const seconds = Math.floor((new Date() - date) / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}
