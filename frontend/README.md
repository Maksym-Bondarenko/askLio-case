# Frontend · React (Vite)

Single‑page UI that lets users upload offers, preview extracted data, fill
in missing details, and track procurement requests.

---

## 🗂 Structure

```
frontend/
 ├── src/
 │   ├── pages/
 │   │   ├── RequestForm.jsx       # intake form + PDF upload
 │   │   └── RequestOverview.jsx   # table, chart, XLSX export, modal
 │   ├── components/RequestModal.jsx
 │   ├── services/requestService.js
 │   └── index.css                 # glass / dark theme
 ├── index.html
 └── vite.config.js
```

---

## 🚀 Quick Start (dev)

```bash
cd frontend
npm i               # install deps
npm run dev         # dev server on http://localhost:5173
```

> **Env**:  create `.env` with `VITE_API_URL="http://localhost:3000/api"` when
> backend runs elsewhere.

Build & preview:

```bash
npm run build && npm run preview
```

---

## ✨ Features

* PDF upload with blur‑spinner while GPT extracts
* Auto‑fills vendor, VAT, department, total + order lines
* Commodity‑group badge per line (from GPT)
* XLSX export, live status filter, request detail modal
* Toast feedback & motion animations

---

## 🛠 Dev Notes

* Uses **Sonner** for toasts, **Lucide React** for icons, **Framer Motion** for
  entrance / spinner animation.
* Styling: glass‑dark theme via CSS variables (no Tailwind).
* All numeric fields are strings in the form state → converted just before
  POST to match DTO.

---

## ➡️ Next Steps

* Add field‑level inline validation errors
* PWA install support for mobile requestors
* Role‑based auth (JWT) to separate requester / procurement views
