import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Todo API',
      version: '1.0.0',
      description: 'A simple Todo API with JWT authentication',
      contact: {
        name: 'API Support',
        email: 'support@example.com'
      }
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'User ID'
            },
            username: {
              type: 'string',
              description: 'Username'
            },
            password: {
              type: 'string',
              description:'Password'
            }
          }
        },
        Todo: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'Todo ID'
            },
            userId: {
              type: 'integer',
              description: 'User ID who owns the todo'
            },
            title: {
              type: 'string',
              description: 'Todo title'
            },
            completed: {
              type: 'boolean',
              description: 'Todo completion status'
            }
          }
        },
        RegisterRequest: {
          type: 'object',
          required: ['username', 'password'],
          properties: {
            username: {
              type: 'string',
              description: 'Username for registration'
            },
            password: {
              type: 'string',
              description: 'Password for registration'
            }
          }
        },
        LoginRequest: {
          type: 'object',
          required: ['username', 'password'],
          properties: {
            username: {
              type: 'string',
              description: 'Username for login'
            },
            password: {
              type: 'string',
              description: 'Password for login'
            }
          }
        },
        CreateTodoRequest: {
          type: 'object',
          required: ['title'],
          properties: {
            title: {
              type: 'string',
              description: 'Todo title'
            }
          }
        }
      }
    }
  },
  apis: ['./src/routes/*.js', './src/middleware/*.js']
};

export const specs = swaggerJsdoc(options);
