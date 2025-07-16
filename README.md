# 🧱 Bluebricks Blueprint Manager Service

A production-ready Node.js + NestJS microservice that manages cloud infrastructure Blueprints using PostgreSQL. It demonstrates clean architecture, environment configuration, CI/CD readiness, and Kubernetes deployment support.

---

## 📦 Tech Stack

- **NestJS** (Node.js + TypeScript)
- **PostgreSQL** (data persistence)
- **TypeORM** (ORM)
- **Docker** (containerization)
- **Helm** (Kubernetes deployment)
- **Jenkins** (CI/CD)
- **Prometheus** (metrics endpoint)

---

## 🚀 Features

- Full CRUD for Blueprints
- JSONB-based dynamic schema
- DTO validation with class-validator
- Health checks at `/health`
- Prometheus metrics at `/metrics`
- Config service using `.env`
- Docker and Kubernetes-ready

---

## ⚙️ Environment Setup

### 1. Environment File

Create a `.env` file from template:

```bash
cp .env.template .env
```

Customize environment variables as needed.

---

## 🐘 PostgreSQL Setup

### Option A: Run via Docker (Recommended)

```bash
docker-compose up -d postgres
```

Environment defaults:

- `DATABASE_HOST=localhost`
- `DATABASE_PORT=5432`
- `DATABASE_USER=postgres`
- `DATABASE_PASSWORD=postgres`
- `DATABASE_NAME=bluebricks`

### Option B: Manual Setup

```sql
CREATE DATABASE bluebricks;

CREATE TABLE blueprints (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255),
  version VARCHAR(50),
  author VARCHAR(255),
  blueprint_data JSONB
);
```

> ℹ️ For development, the schema is auto-created via `synchronize: true` in TypeORM.
> In production, use `typeorm migration` instead.

---

## 🧪 Testing

```bash
npm run test
```

---

## 🧱 API

## 🔄 API Endpoints

All routes prefixed with `/blueprints`:

| Method | Path             | Description         |
|--------|------------------|---------------------|
| POST   | `/`              | Create blueprint    |
| GET    | `/`              | List all blueprints |
| GET    | `/:id`           | Get blueprint by ID |
| PUT    | `/:id`           | Update blueprint    |
| DELETE | `/:id`           | Delete blueprint    |

---


## Example
### POST `/blueprints`

```json
{
  "name": "aws_neptune",
  "version": "1.1.0",
  "author": "bluebricks@example.com",
  "blueprint_data": {
    "description": "AWS Neptune Blueprint",
    "manifest_version": 1,
    "packages": [],
    "props": {},
    "outs": {}
  }
}
```

---

## 🐳 Docker Support

### Build & Run Locally

```bash
docker build -t bluebricks/blueprints-service .
docker run -p 3000:3000 --env-file .env bluebricks/blueprints-service
```

---

## 🚀 CI/CD and Kubernetes

### Jenkinsfile

Supports parameterized pipeline:

- `ENV`: Target env (`dev`, `prod`, etc.)
- `IMAGE_TAG`: Docker image tag
- `DB_HOST`, `DB_NAME`: Replaces tokens in `.env.template`

### Jenkins Stages

1. Install dependencies
2. Lint & build code
3. Build Docker image
4. Helm deploy to K8s

### .env.template

```env
PORT=3000
DATABASE_HOST={{DB_HOST}}
DATABASE_PORT=5432
DATABASE_USER=postgres
DATABASE_PASSWORD=postgres
DATABASE_NAME={{DB_NAME}}
NODE_ENV={{ENV}}
```

---

## 🧩 Helm (Kubernetes Deployment)

### Helm Folder Structure

```
helm/
├── Chart.yaml
├── values-dev.yaml
└── templates/
    ├── deployment.yaml
    └── service.yaml
```

### Deploy with Helm

```bash
helm upgrade --install blueprint-service ./helm   -f helm/values-dev.yaml   --set image.tag=latest
```

---

## 📁 File Structure

```
.
├── src/
├── Jenkinsfile
├── Dockerfile
├── .dockerignore
├── .gitignore
├── .env.template
├── helm/
│   ├── Chart.yaml
│   ├── values-dev.yaml
│   └── templates/
│       ├── deployment.yaml
│       └── service.yaml
└── README.md
```

---

## ✅ Future Improvements

- Redis caching layer (optional)
- RBAC / authentication
- API rate limiting

---

## ✍️ Author

Developed by Liav Goldshtein as part of the Bluebricks home assignment.