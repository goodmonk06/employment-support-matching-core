import {
  matchUsersToTasks,
  findBestTasksForUser,
  findBestUsersForTask,
} from '../src';
import { sampleUsers, sampleTasks } from './sampleData';

console.log('='.repeat(80));
console.log('就労支援マッチングエンジン - サンプル実行');
console.log('='.repeat(80));
console.log();

// ============================================
// 1. 全利用者と全タスクのマッチング
// ============================================
console.log('【1】全利用者と全タスクのマッチング結果（上位10件）');
console.log('-'.repeat(80));

const allMatches = matchUsersToTasks(sampleUsers, sampleTasks, {
  minScore: 30, // スコア30以上のみ
  sortByScore: true,
});

allMatches.slice(0, 10).forEach((match, index) => {
  const user = sampleUsers.find(u => u.id === match.userId);
  const task = sampleTasks.find(t => t.id === match.taskId);

  console.log(`${index + 1}. スコア: ${match.score}点`);
  console.log(`   利用者: ${user?.name} (${match.userId})`);
  console.log(`   タスク: ${task?.title} (${match.taskId})`);
  console.log(`   理由: ${match.reason}`);
  if (match.breakdown) {
    console.log(`   内訳: スキル=${match.breakdown.abilityScore}, スタミナ=${match.breakdown.staminaScore}, 曜日=${match.breakdown.dayScore}`);
  }
  console.log();
});

// ============================================
// 2. 特定利用者に最適なタスクを検索
// ============================================
console.log('【2】田中太郎さんに最適なタスク（上位3件）');
console.log('-'.repeat(80));

const targetUser = sampleUsers.find(u => u.name === '田中太郎');
if (targetUser) {
  const bestTasks = findBestTasksForUser(targetUser, sampleTasks, 3);

  bestTasks.forEach((match, index) => {
    const task = sampleTasks.find(t => t.id === match.taskId);
    console.log(`${index + 1}. ${task?.title} - スコア: ${match.score}点`);
    console.log(`   理由: ${match.reason}`);
    console.log();
  });
}

// ============================================
// 3. 特定タスクに最適な利用者を検索
// ============================================
console.log('【3】「データ入力作業」に最適な利用者（上位3件）');
console.log('-'.repeat(80));

const targetTask = sampleTasks.find(t => t.title === 'データ入力作業');
if (targetTask) {
  const bestUsers = findBestUsersForTask(targetTask, sampleUsers, 3);

  bestUsers.forEach((match, index) => {
    const user = sampleUsers.find(u => u.id === match.userId);
    console.log(`${index + 1}. ${user?.name} - スコア: ${match.score}点`);
    console.log(`   理由: ${match.reason}`);
    console.log();
  });
}

// ============================================
// 4. 統計情報
// ============================================
console.log('【4】統計情報');
console.log('-'.repeat(80));
console.log(`総利用者数: ${sampleUsers.length}名`);
console.log(`総タスク数: ${sampleTasks.length}件`);
console.log(`有効マッチ数（スコア30以上）: ${allMatches.length}件`);
console.log(`平均スコア: ${Math.round(allMatches.reduce((sum, m) => sum + m.score, 0) / allMatches.length)}点`);
console.log();

console.log('='.repeat(80));
console.log('実行完了');
console.log('='.repeat(80));
