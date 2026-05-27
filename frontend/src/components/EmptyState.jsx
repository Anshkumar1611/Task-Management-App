const EmptyState = ({ title, description, action }) => (
  <div className="card flex flex-col items-center justify-center gap-3 px-6 py-12 text-center">
    <div className="grid h-12 w-12 place-items-center rounded-full bg-brand-50 text-brand-600 dark:bg-brand-900/30 dark:text-brand-400">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        className="h-6 w-6">
        <path d="M9 11l3 3L22 4" />
        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
      </svg>
    </div>
    <h3 className="text-base font-semibold">{title}</h3>
    {description && <p className="max-w-sm text-sm text-slate-500 dark:text-slate-400">{description}</p>}
    {action}
  </div>
);

export default EmptyState;
