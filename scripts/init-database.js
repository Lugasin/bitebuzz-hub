const admin = require('firebase-admin');
const serviceAccount = require('../serviceAccountKey.json'); // Your service account key

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://vonsedriverapp-default-rtdb.firebaseio.com'
});

const db = admin.database();
const rootRef = db.ref();

const initializeDatabase = async () => {
  try {
    console.log('Starting database initialization...');
    
    // Base structure
    const baseStructure = {
      users: {
        byRole: {
          customers: true,
          delivery: true,
          vendors: true,
          admins: true,
          superadmins: true
        }
      },
      vendors: {
        metadata: {
          totalCount: 0
        }
      },
      orders: {
        active: {},
        history: {},
        metadata: {
          totalCount: 0
        }
      },
      delivery: {
        personnel: {},
        assignments: {},
        metadata: {
          activeDeliveries: 0,
          availablePersonnel: 0
        }
      },
      notifications: {},
      system: {
        config: {
          fees: {
            deliveryBase: 2.99,
            serviceFeePercentage: 10
          },
          taxes: {
            salesTaxPercentage: 8.25
          },
          categories: {
            food: [
              "Fast Food", 
              "Pizza", 
              "Asian", 
              "Italian", 
              "Mexican", 
              "Healthy",
              "Breakfast",
              "Desserts",
              "Drinks"
            ],
            grocery: [
              "Produce",
              "Dairy",
              "Meat",
              "Bakery",
              "Frozen",
              "Snacks",
              "Beverages",
              "Household",
              "Personal Care"
            ]
          },
          promotions: {
            active: false,
            newUserDiscount: 15
          }
        },
        logs: {
          lastInitialized: admin.database.ServerValue.TIMESTAMP
        },
        analytics: {
          orderCounts: {
            daily: {},
            weekly: {},
            monthly: {}
          },
          revenue: {
            daily: {},
            weekly: {},
            monthly: {}
          }
        }
      }
    };

    // Sample users
    const sampleUsers = {
      'user1': {
        profile: {
          name: 'John Customer',
          email: 'john@example.com',
          phone: '+15551234567',
          address: '123 Main St, Anytown, USA',
          role: 'customer',
          profileImage: 'default-profile.jpg',
          createdAt: admin.database.ServerValue.TIMESTAMP
        }
      },
      'user2': {
        profile: {
          name: 'Vendor Restaurant',
          email: 'vendor@restaurant.com',
          phone: '+15559876543',
          address: '456 Food Ave, Cookville, USA',
          role: 'vendor',
          profileImage: 'default-vendor.jpg',
          createdAt: admin.database.ServerValue.TIMESTAMP
        }
      },
      'user3': {
        profile: {
          name: 'Delivery Driver',
          email: 'driver@example.com',
          phone: '+15552223333',
          role: 'delivery',
          profileImage: 'default-driver.jpg',
          createdAt: admin.database.ServerValue.TIMESTAMP
        }
      },
      'admin1': {
        profile: {
          name: 'Admin User',
          email: 'admin@bitebuzz.com',
          phone: '+15554446666',
          role: 'admin',
          profileImage: 'admin-profile.jpg',
          createdAt: admin.database.ServerValue.TIMESTAMP
        }
      }
    };

    // Sample food vendors
    const foodVendors = {
      'vendor1': {
        profile: {
          name: 'Tasty Bites Restaurant',
          description: 'Delicious food, delivered fast.',
          logo: 'tasty-bites-logo.jpg',
          coverImage: 'tasty-bites-cover.jpg',
          address: '456 Food Ave, Cookville, USA',
          location: {
            lat: 37.7749,
            long: -122.4194
          },
          category: 'food',
          cuisineType: 'Fast Food',
          contactInfo: {
            phone: '+15559876543',
            email: 'info@tastybites.com'
          },
          ownerId: 'user2',
          status: 'open',
          operatingHours: {
            monday: { open: '08:00', close: '22:00' },
            tuesday: { open: '08:00', close: '22:00' },
            wednesday: { open: '08:00', close: '22:00' },
            thursday: { open: '08:00', close: '22:00' },
            friday: { open: '08:00', close: '23:00' },
            saturday: { open: '09:00', close: '23:00' },
            sunday: { open: '09:00', close: '21:00' }
          }
        },
        menu: {
          categories: {
            'cat1': {
              name: 'Appetizers',
              description: 'Start your meal right',
              image: 'appetizers.jpg'
            },
            'cat2': {
              name: 'Main Courses',
              description: 'Hearty meals for everyone',
              image: 'main-courses.jpg'
            },
            'cat3': {
              name: 'Desserts',
              description: 'Sweet treats to finish',
              image: 'desserts.jpg'
            }
          },
          items: {
            'item1': {
              name: 'Spring Rolls',
              description: 'Fresh vegetables wrapped in a crispy shell',
              price: 5.99,
              image: 'spring-rolls.jpg',
              categoryId: 'cat1',
              available: true
            },
            'item2': {
              name: 'Burger Deluxe',
              description: 'Juicy beef patty with all the fixings',
              price: 12.99,
              image: 'burger.jpg',
              categoryId: 'cat2',
              available: true
            },
            'item3': {
              name: 'Chocolate Cake',
              description: 'Rich chocolate cake with fudge frosting',
              price: 6.99,
              image: 'chocolate-cake.jpg',
              categoryId: 'cat3',
              available: true
            }
          }
        },
        ratings: {
          average: 4.5,
          reviewCount: 24
        }
      }
    };

    // Sample grocery vendor
    const groceryVendors = {
      'vendor2': {
        profile: {
          name: 'Fresh Market Groceries',
          description: 'Fresh produce and groceries delivered to your door.',
          logo: 'fresh-market-logo.jpg',
          coverImage: 'fresh-market-cover.jpg',
          address: '789 Market St, Anytown, USA',
          location: {
            lat: 37.7899,
            long: -122.4094
          },
          category: 'grocery',
          contactInfo: {
            phone: '+15551112222',
            email: 'info@freshmarket.com'
          },
          ownerId: 'user2',
          status: 'open',
          operatingHours: {
            monday: { open: '07:00', close: '23:00' },
            tuesday: { open: '07:00', close: '23:00' },
            wednesday: { open: '07:00', close: '23:00' },
            thursday: { open: '07:00', close: '23:00' },
            friday: { open: '07:00', close: '23:00' },
            saturday: { open: '08:00', close: '23:00' },
            sunday: { open: '08:00', close: '22:00' }
          }
        },
        inventory: {
          categories: {
            'cat1': {
              name: 'Produce',
              description: 'Fresh fruits and vegetables',
              image: 'produce.jpg'
            },
            'cat2': {
              name: 'Dairy',
              description: 'Milk, cheese, and other dairy products',
              image: 'dairy.jpg'
            },
            'cat3': {
              name: 'Bakery',
              description: 'Fresh breads and baked goods',
              image: 'bakery.jpg'
            }
          },
          items: {
            'item1': {
              name: 'Organic Bananas',
              description: 'Bunch of organic bananas',
              price: 1.99,
              unit: 'bunch',
              image: 'bananas.jpg',
              categoryId: 'cat1',
              available: true
            },
            'item2': {
              name: 'Whole Milk',
              description: 'Gallon of fresh whole milk',
              price: 3.49,
              unit: 'gallon',
              image: 'milk.jpg',
              categoryId: 'cat2',
              available: true
            },
            'item3': {
              name: 'Sourdough Bread',
              description: 'Freshly baked sourdough bread',
              price: 4.99,
              unit: 'loaf',
              image: 'bread.jpg',
              categoryId: 'cat3',
              available: true
            }
          }
        },
        ratings: {
          average: 4.7,
          reviewCount: 35
        }
      }
    };

    // Sample order
    const sampleOrder = {
      'order1': {
        customer: {
          userId: 'user1',
          name: 'John Customer',
          phone: '+15551234567',
          address: '123 Main St, Anytown, USA'
        },
        vendor: {
          vendorId: 'vendor1',
          name: 'Tasty Bites Restaurant'
        },
        delivery: {
          personnel: {
            userId: 'user3',
            name: 'Delivery Driver'
          },
          status: 'assigned',
          estimatedTime: 30
        },
        items: {
          'orderItem1': {
            itemId: 'item1',
            name: 'Spring Rolls',
            price: 5.99,
            quantity: 2
          },
          'orderItem2': {
            itemId: 'item2',
            name: 'Burger Deluxe',
            price: 12.99,
            quantity: 1
          }
        },
        payment: {
          method: 'credit',
          subtotal: 24.97,
          deliveryFee: 2.99,
          serviceFee: 2.50,
          tax: 2.06,
          total: 32.52,
          status: 'completed',
          transactionId: 'tx_123456789'
        },
        status: 'in-transit',
        orderType: 'food',
        timestamps: {
          placed: Date.now() - 3600000, // 1 hour ago
          confirmed: Date.now() - 3300000, // 55 min ago
          prepared: Date.now() - 1800000, // 30 min ago
          pickedUp: Date.now() - 900000 // 15 min ago
        },
        specialInstructions: 'Please ring doorbell on arrival'
      }
    };

    // Sample grocery order
    const sampleGroceryOrder = {
      'order2': {
        customer: {
          userId: 'user1',
          name: 'John Customer',
          phone: '+15551234567',
          address: '123 Main St, Anytown, USA'
        },
        vendor: {
          vendorId: 'vendor2',
          name: 'Fresh Market Groceries'
        },
        delivery: {
          personnel: {
            userId: 'user3',
            name: 'Delivery Driver'
          },
          status: 'assigned',
          estimatedTime: 45
        },
        items: {
          'orderItem1': {
            itemId: 'item1',
            name: 'Organic Bananas',
            price: 1.99,
            quantity: 1
          },
          'orderItem2': {
            itemId: 'item2',
            name: 'Whole Milk',
            price: 3.49,
            quantity: 2
          },
          'orderItem3': {
            itemId: 'item3',
            name: 'Sourdough Bread',
            price: 4.99,
            quantity: 1
          }
        },
        payment: {
          method: 'credit',
          subtotal: 13.96,
          deliveryFee: 3.99,
          serviceFee: 1.40,
          tax: 1.15,
          total: 20.50,
          status: 'completed',
          transactionId: 'tx_987654321'
        },
        status: 'delivered',
        orderType: 'grocery',
        timestamps: {
          placed: Date.now() - 7200000, // 2 hours ago
          confirmed: Date.now() - 7000000, 
          prepared: Date.now() - 6300000,
          pickedUp: Date.now() - 5400000,
          delivered: Date.now() - 4800000 // delivered 1.3 hours ago
        },
        specialInstructions: 'Leave at front door'
      }
    };

    // Set base structure
    await rootRef.update(baseStructure);
    console.log('Base structure created');

    // Add sample users
    await db.ref('users').update(sampleUsers);
    console.log('Sample users added');

    // Add users to their respective role categories
    await db.ref('users/byRole/customers/user1').set(true);
    await db.ref('users/byRole/vendors/user2').set(true);
    await db.ref('users/byRole/delivery/user3').set(true);
    await db.ref('users/byRole/admins/admin1').set(true);
    console.log('User roles categorized');

    // Add sample vendors
    await db.ref('vendors').update(foodVendors);
    await db.ref('vendors').update(groceryVendors);
    console.log('Sample vendors added');

    // Add sample orders
    await db.ref('orders').update(sampleOrder);
    await db.ref('orders').update(sampleGroceryOrder);
    await db.ref('orders/active/order1').set(true);
    await db.ref('orders/history/order2').set(true);
    console.log('Sample orders added');

    // Create a delivery assignment
    await db.ref('delivery/assignments/order1').set({
      deliveryPersonId: 'user3',
      status: 'assigned',
      assignedAt: admin.database.ServerValue.TIMESTAMP
    });
    console.log('Delivery assignment created');

    // Update delivery personnel status
    await db.ref('delivery/personnel/user3').set({
      status: 'busy',
      location: {
        lat: 37.7739,
        long: -122.4312
      },
      currentOrder: 'order1'
    });
    console.log('Delivery personnel status updated');

    // Create notifications
    await db.ref('notifications/user1/notif1').set({
      message: 'Your order is on the way!',
      type: 'order_update',
      read: false,
      timestamp: admin.database.ServerValue.TIMESTAMP,
      data: {
        orderId: 'order1',
        status: 'in-transit'
      }
    });
    console.log('Sample notifications created');

    console.log('Database initialization completed successfully!');
  } catch (error) {
    console.error('Error initializing database:', error);
  }
};

// Run the initialization
initializeDatabase()
  .then(() => {
    console.log('All done!');
    process.exit(0);
  })
  .catch(error => {
    console.error('Initialization failed:', error);
    process.exit(1);
  });