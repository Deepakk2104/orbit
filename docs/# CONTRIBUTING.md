# CONTRIBUTING.md

# Orbit – Contribution Guide

> This document defines the engineering standards for Orbit.
>
> Every contributor (human or AI) should read this file before making changes to the project.

---

# Core Principle

Orbit is built as a production-ready software project.

Every decision should prioritize:

* Readability
* Maintainability
* Scalability
* Simplicity

Avoid unnecessary complexity.

---

# Before You Start

Read these documents in order:

1. `PROJECT_MEMORY.md`
2. `SYSTEM_DESIGN.md`
3. `TASKS.md`

These files define the project's scope, architecture, and current progress.

Do not implement features outside the defined MVP.

---

# Git Workflow

Main branches:

```text
main
develop
```

Feature branches:

```text
feature/auth
feature/organizations
feature/projects
feature/kanban
feature/tasks
```

Never work directly on `main`.

---

# Commit Convention

Use descriptive commit messages.

Examples:

```text
feat: implement user registration

feat: create organization module

fix: resolve kanban drag issue

refactor: simplify auth middleware

docs: update system design

style: improve dashboard layout
```

---

# Pull Request Checklist

Before merging:

* Feature works correctly.
* No TypeScript errors.
* No ESLint errors.
* Project builds successfully.
* Documentation is updated if necessary.

---

# Coding Standards

* Use TypeScript everywhere.
* Prefer simple, readable code.
* Keep functions focused on one responsibility.
* Avoid duplicate code.
* Use meaningful variable and function names.
* Write reusable components where appropriate.

---

# Folder Rules

Every file should have a clear purpose.

Avoid placing unrelated logic in the same module.

Keep frontend and backend responsibilities separate.

---

# Documentation Rules

Whenever a significant change is made:

* Update `TASKS.md`
* Update `PROJECT_MEMORY.md` if the MVP scope changes.
* Update `SYSTEM_DESIGN.md` if the architecture changes.
* Update any relevant documentation.

Documentation is part of the project—not an afterthought.

---

# MVP Discipline

Do not implement features outside the MVP unless they have been explicitly approved.

Examples of features that should **not** be added during MVP:

* AI features
* Real-time collaboration
* Docker production setup
* AWS infrastructure
* Analytics
* Calendar
* Notifications

The objective is to finish the MVP before expanding the scope.

---

# Definition of Done

A task is considered complete only if:

* Functionality works as expected.
* Code follows project standards.
* Errors are handled.
* The UI is responsive (where applicable).
* Documentation is updated.
* The task is checked off in `TASKS.md`.

---

# Engineering Principles

* Build one feature at a time.
* Keep commits small and focused.
* Prefer composition over duplication.
* Optimize for maintainability.
* Keep the codebase consistent.
* Solve the root problem instead of adding workarounds.

---

# AI Contributor Guidelines

If an AI agent contributes to this project, it should:

1. Read `PROJECT_MEMORY.md`.
2. Read `SYSTEM_DESIGN.md`.
3. Read `TASKS.md`.
4. Follow this document.
5. Stay within the MVP scope.
6. Explain architectural decisions before making major structural changes.
7. Avoid introducing unnecessary dependencies or complexity.

The goal is to keep Orbit consistent regardless of who (or what) contributes.

---

# Mission

Every contribution should move Orbit closer to a production-ready MVP.

Quality is more important than speed.

Consistency is more important than cleverness.
