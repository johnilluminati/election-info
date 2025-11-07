# Docker Deployment Guide

This project ships with a single Dockerfile at the repository root that builds both the backend API and the frontend React app. The container exposes the API on port `3001` and serves the built React bundle for all non-API routes.

## Prerequisites

1. Docker installed (Desktop or CLI)
2. PostgreSQL database (cloud-hosted or local)
3. Deployment target that can build/run Docker images (Render, Railway, Fly.io, AWS, etc.)

## Environment Variables

Set these in your deployment platform (or when running locally):

- `DATABASE_URL`: PostgreSQL connection string (`postgresql://username:password@host:port/database`)
- `PORT`: Port to listen on (defaults to `3001`; many platforms override this automatically)
- `NODE_ENV`: Use `production` in deployed environments

## Build & Run Locally (optional)

```bash
# from repo root
docker build -t election-info .

# If PostgreSQL is running on your host machine use host.docker.internal
docker run \
  -p 3001:3001 \
  -e DATABASE_URL="postgresql://user:pass@host.docker.internal:5432/dbname" \
  election-info
```

The Dockerfile performs these steps:

1. Installs backend dependencies (`backend/package*.json`)
2. Copies Prisma schema and runs `prisma generate`
3. Copies backend source files
4. Installs frontend dependencies (`election-info/package*.json`)
5. Builds the React app (`npm run build`)
6. Starts the backend server (`node server.js`)

Because the frontend build happens inside the container, you do **not** need to commit the `dist` folder.

## Deploying to Common Platforms

All platforms should point to the repository root so they pick up the root `Dockerfile`.

### AWS Elastic Beanstalk

```bash
eb init
eb create election-info-env
eb setenv DATABASE_URL="..." NODE_ENV=production
eb deploy
```

### Google Cloud Run

```bash
gcloud builds submit --tag gcr.io/PROJECT_ID/election-info
gcloud run deploy --image gcr.io/PROJECT_ID/election-info \
  --set-env-vars DATABASE_URL="...",NODE_ENV=production
```

### Render / Railway / Fly.io / DigitalOcean App Platform

- Connect your repo
- Ensure the root `Dockerfile` is selected
- Set the environment variables in the dashboard

### Heroku (via container registry)

```bash
heroku container:login
heroku create election-info-api
heroku container:push web -a election-info-api
heroku container:release web -a election-info-api
heroku config:set DATABASE_URL="..." NODE_ENV=production
```

## Running Migrations

After the first deploy, run Prisma migrations:

```bash
docker run --rm \
  -e DATABASE_URL="..." \
  election-info \
  npx prisma migrate deploy
```

Most platforms also let you execute shell/CLI commands inside the container for migrations.

> **Note:** Avoid running migrations inside the Dockerfile—they should be executed separately to prevent race conditions in multi-instance deployments.

## Health Check

The backend exposes `GET /health`. Configure your platform’s health check to use that route if it is not detected automatically. The Docker image also includes a `HEALTHCHECK` instruction.

## Troubleshooting Tips

- Use platform logs (or `docker logs`) to debug startup issues.
- When testing locally with a host-running database, use `host.docker.internal` instead of `localhost` in `DATABASE_URL`.
- Ensure the `DATABASE_URL` user has permissions to run migrations and access the schema.
- Confirm the deployed image includes the built frontend by visiting a non-root route directly (e.g., `/elections`).

