# BuziBuddy

**Your AI Legal, Financial, Corporate, and Business Consultant**

BuziBuddy is an AI-powered Retrieval-Augmented Generation (RAG) chatbot that provides accessible business, financial, tax, and legal advisory support tailored to the Nepali context. Instead of relying solely on a language model's pre-trained knowledge, BuziBuddy retrieves answers from a curated knowledge base of verified Nepali legal and financial documents reducing hallucination and improving reliability in advisory scenarios.


---

## Overview

Professional legal, financial, and tax consultation is often expensive and difficult to access in Nepal, while the underlying regulations are hard for non-specialists to interpret. BuziBuddy addresses this gap with a conversational assistant that:

- Answers natural-language questions on business, finance, tax, and legal topics
- Grounds every response in retrieved, verified Nepali documents (Company Act, Income Tax Act, Contract Act, VAT regulations, etc.)
- Reduces hallucination through retrieval-based grounding rather than pure model recall
- Maintains conversational context across a session

**Scope:** business advisory, financial planning guidance, tax compliance support, legal compliance guidance, act-based Q&A, and document retrieval. BuziBuddy provides *informational* guidance only and is not a substitute for a licensed legal, tax, or financial professional.

## Features

- 🧠 Retrieval-Augmented Generation (RAG) pipeline for source-grounded answers
- 📚 Nepal-specific knowledge base (Company Act, Income Tax Act, Contract Act, VAT regulations, financial compliance materials)
- 💬 Conversational, session-aware chat interface
- 🔍 Semantic (embedding-based) search instead of keyword matching
- 🗂️ Source-aware responses with a defined "no relevant information found" fallback
- 🖥️ Responsive, web-based chat UI

## System Architecture

BuziBuddy uses a modular client–server architecture built around a RAG pipeline:

1. **React Frontend** — user submits a query; session ID and conversation history are sent to the backend.
2. **Express Proxy Server** — validates and forwards requests, normalizes responses, and shields the frontend from backend changes.
3. **n8n Workflow Engine (Dockerized)** — orchestrates the RAG pipeline: retrieval, prompt construction, AI response generation, and memory handling.
4. **Pinecone Vector Database** — stores document embeddings and performs semantic similarity search to retrieve the most relevant chunks.
5. **OpenRouter LLM (NVIDIA Nemotron 3 Super)** — generates a context-aware response using the user's query plus retrieved context.
6. **Browser `localStorage`** — persists session state on the client so conversations survive a refresh.

```
User → React Frontend → Express Proxy → n8n (RAG orchestration)
                                          ├─ Pinecone (semantic retrieval)
                                          └─ OpenRouter LLM (response generation)
       ← Express Proxy ← n8n ← Final response
```

## Tech Stack

**Frontend**
- React 18
- Vite 5.x
- Tailwind CSS 4
- Lucide React (icons)

**Backend & Orchestration**
- Express.js 4.x
- n8n (workflow automation / RAG orchestration)
- Docker (containerized n8n deployment)
- tsx, esbuild

**AI & Retrieval**
- Retrieval-Augmented Generation (RAG) architecture
- OpenRouter API (unified LLM access)
- NVIDIA Nemotron 3 Super (response generation)
- Pinecone (vector database for semantic retrieval)
- Document chunking + embedding pipeline
- n8n Simple Memory (last 20 messages)

**Knowledge Base**
- Nepal-specific legal, business, financial, and tax documents (`.md` / `.pdf`)

## AI Model Configuration

| Parameter | Value | Purpose |
|---|---|---|
| LLM Provider | OpenRouter | Unified API access to multiple LLMs |
| Model | NVIDIA Nemotron 3 Super (free) | Generates source-grounded responses |
| Architecture | Retrieval-Augmented Generation (RAG) | Combines semantic retrieval with LLM generation |
| Knowledge Base | Pinecone | Stores embeddings, performs semantic search |
| Temperature | 0.3 | Focused, consistent responses with minimal randomness |
| Top-p | 0.05 | Restricts token selection to most probable candidates |
| Presence Penalty | 0.0 | Allows reuse of key legal/financial terminology |
| Chat Memory | 20 previous messages | Maintains conversational context |

## Getting Started

> Update the steps below to match your actual repo layout and environment variables before publishing.

### Prerequisites
- Node.js (LTS)
- Docker
- A Pinecone account and API key
- An OpenRouter API key

### Installation

```bash
# clone the repository
git clone https://github.com/<your-org>/buzibuddy.git
cd buzibuddy

# install frontend dependencies
cd frontend
npm install

# install backend dependencies
cd ../backend
npm install
```

### Environment Variables

Create a `.env` file in the backend directory with:

```env
PINECONE_API_KEY=your_pinecone_key
OPENROUTER_API_KEY=your_openrouter_key
N8N_WEBHOOK_URL=http://localhost:****/webhook/buzibuddy-frontend-connect
```

### Running Locally

```bash
# start n8n via Docker
docker compose up -d

# start the Express proxy server
cd backend
npm run dev

# start the React frontend
cd ../frontend
npm run dev
```

## Project Structure

```
buzibuddy/
├── frontend/          # React + Vite chat interface
│   └── src/lib/api.ts # API client for /api/chat
├── backend/           # Express proxy server
│   └── server.ts      # Port 3000, forwards to n8n webhook
├── n8n/               # n8n workflow exports (RAG pipeline)
├── knowledge-base/    # Source documents (.md / .pdf) for ingestion
└── docker-compose.yml
```

## Limitations

- Knowledge is limited to documents currently indexed in Pinecone; queries outside this coverage may be incomplete.
- Requires an internet connection (cloud-dependent on OpenRouter and Pinecone).
- Response latency can vary due to use of a free-tier LLM.
- RAG reduces but does not fully eliminate hallucination.
- Conversational memory is capped at 20 previous messages.
- Informational only — not a substitute for a licensed legal, tax, or financial professional.
