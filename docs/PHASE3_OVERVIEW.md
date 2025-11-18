# Phase 3 Overview

## Purpose

This repository provides a **comprehensive matching engine for employment support facilities (A/B型就労支援事業所)**. It solves the critical problem of optimally pairing individuals with developmental or intellectual disabilities to appropriate work tasks based on their skills, physical capabilities, and availability. The system uses a multi-factor scoring algorithm to ensure that task assignments are both achievable and growth-oriented, maximizing participant engagement while maintaining realistic workload expectations.

Beyond simple matching, this system serves as a reusable building block for workforce optimization in social welfare contexts, enabling facilities to improve operational efficiency, track participant progress over time, and make data-driven decisions about skill development and capacity planning.

## Existing Features

### Core Domain
- **User Management**: CRUD operations for participants with skills, stamina levels, and availability tracking
- **Task Management**: Full lifecycle management for work tasks with required abilities, difficulty ratings, and scheduling
- **Matching Engine**: Three-factor scoring algorithm (skills 50%, stamina 30%, schedule 20%)
- **REST API**: Fastify-based HTTP API with Zod validation and centralized error handling

### Infrastructure
- **In-memory storage**: Flexible data layer ready for DB migration
- **Type safety**: End-to-end TypeScript with strict checking
- **Testing**: Vitest setup with domain logic tests
- **Docker support**: Development and production containerization
- **Seed data**: 7 users, 8 tasks with realistic Japanese employment support scenarios

### Developer Experience
- Standardized npm scripts (dev, build, test, lint, seed)
- Hot-reload development environment
- Comprehensive README with API documentation

## Current Limitations

1. **Shallow domain model**: Only 2 core entities (User, Task); missing historical tracking, preferences, organizations, schedules
2. **Single vertical slice**: Only basic CRUD + matching; no reporting, analytics, skill progression, or schedule management
3. **No persistence layer**: In-memory only; no database migrations or real data persistence
4. **Limited extensibility**: No adapter pattern, plugin system, or event-driven architecture
5. **Minimal observability**: No structured logging, metrics, or monitoring capabilities
6. **Basic validation**: Input validation exists but lacks business rule enforcement
7. **Limited test coverage**: Only core algorithm tests; missing integration and scenario tests
8. **No CLI tooling**: All operations require API calls or direct code execution
9. **Single-tenant**: No multi-organization support or data isolation

## Phase 3 Plan

### 1. Domain Model Expansion
- **MatchHistory**: Track all matching attempts with outcomes, feedback, and performance data
- **UserPreferences**: Capture individual preferences, goals, and constraints
- **Organization**: Multi-tenant support for different facilities
- **WorkSchedule**: Detailed scheduling with shifts, assignments, and capacity planning
- **SkillCategory**: Hierarchical skill taxonomy with proficiency levels
- **TaskTemplate**: Reusable task definitions with variations
- **PerformanceMetric**: Track user progress and skill development over time

### 2. Additional Vertical Slices
- **Schedule Management**: Create, view, and optimize weekly/monthly work schedules
- **History & Analytics**: View matching history, success rates, skill utilization
- **Skill Development**: Track progression, identify gaps, suggest training
- **Organization Management**: Multi-facility support with staff roles and permissions
- **Reporting**: Generate insights on capacity, utilization, outcomes

### 3. Extensibility & Integration
- **Adapter interfaces**: Notifications, metrics, external HR systems, calendar integrations
- **Event system**: Domain events for matching, scheduling, skill updates
- **Plugin registry**: Extensible scoring algorithms, custom validators, business rules
- **Webhook support**: Notify external systems of key events
- **Import/Export**: CSV, JSON data interchange for legacy systems

### 4. Quality & Observability
- **Structured logging**: Contextual logs with correlation IDs and log levels
- **Metrics collection**: Business and technical metrics (match rates, API latency, etc.)
- **Health checks**: Detailed readiness and liveness endpoints
- **Request tracing**: Full request lifecycle visibility
- **Audit trail**: Who did what when for compliance

### 5. Developer & Operations Tooling
- **CLI utility**: Seed data, run reports, maintenance tasks, data import
- **Test factories**: Easy fixture generation for any test scenario
- **Database migrations**: Prisma or TypeORM with version control
- **Development scripts**: Data generators, performance testing, scenario replays

### 6. Documentation & Examples
- **Architecture guide**: System design, patterns, extension points
- **Domain documentation**: Detailed entity relationships and business rules
- **Integration recipes**: How to combine with auth, notifications, calendaring
- **API cookbook**: Common use-case examples with curl/code
- **Deployment guide**: Production considerations, scaling, monitoring

### 7. Production Readiness
- **PostgreSQL integration**: Real persistence with transactions and constraints
- **Redis caching**: Performance optimization for frequently accessed data
- **Rate limiting**: API protection and fair usage
- **API versioning**: Future-proof breaking changes
- **Feature flags**: Gradual rollout and A/B testing capability

## Success Metrics

Phase 3 completion will be measured by:
- ✅ 5+ entities with rich relationships
- ✅ 3+ complete vertical slices working end-to-end
- ✅ 3+ adapter interfaces with implementations
- ✅ 50+ meaningful tests covering domain, integration, and scenarios
- ✅ CLI tool with 5+ commands
- ✅ Comprehensive docs (architecture, domain, integration)
- ✅ PostgreSQL + Redis integration
- ✅ Production-ready logging, metrics, and error handling

## Timeline Approach

Implement in this order:
1. Domain entities & migrations (foundation)
2. History & analytics slice (demonstrates depth)
3. Schedule management slice (demonstrates complexity)
4. Extension points & adapters (demonstrates flexibility)
5. Logging, metrics, observability (demonstrates production readiness)
6. CLI tooling (demonstrates DX)
7. Enhanced tests & fixtures (demonstrates quality)
8. Documentation expansion (demonstrates professionalism)

This plan transforms the repository from a working prototype to a production-grade, ecosystem-ready service.
