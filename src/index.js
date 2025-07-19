const { createBareServer } = require("@tomphttp/bare-server-node");
const express = require("express");
const { createServer } = require("node:http");
const { uvPath } = require("@titaniumnetwork-dev/ultraviolet");
const path = require('path');

// Create express app
const app = express();

// Create bare server
const bare = createBareServer("/bare/");

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, "../public")));
app.use("/uv/", express.static(uvPath));

// Create server
const server = createServer();

// Handle requests
server.on("request", (req, res) => {
    if (bare.shouldRoute(req)) {
        bare.routeRequest(req, res);
    } else {
        app(req, res);
    }
});

// Handle WebSocket upgrades
server.on("upgrade", (req, socket, head) => {
    if (bare.shouldRoute(req)) {
        bare.routeUpgrade(req, socket, head);
    } else {
        socket.end();
    }
});

// Error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// 404 handler - must be last
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, "../public/404.html"));
});

// Set port
const port = process.env.PORT || 8080;

// Handle graceful shutdown
function shutdown() {
    server.close(() => {
        console.log('Server closed');
        process.exit(0);
    });
}

process.on('SIGTERM', () => {
    console.log('Received SIGTERM signal. Closing server...');
    shutdown();
});

process.on('SIGINT', () => {
    console.log('Received SIGINT signal. Closing server...');
    shutdown();
});

// Start server
try {
    server.listen(port, '0.0.0.0', () => {
        console.log(`Server running at http://localhost:${port}/`);
        console.log(`Bare Server active at /bare/`);
    });
} catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
}
