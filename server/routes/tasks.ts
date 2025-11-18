import { FastifyInstance } from 'fastify';
import { store } from '../store/InMemoryStore';
import { CreateTaskSchema, UpdateTaskSchema } from '../schemas/task.schema';
import { AppError } from '../utils/errorHandler';

export async function taskRoutes(fastify: FastifyInstance) {
  // Create task
  fastify.post('/tasks', async (request, reply) => {
    const data = CreateTaskSchema.parse(request.body);
    const task = store.createTask(data);
    reply.status(201).send(task);
  });

  // List all tasks
  fastify.get('/tasks', async (request, reply) => {
    const tasks = store.getAllTasks();
    reply.send(tasks);
  });

  // Get task by ID
  fastify.get<{ Params: { id: string } }>('/tasks/:id', async (request, reply) => {
    const { id } = request.params;
    const task = store.getTask(id);

    if (!task) {
      throw new AppError(404, `タスクが見つかりません: ${id}`);
    }

    reply.send(task);
  });

  // Update task
  fastify.put<{ Params: { id: string } }>('/tasks/:id', async (request, reply) => {
    const { id } = request.params;
    const updates = UpdateTaskSchema.parse(request.body);

    const updatedTask = store.updateTask(id, updates);

    if (!updatedTask) {
      throw new AppError(404, `タスクが見つかりません: ${id}`);
    }

    reply.send(updatedTask);
  });

  // Delete task
  fastify.delete<{ Params: { id: string } }>('/tasks/:id', async (request, reply) => {
    const { id } = request.params;
    const deleted = store.deleteTask(id);

    if (!deleted) {
      throw new AppError(404, `タスクが見つかりません: ${id}`);
    }

    reply.status(204).send();
  });
}
