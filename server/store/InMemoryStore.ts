import { User, Task } from '../../src/models';

/**
 * インメモリストア（将来的にはデータベースに置き換え可能）
 */
export class InMemoryStore {
  private users: Map<string, User> = new Map();
  private tasks: Map<string, Task> = new Map();
  private userIdCounter = 1;
  private taskIdCounter = 1;

  // User operations
  createUser(userData: Omit<User, 'id'>): User {
    const id = `user-${String(this.userIdCounter++).padStart(3, '0')}`;
    const user: User = { id, ...userData };
    this.users.set(id, user);
    return user;
  }

  getUser(id: string): User | undefined {
    return this.users.get(id);
  }

  getAllUsers(): User[] {
    return Array.from(this.users.values());
  }

  updateUser(id: string, updates: Partial<Omit<User, 'id'>>): User | null {
    const user = this.users.get(id);
    if (!user) return null;

    const updatedUser = { ...user, ...updates };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  deleteUser(id: string): boolean {
    return this.users.delete(id);
  }

  // Task operations
  createTask(taskData: Omit<Task, 'id'>): Task {
    const id = `task-${String(this.taskIdCounter++).padStart(3, '0')}`;
    const task: Task = { id, ...taskData };
    this.tasks.set(id, task);
    return task;
  }

  getTask(id: string): Task | undefined {
    return this.tasks.get(id);
  }

  getAllTasks(): Task[] {
    return Array.from(this.tasks.values());
  }

  updateTask(id: string, updates: Partial<Omit<Task, 'id'>>): Task | null {
    const task = this.tasks.get(id);
    if (!task) return null;

    const updatedTask = { ...task, ...updates };
    this.tasks.set(id, updatedTask);
    return updatedTask;
  }

  deleteTask(id: string): boolean {
    return this.tasks.delete(id);
  }

  // Utility
  clear(): void {
    this.users.clear();
    this.tasks.clear();
    this.userIdCounter = 1;
    this.taskIdCounter = 1;
  }
}

export const store = new InMemoryStore();
