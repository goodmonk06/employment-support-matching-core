import { FastifyInstance } from 'fastify';
import { store } from '../store/InMemoryStore';
import { MatchingRequestSchema } from '../schemas/matching.schema';
import { matchUsersToTasks } from '../../src/matcher';

export async function matchingRoutes(fastify: FastifyInstance) {
  // Execute matching
  fastify.post('/matching', async (request, reply) => {
    const data = MatchingRequestSchema.parse(request.body);

    // Get users (all or filtered by IDs)
    let users = store.getAllUsers();
    if (data.userIds && data.userIds.length > 0) {
      users = users.filter(u => data.userIds!.includes(u.id));
    }

    // Get tasks (all or filtered by IDs)
    let tasks = store.getAllTasks();
    if (data.taskIds && data.taskIds.length > 0) {
      tasks = tasks.filter(t => data.taskIds!.includes(t.id));
    }

    // Execute matching
    const matches = matchUsersToTasks(users, tasks, {
      minScore: data.minScore,
      maxMatchesPerUser: data.maxMatchesPerUser,
      sortByScore: data.sortByScore,
    });

    reply.send({
      totalMatches: matches.length,
      matches,
    });
  });

  // Get best tasks for a specific user
  fastify.get<{ Params: { userId: string }; Querystring: { limit?: string } }>(
    '/users/:userId/best-tasks',
    async (request, reply) => {
      const { userId } = request.params;
      const limit = request.query.limit ? parseInt(request.query.limit) : 5;

      const user = store.getUser(userId);
      if (!user) {
        reply.status(404).send({ error: `ユーザーが見つかりません: ${userId}` });
        return;
      }

      const tasks = store.getAllTasks();
      const matches = matchUsersToTasks([user], tasks, {
        maxMatchesPerUser: limit,
        sortByScore: true,
      });

      reply.send({
        userId,
        userName: user.name,
        recommendations: matches,
      });
    }
  );

  // Get best users for a specific task
  fastify.get<{ Params: { taskId: string }; Querystring: { limit?: string } }>(
    '/tasks/:taskId/best-users',
    async (request, reply) => {
      const { taskId } = request.params;
      const limit = request.query.limit ? parseInt(request.query.limit) : 5;

      const task = store.getTask(taskId);
      if (!task) {
        reply.status(404).send({ error: `タスクが見つかりません: ${taskId}` });
        return;
      }

      const users = store.getAllUsers();
      const matches = matchUsersToTasks(users, [task], {
        sortByScore: true,
      }).slice(0, limit);

      reply.send({
        taskId,
        taskTitle: task.title,
        recommendations: matches,
      });
    }
  );
}
