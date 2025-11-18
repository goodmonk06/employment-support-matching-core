import { store } from '../server/store/InMemoryStore';
import { matchUsersToTasks } from '../src/matcher';

console.log('🌱 Enhanced seeding starting...\n');

// Clear existing data
store.clear();

// =====================================
// 1. Create Organizations
// =====================================
console.log('🏢 Creating organizations...');

const org1 = store.createOrganization({
  name: 'さくら就労支援センター',
  type: 'A型',
  location: {
    prefecture: '東京都',
    city: '世田谷区',
    address: '桜新町1-2-3',
  },
  capacity: 20,
  settings: {
    workingHours: {
      start: '09:00',
      end: '17:00',
    },
    defaultBreakMinutes: 60,
    enabledFeatures: ['matching', 'schedules', 'analytics'],
  },
  status: 'active',
  createdAt: new Date(),
  updatedAt: new Date(),
});

const org2 = store.createOrganization({
  name: 'ひまわり作業所',
  type: 'B型',
  location: {
    prefecture: '神奈川県',
    city: '横浜市',
    address: '青葉区美しが丘2-15-10',
  },
  capacity: 15,
  settings: {
    workingHours: {
      start: '10:00',
      end: '16:00',
    },
    defaultBreakMinutes: 60,
    enabledFeatures: ['matching', 'schedules'],
  },
  status: 'active',
  createdAt: new Date(),
  updatedAt: new Date(),
});

console.log(`   ✓ ${org1.name} (${org1.id})`);
console.log(`   ✓ ${org2.name} (${org2.id})`);

// =====================================
// 2. Create Skill Categories
// =====================================
console.log('\n📚 Creating skill categories...');

const categories = [
  {
    name: '清掃・軽作業',
    skills: ['清掃', '軽作業', '整理整頓', '仕分け'],
    difficultyLevel: 'beginner' as const,
    order: 1,
  },
  {
    name: '組立・検品',
    skills: ['組立', '検品', '梱包', '包装'],
    difficultyLevel: 'intermediate' as const,
    order: 2,
  },
  {
    name: '事務作業',
    skills: ['PC入力', '書類整理', 'データ入力', 'ファイリング'],
    difficultyLevel: 'intermediate' as const,
    order: 3,
  },
  {
    name: '接客・応対',
    skills: ['電話応対', '受付業務', '接客'],
    difficultyLevel: 'advanced' as const,
    order: 4,
  },
];

categories.forEach(cat => {
  const created = store.createSkillCategory({ ...cat, isActive: true });
  console.log(`   ✓ ${created.name}`);
});

// =====================================
// 3. Create Users with rich profiles
// =====================================
console.log('\n👥 Creating users...');

const users = [
  {
    organizationId: org1.id,
    name: '田中太郎',
    abilities: ['清掃', '組立', '梱包'],
    staminaLevel: 'high' as const,
    availableDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'] as const,
    status: 'active' as const,
    profile: {
      age: 28,
      disabilityType: '知的障害',
      preferredTaskTypes: ['組立作業', '梱包作業'],
      goals: ['作業スピードの向上', 'スキルの習得'],
    },
    tags: ['経験者', '安定稼働'],
  },
  {
    organizationId: org1.id,
    name: '佐藤花子',
    abilities: ['PC入力', '書類整理', '電話応対'],
    staminaLevel: 'medium' as const,
    availableDays: ['monday', 'wednesday', 'friday'] as const,
    status: 'active' as const,
    profile: {
      age: 32,
      disabilityType: '精神障害',
      preferredTaskTypes: ['事務作業'],
      avoidTaskTypes: ['重労働'],
      goals: ['フルタイム勤務を目指す'],
    },
    tags: ['PC得意', '几帳面'],
  },
  {
    organizationId: org1.id,
    name: '鈴木一郎',
    abilities: ['清掃', '軽作業', 'PC入力'],
    staminaLevel: 'low' as const,
    availableDays: ['tuesday', 'thursday'] as const,
    status: 'active' as const,
    profile: {
      age: 45,
      disabilityType: '身体障害',
      preferredTaskTypes: ['清掃', '軽作業'],
      goals: ['体力維持', '継続的な就労'],
    },
    tags: ['ベテラン', 'マイペース'],
  },
  {
    organizationId: org2.id,
    name: '高橋美咲',
    abilities: ['梱包', '仕分け', '検品'],
    staminaLevel: 'medium' as const,
    availableDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'] as const,
    status: 'active' as const,
    profile: {
      age: 24,
      disabilityType: '発達障害',
      preferredTaskTypes: ['梱包', '検品'],
      goals: ['正確性の向上', '一般就労を目指す'],
    },
    tags: ['丁寧', '向上心あり'],
  },
  {
    organizationId: org2.id,
    name: '伊藤健太',
    abilities: ['組立', '検品', '清掃'],
    staminaLevel: 'high' as const,
    availableDays: ['monday', 'wednesday', 'friday', 'saturday'] as const,
    status: 'active' as const,
    profile: {
      age: 22,
      disabilityType: '知的障害',
      preferredTaskTypes: ['組立', '検品'],
      goals: ['技能向上', '資格取得'],
    },
    tags: ['若手', '積極的'],
  },
  {
    organizationId: org1.id,
    name: '山田優子',
    abilities: ['書類整理', 'PC入力', 'データ入力'],
    staminaLevel: 'medium' as const,
    availableDays: ['tuesday', 'wednesday', 'thursday'] as const,
    status: 'active' as const,
    profile: {
      age: 38,
      disabilityType: '精神障害',
      preferredTaskTypes: ['事務作業', 'データ入力'],
      goals: ['安定した勤務', 'スキルアップ'],
    },
    tags: ['事務経験あり', '正確'],
  },
  {
    organizationId: org2.id,
    name: '中村健二',
    abilities: ['清掃', '軽作業', '仕分け'],
    staminaLevel: 'low' as const,
    availableDays: ['monday', 'friday'] as const,
    status: 'active' as const,
    profile: {
      age: 50,
      disabilityType: '身体障害',
      preferredTaskTypes: ['清掃', '軽作業'],
      goals: ['健康維持', '社会参加'],
    },
    tags: ['経験豊富', '穏やか'],
  },
  {
    organizationId: org1.id,
    name: '小林真由美',
    abilities: ['PC入力', '電話応対', '受付業務'],
    staminaLevel: 'medium' as const,
    availableDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'] as const,
    status: 'active' as const,
    profile: {
      age: 29,
      disabilityType: '精神障害',
      preferredTaskTypes: ['受付', '事務'],
      goals: ['対人スキル向上', '自信をつける'],
    },
    tags: ['コミュニケーション得意', '明るい'],
  },
];

users.forEach(userData => {
  const user = store.createUser(userData);
  console.log(`   ✓ ${user.name} (${user.id}) - ${user.organizationId}`);
});

// =====================================
// 4. Create Tasks with rich details
// =====================================
console.log('\n📋 Creating tasks...');

const tasks = [
  {
    organizationId: org1.id,
    title: '事務所フロア清掃',
    description: 'オフィスフロアの日常清掃業務',
    requiredAbilities: ['清掃'],
    difficulty: 'easy' as const,
    preferredDays: ['monday', 'wednesday', 'friday'] as const,
    category: '清掃',
    status: 'active' as const,
    details: {
      estimatedDurationMinutes: 90,
      maxParticipants: 2,
      location: '2階オフィス',
      requiredMaterials: ['掃除機', 'モップ', '洗剤'],
      precautions: ['腰への負担に注意'],
    },
    tags: ['定期業務', '初心者可'],
  },
  {
    organizationId: org1.id,
    title: 'データ入力作業',
    description: '顧客データのPC入力業務',
    requiredAbilities: ['PC入力', '書類整理'],
    difficulty: 'medium' as const,
    preferredDays: ['tuesday', 'thursday'] as const,
    category: '事務',
    status: 'active' as const,
    details: {
      estimatedDurationMinutes: 120,
      maxParticipants: 3,
      location: '作業室A',
      requiredMaterials: ['PC', 'マウス'],
      precautions: ['長時間のPC作業による疲労に注意'],
    },
    tags: ['スキル必要', '集中力必要'],
  },
  {
    organizationId: org1.id,
    title: '製品組立ライン',
    description: '小型製品の組立作業',
    requiredAbilities: ['組立', '検品'],
    difficulty: 'hard' as const,
    preferredDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'] as const,
    category: '組立',
    status: 'active' as const,
    details: {
      estimatedDurationMinutes: 180,
      maxParticipants: 4,
      location: '作業室B',
      requiredMaterials: ['組立工具', '部品'],
      precautions: ['細かい作業のため集中力が必要'],
    },
    tags: ['経験者推奨', '高難度'],
  },
  {
    organizationId: org2.id,
    title: '商品梱包作業',
    description: 'ECサイト向け商品の梱包',
    requiredAbilities: ['梱包', '仕分け'],
    difficulty: 'medium' as const,
    preferredDays: ['monday', 'wednesday', 'friday'] as const,
    category: '梱包',
    status: 'active' as const,
    details: {
      estimatedDurationMinutes: 150,
      maxParticipants: 3,
      location: '梱包室',
      requiredMaterials: ['段ボール', '緩衝材', 'テープ'],
      precautions: ['正確性が重要'],
    },
    tags: ['人気業務', '中級'],
  },
  {
    organizationId: org2.id,
    title: '書類ファイリング',
    description: '各種書類の整理とファイリング',
    requiredAbilities: ['書類整理'],
    difficulty: 'easy' as const,
    preferredDays: ['monday', 'tuesday', 'wednesday'] as const,
    category: '事務',
    status: 'active' as const,
    details: {
      estimatedDurationMinutes: 60,
      maxParticipants: 2,
      location: '事務室',
      requiredMaterials: ['ファイル', 'ラベル'],
      precautions: ['丁寧な作業が求められる'],
    },
    tags: ['初心者可', '軽作業'],
  },
  {
    organizationId: org2.id,
    title: '軽作業（検品・仕分け）',
    description: '入荷商品の検品と仕分け',
    requiredAbilities: ['検品', '仕分け', '軽作業'],
    difficulty: 'easy' as const,
    preferredDays: ['tuesday', 'thursday'] as const,
    category: '軽作業',
    status: 'active' as const,
    details: {
      estimatedDurationMinutes: 120,
      maxParticipants: 4,
      location: '倉庫',
      requiredMaterials: ['チェックリスト'],
      precautions: ['立ち仕事が中心'],
    },
    tags: ['初心者歓迎', '人気'],
  },
  {
    organizationId: org1.id,
    title: '電話応対・受付業務',
    description: '来客対応と電話応対',
    requiredAbilities: ['電話応対', 'PC入力'],
    difficulty: 'medium' as const,
    preferredDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'] as const,
    category: '接客',
    status: 'active' as const,
    details: {
      estimatedDurationMinutes: 240,
      maxParticipants: 1,
      location: '受付',
      requiredMaterials: ['電話', 'PC', '受付マニュアル'],
      precautions: ['コミュニケーション能力が必要'],
    },
    tags: ['スキル必要', '責任重要'],
  },
  {
    organizationId: org1.id,
    title: '組立作業（精密）',
    description: '精密部品の組立作業',
    requiredAbilities: ['組立'],
    difficulty: 'hard' as const,
    preferredDays: ['wednesday', 'thursday', 'friday'] as const,
    category: '組立',
    status: 'active' as const,
    details: {
      estimatedDurationMinutes: 180,
      maxParticipants: 2,
      location: 'クリーンルーム',
      requiredMaterials: ['精密工具', '拡大鏡'],
      precautions: ['高度な集中力と正確性が必要'],
    },
    tags: ['高難度', '経験者のみ'],
  },
];

tasks.forEach(taskData => {
  const task = store.createTask(taskData);
  console.log(`   ✓ ${task.title} (${task.id}) - ${task.organizationId}`);
});

// =====================================
// 5. Create initial match histories
// =====================================
console.log('\n📊 Creating initial match histories...');

const allUsers = store.getAllUsers();
const allTasks = store.getAllTasks();

// Generate some match histories
let historyCount = 0;
allUsers.slice(0, 3).forEach(user => {
  const userTasks = allTasks.filter(t => t.organizationId === user.organizationId).slice(0, 2);

  userTasks.forEach(task => {
    const matches = matchUsersToTasks([user], [task]);
    if (matches.length > 0) {
      const match = matches[0];
      const history = store.createMatchHistory({
        organizationId: user.organizationId!,
        userId: user.id,
        taskId: task.id,
        score: match.score,
        reason: match.reason,
        breakdown: match.breakdown!,
        status: Math.random() > 0.5 ? 'completed' : 'in_progress',
        scheduledStart: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        outcome: Math.random() > 0.5 ? {
          completed: true,
          qualityRating: Math.floor(Math.random() * 2) + 4, // 4-5
          effortRating: Math.floor(Math.random() * 2) + 4,
          notes: '順調に作業完了',
        } : undefined,
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(),
      });
      historyCount++;
    }
  });
});

console.log(`   ✓ Created ${historyCount} match history records`);

// =====================================
// 6. Create sample work schedule
// =====================================
console.log('\n📅 Creating sample work schedule...');

const schedule1 = store.createWorkSchedule({
  organizationId: org1.id,
  name: '2024年1月第2週スケジュール',
  period: {
    start: new Date('2024-01-08'),
    end: new Date('2024-01-12'),
  },
  status: 'published',
  assignments: [
    {
      id: 'asn-001',
      userId: allUsers[0].id,
      taskId: allTasks[0].id,
      dayOfWeek: 'monday',
      timeSlot: { start: '09:00', end: '12:00' },
      status: 'completed',
    },
    {
      id: 'asn-002',
      userId: allUsers[1].id,
      taskId: allTasks[1].id,
      dayOfWeek: 'tuesday',
      timeSlot: { start: '10:00', end: '15:00' },
      status: 'completed',
    },
    {
      id: 'asn-003',
      userId: allUsers[0].id,
      taskId: allTasks[2].id,
      dayOfWeek: 'wednesday',
      timeSlot: { start: '09:00', end: '16:00' },
      status: 'scheduled',
    },
  ],
  metadata: {
    totalAssignments: 3,
    totalUsers: 2,
    totalTasks: 3,
  },
  createdAt: new Date(),
  updatedAt: new Date(),
});

console.log(`   ✓ ${schedule1.name} (${schedule1.id})`);

// =====================================
// Summary
// =====================================
console.log('\n' + '='.repeat(60));
console.log('✅ Enhanced seeding completed!');
console.log('='.repeat(60));
console.log(`\n📊 Summary:`);
console.log(`   Organizations: ${store.getAllOrganizations().length}`);
console.log(`   Users: ${store.getAllUsers().length}`);
console.log(`   Tasks: ${store.getAllTasks().length}`);
console.log(`   Skill Categories: ${store.getAllSkillCategories().length}`);
console.log(`   Match Histories: ${store.getAllMatchHistories().length}`);
console.log(`   Work Schedules: ${store.getAllWorkSchedules().length}`);
console.log(`\n💡 Start the server with: npm run dev`);
console.log(`   Then visit: http://localhost:3000/api/organizations\n`);
