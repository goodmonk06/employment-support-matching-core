/**
 * パフォーマンスメトリクスモデル
 * 利用者の進捗とパフォーマンス追跡
 */
export interface PerformanceMetric {
  /** メトリクスID */
  id: string;

  /** 利用者ID */
  userId: string;

  /** 組織ID */
  organizationId: string;

  /** 計測期間 */
  period: {
    start: Date;
    end: Date;
  };

  /** 統計データ */
  statistics: {
    /** 総タスク数 */
    totalTasksAssigned: number;

    /** 完了タスク数 */
    totalTasksCompleted: number;

    /** 完了率 */
    completionRate: number;

    /** 平均品質評価 */
    averageQualityRating?: number;

    /** 平均満足度 */
    averageSatisfaction?: number;

    /** 総勤務時間（分） */
    totalWorkMinutes?: number;
  };

  /** スキル進捗 */
  skillProgress?: {
    skill: string;
    previousLevel: number;
    currentLevel: number;
    improvement: number;
  }[];

  /** 強み */
  strengths?: string[];

  /** 改善点 */
  areasForImprovement?: string[];

  /** トレンド */
  trend: 'improving' | 'stable' | 'declining';

  /** 作成日時 */
  createdAt: Date;
}
