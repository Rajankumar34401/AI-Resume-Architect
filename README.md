# 🚀 AI-Resume-Architect
### Intelligent Career Intelligence System (RAG Based)

**AI-Resume-Architect** is a context-aware resume engineering platform that transforms static professional data into ATS-optimized documents through semantic analysis and AI-driven insights. The system is built using a **Retrieval-Augmented Generation (RAG)** architecture powered exclusively by **Google Gemini AI** for both vector embeddings and high-fidelity content generation, with **MongoDB Atlas Vector Search** as the data backbone.

---

## 🧠 System Architecture Overview

AI-Resume-Architect follows a multi-layered RAG architecture to ensure data accuracy and prevent AI hallucinations.



* **Document Ingestion**: User profile and career history input via a custom Glassmorphism Editor with real-time text extraction and professional category chunking.
* **Vectorization**: Professional summaries and skills are converted into high-dimensional embeddings via **Google Gemini Embedding Models**.
* **Vector Storage**: Data is stored in a **MongoDB Atlas Vector Index** to enable semantic similarity comparisons rather than simple keyword matching.
* **Retrieval & Analysis**: A MongoDB Aggregation Pipeline retrieves industry-standard benchmarks based on cosine similarity, calculating the semantic gap between user data and "Gold Standard" resume chunks.
* **Generation & Export**: ATS-optimized bullet points are generated via **Google Gemini Pro**, followed by pixel-perfect PDF rendering via a backend **Puppeteer Service**.

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


