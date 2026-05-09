# Design Document

## Overview

This design addresses the postal code display issue in the DeliveryAddressManagerModal component by ensuring that the postal code field displays the actual postal code value rather than the database ID. The solution involves updating state management, API response handling, and form field display logic.

## Architecture

The fix involves three main areas:
1. **State Management**: Update how postal code data is stored and managed in component state
2. **API Integration**: Ensure postal code API responses include both ID and value
3. **Form Display**: Update the TextField component to display the postal code value

## Components and Interfaces

### DeliveryAddressManagerModal Component

**Current State:**
- `postalCodeId` state stores the postal code ID
- TextField displays `postalCodeId` value
- Form submission uses `postalCodeId` for database operations

**Updated State:**
- `postalCodeId` state continues to store the postal code ID (for database operations)
- `postalCodeValue` state stores the actual postal code value (for display)
- TextField displays `postalCodeValue`
- Form submission continues to use `postalCodeId`

### API Response Structure

The postal code API endpoint should return:
```javascript
{
  id: number,           // postal_code_id for database
  postal_code: string   // actual postal code value for display
}
```

### State Management Updates

```javascript
// Add new state for postal code value
const [postalCodeValue, setPostalCodeValue] = useState("");

// Update handleSubdistrictChange to set both ID and value
const handleSubdistrictChange = (e) => {
  // ... existing logic
  if (subdistrictId) {
    fetch(route("locations.postal-code", { subdistrict_id: subdistrictId }))
      .then((response) => response.json())
      .then((data) => {
        if (data && data.postal_code) {
          setPostalCodeId(data.id);           // Store ID for database
          setPostalCodeValue(data.postal_code); // Store value for display
        }
      });
  }
};
```

## Data Models

### Postal Code Data Structure
```javascript
{
  id: number,           // Database ID
  postal_code: string,  // Display value (e.g., "12345")
  subdistrict_id: number
}
```

### Address Data Structure
```javascript
{
  id: number,
  name: string,
  // ... other fields
  postal_code_id: number,
  postal_code: {
    id: number,
    postal_code: string
  }
}
```

## Error Handling

1. **Missing Postal Code Data**: If postal code data is not available, display empty field with appropriate placeholder
2. **API Errors**: Handle failed postal code API calls gracefully without breaking the form
3. **Invalid Data**: Validate postal code format if needed (typically 5 digits in Indonesia)

## Testing Strategy

### Unit Tests
1. Test postal code value display in form field
2. Test postal code ID storage for database operations
3. Test form submission with correct postal code ID
4. Test edit address functionality with postal code pre-population

### Integration Tests
1. Test postal code API response handling
2. Test subdistrict selection triggering postal code update
3. Test address editing with postal code display

### Manual Testing
1. Create new address and verify postal code displays correctly
2. Edit existing address and verify postal code shows current value
3. Select different subdistricts and verify postal code updates
4. Submit form and verify correct postal code ID is saved

## Implementation Notes

1. **Backward Compatibility**: Maintain existing `postalCodeId` state for database operations
2. **Performance**: No significant performance impact as we're only adding one additional state variable
3. **User Experience**: Users will now see readable postal codes instead of confusing ID numbers
4. **Consistency**: Aligns with how postal codes are displayed in other components like DeliveryAddressDisplay