# askLio Procurement Demo

A full‑stack proof‑of‑concept that lets employees submit procurement requests with automatic vendor‑offer extraction powered by **OpenAI GPT**.

**Stack**

| Layer    | Tech                                                                 |
| -------- | -------------------------------------------------------------------- |
| Frontend | React (vite) + Framer Motion, Sonner toasts, Lucide icons            |
| Backend  | NestJS 10 · TypeORM · OpenAI SDK                                     |
| DB       | SQLite (default, WAL) — or Postgres via `docker‑compose`             |
| AI       | GPT‑4o‑mini / GPT‑3.5‑turbo for PDF → JSON & commodity‑group tagging |

---

## 1  Features

* **Intake form** with dynamic order‑lines
* **Upload PDF** → GPT parses vendor, VAT, department, grand total & items
* **AI commodity‑group** auto‑classification per line
* **Validation** (`class‑validator`) + global DTO pipe
* **Request overview** table

  * live status filter, inline status dropdown (Open / In Progress / Closed)
  * XLSX export (SheetJS)
  * detail modal with all line‑items
* Toast notifications & loading spinner for long GPT calls
* Dockerised one‑liner ⇒ `docker compose up --build`
* Seed script to import 4 example offers on first run

---

## 2  Local dev (SQLite)

```bash
git clone https://github.com/Maksym-Bondarenko/askLio-case
cd askLio-case

# backend
cd backend && cp .env.example .env   # add your OPENAI_API_KEY
npm i && npm run start:dev

# frontend (new tab)
cd ../frontend
npm i && npm run dev
```

Visit **[http://localhost:5173](http://localhost:5173)**

---

## 3  Docker

```bash
# root dir (.env must contain OPENAI_API_KEY)
docker compose --env-file .env up --build
```

* Frontend → [http://localhost:5173](http://localhost:5173)
* Backend → [http://localhost:3000](http://localhost:3000)

Run seed inside container (optional):

```bash
docker exec -it asklio-case-backend-1 npm run seed
```

---

## 4  Project layout (simplified)

```
asklio-case/
├─ backend/
│  ├─ src/
│  │  ├─ ai/ai-classifier.service.ts
│  │  ├─ file-upload/
│  │  ├─ request/
│  │  └─ seed/
│  ├─ Dockerfile
│  └─ .env.example
├─ frontend/
│  ├─ src/
│  │  ├─ pages/SubmitRequest.jsx
│  │  ├─ pages/RequestOverview.jsx
│  │  └─ services/requestService.js
│  ├─ Dockerfile
│  └─ vite.config.js
├─ docker-compose.yml
└─ README.md (you are here)
```

---

## 5  Next steps

* Switch GPT prompt/model dynamically by file size
* Add user‑auth (JWT)
* Replace simple CSS with Tailwind /shadcn UI kit
* Integrate OSS PDF‑table extractor for offline mode (no GPT)
* CI workflow → build & push Docker images

---

## 6 Screenshots

![image](https://github.com/user-attachments/assets/015dff5a-624b-4edb-8aa6-98142b36db3c)
