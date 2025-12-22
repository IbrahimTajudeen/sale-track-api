/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */



import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    let status: number;
    let message: any;

    // Handle standard HTTP exceptions
    if (exception instanceof HttpException) {
      status = exception.getStatus();
      message = exception.getResponse();
    }
    // Handle unknown or system exceptions
    else {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      message = {
        statusCode: status,
        message: (exception as any)?.message || 'Internal server error',
        error: 'Internal Server Error',
      };
    }

    // Log the exception
    this.logger.error(
      `Exception thrown: ${JSON.stringify({
        path: request.url,
        method: request.method,
        status,
        message,
        error: exception,
      })}`,
    );

    // Send formatted response
    response.status(status).json({
      success: false,
      timestamp: new Date().toISOString(),
      path: request.url,
      statusCode: status,
      message,
    });
  }
}
