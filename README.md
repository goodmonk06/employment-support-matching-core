# employment-support-matching-core

就労支援A/B型事業所向けの利用者スキルとタスクのマッチングエンジン

利用者の保有スキル、スタミナレベル、利用可能曜日と、タスクの必要スキル、難易度、推奨曜日を照合し、最適なマッチングを提供します。

## Overview

このプロジェクトは、福祉型就労支援施設における利用者とタスクの効果的なマッチングを支援するシステムです。スキルベースのマッチングアルゴリズムにより、各利用者に最適な作業を提案し、施設運営の効率化と利用者の適性に合った作業配分を実現します。

### 主な機能

- **スキルマッチング**: 利用者の保有スキルとタスクの必要スキルを照合
- **スタミナ評価**: 利用者の体力レベルとタスクの難易度を考慮
- **スケジュール調整**: 利用可能曜日と推奨曜日の一致度を評価
- **REST API**: 他システムとの統合が容易なHTTP API
- **型安全**: TypeScriptによる完全な型チェック

## Tech Stack

- **Runtime**: Node.js 20+
- **Language**: TypeScript 5
- **Web Framework**: Fastify 4
- **Validation**: Zod
- **Testing**: Vitest
- **Containerization**: Docker, Docker Compose
- **Linting**: ESLint

## Domain Model

### エンティティ

#### User（利用者）
```typescript
{
  id: string;              // 利用者ID（例: user-001）
  name: string;            // 氏名
  abilities: string[];     // 保有スキル（例: ['清掃', '組立']）
  staminaLevel: 'low' | 'medium' | 'high';  // スタミナレベル
  availableDays: DayOfWeek[];  // 利用可能曜日
}
```

#### Task（タスク）
```typescript
{
  id: string;              // タスクID（例: task-001）
  title: string;           // タスク名
  requiredAbilities: string[];  // 必要スキル
  difficulty: 'easy' | 'medium' | 'hard';  // 難易度
  preferredDays: DayOfWeek[];  // 推奨曜日
}
```

#### MatchResult（マッチング結果）
```typescript
{
  userId: string;          // 利用者ID
  taskId: string;          // タスクID
  score: number;           // マッチングスコア（0-100）
  reason: string;          // マッチング理由
  breakdown: {             // スコア内訳
    abilityScore: number;
    staminaScore: number;
    dayScore: number;
  };
}
```

### スコアリングアルゴリズム

マッチングスコアは以下の3要素から算出されます（0-100点）:

1. **スキル一致度（重み: 50%）**
   - 必要スキルのうち何%を保有しているか
   - 完全一致: 100点、半分一致: 50点、不一致: 0点

2. **スタミナ相性（重み: 30%）**
   - スタミナレベルと難易度の適合性
   - 完全一致: 100点、1段階差: 70点、2段階差: 40点

3. **曜日一致度（重み: 20%）**
   - 推奨曜日のうち何%が利用可能か
   - 完全一致: 100点、半分一致: 50点、不一致: 0点

**総合スコア = (スキル × 0.5) + (スタミナ × 0.3) + (曜日 × 0.2)**

## Getting Started

### Requirements

- Node.js 20 以上
- npm または pnpm
- Docker & Docker Compose（オプション）

### Setup Steps

#### 1. リポジトリのクローンと依存関係のインストール

```bash
git clone <repository-url>
cd employment-support-matching-core
npm install
```

#### 2. 環境変数の設定

```bash
cp .env.example .env
```

`.env`ファイルを必要に応じて編集してください。

#### 3. 開発サーバーの起動

```bash
# シードデータを投入
npm run db:seed

# 開発サーバー起動（ホットリロード有効）
npm run dev
```

サーバーは `http://localhost:3000` で起動します。

#### 4. 動作確認

```bash
# ヘルスチェック
curl http://localhost:3000/health

# ユーザー一覧取得
curl http://localhost:3000/api/users

# タスク一覧取得
curl http://localhost:3000/api/tasks
```

### Docker を使用した起動

```bash
# コンテナのビルドと起動
docker-compose up

# バックグラウンドで起動
docker-compose up -d

# 停止
docker-compose down
```

## Available Scripts

| スクリプト | 説明 |
|----------|------|
| `npm run dev` | 開発サーバーを起動（ホットリロード） |
| `npm run build` | TypeScriptをビルド |
| `npm start` | 本番サーバーを起動 |
| `npm test` | テストを実行（ウォッチモード） |
| `npm run test:run` | テストを1回実行 |
| `npm run lint` | ESLintでコードをチェック |
| `npm run lint:fix` | ESLintで自動修正 |
| `npm run db:seed` | サンプルデータを投入 |
| `npm run example` | コマンドライン例を実行 |

## API Endpoints

### Users

```http
POST   /api/users          # ユーザー作成
GET    /api/users          # ユーザー一覧取得
GET    /api/users/:id      # ユーザー詳細取得
PUT    /api/users/:id      # ユーザー更新
DELETE /api/users/:id      # ユーザー削除
```

### Tasks

```http
POST   /api/tasks          # タスク作成
GET    /api/tasks          # タスク一覧取得
GET    /api/tasks/:id      # タスク詳細取得
PUT    /api/tasks/:id      # タスク更新
DELETE /api/tasks/:id      # タスク削除
```

### Matching

```http
POST   /api/matching                      # マッチング実行
GET    /api/users/:userId/best-tasks      # ユーザーに最適なタスク取得
GET    /api/tasks/:taskId/best-users      # タスクに最適なユーザー取得
```

## Example Flow（垂直スライス）

### 1. ユーザーを作成

```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "山田太郎",
    "abilities": ["清掃", "組立"],
    "staminaLevel": "high",
    "availableDays": ["monday", "wednesday", "friday"]
  }'
```

レスポンス:
```json
{
  "id": "user-001",
  "name": "山田太郎",
  "abilities": ["清掃", "組立"],
  "staminaLevel": "high",
  "availableDays": ["monday", "wednesday", "friday"]
}
```

### 2. タスクを作成

```bash
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "title": "清掃作業",
    "requiredAbilities": ["清掃"],
    "difficulty": "easy",
    "preferredDays": ["monday", "wednesday"]
  }'
```

### 3. マッチングを実行

```bash
curl -X POST http://localhost:3000/api/matching \
  -H "Content-Type: application/json" \
  -d '{
    "minScore": 50,
    "sortByScore": true
  }'
```

レスポンス:
```json
{
  "totalMatches": 15,
  "matches": [
    {
      "userId": "user-001",
      "taskId": "task-001",
      "score": 93,
      "reason": "スキルが高度にマッチ, 難易度が適度, スケジュールが合致",
      "breakdown": {
        "abilityScore": 100,
        "staminaScore": 70,
        "dayScore": 100
      }
    }
  ]
}
```

### 4. 特定ユーザーに最適なタスクを取得

```bash
curl http://localhost:3000/api/users/user-001/best-tasks?limit=3
```

### 5. ユーザー情報を更新

```bash
curl -X PUT http://localhost:3000/api/users/user-001 \
  -H "Content-Type: application/json" \
  -d '{
    "staminaLevel": "medium"
  }'
```

## Testing

```bash
# テスト実行（ウォッチモード）
npm test

# 1回だけ実行
npm run test:run

# カバレッジレポート付き
npm run test:run -- --coverage
```

### テスト構成

- `src/scoring/scoringEngine.test.ts`: スコアリングアルゴリズムのテスト
- `src/matcher.test.ts`: マッチング機能のテスト

## Project Structure

```
employment-support-matching-core/
├── src/                          # コアライブラリ
│   ├── models/                   # データモデル定義
│   │   ├── User.ts
│   │   ├── Task.ts
│   │   ├── MatchResult.ts
│   │   └── index.ts
│   ├── scoring/                  # スコアリングエンジン
│   │   ├── scoringEngine.ts
│   │   └── scoringEngine.test.ts
│   ├── matcher.ts                # マッチングAPI
│   ├── matcher.test.ts
│   └── index.ts
├── server/                       # REST APIサーバー
│   ├── routes/                   # APIルート
│   │   ├── users.ts
│   │   ├── tasks.ts
│   │   └── matching.ts
│   ├── schemas/                  # バリデーションスキーマ
│   │   ├── user.schema.ts
│   │   ├── task.schema.ts
│   │   └── matching.schema.ts
│   ├── store/                    # データストア
│   │   └── InMemoryStore.ts
│   ├── utils/                    # ユーティリティ
│   │   └── errorHandler.ts
│   └── index.ts                  # サーバーエントリーポイント
├── scripts/                      # ユーティリティスクリプト
│   └── seed.ts                   # シードデータ投入
├── examples/                     # 使用例
│   ├── sampleData.ts
│   └── basic-matching.ts
├── Dockerfile                    # Dockerイメージ定義
├── docker-compose.yml            # Docker Compose設定
├── package.json
├── tsconfig.json                 # TypeScript設定（ライブラリ用）
├── tsconfig.server.json          # TypeScript設定（サーバー用）
├── vitest.config.ts              # Vitest設定
├── .eslintrc.json                # ESLint設定
└── README.md
```

## Demo Credentials

シードデータ（`npm run db:seed`）を実行すると、以下のサンプルデータが投入されます：

### 利用者（7名）
- 田中太郎 (user-001): 高スタミナ、清掃・組立・梱包
- 佐藤花子 (user-002): 中スタミナ、PC入力・書類整理・電話応対
- 鈴木一郎 (user-003): 低スタミナ、清掃・軽作業・PC入力
- 高橋美咲 (user-004): 中スタミナ、梱包・仕分け・検品
- 伊藤健太 (user-005): 高スタミナ、組立・検品・清掃
- 山田優子 (user-006): 中スタミナ、書類整理・PC入力・データ入力
- 中村健二 (user-007): 低スタミナ、清掃・軽作業・仕分け

### タスク（8件）
- 事務所フロア清掃 (task-001): 簡単、清掃
- データ入力作業 (task-002): 普通、PC入力・書類整理
- 製品組立ライン (task-003): 難しい、組立・検品
- 商品梱包作業 (task-004): 普通、梱包・仕分け
- 書類ファイリング (task-005): 簡単、書類整理
- 軽作業（検品・仕分け）(task-006): 簡単、検品・仕分け・軽作業
- 電話応対・受付業務 (task-007): 普通、電話応対・PC入力
- 組立作業（精密）(task-008): 難しい、組立

## Future Extensions

### データベース連携

現在はインメモリストアですが、将来的には以下のデータベース連携を想定しています：

- PostgreSQL, MySQL などの RDB
- Prisma ORM による型安全なDB操作
- マイグレーション管理

実装例:
```typescript
// Prisma schema
model User {
  id            String   @id @default(uuid())
  name          String
  abilities     String[]
  staminaLevel  StaminaLevel
  availableDays DayOfWeek[]
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
}
```

### 機能拡張

- [ ] ユーザー認証・認可（JWT、RBAC）
- [ ] マッチング履歴の保存と分析
- [ ] マッチング結果のフィードバック機能
- [ ] 機械学習によるスコアリング精度向上
- [ ] リアルタイム通知（WebSocket）
- [ ] 複数事業所対応（マルチテナント）
- [ ] CSVインポート/エクスポート
- [ ] 詳細な統計レポート生成
- [ ] グラフQL API対応

### インフラ・運用

- [ ] CI/CD パイプライン（GitHub Actions）
- [ ] Kubernetes デプロイメント
- [ ] ロギング・モニタリング（Prometheus, Grafana）
- [ ] パフォーマンス最適化（キャッシング、インデックス）

## Contributing

プルリクエストやIssueは歓迎します。

1. このリポジトリをフォーク
2. フィーチャーブランチを作成 (`git checkout -b feature/amazing-feature`)
3. 変更をコミット (`git commit -m 'Add amazing feature'`)
4. ブランチにプッシュ (`git push origin feature/amazing-feature`)
5. プルリクエストを作成

## License

MIT

---

**Built with ❤️ for employment support facilities**
