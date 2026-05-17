import type { FastifyError, FastifyReply, FastifyRequest } from 'fastify';
import { ZodError } from 'zod';
import { AppError } from '../utils/errors.js';

export function errorHandler(
  error: FastifyError,
  _request: FastifyRequest,
  reply: FastifyReply
) {
  if (error instanceof ZodError) {
    return reply.status(400).send({
      success: false,
      error: { code: 'VALIDATION_ERROR', message: 'Invalid request', details: error.flatten() },
    });
  }
  if (error instanceof AppError) {
    return reply.status(error.statusCode).send({
      success: false,
      error: { code: error.code, message: error.message },
    });
  }
  const status = error.statusCode ?? 500;
  reply.status(status).send({
    success: false,
    error: {
      code: error.code ?? 'INTERNAL_ERROR',
      message: status >= 500 ? 'Internal server error' : error.message,
    },
  });
}
