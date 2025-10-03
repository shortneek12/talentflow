# TalentFlow

TalentFlow is a front-end web application showcasing a production-ready architecture with mock backend support. It demonstrates clean separation of concerns, modern tooling, and fully interactive features — all without requiring a real backend.

🔗 **Live Demo:** [TalentFlow](https://talentflow-basu.vercel.app/)

---

## 🚀 Project Setup

This project was bootstrapped with [Vite](https://vitejs.dev/) for a fast and modern development experience.
The backend is fully simulated in the browser using **MirageJS**, enabling interactive CRUD operations in both local and deployed environments.

### **Prerequisites**

* Node.js **v18+**
* npm **v9+**

### **Installation & Running**

Clone the repository:

```bash
git clone <your-repo-url>
cd talentflow
```

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

The app will be available at: **[http://localhost:5173](http://localhost:5173)**
MirageJS starts automatically, seeding the in-memory database on page load.

---

## 🏗 Architecture

TalentFlow is designed with a **strong separation of concerns**, making it easy to evolve UI, state management, and data layers independently.

### **Core Layers**

#### 🎨 UI / Presentation Layer

* **Component Library**: [Material-UI (MUI)](https://mui.com/)
* **Styling**: MUI `sx` prop with Emotion engine
* **Theme**: Central theme in `src/theme.ts` (colors, typography, gradients, dark/light modes, custom font)

#### 🌐 Routing Layer

* **Library**: [React Router DOM](https://reactrouter.com/)
* **Structure**:

  * Public, animated **Landing Page**
  * `/app` section with layout wrapper (Dashboard, Jobs, Candidates, etc.)

#### 🔄 Server State Management

* **Library**: [TanStack Query (React Query)](https://tanstack.com/query)
* **Responsibilities**:

  * Data fetching, caching, and mutations
  * Hooks (`useQuery`, `useMutation`) for clean component logic

#### 📡 API & Data Layer

* **Library**: [MirageJS](https://miragejs.com/)
* **Features**:

  * Defines database schema, factories, seed data, and endpoints in `src/api/server.ts`
  * Intercepts `/api/...` requests and performs CRUD operations
  * Returns realistic JSON responses with artificial latency

---

## ⚠️ Issues Encountered

### **Issue 1: PostCSS / Tailwind CSS Instability**

* **Problem**: Build errors like `"unknown utility class"` and `@layer base` conflicts.
* **Root Cause**: Fragile PostCSS processing order with Tailwind CSS and shadcn/ui.

### **Issue 2: Blank Screen on Initial Deployment**

* **Problem**: White screen + MIME type error on deep links (e.g., `/app/candidates`).
* **Root Cause**: Missing rewrite/redirect rules for Single Page Applications (SPA).

---

## 🛠 Technical Decisions

### ✅ Migration from Tailwind CSS → Material-UI

* **Reason**: Resolve persistent PostCSS issues
* **Benefit**: Stable development experience with robust, themeable components

### ✅ Migration from MSW + Dexie → MirageJS

* **Reason**: Enable fully interactive demo with self-contained backend simulation
* **Benefit**: Simpler, unified in-memory database for live deployments

### ✅ SPA Redirect / Rewrite Rules

* **Fix**: Added `vercel.json` (for Vercel) / `_redirects` (for Netlify)
* **Rule**:

  ```json
  { "source": "/((?!api).*)", "destination": "/index.html" }
  ```

### ✅ Include Mock Server in Production Build

* **Reason**: Allow a fully interactive demo without external backend
* **Note**: Uncommon in real production apps but ideal for portfolio showcase

---

## 📂 Tech Stack

* **Framework**: React + Vite
* **UI Library**: Material-UI (MUI)
* **Routing**: React Router DOM
* **State Management**: TanStack Query (React Query)
* **Mock API**: MirageJS
* **Deployment**: Vercel

---

## 📸 Demo Preview

![TalentFlow Demo](https://raw.githubusercontent.com/gauravbasu/TalentFlow/main/assets/demo.png) <!-- optional screenshot placeholder -->

---

## 📜 License

This project is for learning and demonstration purposes.

---
