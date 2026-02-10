# 🚀 AI-Resume-Architect – Intelligent Career Intelligence System (RAG Based)

**AI-Resume-Architect** is a context-aware resume engineering platform that transforms static professional data into ATS-optimized documents through semantic analysis and AI-driven insights.  
The system is built using a **Retrieval-Augmented Generation (RAG)** architecture powered exclusively by **Google Gemini AI** for both vector embeddings and high-fidelity content generation, with **MongoDB Atlas Vector Search** as the data backbone.

---

## 🧠 System Architecture Overview

AI-Resume-Architect follows a **multi-layered RAG architecture**:



1. **Document Ingestion**
   - User profile & career history input via Glassmorphism Editor.
   - Real-time text extraction and professional category chunking.

2. **Vectorization**
   - Professional summaries and skills converted to embeddings via **Google Gemini Embedding Models**.
   - Stored in **MongoDB Atlas Vector Index** for semantic comparison.

3. **Retrieval & Analysis**
   - MongoDB Aggregation Pipeline retrieves industry-standard benchmarks based on cosine similarity.
   - Semantic similarity calculated between user data and "Gold Standard" resume chunks.

4. **Generation & Export**
   - ATS-optimized bullet points generated via **Google Gemini Pro**.
   - Pixel-perfect PDF rendering via **Puppeteer Service**.

---

## 📁 Project Structure

```text
AI-RESUME-ARCHITECT/
├── frontend/                 # React.js (Vite) + Tailwind CSS v4
│   ├── .env                  # Frontend Environment Variables
│   ├── src/
│   │   ├── components/       # Editor, Preview, ATS Dashboard
│   │   ├── store/            # Zustand state management
│   │   └── pages/            # Dashboard, Builder, Auth
├── backend/                  # Node.js + Express AI Server
│   ├── .env                  # Backend Environment Variables
│   ├── src/
│   │   ├── controllers/      # Auth, AI, & Resume logic
│   │   ├── models/           # MongoDB schemas
│   │   └── utils/            # RAG, Puppeteer, Vector search
## 🛠️ Tech Stack

* **Backend:** Node.js, Express.js (TypeScript)
* **Frontend:** React 18, Vite, Tailwind CSS v4
* **AI Engine:** Google Gemini AI (1.5 Flash/Pro)
* **Database:** MongoDB Atlas (Vector Search Enabled)
* **PDF Engine:** Puppeteer (Headless Browser)

---

## 📈 Development Roadmap

### ✅ Phase 1: Dual-Source Foundation & Styling

* **Architecture:** Established independent `frontend/` and `backend/` directories.
* **UI Engine:** Integrated **Tailwind CSS v4** with a custom Neon-Glassmorphism design system.
* **Setup:** Configured separate `tsconfig` and environmental logic for decoupled scaling.

### ✅ Phase 2: Core Editor & State Management

* **Components:** Built the `Editor.tsx` and `ExperienceEditor.tsx` for structured data entry.
* **State:** Implemented **Zustand** store with local persistence for complex resume objects.
* **Live Preview:** Created a real-time A4 CSS-grid renderer for instant visual feedback.

### ✅ Phase 3: Gemini AI Integration & RAG Pipeline

* **Embeddings:** Connected **Gemini AI API** to vectorize user skills and summaries.
* **Vector Search:** Developed the **MongoDB Atlas** aggregation pipeline for semantic retrieval.
* **Mock Payment:** Built a realistic "Pro Unlock" flow with checkout modals to simulate premium access.

### 🚧 Phase 4: Persistence & Production Scaling

* **Authentication:** Implementing **JWT & Google OAuth** for secure user sessions.
* **Cloud Storage:** Moving local state to MongoDB for multi-device resume access.
* **PDF Engine:** Finalizing **Puppeteer** server-side rendering for high-resolution exports.
* **Guard Logic:** Enforcing user limits (Free vs. Pro) via backend middleware.

---

## ⚙️ Setup & Environment Variables

### 🖥️ Frontend Setup

1. **Navigate to directory:** `cd frontend`
2. **Install dependencies:** `npm install`
3. **Configure `.env**`:
```env
VITE_API_BASE_URL=http://localhost:5000/api

```


4. **Run Development Server:** `npm run dev`

### ⚙️ Backend Setup

1. **Navigate to directory:** `cd backend`
2. **Install dependencies:** `npm install`
3. **Configure `.env**`:
```env
MONGO_URI=mongodb+srv://your_connection_string
JWT_SECRET=your_super_secret_string
GEMINI_API_KEY=your_google_gemini_api_key
FRONTEND_URL=http://localhost:5173

```


4. **Run AI Server:** `npm run dev`

---

## 🧪 Challenges & Solutions

* **Unified AI Implementation:** Using **Gemini** as a single provider reduced latency and improved context window management for RAG retrieval.
* **State Synchronization:** Solved complex resume state updates by using **Zustand with persistence**, preventing data loss during user flow.
* **PDF Consistency:** Moved rendering to **Puppeteer** on the backend to bypass client-side CSS print limitations in Tailwind v4 and ensure font-perfect exports.

---

## 🏁 Conclusion

The **AI-Resume-Architect** project successfully demonstrates the integration of **Generative AI** and **Vector Databases**. By bridging modern UI design with a robust RAG pipeline, we have created a scalable platform that provides users with a distinct advantage in a competitive, ATS-driven job market.

```

