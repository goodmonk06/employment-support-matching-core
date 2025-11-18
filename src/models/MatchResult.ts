/**
 * マッチング結果モデル
 */
export interface MatchResult {
  /** 利用者ID */
  userId: string;

  /** タスクID */
  taskId: string;

  /** マッチングスコア（0-100） */
  score: number;

  /** マッチング理由・内訳 */
  reason: string;

  /** スコアの詳細内訳（デバッグ用） */
  breakdown?: {
    abilityScore: number;
    staminaScore: number;
    dayScore: number;
  };
}
