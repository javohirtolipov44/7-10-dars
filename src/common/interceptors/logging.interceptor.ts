import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { map, Observable, tap } from 'rxjs';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();

    const method = req.method;
    const url = req.originalUrl || req.url;
    const ip = req.ip || req.connection.remoteAddress;
    const timestamp = new Date().toISOString();

    console.log(`\n[REQUEST] ${method} ${url}`);
    console.log(`Time: ${timestamp}`);
    console.log(`IP: ${ip}`);
    console.log(`Body:`, req.body);

    const now = Date.now();

    return next.handle().pipe(
      tap((responseData) => {
        const timeTaken = Date.now() - now;
        console.log(`\n[RESPONSE] ${method} ${url}`);
        console.log(`Duration: ${timeTaken}ms`);
        console.log(`Response:`, responseData);
      }),
    );
  }
}
