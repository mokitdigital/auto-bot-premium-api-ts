import knex from "knex";
import knexConfig from "../../knexfile";
import {
  updateSessionStep,
  getSession,
  resetSession,
} from "./sessionManager";

const db = knex(knexConfig.development);

function getEmojiNumber(option: string) {
  const emojiMap: { [key: string]: string } = {
    1: "1️⃣",
    2: "2️⃣",
    3: "3️⃣",
    4: "4️⃣",
    5: "5️⃣",
    6: "6️⃣",
    7: "7️⃣",
    8: "8️⃣",
    9: "9️⃣",
  };

  return emojiMap[option];
}

export const getFlowStep = async (step: any) => {
  return await db("flows").where({ step }).first();
};

export const handleMessage = async (
  message: any,
  client: any,
  senderNumber: string,
  me: string,
  clientId: number
) => {
  const session = getSession(senderNumber);
  const step = session?.step;
  const flowStep = await getFlowStep(step);
  const response = message.body.trim();
  const clientData = await db("clients")
    .where({ phone: senderNumber.replace("@c.us", "") })
    .first();

  if (clientData?.handled_by_human) {
    console.log(
      `🤖 Cliente ${senderNumber} já foi atendido. Ignorando mensagem automática.`
    );
    return;
  }

  if (!flowStep) {
    const text = "Desculpe, não entendi. Vamos comenzar de novo?";
    await client.sendText(message.from, text);
    console.log("Area 1");

    await db("messages").insert({
      number_recipient: senderNumber,
      number_sender: me,
      message,
      status: "sent",
      client_id: clientId,
    });

    resetSession(senderNumber);
    return;
  }

  if (step === 1 && !flowStep.options[response]) {
    const messageWithOptions = flowStep?.options ? `${flowStep?.message}\n\n${Object.entries(flowStep?.options as { [key: string]: { text: string } })
      .map(([key, option]) => `${getEmojiNumber(key)} - ${option.text}`)
      .join("\n")}` : flowStep.message;
    const messageSend = await client.sendText(message.from, messageWithOptions);
    console.log("Area 2");

    await db("messages").insert({
      number_recipient: senderNumber,
      number_sender: me,
      message: flowStep.message,
      status: "sent",
      message_error: messageSend,
      client_id: clientId,
    });
    return;
  }

  if (flowStep?.options) {
    const options = flowStep.options;
    if (options[response]) {
      updateSessionStep(senderNumber, options[response].next_step);
      const messageSend = await client.sendText(
        message.from,
        await getFlowStep(options[response].next_step).then((f) => {
          if (!f) {
            return "Desculpe, nao entendi. Vamos começar de novo?";
          }

          if (!f?.options) {
            return f?.message;
          }

          return `${f?.message}\n\n${Object.entries(f?.options as { [key: string]: { text: string } })
            .map(([key, option]) => `${getEmojiNumber(key)} - ${option.text}`)
            .join("\n")}`;
        })
      );
      console.log("Area 3");

      await db("messages").insert({
        number_recipient: senderNumber,
        number_sender: me,
        message: await getFlowStep(options[response].next_step).then(
          (f) => f?.message
        ),
        status: "sent",
        message_error: messageSend,
        client_id: clientId,
      });
    } else {
      const text = "Opção inválida. Escolha uma das opções disponíveis.";
      const messageSend = await client.sendText(message.from, text);
      console.log("Area 4");

      await db("messages").insert({
        number_recipient: senderNumber,
        number_sender: me,
        message,
        status: "sent",
        message_error: messageSend,
        client_id: clientId,
      });
    }
  } else if (flowStep.next_step) {
    updateSessionStep(senderNumber, flowStep.next_step);
    const messageSend = await client.sendText(
      message.from,
      await getFlowStep(flowStep.next_step).then((f) => f.message)
    );
    console.log("Area 5");

    await db("messages").insert({
      number_recipient: senderNumber,
      number_sender: me,
      message: await getFlowStep(flowStep.next_step).then((f) => f.message),
      status: "sent",
      message_error: messageSend,
      client_id: clientId,
    });

    await db("clients")
      .where({ phone: senderNumber.replace("@c.us", "") })
      .update({ handled_by_human: true });
  } else {
    const text = await client.sendText(message.from, flowStep.message);
    console.log("Area 6");

    await db("messages").insert({
      number_recipient: senderNumber,
      number_sender: me,
      message: flowStep.message,
      status: "sent",
      message_error: text,
      client_id: clientId,
    });

    await db("clients")
      .where({ phone: senderNumber.replace("@c.us", "") })
      .update({ handled_by_human: true });
    resetSession(senderNumber);
  }
};
