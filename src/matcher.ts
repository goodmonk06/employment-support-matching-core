import { User, Task, MatchResult } from './models';
import { calculateMatchScore, generateMatchReason } from './scoring/scoringEngine';

/**
 * マッチングオプション
 */
export interface MatchingOptions {
  /** 最低スコア閾値（これ以下のマッチは除外）デフォルト: 0 */
  minScore?: number;

  /** 各ユーザーに対して返す最大マッチ数 デフォルト: 制限なし */
  maxMatchesPerUser?: number;

  /** 結果をスコア降順でソートするか デフォルト: true */
  sortByScore?: boolean;
}

/**
 * 利用者とタスクのマッチングを実行
 *
 * @param users 利用者リスト
 * @param tasks タスクリスト
 * @param options マッチングオプション
 * @returns マッチング結果のリスト
 */
export function matchUsersToTasks(
  users: User[],
  tasks: Task[],
  options: MatchingOptions = {}
): MatchResult[] {
  const {
    minScore = 0,
    maxMatchesPerUser,
    sortByScore = true,
  } = options;

  const results: MatchResult[] = [];

  // 各利用者に対して全タスクとのマッチングスコアを計算
  for (const user of users) {
    const userMatches: MatchResult[] = [];

    for (const task of tasks) {
      const { score, breakdown } = calculateMatchScore(user, task);

      // 最低スコアチェック
      if (score < minScore) {
        continue;
      }

      const reason = generateMatchReason(user, task, breakdown);

      userMatches.push({
        userId: user.id,
        taskId: task.id,
        score,
        reason,
        breakdown,
      });
    }

    // ユーザーごとのマッチをスコア降順でソート
    if (sortByScore) {
      userMatches.sort((a, b) => b.score - a.score);
    }

    // 最大マッチ数制限
    const limitedMatches = maxMatchesPerUser
      ? userMatches.slice(0, maxMatchesPerUser)
      : userMatches;

    results.push(...limitedMatches);
  }

  // 全体をスコア降順でソート
  if (sortByScore) {
    results.sort((a, b) => b.score - a.score);
  }

  return results;
}

/**
 * 特定のユーザーに最適なタスクを見つける
 *
 * @param user 利用者
 * @param tasks タスクリスト
 * @param limit 返す最大件数 デフォルト: 5
 * @returns マッチング結果のリスト（スコア降順）
 */
export function findBestTasksForUser(
  user: User,
  tasks: Task[],
  limit: number = 5
): MatchResult[] {
  return matchUsersToTasks([user], tasks, {
    maxMatchesPerUser: limit,
    sortByScore: true,
  });
}

/**
 * 特定のタスクに最適なユーザーを見つける
 *
 * @param task タスク
 * @param users 利用者リスト
 * @param limit 返す最大件数 デフォルト: 5
 * @returns マッチング結果のリスト（スコア降順）
 */
export function findBestUsersForTask(
  task: Task,
  users: User[],
  limit: number = 5
): MatchResult[] {
  const results = matchUsersToTasks(users, [task], {
    sortByScore: true,
  });

  return results.slice(0, limit);
}
