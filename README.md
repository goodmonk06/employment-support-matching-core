# employment-support-matching-core

福祉型就労支援A/B型事業所向けの利用者スキルと業務タスクのマッチングエンジン。

利用者の保有スキル、スタミナレベル、利用可能曜日と、タスクの必要スキル、難易度、推奨曜日を照合し、最適なマッチングを提供します。

## 特徴

- **インメモリモデル**: DBなしで動作するシンプルな設計
- **ライブラリ構造**: 他システムに組み込み可能
- **スコアリングアルゴリズム**: スキル、スタミナ、曜日の3軸で評価
- **TypeScript完全対応**: 型安全な開発が可能

## Tech Stack

- Node.js
- TypeScript
- スコアリングアルゴリズム

## インストール

```bash
npm install
```

## ビルド

```bash
npm run build
```

## サンプル実行

```bash
npm run example
```

サンプルスクリプトを実行すると、利用者とタスクのマッチング結果がコンソールに表示されます。

## 使い方

### 基本的な使用例

```typescript
import { matchUsersToTasks, User, Task } from 'employment-support-matching-core';

// 利用者データ
const users: User[] = [
  {
    id: 'user-001',
    name: '田中太郎',
    abilities: ['清掃', '組立', '梱包'],
    staminaLevel: 'high',
    availableDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
  },
];

// タスクデータ
const tasks: Task[] = [
  {
    id: 'task-001',
    title: '事務所フロア清掃',
    requiredAbilities: ['清掃'],
    difficulty: 'easy',
    preferredDays: ['monday', 'wednesday', 'friday'],
  },
];

// マッチング実行
const matches = matchUsersToTasks(users, tasks, {
  minScore: 30,        // スコア30以上のみ
  sortByScore: true,   // スコア降順でソート
});

console.log(matches);
```

### 特定利用者に最適なタスクを検索

```typescript
import { findBestTasksForUser } from 'employment-support-matching-core';

const bestTasks = findBestTasksForUser(user, tasks, 5);
// 上位5件のマッチング結果を取得
```

### 特定タスクに最適な利用者を検索

```typescript
import { findBestUsersForTask } from 'employment-support-matching-core';

const bestUsers = findBestUsersForTask(task, users, 5);
// 上位5件のマッチング結果を取得
```

## スコアリングロジック

マッチングスコアは以下の3要素から算出されます（0-100点）:

1. **スキル一致度（重み: 50%）**
   - 必要スキルのうち何%を保有しているか

2. **スタミナ相性（重み: 30%）**
   - スタミナレベルと難易度の相性
   - 完全一致: 100点、1段階差: 70点、2段階差: 40点

3. **曜日一致度（重み: 20%）**
   - 推奨曜日のうち何%が利用可能か

## プロジェクト構成

```
employment-support-matching-core/
├── src/
│   ├── models/              # データモデル定義
│   │   ├── User.ts          # 利用者モデル
│   │   ├── Task.ts          # タスクモデル
│   │   ├── MatchResult.ts   # マッチング結果モデル
│   │   └── index.ts
│   ├── scoring/             # スコアリングエンジン
│   │   └── scoringEngine.ts
│   ├── matcher.ts           # マッチングAPI
│   └── index.ts             # エントリーポイント
├── examples/                # サンプルコード
│   ├── sampleData.ts        # サンプルデータ
│   └── basic-matching.ts    # 基本的な使用例
├── package.json
├── tsconfig.json
└── README.md
```

## 将来の拡張予定

### データベース連携

現在はインメモリモデルですが、将来的には以下のデータベース連携を想定しています:

- PostgreSQL, MySQL などの RDB
- MongoDB などの NoSQL
- ORMライブラリ（Prisma, TypeORM など）を使用した実装

### Web API化

REST APIまたはGraphQL APIとして提供する予定:

```typescript
// 想定例
POST /api/matching
{
  "users": [...],
  "tasks": [...],
  "options": { "minScore": 30 }
}

GET /api/users/:userId/best-tasks?limit=5
GET /api/tasks/:taskId/best-users?limit=5
```

### 機能拡張

- マッチング履歴の記録と分析
- 機械学習を用いたスコアリング精度向上
- リアルタイムマッチング通知
- 利用者・タスクの詳細プロファイル対応
- 複数事業所対応

## ライセンス

MIT

## 貢献

プルリクエストやIssueは歓迎します。
