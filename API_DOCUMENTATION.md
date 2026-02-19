# API Documentation

## Base URL
```
http://localhost:8089/api
```

## Common Response Format
All APIs return responses in the following format:
```json
{
  "message": "Success or error message",
  "data": { /* Response data or null */ },
  "success": true/false
}
```

---

## 1. Plan Types API

### Base Endpoint
```
/api/plan-types
```

### 1.1 Get All Plan Types
**GET** `/api/plan-types`

**Response (200 OK):**
```json
{
  "message": "Plan types fetched successfully",
  "data": [
    {
      "id": "a39c2c6e-926f-4da4-98ad-fc89ec95980b",
      "name": "Prepaid",
      "details": "Pay upfront for storage",
      "hasDiscount": true,
      "discountPercentage": 10.0,
      "enabled": true,
      "createdAt": "2024-11-06T10:00:00"
    },
    {
      "id": "b49c2c6e-926f-4da4-98ad-fc89ec95980c",
      "name": "Monthly",
      "details": "Monthly subscription plan",
      "hasDiscount": false,
      "discountPercentage": null,
      "enabled": true,
      "createdAt": "2024-11-06T10:00:00"
    }
  ],
  "success": true
}
```

### 1.2 Get Plan Type by ID
**GET** `/api/plan-types/{id}`

**Path Parameters:**
- `id` (UUID, required): Plan type ID

**Response (200 OK):**
```json
{
  "message": "Plan type fetched successfully",
  "data": {
    "id": "a39c2c6e-926f-4da4-98ad-fc89ec95980b",
    "name": "Prepaid",
    "details": "Pay upfront for storage",
    "hasDiscount": true,
    "discountPercentage": 10.0,
    "enabled": true,
    "createdAt": "2024-11-06T10:00:00"
  },
  "success": true
}
```

**Response (404 Not Found):**
```json
{
  "message": "Plan type not found",
  "data": null,
  "success": false
}
```

### 1.3 Create Plan Type
**POST** `/api/plan-types`

**Request Body:**
```json
{
  "name": "Prepaid",
  "details": "Pay upfront for storage",
  "hasDiscount": true,
  "discountPercentage": 10.0,
  "enabled": true
}
```

**Field Descriptions:**
- `name` (String, **required**): Plan type name
- `details` (String, **required**): Plan type description
- `hasDiscount` (Boolean, optional): Whether the plan has discount
- `discountPercentage` (Double, optional): Discount percentage (0-100)
- `enabled` (Boolean, optional): Whether the plan is enabled (default: true)

**Response (201 Created):**
```json
{
  "message": "Plan type created successfully",
  "data": {
    "id": "a39c2c6e-926f-4da4-98ad-fc89ec95980b",
    "name": "Prepaid",
    "details": "Pay upfront for storage",
    "hasDiscount": true,
    "discountPercentage": 10.0,
    "enabled": true,
    "createdAt": "2024-11-06T10:00:00"
  },
  "success": true
}
```

**Response (400 Bad Request - Missing Required Fields):**
```json
{
  "message": "Name is required",
  "data": null,
  "success": false
}
```

### 1.4 Update Plan Type
**PUT** `/api/plan-types/{id}`

**Path Parameters:**
- `id` (UUID, required): Plan type ID

**Request Body (all fields optional):**
```json
{
  "name": "Prepaid Plan",
  "details": "Updated description",
  "hasDiscount": false,
  "discountPercentage": null,
  "enabled": true
}
```

**Response (200 OK):**
```json
{
  "message": "Plan type updated successfully",
  "data": {
    "id": "a39c2c6e-926f-4da4-98ad-fc89ec95980b",
    "name": "Prepaid Plan",
    "details": "Updated description",
    "hasDiscount": false,
    "discountPercentage": null,
    "enabled": true,
    "createdAt": "2024-11-06T10:00:00"
  },
  "success": true
}
```

### 1.5 Delete Plan Type
**DELETE** `/api/plan-types/{id}`

**Path Parameters:**
- `id` (UUID, required): Plan type ID

**Note:** This will soft-delete all associated pricing matrices (sets status to 'Deleted' and plan_id to NULL) before deleting the plan type.

**Response (200 OK):**
```json
{
  "message": "Plan type deleted successfully",
  "data": null,
  "success": true
}
```

---

## 2. Delivery Zones API

### Base Endpoint
```
/api/delivery-zones
```

### 2.1 Get All Delivery Zones
**GET** `/api/delivery-zones`

**Response (200 OK):**
```json
{
  "message": "Delivery zones fetched successfully",
  "data": [
    {
      "id": "c59c2c6e-926f-4da4-98ad-fc89ec95980d",
      "code": "ZONE_1",
      "name": "Zone 1",
      "description": "Within 5 miles",
      "distanceMin": 0.0,
      "distanceMax": 5.0,
      "price": 25.0
    }
  ],
  "success": true
}
```

### 2.2 Get Delivery Zone by ID
**GET** `/api/delivery-zones/{id}`

**Path Parameters:**
- `id` (UUID, required): Delivery zone ID

**Response (200 OK):**
```json
{
  "message": "Delivery zone fetched successfully",
  "data": {
    "id": "c59c2c6e-926f-4da4-98ad-fc89ec95980d",
    "code": "ZONE_1",
    "name": "Zone 1",
    "description": "Within 5 miles",
    "distanceMin": 0.0,
    "distanceMax": 5.0,
    "price": 25.0
  },
  "success": true
}
```

### 2.3 Lookup Zone by Coordinates
**GET** `/api/delivery-zones/lookup?lat={latitude}&lng={longitude}`

**Query Parameters:**
- `lat` (Double, required): Latitude
- `lng` (Double, required): Longitude

**Response (200 OK):**
```json
{
  "message": "Zone lookup successful",
  "data": {
    "id": "c59c2c6e-926f-4da4-98ad-fc89ec95980d",
    "code": "ZONE_1",
    "name": "Zone 1",
    "description": "Within 5 miles",
    "distanceMin": 0.0,
    "distanceMax": 5.0,
    "price": 25.0
  },
  "success": true
}
```

### 2.4 Create Delivery Zone
**POST** `/api/delivery-zones`

**Request Body:**
```json
{
  "zoneName": "Zone 1",
  "description": "Within 5 miles",
  "distanceMin": 0.0,
  "distanceMax": 5.0,
  "price": 25.0
}
```

**Field Descriptions:**
- `zoneName` (String, optional): Zone name (code is auto-generated from name)
- `description` (String, optional): Zone description
- `distanceMin` (Double, optional): Minimum distance in miles
- `distanceMax` (Double, optional): Maximum distance in miles
- `price` (Double, optional): Base delivery fee

**Response (201 Created):**
```json
{
  "message": "Delivery zone created successfully",
  "data": {
    "id": "c59c2c6e-926f-4da4-98ad-fc89ec95980d",
    "code": "ZONE_1",
    "name": "Zone 1",
    "description": "Within 5 miles",
    "distanceMin": 0.0,
    "distanceMax": 5.0,
    "price": 25.0
  },
  "success": true
}
```

### 2.5 Update Delivery Zone
**PUT** `/api/delivery-zones/{id}`

**Path Parameters:**
- `id` (UUID, required): Delivery zone ID

**Request Body (all fields optional):**
```json
{
  "zoneName": "Zone 1 Updated",
  "description": "Updated description",
  "distanceMin": 0.0,
  "distanceMax": 10.0,
  "price": 30.0
}
```

**Response (200 OK):**
```json
{
  "message": "Delivery zone updated successfully",
  "data": {
    "id": "c59c2c6e-926f-4da4-98ad-fc89ec95980d",
    "code": "ZONE_1_UPDATED",
    "name": "Zone 1 Updated",
    "description": "Updated description",
    "distanceMin": 0.0,
    "distanceMax": 10.0,
    "price": 30.0
  },
  "success": true
}
```

### 2.6 Delete Delivery Zone
**DELETE** `/api/delivery-zones/{id}`

**Path Parameters:**
- `id` (UUID, required): Delivery zone ID

**Response (200 OK):**
```json
{
  "message": "Delivery zone deleted successfully",
  "data": null,
  "success": true
}
```

---

## 3. Bundles API

### Base Endpoint
```
/api/bundles
```

### 3.1 Get All Bundles
**GET** `/api/bundles`

**Response (200 OK):**
```json
{
  "message": "Bundles fetched successfully",
  "data": [
    {
      "id": "d69c2c6e-926f-4da4-98ad-fc89ec95980e",
      "name": "6 Month Storage Bundle",
      "description": "Perfect for seasonal storage needs",
      "months": 6,
      "bins": 5,
      "price": 299.99,
      "extrasPricing": "Extras: $25/bin, $49/bulky",
      "enabled": true
    }
  ],
  "success": true
}
```

### 3.2 Get Bundle by ID
**GET** `/api/bundles/{id}`

**Path Parameters:**
- `id` (UUID, required): Bundle ID

**Response (200 OK):**
```json
{
  "message": "Bundle fetched successfully",
  "data": {
    "id": "d69c2c6e-926f-4da4-98ad-fc89ec95980e",
    "name": "6 Month Storage Bundle",
    "description": "Perfect for seasonal storage needs",
    "months": 6,
    "bins": 5,
    "price": 299.99,
    "extrasPricing": "Extras: $25/bin, $49/bulky",
    "enabled": true
  },
  "success": true
}
```

### 3.3 Get Bundle by Code
**GET** `/api/bundles/code/{code}`

**Path Parameters:**
- `code` (String, required): Bundle code

**Response (200 OK):**
```json
{
  "message": "Bundle fetched successfully",
  "data": {
    "id": "d69c2c6e-926f-4da4-98ad-fc89ec95980e",
    "name": "6 Month Storage Bundle",
    "description": "Perfect for seasonal storage needs",
    "months": 6,
    "bins": 5,
    "price": 299.99,
    "extrasPricing": "Extras: $25/bin, $49/bulky",
    "enabled": true
  },
  "success": true
}
```

### 3.4 Create Bundle
**POST** `/api/bundles`

**Request Body:**
```json
{
  "name": "6 Month Storage Bundle",
  "description": "Perfect for seasonal storage needs",
  "months": 6,
  "bins": 5,
  "price": 299.99,
  "extrasPricing": "Extras: $25/bin, $49/bulky",
  "enabled": true
}
```

**Alternative Request Body (extrasPricing as JSON object):**
```json
{
  "name": "6 Month Storage Bundle",
  "description": "Perfect for seasonal storage needs",
  "months": 6,
  "bins": 5,
  "price": 299.99,
  "extrasPricing": {
    "description": "Extras: $25/bin, $49/bulky",
    "additionalInfo": "Some additional info"
  },
  "enabled": true
}
```

**Field Descriptions:**
- `name` (String, optional): Bundle name (code is auto-generated from name)
- `description` (String, optional): Bundle description
- `months` (Integer, optional): Term in months
- `bins` (Integer, optional): Number of bins (automatically generates inclusions JSON)
- `price` (Double, optional): Bundle price
- `extrasPricing` (String or Object, optional): Extras pricing information
  - Can be a plain string: `"Extras: $25/bin, $49/bulky"`
  - Or a JSON object: `{"description": "...", "additionalInfo": "..."}`
- `enabled` (Boolean, optional): Whether the bundle is enabled (default: true)

**Note:** The `inclusions` field is automatically generated from the `bins` field with the following structure:
```json
{
  "bins": 5,
  "climate_control": false,
  "insurance_coverage": true
}
```

**Response (201 Created):**
```json
{
  "message": "Bundle created successfully",
  "data": {
    "id": "d69c2c6e-926f-4da4-98ad-fc89ec95980e",
    "name": "6 Month Storage Bundle",
    "description": "Perfect for seasonal storage needs",
    "months": 6,
    "bins": 5,
    "price": 299.99,
    "extrasPricing": "Extras: $25/bin, $49/bulky",
    "enabled": true
  },
  "success": true
}
```

### 3.5 Update Bundle
**PUT** `/api/bundles/{id}`

**Path Parameters:**
- `id` (UUID, required): Bundle ID

**Request Body (all fields optional):**
```json
{
  "name": "6 Month Storage Bundle Updated",
  "description": "Updated description",
  "months": 12,
  "bins": 10,
  "price": 499.99,
  "extrasPricing": "Updated extras pricing",
  "enabled": false
}
```

**Response (200 OK):**
```json
{
  "message": "Bundle updated successfully",
  "data": {
    "id": "d69c2c6e-926f-4da4-98ad-fc89ec95980e",
    "name": "6 Month Storage Bundle Updated",
    "description": "Updated description",
    "months": 12,
    "bins": 10,
    "price": 499.99,
    "extrasPricing": "Updated extras pricing",
    "enabled": false
  },
  "success": true
}
```

### 3.6 Delete Bundle
**DELETE** `/api/bundles/{id}`

**Path Parameters:**
- `id` (UUID, required): Bundle ID

**Response (200 OK):**
```json
{
  "message": "Bundle deleted successfully",
  "data": null,
  "success": true
}
```

---

## 4. Addons API

### Base Endpoint
```
/api/addons
```

### 4.1 Get All Addons
**GET** `/api/addons`

**Response (200 OK):**
```json
{
  "message": "Addons fetched successfully",
  "data": [
    {
      "id": "e79c2c6e-926f-4da4-98ad-fc89ec95980f",
      "code": "CLIMATE_CONTROL",
      "name": "Climate Control",
      "description": "Temperature and humidity controlled storage",
      "chargeType": "fixed",
      "amount": 25.0,
      "recurrence": "monthly",
      "redeliveryFee": 15.0,
      "enabled": true
    }
  ],
  "success": true
}
```

### 4.2 Get Addon by ID
**GET** `/api/addons/{id}`

**Path Parameters:**
- `id` (UUID, required): Addon ID

**Response (200 OK):**
```json
{
  "message": "Addon fetched successfully",
  "data": {
    "id": "e79c2c6e-926f-4da4-98ad-fc89ec95980f",
    "code": "CLIMATE_CONTROL",
    "name": "Climate Control",
    "description": "Temperature and humidity controlled storage",
    "chargeType": "fixed",
    "amount": 25.0,
    "recurrence": "monthly",
    "redeliveryFee": 15.0,
    "enabled": true
  },
  "success": true
}
```

### 4.3 Create Addon
**POST** `/api/addons`

**Request Body:**
```json
{
  "name": "Climate Control",
  "description": "Temperature and humidity controlled storage",
  "chargeType": "fixed",
  "amount": 25.0,
  "recurrence": "monthly",
  "redeliveryFee": 15.0,
  "enabled": true
}
```

**Field Descriptions:**
- `name` (String, **required**): Addon name (code is auto-generated from name)
- `description` (String, optional): Addon description
- `chargeType` (String, optional): Charge type - `"fixed"` or `"percent"` (default: `"fixed"`)
- `amount` (Double, **required**): Charge amount
- `recurrence` (String, optional): Recurrence - `"one_time"` or `"monthly"` (default: `"monthly"`)
- `redeliveryFee` (Double, optional): Redelivery fee
- `enabled` (Boolean, optional): Whether the addon is enabled (default: true)

**Response (201 Created):**
```json
{
  "message": "Addon created successfully",
  "data": {
    "id": "e79c2c6e-926f-4da4-98ad-fc89ec95980f",
    "code": "CLIMATE_CONTROL",
    "name": "Climate Control",
    "description": "Temperature and humidity controlled storage",
    "chargeType": "fixed",
    "amount": 25.0,
    "recurrence": "monthly",
    "redeliveryFee": 15.0,
    "enabled": true
  },
  "success": true
}
```

**Response (400 Bad Request - Missing Required Fields):**
```json
{
  "message": "Name is required",
  "data": null,
  "success": false
}
```

### 4.4 Update Addon
**PUT** `/api/addons/{id}`

**Path Parameters:**
- `id` (UUID, required): Addon ID

**Request Body (all fields optional):**
```json
{
  "name": "Climate Control Updated",
  "description": "Updated description",
  "chargeType": "percent",
  "amount": 30.0,
  "recurrence": "one_time",
  "redeliveryFee": 20.0,
  "enabled": false
}
```

**Response (200 OK):**
```json
{
  "message": "Addon updated successfully",
  "data": {
    "id": "e79c2c6e-926f-4da4-98ad-fc89ec95980f",
    "code": "CLIMATE_CONTROL_UPDATED",
    "name": "Climate Control Updated",
    "description": "Updated description",
    "chargeType": "percent",
    "amount": 30.0,
    "recurrence": "one_time",
    "redeliveryFee": 20.0,
    "enabled": false
  },
  "success": true
}
```

### 4.5 Delete Addon
**DELETE** `/api/addons/{id}`

**Path Parameters:**
- `id` (UUID, required): Addon ID

**Response (200 OK):**
```json
{
  "message": "Addon deleted successfully",
  "data": null,
  "success": true
}
```

---

## 5. Pricing Matrices API

### Base Endpoint
```
/api/pricing-matrices
```

### 5.1 Get All Pricing Matrices
**GET** `/api/pricing-matrices?plan_id={planId}`

**Query Parameters:**
- `plan_id` (UUID, optional): Filter by plan ID. If not provided, returns all pricing matrices.

**Response (200 OK):**
```json
{
  "message": "Pricing matrices fetched successfully",
  "data": [
    {
      "id": "f89c2c6e-926f-4da4-98ad-fc89ec959810",
      "name": "Prepaid Pricing Matrix",
      "planId": "a39c2c6e-926f-4da4-98ad-fc89ec95980b",
      "matrix": {
        "1": {
          "1": 29.99,
          "2": 54.99,
          "3": 79.99,
          "4": 99.99,
          "5": 119.99
        },
        "3": {
          "1": 89.99,
          "2": 159.99,
          "3": 229.99,
          "4": 289.99,
          "5": 349.99
        },
        "6": {
          "1": 149.99,
          "2": 279.99,
          "3": 409.99,
          "4": 519.99,
          "5": 629.99
        },
        "12": {
          "1": 289.99,
          "2": 539.99,
          "3": 789.99,
          "4": 999.99,
          "5": 1199.99
        }
      },
      "activeFrom": "2024-11-06",
      "activeTo": null,
      "status": "Active"
    }
  ],
  "success": true
}
```

### 5.2 Get Active Pricing Matrix by Plan ID
**GET** `/api/pricing-matrices/plan/{planId}/active`

**Path Parameters:**
- `planId` (UUID, required): Plan ID

**Response (200 OK):**
```json
{
  "message": "Active pricing matrix fetched successfully",
  "data": {
    "id": "f89c2c6e-926f-4da4-98ad-fc89ec959810",
    "name": "Prepaid Pricing Matrix",
    "planId": "a39c2c6e-926f-4da4-98ad-fc89ec95980b",
    "matrix": {
      "1": {
        "1": 29.99,
        "2": 54.99,
        "3": 79.99,
        "4": 99.99,
        "5": 119.99
      },
      "3": {
        "1": 89.99,
        "2": 159.99,
        "3": 229.99,
        "4": 289.99,
        "5": 349.99
      }
    },
    "activeFrom": "2024-11-06",
    "activeTo": null,
    "status": "Active"
  },
  "success": true
}
```

**Response (404 Not Found):**
```json
{
  "message": "No active pricing matrix found for the plan",
  "data": null,
  "success": false
}
```

### 5.3 Create/Update Pricing Matrix
**POST** `/api/pricing-matrices`

**Request Body:**
```json
{
  "planId": "a39c2c6e-926f-4da4-98ad-fc89ec95980b",
  "matrix": {
    "1": {
      "1": 29.99,
      "2": 54.99,
      "3": 79.99,
      "4": 99.99,
      "5": 119.99
    },
    "3": {
      "1": 89.99,
      "2": 159.99,
      "3": 229.99,
      "4": 289.99,
      "5": 349.99
    },
    "6": {
      "1": 149.99,
      "2": 279.99,
      "3": 409.99,
      "4": 519.99,
      "5": 629.99
    },
    "12": {
      "1": 289.99,
      "2": 539.99,
      "3": 789.99,
      "4": 999.99,
      "5": 1199.99
    }
  }
}
```

**Field Descriptions:**
- `planId` (UUID, **required**): Plan type ID (foreign key to plan_types table)
- `matrix` (Map<String, Map<String, Double>>, **required**): Nested map structure for pricing
  - **First level key**: Number of months (as String, e.g., "1", "3", "6", "12")
  - **Second level key**: Number of bins (as String, e.g., "1", "2", "3", "4", "5")
  - **Value**: Price (as Double)

**Matrix Structure Explanation:**
```json
{
  "1": {        // 1 month
    "1": 29.99, // 1 bin: $29.99
    "2": 54.99  // 2 bins: $54.99
  },
  "3": {        // 3 months
    "1": 89.99, // 1 bin: $89.99
    "2": 159.99 // 2 bins: $159.99
  }
}
```

**Auto-generated Fields:**
- `name`: Automatically generated as `[Plan Name] Pricing Matrix`
- `activeFrom`: Automatically set to current date
- `activeTo`: 
  - For new matrices: `null` (until next update)
  - For old matrices (on update): Set to current date (ending their validity)
- `status`: 
  - New matrices: `"Active"`
  - Old matrices (on update): `"Inactive"`

**Behavior:**
- **If no pricing matrix exists for the planId**: Creates a new matrix (returns 201 Created)
- **If pricing matrix exists for the planId**: 
  - Sets `activeTo` and `status='Inactive'` for existing active matrices
  - Creates a new matrix entry with updated data (returns 200 OK)

**Response (201 Created - New Matrix):**
```json
{
  "message": "Pricing matrix created successfully",
  "data": {
    "id": "f89c2c6e-926f-4da4-98ad-fc89ec959810",
    "name": "Prepaid Pricing Matrix",
    "planId": "a39c2c6e-926f-4da4-98ad-fc89ec95980b",
    "matrix": {
      "1": {
        "1": 29.99,
        "2": 54.99,
        "3": 79.99,
        "4": 99.99,
        "5": 119.99
      }
    },
    "activeFrom": "2024-11-06",
    "activeTo": null,
    "status": "Active"
  },
  "success": true
}
```

**Response (200 OK - Updated Matrix):**
```json
{
  "message": "Pricing matrix updated successfully",
  "data": {
    "id": "f99c2c6e-926f-4da4-98ad-fc89ec959811",
    "name": "Prepaid Pricing Matrix",
    "planId": "a39c2c6e-926f-4da4-98ad-fc89ec95980b",
    "matrix": {
      "1": {
        "1": 29.99,
        "2": 54.99,
        "3": 79.99,
        "4": 99.99,
        "5": 119.99
      }
    },
    "activeFrom": "2024-11-06",
    "activeTo": null,
    "status": "Active"
  },
  "success": true
}
```

**Response (400 Bad Request - Missing Plan ID):**
```json
{
  "message": "Plan ID is required",
  "data": null,
  "success": false
}
```

**Response (400 Bad Request - Plan Type Not Found):**
```json
{
  "message": "Plan type not found",
  "data": null,
  "success": false
}
```

### 5.4 Delete Pricing Matrix
**DELETE** `/api/pricing-matrices/plan/{planId}`

**Path Parameters:**
- `planId` (UUID, required): Plan ID

**Request Body (optional):**
```json
{
  "pricingMatrixId": "f89c2c6e-926f-4da4-98ad-fc89ec959810"
}
```

**Behavior:**
- **If `pricingMatrixId` is provided**: Soft-deletes only that specific pricing matrix (sets status to 'Deleted')
- **If `pricingMatrixId` is NOT provided**: Soft-deletes all pricing matrices for the given `planId` (sets status to 'Deleted')

**Response (200 OK - Single Matrix Deleted):**
```json
{
  "message": "Pricing matrix deleted successfully",
  "data": null,
  "success": true
}
```

**Response (200 OK - All Matrices Deleted):**
```json
{
  "message": "All pricing matrices deleted successfully for the plan",
  "data": null,
  "success": true
}
```

**Response (404 Not Found):**
```json
{
  "message": "Pricing matrix not found",
  "data": null,
  "success": false
}
```

---

## Error Responses

### Common Error Codes

**400 Bad Request:**
- Missing required fields
- Invalid data format
- Validation errors

**404 Not Found:**
- Resource not found
- Invalid ID

**500 Internal Server Error:**
- Server-side errors
- Database errors

### Error Response Format
```json
{
  "message": "Error message describing what went wrong",
  "data": null,
  "success": false
}
```

---

## Notes

1. **UUID Format**: All IDs are in UUID format (e.g., `a39c2c6e-926f-4da4-98ad-fc89ec95980b`)

2. **Date Format**: Dates are in ISO 8601 format (e.g., `2024-11-06` or `2024-11-06T10:00:00`)

3. **Status Values**: 
   - Pricing matrices: `"Active"`, `"Inactive"`, `"Deleted"`

4. **Auto-generated Fields**:
   - Plan types: `id`, `createdAt`
   - Delivery zones: `code` (from `zoneName`)
   - Bundles: `code` (from `name`), `inclusions` (from `bins`)
   - Addons: `code` (from `name`)
   - Pricing matrices: `name`, `activeFrom`, `activeTo`, `status`

5. **Soft Delete**: 
   - Plan types: Hard delete (after soft-deleting associated pricing matrices)
   - Pricing matrices: Soft delete (status = 'Deleted', plan_id = NULL)

6. **Authentication**: All endpoints may require authentication depending on your security configuration.

