import { wss } from "../server.ts"; // Assumindo que seu WebSocket server está em ws.ts

export function broadcastMessage(event: string, message: any) {
  if (!wss) return;

  wss.clients.forEach((client) => {
    if (client.readyState === 1) { // WebSocket.OPEN
      client.send(JSON.stringify({
        event,
        message,
      }));
    }
  });
}