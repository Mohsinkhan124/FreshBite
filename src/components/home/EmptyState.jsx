export default function EmptyState({ icon: Icon, title, description }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-3xl border border-dashed border-cream-300 bg-cream-50 py-16 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-cream-200 text-ink-400">
        <Icon className="h-6 w-6" strokeWidth={1.6} />
      </div>
      <h3 className="text-base font-semibold text-ink-900">{title}</h3>
      <p className="max-w-sm text-sm text-ink-500">{description}</p>
    </div>
  );
}
