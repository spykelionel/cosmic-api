# 🚀 Stripe Payment Integration Guide for Cosmic E-commerce API

## 📋 Overview

This guide covers the complete Stripe payment integration for the Cosmic E-commerce API, including payment intents, webhooks, customer management, and payment method handling.

## 🔧 Prerequisites

### 1. **Install Dependencies**

```bash
npm install stripe @types/stripe
```

### 2. **Environment Variables**

Add these to your `.env` file:

```env
# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
STRIPE_API_VERSION=2023-10-16

# Optional: Stripe Connect (for marketplace functionality)
STRIPE_CONNECT_CLIENT_ID=ca_your_connect_client_id
```

### 3. **Stripe Account Setup**

1. Create a Stripe account at [stripe.com](https://stripe.com)
2. Get your API keys from the Stripe Dashboard
3. Set up webhook endpoints
4. Configure payment methods

## 🏗️ Architecture Overview

```
Frontend → Cosmic API → Stripe API
    ↓           ↓         ↓
Payment Form → Payment Intent → Payment Confirmation
    ↓           ↓         ↓
Card Details → Webhook → Order Update
```

## 🔄 Payment Flow

### 1. **Create Payment Intent**

```typescript
// Frontend: Create payment intent
const response = await fetch('/payments/create-intent', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  },
  body: JSON.stringify({
    orderId: 'order_123',
    paymentMethod: 'CARD',
    currency: 'USD',
  }),
});

const { clientSecret, id } = await response.json();
```

### 2. **Confirm Payment with Stripe.js**

```typescript
// Frontend: Confirm payment
import { loadStripe } from '@stripe/stripe-js';

const stripe = await loadStripe('pk_test_your_publishable_key');

const { error } = await stripe.confirmCardPayment(clientSecret, {
  payment_method: {
    card: cardElement,
    billing_details: {
      name: 'John Doe',
      email: 'john@example.com',
    },
  },
});

if (error) {
  console.error('Payment failed:', error);
} else {
  // Payment successful - confirm with backend
  await confirmPayment(id);
}
```

### 3. **Confirm Payment with Backend**

```typescript
// Frontend: Confirm payment with backend
const confirmResponse = await fetch('/payments/confirm', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  },
  body: JSON.stringify({
    paymentIntentId: id,
    orderId: 'order_123',
  }),
});
```

## 🎯 API Endpoints

### **Payment Intents**

- `POST /payments/create-intent` - Create payment intent
- `POST /payments/confirm` - Confirm payment
- `GET /payments/status/:paymentIntentId` - Get payment status

### **Refunds**

- `POST /payments/refund` - Create refund

### **Payment Methods**

- `GET /payments/methods` - Get saved payment methods
- `POST /payments/methods/save` - Save payment method
- `POST /payments/methods/remove` - Remove payment method

### **Webhooks**

- `POST /payments/webhook` - Stripe webhook handler

### **History**

- `GET /payments/history` - Get payment history

## 🔐 Security Features

### 1. **Webhook Signature Verification**

```typescript
// Backend automatically verifies webhook signatures
const event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
```

### 2. **User Ownership Validation**

- Users can only access their own payments
- Orders must belong to authenticated user
- Payment methods are customer-specific

### 3. **Rate Limiting**

- Payment creation: 20 requests/minute
- Refunds: 5 requests/minute
- Webhooks: No rate limiting (Stripe controlled)

## 💳 Payment Method Management

### 1. **Save Payment Method**

```typescript
// Frontend: Create setup intent
const setupIntent = await stripe.confirmCardSetup(clientSecret, {
  payment_method: {
    card: cardElement,
    billing_details: {
      name: 'John Doe',
      email: 'john@example.com',
    },
  },
});

// Backend: Save payment method
await fetch('/payments/methods/save', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  },
  body: JSON.stringify({
    paymentMethodId: setupIntent.setupIntent.payment_method,
  }),
});
```

### 2. **Use Saved Payment Method**

```typescript
// Frontend: Use saved payment method
const { error } = await stripe.confirmCardPayment(clientSecret, {
  payment_method: savedPaymentMethodId,
});
```

## 🔔 Webhook Handling

### 1. **Webhook Events**

- `payment_intent.succeeded` - Payment successful
- `payment_intent.payment_failed` - Payment failed
- `charge.refunded` - Refund processed

### 2. **Webhook Setup**

```bash
# Stripe CLI (for testing)
stripe listen --forward-to localhost:3000/payments/webhook

# Production webhook endpoint
https://yourdomain.com/payments/webhook
```

### 3. **Webhook Processing**

```typescript
// Backend automatically processes webhooks
switch (event.type) {
  case 'payment_intent.succeeded':
    await handlePaymentSuccess(event.data.object);
    break;
  case 'payment_intent.payment_failed':
    await handlePaymentFailure(event.data.object);
    break;
  case 'charge.refunded':
    await handleRefundSuccess(event.data.object);
    break;
}
```

## 🧪 Testing

### 1. **Test Cards**

```typescript
// Successful payment
const testCard = {
  number: '4242424242424242',
  exp_month: 12,
  exp_year: 2025,
  cvc: '123',
};

// Payment requires authentication
const authCard = {
  number: '4000002500003155',
  exp_month: 12,
  exp_year: 2025,
  cvc: '123',
};

// Payment fails
const failCard = {
  number: '4000000000000002',
  exp_month: 12,
  exp_year: 2025,
  cvc: '123',
};
```

### 2. **Test Scenarios**

- ✅ Successful payment
- ❌ Failed payment
- 🔐 3D Secure authentication
- 💳 Saved payment methods
- 💸 Refunds
- 🔔 Webhook events

## 🚀 Production Deployment

### 1. **Environment Variables**

```env
# Production Stripe keys
STRIPE_SECRET_KEY=sk_live_your_live_secret_key
STRIPE_PUBLISHABLE_KEY=pk_live_your_live_publishable_key
STRIPE_WEBHOOK_SECRET=whsec_your_live_webhook_secret
NODE_ENV=production
```

### 2. **Webhook Configuration**

- Set webhook endpoint in Stripe Dashboard
- Verify webhook signature
- Handle webhook failures gracefully
- Monitor webhook delivery

### 3. **Error Handling**

```typescript
try {
  const paymentIntent = await stripe.paymentIntents.create({
    amount: 1000,
    currency: 'usd',
  });
} catch (error) {
  if (error instanceof Stripe.errors.StripeError) {
    // Handle Stripe-specific errors
    switch (error.code) {
      case 'card_declined':
        // Handle declined card
        break;
      case 'insufficient_funds':
        // Handle insufficient funds
        break;
      default:
      // Handle other errors
    }
  }
}
```

## 📊 Monitoring & Analytics

### 1. **Stripe Dashboard**

- Payment success rates
- Failed payment analysis
- Customer behavior insights
- Revenue analytics

### 2. **Application Logs**

- Payment attempt logs
- Webhook processing logs
- Error tracking
- Performance metrics

### 3. **Alerts**

- Failed payment notifications
- Webhook delivery failures
- High error rate alerts
- Payment method issues

## 🔧 Troubleshooting

### Common Issues

1. **Webhook Signature Verification Failed**

   - Check webhook secret
   - Verify raw body parsing
   - Check Stripe signature header

2. **Payment Intent Creation Failed**

   - Verify Stripe API key
   - Check order existence
   - Validate order status

3. **Payment Confirmation Failed**

   - Check payment intent status
   - Verify user ownership
   - Check order status

4. **Refund Creation Failed**
   - Verify payment success
   - Check refund amount
   - Validate user permissions

### Debug Mode

```typescript
// Enable Stripe debug mode
const stripe = new Stripe(secretKey, {
  apiVersion: '2023-10-16',
  typescript: true,
  appInfo: {
    name: 'Cosmic E-commerce API',
    version: '1.0.0',
  },
});
```

## 📚 Additional Resources

- [Stripe API Documentation](https://stripe.com/docs/api)
- [Stripe.js Reference](https://stripe.com/docs/js)
- [Webhook Guide](https://stripe.com/docs/webhooks)
- [Testing Guide](https://stripe.com/docs/testing)
- [Security Best Practices](https://stripe.com/docs/security)

## 🎉 Next Steps

1. **Install Stripe dependencies**
2. **Configure environment variables**
3. **Set up webhook endpoints**
4. **Test payment flow**
5. **Deploy to production**
6. **Monitor and optimize**

---

**⚠️ Important**: Always test thoroughly in Stripe test mode before going live. Never commit real API keys to version control.
