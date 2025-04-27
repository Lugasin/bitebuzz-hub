import express from 'express';
import prometheus from 'prom-client';
import { dbPool } from '../db';

// Create metrics
const httpRequestDuration = new prometheus.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.1, 0.5, 1, 2, 5]
});

const activeOrders = new prometheus.Gauge({
  name: 'active_orders_total',
  help: 'Total number of active orders'
});

const courierLocations = new prometheus.Gauge({
  name: 'courier_locations_total',
  help: 'Total number of courier location updates',
  labelNames: ['courier_id']
});

const paymentSuccessRate = new prometheus.Counter({
  name: 'payment_success_total',
  help: 'Total number of successful payments',
  labelNames: ['provider']
});

const paymentFailureRate = new prometheus.Counter({
  name: 'payment_failure_total',
  help: 'Total number of failed payments',
  labelNames: ['provider', 'error_type']
});

// Create metrics endpoint
export function setupMetrics(app: express.Application) {
  // Collect metrics middleware
  app.use((req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
      const duration = (Date.now() - start) / 1000;
      httpRequestDuration
        .labels(req.method, req.route?.path || req.path, res.statusCode.toString())
        .observe(duration);
    });
    next();
  });

  // Metrics endpoint
  app.get('/metrics', async (req, res) => {
    try {
      // Update active orders metric
      const [orders] = await dbPool.query(
        'SELECT COUNT(*) as count FROM orders WHERE status IN (?, ?, ?)',
        ['pending', 'preparing', 'out_for_delivery']
      );
      activeOrders.set(orders.count);

      // Update courier locations metric
      const [couriers] = await dbPool.query(
        'SELECT driver_id, COUNT(*) as count FROM courier_location_history GROUP BY driver_id'
      );
      couriers.forEach((courier: any) => {
        courierLocations.labels(courier.driver_id.toString()).set(courier.count);
      });

      // Update payment metrics
      const [payments] = await dbPool.query(
        'SELECT provider, status, COUNT(*) as count FROM payments GROUP BY provider, status'
      );
      payments.forEach((payment: any) => {
        if (payment.status === 'completed') {
          paymentSuccessRate.labels(payment.provider).inc(payment.count);
        } else {
          paymentFailureRate.labels(payment.provider, payment.status).inc(payment.count);
        }
      });

      res.set('Content-Type', prometheus.register.contentType);
      res.end(await prometheus.register.metrics());
    } catch (error) {
      console.error('Error collecting metrics:', error);
      res.status(500).end();
    }
  });
}

// Create alert rules
export const alertRules = [
  {
    alert: 'HighErrorRate',
    expr: 'rate(http_request_duration_seconds_count{status_code=~"5.."}[5m]) > 0.1',
    for: '5m',
    labels: {
      severity: 'critical'
    },
    annotations: {
      summary: 'High error rate detected',
      description: 'Error rate is above 10% for the last 5 minutes'
    }
  },
  {
    alert: 'PaymentProcessingIssues',
    expr: 'rate(payment_failure_total[5m]) > 0.05',
    for: '5m',
    labels: {
      severity: 'warning'
    },
    annotations: {
      summary: 'Payment processing issues detected',
      description: 'Payment failure rate is above 5% for the last 5 minutes'
    }
  },
  {
    alert: 'CourierLocationUpdatesStopped',
    expr: 'rate(courier_locations_total[5m]) == 0',
    for: '15m',
    labels: {
      severity: 'warning'
    },
    annotations: {
      summary: 'Courier location updates stopped',
      description: 'No courier location updates received for 15 minutes'
    }
  }
]; 