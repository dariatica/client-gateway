import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { Response, Request } from 'express';

@Catch(RpcException)
export class RpcCustomExceptionFilter implements ExceptionFilter {
  catch(exception: RpcException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const rpc = exception.getError() as {
      status: number;
      message: string;
    };

    if ('error' in rpc) {
      const { message, status } = rpc.error as {
        status: number;
        message: string;
      };
      return response.status(status).json({
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: request.url,
        message,
      });
    }

    response.status(rpc.status).json({
      statusCode: rpc.status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: rpc.message,
    });
  }
}
