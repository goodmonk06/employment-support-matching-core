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

  /** 組織ID */
  organizationId?: string;

  /** タスク名 */
  title: string;

  /** 説明 */
  description?: string;

  /** 必要なスキル・能力（タグ形式） */
  requiredAbilities: string[];

  /** 難易度 */
  difficulty: Difficulty;

  /** 推奨曜日 */
  preferredDays: DayOfWeek[];

  /** カテゴリー */
  category?: string;

  /** ステータス */
  status?: 'active' | 'inactive' | 'archived';

  /** 詳細情報 */
  details?: {
    /** 推定所要時間（分） */
    estimatedDurationMinutes?: number;

    /** 最大同時実施人数 */
    maxParticipants?: number;

    /** 場所 */
    location?: string;

    /** 必要な道具・資材 */
    requiredMaterials?: string[];

    /** 注意事項 */
    precautions?: string[];
  };

  /** タグ */
  tags?: string[];

  /** 作成日時 */
  createdAt?: Date;

  /** 更新日時 */
  updatedAt?: Date;
}
