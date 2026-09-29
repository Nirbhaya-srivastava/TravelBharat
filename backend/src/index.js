import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { config, connectDB } from './config/index.js';
import apiRoutes from './routes/index.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import { seedLiveDatabaseIfEmpty } from './models/dataStore.js';

export const createApp = async () => {
  const app = express();

  // Security Headers
  app.use(
    helmet({
      contentSecurityPolicy: false, // Allows Unsplash images and fonts in iframes
      crossOriginEmbedderPolicy: false,
    })
  );

  // CORS Configuration
  const allowedOrigins = [
    config.frontendUrl,
    'http://localhost:3000',
    'http://localhost:5173',
    'http://127.0.0.1:3000',
  ];

  app.use(
    cors({
      origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps or curl) or if origin is allowed
        if (!origin || allowedOrigins.includes(origin) || origin.endsWith('.run.app')) {
          callback(null, true);
        } else {
          callback(null, true); // Permissive for preview environments
        }
      },
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    })
  );

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Mount API
  app.use('/api', apiRoutes);

  // Initialize DB connection in background
  connectDB().then((connected) => {
    if (connected) {
      seedLiveDatabaseIfEmpty();
    }
  });

  return app;
};

// Start standalone server if run directly
if (process.argv[1] && process.argv[1].endsWith('backend/src/index.js')) {
  createApp().then((app) => {
    app.use(notFound);
    app.use(errorHandler);
    const PORT = config.port || 3000;
    app.listen(PORT, () => {
      console.log(`🚀 [Server] TravelBharat API server running on port ${PORT}`);
    });
  });
}
