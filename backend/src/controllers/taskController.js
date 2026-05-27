const asyncHandler = require('express-async-handler');
const Task = require('../models/Task');

const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// GET /api/tasks?status=&search=&page=&limit=&sort=
const listTasks = asyncHandler(async (req, res) => {
  const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
  const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 10, 1), 100);
  const skip = (page - 1) * limit;

  const filter = { user: req.user._id };

  if (req.query.status && ['pending', 'completed'].includes(req.query.status)) {
    filter.status = req.query.status;
  }

  if (req.query.priority && ['low', 'medium', 'high'].includes(req.query.priority)) {
    filter.priority = req.query.priority;
  }

  if (req.query.search && req.query.search.trim()) {
    const regex = new RegExp(escapeRegex(req.query.search.trim()), 'i');
    filter.$or = [{ title: regex }, { description: regex }];
  }

  const sortField = ['createdAt', 'updatedAt', 'dueDate', 'priority', 'title'].includes(req.query.sort)
    ? req.query.sort
    : 'createdAt';
  const sortOrder = req.query.order === 'asc' ? 1 : -1;

  const [items, total] = await Promise.all([
    Task.find(filter).sort({ [sortField]: sortOrder }).skip(skip).limit(limit),
    Task.countDocuments(filter),
  ]);

  res.json({
    success: true,
    data: items,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.max(Math.ceil(total / limit), 1),
      hasNext: skip + items.length < total,
      hasPrev: page > 1,
    },
  });
});

// GET /api/tasks/stats
const taskStats = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const [total, completed, pending] = await Promise.all([
    Task.countDocuments({ user: userId }),
    Task.countDocuments({ user: userId, status: 'completed' }),
    Task.countDocuments({ user: userId, status: 'pending' }),
  ]);
  res.json({ success: true, data: { total, completed, pending } });
});

// GET /api/tasks/:id
const getTask = asyncHandler(async (req, res) => {
  const task = await Task.findOne({ _id: req.params.id, user: req.user._id });
  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }
  res.json({ success: true, data: task });
});

// POST /api/tasks
const createTask = asyncHandler(async (req, res) => {
  const { title, description, status, priority, dueDate } = req.body;
  const task = await Task.create({
    user: req.user._id,
    title,
    description,
    status,
    priority,
    dueDate: dueDate || null,
  });
  res.status(201).json({ success: true, data: task });
});

// PUT /api/tasks/:id
const updateTask = asyncHandler(async (req, res) => {
  const task = await Task.findOne({ _id: req.params.id, user: req.user._id });
  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }

  const updatable = ['title', 'description', 'status', 'priority', 'dueDate'];
  for (const key of updatable) {
    if (req.body[key] !== undefined) {
      task[key] = req.body[key] === '' && key === 'dueDate' ? null : req.body[key];
    }
  }

  await task.save();
  res.json({ success: true, data: task });
});

// PATCH /api/tasks/:id/toggle
const toggleTask = asyncHandler(async (req, res) => {
  const task = await Task.findOne({ _id: req.params.id, user: req.user._id });
  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }
  task.status = task.status === 'completed' ? 'pending' : 'completed';
  await task.save();
  res.json({ success: true, data: task });
});

// DELETE /api/tasks/:id
const deleteTask = asyncHandler(async (req, res) => {
  const result = await Task.deleteOne({ _id: req.params.id, user: req.user._id });
  if (result.deletedCount === 0) {
    res.status(404);
    throw new Error('Task not found');
  }
  res.json({ success: true, message: 'Task deleted' });
});

module.exports = {
  listTasks,
  taskStats,
  getTask,
  createTask,
  updateTask,
  toggleTask,
  deleteTask,
};
