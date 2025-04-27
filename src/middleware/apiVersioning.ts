import { Request, Response, NextFunction } from 'express';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

// API version configuration
const API_VERSIONS = {
  'v1': {
    path: '/api/v1',
    status: 'active',
    deprecated: false,
    sunsetDate: null,
  },
  'v2': {
    path: '/api/v2',
    status: 'beta',
    deprecated: false,
    sunsetDate: null,
  },
};

// OpenAPI/Swagger configuration
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'E-Eats API',
      version: '1.0.0',
      description: 'API documentation for E-Eats platform',
    },
    servers: [
      {
        url: '/api/v1',
        description: 'Version 1 API',
      },
      {
        url: '/api/v2',
        description: 'Version 2 API (Beta)',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: ['./src/routes/*.ts'], // Path to the API routes
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

// API version middleware
export function apiVersioning(req: Request, res: Response, next: NextFunction) {
  const version = req.path.split('/')[2]; // Extract version from path
  
  if (!version || !API_VERSIONS[version]) {
    return res.status(400).json({
      error: 'Invalid API version',
      availableVersions: Object.keys(API_VERSIONS),
    });
  }

  const apiVersion = API_VERSIONS[version];
  
  // Check if API version is deprecated
  if (apiVersion.deprecated) {
    res.set('Warning', `299 - "This API version is deprecated. Please upgrade to a newer version."`);
    
    if (apiVersion.sunsetDate) {
      res.set('Sunset', new Date(apiVersion.sunsetDate).toUTCString());
    }
  }

  // Add version info to request
  req.apiVersion = {
    version,
    ...apiVersion,
  };

  next();
}

// Swagger documentation middleware
export function swaggerDocs(app: any) {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  
  // API version information endpoint
  app.get('/api/versions', (req: Request, res: Response) => {
    res.json({
      versions: API_VERSIONS,
      currentVersion: 'v1',
      latestVersion: 'v2',
    });
  });
}

// Example usage in Express app:
/*
import express from 'express';
import { apiVersioning, swaggerDocs } from './middleware/apiVersioning';

const app = express();

// Apply API versioning middleware
app.use('/api/:version', apiVersioning);

// Setup Swagger documentation
swaggerDocs(app);

// Versioned routes
app.use('/api/v1', v1Routes);
app.use('/api/v2', v2Routes);
*/ 