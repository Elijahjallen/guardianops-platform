# GuardianOps Frontend Architecture

## Purpose

The GuardianOps frontend will be a browser-based React application designed for parents, employees, field staff, operations managers, and administrators.

## Planned Frontend Stack

- React
- TypeScript
- Tailwind CSS
- React Router
- Axios or Fetch API

## Main Pages

### Public Pages
- Login Page
- Parent Intake Form

### Employee Pages
- Dashboard
- Cases List
- Case Detail Page
- Quote Builder
- Expense Tracker
- Staff Scheduling
- Reports Dashboard

### Field Staff Pages
- Assigned Cases
- Field Update Form
- Transport Progress Timeline

### Admin Pages
- User Management
- Role Management
- Audit Logs

## Planned Component Structure

```text
frontend/
├── src/
│   ├── components/
│   ├── pages/
│   ├── layouts/
│   ├── services/
│   ├── hooks/
│   ├── context/
│   ├── types/
│   └── utils/