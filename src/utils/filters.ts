import { ExceptionFilter, Catch, ArgumentsHost } from "@nestjs/common";
import { Request, Response } from "express";
import { DatabaseElementNotFoundError } from "./exceptions";

@Catch(DatabaseElementNotFoundError)
export class DatabaseElementNotFoundErrorFilter implements ExceptionFilter {
  catch(exception: DatabaseElementNotFoundError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = 404;
    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: exception.message
    });
  }
}
