# 🚀 AI-Resume-Architect

### Intelligent Career Intelligence System (RAG Based)

**AI-Resume-Architect** is a context-aware resume engineering platform that transforms static professional data into ATS-optimized documents through semantic analysis and AI-driven insights. The system is built using a **Retrieval-Augmented Generation (RAG)** architecture powered exclusively by **Google Gemini AI** for both vector embeddings and high-fidelity content generation, with **MongoDB Atlas Vector Search** as the data backbone.

---

## 🧠 System Architecture Overview

AI-Resume-Architect follows a multi-layered RAG architecture to ensure data accuracy and prevent AI hallucinations.

### Architecture Flow

* **Document Ingestion**
  User profile and career history are captured via a custom Glassmorphism Editor with real-time text extraction and professional category chunking.

* **Vectorization**
  Professional summaries and skills are converted into high-dimensional embeddings using **Google Gemini Embedding Models**.

* **Vector Storage**
  Embeddings are stored in **MongoDB Atlas Vector Index**, enabling semantic similarity search instead of keyword-based matching.

* **Retrieval & Analysis**
  A MongoDB Aggregation Pipeline retrieves industry-standard resume benchmarks using cosine similarity and computes the semantic gap between user data and "Gold Standard" resume chunks.

* **Generation & Export**
  ATS-optimized bullet points are generated using **Google Gemini Pro**, followed by pixel-perfect PDF rendering via a backend **Puppeteer Service**.

---

## 📁 Project Structure

```text
AI-RESUME-ARCHITECT/
├── frontend/                 # React.js (Vite) + Tailwind CSS v4
│   ├── .env                  # Frontend Environment Variables
│   ├── src/
│   │   ├── components/       # Editor, Preview, ATS Dashboard
│   │   ├── pages/            # Dashboard, Builder, Auth
│   │   ├── services/         # API layer
│   │   ├── store/            # Zustand state management
│   │   ├── types/            # Frontend types
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│
├── backend/                  # Node.js + Express AI Server
│   ├── .env                  # Backend Environment Variables
│   ├── src/
│   │   ├── controllers/      # Auth, AI, Resume, Payment logic
│   │   ├── middleware/       # JWT & plan guards
│   │   ├── models/           # MongoDB schemas
│   │   ├── routes/           # API route definitions
│   │   ├── services/         # RAG, Puppeteer, Gemini services
│   │   ├── types/            # Shared backend types
│   │   ├── utils/            # Resume templates & helpers
│   │   └── server.ts
```

---

## 🛠️ Tech Stack

| Layer      | Technologies                          |
| ---------- | ------------------------------------- |
| Backend    | Node.js, Express.js, TypeScript       |
| Frontend   | React 18, Vite, Tailwind CSS v4       |
| AI Engine  | Google Gemini AI (1.5 Flash / Pro)    |
| Database   | MongoDB Atlas (Vector Search Enabled) |
| PDF Engine | Puppeteer (Headless Chromium)         |

---

## 📈 Development Roadmap

### ✅ Phase 1: Dual-Source Foundation & Styling

* Established independent `frontend/` and `backend/` architectures
* Integrated Tailwind CSS v4 with custom Neon Glassmorphism UI
* Configured isolated TypeScript and environment setups for scalability

### ✅ Phase 2: Core Editor & State Management

* Built structured resume editors (`Editor.tsx`, `ExperienceEditor.tsx`)
* Implemented Zustand store with local persistence
* Developed real-time A4 resume preview using CSS Grid

### ✅ Phase 3: Gemini AI Integration & RAG Pipeline

* Integrated Gemini AI for embeddings and content generation
* Implemented MongoDB Atlas vector-based semantic retrieval
* Built mock payment flow to simulate Free vs Pro access

### 🚧 Phase 4: Persistence & Production Scaling

* JWT-based authentication and Google OAuth
* Cloud persistence via MongoDB for multi-device access
* Finalizing backend Puppeteer PDF rendering
* Middleware-based plan enforcement (Free / Pro)

---

## ⚙️ Setup & Environment Variables

### 🖥️ Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

**Frontend `.env`**

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

### ⚙️ Backend Setup

```bash
cd backend
npm install
npm run dev
```

**Backend `.env`**

```env
MONGO_URI=mongodb+srv://your_connection_string
JWT_SECRET=your_super_secret_string
GEMINI_API_KEY=your_google_gemini_api_key
FRONTEND_URL=http://localhost:5173
```

---

## 🧪 Challenges & Solutions

* **Unified AI Provider**
  Using Gemini as a single AI provider reduced latency and simplified RAG context management.

* **State Synchronization**
  Zustand with persistence ensured consistent resume state across complex editor flows.

* **PDF Consistency**
  Server-side Puppeteer rendering solved Tailwind v4 print inconsistencies and ensured layout-perfect exports.

---

## 🏁 Conclusion

AI-Resume-Architect demonstrates a production-grade integration of **Generative AI**, **Vector Databases**, and **Modern Frontend Engineering**. By combining an ATS-aware RAG pipeline with a premium UI/UX system, the platform delivers a scalable and intelligent solution for career optimization in a competitive job market.
