import {
  Body,
  Controller,
  Get,
  Headers,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  RawBodyRequest,
  Req,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiHeader,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  ModerateRateLimit,
  StrictRateLimit,
} from '../../core/decorators/rate-limit.decorator';
import { JwtAuthGuard } from '../../core/guards/jwt.auth.guard';
import {
  ConfirmPaymentDto,
  CreatePaymentIntentDto,
  CreateRefundDto,
  PaymentMethodDto,
} from './dto';
import { PaymentService } from './payment.service';

@ApiTags('Payments')
@Controller('payments')
@ApiBearerAuth()
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('create-intent')
  @UseGuards(JwtAuthGuard)
  @ModerateRateLimit()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create payment intent',
    description: 'Create a Stripe payment intent for an order',
  })
  @ApiBody({ type: CreatePaymentIntentDto })
  @ApiResponse({
    status: 201,
    description: 'Payment intent created successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        amount: { type: 'number', description: 'Amount in cents' },
        currency: { type: 'string' },
        status: { type: 'string' },
        clientSecret: { type: 'string' },
        createdAt: { type: 'string' },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Order access denied' })
  @ApiResponse({ status: 404, description: 'Order not found' })
  @ApiResponse({ status: 429, description: 'Too many requests' })
  async createPaymentIntent(
    @Body() createPaymentIntentDto: CreatePaymentIntentDto,
    @Request() req,
  ) {
    return this.paymentService.createPaymentIntent(
      createPaymentIntentDto,
      req.user.id,
    );
  }

  @Post('confirm')
  @UseGuards(JwtAuthGuard)
  @ModerateRateLimit()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Confirm payment',
    description: 'Confirm a payment intent after successful payment',
  })
  @ApiBody({ type: ConfirmPaymentDto })
  @ApiResponse({
    status: 200,
    description: 'Payment confirmed successfully',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string' },
        paymentId: { type: 'string' },
        orderId: { type: 'string' },
        status: { type: 'string' },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Payment not found' })
  @ApiResponse({ status: 429, description: 'Too many requests' })
  async confirmPayment(
    @Body() confirmPaymentDto: ConfirmPaymentDto,
    @Request() req,
  ) {
    return this.paymentService.confirmPayment(confirmPaymentDto, req.user.id);
  }

  @Post('refund')
  @UseGuards(JwtAuthGuard)
  @StrictRateLimit()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Create refund',
    description: 'Create a refund for a successful payment',
  })
  @ApiBody({ type: CreateRefundDto })
  @ApiResponse({
    status: 200,
    description: 'Refund created successfully',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string' },
        refundId: { type: 'string' },
        amount: { type: 'number' },
        currency: { type: 'string' },
        status: { type: 'string' },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Payment not found' })
  @ApiResponse({ status: 429, description: 'Too many requests' })
  async createRefund(@Body() createRefundDto: CreateRefundDto, @Request() req) {
    return this.paymentService.createRefund(createRefundDto, req.user.id);
  }

  @Get('methods')
  @UseGuards(JwtAuthGuard)
  @ModerateRateLimit()
  @ApiOperation({
    summary: 'Get payment methods',
    description: "Retrieve user's saved payment methods from Stripe",
  })
  @ApiResponse({
    status: 200,
    description: 'Payment methods retrieved successfully',
    type: [PaymentMethodDto],
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 429, description: 'Too many requests' })
  async getPaymentMethods(@Request() req) {
    return this.paymentService.getPaymentMethods(req.user.id);
  }

  @Post('methods/save')
  @UseGuards(JwtAuthGuard)
  @ModerateRateLimit()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Save payment method',
    description: "Save a payment method to user's Stripe customer account",
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        paymentMethodId: {
          type: 'string',
          description: 'Stripe payment method ID',
        },
      },
      required: ['paymentMethodId'],
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Payment method saved successfully',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string' },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 429, description: 'Too many requests' })
  async savePaymentMethod(
    @Body() body: { paymentMethodId: string },
    @Request() req,
  ) {
    return this.paymentService.savePaymentMethod(
      body.paymentMethodId,
      req.user.id,
    );
  }

  @Post('methods/remove')
  @UseGuards(JwtAuthGuard)
  @ModerateRateLimit()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Remove payment method',
    description:
      "Remove a saved payment method from user's Stripe customer account",
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        paymentMethodId: {
          type: 'string',
          description: 'Stripe payment method ID',
        },
      },
      required: ['paymentMethodId'],
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Payment method removed successfully',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string' },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Payment method access denied',
  })
  @ApiResponse({ status: 429, description: 'Too many requests' })
  async removePaymentMethod(
    @Body() body: { paymentMethodId: string },
    @Request() req,
  ) {
    return this.paymentService.removePaymentMethod(
      body.paymentMethodId,
      req.user.id,
    );
  }

  @Get('history')
  @UseGuards(JwtAuthGuard)
  @ModerateRateLimit()
  @ApiOperation({
    summary: 'Get payment history',
    description: "Retrieve user's payment history with pagination",
  })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Page number',
    type: 'number',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Items per page',
    type: 'number',
  })
  @ApiResponse({
    status: 200,
    description: 'Payment history retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        payments: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              amount: { type: 'number' },
              currency: { type: 'string' },
              status: { type: 'string' },
              createdAt: { type: 'string' },
              order: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  orderNumber: { type: 'string' },
                  status: { type: 'string' },
                },
              },
            },
          },
        },
        pagination: {
          type: 'object',
          properties: {
            page: { type: 'number' },
            limit: { type: 'number' },
            total: { type: 'number' },
            pages: { type: 'number' },
          },
        },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 429, description: 'Too many requests' })
  async getPaymentHistory(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Request() req,
  ) {
    return this.paymentService.getPaymentHistory(req.user.id, page, limit);
  }

  @Get('status/:paymentIntentId')
  @UseGuards(JwtAuthGuard)
  @ModerateRateLimit()
  @ApiOperation({
    summary: 'Get payment status',
    description: 'Get the current status of a payment intent',
  })
  @ApiParam({
    name: 'paymentIntentId',
    description: 'Stripe payment intent ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Payment status retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        status: { type: 'string' },
        amount: { type: 'number' },
        currency: { type: 'string' },
        orderId: { type: 'string' },
        orderNumber: { type: 'string' },
        createdAt: { type: 'string' },
        updatedAt: { type: 'string' },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Payment not found' })
  @ApiResponse({ status: 429, description: 'Too many requests' })
  async getPaymentStatus(
    @Param('paymentIntentId') paymentIntentId: string,
    @Request() req,
  ) {
    return this.paymentService.getPaymentStatus(paymentIntentId, req.user.id);
  }

  @Post('webhook')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Stripe webhook handler',
    description: 'Handle Stripe webhook events for payment updates',
  })
  @ApiHeader({
    name: 'stripe-signature',
    description: 'Stripe webhook signature for verification',
    required: true,
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        type: { type: 'string' },
        data: { type: 'object' },
        created: { type: 'string' },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Webhook processed successfully',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string' },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Invalid signature or data',
  })
  async handleWebhook(
    @Req() req: RawBodyRequest<Request>,
    @Headers('stripe-signature') signature: string,
  ) {
    // Get the raw body for webhook signature verification
    const rawBody = req.rawBody;

    if (!rawBody) {
      throw new Error('Raw body not available for webhook verification');
    }

    // Parse the webhook event from raw body
    const webhookEvent = JSON.parse(rawBody.toString());

    return this.paymentService.handleWebhook(webhookEvent, signature);
  }
}

@ApiTags('Payment Methods')
@Controller('payment-methods')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class PaymentMethodsController {
  constructor(private readonly paymentService: PaymentService) {}

  @Get('setup-intent')
  @ModerateRateLimit()
  @ApiOperation({
    summary: 'Create setup intent',
    description: 'Create a Stripe setup intent for saving payment methods',
  })
  @ApiResponse({
    status: 200,
    description: 'Setup intent created successfully',
    schema: {
      type: 'object',
      properties: {
        clientSecret: { type: 'string' },
        id: { type: 'string' },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 429, description: 'Too many requests' })
  async createSetupIntent(@Request() req) {
    // This would typically create a setup intent in Stripe
    // For now, return a placeholder response
    return {
      message: 'Setup intent creation not yet implemented',
      note: 'This endpoint will create a Stripe setup intent for saving payment methods',
    };
  }
}
