import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { PrismaService } from '../../prisma/prisma.service';
import {
  ConfirmPaymentDto,
  CreatePaymentIntentDto,
  CreateRefundDto,
  PaymentIntentDto,
  PaymentStatus,
  WebhookEventDto,
} from './dto';

@Injectable()
export class PaymentService {
  private stripe: Stripe;

  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {
    this.stripe = new Stripe(
      this.configService.get<string>('STRIPE_SECRET_KEY'),
      {
        apiVersion: '2025-07-30.basil',
      },
    );
  }

  async createPaymentIntent(
    createPaymentIntentDto: CreatePaymentIntentDto,
    userId: string,
  ): Promise<PaymentIntentDto> {
    try {
      // Verify order exists and belongs to user
      const order = await this.prisma.order.findUnique({
        where: { id: createPaymentIntentDto.orderId },
        include: { user: true },
      });

      if (!order) {
        throw new NotFoundException('Order not found');
      }

      if (order.userId !== userId) {
        throw new ForbiddenException(
          'You can only create payment intents for your own orders',
        );
      }

      if (order.status !== ('PENDING' as any)) {
        throw new BadRequestException('Order is not in pending status');
      }

      // Check if payment already exists
      const existingPayment = await this.prisma.payment.findFirst({
        where: { orderId: createPaymentIntentDto.orderId },
      });

      if (existingPayment) {
        throw new BadRequestException('Payment already exists for this order');
      }

      // Create Stripe payment intent
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: Math.round(order.totalAmount * 100), // Convert to cents
        currency: createPaymentIntentDto.currency || 'USD',
        metadata: {
          orderId: order.id,
          userId: userId,
          ...createPaymentIntentDto.metadata,
        },
        automatic_payment_methods: {
          enabled: true,
        },
        description: `Payment for order ${order.orderNumber}`,
      });

      // Store payment intent in database
      const payment = await this.prisma.payment.create({
        data: {
          orderId: order.id,
          amount: order.totalAmount,
          currency: createPaymentIntentDto.currency || 'USD',
          status: PaymentStatus.PENDING,
          paymentMethod: createPaymentIntentDto.paymentMethod as any,
          transactionId: paymentIntent.id,
          metadata: {
            stripePaymentIntentId: paymentIntent.id,
            clientSecret: paymentIntent.client_secret,
            ...createPaymentIntentDto.metadata,
          },
        },
      });

      return {
        id: payment.id,
        amount: Math.round(payment.amount * 100), // Return in cents for Stripe
        currency: payment.currency,
        status: payment.status as any,
        paymentMethod: payment.paymentMethod,
        clientSecret: paymentIntent.client_secret,
        createdAt: payment.createdAt.toISOString(),
        metadata: payment.metadata as any,
      };
    } catch (error) {
      if (error instanceof Stripe.errors.StripeError) {
        throw new BadRequestException(`Stripe error: ${error.message}`);
      }
      throw error;
    }
  }

  async confirmPayment(
    confirmPaymentDto: ConfirmPaymentDto,
    userId: string,
  ): Promise<any> {
    try {
      // Verify payment exists and belongs to user
      const payment = await this.prisma.payment.findFirst({
        where: {
          transactionId: confirmPaymentDto.paymentIntentId,
          order: { userId: userId },
        },
        include: { order: true },
      });

      if (!payment) {
        throw new NotFoundException('Payment not found or access denied');
      }

      // Retrieve payment intent from Stripe
      const paymentIntent = await this.stripe.paymentIntents.retrieve(
        confirmPaymentDto.paymentIntentId,
      );

      if (paymentIntent.status === 'succeeded') {
        // Update payment status
        await this.prisma.payment.update({
          where: { id: payment.id },
          data: {
            status: PaymentStatus.SUCCEEDED,
            metadata: {
              ...(payment.metadata as any),
              confirmedAt: new Date().toISOString(),
              stripeStatus: paymentIntent.status,
            },
          },
        });

        // Update order status
        await this.prisma.order.update({
          where: { id: payment.orderId },
          data: { status: 'CONFIRMED' as any },
        });

        return {
          message: 'Payment confirmed successfully',
          paymentId: payment.id,
          orderId: payment.orderId,
          status: PaymentStatus.SUCCEEDED,
        };
      } else if (paymentIntent.status === 'requires_payment_method') {
        throw new BadRequestException(
          'Payment requires additional authentication',
        );
      } else if (paymentIntent.status === 'canceled') {
        throw new BadRequestException('Payment was canceled');
      } else {
        throw new BadRequestException(
          `Payment is in ${paymentIntent.status} status`,
        );
      }
    } catch (error) {
      if (error instanceof Stripe.errors.StripeError) {
        throw new BadRequestException(`Stripe error: ${error.message}`);
      }
      throw error;
    }
  }

  async createRefund(
    createRefundDto: CreateRefundDto,
    userId: string,
  ): Promise<any> {
    try {
      // Verify payment exists and belongs to user
      const payment = await this.prisma.payment.findFirst({
        where: {
          transactionId: createRefundDto.paymentIntentId,
          order: { userId: userId },
        },
        include: { order: true },
      });

      if (!payment) {
        throw new NotFoundException('Payment not found or access denied');
      }

      if (payment.status !== PaymentStatus.SUCCEEDED) {
        throw new BadRequestException(
          'Only successful payments can be refunded',
        );
      }

      // Create refund in Stripe
      const refundAmount =
        createRefundDto.amount || Math.round(payment.amount * 100);
      const refund = await this.stripe.refunds.create({
        payment_intent: createRefundDto.paymentIntentId,
        amount: refundAmount,
        reason: createRefundDto.reason || ('requested_by_customer' as any),
        metadata: {
          orderId: payment.orderId,
          userId: userId,
          reason: createRefundDto.reason,
        },
      });

      // Update payment status
      await this.prisma.payment.update({
        where: { id: payment.id },
        data: {
          status: PaymentStatus.REFUNDED,
          metadata: {
            // ...payment.metadata,
            refundId: refund.id,
            refundAmount: refundAmount / 100,
            refundReason: createRefundDto.reason,
            refundedAt: new Date().toISOString(),
          },
        },
      });

      // Update order status
      await this.prisma.order.update({
        where: { id: payment.orderId },
        data: { status: 'REFUNDED' as any },
      });

      return {
        message: 'Refund created successfully',
        refundId: refund.id,
        amount: refundAmount / 100,
        currency: payment.currency,
        status: 'refunded',
      };
    } catch (error) {
      if (error instanceof Stripe.errors.StripeError) {
        throw new BadRequestException(`Stripe error: ${error.message}`);
      }
      throw error;
    }
  }

  async getPaymentMethods(userId: string): Promise<any[]> {
    try {
      // Get user's saved payment methods from Stripe
      const customer = await this.getOrCreateStripeCustomer(userId);

      const paymentMethods = await this.stripe.paymentMethods.list({
        customer: customer.id,
        type: 'card',
      });

      return paymentMethods.data.map((pm) => ({
        id: pm.id,
        type: pm.type,
        card: pm.card
          ? {
              brand: pm.card.brand,
              last4: pm.card.last4,
              expMonth: pm.card.exp_month,
              expYear: pm.card.exp_year,
            }
          : undefined,
        billingDetails: pm.billing_details
          ? {
              name: pm.billing_details.name,
              email: pm.billing_details.email,
              address: pm.billing_details.address
                ? {
                    line1: pm.billing_details.address.line1,
                    line2: pm.billing_details.address.line2,
                    city: pm.billing_details.address.city,
                    state: pm.billing_details.address.state,
                    postalCode: pm.billing_details.address.postal_code,
                    country: pm.billing_details.address.country,
                  }
                : undefined,
            }
          : undefined,
      }));
    } catch (error) {
      if (error instanceof Stripe.errors.StripeError) {
        throw new BadRequestException(`Stripe error: ${error.message}`);
      }
      throw error;
    }
  }

  async savePaymentMethod(
    paymentMethodId: string,
    userId: string,
  ): Promise<any> {
    try {
      const customer = await this.getOrCreateStripeCustomer(userId);

      // Attach payment method to customer
      await this.stripe.paymentMethods.attach(paymentMethodId, {
        customer: customer.id,
      });

      return { message: 'Payment method saved successfully' };
    } catch (error) {
      if (error instanceof Stripe.errors.StripeError) {
        throw new BadRequestException(`Stripe error: ${error.message}`);
      }
      throw error;
    }
  }

  async removePaymentMethod(
    paymentMethodId: string,
    userId: string,
  ): Promise<any> {
    try {
      const customer = await this.getOrCreateStripeCustomer(userId);

      // Verify payment method belongs to customer
      const paymentMethod =
        await this.stripe.paymentMethods.retrieve(paymentMethodId);
      if (paymentMethod.customer !== customer.id) {
        throw new ForbiddenException('Payment method does not belong to you');
      }

      // Detach payment method
      await this.stripe.paymentMethods.detach(paymentMethodId);

      return { message: 'Payment method removed successfully' };
    } catch (error) {
      if (error instanceof Stripe.errors.StripeError) {
        throw new BadRequestException(`Stripe error: ${error.message}`);
      }
      throw error;
    }
  }

  async getPaymentHistory(
    userId: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<any> {
    const skip = (page - 1) * limit;

    const [payments, total] = await Promise.all([
      this.prisma.payment.findMany({
        where: { order: { userId: userId } },
        include: { order: true },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.payment.count({
        where: { order: { userId: userId } },
      }),
    ]);

    return {
      payments: payments.map((payment) => ({
        id: payment.id,
        amount: payment.amount,
        currency: payment.currency,
        status: payment.status,
        paymentMethod: payment.paymentMethod,
        transactionId: payment.transactionId,
        createdAt: payment.createdAt,
        order: {
          id: payment.order.id,
          orderNumber: payment.order.orderNumber,
          status: payment.order.status,
        },
      })),
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async handleWebhook(
    webhookEvent: WebhookEventDto,
    signature: string,
  ): Promise<any> {
    try {
      const endpointSecret = this.configService.get<string>(
        'STRIPE_WEBHOOK_SECRET',
      );

      if (!endpointSecret) {
        throw new BadRequestException('Webhook secret not configured');
      }

      // Verify webhook signature
      let event: Stripe.Event;
      try {
        event = this.stripe.webhooks.constructEvent(
          JSON.stringify(webhookEvent),
          signature,
          endpointSecret,
        );
      } catch (err) {
        throw new BadRequestException('Webhook signature verification failed');
      }

      // Handle different event types
      switch (event.type) {
        case 'payment_intent.succeeded':
          await this.handlePaymentSuccess(
            event.data.object as Stripe.PaymentIntent,
          );
          break;
        case 'payment_intent.payment_failed':
          await this.handlePaymentFailure(
            event.data.object as Stripe.PaymentIntent,
          );
          break;
        case 'charge.refunded':
          await this.handleRefundSuccess(event.data.object as Stripe.Charge);
          break;
        default:
          console.log(`Unhandled event type: ${event.type}`);
      }

      return { message: 'Webhook processed successfully' };
    } catch (error) {
      console.error('Webhook processing error:', error);
      throw error;
    }
  }

  private async handlePaymentSuccess(
    paymentIntent: Stripe.PaymentIntent,
  ): Promise<void> {
    const payment = await this.prisma.payment.findFirst({
      where: { transactionId: paymentIntent.id },
    });

    if (payment) {
      await this.prisma.payment.update({
        where: { id: payment.id },
        data: {
          status: PaymentStatus.SUCCEEDED,
          metadata: {
            ...(payment.metadata as any),
            webhookProcessed: true,
            processedAt: new Date().toISOString(),
          },
        },
      });

      await this.prisma.order.update({
        where: { id: payment.orderId },
        data: { status: 'CONFIRMED' as any },
      });
    }
  }

  private async handlePaymentFailure(
    paymentIntent: Stripe.PaymentIntent,
  ): Promise<void> {
    const payment = await this.prisma.payment.findFirst({
      where: { transactionId: paymentIntent.id },
    });

    if (payment) {
      await this.prisma.payment.update({
        where: { id: payment.id },
        data: {
          status: PaymentStatus.FAILED,
          metadata: {
            ...(payment.metadata as any),
            webhookProcessed: true,
            failureReason: paymentIntent.last_payment_error?.message,
            processedAt: new Date().toISOString(),
          },
        },
      });
    }
  }

  private async handleRefundSuccess(charge: Stripe.Charge): Promise<void> {
    const payment = await this.prisma.payment.findFirst({
      where: { transactionId: charge.payment_intent as string },
    });

    if (payment) {
      await this.prisma.payment.update({
        where: { id: payment.id },
        data: {
          status: PaymentStatus.REFUNDED,
          metadata: {
            ...(payment.metadata as any),
            webhookProcessed: true,
            refundProcessed: true,
            processedAt: new Date().toISOString(),
          },
        },
      });

      await this.prisma.order.update({
        where: { id: payment.orderId },
        data: { status: 'REFUNDED' as any },
      });
    }
  }

  private async getOrCreateStripeCustomer(
    userId: string,
  ): Promise<Stripe.Customer> {
    // Check if user already has a Stripe customer ID
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, name: true, stripeCustomerId: true },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.stripeCustomerId) {
      try {
        return (await this.stripe.customers.retrieve(
          user.stripeCustomerId,
        )) as any;
      } catch (error) {
        // Customer might have been deleted in Stripe, create a new one
        console.log('Stripe customer not found, creating new one');
      }
    }

    // Create new Stripe customer
    const customer = await this.stripe.customers.create({
      email: user.email,
      name: user.name,
      metadata: {
        userId: user.id,
      },
    });

    // Update user with Stripe customer ID
    await this.prisma.user.update({
      where: { id: userId },
      data: { stripeCustomerId: customer.id as any },
    });

    return customer;
  }

  async getPaymentStatus(
    paymentIntentId: string,
    userId: string,
  ): Promise<any> {
    const payment = await this.prisma.payment.findFirst({
      where: {
        transactionId: paymentIntentId,
        order: { userId: userId },
      },
      include: { order: true },
    });

    if (!payment) {
      throw new NotFoundException('Payment not found or access denied');
    }

    return {
      id: payment.id,
      status: payment.status,
      amount: payment.amount,
      currency: payment.currency,
      orderId: payment.orderId,
      orderNumber: payment.order.orderNumber,
      createdAt: payment.createdAt,
      updatedAt: payment.updatedAt,
    };
  }
}
