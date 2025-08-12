import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  Param,
  ParseIntPipe,
  ParseUUIDPipe,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../core/guards/jwt.auth.guard';
import { CreatePaymentIntentDto, PaymentWebhookDto } from './dto';
import { PaymentService } from './payment.service';

@ApiTags('Payment')
@Controller('payment')
@ApiBearerAuth()
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('create-intent')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Create payment intent' })
  @ApiResponse({
    status: 201,
    description: 'Payment intent created successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Order not found' })
  async createPaymentIntent(
    @Request() req,
    @Body() createPaymentIntentDto: CreatePaymentIntentDto,
  ) {
    return this.paymentService.createPaymentIntent(
      req.user.id,
      createPaymentIntentDto,
    );
  }

  @Post('webhook')
  @ApiOperation({ summary: 'Handle payment webhook' })
  @ApiResponse({
    status: 200,
    description: 'Webhook processed successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async handleWebhook(@Body() webhookData: PaymentWebhookDto) {
    return this.paymentService.handleWebhook(webhookData);
  }

  @Get('methods')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get available payment methods' })
  @ApiResponse({
    status: 200,
    description: 'Payment methods retrieved successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getPaymentMethods(@Request() req) {
    return this.paymentService.getPaymentMethods(req.user.id);
  }

  @Get('history')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get payment history' })
  @ApiQuery({ name: 'page', required: false, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, description: 'Items per page' })
  @ApiResponse({
    status: 200,
    description: 'Payment history retrieved successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getPaymentHistory(
    @Request() req,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
  ) {
    return this.paymentService.getPaymentHistory(req.user.id, page, limit);
  }

  @Post('process/:paymentIntentId')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Process payment with payment method' })
  @ApiParam({ name: 'paymentIntentId', description: 'Payment Intent ID' })
  @ApiResponse({
    status: 200,
    description: 'Payment processed successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Payment not found' })
  async processPayment(
    @Param('paymentIntentId') paymentIntentId: string,
    @Body() body: { paymentMethodId: string },
  ) {
    return this.paymentService.processPayment(
      paymentIntentId,
      body.paymentMethodId,
    );
  }

  @Post('refund/:paymentId')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Refund payment' })
  @ApiParam({ name: 'paymentId', description: 'Payment ID' })
  @ApiResponse({
    status: 200,
    description: 'Payment refunded successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Payment not found' })
  async refundPayment(
    @Request() req,
    @Param('paymentId', ParseUUIDPipe) paymentId: string,
    @Body() body: { amount?: number },
  ) {
    return this.paymentService.refundPayment(
      paymentId,
      req.user.id,
      body.amount,
    );
  }
}
