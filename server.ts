import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';

async function startServer() {
  const app = express();
  const PORT = *******;

  app.use(express.json());

  // API Proxy Route for the n8n Webhook
  app.post('/api/chat', async (req, res) => {
    const { question, sessionId, webhookUrl } = req.body;

    if (!webhookUrl) {
      res.status(400).json({ error: 'webhookUrl is required' });
      return;
    }

    try {
      // Use standard global fetch to forward the request
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question, sessionId }),
      });

      const text = await response.text();

      if (!response.ok) {
        res.status(response.status).send(text);
        return;
      }

      res.setHeader('Content-Type', response.headers.get('Content-Type') || 'application/json');
      res.send(text);
    } catch (error: any) {
      res.status(500).json({
        error: `Could not reach webhook at ${webhookUrl}. Details: ${error.message || error}`,
      });
    }
  });

  // Vite middleware setup for Development or Static serving for Production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
    console.log('Running in Development mode with Vite middleware.');
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
    console.log(`Running in Production mode serving: ${distPath}`);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
