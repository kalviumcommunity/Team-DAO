import WebSocket from 'ws';

async function testWebSocket() {
  console.log('Connecting to WebSocket server at ws://localhost:3001...');
  const ws = new WebSocket('ws://localhost:3001');

  ws.on('open', () => {
    console.log('✅ Client connected successfully!');
    
    // Send ping message
    console.log('Sending ping message...');
    ws.send(JSON.stringify({ type: 'ping' }));

    // Send chat message
    setTimeout(() => {
      console.log('Sending chat message...');
      ws.send(JSON.stringify({ type: 'chat', content: 'Hello WebSocket Server!' }));
    }, 500);

    // Close after 1.5 seconds
    setTimeout(() => {
      console.log('Closing client connection...');
      ws.close();
    }, 1500);
  });

  ws.on('message', (data) => {
    console.log('📩 Received message from server:', data.toString());
  });

  ws.on('close', (code, _reason) => {
    console.log(`🔌 Connection closed with code ${code}`);
    process.exit(0);
  });

  ws.on('error', (err) => {
    console.error('❌ WebSocket error:', err);
    process.exit(1);
  });
}

testWebSocket();
