# 🚀 AI-Resume-Architect
**Intelligent Document Intelligence & Career Engineering Platform**

AI-Resume-Architect is a full-stack, context-aware resume engineering platform. It leverages **Retrieval-Augmented Generation (RAG)** to transform static professional data into ATS-optimized documents. By utilizing **Google Gemini AI** for both semantic embeddings and high-fidelity generation, the system ensures that every resume is grounded in industry-standard professional benchmarks.

---

## 🧠 System Architecture & RAG Pipeline

The platform operates on a multi-layered RAG architecture to ensure data accuracy and prevent AI hallucinations.



1.  **Ingestion & Chunking**: User career history is captured via a dynamic editor and partitioned into logical professional modules (Experience, Education, Skills).
2.  **Vectorization**: Content is converted into high-dimensional vectors using **Google Gemini Embedding Models**.
3.  **Vector Storage**: Embeddings are stored in **MongoDB Atlas Vector Search**, enabling semantic similarity lookups rather than simple keyword matching.
4.  **Contextual Retrieval**: During analysis, the system retrieves the most relevant industry benchmarks (Top-K similarity) from the vector store.
5.  **Grounded Generation**: **Gemini Pro** processes the user's data alongside retrieved benchmarks to generate quantified, high-impact bullet points and an **ATS Score**.

---

## 📁 Project Structure

```text
AI-RESUME-ARCHITECT/
├── frontend/                 # React 18 + Vite (Tailwind CSS v4)
│   ├── .env                  # API Base URL & OAuth Config
│   ├── src/
│   │   ├── components/       # Neon-Glassmorphism UI Library
│   │   ├── store/            # Zustand State Management (Persistence)
│   │   └── pages/            # Dashboard, Resume Builder, Auth
├── backend/                  # Node.js + Express (TypeScript)
│   ├── .env                  # AI Keys, Database URI, JWT Secret
│   ├── src/
│   │   ├── controllers/      # RAG Logic, Auth, & Resume CRUD
│   │   ├── services/         # Puppeteer PDF & Gemini API Wrappers
│   │   └── utils/            # MongoDB Vector Aggregation Pipelines

---

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

