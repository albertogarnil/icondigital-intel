// Static server for the Intel Digital prototype (Railway).
// Serves the repo root (also used by GitHub Pages); optional password via BASIC_USER / BASIC_PASS env vars.
const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const PRIVATE = new Set(['server.js', 'package.json', 'README.md']);
const PORT = process.env.PORT || 3000;
const USER = process.env.BASIC_USER;
const PASS = process.env.BASIC_PASS;

const TYPES = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.svg': 'image/svg+xml',
  '.mp4': 'video/mp4', '.ico': 'image/x-icon', '.json': 'application/json',
};

function authorized(req) {
  if (!USER || !PASS) return true;
  const h = req.headers.authorization || '';
  const [scheme, b64] = h.split(' ');
  if (scheme !== 'Basic' || !b64) return false;
  const [u, ...p] = Buffer.from(b64, 'base64').toString().split(':');
  return u === USER && p.join(':') === PASS;
}

http.createServer((req, res) => {
  res.setHeader('X-Robots-Tag', 'noindex, nofollow');
  if (!authorized(req)) {
    res.writeHead(401, { 'WWW-Authenticate': 'Basic realm="Intel Digital"' });
    return res.end('Acceso restringido');
  }
  let urlPath = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  let file = path.normalize(path.join(ROOT, urlPath));
  if (!file.startsWith(ROOT)) { res.writeHead(403); return res.end(); }
  if (urlPath.endsWith('/')) file = path.join(file, 'index.html');
  const base = path.basename(file);
  if (base.startsWith('.') || PRIVATE.has(base) || urlPath.split('/').some(s => s.startsWith('.'))) { res.writeHead(404); return res.end('No encontrado'); }

  fs.stat(file, (err, st) => {
    if (err || !st.isFile()) { res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' }); return res.end('No encontrado'); }
    const type = TYPES[path.extname(file).toLowerCase()] || 'application/octet-stream';
    const cache = type.startsWith('text/html') ? 'no-cache' : 'public, max-age=3600';
    const range = req.headers.range;
    if (range && type === 'video/mp4') {
      const [s, e] = range.replace('bytes=', '').split('-');
      const start = parseInt(s, 10), end = e ? parseInt(e, 10) : st.size - 1;
      res.writeHead(206, { 'Content-Type': type, 'Content-Range': `bytes ${start}-${end}/${st.size}`, 'Accept-Ranges': 'bytes', 'Content-Length': end - start + 1, 'Cache-Control': cache });
      return fs.createReadStream(file, { start, end }).pipe(res);
    }
    res.writeHead(200, { 'Content-Type': type, 'Content-Length': st.size, 'Accept-Ranges': 'bytes', 'Cache-Control': cache });
    fs.createReadStream(file).pipe(res);
  });
}).listen(PORT, () => console.log(`Intel Digital prototype on :${PORT}`));
