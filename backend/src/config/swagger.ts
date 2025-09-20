
export const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    title: 'Clinic Management System API',
    version: '1.0.0',
    description: 'API for managing clinic appointments, services, and schedules',
    contact: {
      name: 'API Support',
      email: 'support@clinic.com'
    }
  },
  servers: [
    {
      url: 'http://localhost:3000/api',
      description: 'Development server'
    },
    {
      url: 'https://api.clinic.com/v1',
      description: 'Production server'
    }
  ],
  security: [
    {
      bearerAuth: []
    }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'JWT Authorization header using the Bearer scheme.'
      }
    },
    schemas: {
      Error: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
            example: false
          },
          error: {
            type: 'string',
            description: 'Error message',
            example: 'Error description'
          }
        }
      },
      Doctor: {
        type: 'object',
        properties: {
          id: {
            type: 'integer',
            format: 'int64',
            example: 1
          },
          name: {
            type: 'string',
            example: 'Dr. John Doe'
          },
          specialization: {
            type: 'string',
            example: 'Cardiology'
          }
        }
      },
      TimeSlot: {
        type: 'object',
        properties: {
          starts: {
            type: 'string',
            format: 'date-time',
            description: 'Start time of the slot'
          },
          ends: {
            type: 'string',
            format: 'date-time',
            description: 'End time of the slot'
          },
          doctorName: {
            type: 'string',
            description: 'Name of the doctor'
          }
        }
      }
    },
    responses: {
      BadRequest: {
        description: 'Bad Request',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/Error'
            },
            example: {
              success: false,
              error: 'Invalid input data'
            }
          }
        }
      },
      Unauthorized: {
        description: 'Unauthorized',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/Error'
            },
            example: {
              success: false,
              error: 'Authentication required'
            }
          }
        }
      },
      NotFound: {
        description: 'Resource not found',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/Error'
            },
            example: {
              success: false,
              error: 'Resource not found'
            }
          }
        }
      },
      InternalServerError: {
        description: 'Internal Server Error',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/Error'
            },
            example: {
              success: false,
              error: 'An unexpected error occurred'
            }
          }
        }
      }
    }
  }
} as const;

// Export the OpenAPI document
export default swaggerDocument;
