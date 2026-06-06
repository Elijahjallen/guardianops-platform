# GuardianOps Database Schema Planning

# Core Tables

## users

Stores all system users.

Fields:

* id
* first_name
* last_name
* email
* password_hash
* role_id
* phone_number
* status
* created_at
* updated_at

---

## roles

Defines system permission roles.

Fields:

* id
* role_name
* description

Examples:

* Parent
* Intake Coordinator
* Field Staff
* Operations Manager
* Administrator

---

## cases

Primary transport case records.

Fields:

* id
* case_number
* client_id
* assigned_staff_id
* status
* intake_date
* pickup_location
* destination_location
* estimated_cost
* actual_cost
* created_by
* created_at
* updated_at

---

## clients

Child/client information.

Fields:

* id
* first_name
* last_name
* date_of_birth
* gender
* medical_notes
* behavioral_notes
* emergency_contact
* created_at

---

## parents_guardians

Parent or guardian contact information.

Fields:

* id
* client_id
* first_name
* last_name
* relationship
* phone_number
* email
* address

---

## quotes

Transport quote information.

Fields:

* id
* case_id
* airfare_cost
* hotel_cost
* meals_cost
* transportation_cost
* misc_cost
* estimated_total
* approved
* created_at

---

## expenses

Actual expenses tied to a case.

Fields:

* id
* case_id
* expense_type
* description
* amount
* expense_date
* created_by

---

## field_updates

Real-time transport updates.

Fields:

* id
* case_id
* staff_id
* update_type
* notes
* latitude
* longitude
* created_at

---

## notifications

System notifications.

Fields:

* id
* case_id
* recipient_user_id
* notification_type
* message
* sent_status
* created_at

---

## audit_logs

Security and compliance audit tracking.

Fields:

* id
* user_id
* action_type
* entity_type
* entity_id
* ip_address
* created_at
