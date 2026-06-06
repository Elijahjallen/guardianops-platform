# GuardianOps API Planning

# Authentication Endpoints

## POST /auth/login

Authenticate users and return JWT access token.

## POST /auth/logout

Invalidate active session token.

## POST /auth/register

Create new user account.

---

# User Endpoints

## GET /users

Retrieve all users.

## GET /users/{id}

Retrieve a specific user.

## POST /users

Create new user.

## PUT /users/{id}

Update user information.

---

# Case Endpoints

## GET /cases

Retrieve all cases.

## GET /cases/{id}

Retrieve a specific case.

## POST /cases

Create a new case.

## PUT /cases/{id}

Update case information.

## DELETE /cases/{id}

Archive or delete a case.

---

# Client Endpoints

## GET /clients

Retrieve all clients.

## POST /clients

Create client record.

## PUT /clients/{id}

Update client information.

---

# Quote Endpoints

## GET /quotes

Retrieve quotes.

## POST /quotes

Create transport quote.

## PUT /quotes/{id}

Update quote information.

---

# Expense Endpoints

## GET /expenses

Retrieve expenses.

## POST /expenses

Add expense to case.

## PUT /expenses/{id}

Update expense information.

---

# Field Update Endpoints

## GET /field-updates

Retrieve field updates.

## POST /field-updates

Submit transport progress update.

---

# Notification Endpoints

## GET /notifications

Retrieve notifications.

## POST /notifications

Create/send notification.

---

# Future API Expansion

Planned future integrations:

* Travel booking APIs
* SMS notification APIs
* Email service integrations
* AWS cloud services
* Analytics integrations
