const express = require('express');
const next = require('next');
const path = require('path');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();

  server.all('*', (req, res) => {
    if (req.path.startsWith('/images')) {
      res.sendFile(path.resolve(__dirname, `../images/${req.path.split('/images/')[1]}`));
    }

    // If not a static file, just let next.js do the rest

    return handle(req, res);
  });

  server.listen(3000, (err) => {
    if (err) throw err;
    console.log('> Ready on http://localhost:3000');
  });
});
