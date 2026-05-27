const cards = [
  { key: 'total', label: 'Total tasks', accent: 'text-brand-600 dark:text-brand-400' },
  { key: 'pending', label: 'Pending', accent: 'text-amber-600 dark:text-amber-400' },
  { key: 'completed', label: 'Completed', accent: 'text-emerald-600 dark:text-emerald-400' },
];

const StatsCards = ({ stats }) => {
  const values = stats || { total: 0, pending: 0, completed: 0 };
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
      {cards.map((c) => (
        <div key={c.key} className="card p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            {c.label}
          </p>
          <p className={`mt-1 text-3xl font-bold tabular-nums ${c.accent}`}>{values[c.key] ?? 0}</p>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;
