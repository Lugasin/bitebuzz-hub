import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography, Space, Select, Alert, Spin } from 'antd';
import { CreditCardOutlined, LockOutlined } from '@ant-design/icons';
import { paymentService } from '../lib/paymentService';

const { Text, Title } = Typography;
const { Option } = Select;

interface PaymentFormProps {
  orderId: string;
  amount: number;
  currency: string;
  onSuccess: (transactionId: string) => void;
  onError: (error: string) => void;
}

const PaymentForm: React.FC<PaymentFormProps> = ({
  orderId,
  amount,
  currency,
  onSuccess,
  onError,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (values: any) => {
    setLoading(true);
    setError(null);

    try {
      const result = await paymentService.processPayment({
        orderId,
        amount,
        currency,
        paymentMethod: values.paymentMethod,
        customerId: values.customerId,
      });

      if (result.success) {
        onSuccess(result.transactionId!);
      } else {
        setError(result.error || 'Payment failed');
        onError(result.error || 'Payment failed');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Payment processing failed';
      setError(errorMessage);
      onError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card
      title={
        <Space>
          <CreditCardOutlined />
          <Text strong>Payment Details</Text>
        </Space>
      }
      style={{ maxWidth: 500, margin: '0 auto' }}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          paymentMethod: 'card',
        }}
      >
        {error && (
          <Alert
            message="Payment Error"
            description={error}
            type="error"
            showIcon
            style={{ marginBottom: 24 }}
          />
        )}

        <Form.Item
          label="Payment Method"
          name="paymentMethod"
          rules={[{ required: true, message: 'Please select a payment method' }]}
        >
          <Select>
            <Option value="card">Credit/Debit Card</Option>
            <Option value="wallet">Digital Wallet</Option>
            <Option value="bank">Bank Transfer</Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="Card Number"
          name="cardNumber"
          rules={[
            { required: true, message: 'Please enter your card number' },
            { len: 16, message: 'Card number must be 16 digits' },
          ]}
        >
          <Input
            prefix={<CreditCardOutlined />}
            placeholder="1234 5678 9012 3456"
            maxLength={16}
          />
        </Form.Item>

        <Space style={{ width: '100%' }} align="baseline">
          <Form.Item
            label="Expiry Date"
            name="expiryDate"
            rules={[
              { required: true, message: 'Please enter expiry date' },
              { pattern: /^(0[1-9]|1[0-2])\/\d{2}$/, message: 'Format: MM/YY' },
            ]}
          >
            <Input placeholder="MM/YY" maxLength={5} />
          </Form.Item>

          <Form.Item
            label="CVV"
            name="cvv"
            rules={[
              { required: true, message: 'Please enter CVV' },
              { len: 3, message: 'CVV must be 3 digits' },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="123"
              maxLength={3}
            />
          </Form.Item>
        </Space>

        <Form.Item
          label="Cardholder Name"
          name="cardholderName"
          rules={[{ required: true, message: 'Please enter cardholder name' }]}
        >
          <Input placeholder="John Doe" />
        </Form.Item>

        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <Text type="secondary">
            Amount to pay: {currency} {amount.toFixed(2)}
          </Text>
        </div>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            block
            loading={loading}
            icon={<CreditCardOutlined />}
          >
            Pay Now
          </Button>
        </Form.Item>

        <div style={{ textAlign: 'center' }}>
          <Text type="secondary">
            <LockOutlined /> Your payment information is secure
          </Text>
        </div>
      </Form>
    </Card>
  );
};

export default PaymentForm; 