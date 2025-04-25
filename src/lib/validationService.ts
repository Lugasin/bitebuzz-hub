import { userSchema, orderSchema, reviewSchema } from './validationSchemas';

export class ValidationService {
  private static validateField(value: any, schema: any): string[] {
    const errors: string[] = [];

    if (schema.required && (value === undefined || value === null || value === '')) {
      errors.push('Field is required');
      return errors;
    }

    if (value === undefined || value === null) {
      return errors;
    }

    if (schema.type && typeof value !== schema.type) {
      errors.push(`Expected type ${schema.type}, got ${typeof value}`);
    }

    if (schema.minLength && value.length < schema.minLength) {
      errors.push(`Minimum length is ${schema.minLength}`);
    }

    if (schema.maxLength && value.length > schema.maxLength) {
      errors.push(`Maximum length is ${schema.maxLength}`);
    }

    if (schema.minimum && value < schema.minimum) {
      errors.push(`Minimum value is ${schema.minimum}`);
    }

    if (schema.maximum && value > schema.maximum) {
      errors.push(`Maximum value is ${schema.maximum}`);
    }

    if (schema.pattern && !schema.pattern.test(value)) {
      errors.push('Invalid format');
    }

    return errors;
  }

  private static validateObject(obj: any, schema: any): string[] {
    const errors: string[] = [];

    for (const [key, fieldSchema] of Object.entries(schema)) {
      const value = obj[key];
      const fieldErrors = this.validateField(value, fieldSchema as any);

      if (fieldErrors.length > 0) {
        errors.push(`${key}: ${fieldErrors.join(', ')}`);
      }
    }

    return errors;
  }

  private static validateArray(arr: any[], schema: any): string[] {
    const errors: string[] = [];

    if (schema.minItems && arr.length < schema.minItems) {
      errors.push(`Minimum ${schema.minItems} items required`);
    }

    if (schema.items) {
      for (let i = 0; i < arr.length; i++) {
        const itemErrors = this.validateObject(arr[i], schema.items.properties);
        if (itemErrors.length > 0) {
          errors.push(`Item ${i}: ${itemErrors.join(', ')}`);
        }
      }
    }

    return errors;
  }

  public static validateUser(user: any): string[] {
    return this.validateObject(user, userSchema);
  }

  public static validateOrder(order: any): string[] {
    const errors: string[] = [];

    if (order.items) {
      const itemsErrors = this.validateArray(order.items, orderSchema.items);
      errors.push(...itemsErrors);
    }

    if (order.deliveryAddress) {
      const addressErrors = this.validateObject(order.deliveryAddress, orderSchema.deliveryAddress.properties);
      errors.push(...addressErrors);
    }

    return errors;
  }

  public static validateReview(review: any): string[] {
    return this.validateObject(review, reviewSchema);
  }
} 