/**
 * ドメインイベントシステム
 */

import { MatchResult } from '../models';

export type DomainEventType =
  | 'user.created'
  | 'user.updated'
  | 'user.deleted'
  | 'task.created'
  | 'task.updated'
  | 'task.deleted'
  | 'match.completed'
  | 'match.accepted'
  | 'match.rejected'
  | 'schedule.created'
  | 'schedule.published'
  | 'assignment.completed'
  | 'skill.assessed'
  | 'performance.calculated';

export interface DomainEvent<T = unknown> {
  id: string;
  type: DomainEventType;
  timestamp: Date;
  data: T;
  metadata?: {
    userId?: string;
    organizationId?: string;
    correlationId?: string;
    [key: string]: unknown;
  };
}

// 具体的なイベント型
export interface UserCreatedEvent extends DomainEvent<{
  userId: string;
  userName: string;
  organizationId?: string;
}> {
  type: 'user.created';
}

export interface MatchCompletedEvent extends DomainEvent<{
  matchResults: MatchResult[];
  requestedBy?: string;
}> {
  type: 'match.completed';
}

export interface AssignmentCompletedEvent extends DomainEvent<{
  userId: string;
  taskId: string;
  scheduleId: string;
  outcome: {
    completed: boolean;
    qualityRating?: number;
  };
}> {
  type: 'assignment.completed';
}

type EventHandler<T = unknown> = (event: DomainEvent<T>) => void | Promise<void>;

class EventBus {
  private handlers: Map<DomainEventType, EventHandler[]> = new Map();
  private eventHistory: DomainEvent[] = [];
  private maxHistorySize = 1000;

  /**
   * イベントハンドラーを登録
   */
  on<T = unknown>(eventType: DomainEventType, handler: EventHandler<T>): () => void {
    const handlers = this.handlers.get(eventType) || [];
    handlers.push(handler as EventHandler);
    this.handlers.set(eventType, handlers);

    // アンサブスクライブ関数を返す
    return () => {
      const currentHandlers = this.handlers.get(eventType) || [];
      const index = currentHandlers.indexOf(handler as EventHandler);
      if (index > -1) {
        currentHandlers.splice(index, 1);
      }
    };
  }

  /**
   * イベントを発行
   */
  async emit<T = unknown>(event: DomainEvent<T>): Promise<void> {
    // 履歴に保存
    this.eventHistory.push(event);
    if (this.eventHistory.length > this.maxHistorySize) {
      this.eventHistory.shift();
    }

    // ハンドラーを実行
    const handlers = this.handlers.get(event.type) || [];
    await Promise.all(handlers.map(handler => handler(event)));
  }

  /**
   * イベント履歴を取得
   */
  getHistory(filter?: { type?: DomainEventType; limit?: number }): DomainEvent[] {
    let history = [...this.eventHistory];

    if (filter?.type) {
      history = history.filter(e => e.type === filter.type);
    }

    if (filter?.limit) {
      history = history.slice(-filter.limit);
    }

    return history;
  }

  /**
   * すべてのハンドラーをクリア
   */
  clear(): void {
    this.handlers.clear();
    this.eventHistory = [];
  }
}

export const eventBus = new EventBus();

// ヘルパー関数
export function createEvent<T>(
  type: DomainEventType,
  data: T,
  metadata?: DomainEvent['metadata']
): DomainEvent<T> {
  return {
    id: `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    type,
    timestamp: new Date(),
    data,
    metadata,
  };
}
