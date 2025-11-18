import { DayOfWeek } from './User';

/**
 * 勤務スケジュールモデル
 * 週次・月次の作業割り当て管理
 */
export interface WorkSchedule {
  /** スケジュールID */
  id: string;

  /** 組織ID */
  organizationId: string;

  /** スケジュール名 */
  name: string;

  /** 期間 */
  period: {
    start: Date;
    end: Date;
  };

  /** ステータス */
  status: 'draft' | 'published' | 'active' | 'completed' | 'archived';

  /** スケジュール項目 */
  assignments: ScheduleAssignment[];

  /** メタデータ */
  metadata?: {
    totalAssignments: number;
    totalUsers: number;
    totalTasks: number;
    averageUtilization?: number;
  };

  /** 作成者 */
  createdBy?: string;

  /** 作成日時 */
  createdAt: Date;

  /** 更新日時 */
  updatedAt: Date;
}

/**
 * スケジュール割り当て
 */
export interface ScheduleAssignment {
  /** 割り当てID */
  id: string;

  /** 利用者ID */
  userId: string;

  /** タスクID */
  taskId: string;

  /** 曜日 */
  dayOfWeek: DayOfWeek;

  /** 時間帯 */
  timeSlot: {
    start: string; // HH:mm format
    end: string;
  };

  /** 日付（特定日の場合） */
  date?: Date;

  /** ステータス */
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled' | 'no_show';

  /** メモ */
  notes?: string;
}
