import 'reflect-metadata';
import 'dotenv/config';

import express from 'express';
import cors from 'cors';
import { errors } from 'celebrate';
import 'express-async-errors';
import uploadConfig from '@config/upload';
import AppError from '@shared/errors/AppError';
import socketio from 'socket.io';
import http from 'http';

import routes from './routes';

const app = express();

const server = http.createServer(app);

const io = new socketio.Server(server);
// var socket = io('https://yourDomain:3000', { transport: ['websocket'] });

const connectedUsers = {};

io.on('connection', socket => {
  const { user_id } = socket.handshake.query;

  connectedUsers[user_id] = socket.id;

  socket.on('newRoom', room_id => {
    socket.join(`room${room_id}`);
    socket.to(`room${room_id}`).emit('joinRoom');
  });

  socket.on('leaveRoom', room_id => {
    socket.leave(`room${room_id}`);
  });

  socket.on('disconnect', async () => {
    delete connectedUsers[user_id];
  });
});

app.use((request, res, next) => {
  request.io = io;
  request.connectedUsers = connectedUsers;

  return next();
});

app.use(cors());

app.use(express.json());
app.use('/files', express.static(uploadConfig.uploadsFolder));

app.use(routes);

app.use(errors());

app.use((err, request, response, _) => {
  if (err instanceof AppError) {
    return response.status(err.statusCode).json({
      status: 'error',
      message: err.message,
    });
  }

  return response.status(500).json({
    status: 'error',
    message: 'Internal server error',
  });
});

server.listen(process.env.PORT || 3333, () => {
  console.log('🦾 Server started on port 3333');
});
