import { FastifyInstance } from 'fastify';
import { store } from '../store/InMemoryStore';
import { CreateUserSchema, UpdateUserSchema } from '../schemas/user.schema';
import { AppError } from '../utils/errorHandler';

export async function userRoutes(fastify: FastifyInstance) {
  // Create user
  fastify.post('/users', async (request, reply) => {
    const data = CreateUserSchema.parse(request.body);
    const user = store.createUser(data);
    reply.status(201).send(user);
  });

  // List all users
  fastify.get('/users', async (request, reply) => {
    const users = store.getAllUsers();
    reply.send(users);
  });

  // Get user by ID
  fastify.get<{ Params: { id: string } }>('/users/:id', async (request, reply) => {
    const { id } = request.params;
    const user = store.getUser(id);

    if (!user) {
      throw new AppError(404, `ユーザーが見つかりません: ${id}`);
    }

    reply.send(user);
  });

  // Update user
  fastify.put<{ Params: { id: string } }>('/users/:id', async (request, reply) => {
    const { id } = request.params;
    const updates = UpdateUserSchema.parse(request.body);

    const updatedUser = store.updateUser(id, updates);

    if (!updatedUser) {
      throw new AppError(404, `ユーザーが見つかりません: ${id}`);
    }

    reply.send(updatedUser);
  });

  // Delete user
  fastify.delete<{ Params: { id: string } }>('/users/:id', async (request, reply) => {
    const { id } = request.params;
    const deleted = store.deleteUser(id);

    if (!deleted) {
      throw new AppError(404, `ユーザーが見つかりません: ${id}`);
    }

    reply.status(204).send();
  });
}
