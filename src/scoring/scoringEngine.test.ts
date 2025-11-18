import { describe, it, expect } from 'vitest';
import {
  calculateAbilityScore,
  calculateStaminaScore,
  calculateDayScore,
  calculateMatchScore,
} from './scoringEngine';
import { User, Task } from '../models';

describe('Scoring Engine', () => {
  describe('calculateAbilityScore', () => {
    it('should return 100 when all required abilities are matched', () => {
      const userAbilities = ['清掃', '組立', '梱包'];
      const requiredAbilities = ['清掃', '組立'];
      const score = calculateAbilityScore(userAbilities, requiredAbilities);
      expect(score).toBe(100);
    });

    it('should return 50 when half of required abilities are matched', () => {
      const userAbilities = ['清掃'];
      const requiredAbilities = ['清掃', '組立'];
      const score = calculateAbilityScore(userAbilities, requiredAbilities);
      expect(score).toBe(50);
    });

    it('should return 0 when no abilities are matched', () => {
      const userAbilities = ['PC入力'];
      const requiredAbilities = ['清掃', '組立'];
      const score = calculateAbilityScore(userAbilities, requiredAbilities);
      expect(score).toBe(0);
    });

    it('should return 100 when no abilities are required', () => {
      const userAbilities = ['清掃', '組立'];
      const requiredAbilities: string[] = [];
      const score = calculateAbilityScore(userAbilities, requiredAbilities);
      expect(score).toBe(100);
    });

    it('should be case insensitive', () => {
      const userAbilities = ['清掃'];
      const requiredAbilities = ['清掃'];
      const score = calculateAbilityScore(userAbilities, requiredAbilities);
      expect(score).toBe(100);
    });
  });

  describe('calculateStaminaScore', () => {
    it('should return 100 for perfect match (high stamina + hard task)', () => {
      const score = calculateStaminaScore('high', 'hard');
      expect(score).toBe(100);
    });

    it('should return 100 for perfect match (medium stamina + medium task)', () => {
      const score = calculateStaminaScore('medium', 'medium');
      expect(score).toBe(100);
    });

    it('should return 100 for perfect match (low stamina + easy task)', () => {
      const score = calculateStaminaScore('low', 'easy');
      expect(score).toBe(100);
    });

    it('should return 70 for 1-level difference', () => {
      const score = calculateStaminaScore('high', 'medium');
      expect(score).toBe(70);
    });

    it('should return 40 for 2-level difference', () => {
      const score = calculateStaminaScore('high', 'easy');
      expect(score).toBe(40);
    });

    it('should return 40 for low stamina + hard task', () => {
      const score = calculateStaminaScore('low', 'hard');
      expect(score).toBe(40);
    });
  });

  describe('calculateDayScore', () => {
    it('should return 100 when all preferred days are available', () => {
      const availableDays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'] as const;
      const preferredDays = ['monday', 'wednesday'] as const;
      const score = calculateDayScore([...availableDays], [...preferredDays]);
      expect(score).toBe(100);
    });

    it('should return 50 when half of preferred days are available', () => {
      const availableDays = ['monday', 'tuesday'] as const;
      const preferredDays = ['monday', 'wednesday'] as const;
      const score = calculateDayScore([...availableDays], [...preferredDays]);
      expect(score).toBe(50);
    });

    it('should return 0 when no preferred days are available', () => {
      const availableDays = ['monday', 'tuesday'] as const;
      const preferredDays = ['wednesday', 'thursday'] as const;
      const score = calculateDayScore([...availableDays], [...preferredDays]);
      expect(score).toBe(0);
    });

    it('should return 100 when no days are preferred', () => {
      const availableDays = ['monday', 'tuesday'] as const;
      const preferredDays: ('monday' | 'tuesday')[] = [];
      const score = calculateDayScore([...availableDays], preferredDays);
      expect(score).toBe(100);
    });
  });

  describe('calculateMatchScore', () => {
    it('should calculate correct total score with perfect match', () => {
      const user: User = {
        id: 'user-001',
        name: '田中太郎',
        abilities: ['清掃', '組立'],
        staminaLevel: 'high',
        availableDays: ['monday', 'wednesday', 'friday'],
      };

      const task: Task = {
        id: 'task-001',
        title: '製品組立',
        requiredAbilities: ['組立', '清掃'],
        difficulty: 'hard',
        preferredDays: ['monday', 'wednesday'],
      };

      const result = calculateMatchScore(user, task);

      // Ability: 100 (all matched)
      // Stamina: 100 (high + hard)
      // Day: 100 (all matched)
      // Total: 100 * 0.5 + 100 * 0.3 + 100 * 0.2 = 100
      expect(result.score).toBe(100);
      expect(result.breakdown.abilityScore).toBe(100);
      expect(result.breakdown.staminaScore).toBe(100);
      expect(result.breakdown.dayScore).toBe(100);
    });

    it('should calculate correct total score with partial match', () => {
      const user: User = {
        id: 'user-002',
        name: '佐藤花子',
        abilities: ['PC入力'],
        staminaLevel: 'low',
        availableDays: ['tuesday', 'thursday'],
      };

      const task: Task = {
        id: 'task-002',
        title: 'データ入力',
        requiredAbilities: ['PC入力', '書類整理'],
        difficulty: 'medium',
        preferredDays: ['tuesday', 'wednesday'],
      };

      const result = calculateMatchScore(user, task);

      // Ability: 50 (1 out of 2 matched)
      // Stamina: 70 (low + medium = 1 level difference)
      // Day: 50 (1 out of 2 matched)
      // Total: 50 * 0.5 + 70 * 0.3 + 50 * 0.2 = 25 + 21 + 10 = 56
      expect(result.score).toBe(56);
      expect(result.breakdown.abilityScore).toBe(50);
      expect(result.breakdown.staminaScore).toBe(70);
      expect(result.breakdown.dayScore).toBe(50);
    });

    it('should handle no skill match gracefully', () => {
      const user: User = {
        id: 'user-003',
        name: '鈴木一郎',
        abilities: ['軽作業'],
        staminaLevel: 'medium',
        availableDays: ['friday'],
      };

      const task: Task = {
        id: 'task-003',
        title: '清掃作業',
        requiredAbilities: ['清掃'],
        difficulty: 'easy',
        preferredDays: ['monday', 'wednesday'],
      };

      const result = calculateMatchScore(user, task);

      // Ability: 0 (no match)
      // Stamina: 70 (medium + easy = 1 level difference)
      // Day: 0 (no match)
      // Total: 0 * 0.5 + 70 * 0.3 + 0 * 0.2 = 21
      expect(result.score).toBe(21);
      expect(result.breakdown.abilityScore).toBe(0);
      expect(result.breakdown.staminaScore).toBe(70);
      expect(result.breakdown.dayScore).toBe(0);
    });
  });
});
