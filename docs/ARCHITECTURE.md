# Architecture Guide

## Overview

このシステムは、就労支援施設における利用者とタスクの最適なマッチングを実現するための、エンタープライズグレードのマッチングエンジンです。

### Design Principles

1. **Separation of Concerns**: ドメインロジック、API、インフラの明確な分離
2. **Extensibility**: アダプターパターンによる外部サービスとの統合
3. **Type Safety**: TypeScriptによるエンドツーエンドの型安全性
4. **Observability**: ログ、メトリクス、イベントによる完全な可視性
5. **Testability**: 依存性注入とモジュール設計による高いテスト容易性

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      External Systems                        │
│  (Notifications, Calendars, Monitoring, HR Systems)          │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       │ (via Adapters)
                       │
┌──────────────────────▼──────────────────────────────────────┐
│                     API Layer (Fastify)                      │
│  ┌────────────┬────────────┬──────────┬────────────────┐    │
│  │   Users    │   Tasks    │ Matching │ Organizations  │    │
│  │   Routes   │   Routes   │  Routes  │    Routes      │    │
│  └────────────┴────────────┴──────────┴────────────────┘    │
│  ┌────────────┬────────────────────────────────────────┐    │
│  │  History   │         Schedules                      │    │
│  │  Routes    │         Routes                         │    │
│  └────────────┴────────────────────────────────────────┘    │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       │ (uses)
                       │
┌──────────────────────▼──────────────────────────────────────┐
│                   Business Logic Layer                       │
│  ┌────────────────────────────────────────────────────┐     │
│  │          Matching Engine (Core Algorithm)          │     │
│  │  - calculateAbilityScore()                         │     │
│  │  - calculateStaminaScore()                         │     │
│  │  - calculateDayScore()                             │     │
│  │  - matchUsersToTasks()                             │     │
│  └────────────────────────────────────────────────────┘     │
│  ┌────────────────────────────────────────────────────┐     │
│  │              Domain Services                       │     │
│  │  - Schedule Optimization                           │     │
│  │  - Performance Analysis                            │     │
│  │  - Skill Assessment                                │     │
│  └────────────────────────────────────────────────────┘     │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       │ (persists via)
                       │
┌──────────────────────▼──────────────────────────────────────┐
│                    Data Layer                                │
│  ┌────────────────────────────────────────────────────┐     │
│  │          InMemoryStore (Abstraction)               │     │
│  │  - Users, Tasks, Organizations                     │     │
│  │  - MatchHistory, Schedules                         │     │
│  │  - SkillCategories, PerformanceMetrics             │     │
│  └────────────────────────────────────────────────────┘     │
│                                                              │
│  Future: PostgreSQL / Prisma ORM                             │
└──────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│                  Cross-Cutting Concerns                       │
│  ┌────────────┬────────────┬──────────┬────────────────┐    │
│  │  Logger    │  Metrics   │  Events  │    Adapters    │    │
│  │            │            │   Bus    │  (Interfaces)  │    │
│  └────────────┴────────────┴──────────┴────────────────┘    │
└──────────────────────────────────────────────────────────────┘
```

## Layer Details

### 1. API Layer (`server/`)

**Responsibility**: HTTP通信、リクエストバリデーション、レスポンス整形

**Components**:
- **Routes**: RESTful endpoint definitions
  - `users.ts`: User CRUD operations
  - `tasks.ts`: Task CRUD operations
  - `matching.ts`: Matching execution and recommendations
  - `organizations.ts`: Organization management
  - `history.ts`: Match history and analytics
  - `schedules.ts`: Schedule creation and management

- **Schemas**: Zod validation schemas
  - Input validation for all endpoints
  - Type-safe request/response contracts

- **Error Handling**: Centralized error handler
  - Consistent error response format
  - Proper HTTP status codes
  - Error logging and tracking

### 2. Business Logic Layer (`src/`)

**Responsibility**: ドメインロジック、ビジネスルール、アルゴリズム

**Components**:
- **Models**: Core domain entities
  - `User`, `Task`, `MatchResult`
  - `Organization`, `MatchHistory`, `WorkSchedule`
  - `SkillCategory`, `PerformanceMetric`

- **Scoring Engine**: Matching algorithm implementation
  - Multi-factor scoring (skills, stamina, schedule)
  - Configurable weights and thresholds
  - Detailed score breakdowns

- **Matcher**: High-level matching orchestration
  - `matchUsersToTasks()`: Batch matching
  - `findBestTasksForUser()`: User-centric recommendations
  - `findBestUsersForTask()`: Task-centric recommendations

### 3. Data Layer (`server/store/`)

**Responsibility**: データ永続化、CRUD操作

**Current Implementation**: InMemoryStore
- Map-based storage for rapid prototyping
- Full CRUD operations for all entities
- Filtering and querying capabilities

**Future Migration Path**:
- PostgreSQL with Prisma ORM
- Transaction support
- Complex queries and aggregations
- Data integrity constraints

### 4. Library Layer (`src/lib/`)

**Responsibility**: 共通ユーティリティ、インフラサービス

**Components**:
- **Logger**: Structured logging
  - Contextual logging with correlation IDs
  - Log level filtering
  - Child logger creation

- **Metrics**: Business and technical metrics
  - Counters, gauges, histograms
  - Custom metric recording
  - Metrics export endpoint

- **Events**: Domain event system
  - Typed event bus
  - Event handlers registration
  - Event history tracking

- **Adapters**: External service integrations
  - `INotificationAdapter`: Email, SMS, push notifications
  - `IMetricsAdapter`: Monitoring systems (Datadog, Prometheus)
  - `ICalendarAdapter`: Calendar integrations (Google Calendar, Outlook)

## Data Flow

### Example: User-Task Matching Flow

```
1. Client Request
   POST /api/matching
   { minScore: 50, sortByScore: true }

2. API Layer (server/routes/matching.ts)
   ├─ Validate request with Zod schema
   ├─ Extract users and tasks from store
   └─ Call matchUsersToTasks()

3. Business Logic (src/matcher.ts)
   ├─ For each (user, task) pair:
   │  ├─ calculateMatchScore()
   │  │  ├─ calculateAbilityScore()
   │  │  ├─ calculateStaminaScore()
   │  │  └─ calculateDayScore()
   │  └─ generateMatchReason()
   ├─ Filter by minScore
   ├─ Sort by score
   └─ Return MatchResult[]

4. Event Emission
   ├─ Create MatchCompletedEvent
   ├─ Emit via eventBus
   └─ Trigger registered handlers
      ├─ Log event
      ├─ Record metrics
      └─ (Future) Send notifications

5. Response
   {
     totalMatches: 15,
     matches: [...MatchResult]
   }
```

## Extension Points

### Adding a New Adapter

1. Define interface in `src/lib/adapters/`
```typescript
export interface INewAdapter {
  doSomething(param: Type): Promise<Result>;
}
```

2. Create implementation
```typescript
export class ConcreteAdapter implements INewAdapter {
  async doSomething(param: Type): Promise<Result> {
    // Implementation
  }
}
```

3. Register in dependency injection (future)
```typescript
const adapter = new ConcreteAdapter();
// Use in services
```

### Adding a New Entity

1. Define model in `src/models/NewEntity.ts`
2. Add to InMemoryStore in `server/store/InMemoryStore.ts`
3. Create routes in `server/routes/newEntity.ts`
4. Register routes in `server/index.ts`
5. Add validation schemas
6. Update seed data
7. Add tests

### Adding a New Domain Event

1. Define event type in `src/lib/events.ts`
```typescript
export interface NewEvent extends DomainEvent<DataType> {
  type: 'entity.action';
}
```

2. Emit event in business logic
```typescript
const event = createEvent('entity.action', data);
await eventBus.emit(event);
```

3. Register handlers
```typescript
eventBus.on('entity.action', async (event) => {
  // Handle event
});
```

## Scalability Considerations

### Current Limitations (In-Memory)
- Single-process only
- No data persistence
- Limited to server RAM
- No distributed operations

### Migration to Production Database

**Step 1**: Add Prisma
```bash
npm install prisma @prisma/client
npx prisma init
```

**Step 2**: Define schema
```prisma
model User {
  id            String   @id @default(uuid())
  name          String
  abilities     String[]
  staminaLevel  String
  // ... other fields
}
```

**Step 3**: Generate client & migrate
```bash
npx prisma generate
npx prisma migrate dev
```

**Step 4**: Replace InMemoryStore with Prisma client
```typescript
export class PrismaStore {
  private prisma = new PrismaClient();

  async createUser(data: CreateUserInput) {
    return this.prisma.user.create({ data });
  }
  // ... other methods
}
```

### Horizontal Scaling

1. **Stateless API**: Already achieved - no session state
2. **Load Balancer**: Use nginx/HAProxy
3. **Database Connection Pooling**: Configure Prisma pool
4. **Cache Layer**: Add Redis for frequently accessed data
5. **Message Queue**: For async processing (matching jobs)

### Performance Optimization

1. **Indexing**: Add database indexes on frequently queried fields
2. **Caching**: Cache match results, user/task lookups
3. **Pagination**: Implement cursor-based pagination for large result sets
4. **Batch Operations**: Bulk insert/update for seed data
5. **Query Optimization**: Use Prisma includes/selects strategically

## Security Considerations

### Current State
- Basic input validation with Zod
- CORS enabled (configure for production)
- No authentication/authorization

### Production Requirements

1. **Authentication**: JWT or session-based auth
2. **Authorization**: Role-based access control (RBAC)
3. **Rate Limiting**: Prevent abuse
4. **Input Sanitization**: SQL injection prevention (Prisma helps)
5. **HTTPS**: TLS encryption in transit
6. **Secrets Management**: Environment variables, vault
7. **Audit Logging**: Track all data modifications

## Monitoring & Observability

### Current Implementation
- Structured JSON logging
- Basic metrics collection
- Event tracking

### Production Monitoring Stack

1. **Logging**:
   - Centralized logging (ELK stack, Datadog)
   - Log aggregation and search
   - Alert on error patterns

2. **Metrics**:
   - Application metrics (Prometheus)
   - Visualization (Grafana)
   - Business metrics dashboards

3. **Tracing**:
   - Distributed tracing (Jaeger, Datadog APM)
   - Request flow visualization
   - Performance bottleneck identification

4. **Alerting**:
   - Error rate thresholds
   - Response time degradation
   - Resource utilization
   - Business metric anomalies

## Testing Strategy

### Unit Tests
- Domain logic (scoring algorithms)
- Pure functions
- Business rules

### Integration Tests
- API endpoints
- Database operations
- External adapter mocks

### End-to-End Tests
- Full user flows
- Multi-step scenarios
- Real data scenarios

### Performance Tests
- Load testing (k6, Artillery)
- Stress testing
- Capacity planning

## Deployment

### Development
```bash
docker-compose up
```

### Production (Future)

**Option 1: Traditional VPS**
```bash
npm run build
npm start
```

**Option 2: Container Orchestration (Kubernetes)**
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: matching-engine
spec:
  replicas: 3
  template:
    spec:
      containers:
      - name: app
        image: matching-engine:latest
        ports:
        - containerPort: 3000
```

**Option 3: Serverless (AWS Lambda)**
- API Gateway + Lambda functions
- DynamoDB for storage
- EventBridge for events

## Future Roadmap

### Short Term (1-3 months)
- [ ] PostgreSQL integration
- [ ] Authentication & authorization
- [ ] Enhanced test coverage (>80%)
- [ ] API documentation (OpenAPI/Swagger)
- [ ] Performance benchmarks

### Medium Term (3-6 months)
- [ ] Machine learning-enhanced matching
- [ ] Real-time notifications
- [ ] Advanced analytics dashboard
- [ ] Multi-language support (i18n)
- [ ] Mobile app integration

### Long Term (6-12 months)
- [ ] AI-powered skill development recommendations
- [ ] Integration marketplace
- [ ] White-label solution
- [ ] SaaS multi-tenancy
- [ ] Advanced reporting & BI

