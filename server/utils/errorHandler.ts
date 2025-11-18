import { FastifyReply, FastifyRequest } from 'fastify';
import { ZodError } from 'zod';

export interface ApiError {
  statusCode: number;
  error: string;
  message: string;
  details?: unknown;
}

export class AppError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public details?: unknown
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export function errorHandler(
  error: Error,
  request: FastifyRequest,
  reply: FastifyReply
): void {
  // Zod validation error
  if (error instanceof ZodError) {
    const response: ApiError = {
      statusCode: 400,
      error: 'Validation Error',
      message: 'リクエストデータが不正です',
      details: error.errors,
    };
    reply.status(400).send(response);
    return;
  }

  // Custom app error
  if (error instanceof AppError) {
    const response: ApiError = {
      statusCode: error.statusCode,
      error: error.name,
      message: error.message,
      details: error.details,
    };
    reply.status(error.statusCode).send(response);
    return;
  }

  // Unknown error
  console.error('Unexpected error:', error);
  const response: ApiError = {
    statusCode: 500,
    error: 'Internal Server Error',
    message: '予期しないエラーが発生しました',
  };
  reply.status(500).send(response);
}
