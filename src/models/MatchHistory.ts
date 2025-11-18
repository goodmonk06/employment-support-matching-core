/**
 * マッチング履歴モデル
 * 過去のマッチング結果とパフォーマンスを追跡
 */
export interface MatchHistory {
  /** 履歴ID */
  id: string;

  /** 組織ID */
  organizationId: string;

  /** 利用者ID */
  userId: string;

  /** タスクID */
  taskId: string;

  /** マッチングスコア */
  score: number;

  /** マッチング理由 */
  reason: string;

  /** スコア内訳 */
  breakdown: {
    abilityScore: number;
    staminaScore: number;
    dayScore: number;
  };

  /** 実施状況 */
  status: 'proposed' | 'accepted' | 'in_progress' | 'completed' | 'cancelled' | 'failed';

  /** 開始予定日時 */
  scheduledStart?: Date;

  /** 終了予定日時 */
  scheduledEnd?: Date;

  /** 実際の開始日時 */
  actualStart?: Date;

  /** 実際の終了日時 */
  actualEnd?: Date;

  /** 実施結果 */
  outcome?: {
    completed: boolean;
    qualityRating?: number; // 1-5
    effortRating?: number; // 1-5
    notes?: string;
  };

  /** フィードバック */
  feedback?: {
    userSatisfaction?: number; // 1-5
    supervisorRating?: number; // 1-5
    comments?: string;
  };

  /** 作成日時 */
  createdAt: Date;

  /** 更新日時 */
  updatedAt: Date;
}
