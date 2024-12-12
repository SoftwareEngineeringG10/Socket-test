import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:8080');

const ChatSocket = ({ room, windowId }) => {
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([]);

  useEffect(() => {
    // 加入新房間
    if (room) {
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
    if (message.trim()) {
      const msgData = { room, author: `User-${windowId}`, msg: message };
      socket.emit('send_message', msgData); // 發送訊息
      //setChat((prev) => [...prev, msgData]); // 自己顯示訊息
      setMessage(''); // 清空輸入框
    }
  };

  return (
    <div>
      <h1 style={{ fontSize: '24px' }}>{room || 'Select a room'}</h1>
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
        disabled={!room}
      />
    </div>
  );
};

export default ChatSocket;
