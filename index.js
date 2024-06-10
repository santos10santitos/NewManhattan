// server.js
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static('public'));

const users = new Map();

io.on('connection', (socket) => {
  console.log('a user connected');


  const userColor = getRandomColor();
  users.set(socket.id, userColor);

  socket.on('disconnect', () => {
    console.log('user disconnected');
    users.delete(socket.id);
  });

  socket.on('chat message', (msg) => {
    io.emit('chat message', { msg, color: users.get(socket.id) });
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});


function getRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}
