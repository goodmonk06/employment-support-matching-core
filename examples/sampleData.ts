import { User, Task } from '../src/models';

/**
 * サンプル利用者データ
 */
export const sampleUsers: User[] = [
  {
    id: 'user-001',
    name: '田中太郎',
    abilities: ['清掃', '組立', '梱包'],
    staminaLevel: 'high',
    availableDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
  },
  {
    id: 'user-002',
    name: '佐藤花子',
    abilities: ['PC入力', '書類整理', '電話応対'],
    staminaLevel: 'medium',
    availableDays: ['monday', 'wednesday', 'friday'],
  },
  {
    id: 'user-003',
    name: '鈴木一郎',
    abilities: ['清掃', '軽作業', 'PC入力'],
    staminaLevel: 'low',
    availableDays: ['tuesday', 'thursday'],
  },
  {
    id: 'user-004',
    name: '高橋美咲',
    abilities: ['梱包', '仕分け', '検品'],
    staminaLevel: 'medium',
    availableDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
  },
  {
    id: 'user-005',
    name: '伊藤健太',
    abilities: ['組立', '検品', '清掃'],
    staminaLevel: 'high',
    availableDays: ['monday', 'wednesday', 'friday', 'saturday'],
  },
];

/**
 * サンプルタスクデータ
 */
export const sampleTasks: Task[] = [
  {
    id: 'task-001',
    title: '事務所フロア清掃',
    requiredAbilities: ['清掃'],
    difficulty: 'easy',
    preferredDays: ['monday', 'wednesday', 'friday'],
  },
  {
    id: 'task-002',
    title: 'データ入力作業',
    requiredAbilities: ['PC入力', '書類整理'],
    difficulty: 'medium',
    preferredDays: ['tuesday', 'thursday'],
  },
  {
    id: 'task-003',
    title: '製品組立ライン',
    requiredAbilities: ['組立', '検品'],
    difficulty: 'hard',
    preferredDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
  },
  {
    id: 'task-004',
    title: '商品梱包作業',
    requiredAbilities: ['梱包', '仕分け'],
    difficulty: 'medium',
    preferredDays: ['monday', 'wednesday', 'friday'],
  },
  {
    id: 'task-005',
    title: '書類ファイリング',
    requiredAbilities: ['書類整理'],
    difficulty: 'easy',
    preferredDays: ['monday', 'tuesday', 'wednesday'],
  },
  {
    id: 'task-006',
    title: '軽作業（検品・仕分け）',
    requiredAbilities: ['検品', '仕分け', '軽作業'],
    difficulty: 'easy',
    preferredDays: ['tuesday', 'thursday'],
  },
];
