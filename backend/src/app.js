const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const swaggerUi = require('swagger-ui-express');

const swaggerSpec = require('./docs/swagger');
const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');
const { notFound, errorHandler } = require('./middleware/errorHandler');

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : '*',
    credentials: true,
  })
);
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

app.get('/', (req, res) => {
  res.json({
    name: 'Task Management API',
    version: '1.0.0',
    docs: '/api-docs',
    health: '/api/health',
  });
});

app.get('/api/health', (req, res) => {
  res.json({ success: true, status: 'ok', uptime: process.uptime() });
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, { explorer: true }));
app.get('/api-docs.json', (req, res) => res.json(swaggerSpec));

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
