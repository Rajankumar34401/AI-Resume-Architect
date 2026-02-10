# 🚀 AI-Resume-Architect – Intelligent Career Intelligence System (RAG Based)

**AI-Resume-Architect** is a context-aware resume engineering platform that transforms static professional data into ATS-optimized documents through semantic analysis and AI-driven insights.  
The system is built using a **Retrieval-Augmented Generation (RAG)** architecture powered exclusively by **Google Gemini AI** for both vector embeddings and high-fidelity content generation, with **MongoDB Atlas Vector Search** as the data backbone.

---

## 👥 Team Members & Roles

| Name                     | Role                                   | Responsibilities |
|--------------------------|----------------------------------------|------------------|
| **Munish Rajan (Leader)** | **Lead Integrator & System Architect** | System Architecture, Master Admin Logic, MongoDB Vector Aggregation, Context Window Logic, SSE Streaming, Gemini AI Integration. |
| **Suzzan Naaz** | **Auth & Conversational UI Developer** | Secure JWT & OAuth, Persistent Resume Storage, Real-Time AI Suggestion UI, Source Grounding Interface, Session Management. |
| **Heni Patel** | **System Architect & Editor Specialist**| Puppeteer-based PDF Export, Dynamic Experience Editor Modules, Frontend State Management. |
| **Gagan** | **Database & Analysis Expert** | MongoDB Atlas Vector Indexing, Schema Design, ATS Scoring Logic, Cloud Storage Management. |

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

## 📈 Development Roadmap (The 4 Phases)

### ✅ Phase 1: Dual-Source Foundation & Styling
- **Architecture:** Established independent `frontend/` and `backend/` directories.
- **UI Engine:** Integrated **Tailwind CSS v4** with a custom Neon-Glassmorphism design system.
- **Tech Setup:** Configured `tsx` for backend execution and Vite for frontend bundling.

### ✅ Phase 2: Core Editor & State Management
- **Components:** Built the `Editor.tsx` and `ExperienceEditor.tsx` for structured data entry.
- **State:** Implemented **Zustand** store with local persistence to handle complex resume objects.
- **Preview:** Created a real-time A4 CSS-grid renderer for live feedback.

### ✅ Phase 3: Gemini AI Integration & RAG Pipeline
- **Embeddings:** Connected **Gemini AI API** to vectorize user skills and summaries.
- **Inference:** Integrated **Gemini Pro** for context-aware AI suggestions and ATS critiques.
- **Vector Search:** Developed the **MongoDB Atlas** aggregation pipeline for semantic retrieval.
- **Mock Payment:** Built the "Pro Unlock" flow to simulate premium feature access.

### 🚧 Phase 4: Persistence & Production Scaling
- **Authentication:** Implementing **JWT & Google OAuth** for secure user sessions.
- **Cloud Storage:** Moving local state to MongoDB for multi-device resume access.
- **PDF Engine:** Finalizing **Puppeteer** server-side rendering for high-resolution exports.

---

## 🛠️ Tech Stack
* **Backend:** Node.js, Express.js (TypeScript)
* **Frontend:** React 18, Vite, Tailwind CSS v4
* **AI Engine:** Google Gemini AI (1.5 Flash/Pro)
* **Database:** MongoDB Atlas (Vector Search Enabled)
* **PDF Engine:** Puppeteer (Headless Browser)

---

## 🧪 Challenges & Solutions (Leadership Insights)

- **Unified AI Implementation:** Using a single provider (**Gemini**) reduced API complexity and token overhead. We successfully utilized Gemini's large context window to pass more retrieved benchmarks from MongoDB, leading to more accurate resume tailoring.
  
- **State Management & Synchronization:**
  Handling complex resume state across multiple tabs was solved by implementing a **Zustand store with persistence middleware**, ensuring no data loss during refresh.

- **PDF Consistency:** Browser-based printing often broke Tailwind CSS v4 layouts. We moved PDF generation to the **Backend (Puppeteer)** to ensure every user receives an identical, high-quality document.

---

## 🏁 Conclusion

The **AI-Resume-Architect** project successfully demonstrates the integration of **Generative AI** and **Vector Databases**. Our team built a robust, scalable pipeline that provides users with a distinct advantage in a competitive, ATS-driven job market.