# Implementation Plan

- [ ] 1. Add postal code value state management to DeliveryAddressManagerModal
  - Add `postalCodeValue` state variable to store the display value
  - Initialize `postalCodeValue` state with empty string
  - Add setter function for postal code value updates
  - _Requirements: 1.1, 1.2, 2.1_

- [ ] 2. Update handleSubdistrictChange to set both postal code ID and value
  - Modify the postal code API response handling to extract both id and postal_code
  - Update `setPostalCodeId` to store the database ID
  - Add `setPostalCodeValue` to store the display value
  - Handle cases where postal code data might be missing
  - _Requirements: 1.2, 3.2_

- [ ] 3. Update handleEditAddress to populate postal code value from existing address
  - Extract postal code value from address.postal_code.postal_code when editing
  - Set both postalCodeId and postalCodeValue when pre-filling edit form
  - Handle cases where postal_code relationship might be null
  - _Requirements: 2.1, 2.2_

- [ ] 4. Update postal code TextField to display value instead of ID
  - Change TextField value prop from `postalCodeId` to `postalCodeValue`
  - Update onChange handler to update postalCodeValue state
  - Ensure the field remains disabled as per current design
  - _Requirements: 1.1, 2.2_

- [ ] 5. Update form submission to continue using postal code ID
  - Verify that handleSaveAddress uses `postalCodeId` for database operations
  - Ensure backward compatibility with existing API expectations
  - Fix the variable name error from `postalCode` to `postalCodeId` in addressData
  - _Requirements: 3.3_

- [ ] 6. Add state reset functionality for postal code value
  - Update resetFormData to clear postalCodeValue state
  - Ensure postal code value is reset when modal closes
  - Reset postal code value when province/city/district changes
  - _Requirements: 1.2, 1.3_

- [ ] 7. Test postal code display functionality
  - Create test cases for postal code value display in form
  - Test subdistrict selection updating postal code display
  - Test address editing with postal code pre-population
  - Test form submission with correct postal code ID
  - _Requirements: 1.1, 1.2, 2.1, 2.2_