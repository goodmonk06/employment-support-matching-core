/**
 * 通知アダプターインターフェース
 * 外部通知サービスとの統合ポイント
 */

export interface NotificationRecipient {
  userId: string;
  email?: string;
  phone?: string;
  name?: string;
}

export interface Notification {
  type: 'email' | 'sms' | 'push' | 'in_app';
  subject?: string;
  body: string;
  priority?: 'low' | 'normal' | 'high' | 'urgent';
  metadata?: Record<string, unknown>;
}

export interface INotificationAdapter {
  /**
   * 単一の受信者に通知を送信
   */
  send(recipient: NotificationRecipient, notification: Notification): Promise<void>;

  /**
   * 複数の受信者に通知を送信
   */
  sendBatch(recipients: NotificationRecipient[], notification: Notification): Promise<void>;

  /**
   * 通知テンプレートを使用して送信
   */
  sendFromTemplate(
    recipient: NotificationRecipient,
    templateId: string,
    variables: Record<string, unknown>
  ): Promise<void>;
}

/**
 * インメモリ通知アダプター（開発・テスト用）
 */
export class InMemoryNotificationAdapter implements INotificationAdapter {
  private sent: Array<{
    recipient: NotificationRecipient;
    notification: Notification;
    timestamp: Date;
  }> = [];

  async send(recipient: NotificationRecipient, notification: Notification): Promise<void> {
    this.sent.push({
      recipient,
      notification,
      timestamp: new Date(),
    });
    console.log(`[Notification] ${notification.type} to ${recipient.name || recipient.userId}:`, notification.subject || notification.body);
  }

  async sendBatch(recipients: NotificationRecipient[], notification: Notification): Promise<void> {
    for (const recipient of recipients) {
      await this.send(recipient, notification);
    }
  }

  async sendFromTemplate(
    recipient: NotificationRecipient,
    templateId: string,
    variables: Record<string, unknown>
  ): Promise<void> {
    const notification: Notification = {
      type: 'email',
      subject: `Template: ${templateId}`,
      body: JSON.stringify(variables),
    };
    await this.send(recipient, notification);
  }

  getSent(): typeof this.sent {
    return [...this.sent];
  }

  clear(): void {
    this.sent = [];
  }
}
