const statusStyles: Record<string, { bg: string; text: string }> = {
  'Awaiting Connection': { bg: 'rgba(59, 130, 246, 0.15)', text: '#3b82f6' },
  Standby: { bg: 'rgba(168, 85, 247, 0.15)', text: '#a855f7' },
  Unreachable: { bg: 'rgba(239, 68, 68, 0.15)', text: '#ef4444' },
  Deprecated: { bg: 'rgba(249, 115, 22, 0.15)', text: '#f97316' },
  Unsupported: { bg: 'rgba(239, 68, 68, 0.15)', text: '#ef4444' },
  Outdated: { bg: 'rgba(245, 158, 11, 0.15)', text: '#f59e0b' },
  Unknown: { bg: 'rgba(107, 114, 128, 0.15)', text: '#6b7280' },
  Healthy: { bg: 'rgba(34, 197, 94, 0.15)', text: '#22c55e' },
};

export function StatusTag({ status }: { status: string }) {
  const style = statusStyles[status] || statusStyles.Healthy;

  return (
    <span
      style={{
        color: style.text,
        backgroundColor: style.bg,
        fontWeight: 600,
        fontSize: '0.75rem',
        padding: '0.125rem 0.375rem',
        borderRadius: '0.25rem',
        whiteSpace: 'nowrap',
      }}
    >
      {status}
    </span>
  );
}
