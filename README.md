# 🚀 AI-Resume-Architect

**An AI-powered professional resume builder with real-time preview and ATS optimization.**

---

## 📌 Overview

AI-Resume-Architect is a full-stack application designed to help users craft professional resumes with dynamic previews and AI-driven ATS scoring.  
It uses a **decoupled architecture** for scalability and maintainability.

---

## 📂 Project Structure

| Layer      | Description                                                                 |
|------------|-----------------------------------------------------------------------------|
| **Frontend** | React 18 + Tailwind CSS v4 for a modern, responsive UI                    |
| **Backend**  | Node.js + Express with TypeScript for logic, PDF generation, and AI APIs  |

---

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

## 👥 Team Roles & Contributions

| Member | Role | Key Files | Responsibilities |
|--------|------|-----------|------------------|
| **1** | Backend & UI/UX Expert | `editor.tsx`, `server.ts`, `aicontroller.ts` | Server setup, Gemini AI API integration, editor layout |
| **2** | Data & Logic Manager | `useResumeStore.tsx`, `resume.ts`, `api.ts` | Zustand store, frontend-backend API bridge |
| **3** | System Architect & Editor Specialist | `pupiterservice.ts`, `experienceEditor.tsx` | Puppeteer-based PDF export, dynamic input modules |
| **4** | Output & Analysis Expert | `preview.tsx`, `atsscore.tsx` | Resume preview, ATS scoring visualization |

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

---

## 📌 Overview

AI-Resume-Architect is a full-stack application designed to help users craft professional resumes with dynamic previews and AI-driven ATS scoring.  
It uses a **decoupled architecture** for scalability and maintainability.

---

## 📂 Project Structure

| Layer      | Description                                                                 |
|------------|-----------------------------------------------------------------------------|
| **Frontend** | React 18 + Tailwind CSS v4 for a modern, responsive UI                    |
| **Backend**  | Node.js + Express with TypeScript for logic, PDF generation, and AI APIs  |

---

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

## 👥 Team Roles & Contributions

| Member | Role | Key Files | Responsibilities |
|--------|------|-----------|------------------|
| **1** | Backend & UI/UX Expert | `editor.tsx`, `server.ts`, `aicontroller.ts` | Server setup, Gemini AI API integration, editor layout |
| **2** | Data & Logic Manager | `useResumeStore.tsx`, `resume.ts`, `api.ts` | Zustand store, frontend-backend API bridge |
| **3** | System Architect & Editor Specialist | `pupiterservice.ts`, `experienceEditor.tsx` | Puppeteer-based PDF export, dynamic input modules |
| **4** | Output & Analysis Expert | `preview.tsx`, `atsscore.tsx` | Resume preview, ATS scoring visualization |

---

## 🛠️ Tech Stack

| Layer      | Technologies |
|------------|--------------|
| **Frontend** | React 18, Vite, Tailwind CSS v4, TypeScript |
| **Backend**  | Node.js, Express, TypeScript, `tsx` |
| **Tools**    | VS Code, Git |

---

## 🚀 How to Run

### 🖥️ Frontend Setup

```bash
cd frontend
npm install
npm run dev

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
