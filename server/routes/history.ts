import { FastifyInstance } from 'fastify';
import { store } from '../store/InMemoryStore';
import { AppError } from '../utils/errorHandler';

/**
 * マッチング履歴API
 */
export async function historyRoutes(fastify: FastifyInstance) {
  // Get all match histories (with filtering)
  fastify.get<{
    Querystring: {
      userId?: string;
      taskId?: string;
      organizationId?: string;
      status?: string;
    };
  }>('/history', async (request, reply) => {
    const { userId, taskId, organizationId, status } = request.query;

    const histories = store.getAllMatchHistories({
      userId,
      taskId,
      organizationId,
      status: status as any,
    });

    reply.send({
      total: histories.length,
      histories,
    });
  });

  // Get specific match history
  fastify.get<{ Params: { id: string } }>('/history/:id', async (request, reply) => {
    const { id } = request.params;
    const history = store.getMatchHistory(id);

    if (!history) {
      throw new AppError(404, `マッチング履歴が見つかりません: ${id}`);
    }

    reply.send(history);
  });

  // Update match history (e.g., mark as completed, add feedback)
  fastify.put<{ Params: { id: string } }>('/history/:id', async (request, reply) => {
    const { id } = request.params;
    const updates = request.body as any;

    const updated = store.updateMatchHistory(id, updates);

    if (!updated) {
      throw new AppError(404, `マッチング履歴が見つかりません: ${id}`);
    }

    reply.send(updated);
  });

  // Get user's match history summary
  fastify.get<{ Params: { userId: string } }>('/users/:userId/history', async (request, reply) => {
    const { userId } = request.params;

    const histories = store.getAllMatchHistories({ userId });
    const completed = histories.filter(h => h.status === 'completed');

    const summary = {
      userId,
      totalMatches: histories.length,
      completedMatches: completed.length,
      completionRate: histories.length > 0 ? (completed.length / histories.length) * 100 : 0,
      averageScore:
        histories.length > 0
          ? histories.reduce((sum, h) => sum + h.score, 0) / histories.length
          : 0,
      byStatus: {
        proposed: histories.filter(h => h.status === 'proposed').length,
        accepted: histories.filter(h => h.status === 'accepted').length,
        in_progress: histories.filter(h => h.status === 'in_progress').length,
        completed: completed.length,
        cancelled: histories.filter(h => h.status === 'cancelled').length,
        failed: histories.filter(h => h.status === 'failed').length,
      },
      recentHistories: histories.slice(-10).reverse(),
    };

    reply.send(summary);
  });
}
