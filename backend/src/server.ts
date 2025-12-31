import express, { Application } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import authRoutes from './routes/auth.routes';
import subscriptionRoutes from './routes/subscription.routes';
import analyticsRoutes from './routes/analytics.routes';
import notificationRoutes from './routes/notification.routes';
import categoryRoutes from './routes/category.routes';
import paymentMethodRoutes from './routes/paymentMethod.routes';
import { errorHandler } from './middleware/errorHandler';
import { setupCronJobs } from './cron/scheduler';

// Load environment variables
dotenv.config();

// Initialize Prisma Client
export const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

// Initialize Express app
const app: Application = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// API Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/subscriptions', subscriptionRoutes);
app.use('/api/v1/analytics', analyticsRoutes);
app.use('/api/v1/notifications', notificationRoutes);
app.use('/api/v1/categories', categoryRoutes);
app.use('/api/v1/payment-methods', paymentMethodRoutes);

// Error handling middleware (must be last)
app.use(errorHandler);

// Start server
const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 API Base URL: http://localhost:${PORT}/api/v1`);

  // Setup cron jobs if enabled
  if (process.env.ENABLE_CRON === 'true') {
    setupCronJobs();
    console.log('⏰ Cron jobs initialized');
  }
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('👋 SIGTERM signal received: closing HTTP server');
  server.close(async () => {
    console.log('🔌 HTTP server closed');
    await prisma.$disconnect();
    console.log('💾 Database connection closed');
    process.exit(0);
  });
});

process.on('SIGINT', async () => {
  console.log('👋 SIGINT signal received: closing HTTP server');
  server.close(async () => {
    console.log('🔌 HTTP server closed');
    await prisma.$disconnect();
    console.log('💾 Database connection closed');
    process.exit(0);
  });
});

export default app;
