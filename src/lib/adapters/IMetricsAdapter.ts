/**
 * メトリクスアダプターインターフェース
 * 外部モニタリングシステムとの統合ポイント
 */

export interface MetricDataPoint {
  name: string;
  value: number;
  timestamp?: Date;
  tags?: Record<string, string>;
}

export interface IMetricsAdapter {
  /**
   * カウンターメトリクスを記録
   */
  recordCounter(name: string, value: number, tags?: Record<string, string>): Promise<void>;

  /**
   * ゲージメトリクスを記録
   */
  recordGauge(name: string, value: number, tags?: Record<string, string>): Promise<void>;

  /**
   * ヒストグラムメトリクスを記録
   */
  recordHistogram(name: string, value: number, tags?: Record<string, string>): Promise<void>;

  /**
   * 複数のメトリクスをバッチ送信
   */
  recordBatch(metrics: MetricDataPoint[]): Promise<void>;
}

/**
 * コンソール出力メトリクスアダプター（開発用）
 */
export class ConsoleMetricsAdapter implements IMetricsAdapter {
  async recordCounter(name: string, value: number, tags?: Record<string, string>): Promise<void> {
    console.log(`[Metric:Counter] ${name} = ${value}`, tags || '');
  }

  async recordGauge(name: string, value: number, tags?: Record<string, string>): Promise<void> {
    console.log(`[Metric:Gauge] ${name} = ${value}`, tags || '');
  }

  async recordHistogram(name: string, value: number, tags?: Record<string, string>): Promise<void> {
    console.log(`[Metric:Histogram] ${name} = ${value}`, tags || '');
  }

  async recordBatch(metrics: MetricDataPoint[]): Promise<void> {
    console.log(`[Metric:Batch] Recording ${metrics.length} metrics`);
    for (const metric of metrics) {
      console.log(`  - ${metric.name} = ${metric.value}`, metric.tags || '');
    }
  }
}

/**
 * NoOp メトリクスアダプター（本番で外部サービス未使用時）
 */
export class NoOpMetricsAdapter implements IMetricsAdapter {
  async recordCounter(): Promise<void> {
    // Do nothing
  }

  async recordGauge(): Promise<void> {
    // Do nothing
  }

  async recordHistogram(): Promise<void> {
    // Do nothing
  }

  async recordBatch(): Promise<void> {
    // Do nothing
  }
}
