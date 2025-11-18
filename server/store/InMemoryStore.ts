import {
  User,
  Task,
  Organization,
  MatchHistory,
  WorkSchedule,
  SkillCategory,
  PerformanceMetric,
} from '../../src/models';

/**
 * インメモリストア（将来的にはデータベースに置き換え可能）
 */
export class InMemoryStore {
  private users: Map<string, User> = new Map();
  private tasks: Map<string, Task> = new Map();
  private organizations: Map<string, Organization> = new Map();
  private matchHistories: Map<string, MatchHistory> = new Map();
  private workSchedules: Map<string, WorkSchedule> = new Map();
  private skillCategories: Map<string, SkillCategory> = new Map();
  private performanceMetrics: Map<string, PerformanceMetric> = new Map();

  private userIdCounter = 1;
  private taskIdCounter = 1;
  private organizationIdCounter = 1;
  private matchHistoryIdCounter = 1;
  private scheduleIdCounter = 1;
  private skillCategoryIdCounter = 1;
  private performanceMetricIdCounter = 1;

  // User operations
  createUser(userData: Omit<User, 'id'>): User {
    const id = `user-${String(this.userIdCounter++).padStart(3, '0')}`;
    const now = new Date();
    const user: User = {
      id,
      ...userData,
      createdAt: userData.createdAt || now,
      updatedAt: userData.updatedAt || now,
    };
    this.users.set(id, user);
    return user;
  }

  getUser(id: string): User | undefined {
    return this.users.get(id);
  }

  getAllUsers(organizationId?: string): User[] {
    const users = Array.from(this.users.values());
    if (organizationId) {
      return users.filter(u => u.organizationId === organizationId);
    }
    return users;
  }

  updateUser(id: string, updates: Partial<Omit<User, 'id'>>): User | null {
    const user = this.users.get(id);
    if (!user) return null;

    const updatedUser = { ...user, ...updates, updatedAt: new Date() };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  deleteUser(id: string): boolean {
    return this.users.delete(id);
  }

  // Task operations
  createTask(taskData: Omit<Task, 'id'>): Task {
    const id = `task-${String(this.taskIdCounter++).padStart(3, '0')}`;
    const now = new Date();
    const task: Task = {
      id,
      ...taskData,
      createdAt: taskData.createdAt || now,
      updatedAt: taskData.updatedAt || now,
    };
    this.tasks.set(id, task);
    return task;
  }

  getTask(id: string): Task | undefined {
    return this.tasks.get(id);
  }

  getAllTasks(organizationId?: string): Task[] {
    const tasks = Array.from(this.tasks.values());
    if (organizationId) {
      return tasks.filter(t => t.organizationId === organizationId);
    }
    return tasks;
  }

  updateTask(id: string, updates: Partial<Omit<Task, 'id'>>): Task | null {
    const task = this.tasks.get(id);
    if (!task) return null;

    const updatedTask = { ...task, ...updates, updatedAt: new Date() };
    this.tasks.set(id, updatedTask);
    return updatedTask;
  }

  deleteTask(id: string): boolean {
    return this.tasks.delete(id);
  }

  // Organization operations
  createOrganization(orgData: Omit<Organization, 'id'>): Organization {
    const id = `org-${String(this.organizationIdCounter++).padStart(3, '0')}`;
    const now = new Date();
    const organization: Organization = {
      id,
      ...orgData,
      createdAt: orgData.createdAt || now,
      updatedAt: orgData.updatedAt || now,
    };
    this.organizations.set(id, organization);
    return organization;
  }

  getOrganization(id: string): Organization | undefined {
    return this.organizations.get(id);
  }

  getAllOrganizations(): Organization[] {
    return Array.from(this.organizations.values());
  }

  updateOrganization(id: string, updates: Partial<Omit<Organization, 'id'>>): Organization | null {
    const org = this.organizations.get(id);
    if (!org) return null;

    const updated = { ...org, ...updates, updatedAt: new Date() };
    this.organizations.set(id, updated);
    return updated;
  }

  deleteOrganization(id: string): boolean {
    return this.organizations.delete(id);
  }

  // MatchHistory operations
  createMatchHistory(historyData: Omit<MatchHistory, 'id'>): MatchHistory {
    const id = `mh-${String(this.matchHistoryIdCounter++).padStart(6, '0')}`;
    const now = new Date();
    const history: MatchHistory = {
      id,
      ...historyData,
      createdAt: historyData.createdAt || now,
      updatedAt: historyData.updatedAt || now,
    };
    this.matchHistories.set(id, history);
    return history;
  }

  getMatchHistory(id: string): MatchHistory | undefined {
    return this.matchHistories.get(id);
  }

  getAllMatchHistories(filter?: {
    userId?: string;
    taskId?: string;
    organizationId?: string;
    status?: MatchHistory['status'];
  }): MatchHistory[] {
    let histories = Array.from(this.matchHistories.values());

    if (filter) {
      if (filter.userId) {
        histories = histories.filter(h => h.userId === filter.userId);
      }
      if (filter.taskId) {
        histories = histories.filter(h => h.taskId === filter.taskId);
      }
      if (filter.organizationId) {
        histories = histories.filter(h => h.organizationId === filter.organizationId);
      }
      if (filter.status) {
        histories = histories.filter(h => h.status === filter.status);
      }
    }

    return histories;
  }

  updateMatchHistory(id: string, updates: Partial<Omit<MatchHistory, 'id'>>): MatchHistory | null {
    const history = this.matchHistories.get(id);
    if (!history) return null;

    const updated = { ...history, ...updates, updatedAt: new Date() };
    this.matchHistories.set(id, updated);
    return updated;
  }

  // WorkSchedule operations
  createWorkSchedule(scheduleData: Omit<WorkSchedule, 'id'>): WorkSchedule {
    const id = `sch-${String(this.scheduleIdCounter++).padStart(4, '0')}`;
    const now = new Date();
    const schedule: WorkSchedule = {
      id,
      ...scheduleData,
      createdAt: scheduleData.createdAt || now,
      updatedAt: scheduleData.updatedAt || now,
    };
    this.workSchedules.set(id, schedule);
    return schedule;
  }

  getWorkSchedule(id: string): WorkSchedule | undefined {
    return this.workSchedules.get(id);
  }

  getAllWorkSchedules(organizationId?: string): WorkSchedule[] {
    const schedules = Array.from(this.workSchedules.values());
    if (organizationId) {
      return schedules.filter(s => s.organizationId === organizationId);
    }
    return schedules;
  }

  updateWorkSchedule(id: string, updates: Partial<Omit<WorkSchedule, 'id'>>): WorkSchedule | null {
    const schedule = this.workSchedules.get(id);
    if (!schedule) return null;

    const updated = { ...schedule, ...updates, updatedAt: new Date() };
    this.workSchedules.set(id, updated);
    return updated;
  }

  deleteWorkSchedule(id: string): boolean {
    return this.workSchedules.delete(id);
  }

  // SkillCategory operations
  createSkillCategory(categoryData: Omit<SkillCategory, 'id'>): SkillCategory {
    const id = `cat-${String(this.skillCategoryIdCounter++).padStart(3, '0')}`;
    const category: SkillCategory = { id, ...categoryData };
    this.skillCategories.set(id, category);
    return category;
  }

  getSkillCategory(id: string): SkillCategory | undefined {
    return this.skillCategories.get(id);
  }

  getAllSkillCategories(): SkillCategory[] {
    return Array.from(this.skillCategories.values())
      .filter(c => c.isActive)
      .sort((a, b) => a.order - b.order);
  }

  updateSkillCategory(id: string, updates: Partial<Omit<SkillCategory, 'id'>>): SkillCategory | null {
    const category = this.skillCategories.get(id);
    if (!category) return null;

    const updated = { ...category, ...updates };
    this.skillCategories.set(id, updated);
    return updated;
  }

  // PerformanceMetric operations
  createPerformanceMetric(metricData: Omit<PerformanceMetric, 'id'>): PerformanceMetric {
    const id = `pm-${String(this.performanceMetricIdCounter++).padStart(6, '0')}`;
    const now = new Date();
    const metric: PerformanceMetric = {
      id,
      ...metricData,
      createdAt: metricData.createdAt || now,
    };
    this.performanceMetrics.set(id, metric);
    return metric;
  }

  getPerformanceMetric(id: string): PerformanceMetric | undefined {
    return this.performanceMetrics.get(id);
  }

  getAllPerformanceMetrics(filter?: {
    userId?: string;
    organizationId?: string;
  }): PerformanceMetric[] {
    let metrics = Array.from(this.performanceMetrics.values());

    if (filter) {
      if (filter.userId) {
        metrics = metrics.filter(m => m.userId === filter.userId);
      }
      if (filter.organizationId) {
        metrics = metrics.filter(m => m.organizationId === filter.organizationId);
      }
    }

    return metrics;
  }

  getLatestPerformanceMetric(userId: string): PerformanceMetric | undefined {
    const userMetrics = this.getAllPerformanceMetrics({ userId });
    if (userMetrics.length === 0) return undefined;

    return userMetrics.reduce((latest, current) =>
      current.createdAt > latest.createdAt ? current : latest
    );
  }

  // Utility
  clear(): void {
    this.users.clear();
    this.tasks.clear();
    this.organizations.clear();
    this.matchHistories.clear();
    this.workSchedules.clear();
    this.skillCategories.clear();
    this.performanceMetrics.clear();

    this.userIdCounter = 1;
    this.taskIdCounter = 1;
    this.organizationIdCounter = 1;
    this.matchHistoryIdCounter = 1;
    this.scheduleIdCounter = 1;
    this.skillCategoryIdCounter = 1;
    this.performanceMetricIdCounter = 1;
  }
}

export const store = new InMemoryStore();
