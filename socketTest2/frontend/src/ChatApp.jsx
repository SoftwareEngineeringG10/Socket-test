import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:8080');

const ChatApp = () => {
  const [room, setRoom] = useState(null);
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([]);
  const [windowId] = useState(
    Math.random().toString().slice(2, 5) + Math.random().toString().slice(2, 5) // 隨機產生視窗 ID
  );

  useEffect(() => {
    if (room) {
      // 加入房間
      socket.emit('join_room', room);

      // 清空聊天記錄
      setChat([]);
    }

    // 接收訊息
    const handleReceiveMessage = (data) => {
      setChat((prev) => [...prev, data]);
    };
    socket.on('receive_message', handleReceiveMessage);

    return () => {
      socket.off('receive_message', handleReceiveMessage); // 清理監聽器
    };
  }, [room]);

  const sendMessage = () => {
    if (message.trim() && room) {
      const msgData = { room, author: `User-${windowId}`, msg: message };
      socket.emit('send_message', msgData); // 發送訊息
      setMessage(''); // 清空輸入框
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      {/* 左側按鈕區 */}
      <div style={{ width: '20%', borderRight: '1px solid #ddd', padding: '10px' }}>
        <button onClick={() => setRoom('room1')} style={{ display: 'block', marginBottom: '10px' }}>
          Room 1
        </button>
        <button onClick={() => setRoom('room2')} style={{ display: 'block', marginBottom: '10px' }}>
          Room 2
        </button>
        <button onClick={() => setRoom('room3')} style={{ display: 'block', marginBottom: '10px' }}>
          Room 3
        </button>
      </div>

      {/* 右側聊天區 */}
      <div style={{ flex: 1, padding: '10px' }}>
        {room ? (
          <>
            <h1 style={{ fontSize: '24px', marginBottom: '10px' }}>{room}</h1>
            <div
              style={{
                height: '300px',
                overflowY: 'scroll',
                border: '1px solid #ddd',
                padding: '10px',
                marginBottom: '10px',
              }}
            >
              {chat.map((c, idx) => (
                <p key={idx}>
                  <strong>{c.author}:</strong> {c.msg}
                </p>
              ))}
            </div>
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Type a message..."
              style={{ width: '100%', padding: '10px' }}
            />
          </>
        ) : (
          <p style={{ fontSize: '18px' }}>Please select a room to join.</p>
        )}
      </div>
    </div>
  );
};

export default ChatApp;
