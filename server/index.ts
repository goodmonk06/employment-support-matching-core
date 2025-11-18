import Fastify from 'fastify';
import cors from '@fastify/cors';
import { userRoutes } from './routes/users';
import { taskRoutes } from './routes/tasks';
import { matchingRoutes } from './routes/matching';
import { errorHandler } from './utils/errorHandler';

const PORT = parseInt(process.env.PORT || '3000', 10);
const HOST = process.env.HOST || '0.0.0.0';

async function buildServer() {
  const fastify = Fastify({
    logger: {
      level: process.env.LOG_LEVEL || 'info',
    },
  });

  // Register CORS
  await fastify.register(cors, {
    origin: true,
  });

  // Health check
  fastify.get('/health', async () => {
    return { status: 'ok', timestamp: new Date().toISOString() };
  });

  // API routes
  await fastify.register(userRoutes, { prefix: '/api' });
  await fastify.register(taskRoutes, { prefix: '/api' });
  await fastify.register(matchingRoutes, { prefix: '/api' });

  // Error handler
  fastify.setErrorHandler(errorHandler);

  return fastify;
}

async function start() {
  const fastify = await buildServer();

  try {
    await fastify.listen({ port: PORT, host: HOST });
    console.log(`🚀 Server is running at http://${HOST}:${PORT}`);
    console.log(`📊 Health check: http://${HOST}:${PORT}/health`);
    console.log(`📚 API endpoints:`);
    console.log(`   - POST   /api/users`);
    console.log(`   - GET    /api/users`);
    console.log(`   - GET    /api/users/:id`);
    console.log(`   - PUT    /api/users/:id`);
    console.log(`   - DELETE /api/users/:id`);
    console.log(`   - POST   /api/tasks`);
    console.log(`   - GET    /api/tasks`);
    console.log(`   - GET    /api/tasks/:id`);
    console.log(`   - PUT    /api/tasks/:id`);
    console.log(`   - DELETE /api/tasks/:id`);
    console.log(`   - POST   /api/matching`);
    console.log(`   - GET    /api/users/:userId/best-tasks`);
    console.log(`   - GET    /api/tasks/:taskId/best-users`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
}

// Start server if this file is run directly
if (require.main === module) {
  start();
}

export { buildServer, start };
