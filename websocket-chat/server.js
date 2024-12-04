// server.js

const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });

// 儲存所有連接的 WebSocket 客戶端
const clients = [];

wss.on('connection', (ws) => {
  console.log('A client connected');

  // 當有訊息從客戶端傳來時
  ws.on('message', (message) => {
    console.log('Received message:', message);
    console.log('Type of message:', typeof message);

    // 如果是 Buffer，將其轉換為字串
    if (Buffer.isBuffer(message)) {
      message = message.toString();  // 將 Buffer 轉換為字串
      console.log('Converted message to string:', message);
    }

    try {
      const parsedMessage = JSON.parse(message);  // 解析 JSON 格式的訊息
      console.log('parsedMessage:', parsedMessage.text);

      // 廣播給所有連接的客戶端
      clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
          const response = {
            id: `${parsedMessage.id}`,
            text: `${parsedMessage.text}`,
          };
          client.send(JSON.stringify(response));  // 發送 JSON 格式的消息
        }
      });
    } catch (error) {
      console.error('Error parsing message:', error);
      ws.send(JSON.stringify({ id: 'Server', text: 'Invalid JSON' }));
    }
  });

  // 當新客戶端連接時，將其加入 clients 陣列
  clients.push(ws);

  // 當客戶端斷開連接時，將其移除
  ws.on('close', () => {
    const index = clients.indexOf(ws);
    if (index !== -1) {
      clients.splice(index, 1);
    }
  });
});

console.log('WebSocket server is running on ws://localhost:8080');
