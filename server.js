import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { exec } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicDir = path.join(__dirname, 'public');

const app = express();
const PORT = process.env.PORT || 3000;

// Compile Tailwind CSS on startup (local only; Vercel uses the build script)
exec(
  'npx @tailwindcss/cli -i public/assets/css/tailwind.css -o public/assets/css/styles.css',
  (err, stdout, stderr) => {
    if (err) {
      console.error('Tailwind build error:', stderr);
    } else {
      console.log('Tailwind CSS built successfully.');
    }
  }
);

// Serve static files from public/ (required for Vercel CDN + local Express)
app.use(express.static(publicDir));

// Default route
app.get('/', (req, res) => {
  res.sendFile(path.join(publicDir, 'index.html'));
});

// Fallback for HTML routes without extension
app.get('/:page', (req, res, next) => {
  const page = req.params.page;
  if (!page.includes('.')) {
    const filePath = path.join(publicDir, `${page}.html`);
    return res.sendFile(filePath, (err) => {
      if (err) next();
    });
  }
  next();
});

// 404 fallback
app.use((req, res) => {
  res.status(404).sendFile(path.join(publicDir, '404.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server listening on port ${PORT}`);
});
