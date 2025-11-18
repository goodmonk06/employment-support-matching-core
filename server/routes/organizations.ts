import { FastifyInstance } from 'fastify';
import { store } from '../store/InMemoryStore';
import { Organization } from '../../src/models';
import { AppError } from '../utils/errorHandler';

/**
 * 組織管理API
 */
export async function organizationRoutes(fastify: FastifyInstance) {
  // Create organization
  fastify.post('/organizations', async (request, reply) => {
    const data = request.body as Omit<Organization, 'id'>;
    const organization = store.createOrganization(data);
    reply.status(201).send(organization);
  });

  // List all organizations
  fastify.get('/organizations', async (request, reply) => {
    const organizations = store.getAllOrganizations();
    reply.send({
      total: organizations.length,
      organizations,
    });
  });

  // Get organization by ID
  fastify.get<{ Params: { id: string } }>('/organizations/:id', async (request, reply) => {
    const { id } = request.params;
    const organization = store.getOrganization(id);

    if (!organization) {
      throw new AppError(404, `組織が見つかりません: ${id}`);
    }

    reply.send(organization);
  });

  // Update organization
  fastify.put<{ Params: { id: string } }>('/organizations/:id', async (request, reply) => {
    const { id } = request.params;
    const updates = request.body as any;

    const updated = store.updateOrganization(id, updates);

    if (!updated) {
      throw new AppError(404, `組織が見つかりません: ${id}`);
    }

    reply.send(updated);
  });

  // Delete organization
  fastify.delete<{ Params: { id: string } }>('/organizations/:id', async (request, reply) => {
    const { id } = request.params;
    const deleted = store.deleteOrganization(id);

    if (!deleted) {
      throw new AppError(404, `組織が見つかりません: ${id}`);
    }

    reply.status(204).send();
  });

  // Get organization statistics
  fastify.get<{ Params: { id: string } }>('/organizations/:id/stats', async (request, reply) => {
    const { id } = request.params;
    const organization = store.getOrganization(id);

    if (!organization) {
      throw new AppError(404, `組織が見つかりません: ${id}`);
    }

    const users = store.getAllUsers(id);
    const tasks = store.getAllTasks(id);
    const histories = store.getAllMatchHistories({ organizationId: id });
    const schedules = store.getAllWorkSchedules(id);

    const activeUsers = users.filter(u => u.status === 'active').length;
    const activeTasks = tasks.filter(t => t.status === 'active').length;
    const completedMatches = histories.filter(h => h.status === 'completed').length;
    const activeSchedules = schedules.filter(s => s.status === 'active').length;

    const stats = {
      organizationId: id,
      organizationName: organization.name,
      users: {
        total: users.length,
        active: activeUsers,
        inactive: users.length - activeUsers,
      },
      tasks: {
        total: tasks.length,
        active: activeTasks,
        inactive: tasks.length - activeTasks,
      },
      matchHistory: {
        total: histories.length,
        completed: completedMatches,
        completionRate: histories.length > 0 ? (completedMatches / histories.length) * 100 : 0,
      },
      schedules: {
        total: schedules.length,
        active: activeSchedules,
      },
    };

    reply.send(stats);
  });
}
