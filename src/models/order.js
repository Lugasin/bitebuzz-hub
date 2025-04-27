class Order {
  constructor({
    customerId,
    restaurantId,
    items = [],
    totalAmount = 0,
    deliveryFee = 0,
    tax = 0,
    status = 'pending',
    deliveryAddress = {},
    restaurantLocation = {},
    specialInstructions = '',
    paymentMethod = '',
    paymentStatus = 'pending',
    estimatedDeliveryTime = null,
    actualDeliveryTime = null,
    createdAt = new Date(),
    updatedAt = new Date()
  }) {
    this.customerId = customerId;
    this.restaurantId = restaurantId;
    this.items = items;
    this.totalAmount = totalAmount;
    this.deliveryFee = deliveryFee;
    this.tax = tax;
    this.status = status;
    this.deliveryAddress = deliveryAddress;
    this.restaurantLocation = restaurantLocation;
    this.specialInstructions = specialInstructions;
    this.paymentMethod = paymentMethod;
    this.paymentStatus = paymentStatus;
    this.estimatedDeliveryTime = estimatedDeliveryTime;
    this.actualDeliveryTime = actualDeliveryTime;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.driverId = null;
  }

  toJSON() {
    return {
      customerId: this.customerId,
      restaurantId: this.restaurantId,
      items: this.items,
      totalAmount: this.totalAmount,
      deliveryFee: this.deliveryFee,
      tax: this.tax,
      status: this.status,
      deliveryAddress: this.deliveryAddress,
      restaurantLocation: this.restaurantLocation,
      specialInstructions: this.specialInstructions,
      paymentMethod: this.paymentMethod,
      paymentStatus: this.paymentStatus,
      estimatedDeliveryTime: this.estimatedDeliveryTime,
      actualDeliveryTime: this.actualDeliveryTime,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      driverId: this.driverId
    };
  }

  static fromJSON(json) {
    return new Order(json);
  }

  calculateTotal() {
    const subtotal = this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    this.totalAmount = subtotal + this.deliveryFee + this.tax;
    return this.totalAmount;
  }

  updateStatus(newStatus) {
    const validStatuses = [
      'pending',
      'confirmed',
      'preparing',
      'ready_for_pickup',
      'picked_up',
      'in_transit',
      'delivered',
      'cancelled'
    ];

    if (!validStatuses.includes(newStatus)) {
      throw new Error('Invalid order status');
    }

    this.status = newStatus;
    this.updatedAt = new Date();
  }

  assignDriver(driverId) {
    this.driverId = driverId;
    this.updatedAt = new Date();
  }

  updateDeliveryTime(actualTime) {
    this.actualDeliveryTime = actualTime;
    this.updatedAt = new Date();
  }

  updatePaymentStatus(status) {
    const validStatuses = ['pending', 'completed', 'failed', 'refunded'];
    
    if (!validStatuses.includes(status)) {
      throw new Error('Invalid payment status');
    }

    this.paymentStatus = status;
    this.updatedAt = new Date();
  }
}

export default Order; 