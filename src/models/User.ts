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

  /** 利用者名 */
  name: string;

  /** 保有スキル・能力（タグ形式） */
  abilities: string[];

  /** スタミナレベル */
  staminaLevel: StaminaLevel;

  /** 利用可能な曜日 */
  availableDays: DayOfWeek[];
}
