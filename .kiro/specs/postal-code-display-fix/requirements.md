# Requirements Document

## Introduction

This feature addresses the postal code display issue in the DeliveryAddressManagerModal component. Currently, the postal code field shows the postal code ID instead of the actual postal code value, which creates confusion for users who expect to see the readable postal code (e.g., "12345") rather than a database ID.

## Requirements

### Requirement 1

**User Story:** As a user managing delivery addresses, I want to see the actual postal code value in the form field, so that I can verify the correct postal code is selected.

#### Acceptance Criteria

1. WHEN a user opens the delivery address form THEN the postal code field SHALL display the actual postal code value (e.g., "12345") instead of the postal code ID
2. WHEN a user selects a subdistrict THEN the postal code field SHALL automatically populate with the corresponding postal code value
3. WHEN a user edits an existing address THEN the postal code field SHALL display the current postal code value from the address record

### Requirement 2

**User Story:** As a user editing an existing delivery address, I want the postal code field to show the correct postal code value, so that I can confirm the address details are accurate.

#### Acceptance Criteria

1. WHEN a user clicks edit on an existing address THEN the postal code field SHALL be pre-filled with the actual postal code value from the address record
2. WHEN the form loads existing address data THEN the postal code field SHALL display the postal_code.postal_code value instead of the postal_code_id
3. IF the postal code data is not available THEN the field SHALL display an empty value or placeholder text

### Requirement 3

**User Story:** As a developer maintaining the code, I want consistent postal code handling across components, so that the user experience is uniform throughout the application.

#### Acceptance Criteria

1. WHEN postal codes are displayed in any component THEN they SHALL consistently show the postal_code.postal_code value
2. WHEN postal code data is fetched from the API THEN the response SHALL include both the ID and the postal code value
3. WHEN saving address data THEN the system SHALL continue to store the postal_code_id for database relationships while displaying the postal_code value to users