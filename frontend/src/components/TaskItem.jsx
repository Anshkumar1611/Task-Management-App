const priorityStyles = {
  high: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',
  medium: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
  low: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
};

const formatDate = (value) => {
  if (!value) return null;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
};

const isOverdue = (task) => {
  if (!task.dueDate || task.status === 'completed') return false;
  return new Date(task.dueDate).getTime() < Date.now() - 24 * 60 * 60 * 1000;
};

const TaskItem = ({ task, onToggle, onEdit, onDelete, busy }) => {
  const completed = task.status === 'completed';
  const dueLabel = formatDate(task.dueDate);
  const overdue = isOverdue(task);

  return (
    <div className="card flex flex-col gap-3 p-4 sm:flex-row sm:items-start sm:gap-4">
      <button
        type="button"
        onClick={() => onToggle(task)}
        disabled={busy}
        aria-label={completed ? 'Mark as pending' : 'Mark as completed'}
        className={`mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full border-2 transition-colors ${
          completed
            ? 'border-emerald-500 bg-emerald-500 text-white'
            : 'border-slate-300 hover:border-brand-500 dark:border-slate-600'
        }`}
      >
        {completed && (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
            className="h-3.5 w-3.5">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        )}
      </button>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <h3
            className={`text-base font-semibold leading-tight ${
              completed ? 'text-slate-400 line-through dark:text-slate-500' : ''
            }`}
          >
            {task.title}
          </h3>
          <div className="flex flex-wrap items-center gap-1.5">
            <span className={`pill ${priorityStyles[task.priority] || priorityStyles.medium}`}>
              {task.priority}
            </span>
            {dueLabel && (
              <span
                className={`pill ${
                  overdue
                    ? 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300'
                    : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
                }`}
              >
                {overdue ? 'Overdue · ' : 'Due '}
                {dueLabel}
              </span>
            )}
          </div>
        </div>
        {task.description && (
          <p
            className={`mt-1 text-sm ${
              completed
                ? 'text-slate-400 line-through dark:text-slate-500'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            {task.description}
          </p>
        )}
        <div className="mt-3 flex items-center gap-2">
          <button
            type="button"
            onClick={() => onEdit(task)}
            className="text-xs font-medium text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300"
            disabled={busy}
          >
            Edit
          </button>
          <span className="text-slate-300 dark:text-slate-700">·</span>
          <button
            type="button"
            onClick={() => onDelete(task)}
            className="text-xs font-medium text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
            disabled={busy}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskItem;
