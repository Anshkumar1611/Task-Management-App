import { useEffect, useState } from 'react';
import { validateTask } from '../utils/validators';

const emptyForm = {
  title: '',
  description: '',
  status: 'pending',
  priority: 'medium',
  dueDate: '',
};

const toInputDate = (value) => {
  if (!value) return '';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '';
  return d.toISOString().slice(0, 10);
};

const TaskForm = ({ initialValues, onSubmit, onCancel, submitting }) => {
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialValues) {
      setForm({
        title: initialValues.title || '',
        description: initialValues.description || '',
        status: initialValues.status || 'pending',
        priority: initialValues.priority || 'medium',
        dueDate: toInputDate(initialValues.dueDate),
      });
    } else {
      setForm(emptyForm);
    }
    setErrors({});
  }, [initialValues]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validation = validateTask(form);
    setErrors(validation);
    if (Object.keys(validation).length) return;
    const payload = {
      title: form.title.trim(),
      description: form.description.trim(),
      status: form.status,
      priority: form.priority,
      dueDate: form.dueDate ? new Date(form.dueDate).toISOString() : null,
    };
    onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="title" className="label">Title</label>
        <input
          id="title"
          name="title"
          type="text"
          value={form.title}
          onChange={handleChange}
          placeholder="What needs to be done?"
          className="input"
          autoFocus
          maxLength={120}
        />
        {errors.title && <p className="mt-1 text-xs text-red-500">{errors.title}</p>}
      </div>
      <div>
        <label htmlFor="description" className="label">Description</label>
        <textarea
          id="description"
          name="description"
          value={form.description}
          onChange={handleChange}
          rows={3}
          placeholder="Optional details"
          className="input resize-none"
          maxLength={2000}
        />
        {errors.description && <p className="mt-1 text-xs text-red-500">{errors.description}</p>}
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div>
          <label htmlFor="status" className="label">Status</label>
          <select id="status" name="status" value={form.status} onChange={handleChange} className="input">
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
          </select>
        </div>
        <div>
          <label htmlFor="priority" className="label">Priority</label>
          <select id="priority" name="priority" value={form.priority} onChange={handleChange} className="input">
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
        <div>
          <label htmlFor="dueDate" className="label">Due date</label>
          <input
            id="dueDate"
            name="dueDate"
            type="date"
            value={form.dueDate}
            onChange={handleChange}
            className="input"
          />
        </div>
      </div>
      <div className="flex items-center justify-end gap-2 pt-2">
        <button type="button" onClick={onCancel} className="btn-secondary" disabled={submitting}>
          Cancel
        </button>
        <button type="submit" className="btn-primary" disabled={submitting}>
          {submitting ? 'Saving…' : initialValues ? 'Update task' : 'Create task'}
        </button>
      </div>
    </form>
  );
};

export default TaskForm;
