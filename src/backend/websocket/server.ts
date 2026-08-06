import { WebSocketServer, WebSocket } from 'ws';
import http from 'http';
import { db } from '../lib/db';
import { startStockCheckJob } from '../services/stock-check.job';

const PORT = Number(process.env.WS_PORT) || 3001;

export interface ExtendedWebSocket extends WebSocket {
  isAlive?: boolean;
  clientId?: string;
  userId?: string;
  userEmail?: string;
}

export interface MessagePayload {
  type: string;
  sender?: string;
  content?: string;
  timestamp?: string;
  [key: string]: unknown;
}

const server = http.createServer((req, res) => {
  if (req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok', activeUsers: getActiveUserIds().length, time: new Date().toISOString() }));
  } else {
    res.writeHead(404);
    res.end();
  }
});

export const wss = new WebSocketServer({ server });

let clientCounter = 0;

wss.on('connection', (ws: ExtendedWebSocket, req) => {
  clientCounter++;
  const clientId = `client_${clientCounter}_${Math.random().toString(36).substring(2, 7)}`;
  ws.isAlive = true;
  ws.clientId = clientId;

  // Extract user ID from query string if available e.g. ws://localhost:3001?userId=...
  if (req.url && req.url.includes('?')) {
    const params = new URLSearchParams(req.url.split('?')[1]);
    const uId = params.get('userId');
    const uEmail = params.get('userEmail');
    if (uId) ws.userId = uId;
    if (uEmail) ws.userEmail = uEmail;
  }

  const clientIp = req.socket.remoteAddress;
  console.log(`[WS Server] Active user client connected: ${clientId} (User ID: ${ws.userId || 'guest'}) (${clientIp})`);

  // Send welcome message
  const welcomeMsg: MessagePayload = {
    type: 'welcome',
    sender: 'system',
    content: `Connected to WebSocket Server as ${clientId}`,
    clientId,
    timestamp: new Date().toISOString()
  };
  ws.send(JSON.stringify(welcomeMsg));

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

      if (parsed.type === 'authenticate' || parsed.type === 'identify') {
        if (typeof parsed.userId === 'string') ws.userId = parsed.userId;
        if (typeof parsed.userEmail === 'string') ws.userEmail = parsed.userEmail;
        console.log(`[WS Server] Client ${ws.clientId} authenticated as user ${ws.userId || ws.userEmail}`);
        ws.send(JSON.stringify({ type: 'authenticated', userId: ws.userId }));
        return;
      }

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
    console.log(`[WS Server] Client disconnected: ${ws.clientId} (User: ${ws.userId || 'guest'})`);
  });

  ws.on('error', (error) => {
    console.error(`[WS Server] Client error (${ws.clientId}):`, error);
  });
});

/** Broadcast message to all active WebSocket clients */
export function broadcast(data: MessagePayload, ignoreWs?: ExtendedWebSocket) {
  const payload = JSON.stringify(data);
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN && client !== ignoreWs) {
      client.send(payload);
    }
  });
}

/** Get list of currently active & connected user IDs */
export function getActiveUserIds(): string[] {
  const activeSet = new Set<string>();
  wss.clients.forEach((client) => {
    const ws = client as ExtendedWebSocket;
    if (ws.readyState === WebSocket.OPEN && ws.userId) {
      activeSet.add(ws.userId);
    }
  });
  return Array.from(activeSet);
}

/** Send message to specific active user by ID */
export function sendToUser(userId: string, data: MessagePayload) {
  const payload = JSON.stringify(data);
  let sentCount = 0;
  wss.clients.forEach((client) => {
    const ws = client as ExtendedWebSocket;
    if (ws.readyState === WebSocket.OPEN && (ws.userId === userId || ws.userEmail === userId)) {
      ws.send(payload);
      sentCount++;
    }
  });
  return sentCount;
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
    console.warn(`[WS Server] Port ${PORT} is already bound by WebSocket process. Reusing active instance.`);
  } else {
    console.error('[WS Server] Server error:', err);
  }
});

// Singleton guard to prevent duplicate listen calls during Next.js hot module reloads
if (!(globalThis as any).__ws_server_listening__) {
  (globalThis as any).__ws_server_listening__ = true;
  try {
    server.listen(PORT, () => {
      console.log(`🚀 [WS Server] Active user WebSocket server listening on ws://localhost:${PORT}`);
      startStockCheckJob(db);
    });
  } catch (err: any) {
    if (err?.code !== 'EADDRINUSE') {
      console.error('[WS Server] Failed to listen:', err);
    }
  }
}

process.on('SIGINT', () => {
  console.log('[WS Server] Shutting down WebSocket server...');
  wss.close();
  server.close(() => process.exit(0));
});
