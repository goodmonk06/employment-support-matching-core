import { store } from '../server/store/InMemoryStore';

console.log('🌱 Seeding database...\n');

// Clear existing data
store.clear();

// Create users
const users = [
  {
    name: '田中太郎',
    abilities: ['清掃', '組立', '梱包'],
    staminaLevel: 'high' as const,
    availableDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'] as const,
  },
  {
    name: '佐藤花子',
    abilities: ['PC入力', '書類整理', '電話応対'],
    staminaLevel: 'medium' as const,
    availableDays: ['monday', 'wednesday', 'friday'] as const,
  },
  {
    name: '鈴木一郎',
    abilities: ['清掃', '軽作業', 'PC入力'],
    staminaLevel: 'low' as const,
    availableDays: ['tuesday', 'thursday'] as const,
  },
  {
    name: '高橋美咲',
    abilities: ['梱包', '仕分け', '検品'],
    staminaLevel: 'medium' as const,
    availableDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'] as const,
  },
  {
    name: '伊藤健太',
    abilities: ['組立', '検品', '清掃'],
    staminaLevel: 'high' as const,
    availableDays: ['monday', 'wednesday', 'friday', 'saturday'] as const,
  },
  {
    name: '山田優子',
    abilities: ['書類整理', 'PC入力', 'データ入力'],
    staminaLevel: 'medium' as const,
    availableDays: ['tuesday', 'wednesday', 'thursday'] as const,
  },
  {
    name: '中村健二',
    abilities: ['清掃', '軽作業', '仕分け'],
    staminaLevel: 'low' as const,
    availableDays: ['monday', 'friday'] as const,
  },
];

console.log('👥 Creating users...');
users.forEach(userData => {
  const user = store.createUser(userData);
  console.log(`   ✓ ${user.name} (${user.id})`);
});

// Create tasks
const tasks = [
  {
    title: '事務所フロア清掃',
    requiredAbilities: ['清掃'],
    difficulty: 'easy' as const,
    preferredDays: ['monday', 'wednesday', 'friday'] as const,
  },
  {
    title: 'データ入力作業',
    requiredAbilities: ['PC入力', '書類整理'],
    difficulty: 'medium' as const,
    preferredDays: ['tuesday', 'thursday'] as const,
  },
  {
    title: '製品組立ライン',
    requiredAbilities: ['組立', '検品'],
    difficulty: 'hard' as const,
    preferredDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'] as const,
  },
  {
    title: '商品梱包作業',
    requiredAbilities: ['梱包', '仕分け'],
    difficulty: 'medium' as const,
    preferredDays: ['monday', 'wednesday', 'friday'] as const,
  },
  {
    title: '書類ファイリング',
    requiredAbilities: ['書類整理'],
    difficulty: 'easy' as const,
    preferredDays: ['monday', 'tuesday', 'wednesday'] as const,
  },
  {
    title: '軽作業（検品・仕分け）',
    requiredAbilities: ['検品', '仕分け', '軽作業'],
    difficulty: 'easy' as const,
    preferredDays: ['tuesday', 'thursday'] as const,
  },
  {
    title: '電話応対・受付業務',
    requiredAbilities: ['電話応対', 'PC入力'],
    difficulty: 'medium' as const,
    preferredDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'] as const,
  },
  {
    title: '組立作業（精密）',
    requiredAbilities: ['組立'],
    difficulty: 'hard' as const,
    preferredDays: ['wednesday', 'thursday', 'friday'] as const,
  },
];

console.log('\n📋 Creating tasks...');
tasks.forEach(taskData => {
  const task = store.createTask(taskData);
  console.log(`   ✓ ${task.title} (${task.id})`);
});

console.log('\n✅ Seeding completed!');
console.log(`   Users: ${store.getAllUsers().length}`);
console.log(`   Tasks: ${store.getAllTasks().length}`);
console.log('\n💡 Start the server with: npm run dev');
