# Orbit – Project Memory (MVP)

> **Project Name:** Orbit
> **Tagline:** The AI Workspace for Modern Teams

---

# Purpose

Orbit is a production-ready SaaS project management platform where teams can create organizations, manage projects, collaborate on Kanban boards, assign tasks, and track work efficiently.

The objective is **not** to build the biggest project possible.

The objective is to build a **clean, scalable, interview-ready full-stack application** that demonstrates strong software engineering fundamentals.

---

# MVP Goal

The MVP is considered complete when a user can:

1. Sign up and log in.
2. Create an organization.
3. Invite members.
4. Create projects.
5. Manage tasks on a Kanban board.
6. Assign tasks to members.
7. Comment on tasks.
8. Deploy the application publicly.

If these eight goals are achieved, the MVP is finished.

No unnecessary features before this point.

---

# Tech Stack

## Frontend

* Next.js
* TypeScript
* Tailwind CSS
* shadcn/ui
* TanStack Query
* Zustand
* React Hook Form
* Zod
* DnD Kit

## Backend

* Node.js
* Express
* TypeScript
* PostgreSQL
* Prisma ORM
* JWT Authentication
* Nodemailer

## Deployment

* Vercel
* Railway (Backend + Database)

---

# MVP Features

## Authentication

* Register
* Login
* JWT Authentication
* Refresh Tokens
* Logout

---

## Organizations

* Create Organization
* Invite Members
* Join Organization
* Switch Organizations

---

## Projects

* Create Project
* Edit Project
* Delete Project
* Assign Members

---

## Kanban Board

* Default Columns

  * To Do
  * In Progress
  * Done
* Create Tasks
* Edit Tasks
* Delete Tasks
* Drag & Drop

---

## Task Details

* Title
* Description
* Assignee
* Due Date
* Priority
* Comments

---

## Roles

### Owner

* Manage Organization
* Invite Members
* Remove Members
* Delete Projects

### Member

* View Projects
* Manage Assigned Tasks
* Comment

---

## User Profile

* Update Profile
* Change Password
* Upload Avatar (optional)

---

# Route Structure

## Public Routes

```text
/

/login

/register

/forgot-password

/reset-password
```

---

## Protected Routes

```text
/dashboard

/dashboard/organizations

/dashboard/projects

/dashboard/projects/:projectId

/dashboard/projects/:projectId/board

/dashboard/projects/:projectId/tasks/:taskId

/dashboard/settings

/dashboard/profile
```

---

# Backend Modules

```text
Auth

Users

Organizations

Invitations

Projects

Boards

Columns

Tasks

Comments
```

---

# Database (High Level)

```text
User

Organization

OrganizationMember

Project

ProjectMember

Board

Column

Task

Comment

Invitation
```

---

# Development Order

### Phase 1

* Project Setup
* Monorepo
* Database
* Prisma

### Phase 2

* Authentication
* Authorization
* User Profile

### Phase 3

* Organizations
* Invitations
* Member Management

### Phase 4

* Projects

### Phase 5

* Kanban Board

### Phase 6

* Tasks
* Comments

### Phase 7

* Testing
* Deployment
* Documentation

---

# Project Rules

1. Build one feature at a time.
2. Never skip planning.
3. Understand every line of code.
4. Keep commits small and meaningful.
5. Do not add features outside the MVP scope.
6. Prioritize clean architecture over clever code.
7. Every feature should be production-ready before moving to the next.

---

# Definition of Done

Orbit MVP is complete when:

* Authentication works.
* Multi-tenancy works.
* Projects work.
* Kanban works.
* Tasks work.
* RBAC works.
* The application is deployed.
* The README and documentation are complete.

**Only after every item above is complete is the MVP considered finished.**
