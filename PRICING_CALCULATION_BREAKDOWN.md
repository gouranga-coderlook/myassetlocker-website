# Pricing Calculation Breakdown - All Possible Combinations

This document outlines all possible combinations of pricing calculations used in the booking system.

## Table of Contents
1. [Base Components](#base-components)
2. [Calculation Scenarios](#calculation-scenarios)
3. [Formula Reference](#formula-reference)
4. [Examples](#examples)

---

## Base Components

### 1. **Base Storage Cost**
- **Regular Plan (No Bundle)**: Calculated from plan pricing matrix
  - Formula: `plan.pricing[months][bins].base`
  - Example: 10 bins × 3 months = $225.00

- **Bundle Plan**: Uses bundle price
  - Formula: `bundle.price` (may have plan discount applied)
  - Example: Summer Bundle = $500.00

### 2. **Re-delivery Fee**
- **Regular Plan**: From pricing matrix
  - Formula: `plan.pricing[months][bins].deliveryFee`
  - Example: $10.00
  
- **Bundle Plan**: Always $0 (bundles are all-inclusive)

### 3. **Delivery Charge**
- **Matched Zone**: Uses zone price
  - Formula: `locationData.matchedZone.price`
  - Example: Zone A = $50.00

- **Delivery Charge (No Zone)**: Uses calculated delivery charge
  - Formula: `locationData.deliveryCharge`
  - **India Region**: Converts INR to USD (divide by 83)
  - **Other Regions**: Uses as-is
  - Example: $638.74 (or ₹53,015.42 in India = $638.74 USD)

### 4. **Climate Control Cost**
- **Percent-based**: Percentage of total storage cost
  - Formula: `(selectedBins × selectedMonths × perBinPrice) × (climateAddon.amount / 100) + reDeliveryFee`
  - Example: (10 bins × 3 months × $7.5) × 20% + $5 = $50.00

- **Fixed Amount**: Fixed price
  - Formula: `climateAddon.amount + reDeliveryFee`
  - Example: $30 + $5 = $35.00

### 5. **Add-ons Cost**

#### Fixed Amount Addons (Monthly)
- Formula: `addon.amount × selectedMonths`
- Example: Skis $6/month × 3 months = $18.00

#### Fixed Amount Addons (One-time)
- Formula: `addon.amount`
- Example: Bicycle Rack = $25.00

#### Percent-based Addons (Monthly)
- Formula: `(selectedBins × perBinPrice) × (addon.amount / 100) × selectedMonths`
- Example: (10 bins × $7.5) × 12% × 3 months = $27.00
- **Note**: Percentage is applied to monthly storage cost, then multiplied by months

#### Percent-based Addons (One-time)
- Formula: `baseStorageCost × (addon.amount / 100)`
- Example: $225 × 15% = $33.75

### 6. **Add-ons Delivery Fee**
- Formula: Sum of all selected addons' `reDeliveryFee`
- Example: Skis $5 + Bicycle $10 = $15.00

### 7. **Protection Plan Cost**
- Formula: `protectionPlan.price × selectedMonths`
- Example: Premium Plan $3/month × 3 months = $9.00

### 8. **Savings**
- **Prepaid Plan Savings**: Difference between monthly and prepaid totals
  - Formula: `(monthlyTotal) - (prepaidTotal)`
  - Example: $264 (monthly) - $235 (prepaid) = $29.00 savings

- **Bundle Discount**: Plan discount applied to bundle price
  - Percentage: `bundlePrice × (discount_value / 100)`
  - Fixed: `discount_value`
  - Example: $500 bundle with 10% discount = $50 savings

---

## Calculation Scenarios

### Scenario 1: Regular Prepaid Plan (No Addons, No Climate Control)
```
Base Storage Cost:     $225.00  (from pricing matrix)
Re-delivery Fee:       $10.00   (from pricing matrix)
Delivery Charge:       $638.74  (from locationData)
Climate Control:       $0.00
Add-ons Cost:          $0.00
Add-ons Delivery:      $0.00
Protection Plan:       $0.00
Savings:               $29.00   (prepaid vs monthly)
─────────────────────────────────
TOTAL:                 $873.74  (225 + 10 + 638.74)
```

### Scenario 2: Regular Prepaid Plan with Climate Control
```
Base Storage Cost:     $225.00
Re-delivery Fee:       $10.00
Delivery Charge:       $638.74
Climate Control:       $50.00   (20% of $225 + $5 fee)
Add-ons Cost:          $0.00
Add-ons Delivery:      $0.00
Protection Plan:       $0.00
Savings:               $29.00
─────────────────────────────────
TOTAL:                 $923.74  (225 + 10 + 638.74 + 50)
```

### Scenario 3: Regular Prepaid Plan with Fixed Addons
```
Base Storage Cost:     $225.00
Re-delivery Fee:       $10.00
Delivery Charge:       $638.74
Climate Control:       $0.00
Add-ons Cost:          $18.00   (Skis $6 × 3 months)
Add-ons Delivery:      $5.00    (Skis delivery fee)
Protection Plan:       $9.00    (Premium $3 × 3 months)
Savings:               $29.00
─────────────────────────────────
TOTAL:                 $905.74  (225 + 10 + 638.74 + 18 + 5 + 9)
```

### Scenario 4: Regular Prepaid Plan with Percent-based Addons
```
Base Storage Cost:     $225.00
Re-delivery Fee:       $10.00
Delivery Charge:       $638.74
Climate Control:       $0.00
Add-ons Cost:          $27.00   (Bicycle 12%: (10×$7.5)×12%×3)
Add-ons Delivery:      $10.00   (Bicycle delivery fee)
Protection Plan:       $0.00
Savings:               $29.00
─────────────────────────────────
TOTAL:                 $910.74  (225 + 10 + 638.74 + 27 + 10)
```

### Scenario 5: Regular Prepaid Plan (Full Package)
```
Base Storage Cost:     $225.00
Re-delivery Fee:       $10.00
Delivery Charge:       $638.74
Climate Control:       $50.00   (20% of storage)
Add-ons Cost:          $45.00   (Skis $18 + Bicycle $27)
Add-ons Delivery:      $15.00   (Skis $5 + Bicycle $10)
Protection Plan:       $9.00    (Premium $3 × 3 months)
Savings:               $29.00
─────────────────────────────────
TOTAL:                 $992.74  (225 + 10 + 638.74 + 50 + 45 + 15 + 9)
```

### Scenario 6: Bundle Plan (No Discount)
```
Base Storage Cost:     $500.00  (bundle price)
Re-delivery Fee:       $0.00    (bundles are all-inclusive)
Delivery Charge:       $638.74
Climate Control:       $0.00    (if not included)
Add-ons Cost:          $0.00    (if not included)
Add-ons Delivery:      $0.00
Protection Plan:       $0.00    (if not included)
Savings:               $0.00
─────────────────────────────────
TOTAL:                 $1,138.74 (500 + 638.74)
```

### Scenario 7: Bundle Plan with Plan Discount
```
Bundle Price:          $500.00
Plan Discount (10%):   -$50.00
─────────────────────────────────
Base Storage Cost:     $450.00  (after discount)
Re-delivery Fee:       $0.00
Delivery Charge:       $638.74
Climate Control:       $0.00
Add-ons Cost:          $0.00
Add-ons Delivery:      $0.00
Protection Plan:       $0.00
Savings:               $50.00   (discount amount)
─────────────────────────────────
TOTAL:                 $1,088.74 (450 + 638.74)
```

### Scenario 8: Month-to-Month Plan (No Savings)
```
Base Storage Cost:     $254.00  (from monthly pricing matrix)
Re-delivery Fee:       $10.00
Delivery Charge:       $638.74
Climate Control:       $0.00
Add-ons Cost:          $0.00
Add-ons Delivery:      $0.00
Protection Plan:       $0.00
Savings:               $0.00    (no prepaid discount)
─────────────────────────────────
TOTAL:                 $902.74  (254 + 10 + 638.74)
```

### Scenario 9: India Region (Currency Conversion)
```
Base Storage Cost:     $225.00
Re-delivery Fee:       $10.00
Delivery Charge:       ₹53,015.42 → $638.74  (converted: ÷83)
Climate Control:       $0.00
Add-ons Cost:          $0.00
Add-ons Delivery:      $0.00
Protection Plan:       $0.00
Savings:               $29.00
─────────────────────────────────
TOTAL:                 $873.74
```

### Scenario 10: Matched Zone (Instead of Delivery Charge)
```
Base Storage Cost:     $225.00
Re-delivery Fee:       $10.00
Delivery Zone (Zone A): $50.00  (instead of deliveryCharge)
Climate Control:       $0.00
Add-ons Cost:          $0.00
Add-ons Delivery:      $0.00
Protection Plan:       $0.00
Savings:               $29.00
─────────────────────────────────
TOTAL:                 $285.00  (225 + 10 + 50)
```

---

## Formula Reference

### Total Calculation Formula
```javascript
total = 
  baseStorageCost +
  redeliveryFee +
  climateControlCost +
  addonsCost +
  addonsDeliveryCost +
  protectionPlanCost +
  deliveryCharge (or matchedZone.price)
```

**Note**: Savings is NOT subtracted from total. It's informational only (shows discount amount or prepaid savings).

### Base Storage Cost Calculation

#### Regular Plan
```javascript
if (selectedBins > 0 && selectedMonths && plan) {
  const pricing = plan.pricing[months][bins];
  baseStorageCost = pricing.base;
  redeliveryFee = pricing.deliveryFee;
}
```

#### Bundle Plan
```javascript
if (selectedBundle) {
  let bundlePrice = selectedBundle.price;
  
  // Apply plan discount if exists
  if (plan.hasDiscount) {
    if (plan.discount_type === "percentage") {
      bundlePrice = bundlePrice - (bundlePrice * plan.discount_value / 100);
    } else {
      bundlePrice = bundlePrice - plan.discount_value;
    }
  }
  
  baseStorageCost = bundlePrice;
  redeliveryFee = 0; // Bundles are all-inclusive
}
```

### Climate Control Calculation
```javascript
if (climateControl) {
  const storageCost = selectedBins × selectedMonths × perBinPrice;
  
  if (climateAddon.chargeType === "percent") {
    climateControlCost = storageCost × (climateAddon.amount / 100);
  } else {
    climateControlCost = climateAddon.amount;
  }
  
  climateControlCost += climateAddon.reDeliveryFee;
}
```

### Add-ons Calculation

#### Monthly Recurrence
```javascript
if (addon.recurrence === "monthly" && selectedMonths) {
  if (addon.chargeType === "percent") {
    const monthlyStorageCost = selectedBins × perBinPrice;
    const monthlyAddonCost = monthlyStorageCost × (addon.amount / 100);
    addonsCost += monthlyAddonCost × selectedMonths;
  } else {
    addonsCost += addon.amount × selectedMonths;
  }
  addonsDeliveryCost += addon.reDeliveryFee;
}
```

#### One-time Recurrence
```javascript
if (addon.recurrence === "one_time") {
  if (addon.chargeType === "percent") {
    addonsCost += baseStorageCost × (addon.amount / 100);
  } else {
    addonsCost += addon.amount;
  }
  addonsDeliveryCost += addon.reDeliveryFee;
}
```

### Protection Plan Calculation
```javascript
if (protectionPlan && selectedMonths) {
  protectionPlanCost = protectionPlan.price × selectedMonths;
}
```

### Savings Calculation

#### Prepaid Plan Savings
```javascript
if (isPrepaid && monthToMonthPlan) {
  const monthlyPricing = monthToMonthPlan.pricing[months][bins];
  const monthlyTotal = monthlyPricing.base + monthlyPricing.deliveryFee;
  const prepaidTotal = pricing.base + pricing.deliveryFee;
  savings = monthlyTotal - prepaidTotal;
}
```

#### Bundle Discount Savings
```javascript
if (plan.hasDiscount) {
  if (plan.discount_type === "percentage") {
    savings = bundlePrice × (plan.discount_value / 100);
  } else {
    savings = plan.discount_value;
  }
}
```

### Delivery Charge Calculation
```javascript
if (locationData?.matchedZone) {
  total += locationData.matchedZone.price;
} else if (locationData?.deliveryCharge) {
  const region = locationData.nearestStore?.region?.toLowerCase();
  const charge = locationData.deliveryCharge;
  
  if (region === 'india') {
    total += charge / 83; // Convert INR to USD
  } else {
    total += charge; // Use as-is
  }
}
```

---

## Examples

### Example 1: Simple Prepaid Booking
**Input:**
- Plan: Prepaid Plan
- Duration: 3 months
- Bins: 10
- Location: USA (Zone A)
- No addons, no climate control, no protection plan

**Calculation:**
```
Base Storage:     $225.00  (from pricing[3][10].base)
Re-delivery:      $10.00   (from pricing[3][10].deliveryFee)
Delivery Zone:    $50.00   (matchedZone.price)
─────────────────────────────────
TOTAL:            $285.00
```

### Example 2: Prepaid with Percent-based Addon
**Input:**
- Plan: Prepaid Plan
- Duration: 6 months
- Bins: 10
- Addon: Bicycle (12% monthly)
- Location: USA

**Calculation:**
```
Base Storage:     $450.00  (10 bins × 6 months × $7.5)
Re-delivery:      $10.00
Delivery Charge:  $638.74
Bicycle Addon:    $54.00   ((10 × $7.5) × 12% × 6 months)
Bicycle Delivery: $10.00
─────────────────────────────────
TOTAL:            $1,162.74
```

### Example 3: Bundle with Discount
**Input:**
- Plan: Prepaid Plan (10% discount)
- Bundle: Summer Bundle ($500)
- Location: India

**Calculation:**
```
Bundle Price:     $500.00
Discount (10%):   -$50.00
─────────────────────────────────
Base Storage:     $450.00
Re-delivery:      $0.00    (bundles are all-inclusive)
Delivery Charge:  $638.74  (₹53,015.42 ÷ 83)
─────────────────────────────────
TOTAL:            $1,088.74
Savings Shown:    $50.00   (discount amount)
```

### Example 4: Full Package
**Input:**
- Plan: Prepaid Plan
- Duration: 3 months
- Bins: 10
- Climate Control: Yes (20%)
- Addons: Skis ($6/month), Bicycle (12% monthly)
- Protection Plan: Premium ($3/month)
- Location: USA (Zone A)

**Calculation:**
```
Base Storage:        $225.00
Re-delivery:         $10.00
Delivery Zone:       $50.00
Climate Control:     $50.00   ((10×3×$7.5) × 20% + $5)
Skis Addon:          $18.00   ($6 × 3 months)
Skis Delivery:       $5.00
Bicycle Addon:       $27.00   ((10×$7.5) × 12% × 3)
Bicycle Delivery:    $10.00
Protection Plan:     $9.00    ($3 × 3 months)
─────────────────────────────────
TOTAL:               $404.00
```

---

## Important Notes

1. **Savings Display**: Savings are shown for informational purposes only. They are NOT subtracted from the total amount.

2. **Bundle Pricing**: Bundles are all-inclusive. Re-delivery fees are always $0 for bundles.

3. **Currency Conversion**: India region delivery charges are automatically converted from INR to USD (divide by 83).

4. **Percent-based Addons**: 
   - Monthly: Percentage of monthly storage cost × months
   - One-time: Percentage of total base storage cost

5. **Delivery Charge vs Zone**: 
   - If `matchedZone` exists, use `matchedZone.price`
   - Otherwise, use `deliveryCharge` (with currency conversion if needed)

6. **Prepaid Savings**: Calculated as the difference between month-to-month total and prepaid total for the same duration and bins.

7. **Plan Discounts**: Applied to bundle prices only, not regular plans.

---

## Edge Cases

1. **No Location Data**: Delivery charge defaults to $0
2. **No Selected Bins**: Base storage cost = $0
3. **No Selected Months**: Monthly addons and protection plans = $0
4. **No Pricing Data**: All costs default to $0
5. **Invalid Region**: Delivery charge used as-is (no conversion)

---

## Testing Checklist

- [ ] Regular prepaid plan (no addons)
- [ ] Regular prepaid plan with climate control
- [ ] Regular prepaid plan with fixed addons
- [ ] Regular prepaid plan with percent-based addons
- [ ] Regular prepaid plan with protection plan
- [ ] Bundle plan (no discount)
- [ ] Bundle plan with plan discount
- [ ] Month-to-month plan
- [ ] India region (currency conversion)
- [ ] Matched zone vs delivery charge
- [ ] Full package (all options selected)
- [ ] Prepaid savings calculation
- [ ] Bundle discount calculation

---

**Last Updated**: Based on current implementation in `app/pricing/page.tsx` and `components/booking-steps/SummaryStep.tsx`

