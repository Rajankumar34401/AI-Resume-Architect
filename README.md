# 🚀 AI-Resume-Architect

**An AI-powered professional resume builder with real-time preview and ATS optimization.**

---
## 📌 Overview

AI-Resume-Architect is a full-stack application designed to help users craft professional resumes with dynamic previews and AI-driven ATS scoring.  
It uses a **decoupled architecture** for scalability and maintainability.

---
## 👥 Team Roles & Contributions

| Member Name | Role | Key Files | Responsibilities |
|--------|------|-----------|------------------|
| **Munish Rajan (Leader)** | Backend & UI/UX Expert | `editor.tsx`, `server.ts`, `aicontroller.ts` | Server setup, Gemini AI API integration, editor layout |
| **Suzzan Naaz** | Data & Logic Manager | `useResumeStore.tsx`, `resume.ts`, `api.ts` | Zustand store, frontend-backend API bridge |
| **Heni Patel** | System Architect & Editor Specialist | `pupiterservice.ts`, `experienceEditor.tsx` | Puppeteer-based PDF export, dynamic input modules |
| **Gagan** | Output & Analysis Expert | `preview.tsx`, `atsscore.tsx` | Resume preview, ATS scoring visualization |

---
## 📁 Project Structure
```text
AI-Resume-Architect/
├── frontend/
│   ├── src/
│   │   ├── assets/              # Static files (images, icons, fonts)
│   │   ├── components/          # Reusable UI components
│   │   ├── services/            # API handlers and external integrations
│   │   ├── store/               # Zustand state management
│   │   ├── types/               # TypeScript type definitions
│   │   ├── App.css              # Global styles
│   │   ├── App.tsx              # Main app component
│   │   ├── index.css            # Tailwind base styles
│   │   ├── main.tsx             # React entry point
│   │   └── types.ts             # Shared types
│   ├── vite.config.ts           # Vite bundler configuration
│   ├── tailwind.config.js       # Tailwind CSS configuration
│   ├── tsconfig.json            # TypeScript config
│   └── package.json             # Frontend dependencies
│
├── backend/
│   ├── controllers/             # Route logic and handlers
│   ├── routes/                  # Express route definitions
│   ├── services/                # Business logic and AI integrations
│   ├── utils/                   # Helper functions and utilities
│   ├── models/                  # Data models (if using DB)
│   ├── middlewares/             # Custom Express middleware
│   ├── server.ts                # Main Express server entry
│   ├── aicontroller.ts          # Gemini AI API logic
│   ├── pupiterservice.ts        # Puppeteer PDF export logic
│   ├── resume.ts                # Resume data handler
│   ├── api.ts                   # API bridge for frontend
│   ├── tsconfig.json            # TypeScript config
│   └── package.json             # Backend dependencies
```
## 📅 Phase 1 & 2: Initial Implementation

- **Full-Stack Foundation**
  - Separate environments for frontend and backend using TypeScript
  - Integrated `tsx` for backend execution without manual builds

- **Modern UI Engine**
  - Tailwind CSS v4 with Glassmorphism and Neon-themed inputs
  - Configured `@tailwindcss/vite` for seamless styling

- **Core Components**
  - `editor.tsx`: Resume Editor for real-time data entry
  - `experienceEditor.tsx`: Experience module for job history
  - `preview.tsx`: A4 resume preview renderer
  - `atsscore.tsx`: ATS scoring dashboard

- **Technical Stability**
  - Resolved TypeScript global conflicts
  - Optimized `tsconfig` for Node.js
  - API testing via Postman

---
## 🛠️ Tech Stack

| Layer      | Technologies |
|------------|--------------|
| **Frontend** | React 18, Vite, Tailwind CSS v4, TypeScript |
| **Backend**  | Node.js, Express, TypeScript, `tsx` |
| **Tools**    | Postman, VS Code, Git |

---
## 🚀 How to Run

### 🖥️ Frontend Setup

```bash
cd frontend
npm install
npm run dev
# 🚀 AI-Resume-Architect

**An AI-powered professional resume builder with real-time preview and ATS optimization.**

### ⚙️ Backend Setup

To run the backend server:

cd backend
npm install
npm run dev
---
```

## Summary
* **Dual-Architecture Setup**: The project is divided into two dedicated `src` directories (Backend and Frontend) for clean code separation and better scalability [cite: 2025-12-29].
* **Modern UI Engine**: Built a premium Glassmorphism-based interface and dashboard using **Tailwind CSS v4** and React [cite: 2025-12-29].
* **Core Components**: Successfully implemented the `editor.tsx` for real-time data entry and the `experienceEditor.tsx` for structured career history [cite: 2025-12-29].
* **Technical Stability**: Fixed TypeScript global configurations and Vite-Tailwind v4 integration bugs to ensure a stable development environment [cite: 2025-12-29].
* **Full-Stack Readiness**: The Node.js/Express server is fully operational with `tsx` integration, ready to handle API requests from frontend components [cite: 2025-12-29].

## Challenges & Solutions (Leadership Insights)
* **Architectural Management**: Coordinating between two separate `src` directories required a modular structure with independent configurations to prevent path conflicts.
* **Styling Integration**: Overcame Tailwind CSS v4 sync issues by manually configuring the Vite plugin and overriding VS Code CSS linting for a stable design system.
* **Type Resolution**: Resolved TypeScript global `node` type conflicts by optimizing `tsconfig.node.json` and explicit type installation.
* **Development Efficiency**: Integrated `tsx` to allow direct TypeScript execution in the backend, significantly reducing the reload time during development.

## ⚠️ Current Limitations (Phase 1 & 2)

* **Local Environment Only**: The dual-source architecture (Backend & Frontend) is currently optimized for local development and lacks a production-ready Docker configuration [cite: 2025-12-29].
* **Static PDF Export**: The resume generation is currently limited to client-side rendering; server-side PDF generation via Puppeteer is still in the integration phase.
* **Manual Data Persistence**: Since the database integration is pending, user data is currently handled via local state and is lost upon page refresh.
* **Limited AI Suggestions**: The AI optimization engine is currently in the testing phase and does not yet support multi-language resume analysis.
* **Single Template Support**: The UI is currently locked to one professional Glassmorphism template; multi-template selection is part of the future roadmap.
---
## 🏁 Conclusion

The successful completion of Phase 1 and 2 has established a robust foundation for the **AI-Resume-Architect**. By implementing a decoupled dual-source architecture [cite: 2025-12-29] and integrating modern styling with Tailwind CSS v4, we have ensured that the application is both scalable and high-performing. 

As a team, we have overcome significant technical hurdles—ranging from TypeScript configuration conflicts to Vite-plugin synchronization—demonstrating strong technical leadership and collaborative problem-solving. This initial phase sets the stage for the upcoming integration of AI-driven content optimization and automated PDF generation, bringing us one step closer to delivering a professional, ATS-ready resume building experience.
---

