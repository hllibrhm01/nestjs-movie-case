import type { Response } from "express";
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus
} from "@nestjs/common";
import { MongoError } from "mongodb";

const MONOGO_DUPLICATE_KEY_ERROR = 11000;

@Catch(MongoError)
export class MongoExceptionFilter implements ExceptionFilter {
  catch(exception: MongoError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    switch (exception.code) {
      case MONOGO_DUPLICATE_KEY_ERROR:
        response.status(HttpStatus.CONFLICT).json({
          statusCode: HttpStatus.CONFLICT,
          message: "This record already exists"
        });
      break;
    }
  }
}
