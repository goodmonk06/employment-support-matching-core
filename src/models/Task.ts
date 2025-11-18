import { DayOfWeek } from './User';

/**
 * タスクの難易度
 */
export type Difficulty = 'easy' | 'medium' | 'hard';

/**
 * タスクモデル
 */
export interface Task {
  /** タスクID */
  id: string;

  /** タスク名 */
  title: string;

  /** 必要なスキル・能力（タグ形式） */
  requiredAbilities: string[];

  /** 難易度 */
  difficulty: Difficulty;

  /** 推奨曜日 */
  preferredDays: DayOfWeek[];
}
