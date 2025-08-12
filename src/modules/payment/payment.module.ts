import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from '../../prisma/prisma.module';
import {
  PaymentController,
  PaymentMethodsController,
} from './payment.controller';
import { PaymentService } from './payment.service';

@Module({
  imports: [PrismaModule, ConfigModule],
  controllers: [PaymentController, PaymentMethodsController],
  providers: [PaymentService],
  exports: [PaymentService],
})
export class PaymentModule {}
