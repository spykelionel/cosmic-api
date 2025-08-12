import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
  CreatePaymentIntentDto,
  PaymentMethodDto,
  PaymentStatus,
  PaymentWebhookDto,
} from './dto';

@Injectable()
export class PaymentService {
  constructor(private prisma: PrismaService) {}

  async createPaymentIntent(
    userId: string,
    createPaymentIntentDto: CreatePaymentIntentDto,
  ) {
    const { orderId, amount, currency, paymentMethod, metadata } =
      createPaymentIntentDto;

    // Check if order exists and belongs to user
    const order = await this.prisma.order.findFirst({
      where: { id: orderId, userId },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    // Check if order already has a payment
    const existingPayment = await this.prisma.payment.findUnique({
      where: { orderId },
    });

    if (existingPayment) {
      throw new BadRequestException('Order already has a payment');
    }

    // Validate order amount matches payment amount
    if (order.totalAmount !== amount / 100) {
      // Convert cents to dollars
      throw new BadRequestException(
        'Payment amount does not match order total',
      );
    }

    // Create payment record
    const payment = await this.prisma.payment.create({
      data: {
        orderId,
        amount: amount / 100, // Store in dollars
        currency,
        status: PaymentStatus.PENDING,
        paymentMethod,
        metadata,
      },
    });

    // In a real implementation, you would integrate with a payment provider like Stripe
    // For now, we'll simulate the payment intent creation
    const paymentIntent = {
      id: `pi_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      clientSecret: `pi_${Date.now()}_${Math.random().toString(36).substr(2, 9)}_secret_${Math.random().toString(36).substr(2, 9)}`,
      amount,
      currency,
      status: 'requires_payment_method',
      paymentMethod,
      metadata: {
        orderId,
        userId,
        ...(metadata || {}),
      },
    };

    return {
      paymentIntent,
      payment: {
        id: payment.id,
        status: payment.status,
        amount: payment.amount,
        currency: payment.currency,
      },
    };
  }

  async processPayment(paymentIntentId: string, paymentMethodId: string) {
    // In a real implementation, you would confirm the payment with the payment provider
    // For now, we'll simulate the payment processing

    // Find the payment by payment intent ID (you might need to store this mapping)
    const payment = await this.prisma.payment.findFirst({
      where: {
        metadata: {
          path: ['paymentIntentId'],
          equals: paymentIntentId,
        } as any,
      },
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    // Simulate payment processing
    const updatedPayment = await this.prisma.payment.update({
      where: { id: payment.id },
      data: {
        status: PaymentStatus.COMPLETED,
        transactionId: `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        metadata: {
          // ...payment.metadata,
          paymentMethodId,
          processedAt: new Date().toISOString(),
        },
      },
    });

    // Update order status
    await this.prisma.order.update({
      where: { id: payment.orderId },
      data: { status: 'PROCESSING' },
    });

    return {
      success: true,
      payment: updatedPayment,
      message: 'Payment processed successfully',
    };
  }

  async handleWebhook(webhookData: PaymentWebhookDto) {
    const { payload, signature } = webhookData;

    // In a real implementation, you would verify the webhook signature
    // For now, we'll process the webhook without verification

    try {
      // Extract payment information from webhook payload
      const { paymentIntentId, status, amount, currency } = payload;

      // Find the payment
      const payment = await this.prisma.payment.findFirst({
        where: {
          metadata: {
            path: ['paymentIntentId'],
            equals: paymentIntentId,
          } as any,
        },
      });

      if (!payment) {
        throw new NotFoundException('Payment not found');
      }

      // Update payment status based on webhook
      let paymentStatus: PaymentStatus;
      let orderStatus: string;

      switch (status) {
        case 'succeeded':
          paymentStatus = PaymentStatus.COMPLETED;
          orderStatus = 'PROCESSING';
          break;
        case 'payment_failed':
          paymentStatus = PaymentStatus.FAILED;
          orderStatus = 'CANCELLED';
          break;
        case 'canceled':
          paymentStatus = PaymentStatus.CANCELLED;
          orderStatus = 'CANCELLED';
          break;
        default:
          paymentStatus = PaymentStatus.PROCESSING;
          orderStatus = 'PENDING';
      }

      // Update payment
      const updatedPayment = await this.prisma.payment.update({
        where: { id: payment.id },
        data: {
          // status: paymentStatus,
          metadata: {
            // ...payment.metadata,
            webhookReceivedAt: new Date().toISOString(),
            webhookStatus: status,
          },
        },
      });

      // Update order status
      await this.prisma.order.update({
        where: { id: payment.orderId },
        data: { status: orderStatus as any },
      });

      return {
        success: true,
        message: 'Webhook processed successfully',
        payment: updatedPayment,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Webhook processing failed',
        error: error.message,
      };
    }
  }

  async getPaymentMethods(userId: string) {
    // In a real implementation, you would fetch payment methods from the payment provider
    // For now, we'll return mock data
    const mockPaymentMethods: PaymentMethodDto[] = [
      {
        id: 'pm_1234567890',
        type: 'CREDIT_CARD' as any,
        details: {
          last4: '4242',
          brand: 'visa',
          expMonth: 12,
          expYear: 2025,
        },
        isDefault: true,
      },
      {
        id: 'pm_0987654321',
        type: 'DEBIT_CARD' as any,
        details: {
          last4: '5555',
          brand: 'mastercard',
          expMonth: 6,
          expYear: 2026,
        },
        isDefault: false,
      },
    ];

    return mockPaymentMethods;
  }

  async getPaymentHistory(
    userId: string,
    page: number = 1,
    limit: number = 20,
  ) {
    const skip = (page - 1) * limit;

    const [payments, total] = await Promise.all([
      this.prisma.payment.findMany({
        where: {
          order: { userId },
        },
        include: {
          order: {
            select: {
              id: true,
              orderNumber: true,
              totalAmount: true,
              status: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.payment.count({
        where: {
          order: { userId },
        },
      }),
    ]);

    return {
      payments,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async refundPayment(paymentId: string, userId: string, amount?: number) {
    // Check if payment exists and belongs to user
    const payment = await this.prisma.payment.findFirst({
      where: {
        id: paymentId,
        order: { userId },
      },
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    if (payment.status !== PaymentStatus.COMPLETED) {
      throw new BadRequestException('Payment cannot be refunded');
    }

    // In a real implementation, you would process the refund with the payment provider
    // For now, we'll simulate the refund

    const refundAmount = amount || payment.amount;

    // Create refund record
    const refund = await this.prisma.payment.create({
      data: {
        orderId: payment.orderId,
        amount: -refundAmount, // Negative amount for refund
        currency: payment.currency,
        status: PaymentStatus.REFUNDED,
        paymentMethod: payment.paymentMethod,
        metadata: {
          type: 'refund',
          originalPaymentId: payment.id,
          refundAmount,
          refundedAt: new Date().toISOString(),
        },
      },
    });

    // Update original payment status
    await this.prisma.payment.update({
      where: { id: payment.id },
      data: { status: PaymentStatus.REFUNDED },
    });

    return {
      success: true,
      refund,
      message: `Payment refunded successfully for $${refundAmount}`,
    };
  }
}
