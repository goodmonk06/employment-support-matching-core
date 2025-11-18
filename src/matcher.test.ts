import { describe, it, expect } from 'vitest';
import { matchUsersToTasks, findBestTasksForUser, findBestUsersForTask } from './matcher';
import { User, Task } from './models';

describe('Matcher', () => {
  const users: User[] = [
    {
      id: 'user-001',
      name: '田中太郎',
      abilities: ['清掃', '組立'],
      staminaLevel: 'high',
      availableDays: ['monday', 'wednesday', 'friday'],
    },
    {
      id: 'user-002',
      name: '佐藤花子',
      abilities: ['PC入力', '書類整理'],
      staminaLevel: 'medium',
      availableDays: ['tuesday', 'thursday'],
    },
  ];

  const tasks: Task[] = [
    {
      id: 'task-001',
      title: '清掃作業',
      requiredAbilities: ['清掃'],
      difficulty: 'easy',
      preferredDays: ['monday', 'wednesday'],
    },
    {
      id: 'task-002',
      title: 'データ入力',
      requiredAbilities: ['PC入力', '書類整理'],
      difficulty: 'medium',
      preferredDays: ['tuesday', 'thursday'],
    },
  ];

  describe('matchUsersToTasks', () => {
    it('should return matches for all users and tasks', () => {
      const results = matchUsersToTasks(users, tasks);
      expect(results).toHaveLength(4); // 2 users × 2 tasks
      expect(results[0]).toHaveProperty('userId');
      expect(results[0]).toHaveProperty('taskId');
      expect(results[0]).toHaveProperty('score');
      expect(results[0]).toHaveProperty('reason');
    });

    it('should filter by minimum score', () => {
      const results = matchUsersToTasks(users, tasks, { minScore: 80 });
      expect(results.length).toBeGreaterThan(0);
      results.forEach(result => {
        expect(result.score).toBeGreaterThanOrEqual(80);
      });
    });

    it('should sort results by score in descending order', () => {
      const results = matchUsersToTasks(users, tasks, { sortByScore: true });
      for (let i = 0; i < results.length - 1; i++) {
        expect(results[i].score).toBeGreaterThanOrEqual(results[i + 1].score);
      }
    });

    it('should limit matches per user', () => {
      const results = matchUsersToTasks(users, tasks, { maxMatchesPerUser: 1 });
      expect(results).toHaveLength(2); // 1 match per user × 2 users
    });
  });

  describe('findBestTasksForUser', () => {
    it('should return best tasks for a user', () => {
      const results = findBestTasksForUser(users[0], tasks, 2);
      expect(results.length).toBeLessThanOrEqual(2);
      expect(results.every(r => r.userId === users[0].id)).toBe(true);
    });

    it('should return tasks sorted by score', () => {
      const results = findBestTasksForUser(users[0], tasks, 5);
      for (let i = 0; i < results.length - 1; i++) {
        expect(results[i].score).toBeGreaterThanOrEqual(results[i + 1].score);
      }
    });

    it('should respect the limit parameter', () => {
      const results = findBestTasksForUser(users[0], tasks, 1);
      expect(results).toHaveLength(1);
    });
  });

  describe('findBestUsersForTask', () => {
    it('should return best users for a task', () => {
      const results = findBestUsersForTask(tasks[0], users, 2);
      expect(results.length).toBeLessThanOrEqual(2);
      expect(results.every(r => r.taskId === tasks[0].id)).toBe(true);
    });

    it('should return users sorted by score', () => {
      const results = findBestUsersForTask(tasks[0], users, 5);
      for (let i = 0; i < results.length - 1; i++) {
        expect(results[i].score).toBeGreaterThanOrEqual(results[i + 1].score);
      }
    });

    it('should respect the limit parameter', () => {
      const results = findBestUsersForTask(tasks[0], users, 1);
      expect(results).toHaveLength(1);
    });
  });
});
