/**
 * 構造化ロギングユーティリティ
 */

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface LogContext {
  [key: string]: unknown;
  correlationId?: string;
  userId?: string;
  organizationId?: string;
  requestId?: string;
}

class Logger {
  private minLevel: LogLevel;

  constructor() {
    const level = process.env.LOG_LEVEL || 'info';
    this.minLevel = this.parseLogLevel(level);
  }

  private parseLogLevel(level: string): LogLevel {
    const validLevels: LogLevel[] = ['debug', 'info', 'warn', 'error'];
    return validLevels.includes(level as LogLevel) ? (level as LogLevel) : 'info';
  }

  private shouldLog(level: LogLevel): boolean {
    const levels: LogLevel[] = ['debug', 'info', 'warn', 'error'];
    const currentLevelIndex = levels.indexOf(this.minLevel);
    const messageLevelIndex = levels.indexOf(level);
    return messageLevelIndex >= currentLevelIndex;
  }

  private formatMessage(level: LogLevel, message: string, context?: LogContext): string {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      level,
      message,
      ...context,
    };
    return JSON.stringify(logEntry);
  }

  debug(message: string, context?: LogContext): void {
    if (this.shouldLog('debug')) {
      console.log(this.formatMessage('debug', message, context));
    }
  }

  info(message: string, context?: LogContext): void {
    if (this.shouldLog('info')) {
      console.log(this.formatMessage('info', message, context));
    }
  }

  warn(message: string, context?: LogContext): void {
    if (this.shouldLog('warn')) {
      console.warn(this.formatMessage('warn', message, context));
    }
  }

  error(message: string, error?: Error, context?: LogContext): void {
    if (this.shouldLog('error')) {
      const errorContext = {
        ...context,
        error: error ? {
          name: error.name,
          message: error.message,
          stack: error.stack,
        } : undefined,
      };
      console.error(this.formatMessage('error', message, errorContext));
    }
  }

  child(context: LogContext): Logger {
    const childLogger = new Logger();
    const originalMethods = {
      debug: childLogger.debug.bind(childLogger),
      info: childLogger.info.bind(childLogger),
      warn: childLogger.warn.bind(childLogger),
      error: childLogger.error.bind(childLogger),
    };

    childLogger.debug = (message: string, additionalContext?: LogContext) => {
      originalMethods.debug(message, { ...context, ...additionalContext });
    };

    childLogger.info = (message: string, additionalContext?: LogContext) => {
      originalMethods.info(message, { ...context, ...additionalContext });
    };

    childLogger.warn = (message: string, additionalContext?: LogContext) => {
      originalMethods.warn(message, { ...context, ...additionalContext });
    };

    childLogger.error = (message: string, error?: Error, additionalContext?: LogContext) => {
      originalMethods.error(message, error, { ...context, ...additionalContext });
    };

    return childLogger;
  }
}

export const logger = new Logger();
