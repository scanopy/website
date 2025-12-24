const methodStyles: Record<string, { bg: string; text: string }> = {
  GET: { bg: 'rgba(34, 197, 94, 0.15)', text: '#22c55e' },
  POST: { bg: 'rgba(59, 130, 246, 0.15)', text: '#3b82f6' },
  PUT: { bg: 'rgba(245, 158, 11, 0.15)', text: '#f59e0b' },
  PATCH: { bg: 'rgba(245, 158, 11, 0.15)', text: '#f59e0b' },
  DELETE: { bg: 'rgba(239, 68, 68, 0.15)', text: '#ef4444' },
};

export function MethodBadge({ method }: { method: string }) {
  const style = methodStyles[method] || methodStyles.GET;

  return (
    <span
      style={{
        color: style.text,
        backgroundColor: style.bg,
        fontWeight: 600,
        fontSize: '0.65rem',
        fontFamily: 'ui-monospace, monospace',
        padding: '0.125rem 0.375rem',
        borderRadius: '0.25rem',
        marginRight: '0.25rem',
        whiteSpace: 'nowrap',
        flexShrink: 0,
      }}
    >
      {method}
    </span>
  );
}

// Export individual method icons for the loader
export const GET = () => <MethodBadge method="GET" />;
export const POST = () => <MethodBadge method="POST" />;
export const PUT = () => <MethodBadge method="PUT" />;
export const PATCH = () => <MethodBadge method="PATCH" />;
export const DELETE = () => <MethodBadge method="DELETE" />;
