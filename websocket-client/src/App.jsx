import React, { useState, useEffect } from 'react';

const App = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [socket, setSocket] = useState(null);
  const [clientId, setClientId] = useState('');

  useEffect(() => {
    // 每次重新加載頁面時都生成一個新的 clientId
    const id = `User-${Math.floor(Math.random() * 1001)}`;  
    setClientId(id);
  }, []);

  // 建立 WebSocket 連線
  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8080');
    setSocket(ws);

    ws.onmessage = (event) => {
      setMessages((prev) => [...prev, event.data]);
    };

    ws.onclose = () => {
      console.log('WebSocket disconnected by onclose');
    };

    return () => {
      ws.close();
    };
  }, []);

  const sendMessage = (e) => {
    e.preventDefault();
    if (socket && input) {
      // 將訊息結構化，包含用戶 ID 和內容
      const message = JSON.stringify({ id: clientId, text: input });
      console.log('message:', message);
      socket.send(message);
      setInput('');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>WebSocket Test</h1>
      <div
        style={{
          border: '1px solid #ccc',
          padding: '10px',
          height: '300px',
          overflowY: 'scroll',
          marginBottom: '10px',
        }}
      >
        {messages.map((msg, index) => {
          try {
            const parsedMsg = JSON.parse(msg); // 解析訊息
            return (
              <div key={index} style={{ fontSize: '20px' }}>
                <strong>{parsedMsg.id}:</strong> {parsedMsg.text}
              </div>
            );
          } catch (error) {
            console.error('無法解析 JSON:', error);
            return <div key={index}>無法解析訊息</div>;
          }
        })}
      </div>

      <form onSubmit={sendMessage}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          style={{ width: '80%', marginRight: '10px' }}
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default App;
