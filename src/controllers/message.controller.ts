// wsHandlers/messageHandler.ts
import knex from "knex";
import knexConfig from "../../knexfile";
import venomService from "../venom/client";
import { WebSocketServer, WebSocket } from 'ws';

const db = knex(knexConfig.development);

export function setupMessageHandlers(wss: WebSocketServer, socket: WebSocket) {
  socket.on('message', async (rawData) => {
    try {
      const parsed = JSON.parse(rawData.toString());

      if (parsed.event === 'send_message') {
        const { number, message, client_id } = parsed.data;
        const number_recipient = number + "@c.us";
        const number_sender = venomService.getSenderNumber();

        if (!number || !message || !number_recipient) {
          await db("messages").insert({
            number_recipient,
            number_sender,
            message,
            status: "failed",
            message_error: "Números e mensagens obrigatórios",
            client_id: client_id,
          });

          socket.send(JSON.stringify({
            event: "message_error",
            data: { error: "Números e mensagens obrigatórios" }
          }));

          return;
        }

        try {
          const result = await venomService.sendMessage(number, message);

          if (result?.erro) {
            await db("messages").insert({
              number_recipient,
              number_sender,
              message,
              status: "failed",
              message_error: result?.status.messageSendResult,
              client_id: client_id,
            });

            socket.send(JSON.stringify({
              event: "message_error",
              data: { error: result.erro }
            }));

            return;
          }

          await db("messages").insert({
            number_recipient,
            number_sender,
            message,
            status: "sent",
            client_id: client_id,
          });

          console.log({
            data: {
              number_recipient,
              number_sender,
              message,
              status: "sent",
              client_id,
            }
          })

          socket.send(JSON.stringify({
            event: "message_sent",
            data: {
              number_recipient,
              number_sender,
              message,
              status: "sent",
              client_id,
            }
          }));

        } catch (error) {
          console.error("Erro global ao enviar mensagem:", error);

          socket.send(JSON.stringify({
            event: "message_error",
            data: { error: "Erro global ao enviar mensagem" }
          }));
        }
        
      }
    } catch (err) {
      console.error("Erro ao processar mensagem WebSocket:", err);
      socket.send(JSON.stringify({
        event: "message_error",
        data: { error: "Formato de mensagem inválido" }
      }));
    }
  });
}

export async function getMessages(socket: WebSocket) {
  try {
    const messages = await db('messages')
      .leftJoin('clients', 'messages.client_id', 'clients.id')
      .select(
        'messages.*',
        'clients.name as client_name',
        'clients.phone as client_phone',
        'clients.picture as client_picture'
      );

    socket.send(JSON.stringify({
      event: "messages_list",
      data: {
        messages
      }
    }));
  } catch (error) {
    console.error('Erro ao buscar mensagens:', error);
    socket.send(JSON.stringify({ error: 'Erro ao buscar mensagens' }));
  }
}
