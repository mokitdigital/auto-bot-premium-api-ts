// src/server.ts
import express from 'express';
import { createServer } from 'http';
import { WebSocketServer } from 'ws'; // <-- WebSocket puro
import './config/knexConfig';
import clientRoutes from './routes/client.routes';
import flowRoutes from './routes/flow.routes';
import qrcodeRoutes from './routes/qrcode.routes';
import messageRoutes from './routes/message.routes';
import { getMessages, setupMessageHandlers } from './controllers/message.controller';

const app = express();
const httpServer = createServer(app);

// WebSocket Server (puro)
const wss = new WebSocketServer({ server: httpServer });

wss.on('connection', (socket) => {
  console.log('Novo cliente WebSocket conectado!');
  setupMessageHandlers(wss, socket);
  getMessages(socket);
});

// Express REST APIs
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/api/v1/health', (req, res) => {
  res.send('Bem-vindo ao Auto Bot Premium API');
});

app.use('/api/v1/flows', flowRoutes);
app.use('/api/v1/clients', clientRoutes);
app.use('/api/v1/qrcode', qrcodeRoutes);
app.use('/api/v1/messages', messageRoutes);

httpServer.listen(3400, async () => {
  console.log('🚀 Servidor rodando em http://localhost:3400');
});

export { wss };