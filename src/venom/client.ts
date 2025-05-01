import { create, CreateConfig, Whatsapp } from "venom-bot";
import { handleMessage } from "../utils/dinamicFlow";
import { createSession } from "../utils/sessionManager";
import knex from "knex";
import knexConfig from "../../knexfile";
import { Result } from "../types/Venom";
import { broadcastMessage } from "../utils/broadcast";

const db = knex(knexConfig.development);

let qrCodeImage = "";
let me = "";
let client: Whatsapp;
const config: CreateConfig = {
  headless: "new",
  browserArgs: [
    "--no-sandbox",
    "--disable-setuid-sandbox",
    "--disable-dev-shm-usage",
  ],
  folderNameToken: "tokens",
  disableWelcome: true,
};

async function startBot() {
  return await create(
    "venom-bot-api",
    (base64Qrimg) => {
      console.log("⚡ QR Code gerado! Acesse /api/v1/qrcode para visualizar.");
      qrCodeImage = base64Qrimg;
    },
    (statusSession, session) => {
      if (statusSession === "isLogged") {
        console.log("🔑 Sessão iniciada com sucesso!");
      }
    },
    config
  )
    .then(async (venomClient) => {
      client = venomClient;
      console.log("✅ Venom-Bot iniciado!");

      const hostDevice: any = await client.getHostDevice();
      me = hostDevice.id.user;
      console.log("📲 Número do remetente:", me);

      venomClient.onMessage(async (message) => {
        console.log("📩 Mensagem recebida:", message.body);
        const clientName = message.sender.name || message.sender.pushname;
        const clientPicture = message.sender.profilePicThumbObj.eurl;
        const clientNumber = message.sender.id;
        const clientMessage = message.body;

        let newClient = await db("clients")
          .where({ phone: clientNumber.replace("@c.us", "") })
          .first();
        if (!newClient) {
          const clientId = await db("clients")
            .insert({
              phone: clientNumber.replace("@c.us", ""),
              name: clientName,
              picture: clientPicture,
            })
            .returning("id")
            .then((ids) => ids[0]);

          newClient = clientId;
        }

        createSession(message.from);

        await db("messages").insert({
          number_recipient: me,
          number_sender: message.from,
          message: clientMessage,
          status: "sent",
          client_id: newClient.id,
        });

        await handleMessage(message, client, message.from, me, newClient.id);
        const data = {
          data: {
            number: message.from,
            message: clientMessage,
            client_id: newClient.id,
          },
        }
        broadcastMessage("send_message", data);
      });
    })
    .catch((error) => {
      console.error("❌ Erro ao iniciar o bot:", error);
    });
}

startBot();

export default {
  getQrCode: () => qrCodeImage,
  sendMessage: async (number: string, message: any): Promise<Result> => {
    if (!client) throw new Error("Bot não está pronto");

    return await client.sendText(`${number}@c.us`, message) as Result;
  },
  getSenderNumber: () => me,
};
