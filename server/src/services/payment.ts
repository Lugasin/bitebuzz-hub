import axios from 'axios';
import { dbPool } from '../db';
import { v4 as uuidv4 } from 'uuid';

interface PaymentConfig {
  mtn: {
    apiKey: string;
    apiSecret: string;
    baseUrl: string;
  };
  airtel: {
    apiKey: string;
    apiSecret: string;
    baseUrl: string;
  };
}

class PaymentService {
  private config: PaymentConfig;

  constructor(config: PaymentConfig) {
    this.config = config;
  }

  // MTN Mobile Money Payment
  async processMTNPayment(orderId: string, amount: number, phoneNumber: string) {
    try {
      const transactionId = uuidv4();
      
      // Initiate MTN payment
      const response = await axios.post(
        `${this.config.mtn.baseUrl}/payment/request`,
        {
          amount,
          phoneNumber,
          transactionId,
          callbackUrl: `${process.env.API_URL}/payments/webhook/mtn`
        },
        {
          headers: {
            'Authorization': `Bearer ${this.config.mtn.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      // Store payment record
      await dbPool.query(
        'INSERT INTO payments (order_id, provider, transaction_id, amount, status, created_at) VALUES (?, ?, ?, ?, ?, NOW())',
        [orderId, 'mtn', transactionId, amount, 'pending']
      );

      return {
        success: true,
        transactionId,
        paymentUrl: response.data.paymentUrl
      };
    } catch (error) {
      console.error('MTN payment error:', error);
      throw new Error('Failed to process MTN payment');
    }
  }

  // Airtel Money Payment
  async processAirtelPayment(orderId: string, amount: number, phoneNumber: string) {
    try {
      const transactionId = uuidv4();
      
      // Initiate Airtel payment
      const response = await axios.post(
        `${this.config.airtel.baseUrl}/payment/request`,
        {
          amount,
          phoneNumber,
          transactionId,
          callbackUrl: `${process.env.API_URL}/payments/webhook/airtel`
        },
        {
          headers: {
            'Authorization': `Bearer ${this.config.airtel.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      // Store payment record
      await dbPool.query(
        'INSERT INTO payments (order_id, provider, transaction_id, amount, status, created_at) VALUES (?, ?, ?, ?, ?, NOW())',
        [orderId, 'airtel', transactionId, amount, 'pending']
      );

      return {
        success: true,
        transactionId,
        paymentUrl: response.data.paymentUrl
      };
    } catch (error) {
      console.error('Airtel payment error:', error);
      throw new Error('Failed to process Airtel payment');
    }
  }

  // Handle MTN payment webhook
  async handleMTNWebhook(data: any) {
    try {
      const { transactionId, status, amount } = data;

      // Verify webhook signature
      const isValid = this.verifyMTNSignature(data);
      if (!isValid) {
        throw new Error('Invalid webhook signature');
      }

      // Update payment status
      await dbPool.query(
        'UPDATE payments SET status = ? WHERE transaction_id = ?',
        [status, transactionId]
      );

      // Update order status if payment successful
      if (status === 'completed') {
        const [payment] = await dbPool.query(
          'SELECT order_id FROM payments WHERE transaction_id = ?',
          [transactionId]
        );

        if (payment) {
          await dbPool.query(
            'UPDATE orders SET payment_status = ? WHERE id = ?',
            ['paid', payment.order_id]
          );
        }
      }

      return { success: true };
    } catch (error) {
      console.error('MTN webhook error:', error);
      throw error;
    }
  }

  // Handle Airtel payment webhook
  async handleAirtelWebhook(data: any) {
    try {
      const { transactionId, status, amount } = data;

      // Verify webhook signature
      const isValid = this.verifyAirtelSignature(data);
      if (!isValid) {
        throw new Error('Invalid webhook signature');
      }

      // Update payment status
      await dbPool.query(
        'UPDATE payments SET status = ? WHERE transaction_id = ?',
        [status, transactionId]
      );

      // Update order status if payment successful
      if (status === 'completed') {
        const [payment] = await dbPool.query(
          'SELECT order_id FROM payments WHERE transaction_id = ?',
          [transactionId]
        );

        if (payment) {
          await dbPool.query(
            'UPDATE orders SET payment_status = ? WHERE id = ?',
            ['paid', payment.order_id]
          );
        }
      }

      return { success: true };
    } catch (error) {
      console.error('Airtel webhook error:', error);
      throw error;
    }
  }

  private verifyMTNSignature(data: any): boolean {
    // Implement MTN signature verification
    // This is a placeholder - actual implementation depends on MTN's API
    return true;
  }

  private verifyAirtelSignature(data: any): boolean {
    // Implement Airtel signature verification
    // This is a placeholder - actual implementation depends on Airtel's API
    return true;
  }
}

export default PaymentService; 