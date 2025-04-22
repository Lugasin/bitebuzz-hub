# PROJECT_FUNCTIONS.md

This file documents all the functions, triggers, and model methods in the project. It is intended for super admins to use for troubleshooting and understanding the system's architecture.

## Cloud Functions

### Order Status Changed (`orderStatusChanged.js`)

*   **Description:** This cloud function triggers when the status of an order changes in the `orders` collection. It sends a notification to the user who placed the order to inform them about the status update.
*   **Trigger:** `onDocumentUpdated` in the `orders/{orderId}` collection.
*   **Input Parameters:**
    *   `event.data.before.data()`: The data of the document before the update.
    *   `event.data.after.data()`: The data of the document after the update.
*   **Output:**
    *   Sends a push notification to the user's device.
    * **Routes:**
        *   `GET /users` (get all users)
        *   `GET /users/:id` (get user by ID)
        *   `GET /users/me` (get user by firebaseUid)
        *   `POST /users` (create a new user)
        *   `PUT /users/:id` (update a user)
        *   `PUT /users/me` (update current user)
        *   `DELETE /users/:id` (delete a user)
        *   `DELETE /users/me` (delete current user)

*   **Notification Messages:**
    *   `confirmed`: "Your order has been confirmed."
    *   `preparing`: "We're preparing your order."
    *   `ready`: "Your order is ready for pickup."
    *   `in_transit`: "Your order is on the way!"
    *   `delivered`: "Order delivered! Enjoy your meal."
    *   `cancelled`: "Your order has been cancelled."
*   **Errors:**
    * `Error getting user`
    * `Error sending notification`
    * `The token is not defined`
    * `no message`

### Order Created (`orderCreated.js`)

*   **Description:** This cloud function triggers when a new order is created in the `orders` collection. It sends a notification to the vendor associated with the order to inform them about the new order.
*   **Trigger:** `onDocumentCreated` in the `orders/{orderId}` collection.
*   **Input Parameters:**
    *   `event.data.data()`: The data of the new order document.
*   **Output:**
    *   Sends a push notification to the vendor's device.
*   **Notification Message:**
    *   "You have a new order!"
* **Routes:**
    * `GET /orders` (get all orders)
    * `GET /orders/:id` (get order by ID)
    * `GET /orders/user/:userId` (get orders by user id)
    * `GET /orders/vendor/:vendorId` (get orders by vendor id)
    * `GET /orders/deliveryDriver/:deliveryDriverId` (get orders by delivery driver id)
    * `POST /orders` (create a new order)
* **Errors:**
    * `Error getting vendor`
    * `Error getting user`
    * `Error sending notification`
    * `The token is not defined`

### New Review (`newReview.js`)

*   **Description:** This cloud function triggers when a new review is created in the `reviews` collection. It sends a notification to the vendor who received the review to inform them about the new review.
*   **Trigger:** `onDocumentCreated` in the `reviews/{reviewId}` collection.
*   **Input Parameters:**
    *   `event.data.data()`: The data of the new review document.
*   **Output:**
    *   Sends a push notification to the vendor's device.
*   **Notification Message:**
    *   "You have a new review!"
    * **Routes:**
        *   `GET /reviews` (get all reviews)
        *   `GET /reviews/:id` (get review by ID)
        *   `GET /reviews/product/:productId` (get reviews by product)
        *   `GET /reviews/vendor/:vendorId` (get reviews by vendor)
        *   `GET /reviews/user/:userId` (get reviews by user)
* **Errors:**
    * `Error getting vendor`
    * `Error getting user`
    * `Error sending notification`
    * `The token is not defined`

### New Offer (`newOffer.js`)

*   **Description:** This cloud function triggers when a new offer is created in the `offers` collection. It sends a notification to all the users that follow that vendor to inform them about the new offer.
*   **Trigger:** `onDocumentCreated` in the `offers/{offerId}` collection.
*   **Input Parameters:**
    *   `event.data.data()`: The data of the new offer document.
*   **Output:**
    *   Sends a push notification to the users that follow that vendor.
*   **Notification Message:**
    *   "There is a new offer in one of your favourite restaurants!"
    * **Routes:**
        *   `GET /offers` (get all offers)
        *   `GET /offers/:id` (get offer by ID)
        *   `GET /offers/product/:productId` (get offers by product)
        *   `GET /offers/vendor/:vendorId` (get offers by vendor)
* **Errors:**
    * `Error getting vendor`
    * `Error getting user`
    * `Error sending notification`
    * `The token is not defined`

## Model Methods

### User Model (`user.js`)

*   **`createUser(userData)`**
    *   **Description:** Creates a new user in the `users` collection.
    *   **Parameters:** `userData` (object): User data (e.g., `uid`, `displayName`, `email`, `phoneNumber`, `photoURL`, `role`, `createdAt`, `updatedAt`).
    *   **Output:** Resolves with the newly created user data, rejects with an error if the creation fails.
    * **Errors:**
        * `Error creating user`
*   **`updateUserByFirebaseUid(firebaseUid, updateData)`**
    *   **Description:** Updates an existing user in the `users` collection by their Firebase UID.
    *   **Parameters:**
        *   `firebaseUid` (string): The Firebase UID of the user to update.
        *   `updateData` (object): The data to update (e.g., `displayName`, `email`).
    *   **Output:** Resolves if the update is successful, rejects with an error if the update fails.
    * **Errors:**
        * `Error getting user`
        * `Error updating user`
*   **`getUserByFirebaseUid(firebaseUid)`**
    *   **Description:** Gets a user from the `users` collection by their Firebase UID.
    *   **Parameters:** `firebaseUid` (string): The Firebase UID of the user.
    *   **Output:** Resolves with the user data if found, resolves with `undefined` if not found, rejects with an error if the operation fails.
    * **Errors:**
        * `Error getting user`
*   **`deleteUser(firebaseUid)`**
    *   **Description:** Deletes a user from the `users` collection by their Firebase UID.
    *   **Parameters:** `firebaseUid` (string): The Firebase UID of the user to delete.
    *   **Output:** Resolves if the deletion is successful, rejects with an error if the deletion fails.
    * **Errors:**
        * `Error deleting user`
*   **`getAllUsers()`**
    *   **Description:** Gets all users from the `users` collection.
    *   **Parameters:** None.
    *   **Output:** Resolves with an array of user data, rejects with an error if the operation fails.
    * **Errors:**
        * `Error getting users`
*   **`getUserById(id)`**
    *   **Description:** Gets a user from the `users` collection by their ID.
    *   **Parameters:** `id` (string): The ID of the user.
    *   **Output:** Resolves with the user data if found, resolves with `undefined` if not found, rejects with an error if the operation fails.
    * **Errors:**
        * `Error getting user`
    * **Routes:**
        *   `GET /vendors` (get all vendors)
        *   `GET /vendors/:id` (get vendor by ID)
        *   `GET /vendors/me` (get vendor by firebaseUid)
        *   `POST /vendors` (create a new vendor)
        *   `PUT /vendors/:id` (update a vendor)
        *   `PUT /vendors/me` (update current vendor)
        *   `DELETE /vendors/:id` (delete a vendor)
        *   `DELETE /vendors/me` (delete current vendor)
        * `Error getting user`

### Vendor Model (`vendor.js`)

*   **`createVendor(vendorData)`**
    *   **Description:** Creates a new vendor in the `vendors` collection.
    *   **Parameters:** `vendorData` (object): Vendor data.
    *   **Output:** Resolves with the newly created vendor data, rejects with an error if the creation fails.
    * **Errors:**
        * `Error creating vendor`
*   **`updateVendorByFirebaseUid(firebaseUid, updateData)`**
    *   **Description:** Updates an existing vendor in the `vendors` collection by their Firebase UID.
    *   **Parameters:**
        *   `firebaseUid` (string): The Firebase UID of the vendor to update.
        *   `updateData` (object): The data to update.
    *   **Output:** Resolves if the update is successful, rejects with an error if the update fails.
    * **Errors:**
        * `Error getting vendor`
        * `Error updating vendor`
*   **`getVendorByFirebaseUid(firebaseUid)`**
    *   **Description:** Gets a vendor from the `vendors` collection by their Firebase UID.
    *   **Parameters:** `firebaseUid` (string): The Firebase UID of the vendor.
    *   **Output:** Resolves with the vendor data if found, resolves with `undefined` if not found, rejects with an error if the operation fails.
    * **Errors:**
        * `Error getting vendor`
*   **`deleteVendor(firebaseUid)`**
    *   **Description:** Deletes a vendor from the `vendors` collection by their Firebase UID.
    *   **Parameters:** `firebaseUid` (string): The Firebase UID of the vendor to delete.
    *   **Output:** Resolves if the deletion is successful, rejects with an error if the deletion fails.
    * **Errors:**
        * `Error deleting vendor`
*   **`getAllVendors()`**
    *   **Description:** Gets all vendors from the `vendors` collection.
    *   **Parameters:** None.
    *   **Output:** Resolves with an array of vendor data, rejects with an error if the operation fails.
    * **Errors:**
        * `Error getting vendors`
*   **`getVendorById(id)`**
    *   **Description:** Gets a vendor from the `vendors` collection by their ID.
    *   **Parameters:** `id` (string): The ID of the vendor.
    *   **Output:** Resolves with the vendor data if found, resolves with `undefined` if not found, rejects with an error if the operation fails.
    * **Errors:**
        * `Error getting vendor`

### Admin Model (`admin.js`)

*   **`createAdmin(adminData)`**
    *   **Description:** Creates a new admin in the `admins` collection.
    *   **Parameters:** `adminData` (object): Admin data.
    *   **Output:** Resolves with the newly created admin data, rejects with an error if the creation fails.
    * **Errors:**
        * `Error creating admin`
*   **`updateAdminByFirebaseUid(firebaseUid, updateData)`**
    *   **Description:** Updates an existing admin in the `admins` collection by their Firebase UID.
    *   **Parameters:**
        *   `firebaseUid` (string): The Firebase UID of the admin to update.
        *   `updateData` (object): The data to update.
    *   **Output:** Resolves if the update is successful, rejects with an error if the update fails.
    * **Errors:**
        * `Error getting admin`
        * `Error updating admin`
*   **`getAdminByFirebaseUid(firebaseUid)`**
    *   **Description:** Gets an admin from the `admins` collection by their Firebase UID.
    *   **Parameters:** `firebaseUid` (string): The Firebase UID of the admin.
    *   **Output:** Resolves with the admin data if found, resolves with `undefined` if not found, rejects with an error if the operation fails.
    * **Errors:**
        * `Error getting admin`
*   **`deleteAdmin(firebaseUid)`**
    *   **Description:** Deletes an admin from the `admins` collection by their Firebase UID.
    *   **Parameters:** `firebaseUid` (string): The Firebase UID of the admin to delete.
    *   **Output:** Resolves if the deletion is successful, rejects with an error if the deletion fails.
    * **Errors:**
        * `Error deleting admin`
*   **`getAllAdmins()`**
    *   **Description:** Gets all admins from the `admins` collection.
    *   **Parameters:** None.
    *   **Output:** Resolves with an array of admin data, rejects with an error if the operation fails.
    * **Errors:**
        * `Error getting admins`
*   **`getAdminById(id)`**
    *   **Description:** Gets an admin from the `admins` collection by their ID.
    *   **Parameters:** `id` (string): The ID of the admin.
    *   **Output:** Resolves with the admin data if found, resolves with `undefined` if not found, rejects with an error if the operation fails.
    * **Errors:**
        * `Error getting admin`
    * **Routes:**
        *   `GET /admins` (get all admins)
        *   `GET /admins/:id` (get admin by ID)
        *   `GET /admins/me` (get admin by firebaseUid)
        *   `POST /admins` (create a new admin)
        *   `PUT /admins/:id` (update an admin)
        *   `PUT /admins/me` (update current admin)
        *   `DELETE /admins/:id` (delete an admin)
        *   `DELETE /admins/me` (delete current admin)
        * `Error getting admin`

### Delivery Driver Model (`deliveryDriver.js`)

*   **`createDeliveryDriver(deliveryDriverData)`**
    *   **Description:** Creates a new delivery driver in the `delivery_drivers` collection.
    *   **Parameters:** `deliveryDriverData` (object): Delivery driver data.
    *   **Output:** Resolves with the newly created delivery driver data, rejects with an error if the creation fails.
    * **Errors:**
        * `Error creating delivery driver`
*   **`updateDeliveryDriverByFirebaseUid(firebaseUid, updateData)`**
    *   **Description:** Updates an existing delivery driver in the `delivery_drivers` collection by their Firebase UID.
    *   **Parameters:**
        *   `firebaseUid` (string): The Firebase UID of the delivery driver to update.
        *   `updateData` (object): The data to update.
    *   **Output:** Resolves if the update is successful, rejects with an error if the update fails.
    * **Errors:**
        * `Error getting delivery driver`
        * `Error updating delivery driver`
*   **`getDeliveryDriverByFirebaseUid(firebaseUid)`**
    *   **Description:** Gets a delivery driver from the `delivery_drivers` collection by their Firebase UID.
    *   **Parameters:** `firebaseUid` (string): The Firebase UID of the delivery driver.
    *   **Output:** Resolves with the delivery driver data if found, resolves with `undefined` if not found, rejects with an error if the operation fails.
    * **Errors:**
        * `Error getting delivery driver`
*   **`deleteDeliveryDriver(firebaseUid)`**
    *   **Description:** Deletes a delivery driver from the `delivery_drivers` collection by their Firebase UID.
    *   **Parameters:** `firebaseUid` (string): The Firebase UID of the delivery driver to delete.
    *   **Output:** Resolves if the deletion is successful, rejects with an error if the deletion fails.
    * **Errors:**
        * `Error deleting delivery driver`
*   **`getAllDeliveryDrivers()`**
    *   **Description:** Gets all delivery drivers from the `delivery_drivers` collection.
    *   **Parameters:** None.
    *   **Output:** Resolves with an array of delivery driver data, rejects with an error if the operation fails.
    * **Errors:**
        * `Error getting delivery drivers`
*   **`getDeliveryDriverById(id)`**
    *   **Description:** Gets a delivery driver from the `delivery_drivers` collection by their ID.
    *   **Parameters:** `id` (string): The ID of the delivery driver.
    *   **Output:** Resolves with the delivery driver data if found, resolves with `undefined` if not found, rejects with an error if the operation fails.
    * **Errors:**
        * `Error getting delivery driver`
    * **Routes:**
        *   `GET /deliveryDrivers` (get all delivery drivers)
        *   `GET /deliveryDrivers/:id` (get delivery driver by ID)
        *   `GET /deliveryDrivers/me` (get delivery driver by firebaseUid)
        *   `POST /deliveryDrivers` (create a new delivery driver)
        *   `PUT /deliveryDrivers/:id` (update a delivery driver)
        *   `PUT /deliveryDrivers/me` (update current delivery driver)
        *   `DELETE /deliveryDrivers/:id` (delete a delivery driver)
        *   `DELETE /deliveryDrivers/me` (delete current delivery driver)
        * `Error getting delivery driver`

### Product Model (`product.js`)

*   **`createProduct(productData)`**
    *   **Description:** Creates a new product in the `products` collection.
    *   **Parameters:** `productData` (object): Product data.
    *   **Output:** Resolves with the newly created product data, rejects with an error if the creation fails.
    * **Errors:**
        * `Error creating product`
*   **`updateProduct(productId, updateData)`**
    *   **Description:** Updates an existing product in the `products` collection by its ID.
    *   **Parameters:**
        *   `productId` (string): The ID of the product to update.
        *   `updateData` (object): The data to update.
    *   **Output:** Resolves if the update is successful, rejects with an error if the update fails.
    * **Errors:**
        * `Error getting product`
        * `Error updating product`
*   **`getProductById(productId)`**
    *   **Description:** Gets a product from the `products` collection by its ID.
    *   **Parameters:** `productId` (string): The ID of the product.
    *   **Output:** Resolves with the product data if found, resolves with `undefined` if not found, rejects with an error if the operation fails.
    * **Errors:**
        * `Error getting product`
*   **`deleteProduct(productId)`**
    *   **Description:** Deletes a product from the `products` collection by its ID.
    *   **Parameters:** `productId` (string): The ID of the product to delete.
    *   **Output:** Resolves if the deletion is successful, rejects with an error if the deletion fails.
    * **Errors:**
        * `Error deleting product`
*   **`getProductsByVendorId(vendorId)`**
    *   **Description:** Gets all products from the `products` collection that belong to a specific vendor.
    *   **Parameters:** `vendorId` (string): The ID of the vendor.
    *   **Output:** Resolves with an array of product data, rejects with an error if the operation fails.
    * **Errors:**
        * `Error getting products`
*   **`getAllProducts()`**
    *   **Description:** Gets all products from the `products` collection.
    *   **Parameters:** None.
    *   **Output:** Resolves with an array of product data, rejects with an error if the operation fails.
    * **Errors:**
        * `Error getting products`
    * **Routes:**
        *   `GET /products` (get all products)
        *   `GET /products/:id` (get product by ID)
        *   `GET /products/vendor/:vendorId` (get products by vendor id)
        *   `POST /products` (create a new product)
        * `Error getting products`

### Order Model (`order.js`)

*   **`createOrder(orderData)`**
    *   **Description:** Creates a new order in the `orders` collection.
    *   **Parameters:** `orderData` (object): Order data.
    *   **Output:** Resolves with the newly created order data, rejects with an error if the creation fails.
    * **Errors:**
        * `Error creating order`
*   **`updateOrder(orderId, updateData)`**
    *   **Description:** Updates an existing order in the `orders` collection by its ID.
    *   **Parameters:**
        *   `orderId` (string): The ID of the order to update.
        *   `updateData` (object): The data to update.
    *   **Output:** Resolves if the update is successful, rejects with an error if the update fails.
    * **Errors:**
        * `Error getting order`
        * `Error updating order`
*   **`getOrderById(orderId)`**
    *   **Description:** Gets an order from the `orders` collection by its ID.
    *   **Parameters:** `orderId` (string): The ID of the order.
    *   **Output:** Resolves with the order data if found, resolves with `undefined` if not found, rejects with an error if the operation fails.
    * **Errors:**
        * `Error getting order`
*   **`deleteOrder(orderId)`**
    *   **Description:** Deletes an order from the `orders` collection by its ID.
    *   **Parameters:** `orderId` (string): The ID of the order to delete.
    *   **Output:** Resolves if the deletion is successful, rejects with an error if the deletion fails.
    * **Errors:**
        * `Error deleting order`
*   **`getOrdersByUserId(userId)`**
    *   **Description:** Gets all orders from the `orders` collection that belong to a specific user.
    *   **Parameters:** `userId` (string): The ID of the user.
    *   **Output:** Resolves with an array of order data, rejects with an error if the operation fails.
    * **Errors:**
        * `Error getting orders`
*   **`getOrdersByVendorId(vendorId)`**
    *   **Description:** Gets all orders from the `orders` collection that belong to a specific vendor.
    *   **Parameters:** `vendorId` (string): The ID of the vendor.
    *   **Output:** Resolves with an array of order data, rejects with an error if the operation fails.
    * **Errors:**
        * `Error getting orders`
*   **`getOrdersByDeliveryDriverId(deliveryDriverId)`**
    *   **Description:** Gets all orders from the `orders` collection that are assigned to a specific delivery driver.
    *   **Parameters:** `deliveryDriverId` (string): The ID of the delivery driver.
    *   **Output:** Resolves with an array of order data, rejects with an error if the operation fails.
    * **Errors:**
        * `Error getting orders`
* **`getAllOrders()`**
    *   **Description:** Gets all orders from the `orders` collection.
    *   **Parameters:** None.
    *   **Output:** Resolves with an array of order data, rejects with an error if the operation fails.
    * **Errors:**
        * `Error getting orders`
    * **Routes:**
        * `GET /categories` (get all categories)
        * `GET /categories/:id` (get category by ID)
        * `POST /categories` (create a new category)
        * `PUT /categories/:id` (update a category)
        * `Error getting orders`

### Review Model (`review.js`)

*   **`createReview(reviewData)`**
    *   **Description:** Creates a new review in the `reviews` collection.
    *   **Parameters:** `reviewData` (object): Review data.
    *   **Output:** Resolves with the newly created review data, rejects with an error if the creation fails.
    * **Errors:**
        * `Error creating review`
*   **`updateReview(reviewId, updateData)`**
    *   **Description:** Updates an existing review in the `reviews` collection by its ID.
    *   **Parameters:**
        *   `reviewId` (string): The ID of the review to update.
        *   `updateData` (object): The data to update.
    *   **Output:** Resolves if the update is successful, rejects with an error if the update fails.
    * **Errors:**
        * `Error getting review`
        * `Error updating review`
*   **`getReviewById(reviewId)`**
    *   **Description:** Gets a review from the `reviews` collection by its ID.
    *   **Parameters:** `reviewId` (string): The ID of the review.
    *   **Output:** Resolves with the review data if found, resolves with `undefined` if not found, rejects with an error if the operation fails.
    * **Errors:**
        * `Error getting review`
*   **`deleteReview(reviewId)`**
    *   **Description:** Deletes a review from the `reviews` collection by its ID.
    *   **Parameters:** `reviewId` (string): The ID of the review to delete.
    *   **Output:** Resolves if the deletion is successful, rejects with an error if the deletion fails.
    * **Errors:**
        * `Error deleting review`
*   **`getReviewsByVendorId(vendorId)`**
    *   **Description:** Gets all reviews from the `reviews` collection that belong to a specific vendor.
    *   **Parameters:** `vendorId` (string): The ID of the vendor.
    *   **Output:** Resolves with an array of review data, rejects with an error if the operation fails.
    * **Errors:**
        * `Error getting reviews`
*   **`getReviewsByUserId(userId)`**
    *   **Description:** Gets all reviews from the `reviews` collection that were created by a specific user.
    *   **Parameters:** `userId` (string): The ID of the user.
    *   **Output:** Resolves with an array of review data, rejects with an error if the operation fails.
    * **Errors:**
        * `Error getting reviews`
* **`getReviewsByProductId(productId)`**
    *   **Description:** Gets all reviews from the `reviews` collection that are for a specific product.
    *   **Parameters:** `productId` (string): The ID of the product.
    *   **Output:** Resolves with an array of review data, rejects with an error if the operation fails.
    * **Errors:**
        * `Error getting reviews`
*   **`getAllReviews()`**
    *   **Description:** Gets all reviews from the `reviews` collection.
    *   **Parameters:** None.
    *   **Output:** Resolves with an array of review data, rejects with an error if the operation fails.
    * **Errors:**
        * `Error getting reviews`
    * **Routes:**
        *   `GET /products` (get all products)
        *   `GET /products/:id` (get product by ID)
        *   `POST /products` (create a new product)
        *   `PUT /products/:id` (update a product)
        * `Error getting reviews`

### Offer Model (`offer.js`)

*   **`createOffer(offerData)`**
    *   **Description:** Creates a new offer in the `offers` collection.
    *   **Parameters:** `offerData` (object): Offer data.
    *   **Output:** Resolves with the newly created offer data, rejects with an error if the creation fails.
    * **Errors:**
        * `Error creating offer`
*   **`updateOffer(offerId, updateData)`**
    *   **Description:** Updates an existing offer in the `offers` collection by its ID.
    *   **Parameters:**
        *   `offerId` (string): The ID of the offer to update.
        *   `updateData` (object): The data to update.
    *   **Output:** Resolves if the update is successful, rejects with an error if the update fails.
    * **Errors:**
        * `Error getting offer`
        * `Error updating offer`
*   **`getOfferById(offerId)`**
    *   **Description:** Gets an offer from the `offers` collection by its ID.
    *   **Parameters:** `offerId` (string): The ID of the offer.
    *   **Output:** Resolves with the offer data if found, resolves with `undefined` if not found, rejects with an error if the operation fails.
    * **Errors:**
        * `Error getting offer`
*   **`deleteOffer(offerId)`**
    *   **Description:** Deletes an offer from the `offers` collection by its ID.
    *   **Parameters:** `offerId` (string): The ID of the offer to delete.
    *   **Output:** Resolves if the deletion is successful, rejects with an error if the deletion fails.
    * **Errors:**
        * `Error deleting offer`
*   **`getOffersByVendorId(vendorId)`**
    *   **Description:** Gets all offers from the `offers` collection that belong to a specific vendor.
    *   **Parameters:** `vendorId` (string): The ID of the vendor.
    *   **Output:** Resolves with an array of offer data, rejects with an error if the operation fails.
    * **Errors:**
        * `Error getting offers`
* **`getOffersByProductId(productId)`**
    *   **Description:** Gets all offers from the `offers` collection that are for a specific product.
    *   **Parameters:** `productId` (string): The ID of the product.
    *   **Output:** Resolves with an array of offer data, rejects with an error if the operation fails.
    * **Errors:**
        * `Error getting offers`
*   **`getAllOffers()`**
    *   **Description:** Gets all offers from the `offers` collection.
    *   **Parameters:** None.
    *   **Output:** Resolves with an array of offer data, rejects with an error if the operation fails.
    * **Errors:**
        * `Error getting offers`
    * **Routes:**
        * `GET /products/:id` (get product by ID)
        * `PUT /products/:id` (update a product)
        * `DELETE /products/:id` (delete a product)
        * `Error getting offers`

### Category Model (`category.js`)

*   **`createCategory(categoryData)`**
    *   **Description:** Creates a new category in the `categories` collection.
    *   **Parameters:** `categoryData` (object): Category data.
    *   **Output:** Resolves with the newly created category data, rejects with an error if the creation fails.
    * **Errors:**
        * `Error creating category`
*   **`updateCategory(categoryId, updateData)`**
    *   **Description:** Updates an existing category in the `categories` collection by its ID.
    *   **Parameters:**
        *   `categoryId` (string): The ID of the category to update.
        *   `updateData` (object): The data to update.
    *   **Output:** Resolves if the update is successful, rejects with an error if the update fails.
    * **Errors:**
        * `Error getting category`
        * `Error updating category`
*   **`getCategoryById(categoryId)`**
    *   **Description:** Gets a category from the `categories` collection by its ID.
    *   **Parameters:** `categoryId` (string): The ID of the category.
    *   **Output:** Resolves with the category data if found, resolves with `undefined` if not found, rejects with an error if the operation fails.
    * **Errors:**
        * `Error getting category`
*   **`deleteCategory(categoryId)`**
    *   **Description:** Deletes a category from the `categories` collection by its ID.
    *   **Parameters:** `categoryId` (string): The ID of the category to delete.
    *   **Output:** Resolves if the deletion is successful, rejects with an error if the deletion fails.
    * **Errors:**
        * `Error deleting category`
*   **`getAllCategories()`**
    *   **Description:** Gets all categories from the `categories` collection.
    *   **Parameters:** None.
    *   **Output:** Resolves with an array of category data, rejects with an error if the operation fails.
    * **Errors:**
        * `Error getting categories`
    * **Routes:**
        *   `GET /offers` (get all offers)
        *   `GET /offers/:id` (get offer by ID)
        *   `GET /offers/product/:productId` (get offers by product)
        *   `GET /offers/vendor/:vendorId` (get offers by vendor)
        *   `POST /offers` (create a new offer)
        * `Error getting categories`