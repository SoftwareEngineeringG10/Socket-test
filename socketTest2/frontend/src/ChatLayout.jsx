import React, { useState } from 'react';
import ChatSocket from './ChatSocket';

const ChatLayout = () => {
  const [room, setRoom] = useState(null); // 目前選擇的房間
  const [windowId] = useState(
    Math.random()
      .toString()
      .slice(2, 5)
  ); // 隨機生成視窗代號

  const joinRoom = (roomName) => {
    setRoom(roomName); // 切換房間
  };

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      {/* 左側按鈕 */}
      <div style={{ width: '20%', padding: '10px', borderRight: '1px solid #ddd' }}>
        <button onClick={() => joinRoom('room1')}>Room 1</button>
        <button onClick={() => joinRoom('room2')}>Room 2</button>
        <button onClick={() => joinRoom('room3')}>Room 3</button>
      </div>

      {/* 右側聊天室 */}
      <div style={{ width: '80%', padding: '10px' }}>
        {room ? (
          <ChatSocket room={room} windowId={windowId} />
        ) : (
          <p>Please select a room to start chatting!</p>
        )}
      </div>
    </div>
  );
};

export default ChatLayout;