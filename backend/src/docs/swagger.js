const swaggerJSDoc = require('swagger-jsdoc');

const swaggerSpec = swaggerJSDoc({
  definition: {
    openapi: '3.0.3',
    info: {
      title: 'Task Management API',
      version: '1.0.0',
      description:
        'REST API for the Task Management application. All task endpoints require a Bearer JWT obtained via /api/auth/login.',
    },
    servers: [{ url: 'http://localhost:5000', description: 'Local development' }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        Task: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            user: { type: 'string' },
            title: { type: 'string' },
            description: { type: 'string' },
            status: { type: 'string', enum: ['pending', 'completed'] },
            priority: { type: 'string', enum: ['low', 'medium', 'high'] },
            dueDate: { type: 'string', format: 'date-time', nullable: true },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
      },
    },
  },
  apis: ['./src/routes/*.js'],
});

module.exports = swaggerSpec;
