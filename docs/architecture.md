# GuardianOps System Architecture

# High-Level Workflow

## 1. Parent Intake Submission

A parent or guardian submits an intake form through the secure web portal.

The system stores:

* Client information
* Parent/guardian information
* Behavioral considerations
* Medical considerations
* Pickup location
* Destination facility
* Required documents

The intake automatically creates a new pending case.

---

## 2. Intake Coordinator Review

An intake coordinator reviews the submitted information.

The coordinator can:

* Validate intake details
* Request missing information
* Generate a transport quote
* Assign field staff
* Schedule transportation

---

## 3. Quote Generation

The system calculates estimated transport costs including:

* Airfare
* Hotels
* Ground transportation
* Staff travel expenses
* Meals/per diem
* Additional operational costs

The quote is stored within the case.

---

## 4. Case Assignment

Field staff are assigned to the case.

Assigned staff receive:

* Case information
* Travel itinerary
* Contact information
* Risk/safety notes
* Transport instructions

---

## 5. Active Transport Monitoring

Field staff provide real-time updates during transport.

Updates may include:

* Pickup completed
* Airport arrival
* Flight departure
* Flight arrival
* Destination arrival
* Incident updates
* Final transfer completed

Updates are visible to:

* Parents/guardians
* Operations staff
* Administrators

---

## 6. Case Completion

After transport completion:

* Final notes are submitted
* Expenses are finalized
* Profitability is calculated
* Case is archived for reporting

---

# Core System Components

## Frontend

React + TypeScript web application.

Primary interfaces:

* Parent Portal
* Employee Dashboard
* Field Staff Mobile Interface
* Administrative Dashboard

---

## Backend API

Python FastAPI backend responsible for:

* Authentication
* Business logic
* Case management
* Notifications
* Expense calculations
* Scheduling
* Reporting

---

## Database

PostgreSQL relational database storing:

* Users
* Cases
* Quotes
* Expenses
* Staff assignments
* Notifications
* Audit logs

---

## Cloud Infrastructure

AWS cloud infrastructure planned for:

* Application hosting
* Database hosting
* Secure storage
* Email/SMS notifications
* Monitoring and logging

---

# Security Requirements

GuardianOps will implement:

* Role-based access control
* Password hashing (bcrypt)
* JWT authentication
* HTTPS encryption
* Audit logging
* Secure API access
* MFA support
* Environment-based secrets management
