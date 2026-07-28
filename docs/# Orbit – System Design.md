# Orbit – System Design

> Version: MVP
> Status: Planning

---

# Overview

Orbit is a multi-tenant SaaS project management platform that allows organizations to create projects, collaborate through Kanban boards, assign tasks, and manage team workflows.

The system follows a client-server architecture where the frontend communicates with a REST API, which interacts with a PostgreSQL database.

The primary goal is to build a scalable, maintainable, and production-ready application while keeping the MVP focused.

---

# High Level Architecture

```
                User
                  │
                  ▼
          Next.js Frontend
                  │
         HTTPS (REST API)
                  │
                  ▼
      Express Backend (Node.js)
                  │
                  ▼
        Prisma ORM
                  │
                  ▼
         PostgreSQL Database
```

---

# Architecture Style

Orbit follows a layered architecture.

```
Presentation Layer

↓

API Layer

↓

Business Logic Layer

↓

Data Access Layer

↓

Database
```

Each layer has a single responsibility.

---

# Frontend Responsibilities

The frontend is responsible for:

- Rendering UI
- Authentication state
- Form validation
- API communication
- Route protection
- State management
- Drag & Drop interactions

The frontend should never contain business logic related to permissions or database operations.

---

# Backend Responsibilities

The backend is responsible for:

- Authentication
- Authorization
- Business logic
- Validation
- Database operations
- Permission checks
- Error handling

All sensitive operations happen on the backend.

---

# Database

The application uses PostgreSQL as the primary database.

Database design follows relational principles.

Relationships are handled through Prisma ORM.

The complete schema will be documented separately in `DATABASE_SCHEMA.md`.

---

# Authentication Flow

The application uses JWT-based authentication.

General flow:

```
Register

↓

Login

↓

JWT Issued

↓

Authenticated Requests

↓

Logout
```

Protected routes require authentication before access is granted.

---

# Authorization

Orbit uses Role-Based Access Control (RBAC).

Initial MVP Roles:

- Owner
- Member

Permissions are enforced on the backend.

---

# Multi-Tenant Design

Every resource belongs to an Organization.

```
Organization

├── Members

├── Projects

├── Boards

└── Tasks
```

Users may belong to multiple organizations.

No data should ever leak between organizations.

Tenant isolation is mandatory.

---

# API Communication

Communication follows REST principles.

```
Frontend

↓

REST API

↓

Database
```

JSON is used for all request and response bodies.

---

# Error Handling

The backend returns consistent error responses.

Example:

```
{
  success: false,
  message: "...",
  error: "..."
}
```

The frontend displays user-friendly messages.

---

# Security Principles

- Passwords are hashed.
- Protected routes require authentication.
- Permissions are checked server-side.
- Sensitive data is never exposed.
- Environment variables store secrets.

---

# Scalability Goals

The project should be structured so additional features can be added without major refactoring.

Examples:

- Notifications
- AI
- Docker
- AWS
- Socket.io

These are intentionally outside the MVP scope but should fit naturally into the architecture.

---

# Development Principles

- Keep components reusable.
- Keep business logic separated from routes.
- Keep APIs predictable.
- Keep folder structure modular.
- Prefer readability over clever code.
- Build production-quality code from the start.

---

# Out of Scope

The following are intentionally excluded from the MVP:

- AI
- Real-time communication
- AWS infrastructure
- Docker production deployment
- Analytics
- Calendar
- Advanced notifications

These will only be considered after the MVP is complete.

---

# System Goals

The system is considered successful if it is:

- Maintainable
- Scalable
- Secure
- Modular
- Easy to understand
- Production-ready