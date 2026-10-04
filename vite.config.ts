import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';
import {defineConfig, Plugin} from 'vite';

function avatarUploadPlugin(): Plugin {
  return {
    name: 'avatar-upload-plugin',
    configureServer(server) {
      server.middlewares.use('/api/upload-avatar', (req, res) => {
        if (req.method === 'POST') {
          let body = '';
          req.on('data', (chunk) => {
            body += chunk;
          });
          req.on('end', () => {
            try {
              const data = JSON.parse(body);
              const { imageBase64, transparentBase64, themeFilledBase64 } = data;

              const saveBase64 = (b64: string, filePaths: string[]) => {
                const base64Data = b64.replace(/^data:image\/\w+;base64,/, '');
                const buffer = Buffer.from(base64Data, 'base64');
                for (const target of filePaths) {
                  try {
                    fs.mkdirSync(path.dirname(target), { recursive: true });
                    fs.writeFileSync(target, buffer);
                  } catch (_) {}
                }
              };

              if (transparentBase64) {
                saveBase64(transparentBase64, [
                  path.resolve(__dirname, 'public/assets/img/perfil.png'),
                  path.resolve(__dirname, 'public/img/perfil.png'),
                ]);
              }

              if (themeFilledBase64) {
                saveBase64(themeFilledBase64, [
                  path.resolve(__dirname, 'public/assets/img/about.jpg'),
                  path.resolve(__dirname, 'public/assets/img/about.png'),
                  path.resolve(__dirname, 'public/img/about.jpg'),
                ]);
              }

              if (imageBase64 && !transparentBase64 && !themeFilledBase64) {
                saveBase64(imageBase64, [
                  path.resolve(__dirname, 'public/assets/img/about.jpg'),
                  path.resolve(__dirname, 'public/assets/img/perfil.png'),
                  path.resolve(__dirname, 'public/img/about.jpg'),
                  path.resolve(__dirname, 'public/img/perfil.png'),
                ]);
              }

              res.writeHead(200, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ success: true }));
              return;
            } catch (err: any) {
              res.writeHead(500, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ error: err.message }));
              return;
            }
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'No image data provided' }));
          });
        } else {
          res.writeHead(405);
          res.end();
        }
      });
    },
  };
}

export default defineConfig(() => {
  return {
    base: process.env.GITHUB_ACTIONS === 'true' ? '/portfolio/' : '/',
    plugins: [react(), tailwindcss(), avatarUploadPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
