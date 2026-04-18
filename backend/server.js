/**
 * Server Entry Point
 * Creates HTTP server, attaches Socket.IO, and starts listening
 */
const http = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

const app = require('./app');
const { testConnection } = require('./config/db');
const { getAllowedOrigins } = require('./config/corsOrigins');
const { initializeChat } = require('./sockets/chat');

// Create HTTP server from Express app
const server = http.createServer(app);

// Attach Socket.IO to the HTTP server
const io = new Server(server, {
  cors: {
    origin: getAllowedOrigins(),
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// Initialize Socket.IO chat handler
initializeChat(io);

// Start the server
const PORT = process.env.PORT || 5001;

async function startServer() {
  // Test database connection first
  await testConnection();

  server.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📡 Socket.IO listening for connections`);
    console.log(`🌐 CORS / Socket origins: ${getAllowedOrigins().join(', ')}`);
  });
}

startServer();
