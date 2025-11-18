/**
 * スキルカテゴリーモデル
 * 階層的なスキル分類
 */
export interface SkillCategory {
  /** カテゴリーID */
  id: string;

  /** カテゴリー名 */
  name: string;

  /** 親カテゴリーID */
  parentId?: string;

  /** 説明 */
  description?: string;

  /** 関連スキル */
  skills: string[];

  /** 難易度レベル */
  difficultyLevel?: 'beginner' | 'intermediate' | 'advanced';

  /** 表示順 */
  order: number;

  /** アクティブフラグ */
  isActive: boolean;
}

/**
 * ユーザースキルプロファイル
 * 利用者の詳細なスキル情報
 */
export interface UserSkillProfile {
  /** プロファイルID */
  id: string;

  /** 利用者ID */
  userId: string;

  /** スキル評価 */
  skills: SkillAssessment[];

  /** 更新日時 */
  updatedAt: Date;
}

/**
 * スキル評価
 */
export interface SkillAssessment {
  /** スキル名 */
  skill: string;

  /** カテゴリーID */
  categoryId?: string;

  /** 熟練度レベル */
  proficiencyLevel: 1 | 2 | 3 | 4 | 5;

  /** 最終評価日 */
  lastAssessedAt: Date;

  /** 評価者 */
  assessedBy?: string;

  /** メモ */
  notes?: string;
}
