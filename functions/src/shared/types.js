/**
 * @enum {string}
 */
const OrderStatus = {
    PENDING: "pending",
    CONFIRMED: "confirmed",
    PREPARING: "preparing",
    READY: "ready",
    IN_TRANSIT: "in_transit",
    DELIVERED: "delivered",
    CANCELLED: "cancelled"
  };
  
  /**
   * @typedef {Object} UserInfo
   * @property {string} id
   * @property {string} email
   * @property {string} [name]
   * @property {string} [phone]
   * @property {string} [profileImage]
   */
  
  /**
   * @typedef {Object} Order
   * @property {string} orderNumber
   * @property {string} userId
   * @property {UserInfo} customerInfo
   * @property {string} restaurantId
   * @property {string} restaurantName
   * @property {any} restaurantLocation  // GeoPoint
   * @property {Array<Object>} items
   * @property {number} subtotal
   * @property {number} deliveryFee
   * @property {number} serviceFee
   * @property {number} discount
   * @property {number} total
   * @property {string} paymentMethod
   * @property {string} paymentStatus
   * @property {string} status
   * @property {Object} location  // { coordinates: GeoPoint, address: string }
   * @property {string} specialInstructions
   * @property {any} estimatedDelivery  // Timestamp
   * @property {number} estimatedDeliveryMinutes
   * @property {number} distance
   * @property {any} createdAt  // Timestamp
   * @property {any} updatedAt  // Timestamp
   * @property {Array<Object>} statusHistory
   */
  
  /**
   * @typedef {Object} OrderData
   * @property {Object} order
   * @property {string} order.restaurantId
   * @property {string} [order.restaurantName]
   * @property {Array<Object>} order.items
   * @property {number} order.subtotal
   * @property {number} order.deliveryFee
   * @property {number} [order.serviceFee]
   * @property {number} [order.discount]
   * @property {number} order.total
   * @property {string} [order.specialInstructions]
   * @property {Object} location
   * @property {Object} location.coordinates  // { lat: number, lng: number }
   * @property {string} location.address
   * @property {string} paymentMethod
   * @property {Object} [user]
   * @property {string} [user.id]
   * @property {string} [user.email]
   */
  
  /**
   * @typedef {Object} WalletTransaction
   * @property {string} userId
   * @property {number} amount
   * @property {"credit" | "debit"} type
   * @property {string} reference
   * @property {any} createdAt  // Timestamp
   */
  
  module.exports = {
    OrderStatus
  };
  