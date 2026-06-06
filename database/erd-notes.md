# GuardianOps ERD Notes

## Purpose

This document explains the initial database relationship design for GuardianOps.

## Core Relationships

### Users and Roles
Each user belongs to one role.

Relationship:
- users.role_id → roles.id

Roles include:
- Parent
- Intake Coordinator
- Field Staff
- Operations Manager
- Administrator

---

### Clients and Parents/Guardians
Each client may have one or more parents or guardians.

Relationship:
- parents_guardians.client_id → clients.id

---

### Clients and Cases
Each case is connected to one client.

Relationship:
- cases.client_id → clients.id

---

### Cases and Users
Cases can be created by an employee and assigned to field staff.

Relationships:
- cases.created_by → users.id
- cases.assigned_staff_id → users.id

---

### Cases and Quotes
Each case can have a quote.

Relationship:
- quotes.case_id → cases.id

---

### Cases and Expenses
Each case can have multiple expenses.

Relationship:
- expenses.case_id → cases.id

---

### Cases and Field Updates
Each case can have multiple field updates.

Relationship:
- field_updates.case_id → cases.id

---

### Cases and Notifications
Each case can generate multiple notifications.

Relationship:
- notifications.case_id → cases.id

## Design Notes

The initial schema is designed to support:
- secure user access
- case lifecycle tracking
- quote generation
- expense tracking
- field staff updates
- parent notifications
- auditability

Future improvements may include:
- document uploads
- payment tracking
- travel itinerary tables
- facility/program records
- multiple assigned staff per case
- encrypted sensitive fields