import dns from 'dns';
import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import { createApp } from './backend/src/index.js';
import { config } from './backend/src/config/index.js';

// Fix MongoDB Atlas SRV DNS resolution
dns.setServers(['8.8.8.8', '8.8.4.4']);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = await createApp();
  const PORT = process.env.PORT || config.port || 3000;
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    // Development: integrate Vite dev middleware
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        port: PORT,
        host: '0.0.0.0',
        hmr: process.env.DISABLE_HMR !== 'true',
        watch: process.env.DISABLE_HMR === 'true' ? null : {},
      },
      appType: 'spa',
    });

    app.use(vite.middlewares);
    console.log('⚡ [Vite] Vite dev server middleware mounted');
  } else {
    // Production: serve built static files from dist/
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
    console.log(`📦 [Production] Serving static files from ${distPath}`);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🇮🇳 [TravelBharat] Full-stack application running at http://localhost:${PORT}`);
    console.log(`📚 Digital Tourism Encyclopedia for India is active!`);
  });
}

startServer().catch((err) => {
  console.error('❌ Failed to start TravelBharat server:', err);
  process.exit(1);
});
