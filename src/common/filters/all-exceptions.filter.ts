import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import type { Request, Response } from 'express';

interface ErrorPayload {
  statusCode: number;
  error: string;
  message: string[];
}

interface PrismaError {
  code: string;
  meta?: { target?: unknown };
}

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const req = ctx.getRequest<Request>();
    const res = ctx.getResponse<Response>();

    const { status, error, messages } = this.parse(exception);

    const stack = exception instanceof Error ? exception.stack : undefined;
    this.logger.error(
      `${req.method} ${req.url} -> ${status} ${error}: ${messages.join(', ')}`,
      stack,
    );

    const payload: ErrorPayload = {
      statusCode: status,
      error,
      message: messages,
    };

    res.status(status).json(payload);
  }

  private parse(exception: unknown): {
    status: number;
    error: string;
    messages: string[];
  } {
    if (exception instanceof HttpException) {
      return this.parseHttp(exception);
    }

    if (this.isPrismaError(exception) && exception.code === 'P2002') {
      const target = exception.meta?.target;
      const t = Array.isArray(target)
        ? target.join(', ')
        : String(target ?? 'field');
      return {
        status: HttpStatus.CONFLICT,
        error: 'Conflict',
        messages: [`Unique constraint failed on ${t}`],
      };
    }

    if (exception instanceof Error) {
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: exception.name,
        messages: [exception.message],
      };
    }

    return {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      error: 'Internal Server Error',
      messages: ['Internal server error'],
    };
  }

  private parseHttp(exception: HttpException): {
    status: number;
    error: string;
    messages: string[];
  } {
    const status = exception.getStatus();
    const res = exception.getResponse();

    if (typeof res === 'string') {
      return { status, error: res, messages: [res] };
    }

    const body = res as Record<string, unknown>;
    const raw = body.message;
    const messages = Array.isArray(raw)
      ? raw.map(String)
      : raw != null
        ? [String(raw)]
        : [HttpStatus[status]];

    const error = typeof body.error === 'string' ? body.error : messages[0];
    return { status, error, messages };
  }

  private isPrismaError(e: unknown): e is PrismaError {
    return typeof e === 'object' && e !== null && 'code' in e;
  }
}
