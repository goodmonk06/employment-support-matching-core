/**
 * カレンダーアダプターインターフェース
 * 外部カレンダーシステムとの統合ポイント
 */

export interface CalendarEvent {
  id?: string;
  title: string;
  description?: string;
  start: Date;
  end: Date;
  location?: string;
  attendees?: string[];
  organizerId?: string;
  metadata?: Record<string, unknown>;
}

export interface ICalendarAdapter {
  /**
   * イベントを作成
   */
  createEvent(event: CalendarEvent): Promise<string>;

  /**
   * イベントを更新
   */
  updateEvent(eventId: string, event: Partial<CalendarEvent>): Promise<void>;

  /**
   * イベントを削除
   */
  deleteEvent(eventId: string): Promise<void>;

  /**
   * 期間内のイベントを取得
   */
  getEvents(start: Date, end: Date, userId?: string): Promise<CalendarEvent[]>;

  /**
   * 利用可能な時間枠を検索
   */
  findAvailableSlots(
    start: Date,
    end: Date,
    durationMinutes: number,
    userIds: string[]
  ): Promise<Array<{ start: Date; end: Date }>>;
}

/**
 * インメモリカレンダーアダプター（開発・テスト用）
 */
export class InMemoryCalendarAdapter implements ICalendarAdapter {
  private events: Map<string, CalendarEvent> = new Map();
  private idCounter = 1;

  async createEvent(event: CalendarEvent): Promise<string> {
    const id = event.id || `cal_${this.idCounter++}`;
    this.events.set(id, { ...event, id });
    return id;
  }

  async updateEvent(eventId: string, updates: Partial<CalendarEvent>): Promise<void> {
    const existing = this.events.get(eventId);
    if (!existing) {
      throw new Error(`Event not found: ${eventId}`);
    }
    this.events.set(eventId, { ...existing, ...updates });
  }

  async deleteEvent(eventId: string): Promise<void> {
    this.events.delete(eventId);
  }

  async getEvents(start: Date, end: Date, userId?: string): Promise<CalendarEvent[]> {
    const events = Array.from(this.events.values());
    return events.filter(event => {
      const inRange = event.start >= start && event.end <= end;
      const matchesUser = !userId || event.attendees?.includes(userId) || event.organizerId === userId;
      return inRange && matchesUser;
    });
  }

  async findAvailableSlots(
    start: Date,
    end: Date,
    durationMinutes: number,
    userIds: string[]
  ): Promise<Array<{ start: Date; end: Date }>> {
    // 簡易実装: 既存イベントと重ならない時間枠を返す
    const slots: Array<{ start: Date; end: Date }> = [];
    const events = await this.getEvents(start, end);

    let currentStart = new Date(start);
    const duration = durationMinutes * 60 * 1000;

    while (currentStart.getTime() + duration <= end.getTime()) {
      const slotEnd = new Date(currentStart.getTime() + duration);

      // このスロットが既存イベントと重複していないかチェック
      const hasConflict = events.some(event =>
        (currentStart >= event.start && currentStart < event.end) ||
        (slotEnd > event.start && slotEnd <= event.end)
      );

      if (!hasConflict) {
        slots.push({ start: new Date(currentStart), end: slotEnd });
      }

      // 30分刻みで次のスロットへ
      currentStart = new Date(currentStart.getTime() + 30 * 60 * 1000);
    }

    return slots;
  }

  clear(): void {
    this.events.clear();
  }
}
