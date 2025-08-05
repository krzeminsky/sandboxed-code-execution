# Sandboxed Code Execution

Powered by **Docker**, **Node.js**, **SvelteKit**, **Tailwind**, and
**Drizzle**.

---

## Overview

- Currently, development is handled on the **host machine**; production builds
  are deployed inside a **Docker container**.
- **No advanced security measures** are implemented (only basic memory limits
  and endpoint validation).
- The **frontend is not responsive** and was built quickly for demonstration
  purposes.
- On startup, the server **auto-inserts example problems** if the database is
  empty.
- The app currently supports **only** python sandboxing.

---

## Prerequisites

Make sure you have the following installed:

- **Docker** — required for both development and deployment.
- **Node.js** — required for local development.

### Environment Variables

Create two environment files:

- `.env` — for local development
- `.env.prod` — for the production container

Required variables:

```env
# Example:
# For local development: localhost:5431
# For deployment: db:5432
DATABASE_URL=postgresql://postgres:123@<host>:<port>/example_db

# Container params for running user code
CONTAINER_TIMEOUT=<ms>
CONTAINER_MEMORY_LIMIT=<memory_limit>
CONTAINER_NAME=<docker_image_name>

SANDBOX_NETWORK_NAME=<docker_network_name>

RESULT_TIMEOUT=<ms>

# URL used by sandbox containers to send results to the web server
# Example:
# For local development: host.docker.internal:3000
# For deployment: web:3000
API_URL=http://<host>:<port>/api/result

JWT_SECRET=<secret>

PORT=<number>
HOST=<host>

# In this directory, files required to sandbox user code will be stored.
TMP_PATH=<absolute_path_to_temp_folder>
```

> **Note:** A future update will dockerize the testing environment, eliminating
> the need for a separate `.env.prod` file.

---

## Getting Started

### 1. Create a Docker Sandbox Network

Create a network to enable container-to-server communication:

```bash
docker network create --internal <network_name>
```

- In **development**, omit the `--internal` flag to allow containers to talk to
  the host machine.
- In **production**, it’s recommended to **keep `--internal`** for security.

---

### 2. Build the Sandbox Image

Build the image that will be used to safely run user code:

```bash
cd sandbox_unit
docker build -t <your_image_name> ./
cd ..
```

---

### 3. Run the App

#### Development

```bash
npm install
npm run dev
```

#### Deployment

```bash
docker compose build
docker compose up
```
