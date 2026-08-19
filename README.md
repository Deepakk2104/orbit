# Orbit

The AI Workspace for Modern Teams

## 🚀 Live Demo

**LIVE:** `https://orbit-azure-seven-18.vercel.app/`

**Demo Account**

```text
Email: john@doe.com
Password: 12345678
```

---

## ✨ Features

### Authentication

- User registration
- User login
- JWT authentication
- Password hashing
- Logout
- Forgot password flow
- Password reset
- Protected routes
- Centralized authentication state

### Multi-Tenant Organizations

- Create organizations
- Edit organizations
- Delete organizations
- Invite members
- Accept invitations
- Remove members
- Switch organizations
- Organization-level data isolation

### Role-Based Access Control

Orbit currently supports two roles:

**Owner**

- Manage organization
- Invite members
- Remove members
- Delete projects

**Member**

- Access organization projects
- Manage assigned work
- Comment on tasks

All sensitive authorization checks are performed on the backend.

### Project Management

- Create projects
- Edit projects
- Delete projects
- Project details
- Organization-based project access

### Kanban Boards

- Create boards
- Default columns
- Custom columns
- Create tasks
- Edit tasks
- Delete tasks
- Drag and drop tasks
- Persist task positions

### Task Management

Each task supports:

- Title
- Description
- Assignee
- Due date
- Priority
- Status
- Comments

### User Profile

- Update name
- Change password
- Avatar URL
- Profile management

### Dashboard

Orbit includes a responsive SaaS dashboard with:

- Workspace overview
- Project statistics
- Task statistics
- Active/completed task information
- Recent projects
- Recent activity
- Responsive navigation
- Loading states
- Empty states
- Error states

---

## 🏗️ Architecture

Orbit follows a client-server architecture.

```text
                         User
                           │
                           ▼
                    ┌─────────────┐
                    │   Vercel    │
                    │   Next.js   │
                    └──────┬──────┘
                           │
                       HTTPS / REST
                           │
                           ▼
                    ┌─────────────┐
                    │   Render    │
                    │ Express API │
                    └──────┬──────┘
                           │
                        Prisma
                           │
                           ▼
                    ┌─────────────┐
                    │ PostgreSQL  │
                    │   Render    │
                    └─────────────┘
```

### Backend Architecture

The backend follows a layered, modular architecture:

```text
Request
   ↓
Route
   ↓
Controller
   ↓
Service
   ↓
Prisma
   ↓
PostgreSQL
```

Responsibilities are separated so business logic does not become tightly coupled to HTTP handlers.

---

## 🛠️ Tech Stack

### Frontend

- Next.js
- TypeScript
- Tailwind CSS
- shadcn/ui
- TanStack Query
- Zustand
- React Hook Form
- Zod
- DnD Kit
- Axios

### Backend

- Node.js
- Express
- TypeScript
- PostgreSQL
- Prisma ORM
- JWT
- bcrypt
- Nodemailer

### Deployment

- Vercel — Frontend
- Render — Backend
- Render PostgreSQL — Database

### Development

- Git
- GitHub
- ESLint
- Prettier
- Husky
- lint-staged

---

## 📂 Project Structure

```text
orbit/
│
├── client/
│   ├── src/
│   │   ├── app/
│   │   ├── components/
│   │   ├── features/
│   │   ├── hooks/
│   │   ├── lib/
│   │   ├── services/
│   │   ├── store/
│   │   ├── types/
│   │   ├── utils/
│   │   ├── constants/
│   │   └── styles/
│   │
│   └── package.json
│
├── server/
│   ├── src/
│   │   ├── config/
│   │   ├── constants/
│   │   ├── lib/
│   │   ├── middlewares/
│   │   ├── modules/
│   │   ├── types/
│   │   └── utils/
│   │
│   ├── prisma/
│   │   ├── migrations/
│   │   └── schema.prisma
│   │
│   └── package.json
│
├── docs/
│
├── .github/
│
├── PROJECT_MEMORY.md
├── SYSTEM_DESIGN.md
├── TASKS.md
├── CONTRIBUTING.md
└── README.md
```

---

## 🔐 Authentication Flow

Orbit uses JWT-based authentication.

```text
Register
   ↓
Login
   ↓
Credentials validated
   ↓
Password verified
   ↓
JWT issued
   ↓
Authenticated API requests
   ↓
Protected resources
```

Passwords are hashed before being stored.

Protected operations require authentication.

Authorization is performed server-side.

---

## 🏢 Multi-Tenancy

Orbit is designed around organization-based tenancy.

```text
Organization
│
├── Members
│
├── Projects
│
├── Boards
│
├── Tasks
│
└── Comments
```

Users can belong to multiple organizations.

Application resources are scoped to their organization to prevent cross-tenant data access.

Tenant isolation is treated as a backend responsibility rather than relying solely on frontend restrictions.

---

## 🗃️ Database

Orbit uses PostgreSQL with Prisma ORM.

The core domain contains entities representing:

```text
User
Organization
OrganizationMember
Invitation
Project
Board
Column
Task
Comment
```

The relational structure allows organizations to own projects and projects to contain boards, columns, tasks, and collaboration data.

Detailed database documentation is available in:

```text
docs/DATABASE.md
```

---

## 🌐 API

The backend exposes a REST API.

Base URL:

```text
https://orbit-api-zmmf.onrender.com/api
```

### Authentication

```text
POST /auth/register
POST /auth/login
POST /auth/logout
POST /auth/forgot-password
POST /auth/reset-password
GET  /auth/me
```

### Organizations

```text
POST   /organizations
GET    /organizations
GET    /organizations/:organizationId
PATCH  /organizations/:organizationId
DELETE /organizations/:organizationId
```

### Invitations & Members

```text
POST   /organizations/:organizationId/invitations
POST   /invitations/:token/accept
GET    /organizations/:organizationId/members
DELETE /organizations/:organizationId/members/:memberId
```

### Projects

```text
POST   /projects
GET    /projects
GET    /projects/:projectId
PATCH  /projects/:projectId
DELETE /projects/:projectId
```

### Boards & Tasks

```text
POST   /projects/:projectId/boards
GET    /projects/:projectId/boards

POST   /boards/:boardId/tasks
PATCH  /tasks/:taskId
DELETE /tasks/:taskId
```

### Comments

```text
POST   /tasks/:taskId/comments
DELETE /comments/:commentId
```

## ⚙️ Local Development

## Prerequisites

Make sure you have:

- Node.js
- npm
- PostgreSQL
- Git

---

## Clone the repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd orbit
```

---

## Backend Setup

```bash
cd server
npm install
```

Create:

```text
server/.env
```

Configure the environment variables required by the backend.

Example:

```env
DATABASE_URL=
JWT_ACCESS_SECRET=
JWT_REFRESH_SECRET=
ACCESS_TOKEN_EXPIRES_IN=
REFRESH_TOKEN_EXPIRES_IN=
CLIENT_URL=
SMTP_HOST=
SMTP_PORT=
SMTP_PASSWORD=
NODE_ENV=development
PORT=5000
```

Run Prisma migrations:

```bash
npx prisma migrate dev
```

Generate Prisma Client:

```bash
npx prisma generate
```

Start the backend:

```bash
npm run dev
```

---

## Frontend Setup

```bash
cd client
npm install
```

Create:

```text
client/.env.local
```

Configure:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

Start Next.js:

```bash
npm run dev
```

The frontend will be available at:

```text
http://localhost:3000
```

---

## 🧪 Testing

Orbit was tested across the primary MVP workflows:

### Authentication

- Registration
- Login
- Protected routes
- Logout
- Password recovery

### Organizations

- Organization creation
- Member invitations
- Member management
- Role authorization
- Organization switching

### Projects

- Project creation
- Project editing
- Project deletion
- Project access

### Kanban

- Board creation
- Column management
- Task creation
- Task editing
- Task deletion
- Drag and drop
- Position persistence

### Tasks

- Assignment
- Priority
- Due dates
- Descriptions
- Comments

### Profile

- Profile updates
- Password changes
- Avatar URL

---

## 🚀 Production Deployment

Orbit is deployed using:

```text
Frontend
Vercel

Backend
Render

Database
Render PostgreSQL
```

Production flow:

```text
GitHub
   │
   ├──────────────► Vercel
   │                 │
   │                 ▼
   │              Next.js
   │                 │
   │                 │ HTTPS
   │                 ▼
   └──────────────► Render
                     │
                     ▼
                  Express
                     │
                  Prisma
                     │
                     ▼
              PostgreSQL
```

Production secrets are configured through platform environment variables rather than committed to the repository.

---

## 🔒 Security Principles

Orbit follows several security principles:

- Passwords are hashed using bcrypt.
- Authentication is handled using JWT.
- Protected resources require authentication.
- Authorization is enforced on the backend.
- Organization data is tenant-scoped.
- Secrets are stored using environment variables.
- Sensitive user information is excluded from API responses.
- Production CORS is restricted to the frontend origin.
- Database credentials are never committed to Git.

---

## 📌 Engineering Decisions

### Why PostgreSQL?

Orbit contains highly relational data:

```text
Users
 ↓
Organizations
 ↓
Projects
 ↓
Boards
 ↓
Tasks
 ↓
Comments
```

PostgreSQL provides strong relational modeling, constraints, transactions, and reliable production behavior for this domain.

### Why Prisma?

Prisma provides:

- Type-safe database queries
- Schema-based data modeling
- Migration management
- Strong TypeScript integration

### Why Next.js?

Next.js provides a strong foundation for the frontend while allowing the application to scale beyond a simple React SPA.

### Why Express?

Express keeps the API layer lightweight and explicit while allowing Orbit's business logic to remain modular.

### Why Zustand?

Zustand provides lightweight client-side state management for authentication and UI state without introducing unnecessary complexity.

### Why feature-based frontend architecture?

Authentication, projects, tasks, and other domains are isolated into features so each part of the application can evolve without turning the frontend into a collection of unrelated components.

---

## 🎯 MVP Scope

Orbit MVP focuses on the core workflow:

```text
Authentication
      ↓
Organization
      ↓
Members
      ↓
Projects
      ↓
Kanban Board
      ↓
Tasks
      ↓
Comments
      ↓
Profile
```

The objective was to build a **complete, production-ready MVP**, rather than adding a large number of unfinished features.

---

## 🔮 Future Improvements

The following features are intentionally outside the current MVP and can be considered for future versions:

- AI-powered task generation
- AI task breakdown
- AI progress summaries
- Real-time collaboration
- Socket.io notifications
- Redis caching
- Advanced refresh-token/session management
- AWS infrastructure
- Docker-based deployment
- Analytics
- Calendar integration
- Advanced notifications
- Fine-grained permission management
- Dedicated project membership

These should only be introduced after the MVP remains stable in production.

---

## 📈 Current Status

```text
Phase 1 — Project Setup       ✅
Phase 2 — Authentication      ✅
Phase 3 — Organizations       ✅
Phase 4 — Projects            ✅
Phase 5 — Kanban Board        ✅
Phase 6 — Tasks & Comments    ✅
Phase 7 — User Profile        ✅
UI/UX Polish                  ✅
Testing                       ✅
Production Deployment         ✅
```

**Orbit MVP is production deployed. 🚀**

---

## 👨‍💻 Engineering Philosophy

Orbit was built around a few principles:

> Build one feature at a time.

> Keep business logic separate from presentation.

> Prefer readable code over clever code.

> Enforce security on the backend.

> Design for maintainability before adding complexity.

> Finish the MVP before expanding the scope.

---

## 📄 Documentation

Additional project documentation:

- [Project Memory](PROJECT_MEMORY.md)
- [System Design](SYSTEM_DESIGN.md)
- [Development Tasks](TASKS.md)
- [Contribution Guide](CONTRIBUTING.md)

Additional technical documentation:

- `docs/API.md`
- `docs/DATABASE.md`

---

## 📜 License

Add the project's license information here once the repository license is finalized.

---

Built with ❤️ and a lot of engineering.

**Orbit — The AI Workspace for Modern Teams**
