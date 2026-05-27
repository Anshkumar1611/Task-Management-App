import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';

import EmptyState from '../components/EmptyState';
import Modal from '../components/Modal';
import Pagination from '../components/Pagination';
import StatsCards from '../components/StatsCards';
import TaskFilters from '../components/TaskFilters';
import TaskForm from '../components/TaskForm';
import TaskItem from '../components/TaskItem';

import { useAuth } from '../context/AuthContext';
import { extractError, taskApi } from '../services/api';

const PAGE_SIZE = 8;

const Dashboard = () => {
  const { user } = useAuth();

  const [tasks, setTasks] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [stats, setStats] = useState(null);

  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [confirmDelete, setConfirmDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const loadStats = useCallback(async () => {
    try {
      const data = await taskApi.stats();
      setStats(data);
    } catch {
      // silently ignore — stats are non-critical
    }
  }, []);

  const loadTasks = useCallback(
    async ({ showSpinner = true } = {}) => {
      if (showSpinner) setLoading(true);
      try {
        const params = { page, limit: PAGE_SIZE, sort: 'createdAt', order: 'desc' };
        if (filter !== 'all') params.status = filter;
        if (search.trim()) params.search = search.trim();

        const response = await taskApi.list(params);
        setTasks(response.data);
        setPagination(response.pagination);

        if (response.pagination && page > response.pagination.totalPages && response.pagination.totalPages >= 1) {
          setPage(response.pagination.totalPages);
        }
      } catch (err) {
        toast.error(extractError(err, 'Failed to load tasks'));
      } finally {
        if (showSpinner) setLoading(false);
      }
    },
    [filter, search, page]
  );

  useEffect(() => {
    loadTasks();
    loadStats();
  }, [loadTasks, loadStats]);

  const handleFilterChange = (next) => {
    setFilter(next);
    setPage(1);
  };

  const handleSearchChange = (next) => {
    setSearch(next);
    setPage(1);
  };

  const openCreate = () => {
    setEditing(null);
    setFormOpen(true);
  };

  const openEdit = (task) => {
    setEditing(task);
    setFormOpen(true);
  };

  const closeForm = () => {
    if (submitting) return;
    setFormOpen(false);
    setEditing(null);
  };

  const handleSubmit = async (payload) => {
    setSubmitting(true);
    try {
      if (editing) {
        await taskApi.update(editing._id, payload);
        toast.success('Task updated');
      } else {
        await taskApi.create(payload);
        toast.success('Task created');
      }
      setFormOpen(false);
      setEditing(null);
      await Promise.all([loadTasks({ showSpinner: false }), loadStats()]);
    } catch (err) {
      toast.error(extractError(err, 'Could not save task'));
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggle = async (task) => {
    setBusyId(task._id);
    const previousStatus = task.status;
    const optimistic = { ...task, status: task.status === 'completed' ? 'pending' : 'completed' };
    setTasks((prev) => prev.map((t) => (t._id === task._id ? optimistic : t)));
    try {
      await taskApi.toggle(task._id);
      await loadStats();
    } catch (err) {
      setTasks((prev) => prev.map((t) => (t._id === task._id ? { ...t, status: previousStatus } : t)));
      toast.error(extractError(err, 'Could not update task'));
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async () => {
    if (!confirmDelete) return;
    setDeleting(true);
    try {
      await taskApi.remove(confirmDelete._id);
      toast.success('Task deleted');
      setConfirmDelete(null);
      await Promise.all([loadTasks({ showSpinner: false }), loadStats()]);
    } catch (err) {
      toast.error(extractError(err, 'Could not delete task'));
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Hi {user?.name?.split(' ')[0] || 'there'}, here&apos;s your day
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Track everything you need to get done, in one place.
        </p>
      </div>

      <StatsCards stats={stats} />

      <TaskFilters
        filter={filter}
        onFilterChange={handleFilterChange}
        search={search}
        onSearchChange={handleSearchChange}
        onCreate={openCreate}
      />

      {loading ? (
        <div className="grid place-items-center py-16">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-brand-600" />
        </div>
      ) : tasks.length === 0 ? (
        <EmptyState
          title={search || filter !== 'all' ? 'No matching tasks' : 'No tasks yet'}
          description={
            search || filter !== 'all'
              ? 'Try adjusting your search or filter.'
              : 'Create your first task to start organizing your day.'
          }
          action={
            !search && filter === 'all' ? (
              <button type="button" onClick={openCreate} className="btn-primary mt-2">
                Create your first task
              </button>
            ) : null
          }
        />
      ) : (
        <div className="space-y-3">
          {tasks.map((task) => (
            <TaskItem
              key={task._id}
              task={task}
              busy={busyId === task._id}
              onToggle={handleToggle}
              onEdit={openEdit}
              onDelete={(t) => setConfirmDelete(t)}
            />
          ))}
        </div>
      )}

      <Pagination pagination={pagination} onPageChange={setPage} />

      <Modal
        open={formOpen}
        onClose={closeForm}
        title={editing ? 'Edit task' : 'Create task'}
        size="md"
      >
        <TaskForm
          initialValues={editing}
          onSubmit={handleSubmit}
          onCancel={closeForm}
          submitting={submitting}
        />
      </Modal>

      <Modal
        open={Boolean(confirmDelete)}
        onClose={() => !deleting && setConfirmDelete(null)}
        title="Delete task"
        size="sm"
        footer={
          <>
            <button
              type="button"
              className="btn-secondary"
              onClick={() => setConfirmDelete(null)}
              disabled={deleting}
            >
              Cancel
            </button>
            <button type="button" className="btn-danger" onClick={handleDelete} disabled={deleting}>
              {deleting ? 'Deleting…' : 'Delete'}
            </button>
          </>
        }
      >
        <p className="text-sm text-slate-600 dark:text-slate-300">
          Are you sure you want to delete{' '}
          <span className="font-semibold">&ldquo;{confirmDelete?.title}&rdquo;</span>? This action cannot be undone.
        </p>
      </Modal>
    </div>
  );
};

export default Dashboard;
