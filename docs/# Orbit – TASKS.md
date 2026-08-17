# Orbit – TASKS.md

> **Project Status:** 🟡 Planning — Phase 2 (Auth), Phase 3 (Organizations), Phase 4 (Projects) & Phase 5 (Kanban Board) Complete

---
# Phase 1 — Project Setup

## Repository

- [x] Create GitHub Repository
- [x] Initialize Git
- [x] Add `.gitignore`
- [x] Add `README.md`
- [x] Create root project structure

---

## Frontend Setup

- [x] Initialize Next.js
- [x] Configure TypeScript
- [x] Install Tailwind CSS
- [x] Verify development server

---

## Backend Setup

- [x] Initialize Node.js
- [x] Configure Express
- [x] Configure TypeScript
- [x] Verify development server

---

## Project Structure

### Root

- [x] Create `.github/workflows`
- [x] Create `client`
- [x] Create `server`
- [x] Create `docs`

### Frontend

- [x] Create `components`
- [x] Create `features`
- [x] Create `hooks`
- [x] Create `lib`
- [x] Create `services`
- [x] Create `store`
- [x] Create `types`
- [x] Create `utils`
- [x] Create `constants`
- [x] Create `styles`

### Backend

- [x] Create `config`
- [x] Create `modules`
- [x] Create `middlewares`
- [x] Create `lib`
- [x] Create `constants`
- [x] Create `types`
- [x] Create `utils`
- [x] Create `prisma`
- [x] Split `app.ts` and `index.ts`

---

## Database

- [x] Install PostgreSQL
- [x] Initialize Prisma
- [x] Configure Prisma Client
- [x] Configure `schema.prisma`
- [x] Connect Database
- [x] Test Database Connection

---

## Code Quality

### Frontend

- [ ] Configure ESLint
- [ ] Configure Prettier

### Backend

- [ ] Configure ESLint
- [ ] Configure Prettier

### Git Hooks

- [ ] Configure Husky
- [ ] Configure lint-staged

---

## UI Foundation

- [x] Install shadcn/ui
- [x] Configure shadcn/ui

---

## Environment Variables

- [x] Create `client/.env.local`
- [x] Create `server/.env`
- [x] Configure environment variables

---

## Documentation

- [x] Review `PROJECT_MEMORY.md`
- [x] Review `SYSTEM_DESIGN.md`
- [x] Review `TASKS.md`
- [x] Review `CONTRIBUTING.md`

---

# Phase 2 — Authentication

## Backend

* [x] User Registration
* [x] User Login
* [x] JWT Authentication
* [x] Refresh Tokens
* [x] Password Hashing
* [x] Logout

## Frontend

* [x] Login Page
* [x] Register Page
* [x] Forgot Password Page
* [x] Reset Password Page
* [x] Protected Routes
* [x] Authentication State

---

# Phase 3 — Organizations

## Organization

* [x] Create Organization
* [x] Edit Organization
* [x] Delete Organization

## Members

* [x] Invite Members
* [x] Accept Invitation
* [x] Remove Members
* [x] Switch Organization

## Roles

* [x] Owner Role
* [x] Member Role
* [x] Backend Authorization

---

# Phase 4 — Projects

## Project Management

* [x] Create Project
* [x] Edit Project
* [x] Delete Project
* [x] Project Details
* [ ] Assign Members (deferred — project members currently mirror organization members)

---

# Phase 5 — Kanban Board

## Board

* [x] Create Board
* [x] Default Columns
* [x] Custom Columns

## Tasks

* [x] Create Task
* [x] Edit Task
* [x] Delete Task
* [x] Drag & Drop
* [x] Persist Task Position

---

# Phase 6 — Tasks & Comments

## Task Information

* [ ] Title
* [ ] Description
* [ ] Assignee
* [ ] Due Date
* [ ] Priority

## Comments

* [ ] Create Comment
* [ ] Delete Comment

---

# Phase 7 — User Profile

## Profile

* [ ] Update Name
* [ ] Change Password
* [ ] Upload Avatar (Optional)

---

# Phase 8 — Testing, Deployment & Documentation

## Deployment

* [ ] Deploy Frontend (Vercel)
* [ ] Deploy Backend (Railway)
* [ ] Configure PostgreSQL
* [ ] Configure Environment Variables
* [ ] Create Demo Account

## Documentation

* [ ] Complete README
* [ ] API Documentation
* [ ] Database Documentation

## Testing

* [ ] Test Authentication
* [ ] Test Organizations
* [ ] Test Projects
* [ ] Test Kanban
* [ ] Test Task Management
* [ ] Fix Bugs

---

# MVP Completion Checklist

* [ ] Authentication Complete
* [ ] Multi-Tenant Organizations Complete
* [ ] Project Management Complete
* [ ] Kanban Board Complete
* [ ] Task Management Complete
* [ ] Role-Based Access Control Complete
* [ ] User Profile Complete
* [ ] Application Deployed
* [ ] Documentation Complete
* [ ] MVP Released 🎉

---

# Notes

* Build one feature at a time.
* Never skip unfinished tasks.
* Every phase must end in a working state.
* No features outside the MVP scope.
* Keep commits small, descriptive, and focused.
* Update this file after every development session.
