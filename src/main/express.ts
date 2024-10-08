import express from 'express';
import fs from 'fs';
import path from 'path';
import http from 'http';
import ws, { WebSocketServer } from 'ws';
import { Logger } from './util';
import ipc from './ipc';

const app = express();

const server = http.createServer(app);
const webSocketServer = new WebSocketServer({ server, path: '/ws' });
const port = 3000;
app.use(express.static(path.resolve('resources/assets/integration')));

app.get('/', (req, res) => {
  if (process.env.NODE_ENV !== 'production') {
    res.redirect('http://localhost:1213/');
    return;
  }
  res.send(
    fs
      .readFileSync(path.resolve('resources/assets/integration', 'index.html'))
      .toString(),
  );
});

const wssConnections: ws[] = [];

webSocketServer.on('connection', (wss) => {
  wssConnections.push(wss);

  wss.on('close', () => {
    wssConnections.splice(wssConnections.indexOf(wss), 1);
  });
});

export function sendToWss(message: Uint8Array) {
  wssConnections.forEach((wsConnection) => wsConnection.send(message));
}

export function runServer() {
  ipc.onAll((channel, data) => {
    sendToWss(
      new TextEncoder().encode(JSON.stringify({ event: channel, data })),
    );
  });
  server.listen(port, () => Logger.log('EXPRESS', 'Started'));
}

export function stopServer() {
  wssConnections.forEach((wsConnection) => wsConnection.close());
  server.close();
}
