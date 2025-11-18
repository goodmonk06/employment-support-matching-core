/**
 * メトリクス収集ユーティリティ
 */

export interface MetricLabels {
  [key: string]: string | number;
}

export interface Counter {
  name: string;
  value: number;
  labels?: MetricLabels;
  timestamp: Date;
}

export interface Gauge {
  name: string;
  value: number;
  labels?: MetricLabels;
  timestamp: Date;
}

export interface Histogram {
  name: string;
  value: number;
  labels?: MetricLabels;
  timestamp: Date;
}

class MetricsCollector {
  private counters: Map<string, Counter> = new Map();
  private gauges: Map<string, Gauge> = new Map();
  private histograms: Histogram[] = [];

  /**
   * カウンターをインクリメント
   */
  incrementCounter(name: string, labels?: MetricLabels, value: number = 1): void {
    const key = this.getKey(name, labels);
    const existing = this.counters.get(key);

    if (existing) {
      existing.value += value;
      existing.timestamp = new Date();
    } else {
      this.counters.set(key, {
        name,
        value,
        labels,
        timestamp: new Date(),
      });
    }
  }

  /**
   * ゲージを設定
   */
  setGauge(name: string, value: number, labels?: MetricLabels): void {
    const key = this.getKey(name, labels);
    this.gauges.set(key, {
      name,
      value,
      labels,
      timestamp: new Date(),
    });
  }

  /**
   * ヒストグラム値を記録
   */
  recordHistogram(name: string, value: number, labels?: MetricLabels): void {
    this.histograms.push({
      name,
      value,
      labels,
      timestamp: new Date(),
    });

    // 古いデータを削除（最新1000件のみ保持）
    if (this.histograms.length > 1000) {
      this.histograms = this.histograms.slice(-1000);
    }
  }

  /**
   * 実行時間を計測
   */
  async measureDuration<T>(
    name: string,
    fn: () => Promise<T>,
    labels?: MetricLabels
  ): Promise<T> {
    const start = Date.now();
    try {
      const result = await fn();
      const duration = Date.now() - start;
      this.recordHistogram(`${name}_duration_ms`, duration, labels);
      this.incrementCounter(`${name}_total`, labels);
      this.incrementCounter(`${name}_success`, labels);
      return result;
    } catch (error) {
      const duration = Date.now() - start;
      this.recordHistogram(`${name}_duration_ms`, duration, labels);
      this.incrementCounter(`${name}_total`, labels);
      this.incrementCounter(`${name}_error`, labels);
      throw error;
    }
  }

  /**
   * すべてのメトリクスを取得
   */
  getAllMetrics(): {
    counters: Counter[];
    gauges: Gauge[];
    histograms: Histogram[];
  } {
    return {
      counters: Array.from(this.counters.values()),
      gauges: Array.from(this.gauges.values()),
      histograms: [...this.histograms],
    };
  }

  /**
   * 特定のメトリクスをクリア
   */
  clear(name?: string): void {
    if (name) {
      // 特定の名前のメトリクスのみクリア
      for (const [key, counter] of this.counters.entries()) {
        if (counter.name === name) {
          this.counters.delete(key);
        }
      }
      for (const [key, gauge] of this.gauges.entries()) {
        if (gauge.name === name) {
          this.gauges.delete(key);
        }
      }
      this.histograms = this.histograms.filter(h => h.name !== name);
    } else {
      // すべてクリア
      this.counters.clear();
      this.gauges.clear();
      this.histograms = [];
    }
  }

  private getKey(name: string, labels?: MetricLabels): string {
    if (!labels) return name;
    const labelStr = Object.entries(labels)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([k, v]) => `${k}=${v}`)
      .join(',');
    return `${name}{${labelStr}}`;
  }
}

export const metrics = new MetricsCollector();

// ビジネスメトリクスのヘルパー
export const businessMetrics = {
  recordMatch: (score: number, organizationId?: string) => {
    metrics.incrementCounter('matches_total', { organizationId: organizationId || 'unknown' });
    metrics.recordHistogram('match_score', score, { organizationId: organizationId || 'unknown' });
  },

  recordScheduleCreation: (assignmentCount: number, organizationId?: string) => {
    metrics.incrementCounter('schedules_created', { organizationId: organizationId || 'unknown' });
    metrics.recordHistogram('schedule_assignments', assignmentCount, { organizationId: organizationId || 'unknown' });
  },

  recordTaskCompletion: (userId: string, taskId: string, qualityRating?: number) => {
    metrics.incrementCounter('tasks_completed', { userId, taskId });
    if (qualityRating) {
      metrics.recordHistogram('task_quality_rating', qualityRating, { userId, taskId });
    }
  },

  setActiveUsers: (count: number, organizationId?: string) => {
    metrics.setGauge('active_users', count, { organizationId: organizationId || 'unknown' });
  },

  setActiveTasks: (count: number, organizationId?: string) => {
    metrics.setGauge('active_tasks', count, { organizationId: organizationId || 'unknown' });
  },
};
