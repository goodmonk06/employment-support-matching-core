/**
 * 利用者のスタミナレベル
 */
export type StaminaLevel = 'low' | 'medium' | 'high';

/**
 * 曜日
 */
export type DayOfWeek = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

/**
 * 利用者モデル
 */
export interface User {
  /** 利用者ID */
  id: string;

  /** 組織ID */
  organizationId?: string;

  /** 利用者名 */
  name: string;

  /** 保有スキル・能力（タグ形式） */
  abilities: string[];

  /** スタミナレベル */
  staminaLevel: StaminaLevel;

  /** 利用可能な曜日 */
  availableDays: DayOfWeek[];

  /** ステータス */
  status?: 'active' | 'inactive' | 'on_leave' | 'graduated';

  /** プロファイル情報 */
  profile?: {
    /** 年齢 */
    age?: number;

    /** 障害種別 */
    disabilityType?: string;

    /** 希望する作業タイプ */
    preferredTaskTypes?: string[];

    /** 避けたい作業タイプ */
    avoidTaskTypes?: string[];

    /** 目標 */
    goals?: string[];
  };

  /** タグ */
  tags?: string[];

  /** 作成日時 */
  createdAt?: Date;

  /** 更新日時 */
  updatedAt?: Date;
}
