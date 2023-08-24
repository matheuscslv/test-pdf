import socket from 'socket.io';

import app from './app';

const server = app.listen(process.env.API_PORT, () => {
  console.log(`🚀 SISID running on port ${process.env.API_PORT}`);
});

const io = socket(server);

io.on('connection', (socket) => {
  console.log(`socket connection: ${socket.id}`);
});

export { server, io };
