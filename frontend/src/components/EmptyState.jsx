function EmptyState({ icon: Icon, title, body, action }) {
  return (
    <div className="text-center py-16 border border-dashed border-line rounded-xl">
      <div className="w-12 h-12 rounded-full bg-surface-high border border-line flex items-center justify-center mx-auto mb-4">
        <Icon size={20} className="text-muted" />
      </div>
      <h3 className="text-ink-text font-medium mb-1">{title}</h3>
      <p className="text-muted text-sm max-w-xs mx-auto">{body}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export default EmptyState;