import { pool } from '../config/database.js';
import CommissionRule from '../models/commissionRule.js';
import logger from '../utils/logger.js';
import { AppError } from '../middleware/errorHandler.js';

class CommissionService {
  async createRule(ruleData, userId) {
    try {
      // Start transaction
      const connection = await pool.getConnection();
      await connection.beginTransaction();

      try {
        // If new rule is active, deactivate all other rules
        if (ruleData.isActive) {
          await connection.query(
            'UPDATE commission_rules SET is_active = FALSE'
          );
        }

        // Insert new rule
        const [result] = await connection.query(
          `INSERT INTO commission_rules (
            name, type, value, is_active, created_by
          ) VALUES (?, ?, ?, ?, ?)`,
          [
            ruleData.name,
            ruleData.type,
            ruleData.value,
            ruleData.isActive,
            userId
          ]
        );

        const ruleId = result.insertId;
        const rule = await this.getRuleById(ruleId, connection);

        await connection.commit();
        return rule;
      } catch (error) {
        await connection.rollback();
        throw error;
      } finally {
        connection.release();
      }
    } catch (error) {
      logger.error('Error creating commission rule:', error);
      throw new AppError('Failed to create commission rule', 500);
    }
  }

  async getActiveRule() {
    try {
      const [rules] = await pool.query(
        'SELECT * FROM commission_rules WHERE is_active = TRUE LIMIT 1'
      );

      if (rules.length === 0) {
        return null;
      }

      return CommissionRule.fromJSON(rules[0]);
    } catch (error) {
      logger.error('Error getting active commission rule:', error);
      throw new AppError('Failed to get active commission rule', 500);
    }
  }

  async getRuleById(ruleId, connection = pool) {
    try {
      const [rules] = await connection.query(
        'SELECT * FROM commission_rules WHERE id = ?',
        [ruleId]
      );

      if (rules.length === 0) {
        throw new AppError('Commission rule not found', 404);
      }

      return CommissionRule.fromJSON(rules[0]);
    } catch (error) {
      logger.error('Error getting commission rule:', error);
      throw new AppError('Failed to get commission rule', 500);
    }
  }

  async getAllRules() {
    try {
      const [rules] = await pool.query(
        'SELECT * FROM commission_rules ORDER BY created_at DESC'
      );

      return rules.map(rule => CommissionRule.fromJSON(rule));
    } catch (error) {
      logger.error('Error getting commission rules:', error);
      throw new AppError('Failed to get commission rules', 500);
    }
  }

  async updateRule(ruleId, ruleData, userId) {
    try {
      const connection = await pool.getConnection();
      await connection.beginTransaction();

      try {
        const rule = await this.getRuleById(ruleId, connection);

        // If rule is being activated, deactivate all other rules
        if (ruleData.isActive && !rule.isActive) {
          await connection.query(
            'UPDATE commission_rules SET is_active = FALSE'
          );
        }

        // Update rule
        await connection.query(
          `UPDATE commission_rules 
           SET name = ?, type = ?, value = ?, is_active = ?, updated_at = CURRENT_TIMESTAMP
           WHERE id = ?`,
          [
            ruleData.name || rule.name,
            ruleData.type || rule.type,
            ruleData.value || rule.value,
            ruleData.isActive !== undefined ? ruleData.isActive : rule.isActive,
            ruleId
          ]
        );

        const updatedRule = await this.getRuleById(ruleId, connection);
        await connection.commit();
        return updatedRule;
      } catch (error) {
        await connection.rollback();
        throw error;
      } finally {
        connection.release();
      }
    } catch (error) {
      logger.error('Error updating commission rule:', error);
      throw new AppError('Failed to update commission rule', 500);
    }
  }

  async deleteRule(ruleId) {
    try {
      const connection = await pool.getConnection();
      await connection.beginTransaction();

      try {
        const rule = await this.getRuleById(ruleId, connection);

        // Don't allow deletion of active rule
        if (rule.isActive) {
          throw new AppError('Cannot delete active commission rule', 400);
        }

        await connection.query(
          'DELETE FROM commission_rules WHERE id = ?',
          [ruleId]
        );

        await connection.commit();
      } catch (error) {
        await connection.rollback();
        throw error;
      } finally {
        connection.release();
      }
    } catch (error) {
      logger.error('Error deleting commission rule:', error);
      throw new AppError('Failed to delete commission rule', 500);
    }
  }

  async calculateCommission(orderAmount, restaurantId) {
    try {
      // Get restaurant's commission rate
      const [restaurants] = await pool.query(
        'SELECT commission_rate FROM restaurants WHERE id = ?',
        [restaurantId]
      );

      if (restaurants.length === 0) {
        throw new AppError('Restaurant not found', 404);
      }

      const restaurantCommissionRate = restaurants[0].commission_rate;

      // Get active commission rule
      const activeRule = await this.getActiveRule();
      const ruleCommission = activeRule ? activeRule.calculateCommission(orderAmount) : 0;

      // Use the higher of the two rates
      const commissionRate = Math.max(restaurantCommissionRate, activeRule?.value || 0);
      const commissionAmount = (orderAmount * commissionRate) / 100;

      return {
        commissionRate,
        commissionAmount,
        netAmount: orderAmount - commissionAmount
      };
    } catch (error) {
      logger.error('Error calculating commission:', error);
      throw new AppError('Failed to calculate commission', 500);
    }
  }

  async createSettlement(orderId, restaurantId, totalAmount) {
    try {
      const { commissionRate, commissionAmount, netAmount } = await this.calculateCommission(
        totalAmount,
        restaurantId
      );

      const [result] = await pool.query(
        `INSERT INTO settlements (
          order_id, restaurant_id, total_amount, commission_amount,
          commission_rate, net_amount, status
        ) VALUES (?, ?, ?, ?, ?, ?, 'pending')`,
        [
          orderId,
          restaurantId,
          totalAmount,
          commissionAmount,
          commissionRate,
          netAmount
        ]
      );

      return result.insertId;
    } catch (error) {
      logger.error('Error creating settlement:', error);
      throw new AppError('Failed to create settlement', 500);
    }
  }
}

export default new CommissionService(); 