import { PrismaClient } from '@prisma/client';
import { ConfigService } from '@nestjs/config';
export declare class PrismaService extends PrismaClient {
    private config;
    [x: string]: any;
    constructor(config: ConfigService);
}
