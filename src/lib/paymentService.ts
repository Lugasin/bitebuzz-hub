import { db } from './firebase';
import { doc, updateDoc, collection, addDoc } from 'firebase/firestore';

interface PaymentDetails {
  amount: number;
  currency: string;
  paymentMethod: string;
  orderId: string;
  customerId: string;
}

interface PaymentResult {
  success: boolean;
  transactionId?: string;
  error?: string;
}

class PaymentService {
  // Process payment for an order
  async processPayment(paymentDetails: PaymentDetails): Promise<PaymentResult> {
    try {
      // In a real implementation, this would call your payment gateway (e.g., Stripe)
      // For now, we'll simulate a successful payment
      const transactionId = `tx_${Date.now()}`;
      
      // Update order with payment details
      await updateDoc(doc(db, 'orders', paymentDetails.orderId), {
        paymentStatus: 'completed',
        paymentDetails: {
          transactionId,
          amount: paymentDetails.amount,
          currency: paymentDetails.currency,
          method: paymentDetails.paymentMethod,
          timestamp: new Date()
        }
      });

      // Create payment record
      await addDoc(collection(db, 'payments'), {
        ...paymentDetails,
        transactionId,
        status: 'completed',
        createdAt: new Date()
      });

      return {
        success: true,
        transactionId
      };
    } catch (error) {
      console.error('Payment processing error:', error);
      return {
        success: false,
        error: 'Payment processing failed'
      };
    }
  }

  // Get payment status for an order
  async getPaymentStatus(orderId: string) {
    try {
      const orderRef = doc(db, 'orders', orderId);
      const orderDoc = await orderRef.get();
      return orderDoc.data()?.paymentStatus || 'pending';
    } catch (error) {
      console.error('Error getting payment status:', error);
      throw error;
    }
  }

  // Refund a payment
  async refundPayment(orderId: string, amount: number): Promise<PaymentResult> {
    try {
      // In a real implementation, this would call your payment gateway's refund API
      const refundId = `rf_${Date.now()}`;
      
      await updateDoc(doc(db, 'orders', orderId), {
        paymentStatus: 'refunded',
        refundDetails: {
          refundId,
          amount,
          timestamp: new Date()
        }
      });

      return {
        success: true,
        transactionId: refundId
      };
    } catch (error) {
      console.error('Refund processing error:', error);
      return {
        success: false,
        error: 'Refund processing failed'
      };
    }
  }
}

export const paymentService = new PaymentService(); 