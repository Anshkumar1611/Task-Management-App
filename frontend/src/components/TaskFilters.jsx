import { useEffect, useState } from 'react';

const filters = [
  { key: 'all', label: 'All' },
  { key: 'pending', label: 'Pending' },
  { key: 'completed', label: 'Completed' },
];

const TaskFilters = ({ filter, onFilterChange, search, onSearchChange, onCreate }) => {
  const [localSearch, setLocalSearch] = useState(search || '');

  useEffect(() => {
    setLocalSearch(search || '');
  }, [search]);

  useEffect(() => {
    const handle = setTimeout(() => {
      if (localSearch !== search) onSearchChange(localSearch);
    }, 350);
    return () => clearTimeout(handle);
  }, [localSearch, search, onSearchChange]);

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative w-full sm:max-w-xs">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="search"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            placeholder="Search tasks…"
            className="input pl-9"
          />
        </div>

        <div className="inline-flex rounded-lg border border-slate-200 bg-white p-1 dark:border-slate-800 dark:bg-slate-900">
          {filters.map((f) => (
            <button
              key={f.key}
              type="button"
              onClick={() => onFilterChange(f.key)}
              className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                filter === f.key
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <button type="button" onClick={onCreate} className="btn-primary">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
          className="h-4 w-4">
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
        New task
      </button>
    </div>
  );
};

export default TaskFilters;
