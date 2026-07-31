/**
 * Gradient dual-ring loader — used for all async page/section loading
 * states so the "in progress" moment feels as polished as the loaded one.
 */
export default function Loader({ size = 32, className = '' }) {
  return (
    <div
      className={`relative ${className}`}
      style={{ width: size, height: size }}
      role="status"
      aria-label="Loading"
    >
      <div className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-signal border-r-flux" />
      <div className="absolute inset-1 animate-spin rounded-full border-2 border-transparent border-b-signal/40" style={{ animationDirection: 'reverse', animationDuration: '1.2s' }} />
    </div>
  );
}
