const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = path.join(__dirname, '..', 'public');

const MIME_TYPES = {
  '.html': 'text/html; charset=UTF-8',
  '.css': 'text/css; charset=UTF-8',
  '.js': 'application/javascript; charset=UTF-8',
  '.json': 'application/json; charset=UTF-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml; charset=UTF-8',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=UTF-8'
};

function sendNotFound(res) {
  res.writeHead(404, { 'Content-Type': 'text/plain; charset=UTF-8' });
  res.end('Not found');
}

function sendServerError(res, error) {
  console.error('Server error:', error);
  res.writeHead(500, { 'Content-Type': 'text/plain; charset=UTF-8' });
  res.end('Internal server error');
}

const server = http.createServer((req, res) => {
  try {
    const parsedUrl = url.parse(req.url);
    const decodedPath = decodeURI(parsedUrl.pathname || '/');
    let relativePath = decodedPath;

    if (relativePath.endsWith('/')) {
      relativePath = path.join(relativePath, 'index.html');
    }

    const safePath = path.normalize(relativePath).replace(/^\.\/+/, '');
    const absolutePath = path.join(PUBLIC_DIR, safePath);

    if (!absolutePath.startsWith(PUBLIC_DIR)) {
      res.writeHead(403, { 'Content-Type': 'text/plain; charset=UTF-8' });
      res.end('Forbidden');
      return;
    }

    fs.stat(absolutePath, (statErr, stats) => {
      if (statErr) {
        if (decodedPath === '/' || decodedPath === '') {
          return sendNotFound(res);
        }
        return sendNotFound(res);
      }

      if (stats.isDirectory()) {
        const indexPath = path.join(absolutePath, 'index.html');
        fs.stat(indexPath, (indexErr, indexStats) => {
          if (indexErr || !indexStats.isFile()) {
            return sendNotFound(res);
          }
          serveFile(indexPath, res);
        });
        return;
      }

      serveFile(absolutePath, res);
    });
  } catch (error) {
    sendServerError(res, error);
  }
});

function serveFile(filePath, res) {
  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';
  const stream = fs.createReadStream(filePath);

  stream.on('open', () => {
    res.writeHead(200, { 'Content-Type': contentType });
    stream.pipe(res);
  });

  stream.on('error', (error) => {
    sendServerError(res, error);
  });
}

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

module.exports = server;
