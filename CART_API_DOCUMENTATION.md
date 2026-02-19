# Cart API Documentation

## Overview
The Cart API provides endpoints for managing shopping cart functionality, including adding items, updating quantities, applying coupons, and checkout.

**Base URL:** `/cart`

**Authentication:** All endpoints require Bearer token authentication.

---

## API Endpoints

### 1. Get Current Cart
Retrieve the current cart for the authenticated user. If no cart exists, an empty cart will be created.

**Endpoint:** `GET /cart`

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "message": "Cart retrieved successfully",
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440001",
      "firstName": "John",
      "lastName": "Doe",
      "mobilePhoneNumber": "123-456-7890",
      "userId": "john.doe@example.com",
      "email": "john.doe@example.com",
      "phone": "123-456-7890",
      "verified": true,
      "media": null
    },
    "total": 549.99,
    "baseStorageCost": 500.00,
    "redeliveryFee": 0.00,
    "climateControlCost": 25.00,
    "addonsCost": 24.99,
    "addonsDeliveryCost": 10.00,
    "protectionPlanCost": 50.00,
    "savings": 0.00,
    "plan": {
      "id": "550e8400-e29b-41d4-a716-446655440002",
      "name": "Basic Plan",
      "details": "Basic storage plan with standard features",
      "hasDiscount": false,
      "discountPercentage": null,
      "perBinPrice": 166.67,
      "enabled": true,
      "status": "Active",
      "createdAt": "2025-01-01T00:00:00"
    },
    "bundle": null,
    "protectionPlan": {
      "id": "550e8400-e29b-41d4-a716-446655440003",
      "name": "Standard Protection",
      "price": 50.00,
      "displayPrice": "$50.00",
      "limit": 10000.00,
      "displayLimit": "$10,000",
      "description": "Standard protection plan coverage",
      "enabled": true,
      "status": "Active"
    },
    "addons": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440004",
        "name": "Climate Control",
        "description": "Climate controlled storage",
        "chargeType": "fixed",
        "amount": 25.00,
        "recurrence": "monthly",
        "reDeliveryFee": 0.00,
        "premiumFeatures": false,
        "enabled": true,
        "status": "Active"
      },
      {
        "id": "550e8400-e29b-41d4-a716-446655440005",
        "name": "Insurance Coverage",
        "description": "Additional insurance coverage",
        "chargeType": "percent",
        "amount": 5.00,
        "recurrence": "monthly",
        "reDeliveryFee": 0.00,
        "premiumFeatures": true,
        "enabled": true,
        "status": "Active"
      }
    ],
    "durationMonths": 12,
    "durationBins": 3,
    "climateControl": true,
    "deliveryInfo": {
      "fullName": "John Doe",
      "email": "john@example.com",
      "phone": "123-456-7890",
      "deliveryAddress": "123 Main St",
      "city": "New York",
      "state": "NY",
      "zipCode": "10001"
    },
    "couponCode": null,
    "createdAt": "2025-01-15T10:00:00",
    "updatedAt": "2025-01-15T10:30:00"
  }
}
```

**Status Codes:**
- `200 OK` - Cart retrieved successfully
- `401 Unauthorized` - User not authenticated
- `500 Internal Server Error` - Server error

---

### 2. Add Item to Cart
Add or update cart items including plan, bundle, addons, protection plan, and other cart configuration.

**Endpoint:** `POST /cart/items`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "customerId": "550e8400-e29b-41d4-a716-446655440001",
  "total": 549.99,
  "baseStorageCost": 500.00,
  "redeliveryFee": 0.00,
  "climateControlCost": 25.00,
  "addonsCost": 24.99,
  "addonsDeliveryCost": 10.00,
  "protectionPlanCost": 50.00,
  "savings": 0.00,
  "planId": "550e8400-e29b-41d4-a716-446655440002",
  "bundleId": null,
  "protectionPlanId": "550e8400-e29b-41d4-a716-446655440003",
  "addonIds": [
    "550e8400-e29b-41d4-a716-446655440004",
    "550e8400-e29b-41d4-a716-446655440005"
  ],
  "durationMonths": 12,
  "durationBins": 3,
  "climateControl": true,
  "deliveryInfo": {
    "fullName": "John Doe",
    "email": "john@example.com",
    "phone": "123-456-7890",
    "deliveryAddress": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001"
  },
  "couponCode": null
}
```

**Request Fields:**
- `customerId` (UUID, optional) - Customer ID (usually extracted from authentication)
- `total` (BigDecimal, optional) - Total cart amount
- `baseStorageCost` (BigDecimal, optional) - Base storage cost
- `redeliveryFee` (BigDecimal, optional) - Redelivery fee
- `climateControlCost` (BigDecimal, optional) - Climate control cost
- `addonsCost` (BigDecimal, optional) - Total addons cost
- `addonsDeliveryCost` (BigDecimal, optional) - Addons delivery cost
- `protectionPlanCost` (BigDecimal, optional) - Protection plan cost
- `savings` (BigDecimal, optional) - Total savings/discounts
- `planId` (UUID, optional) - Plan type ID
- `bundleId` (UUID, optional) - Bundle ID
- `protectionPlanId` (UUID, optional) - Protection plan ID
- `addonIds` (List<UUID>, optional) - List of addon IDs
- `durationMonths` (Integer, optional) - Duration in months
- `durationBins` (Integer, optional) - Number of bins
- `climateControl` (Boolean, optional) - Whether climate control is enabled
- `deliveryInfo` (Object, optional) - Delivery information as JSON object
- `couponCode` (String, optional) - Coupon code

**Response:**
```json
{
  "message": "Cart updated successfully",
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "user": { ... },
    "total": 549.99,
    "baseStorageCost": 500.00,
    "redeliveryFee": 0.00,
    "climateControlCost": 25.00,
    "addonsCost": 24.99,
    "addonsDeliveryCost": 10.00,
    "protectionPlanCost": 50.00,
    "savings": 0.00,
    "plan": { ... },
    "bundle": null,
    "protectionPlan": { ... },
    "addons": [ ... ],
    "durationMonths": 12,
    "durationBins": 3,
    "climateControl": true,
    "deliveryInfo": { ... },
    "couponCode": null,
    "createdAt": "2025-01-15T10:00:00",
    "updatedAt": "2025-01-15T10:30:00"
  }
}
```

**Status Codes:**
- `201 Created` - Cart updated successfully
- `400 Bad Request` - Invalid request data
- `401 Unauthorized` - User not authenticated
- `404 Not Found` - User not found or referenced entity not found
- `500 Internal Server Error` - Server error

---

### 3. Update Cart Item
Update cart configuration including plan, bundle, addons, protection plan, and other cart settings.

**Endpoint:** `PUT /cart/items/{id}`

**Path Parameters:**
- `id` (UUID, required) - Cart item ID (not currently used, but required for endpoint)

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "customerId": "550e8400-e29b-41d4-a716-446655440001",
  "total": 649.99,
  "baseStorageCost": 600.00,
  "redeliveryFee": 0.00,
  "climateControlCost": 25.00,
  "addonsCost": 24.99,
  "addonsDeliveryCost": 10.00,
  "protectionPlanCost": 50.00,
  "savings": 0.00,
  "planId": "550e8400-e29b-41d4-a716-446655440002",
  "bundleId": null,
  "protectionPlanId": "550e8400-e29b-41d4-a716-446655440003",
  "addonIds": [
    "550e8400-e29b-41d4-a716-446655440004"
  ],
  "durationMonths": 12,
  "durationBins": 4,
  "climateControl": true,
  "deliveryInfo": {
    "fullName": "John Doe",
    "email": "john@example.com",
    "phone": "123-456-7890",
    "deliveryAddress": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001"
  },
  "couponCode": null
}
```

**Request Fields:**
- Same as Add Item to Cart (see AddCartItemDto structure above)

**Response:**
```json
{
  "message": "Cart updated successfully",
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "user": { ... },
    "total": 649.99,
    "baseStorageCost": 600.00,
    ...
  }
}
```

**Status Codes:**
- `200 OK` - Cart updated successfully
- `400 Bad Request` - Invalid request data
- `401 Unauthorized` - User not authenticated
- `404 Not Found` - Cart item not found or referenced entity not found
- `500 Internal Server Error` - Server error

---

### 4. Remove Item from Cart
Remove an item from the cart.

**Endpoint:** `DELETE /cart/items/{id}`

**Path Parameters:**
- `id` (UUID, required) - Cart item ID

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "message": "Cart cleared successfully",
  "success": true,
  "data": null
}
```

**Status Codes:**
- `200 OK` - Item removed successfully
- `401 Unauthorized` - User not authenticated
- `404 Not Found` - Cart item not found
- `500 Internal Server Error` - Server error

---

### 5. Apply Coupon
Apply a promotional coupon code to the cart.

**Endpoint:** `POST /cart/apply-coupon`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "code": "SAVE20"
}
```

**Request Fields:**
- `code` (string, required) - Promotional coupon code

**Response:**
```json
{
  "message": "Coupon applied successfully",
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "user": { ... },
    "total": 439.99,
    "savings": 110.00,
    "couponCode": "SAVE20",
    ...
  }
}
```

**Status Codes:**
- `200 OK` - Coupon applied successfully
- `400 Bad Request` - Invalid coupon code or missing code
- `401 Unauthorized` - User not authenticated
- `404 Not Found` - Invalid or inactive promo code
- `500 Internal Server Error` - Server error

---

### 6. Checkout Cart
Process checkout for the cart with payment method and shipping address.

**Endpoint:** `POST /cart/checkout`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "paymentMethodId": "550e8400-e29b-41d4-a716-446655440010",
  "shippingAddressId": "550e8400-e29b-41d4-a716-446655440011"
}
```

**Request Fields:**
- `paymentMethodId` (UUID, required) - Payment method ID
- `shippingAddressId` (UUID, required) - Shipping address ID

**Response:**
```json
{
  "message": "Checkout completed successfully",
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "user": { ... },
    "total": 549.99,
    ...
  }
}
```

**Status Codes:**
- `200 OK` - Checkout completed successfully
- `400 Bad Request` - Invalid request data, empty cart, or missing required fields
- `401 Unauthorized` - User not authenticated
- `404 Not Found` - Cart not found
- `500 Internal Server Error` - Server error

---

## Error Response Format

All error responses follow this format:

```json
{
  "message": "Error message description",
  "success": false,
  "data": null
}
```

---

## Data Models

### CartDto
```json
{
  "id": "UUID",
  "user": "CustomUserResponseDto (nullable)",
  "total": "BigDecimal",
  "baseStorageCost": "BigDecimal",
  "redeliveryFee": "BigDecimal",
  "climateControlCost": "BigDecimal",
  "addonsCost": "BigDecimal",
  "addonsDeliveryCost": "BigDecimal",
  "protectionPlanCost": "BigDecimal",
  "savings": "BigDecimal",
  "plan": "PlanTypeDto (nullable)",
  "bundle": "BundleDto (nullable)",
  "protectionPlan": "ProtectionPlanItemDto (nullable)",
  "addons": ["AddonDto[]]",
  "durationMonths": "Integer",
  "durationBins": "Integer",
  "climateControl": "Boolean",
  "deliveryInfo": "Object (JSONB)",
  "couponCode": "String (nullable)",
  "createdAt": "LocalDateTime",
  "updatedAt": "LocalDateTime"
}
```

**Note:** The response includes full object details for:
- **user**: Complete user information (CustomUserResponseDto)
- **plan**: Full plan type details (PlanTypeDto) - includes id within the object
- **bundle**: Full bundle details (BundleDto) - includes id within the object
- **protectionPlan**: Full protection plan details (ProtectionPlanItemDto) - includes id within the object
- **addons**: Array of full addon details (AddonDto[]) - each addon includes id within the object

### AddCartItemDto / UpdateCartItemDto
```json
{
  "customerId": "UUID (optional)",
  "total": "BigDecimal (optional)",
  "baseStorageCost": "BigDecimal (optional)",
  "redeliveryFee": "BigDecimal (optional)",
  "climateControlCost": "BigDecimal (optional)",
  "addonsCost": "BigDecimal (optional)",
  "addonsDeliveryCost": "BigDecimal (optional)",
  "protectionPlanCost": "BigDecimal (optional)",
  "savings": "BigDecimal (optional)",
  "planId": "UUID (optional)",
  "bundleId": "UUID (optional)",
  "protectionPlanId": "UUID (optional)",
  "addonIds": ["UUID[]] (optional)",
  "durationMonths": "Integer (optional)",
  "durationBins": "Integer (optional)",
  "climateControl": "Boolean (optional)",
  "deliveryInfo": "Object (optional)",
  "couponCode": "String (optional)"
}
```

### ApplyCouponDto
```json
{
  "code": "String (required)"
}
```

### CheckoutDto
```json
{
  "paymentMethodId": "UUID (required)",
  "shippingAddressId": "UUID (required)"
}
```

---

## Foreign Key Relationships

The Cart entity has the following foreign key relationships:

- `user_id` → `custom_user(id)`
- `plan_id` → `plan_types(id)`
- `bundle_id` → `bundles(id)`
- `protection_plan_id` → `protection_plan_items(id)`
- `addon_ids` → `addons(id)` (array stored as JSONB)

---

## Notes

1. **Cart Creation**: A cart is automatically created when a user first adds an item or retrieves their cart.

2. **Cart Configuration**: The cart stores configuration for storage plans, bundles, addons, protection plans, and delivery information. It's not a traditional item-based cart but rather a configuration-based cart.

3. **Authentication**: All endpoints require a valid Bearer token in the Authorization header. The user ID is extracted from the authentication token using `SecurityContextHolder.getContext().getAuthentication()`.

4. **Error Handling**: All endpoints include comprehensive error handling with logging for:
   - `ResponseStatusException` - Business logic errors
   - `IllegalArgumentException` - Invalid input data
   - General `Exception` - Unexpected errors

5. **Validation**: All foreign key references (planId, bundleId, protectionPlanId, addonIds) are validated before saving to ensure data integrity.

6. **Response Messages**: 
   - Add Item: "Cart updated successfully"
   - Update Item: "Cart updated successfully"
   - Remove Item: "Cart cleared successfully"
   - Apply Coupon: "Coupon applied successfully"
   - Checkout: "Checkout completed successfully"

---

## Example Usage

### Complete Cart Workflow

1. **Get or Create Cart:**
```bash
GET /cart
Authorization: Bearer <token>
```

2. **Add Items:**
```bash
POST /cart/items
Authorization: Bearer <token>
Content-Type: application/json

{
  "planId": "550e8400-e29b-41d4-a716-446655440002",
  "protectionPlanId": "550e8400-e29b-41d4-a716-446655440003",
  "addonIds": [
    "550e8400-e29b-41d4-a716-446655440004"
  ],
  "durationMonths": 12,
  "durationBins": 3,
  "climateControl": true,
  "deliveryInfo": {
    "fullName": "John Doe",
    "email": "john@example.com",
    "phone": "123-456-7890",
    "deliveryAddress": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001"
  }
}
```

3. **Update Item:**
```bash
PUT /cart/items/{itemId}
Authorization: Bearer <token>
Content-Type: application/json

{
  "durationBins": 4,
  "addonIds": [
    "550e8400-e29b-41d4-a716-446655440004",
    "550e8400-e29b-41d4-a716-446655440005"
  ]
}
```

4. **Apply Coupon:**
```bash
POST /cart/apply-coupon
Authorization: Bearer <token>
Content-Type: application/json

{
  "code": "SAVE20"
}
```

5. **Checkout:**
```bash
POST /cart/checkout
Authorization: Bearer <token>
Content-Type: application/json

{
  "paymentMethodId": "550e8400-e29b-41d4-a716-446655440010",
  "shippingAddressId": "550e8400-e29b-41d4-a716-446655440011"
}
```

