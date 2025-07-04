# Backend · NestJS

Backend REST API that stores procurement requests and parses PDF offers with GPT‑powered extraction.

---

## 🌳 Structure

```
backend/
 ├── src/
 │   ├── ai/                 # AIClassifierService (GPT -> commodity groups)
 │   ├── file‑upload/        # /api/upload controller
 │   ├── request/            # DTOs, entity, service, controller
 │   ├── seed/               # seed script + sample PDFs
 │   └── app.module.ts
 ├── Dockerfile
 ├── tsconfig.json
 └── .env.example
```

---

## ⚙ Configuration

| Variable         | Purpose                                                           |
| ---------------- | ----------------------------------------------------------------- |
| `OPENAI_API_KEY` | ChatGPT extraction & commodity classification                     |
| `DATABASE_URL`   | Override SQLite with Postgres (`postgres://user:pw@host:5432/db`) |

### Local SQLite (default)

```bash
cd backend
cp .env.example .env            # put OpenAI key
npm i
npm run start:dev               # http://localhost:3000
```

### Postgres (docker compose)

1. Edit `.env` → `DATABASE_URL=postgres://lio:lio@db:5432/lio`
2. `docker compose up --build` (root folder)

---

## 🗄 Entities

```ts
ProcurementRequest 1 ── * OrderLine
```

Each `OrderLine` auto‑receives `commodityGroupId` & `commodityGroupName`.

---

## 🛠 Scripts

```bash
npm run seed     # parses PDFs in src/seed/samples into DB
```

---

## 🔌 Key Endpoints

| Method | URL                 | Description                   |
| ------ | ------------------- | ----------------------------- |
| POST   | `/api/upload`       | PDF → JSON + commodity groups |
| POST   | `/api/requests`     | Save request                  |
| GET    | `/api/requests`     | List all                      |
| PATCH  | `/api/requests/:id` | Update status                 |

---

## ➡ Next steps

* Switch OpenAI model via ENV (`GPT_MODEL=gpt-4o-mini`)
* Add Swagger (NestJS `@nestjs/swagger`)
* Unit‑test `AIClassifierService` with mocked OpenAI responses
