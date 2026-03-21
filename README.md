# Atlas Platform

Atlas is a full-stack university operations platform with a Next.js frontend, FastAPI backend, PostgreSQL storage, and containerized local development.

## Scope

- Academics: timetable, calendar, curriculum, exams, substitution
- Students: projects, grievances, attendance, internships, course planning
- HR Faculty: recruitment, leave, load balancing, appraisal
- Placement: intelligence, interview prep, resume review, alumni network
- Finance: budget monitor, procurement, fee collection, accreditation
- Admin and governance: users, audit trail, policies, telemetry

## Stack

- Frontend: Next.js + TypeScript
- Backend: FastAPI + Python
- Database: PostgreSQL
- Auth: local auth and optional Keycloak integration
- Runtime: Docker Compose

## Repository Layout

- backend: API, domain services, agent runtime, migrations
- frontend: dashboard UI and workflow components
- docs: detailed setup and reference material
- scripts: utility scripts for local workflows

## Run Locally

1. Copy environment file.
2. Start services.
3. Apply migrations.

```bash
cp .env.example .env
docker compose up -d --build
docker compose exec backend alembic upgrade head
```

If you use Make:

```bash
make up
make migrate-up
```

## Default Endpoints

- Frontend: http://localhost:3000
- Backend API docs: http://localhost:8000/docs
- Keycloak (optional): http://localhost:8080

## Operational Notes

- Agent action contracts are defined in backend/app/services/ai/agents/action_contracts.py.
- Agent output shaping is implemented in backend/app/services/ai/agents/base.py.
- Domain workflow UI components are in frontend/src/components/workflows.
- Route pages are under frontend/src/app/(dashboard).
