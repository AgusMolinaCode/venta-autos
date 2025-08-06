type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  level: LogLevel;
  message: string;
  data?: unknown;
  timestamp: string;
  context?: string;
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development';
  private isTest = process.env.NODE_ENV === 'test';

  private formatMessage(level: LogLevel, message: string, data?: unknown, context?: string): LogEntry {
    return {
      level,
      message,
      data,
      timestamp: new Date().toISOString(),
      context
    };
  }

  private shouldLog(level: LogLevel): boolean {
    if (this.isTest) return false;
    if (!this.isDevelopment && level === 'debug') return false;
    return true;
  }

  private log(level: LogLevel, message: string, data?: unknown, context?: string): void {
    if (!this.shouldLog(level)) return;
    
    // In development, use console for immediate feedback
    if (this.isDevelopment) {
      const emoji = {
        debug: '🔍',
        info: 'ℹ️',
        warn: '⚠️',
        error: '❌'
      }[level];

      const contextStr = context ? `[${context}] ` : '';
      console[level](`${emoji} ${contextStr}${message}`, data || '');
    }

    // In production, you could send to external logging service
    // For now, we'll just structure the logs properly
  }

  debug(message: string, data?: unknown, context?: string): void {
    this.log('debug', message, data, context);
  }

  info(message: string, data?: unknown, context?: string): void {
    this.log('info', message, data, context);
  }

  warn(message: string, data?: unknown, context?: string): void {
    this.log('warn', message, data, context);
  }

  error(message: string, data?: unknown, context?: string): void {
    this.log('error', message, data, context);
  }

  // Convenience method for API logging
  apiLog(method: string, endpoint: string, data?: unknown, status?: number): void {
    const message = `${method} ${endpoint}${status ? ` - ${status}` : ''}`;
    this.info(message, data, 'API');
  }

  // Convenience method for service logging
  serviceLog(serviceName: string, operation: string, data?: unknown): void {
    this.info(`${operation}`, data, serviceName.toUpperCase());
  }
}

export const logger = new Logger();