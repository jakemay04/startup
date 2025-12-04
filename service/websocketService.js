// websocketService.js

const WebSocket = require('ws');

// A Set to track all active clients
const clients = new Set();

/**
 * Broadcasts a message to all connected clients, including the sender.
 * The message will be displayed locally on the sender's screen via the broadcast.
 * @param {string} message - The JSON string message to send.
 */
function broadcast(message) {
  clients.forEach((client) => {
    // We removed the "client !== sender" check. 
    // The server now broadcasts to ALL clients to confirm message processing.
    if (client.readyState === WebSocket.OPEN) { 
      client.send(message);
    }
  });
}

/**
 * Initializes and attaches the WebSocket Server to an existing HTTP server.
 * @param {http.Server} server - The Node.js HTTP server instance.
 */
function initializeWebSocketService(server) {
  console.log('Attaching WebSocket server to HTTP server on path /ws...');
  
  // Create a WebSocket Server instance and attach it to the existing HTTP server
  const wss = new WebSocket.Server({ server, path: '/ws' });

  wss.on('connection', (ws) => {
    clients.add(ws);
    console.log('Client connected. Total clients:', clients.size);

    // Send initial system message back to the new client
    ws.send(JSON.stringify({
      name: 'system',
      msg: 'websocket connected',
      event: 'system'
    }));

    // Handle incoming messages
    ws.on('message', (message) => {
      // Broadcast the received message to all clients, including the sender
      broadcast(message.toString()); 
    });

    // Handle client disconnection
    ws.on('close', () => {
      clients.delete(ws);
      console.log('Client disconnected. Total clients:', clients.size);
    });
    
    ws.on('error', (error) => {
      console.error('WebSocket Error:', error);
    });
  });
}

module.exports = {
  initializeWebSocketService,
};