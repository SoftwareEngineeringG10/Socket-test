const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' },
});

// 當用戶連線
io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  // 用戶加入房間
  socket.on('join_room', (room) => {
    socket.join(room); // 加入特定房間
    console.log(`${socket.id} joined room ${room}`);
  });

  // 處理訊息發送
  socket.on('send_message', (msgdata) => {
    const { room, author, msg, data} = msgdata;
    console.log(data);
    console.log(`Message from ${author} in room ${room}: ${msg}`);
    // 只廣播到特定房間
    if (room) {
      console.log(`Message from ${author} in room ${room}: ${msg}`);
      io.to(room).emit('receive_message', data); // 僅廣播到該房間
    } else {
      console.error("Room ID is missing in send_message event!");
    }
  });

  // 用戶斷線
  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

server.listen(8080, () => {
  console.log('Server is running on port 8080');
});
