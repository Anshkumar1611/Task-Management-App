const Pagination = ({ pagination, onPageChange }) => {
  if (!pagination || pagination.totalPages <= 1) return null;
  const { page, totalPages, hasNext, hasPrev, total, limit } = pagination;

  const start = (page - 1) * limit + 1;
  const end = Math.min(start + limit - 1, total);

  return (
    <div className="flex flex-col items-center justify-between gap-3 border-t border-slate-200 pt-4 dark:border-slate-800 sm:flex-row">
      <p className="text-xs text-slate-500 dark:text-slate-400">
        Showing <span className="font-medium text-slate-700 dark:text-slate-300">{start}</span>–
        <span className="font-medium text-slate-700 dark:text-slate-300">{end}</span> of{' '}
        <span className="font-medium text-slate-700 dark:text-slate-300">{total}</span>
      </p>
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => onPageChange(page - 1)}
          disabled={!hasPrev}
          className="btn-ghost px-2 py-1.5 text-xs"
        >
          ← Prev
        </button>
        <span className="px-3 text-xs font-medium text-slate-600 dark:text-slate-400">
          Page {page} of {totalPages}
        </span>
        <button
          type="button"
          onClick={() => onPageChange(page + 1)}
          disabled={!hasNext}
          className="btn-ghost px-2 py-1.5 text-xs"
        >
          Next →
        </button>
      </div>
    </div>
  );
};

export default Pagination;
