import { ArgumentsHost, Catch, ExceptionFilter, HttpException, Logger } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class GlobalFilter<T> implements ExceptionFilter {
  private readonly logger = new Logger(GlobalFilter.name)

  catch(exception: HttpException, host: ArgumentsHost) {

    const ctx = host.switchToHttp()
    const req: Request = ctx.getRequest()
    const res: Response = ctx.getResponse()

    const statusCode = exception.getStatus() 
    const message = exception.message

    this.logger.error(
      `From: ${req.url} | Message: ${message} | Reason: `, exception.getResponse()
    )

    res.status(statusCode).json({ statusCode, message })
  }
}
