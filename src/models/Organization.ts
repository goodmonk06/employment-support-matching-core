/**
 * 事業所（組織）モデル
 * マルチテナント対応のための組織情報
 */
export interface Organization {
  /** 組織ID */
  id: string;

  /** 組織名 */
  name: string;

  /** 組織タイプ */
  type: 'A型' | 'B型' | '移行支援' | 'その他';

  /** 所在地 */
  location?: {
    prefecture: string;
    city: string;
    address?: string;
  };

  /** 定員 */
  capacity?: number;

  /** 設定・メタデータ */
  settings: {
    workingHours?: {
      start: string; // HH:mm format
      end: string;
    };
    defaultBreakMinutes?: number;
    enabledFeatures?: string[];
  };

  /** ステータス */
  status: 'active' | 'inactive' | 'suspended';

  /** 作成日時 */
  createdAt: Date;

  /** 更新日時 */
  updatedAt: Date;
}
