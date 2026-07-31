export default function StatusCode({ code }) {
  let className = 'text-signal bg-signal/10 ring-signal/20';
  if (code >= 400 && code < 500) className = 'text-alert bg-alert/10 ring-alert/20';
  if (code >= 500) className = 'text-danger bg-danger/10 ring-danger/20';

  return (
    <span className={`inline-block rounded-md px-2 py-0.5 font-mono text-xs font-semibold ring-1 transition-transform hover:scale-105 ${className}`}>
      {code}
    </span>
  );
}
