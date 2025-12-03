const express = require('express');
const http = require('http');
const { createBareServer } = require('@tomphttp/bare-server-node');
const path = require('path');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
    if (req.path.includes('active')) {
        res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
        res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
    }
    next();
});
app.use(express.static(__dirname));

const routes = [
    { path: '/', file: 'index.html' },
    { path: '/search', file: 'search.html' }
];

routes.forEach((route) => {
    app.get(route.path, (req, res) => {
        res.sendFile(path.join(__dirname, route.file));
    });
});

app.use((req, res) => {
    res.redirect('/');
});

const bareServer = createBareServer('/b/');
const server = http.createServer((req, res) => {
    if (bareServer.shouldRoute(req)) {
        bareServer.routeRequest(req, res);
    } else {
        app(req, res);
    }
});

server.listen(port, () => {
    console.log(`Mainframe Browser running on http://localhost:${port}`);
});
