# Orbit – System Design

> **Version:** MVP
> **Status:** Planning

---

# Overview

Orbit is a multi-tenant SaaS project management platform that enables organizations to collaborate through projects, Kanban boards, task management, and team workflows.

The application follows a modern client-server architecture where a Next.js frontend communicates with an Express REST API backed by PostgreSQL through Prisma ORM.

The objective is to build a scalable, maintainable, modular, and production-ready application while keeping the MVP focused.

---

# High Level Architecture

```text
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

Orbit follows a **Modular Layered Architecture**.

```text
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

Each feature is developed as an independent module while maintaining clear architectural layers.

---

# Frontend Architecture

The frontend follows a **feature-first architecture**.

```text
src/

├── app/
├── components/
├── features/
├── hooks/
├── lib/
├── services/
├── store/
├── types/
├── utils/
├── constants/
└── styles/
```

Each feature owns its pages, components, hooks and business logic.

Reusable code remains outside feature folders.

---

# Backend Architecture

The backend follows a **modular feature-based architecture**.

```text
src/

├── config/
├── modules/
├── middlewares/
├── lib/
├── constants/
├── types/
├── utils/
├── app.ts
└── index.ts
```

Every feature lives inside its own module.

Example:

```text
modules/

auth/

├── auth.controller.ts
├── auth.routes.ts
├── auth.service.ts
├── auth.validation.ts
└── auth.types.ts
```

This keeps each feature isolated, maintainable, and easy to scale.

---

# Frontend Responsibilities

The frontend is responsible for:

- Rendering UI
- Authentication state
- Form validation
- API communication
- Client-side routing
- State management
- Drag & Drop interactions

The frontend must never contain business logic related to permissions or database operations.

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
- API responses

All sensitive logic remains on the server.

---

# Database

Orbit uses PostgreSQL as the primary relational database.

Prisma ORM handles database access, migrations, and schema management.

```text
prisma/

├── schema.prisma
├── migrations/
└── seed.ts
```

All database access should go through Prisma.

---

# Authentication Flow

Authentication is based on JWT.

```text
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

Protected endpoints require authentication.

---

# Authorization

Orbit implements Role-Based Access Control (RBAC).

Roles:

- Owner
- Member

Authorization checks are performed on the backend.

---

# Multi-Tenant Design

Every resource belongs to an Organization.

```text
Organization

├── Members

├── Projects

├── Boards

└── Tasks
```

Users may belong to multiple organizations.

Tenant isolation is mandatory.

No organization can access another organization's data.

---

# API Communication

Orbit follows REST principles.

```text
Frontend

↓

REST API

↓

Prisma

↓

PostgreSQL
```

JSON is used for every request and response.

---

# Error Handling

The backend returns consistent responses.

Example:

```json
{
  "success": false,
  "message": "...",
  "error": "..."
}
```

The frontend converts these into user-friendly feedback.

---

# Project Structure Philosophy

Orbit is organized around **features**, not file types.

Frontend features live inside:

```text
features/
```

Backend features live inside:

```text
modules/
```

Every new feature should be added to these directories instead of creating new top-level folders.

---

# Security Principles

- Passwords are hashed.
- JWT protects private endpoints.
- Authorization is enforced server-side.
- Sensitive data is never exposed.
- Environment variables store secrets.
- Input validation occurs before business logic.

---

# Scalability Goals

The architecture should support future additions without major refactoring.

Examples include:

- AI
- Docker
- AWS
- Notifications
- Real-time collaboration
- Analytics

These are intentionally outside the MVP.

---

# Development Principles

- Build one feature at a time.
- Keep modules isolated.
- Keep components reusable.
- Keep business logic inside services.
- Prefer readability over clever code.
- Keep APIs predictable.
- Build production-quality code from the beginning.

---

# Out of Scope

The following are excluded from the MVP:

- AI
- Real-time communication
- Docker production deployment
- AWS infrastructure
- Analytics
- Calendar
- Advanced notifications

These will be considered only after the MVP is complete.

---

# System Goals

Orbit is considered successful if it is:

- Maintainable
- Modular
- Scalable
- Secure
- Easy to understand
- Production-ready
