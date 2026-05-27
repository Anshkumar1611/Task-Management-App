const express = require('express');
const { body } = require('express-validator');
const { signup, login, me } = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const validate = require('../middleware/validate');

const router = express.Router();

/**
 * @openapi
 * tags:
 *   - name: Auth
 *     description: User signup, login, and profile
 */

/**
 * @openapi
 * /api/auth/signup:
 *   post:
 *     tags: [Auth]
 *     summary: Register a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, password]
 *             properties:
 *               name: { type: string, example: Jane Doe }
 *               email: { type: string, example: jane@example.com }
 *               password: { type: string, minLength: 6, example: secret123 }
 *     responses:
 *       201: { description: User created, returns JWT and user }
 *       400: { description: Validation error }
 *       409: { description: Email already registered }
 */
router.post(
  '/signup',
  [
    body('name').trim().isLength({ min: 2, max: 60 }).withMessage('Name must be 2-60 characters'),
    body('email').isEmail().withMessage('Valid email required').normalizeEmail(),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  ],
  validate,
  signup
);

/**
 * @openapi
 * /api/auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Authenticate and receive a JWT
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email: { type: string, example: jane@example.com }
 *               password: { type: string, example: secret123 }
 *     responses:
 *       200: { description: Authenticated, returns JWT and user }
 *       401: { description: Invalid credentials }
 */
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Valid email required').normalizeEmail(),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  validate,
  login
);

/**
 * @openapi
 * /api/auth/me:
 *   get:
 *     tags: [Auth]
 *     summary: Get the currently authenticated user
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200: { description: Returns current user profile }
 *       401: { description: Not authorized }
 */
router.get('/me', protect, me);

module.exports = router;
