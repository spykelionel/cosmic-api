import { NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
interface ResponseTemplateOptions {
    statusCode: number;
    message: string;
}
export declare class ResponseTemplateInterceptor implements NestInterceptor {
    private readonly options?;
    constructor(options?: ResponseTemplateOptions);
    intercept(context: ExecutionContext, next: CallHandler): Observable<any>;
}
export {};
