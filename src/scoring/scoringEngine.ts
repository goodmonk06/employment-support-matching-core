import { User, Task, StaminaLevel, Difficulty, DayOfWeek } from '../models';

/**
 * スタミナレベルを数値に変換
 */
function staminaLevelToNumber(level: StaminaLevel): number {
  switch (level) {
    case 'low':
      return 1;
    case 'medium':
      return 2;
    case 'high':
      return 3;
  }
}

/**
 * 難易度を数値に変換
 */
function difficultyToNumber(difficulty: Difficulty): number {
  switch (difficulty) {
    case 'easy':
      return 1;
    case 'medium':
      return 2;
    case 'hard':
      return 3;
  }
}

/**
 * スキル・能力の一致度スコアを計算（0-100）
 *
 * @param userAbilities 利用者の保有スキル
 * @param requiredAbilities タスクの必要スキル
 * @returns スキル一致度スコア
 */
export function calculateAbilityScore(
  userAbilities: string[],
  requiredAbilities: string[]
): number {
  if (requiredAbilities.length === 0) {
    // 必要スキルがない場合は満点
    return 100;
  }

  const matchCount = requiredAbilities.filter(req =>
    userAbilities.some(ability => ability.toLowerCase() === req.toLowerCase())
  ).length;

  // 必要スキルのうち何%をカバーしているか
  const matchRate = matchCount / requiredAbilities.length;

  // 0-100のスコアに変換
  return Math.round(matchRate * 100);
}

/**
 * スタミナと難易度の相性スコアを計算（0-100）
 *
 * @param staminaLevel 利用者のスタミナレベル
 * @param difficulty タスクの難易度
 * @returns スタミナ相性スコア
 */
export function calculateStaminaScore(
  staminaLevel: StaminaLevel,
  difficulty: Difficulty
): number {
  const stamina = staminaLevelToNumber(staminaLevel);
  const diff = difficultyToNumber(difficulty);

  // スタミナと難易度の差分を計算
  const difference = Math.abs(stamina - diff);

  // 差が0なら100点、1なら70点、2なら40点
  switch (difference) {
    case 0:
      return 100;
    case 1:
      return 70;
    case 2:
      return 40;
    default:
      return 0;
  }
}

/**
 * 曜日の一致度スコアを計算（0-100）
 *
 * @param availableDays 利用者の利用可能曜日
 * @param preferredDays タスクの推奨曜日
 * @returns 曜日一致度スコア
 */
export function calculateDayScore(
  availableDays: DayOfWeek[],
  preferredDays: DayOfWeek[]
): number {
  if (preferredDays.length === 0) {
    // 推奨曜日がない場合は満点
    return 100;
  }

  const matchCount = preferredDays.filter(day => availableDays.includes(day)).length;

  // 推奨曜日のうち何%をカバーしているか
  const matchRate = matchCount / preferredDays.length;

  // 0-100のスコアに変換
  return Math.round(matchRate * 100);
}

/**
 * 総合マッチングスコアを計算（0-100）
 *
 * 重み付け:
 * - スキル一致度: 50%
 * - スタミナ相性: 30%
 * - 曜日一致度: 20%
 *
 * @param user 利用者
 * @param task タスク
 * @returns 総合スコアとその内訳
 */
export function calculateMatchScore(
  user: User,
  task: Task
): { score: number; breakdown: { abilityScore: number; staminaScore: number; dayScore: number } } {
  const abilityScore = calculateAbilityScore(user.abilities, task.requiredAbilities);
  const staminaScore = calculateStaminaScore(user.staminaLevel, task.difficulty);
  const dayScore = calculateDayScore(user.availableDays, task.preferredDays);

  // 重み付け合計スコア
  const totalScore = Math.round(
    abilityScore * 0.5 +
    staminaScore * 0.3 +
    dayScore * 0.2
  );

  return {
    score: totalScore,
    breakdown: {
      abilityScore,
      staminaScore,
      dayScore,
    },
  };
}

/**
 * スコアから理由テキストを生成
 */
export function generateMatchReason(
  user: User,
  task: Task,
  breakdown: { abilityScore: number; staminaScore: number; dayScore: number }
): string {
  const reasons: string[] = [];

  // スキル一致度の評価
  if (breakdown.abilityScore >= 80) {
    reasons.push('スキルが高度にマッチ');
  } else if (breakdown.abilityScore >= 50) {
    reasons.push('スキルが部分的にマッチ');
  } else if (breakdown.abilityScore > 0) {
    reasons.push('スキルが一部マッチ');
  } else {
    reasons.push('スキルのマッチなし');
  }

  // スタミナ相性の評価
  if (breakdown.staminaScore >= 90) {
    reasons.push('難易度が最適');
  } else if (breakdown.staminaScore >= 60) {
    reasons.push('難易度が適度');
  } else {
    reasons.push('難易度にやや課題');
  }

  // 曜日一致度の評価
  if (breakdown.dayScore >= 80) {
    reasons.push('スケジュールが合致');
  } else if (breakdown.dayScore >= 50) {
    reasons.push('スケジュールが部分的に合致');
  } else if (breakdown.dayScore > 0) {
    reasons.push('スケジュールが一部合致');
  } else {
    reasons.push('スケジュール調整が必要');
  }

  return reasons.join(', ');
}
