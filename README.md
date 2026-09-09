# BuziBuddy · AI Business & Finance Consultant

BuziBuddy is a production-ready, beautifully designed ChatGPT-style AI Consultant web application. It integrates seamlessly with your local or hosted n8n RAG workflow to answer financial, tax, and company registration questions with grounded data.

## Features

- **Full ChatGPT-like Interface**:
  - Interactive sidebar with session history (persisted in browser local storage).
  - Clean markdown parsing with GFM support (tables, lists, headers, blockquotes, bold/italic, links).
  - Code blocks with gorgeous syntax highlighting (via Prism).
  - Adaptive typing animations, auto-scroll, and responsive design.
  - Quick example prompts on the welcome screen.
- **Enterprise-grade Connection & Proxy**:
  - Built-in server proxy to bypass CORS restrictions or Mixed Content HTTP blockages in secure cloud environments.
  - Interactive settings panel to swap Webhook URLs on-the-fly.
- **Optimized Deployment & Containers**:
  - Production-ready `Dockerfile` and `docker-compose.yml`.

---

## Technical Stack

- **Frontend**: React 19, TypeScript, Vite 6, Tailwind CSS v4, Lucide React, Framer Motion
- **Backend/Proxy**: Node.js, Express, esbuild, tsx
- **Markdown & Code**: `react-markdown`, `remark-gfm`, `react-syntax-highlighter`

---

## Getting Started

### 1. Local Development
To launch the frontend with the integrated Express API proxy:

```bash
# Install dependencies
npm install

# Start development full-stack server (binds on port 3000)
npm run dev
```

The app will be accessible at [http://localhost:3000](http://localhost:3000).

### 2. Docker Setup
To run BuziBuddy in Docker:

```bash
# Build & start container
docker-compose up -d --build
```

The container maps port `3000` to your host computer automatically.

### 3. Connection with n8n Webhook
The application defaults to posting requests to:
`http://localhost:5678/webhook/buzibuddy-frontend-connect`

If you are running n8n on a different URL or host, open the **Settings** modal from the header and input your custom Webhook URL. Ensure **"Use Server-Side Proxy"** is checked for smooth CORS resolution!
