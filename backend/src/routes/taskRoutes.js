const express = require('express');
const { body, param, query } = require('express-validator');
const {
  listTasks,
  taskStats,
  getTask,
  createTask,
  updateTask,
  toggleTask,
  deleteTask,
} = require('../controllers/taskController');
const { protect } = require('../middleware/auth');
const validate = require('../middleware/validate');

const router = express.Router();

router.use(protect);

/**
 * @openapi
 * tags:
 *   - name: Tasks
 *     description: Authenticated task CRUD operations
 */

/**
 * @openapi
 * /api/tasks:
 *   get:
 *     tags: [Tasks]
 *     summary: List tasks for the current user
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: query
 *         name: status
 *         schema: { type: string, enum: [pending, completed] }
 *       - in: query
 *         name: priority
 *         schema: { type: string, enum: [low, medium, high] }
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *         description: Case-insensitive search across title and description
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 10, maximum: 100 }
 *       - in: query
 *         name: sort
 *         schema: { type: string, enum: [createdAt, updatedAt, dueDate, priority, title] }
 *       - in: query
 *         name: order
 *         schema: { type: string, enum: [asc, desc] }
 *     responses:
 *       200: { description: Paginated task list }
 */
router.get(
  '/',
  [
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 100 }),
  ],
  validate,
  listTasks
);

/**
 * @openapi
 * /api/tasks/stats:
 *   get:
 *     tags: [Tasks]
 *     summary: Get task counts grouped by status
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Stats object with total, completed, pending }
 */
router.get('/stats', taskStats);

/**
 * @openapi
 * /api/tasks/{id}:
 *   get:
 *     tags: [Tasks]
 *     summary: Get a single task by id
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Task }
 *       404: { description: Not found }
 */
router.get(
  '/:id',
  [param('id').isMongoId().withMessage('Invalid task id')],
  validate,
  getTask
);

/**
 * @openapi
 * /api/tasks:
 *   post:
 *     tags: [Tasks]
 *     summary: Create a new task
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title]
 *             properties:
 *               title: { type: string, maxLength: 120 }
 *               description: { type: string, maxLength: 2000 }
 *               status: { type: string, enum: [pending, completed] }
 *               priority: { type: string, enum: [low, medium, high] }
 *               dueDate: { type: string, format: date-time, nullable: true }
 *     responses:
 *       201: { description: Created task }
 *       400: { description: Validation error }
 */
router.post(
  '/',
  [
    body('title').trim().notEmpty().withMessage('Title is required').isLength({ max: 120 }),
    body('description').optional().isLength({ max: 2000 }),
    body('status').optional().isIn(['pending', 'completed']),
    body('priority').optional().isIn(['low', 'medium', 'high']),
    body('dueDate').optional({ nullable: true }).isISO8601().toDate(),
  ],
  validate,
  createTask
);

/**
 * @openapi
 * /api/tasks/{id}:
 *   put:
 *     tags: [Tasks]
 *     summary: Update a task
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title: { type: string }
 *               description: { type: string }
 *               status: { type: string, enum: [pending, completed] }
 *               priority: { type: string, enum: [low, medium, high] }
 *               dueDate: { type: string, format: date-time, nullable: true }
 *     responses:
 *       200: { description: Updated task }
 *       404: { description: Not found }
 */
router.put(
  '/:id',
  [
    param('id').isMongoId().withMessage('Invalid task id'),
    body('title').optional().trim().notEmpty().isLength({ max: 120 }),
    body('description').optional().isLength({ max: 2000 }),
    body('status').optional().isIn(['pending', 'completed']),
    body('priority').optional().isIn(['low', 'medium', 'high']),
    body('dueDate').optional({ nullable: true }).custom((v) => v === null || v === '' || !isNaN(Date.parse(v))),
  ],
  validate,
  updateTask
);

/**
 * @openapi
 * /api/tasks/{id}/toggle:
 *   patch:
 *     tags: [Tasks]
 *     summary: Toggle a task between pending and completed
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Updated task }
 */
router.patch(
  '/:id/toggle',
  [param('id').isMongoId().withMessage('Invalid task id')],
  validate,
  toggleTask
);

/**
 * @openapi
 * /api/tasks/{id}:
 *   delete:
 *     tags: [Tasks]
 *     summary: Delete a task
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Deletion confirmation }
 *       404: { description: Not found }
 */
router.delete(
  '/:id',
  [param('id').isMongoId().withMessage('Invalid task id')],
  validate,
  deleteTask
);

module.exports = router;
