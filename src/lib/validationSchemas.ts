export const userSchema = {
  name: {
    type: 'string',
    required: true,
    minLength: 2,
    maxLength: 50
  },
  email: {
    type: 'string',
    required: true,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  },
  password: {
    type: 'string',
    required: true,
    minLength: 8,
    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
  }
};

export const orderSchema = {
  items: {
    type: 'array',
    required: true,
    minItems: 1,
    items: {
      type: 'object',
      properties: {
        productId: {
          type: 'string',
          required: true
        },
        quantity: {
          type: 'number',
          required: true,
          minimum: 1
        }
      }
    }
  },
  deliveryAddress: {
    type: 'object',
    required: true,
    properties: {
      street: {
        type: 'string',
        required: true
      },
      city: {
        type: 'string',
        required: true
      },
      state: {
        type: 'string',
        required: true
      },
      zipCode: {
        type: 'string',
        required: true,
        pattern: /^\d{5}(-\d{4})?$/
      }
    }
  }
};

export const reviewSchema = {
  rating: {
    type: 'number',
    required: true,
    minimum: 1,
    maximum: 5
  },
  comment: {
    type: 'string',
    required: true,
    minLength: 10,
    maxLength: 500
  }
}; 