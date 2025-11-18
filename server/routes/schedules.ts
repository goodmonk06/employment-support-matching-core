import { FastifyInstance } from 'fastify';
import { store } from '../store/InMemoryStore';
import { AppError } from '../utils/errorHandler';
import { WorkSchedule } from '../../src/models';

/**
 * スケジュール管理API
 */
export async function scheduleRoutes(fastify: FastifyInstance) {
  // Create schedule
  fastify.post('/schedules', async (request, reply) => {
    const data = request.body as Omit<WorkSchedule, 'id'>;
    const schedule = store.createWorkSchedule(data);
    reply.status(201).send(schedule);
  });

  // List all schedules
  fastify.get<{
    Querystring: {
      organizationId?: string;
      status?: string;
    };
  }>('/schedules', async (request, reply) => {
    const { organizationId, status } = request.query;

    let schedules = store.getAllWorkSchedules(organizationId);

    if (status) {
      schedules = schedules.filter(s => s.status === status);
    }

    reply.send({
      total: schedules.length,
      schedules,
    });
  });

  // Get schedule by ID
  fastify.get<{ Params: { id: string } }>('/schedules/:id', async (request, reply) => {
    const { id } = request.params;
    const schedule = store.getWorkSchedule(id);

    if (!schedule) {
      throw new AppError(404, `スケジュールが見つかりません: ${id}`);
    }

    // Enrich with user and task details
    const enriched = {
      ...schedule,
      assignmentDetails: schedule.assignments.map(assignment => {
        const user = store.getUser(assignment.userId);
        const task = store.getTask(assignment.taskId);
        return {
          ...assignment,
          userName: user?.name,
          taskTitle: task?.title,
        };
      }),
    };

    reply.send(enriched);
  });

  // Update schedule
  fastify.put<{ Params: { id: string } }>('/schedules/:id', async (request, reply) => {
    const { id } = request.params;
    const updates = request.body as any;

    const updated = store.updateWorkSchedule(id, updates);

    if (!updated) {
      throw new AppError(404, `スケジュールが見つかりません: ${id}`);
    }

    reply.send(updated);
  });

  // Delete schedule
  fastify.delete<{ Params: { id: string } }>('/schedules/:id', async (request, reply) => {
    const { id } = request.params;
    const deleted = store.deleteWorkSchedule(id);

    if (!deleted) {
      throw new AppError(404, `スケジュールが見つかりません: ${id}`);
    }

    reply.status(204).send();
  });

  // Publish schedule (change status to published)
  fastify.post<{ Params: { id: string } }>('/schedules/:id/publish', async (request, reply) => {
    const { id } = request.params;
    const schedule = store.getWorkSchedule(id);

    if (!schedule) {
      throw new AppError(404, `スケジュールが見つかりません: ${id}`);
    }

    if (schedule.status !== 'draft') {
      throw new AppError(400, `ドラフト状態のスケジュールのみ公開できます`);
    }

    const updated = store.updateWorkSchedule(id, { status: 'published' });

    reply.send(updated);
  });
}
