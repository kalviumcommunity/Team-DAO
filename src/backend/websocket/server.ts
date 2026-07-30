import { WebSocketServer, WebSocket } from 'ws';
import http from 'http';

const PORT = Number(process.env.WS_PORT) || 3001;

interface ExtendedWebSocket extends WebSocket {
  isAlive?: boolean;
  clientId?: string;
}

interface MessagePayload {
  type: string;
  sender?: string;
  content?: string;
  timestamp?: string;
  [key: string]: unknown;
}

const server = http.createServer((req, res) => {
  if (req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok', time: new Date().toISOString() }));
  } else {
    res.writeHead(404);
    res.end();
  }
});

const wss = new WebSocketServer({ server });

let clientCounter = 0;

wss.on('connection', (ws: ExtendedWebSocket, req) => {
  clientCounter++;
  const clientId = `client_${clientCounter}_${Math.random().toString(36).substring(2, 7)}`;
  ws.isAlive = true;
  ws.clientId = clientId;

  const clientIp = req.socket.remoteAddress;
  console.log(`[WS Server] Client connected: ${clientId} (${clientIp})`);

  // Send welcome message to newly connected client
  const welcomeMsg: MessagePayload = {
    type: 'welcome',
    sender: 'system',
    content: `Connected to WebSocket Server as ${clientId}`,
    clientId,
    timestamp: new Date().toISOString()
  };
  ws.send(JSON.stringify(welcomeMsg));

  // Broadcast user joined event to all other clients
  broadcast({
    type: 'system',
    sender: 'system',
    content: `${clientId} joined the room.`,
    timestamp: new Date().toISOString()
  }, ws);

  ws.on('pong', () => {
    ws.isAlive = true;
  });

  ws.on('message', (rawMessage: Buffer) => {
    try {
      const messageStr = rawMessage.toString();
      let parsed: MessagePayload;

      try {
        parsed = JSON.parse(messageStr);
      } catch {
        parsed = { type: 'message', content: messageStr };
      }

      parsed.sender = ws.clientId;
      parsed.timestamp = new Date().toISOString();

      console.log(`[WS Server] Received from ${ws.clientId}:`, parsed);

      if (parsed.type === 'ping') {
        ws.send(JSON.stringify({ type: 'pong', timestamp: new Date().toISOString() }));
        return;
      }

      // Default: broadcast incoming message to all connected clients
      broadcast(parsed);
    } catch (err) {
      console.error(`[WS Server] Error processing message from ${ws.clientId}:`, err);
    }
  });

  ws.on('close', (code, reason) => {
    console.log(`[WS Server] Client disconnected: ${ws.clientId} (code: ${code}, reason: ${reason})`);
    broadcast({
      type: 'system',
      sender: 'system',
      content: `${ws.clientId} disconnected.`,
      timestamp: new Date().toISOString()
    });
  });

  ws.on('error', (error) => {
    console.error(`[WS Server] Client error (${ws.clientId}):`, error);
  });
});

function broadcast(data: MessagePayload, ignoreWs?: ExtendedWebSocket) {
  const payload = JSON.stringify(data);
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN && client !== ignoreWs) {
      client.send(payload);
    }
  });
}

// Heartbeat ping interval to clean dead connections
const heartbeatInterval = setInterval(() => {
  wss.clients.forEach((client) => {
    const ws = client as ExtendedWebSocket;
    if (ws.isAlive === false) {
      console.log(`[WS Server] Terminating inactive connection: ${ws.clientId}`);
      return ws.terminate();
    }
    ws.isAlive = false;
    ws.ping();
  });
}, 30000);

wss.on('close', () => {
  clearInterval(heartbeatInterval);
});

server.on('error', (err: NodeJS.ErrnoException) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`❌ [WS Server] Port ${PORT} is already in use.`);
    console.error(`👉 Stop any process running on port ${PORT} or specify a different port: WS_PORT=3002 npm run ws:dev`);
    process.exit(1);
  } else {
    console.error('[WS Server] Server error:', err);
  }
});

server.listen(PORT, () => {
  console.log(`🚀 [WS Server] WebSocket server listening on ws://localhost:${PORT}`);
});

process.on('SIGINT', () => {
  console.log('[WS Server] Shutting down WebSocket server...');
  wss.close();
  server.close(() => process.exit(0));
});
