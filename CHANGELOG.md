# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [2.0.0] - 2024-01-XX

### Added - Phase 3: Production-Grade Ecosystem Ready

#### Domain Model Expansion
- **Organization** entity for multi-tenant support
- **MatchHistory** entity for tracking matching outcomes and performance
- **WorkSchedule** entity for weekly/monthly schedule management
- **SkillCategory** entity for hierarchical skill taxonomy
- **PerformanceMetric** entity for user progress tracking
- Enhanced **User** model with profile, status, tags, and timestamps
- Enhanced **Task** model with descriptions, categories, details, and metadata

#### API Endpoints
- **Organizations API**: Full CRUD + statistics endpoint
- **History API**: Match history tracking with filtering and user summaries
- **Schedules API**: Schedule creation, publishing, and management
- **Metrics endpoint**: `/metrics` for system health and business metrics
- Expanded existing APIs to support new entity relationships

#### Infrastructure & Extensibility
- **Event System**: Domain events with typed event bus
- **Adapter Interfaces**:
  - `INotificationAdapter` for external notification services
  - `IMetricsAdapter` for monitoring integrations
  - `ICalendarAdapter` for calendar system integrations
- **Structured Logging**: Contextual logging with correlation IDs
- **Metrics Collection**: Business and technical metrics tracking
- **In-memory Implementations**: Development-ready adapter implementations

#### Developer Experience
- Enhanced seed script with 8 users, 8 tasks, organizations, and sample data
- `db:seed:enhanced` command for comprehensive demo data
- `typecheck` script for TypeScript validation
- `format` script for code formatting (Prettier)
- Metrics endpoint for system observability

#### Documentation
- `docs/PHASE3_OVERVIEW.md` - Detailed Phase 3 implementation plan
- Enhanced README with complete API documentation
- Inline code documentation throughout

### Changed

#### Breaking Changes
- **User model**: Added optional fields (`organizationId`, `status`, `profile`, `tags`, `createdAt`, `updatedAt`)
- **Task model**: Added optional fields (`organizationId`, `description`, `category`, `status`, `details`, `tags`, `createdAt`, `updatedAt`)
- **InMemoryStore**: Methods now accept `organizationId` filter parameter
- Server startup now displays comprehensive endpoint listing

#### Improvements
- Server startup output includes data counts and all available endpoints
- Enhanced error messages with proper HTTP status codes
- Improved type safety across all layers
- Better separation of concerns (models, lib, server layers)

### Technical Details

#### New Dependencies
- prettier: Code formatting

#### File Structure
```
src/
├── lib/              # Shared libraries
│   ├── adapters/     # Integration adapters
│   ├── events.ts     # Event system
│   ├── logger.ts     # Logging
│   └── metrics.ts    # Metrics
├── models/           # Extended with 5 new entities
server/
├── routes/           # 3 new route modules
└── store/            # Expanded to handle all entities
```

## [1.0.0] - 2024-01-XX

### Added - Phase 2: Vertical Slice & Production Foundations

#### Core Features
- REST API server using Fastify
- User CRUD operations
- Task CRUD operations
- Matching API with three-factor scoring algorithm
- Zod validation for all inputs
- Centralized error handling
- CORS support

#### Infrastructure
- Docker support with Dockerfile
- docker-compose.yml for local development
- .env.example for configuration
- ESLint configuration
- Vitest test framework

#### Testing
- Unit tests for scoring engine
- Integration tests for matcher
- Test coverage for core domain logic

#### Documentation
- Comprehensive README
- API endpoint documentation
- Setup and deployment guides
- Example usage flows

#### Developer Experience
- `npm run dev` - Development server with hot reload
- `npm run build` - Production build
- `npm test` - Test execution
- `npm run lint` - Code linting
- `npm run db:seed` - Basic seed data

## [0.1.0] - Initial Release

### Added
- Basic matching algorithm (skill, stamina, schedule scoring)
- User and Task models
- MatchResult output
- Command-line example script
- Basic README

---

## Migration Guide

### From 1.x to 2.x

#### User Model Changes
If you have existing User data, you may need to add default values for new optional fields:

```typescript
// Old User
{
  id: "user-001",
  name: "田中太郎",
  abilities: ["清掃"],
  staminaLevel: "high",
  availableDays: ["monday"]
}

// New User (backward compatible - all new fields are optional)
{
  id: "user-001",
  organizationId: "org-001",  // Optional: add if using multi-tenant
  name: "田中太郎",
  abilities: ["清掃"],
  staminaLevel: "high",
  availableDays: ["monday"],
  status: "active",           // Optional: defaults to active
  profile: { ... },           // Optional: can be omitted
  tags: [],                   // Optional: can be omitted
  createdAt: new Date(),      // Optional: auto-set
  updatedAt: new Date()       // Optional: auto-set
}
```

#### Task Model Changes
Similar to User model, all new fields are optional and backward compatible.

#### API Changes
All existing endpoints remain functional. New endpoints are additive only:
- `/api/organizations` (new)
- `/api/history` (new)
- `/api/schedules` (new)
- `/metrics` (new)

No breaking changes to existing endpoints.
