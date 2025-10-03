# TalentFlow - A Mini Hiring Platform

TalentFlow is a front-end-only React application designed as a technical assignment. It simulates a real-world hiring platform where an HR team can manage jobs, candidates, and assessments.

**Note:** This application is entirely client-side. It uses Mock Service Worker (MSW) to simulate a REST API and IndexedDB (via Dexie.js) for local data persistence.

## ✨ Features

*   **Jobs Board:** Create, edit, archive, and reorder jobs with drag-and-drop. Features optimistic updates for a smooth UX.
*   **Candidate Management:** View a virtualized list of 1000+ candidates, with client-side search and a Kanban board to move candidates through hiring stages.
*   **Assessment Builder:** A dynamic form builder to create job-specific quizzes with various question types (text, multiple-choice, etc.) and a live preview.
*   **Local Persistence:** All data is stored locally in your browser's IndexedDB, persisting across page refreshes.
*   **Simulated API:** MSW intercepts network requests to provide a realistic API experience, complete with artificial latency and random error rates.
*   **Modern UI:** Built with shadcn/ui, Tailwind CSS, and a custom color scheme with light/dark modes.

## 🚀 Tech Stack

*   **Framework:** React 18 + Vite
*   **Language:** TypeScript
*   **Styling:** Tailwind CSS + shadcn/ui
*   **State Management:**
    *   **Server State:** TanStack Query (React Query) for caching, optimistic updates, etc.
    *   **Client State:** Zustand (for simple global state if needed)
*   **Routing:** React Router DOM
*   **API Mocking:** Mock Service Worker (MSW)
*   **Local Database:** Dexie.js (a wrapper for IndexedDB)
*   **Drag & Drop:** @hello-pangea/dnd
*   **Forms:** React Hook Form + Zod for validation
*   **Virtualized Lists:** React Virtualized

## ⚙️ Setup and Installation

1.  **Clone the repository:**
    ```bash
    git clone <your-repo-url>
    cd talentflow
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Run the development server:**
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:5173`.

## 🏛️ Architecture and Technical Decisions

*   **Vite:** Chosen for its extremely fast development server and optimized build process.
*   **TypeScript:** Provides type safety, which is crucial for a data-intensive application with complex state like this one.
*   **TanStack Query:** The perfect tool for managing "server state." It handles caching, refetching, and makes complex patterns like optimistic updates for the job reordering feature straightforward and declarative.
*   **MSW + Dexie:** This combination is the core of the "no backend" requirement. MSW acts as the network layer, while Dexie provides a robust and easy-to-use interface for IndexedDB, ensuring data persists. This decouples the UI from the data storage, making the code cleaner and more realistic.
*   **shadcn/ui:** A component library that provides unstyled, accessible components. This allows for full control over styling with Tailwind CSS while saving time on building complex components like modals and dialogs from scratch.
*   **`@hello-pangea/dnd`:** A well-maintained and accessible library for drag-and-drop, chosen for its simple API and compatibility with React 18.
*   **React Virtualized:** Essential for performance when rendering the list of 1,000+ candidates. It ensures that only the visible items are rendered to the DOM, preventing the app from slowing down.
